module Notifications

open Thoth.Json.Net

type NotifyUserPayload =
    {
        id: uint32
        message: string
    }

    static member Decoder: Decoder<NotifyUserPayload> =
        Decode.object (fun get ->
            {
                id = get.Required.Field "id" Decode.uint32
                message = get.Required.Field "message" Decode.string
            }
        )

    static member Encoder value =
        Encode.object
            [
                "id", Encode.uint32 value.id
                "message", Encode.string value.message
            ]

type Notification =
    {
        id: uint32
        message: string
        seen: bool
    }

    static member Decoder: Decoder<Notification> =
        Decode.object (fun get ->
            {
                id = get.Required.Field "id" Decode.uint32
                message = get.Required.Field "message" Decode.string
                seen = get.Required.Field "seen" Decode.bool
            }
        )

    static member Encoder value =
        Encode.object
            [
                "id", Encode.uint32 value.id
                "message", Encode.string value.message
                "seen", Encode.bool value.seen
            ]

type NotificationAddedPayload =
    {
        userId: uint32
        notification: Notification
    }

    static member Decoder: Decoder<NotificationAddedPayload> =
        Decode.object (fun get ->
            {
                userId = get.Required.Field "userId" Decode.uint32
                notification = get.Required.Field "notification" Notification.Decoder
            }
        )

    static member Encoder value =
        Encode.object
            [
                "userId", Encode.uint32 value.userId
                "notification", Notification.Encoder value.notification
            ]

type AddNotificationError =
    {
        userId: uint32
        notification: Notification
        error: string
    }

    static member Decoder: Decoder<AddNotificationError> =
        Decode.object (fun get ->
            {
                userId = get.Required.Field "userId" Decode.uint32
                notification = get.Required.Field "notification" Notification.Decoder
                error = get.Required.Field "error" Decode.string
            }
        )

    static member Encoder value =
        Encode.object
            [
                "userId", Encode.uint32 value.userId
                "notification", Notification.Encoder value.notification
                "error", Encode.string value.error
            ]

type RemoveNotificationError =
    {
        userId: uint32
        notificationId: uint32
        error: string
    }

    static member Decoder: Decoder<RemoveNotificationError> =
        Decode.object (fun get ->
            {
                userId = get.Required.Field "userId" Decode.uint32
                notificationId = get.Required.Field "notificationId" Decode.uint32
                error = get.Required.Field "error" Decode.string
            }
        )

    static member Encoder value =
        Encode.object
            [
                "userId", Encode.uint32 value.userId
                "notificationId", Encode.uint32 value.notificationId
                "error", Encode.string value.error
            ]

type RemoveNotificationResult =
    {
        remainingNotifications: list<Notification>
        removedNotification: Notification
    }

    static member Decoder: Decoder<RemoveNotificationResult> =
        Decode.object (fun get ->
            {
                remainingNotifications = get.Required.Field "remainingNotifications" (Decode.list Notification.Decoder)
                removedNotification = get.Required.Field "removedNotification" Notification.Decoder
            }
        )

    static member Encoder value =
        Encode.object
            [
                "remainingNotifications", GotynoCoders.encodeList Notification.Encoder value.remainingNotifications
                "removedNotification", Notification.Encoder value.removedNotification
            ]

type RemoveNotificationPayload =
    {
        userId: uint32
        id: uint32
    }

    static member Decoder: Decoder<RemoveNotificationPayload> =
        Decode.object (fun get ->
            {
                userId = get.Required.Field "userId" Decode.uint32
                id = get.Required.Field "id" Decode.uint32
            }
        )

    static member Encoder value =
        Encode.object
            [
                "userId", Encode.uint32 value.userId
                "id", Encode.uint32 value.id
            ]

type NotificationCommand =
    | GetNotifications of uint32
    | NotifyUser of NotifyUserPayload
    | RemoveNotification of RemoveNotificationPayload
    | ClearNotifications of uint32
    | ClearAllNotifications

    static member GetNotificationsDecoder: Decoder<NotificationCommand> =
        Decode.object (fun get -> GetNotifications(get.Required.Field "data" Decode.uint32))

    static member NotifyUserDecoder: Decoder<NotificationCommand> =
        Decode.object (fun get -> NotifyUser(get.Required.Field "data" NotifyUserPayload.Decoder))

    static member RemoveNotificationDecoder: Decoder<NotificationCommand> =
        Decode.object (fun get -> RemoveNotification(get.Required.Field "data" RemoveNotificationPayload.Decoder))

    static member ClearNotificationsDecoder: Decoder<NotificationCommand> =
        Decode.object (fun get -> ClearNotifications(get.Required.Field "data" Decode.uint32))

    static member ClearAllNotificationsDecoder: Decoder<NotificationCommand> =
        Decode.succeed ClearAllNotifications

    static member Decoder: Decoder<NotificationCommand> =
        GotynoCoders.decodeWithTypeTag
            "type"
            [|
                "GetNotifications", NotificationCommand.GetNotificationsDecoder
                "NotifyUser", NotificationCommand.NotifyUserDecoder
                "RemoveNotification", NotificationCommand.RemoveNotificationDecoder
                "ClearNotifications", NotificationCommand.ClearNotificationsDecoder
                "ClearAllNotifications", NotificationCommand.ClearAllNotificationsDecoder
            |]

    static member Encoder =
        function
        | GetNotifications payload ->
            Encode.object [ "type", Encode.string "GetNotifications"
                            "data", Encode.uint32 payload ]

        | NotifyUser payload ->
            Encode.object [ "type", Encode.string "NotifyUser"
                            "data", NotifyUserPayload.Encoder payload ]

        | RemoveNotification payload ->
            Encode.object [ "type", Encode.string "RemoveNotification"
                            "data", RemoveNotificationPayload.Encoder payload ]

        | ClearNotifications payload ->
            Encode.object [ "type", Encode.string "ClearNotifications"
                            "data", Encode.uint32 payload ]

        | ClearAllNotifications ->
            Encode.object [ "type", Encode.string "ClearAllNotifications" ]

