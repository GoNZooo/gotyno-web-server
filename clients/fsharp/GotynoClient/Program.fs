// Learn more about F# at http://docs.microsoft.com/dotnet/fsharp

open Notifications
open FsHttp
open FsHttp.DslCE
open Thoth.Json.Net
open Utilities
open System

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
    | Ok (CommandSuccess success) -> successAccessor success
    | Ok (CommandFailure e)  -> failwith (e.ToString())
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
        executeCommand (NotifyUser {Id = 0u; Message = "Hello"; Expiration = Nothing})
          (function
          | NotificationAdded n -> n
          | r -> failwith ("Unexpected response: " + r.ToString()))
    assert (addedNotification.UserId = 0u)
    assert (addedNotification.Notification.Message = "Hello")

    let notificationsForUserZero =
        executeCommand (GetNotifications 0u)
          (function
          | Notifications notifications -> notifications
          | r -> failwith ("Unexpected response: " + r.ToString()))
    assert (notificationsForUserZero.Length = 1)
    assert (notificationsForUserZero.[0].Message = "Hello")
    assert (not notificationsForUserZero.[0].Seen)

    let oneToFive = seq {1..5}
    let soon = uint64((DateTime.UtcNow + TimeSpan.FromSeconds (10.0)).Ticks)
    let notificationsToAdd =
          oneToFive
          |> Seq.map (fun i ->
            {Id = 0u; Message = sprintf "Hello %d" i; Expiration = Just soon}
          )
          |> Seq.toList
    executeCommand ClearAllNotifications
      (function
      | AllNotificationsCleared -> ()
      | r -> failwith ("Unexpected response: " + r.ToString()))
    let idsToRemove =
      List.map (fun n ->
                  executeCommand (NotifyUser n)
                    (function
                    | NotificationAdded {Notification = {Id = id}} -> id
                    | r -> failwith ("Unexpected response: " + r.ToString()))
               )
               notificationsToAdd

    let notificationsForUserZero =
        executeCommand (GetNotifications 0u)
          (function
          | Notifications notifications -> notifications
          | r -> failwith ("Unexpected response: " + r.ToString()))
    assert (notificationsForUserZero.Length = 5)
    assert (
      List.forall ( fun n ->
        match n.Expiration with
        | Just expiration -> expiration = soon
        | _ -> failwith "Expected expiration to be `Just`"
      )
                  notificationsForUserZero
    )

    for id in idsToRemove do
        executeCommand (RemoveNotification {UserId = 0u; Id = id})
          (function
          | NotificationRemoved {RemovedNotification = {Id = removedId}} when removedId = id -> ()
          | NotificationRemoved _ -> failwith "Removed ID does not match given Id"
          | r -> failwith ("Unexpected response: " + r.ToString()))

    let notificationsForUserZero =
        executeCommand (GetNotifications 0u)
          (function
          | Notifications notifications -> notifications
          | r -> failwith ("Unexpected response: " + r.ToString()))
    assert notificationsForUserZero.IsEmpty

    0 // return an integer exit code
