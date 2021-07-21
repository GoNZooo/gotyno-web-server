from typing import ClassVar, List, Type, TypeVar, cast
from .notifications import (
    AllNotificationsCleared, ClearAllNotifications, ClearNotifications, CommandSuccess, GetNotifications, Notification, NotificationAdded, NotificationCommand, NotificationCommandResult, NotificationCommandSuccess, NotificationRemoved, Notifications, NotificationsCleared, NotifyUser, NotifyUserPayload, RemoveNotification, RemoveNotificationPayload)
from gotyno_validation import validation as v
import requests


class ValidationError(Exception):
    error: v.Invalid


def execute_request(command: NotificationCommand) -> NotificationCommandResult:
    http_response = requests.post(
        'http://localhost:8080/notification',
        headers={'Content-Type': 'application/json'},
        data=command.encode())

    # Validate the HTTP response as a `NotificationCommandResult`
    validation_result = NotificationCommandResult.validate(
        http_response.json())
    if not isinstance(validation_result, v.Valid):
        raise ValidationError(validation_result)

    return validation_result.value


T = TypeVar('T')


def assert_successful(result: NotificationCommandResult, class_name: Type[T]) -> T:
    if isinstance(result, CommandSuccess) and isinstance(result.data, class_name):
        return cast(class_name, result.data)
    elif isinstance(result, CommandSuccess):
        raise AssertionError(
            f"Got successful response but not one matching {class_name}: {result.data}")
    else:
        raise AssertionError(
            f"Got failure result when expecting success: {result}")


def test():
    clear_all_result = execute_request(ClearAllNotifications())
    assert_successful(clear_all_result, AllNotificationsCleared)

    notifications_for_user_zero = execute_request(GetNotifications(0))
    assert_successful(notifications_for_user_zero, Notifications)
    assert notifications_for_user_zero.data.data == []

    notify_user = NotifyUser(NotifyUserPayload(0, "Hello!"))
    add_result = execute_request(notify_user)
    assert_successful(add_result, NotificationAdded)
    assert add_result.data.data == NotifyUserPayload(0, "Hello!")

    notifications_for_user_zero = execute_request(GetNotifications(0))
    assert_successful(notifications_for_user_zero, Notifications)
    assert len(notifications_for_user_zero.data.data) == 1
    assert notifications_for_user_zero.data.data[0].message == "Hello!"
    assert notifications_for_user_zero.data.data[0].seen == False

    notifications_to_add: List[NotifyUserPayload] = []
    for i in range(1, 5):
        notifications_to_add.append(NotifyUserPayload(0, f"Hello: {i}!"))

    for notification in notifications_to_add:
        add_result = execute_request(NotifyUser(notification))
        add_result = assert_successful(add_result, NotificationAdded)
        assert add_result.data == notification

    clear_for_user_zero = execute_request(ClearNotifications(0))
    assert_successful(clear_for_user_zero, NotificationsCleared)

    notifications_for_user_zero = execute_request(GetNotifications(0))
    assert_successful(notifications_for_user_zero, Notifications)
    assert notifications_for_user_zero.data.data == []

    ids_to_remove = []
    for notification in notifications_to_add:
        add_result = execute_request(NotifyUser(notification))
        add_result = assert_successful(add_result, NotificationAdded)
        assert add_result.data == notification

    for i, id_to_remove in enumerate(ids_to_remove):
        remove_result = execute_request(RemoveNotification(
            RemoveNotificationPayload(0, id_to_remove)))
        remove_result = assert_successful(remove_result, NotificationRemoved)
        assert len(remove_result.data.remainingNotifications) == len(
            ids_to_remove) - (i + 1)
        assert remove_result.data.removedNotification.id == notifications_to_add[i].id
        assert remove_result.data.removedNotification.message == notifications_to_add[
            i].message


if __name__ == "__main__":
    print(execute_request(GetNotifications(0)))
