import express from "express";
import {
  AddNotificationError,
  AllNotificationsCleared,
  CommandFailure,
  CommandSuccess,
  InvalidCommand,
  Notification,
  NotificationAdded,
  NotificationCommand,
  NotificationCommandResult,
  NotificationCommandResultTag,
  NotificationCommandTag,
  NotificationNotAdded,
  NotificationNotRemoved,
  NotificationRemoved,
  Notifications,
  NotificationsCleared,
  RemoveNotificationError,
  RemoveNotificationResult,
  validateNotificationCommand,
} from "./notifications";
import { Either, Left, Right, EitherTag } from "./utilities";

// Map from user id to list of notifications
const notifications = new Map<number, Notification[]>();
let notificationId = 0;

const application = express();
application.use(express.json());

// Take in a `NotificationCommand` and act on it, responding accordingly with a
// a `NotificationCommandResult`
application.post("/notification", (request: express.Request, response: express.Response) => {
  console.log("Received body:", request.body);
  const maybeCommand = validateNotificationCommand(request.body);
  if (!maybeCommand.valid) {
    const errorString =
      typeof maybeCommand.errors === "string"
        ? maybeCommand.errors
        : JSON.stringify(maybeCommand.errors);

    return response.status(400).send(CommandFailure(InvalidCommand(errorString)));
  }

  const commandResult = executeCommand(maybeCommand.value);
  console.log("Sending: ", JSON.stringify(commandResult, null, 2));
  const statusCode = commandResult.type === NotificationCommandResultTag.CommandFailure ? 400 : 200;
  response.status(statusCode).send(commandResult);
});

function executeCommand(command: NotificationCommand): NotificationCommandResult {
  switch (command.type) {
    case NotificationCommandTag.ClearAllNotifications: {
      notifications.clear();
      return CommandSuccess(AllNotificationsCleared());
    }

    case NotificationCommandTag.ClearNotifications: {
      const userId = command.data;
      notifications.set(userId, []);
      return CommandSuccess(NotificationsCleared(userId));
    }

    case NotificationCommandTag.RemoveNotification: {
      const userId = command.data.userId;
      const notificationId = command.data.id;
      const removeResult = removeNotificationById(userId, notificationId);
      switch (removeResult.type) {
        case EitherTag.Right: {
          return CommandSuccess(NotificationRemoved(removeResult.data));
        }

        case EitherTag.Left: {
          return CommandFailure(NotificationNotRemoved(removeResult.data));
        }

        default:
          return assertUnreachable(removeResult);
      }
    }

    case NotificationCommandTag.NotifyUser: {
      const userId = command.data.id;
      const message = command.data.message;
      const notification = { id: notificationId++, message, seen: false };
      const addResult = addNotification(userId, notification);
      switch (addResult.type) {
        case EitherTag.Right: {
          return CommandSuccess(NotificationAdded(command.data));
        }

        case EitherTag.Left: {
          return CommandFailure(NotificationNotAdded(addResult.data));
        }

        default:
          return assertUnreachable(addResult);
      }
    }

    case NotificationCommandTag.GetNotifications: {
      const userId = command.data;
      const userNotifications = notifications?.get(userId) ?? [];

      return CommandSuccess(Notifications(userNotifications));
    }

    default:
      return assertUnreachable(command);
  }
}

function addNotification(
  userId: number,
  notification: Notification
): Either<AddNotificationError, number> {
  if (!notifications.has(userId)) {
    notifications.set(userId, []);
  }
  const maybePushed = notifications?.get(userId)?.push(notification);

  return maybePushed !== undefined
    ? Right(userId)
    : Left({ userId, notification, error: "Could not add notification" });
}

function removeNotificationById(
  userId: number,
  id: number
): Either<RemoveNotificationError, RemoveNotificationResult> {
  const userNotifications = notifications.get(userId);
  if (userNotifications === undefined) {
    return Left({ userId, notificationId: id, error: "No notifications for user" });
  }

  const index = userNotifications?.findIndex((n) => n.id === id);
  if (index === undefined) {
    return Left({ userId, notificationId: id, error: "Notification not found" });
  }

  const removedNotification = userNotifications.splice(index, 1)[0];
  const remainingNotifications = userNotifications;

  return Right({ remainingNotifications, removedNotification });
}

function assertUnreachable(value: never): never {
  throw new Error(`Unreachable value reached: ${value}`);
}

application.listen(8080, "localhost", () => {
  console.log("Listening on localhost:8080");
});
