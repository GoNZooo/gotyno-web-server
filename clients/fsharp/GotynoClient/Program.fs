// Learn more about F# at http://docs.microsoft.com/dotnet/fsharp

open Notifications
open FsHttp
open FsHttp.DslCE
open Thoth.Json.Net

let url = "http://localhost:8080/notification"

let executeCommand command successAccessor =
    let encodedCommand = Encode.toString 2 (NotificationCommand.Encoder command)

    let response =
        http {
            POST url
            body
            json encodedCommand
        }
        |> Response.toString 4096
        |> Decode.fromString NotificationCommandResult.Decoder 

    match response with
    | Ok(CommandSuccess(r)) -> successAccessor r
    | Ok(CommandFailure(e)) -> failwith (e.ToString())
    | Error e -> failwith e


[<EntryPoint>]
let main argv =
    executeCommand ClearAllNotifications
      (function
      | AllNotificationsCleared -> ()
      | r -> failwith ("Unexpected response: " + r.ToString())
      )
    let notificationsForUserZero =
        executeCommand (GetNotifications 0u)
          (function
          | Notifications notifications -> notifications
          | r -> failwith ("Unexpected response: " + r.ToString()))
    assert notificationsForUserZero.IsEmpty

    let addedNotification =
        executeCommand (NotifyUser {id = 0u; message = "Hello"})
          (function
          | NotificationAdded n -> n
          | r -> failwith ("Unexpected response: " + r.ToString()))
    assert (addedNotification.userId = 0u)
    assert (addedNotification.notification.message = "Hello")

    let notificationsForUserZero =
        executeCommand (GetNotifications 0u)
          (function
          | Notifications notifications -> notifications
          | r -> failwith ("Unexpected response: " + r.ToString()))
    assert (notificationsForUserZero.Length = 1)
    assert (notificationsForUserZero.[0].message = "Hello")
    assert (not notificationsForUserZero.[0].seen)

    let oneToFive = seq {1..5}
    let notificationsToAdd =
          oneToFive |> Seq.map (fun i -> {id = 0u; message = sprintf "Hello %d" i}) |> Seq.toList
    executeCommand ClearAllNotifications
      (function
      | AllNotificationsCleared -> ()
      | r -> failwith ("Unexpected response: " + r.ToString()))
    let idsToRemove =
      List.map (fun n ->
                  executeCommand (NotifyUser n)
                    (function
                    | NotificationAdded {notification = {id = id}} -> id
                    | r -> failwith ("Unexpected response: " + r.ToString()))
               )
               notificationsToAdd

    let notificationsForUserZero =
        executeCommand (GetNotifications 0u)
          (function
          | Notifications notifications -> notifications
          | r -> failwith ("Unexpected response: " + r.ToString()))
    assert (notificationsForUserZero.Length = 5)

    for id in idsToRemove do
        executeCommand (RemoveNotification {userId = 0u; id = id})
          (function
          | NotificationRemoved {removedNotification = {id = removedId}} when removedId = id -> ()
          | NotificationRemoved _ -> failwith "Removed ID does not match given Id"
          | r -> failwith ("Unexpected response: " + r.ToString()))

    let notificationsForUserZero =
        executeCommand (GetNotifications 0u)
          (function
          | Notifications notifications -> notifications
          | r -> failwith ("Unexpected response: " + r.ToString()))
    assert (notificationsForUserZero.IsEmpty)

    0 // return an integer exit code