type NotificationCommandSuccess =
    | Notifications of list<Notification>
    | NotificationAdded of NotificationAddedPayload
    | NotificationRemoved of RemoveNotificationResult
    | NotificationsCleared of uint32
    | AllNotificationsCleared

    static member NotificationsDecoder: Decoder<NotificationCommandSuccess> =
        Decode.object (fun get -> Notifications(get.Required.Field "data" (Decode.list Notification.Decoder)))

    static member NotificationAddedDecoder: Decoder<NotificationCommandSuccess> =
        Decode.object (fun get -> NotificationAdded(get.Required.Field "data" NotificationAddedPayload.Decoder))

    static member NotificationRemovedDecoder: Decoder<NotificationCommandSuccess> =
        Decode.object (fun get -> NotificationRemoved(get.Required.Field "data" RemoveNotificationResult.Decoder))

    static member NotificationsClearedDecoder: Decoder<NotificationCommandSuccess> =
        Decode.object (fun get -> NotificationsCleared(get.Required.Field "data" Decode.uint32))

    static member AllNotificationsClearedDecoder: Decoder<NotificationCommandSuccess> =
        Decode.succeed AllNotificationsCleared

    static member Decoder: Decoder<NotificationCommandSuccess> =
        GotynoCoders.decodeWithTypeTag
            "type"
            [|
                "Notifications", NotificationCommandSuccess.NotificationsDecoder
                "NotificationAdded", NotificationCommandSuccess.NotificationAddedDecoder
                "NotificationRemoved", NotificationCommandSuccess.NotificationRemovedDecoder
                "NotificationsCleared", NotificationCommandSuccess.NotificationsClearedDecoder
                "AllNotificationsCleared", NotificationCommandSuccess.AllNotificationsClearedDecoder
            |]

    static member Encoder =
        function
        | Notifications payload ->
            Encode.object [ "type", Encode.string "Notifications"
                            "data", GotynoCoders.encodeList Notification.Encoder payload ]

        | NotificationAdded payload ->
            Encode.object [ "type", Encode.string "NotificationAdded"
                            "data", NotificationAddedPayload.Encoder payload ]

        | NotificationRemoved payload ->
            Encode.object [ "type", Encode.string "NotificationRemoved"
                            "data", RemoveNotificationResult.Encoder payload ]

        | NotificationsCleared payload ->
            Encode.object [ "type", Encode.string "NotificationsCleared"
                            "data", Encode.uint32 payload ]

        | AllNotificationsCleared ->
            Encode.object [ "type", Encode.string "AllNotificationsCleared" ]

type NotificationCommandFailure =
    | NotificationNotRemoved of RemoveNotificationError
    | NotificationNotAdded of AddNotificationError
    | InvalidCommand of string

    static member NotificationNotRemovedDecoder: Decoder<NotificationCommandFailure> =
        Decode.object (fun get -> NotificationNotRemoved(get.Required.Field "data" RemoveNotificationError.Decoder))

    static member NotificationNotAddedDecoder: Decoder<NotificationCommandFailure> =
        Decode.object (fun get -> NotificationNotAdded(get.Required.Field "data" AddNotificationError.Decoder))

    static member InvalidCommandDecoder: Decoder<NotificationCommandFailure> =
        Decode.object (fun get -> InvalidCommand(get.Required.Field "data" Decode.string))

    static member Decoder: Decoder<NotificationCommandFailure> =
        GotynoCoders.decodeWithTypeTag
            "type"
            [|
                "NotificationNotRemoved", NotificationCommandFailure.NotificationNotRemovedDecoder
                "NotificationNotAdded", NotificationCommandFailure.NotificationNotAddedDecoder
                "InvalidCommand", NotificationCommandFailure.InvalidCommandDecoder
            |]

    static member Encoder =
        function
        | NotificationNotRemoved payload ->
            Encode.object [ "type", Encode.string "NotificationNotRemoved"
                            "data", RemoveNotificationError.Encoder payload ]

        | NotificationNotAdded payload ->
            Encode.object [ "type", Encode.string "NotificationNotAdded"
                            "data", AddNotificationError.Encoder payload ]

        | InvalidCommand payload ->
            Encode.object [ "type", Encode.string "InvalidCommand"
                            "data", Encode.string payload ]

type NotificationCommandResult =
    | CommandSuccess of NotificationCommandSuccess
    | CommandFailure of NotificationCommandFailure

    static member CommandSuccessDecoder: Decoder<NotificationCommandResult> =
        Decode.object (fun get -> CommandSuccess(get.Required.Field "data" NotificationCommandSuccess.Decoder))

    static member CommandFailureDecoder: Decoder<NotificationCommandResult> =
        Decode.object (fun get -> CommandFailure(get.Required.Field "data" NotificationCommandFailure.Decoder))

    static member Decoder: Decoder<NotificationCommandResult> =
        GotynoCoders.decodeWithTypeTag
            "type"
            [|
                "CommandSuccess", NotificationCommandResult.CommandSuccessDecoder
                "CommandFailure", NotificationCommandResult.CommandFailureDecoder
            |]

    static member Encoder =
        function
        | CommandSuccess payload ->
            Encode.object [ "type", Encode.string "CommandSuccess"
                            "data", NotificationCommandSuccess.Encoder payload ]

        | CommandFailure payload ->
            Encode.object [ "type", Encode.string "CommandFailure"
                            "data", NotificationCommandFailure.Encoder payload ]