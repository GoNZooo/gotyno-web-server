from datetime import datetime, timedelta
from . import utilities
from typing import List, Type, TypeVar, cast
from . import notifications
from gotyno_validation import validation as v
import requests


class ValidationError(Exception):
    error: v.Invalid


def execute_request(command: notifications.NotificationCommand) -> notifications.NotificationCommandResult:
    http_response = requests.post(
        'http://localhost:8080/notification',
        headers={'Content-Type': 'application/json'},
        data=command.encode())

    # Validate the HTTP response as a `NotificationCommandResult`
    validation_result = notifications.NotificationCommandResult.validate(
        http_response.json())
    if not isinstance(validation_result, v.Valid):
        raise ValidationError(validation_result)

    return validation_result.value


T = TypeVar('T')


def assert_successful(result: notifications.NotificationCommandResult, class_name: Type[T]) -> T:
    if isinstance(result, notifications.CommandSuccess) and isinstance(result.data, class_name):
        return cast(class_name, result.data)
    elif isinstance(result, notifications.CommandSuccess):
        raise AssertionError(
            f"Got successful response but not one matching {class_name}: {result.data}")
    else:
        raise AssertionError(
            f"Got failure result when expecting success: {result}")


def test():
    clear_all_result = execute_request(notifications.ClearAllNotifications())
    assert_successful(clear_all_result, notifications.AllNotificationsCleared)

    notifications_for_user_zero = execute_request(
        notifications.GetNotifications(0))
    assert_successful(notifications_for_user_zero, notifications.Notifications)
    assert notifications_for_user_zero.data.data == []

    notify_user = notifications.NotifyUser(
        notifications.NotifyUserPayload(0, "Hello!", utilities.Nothing()))
    add_result = execute_request(notify_user)
    added = assert_successful(add_result, notifications.NotificationAdded)
    assert added.data.userId == 0
    assert added.data.notification.message == "Hello!"
    assert added.data.notification.seen == False

    notifications_for_user_zero = execute_request(
        notifications.GetNotifications(0))
    assert_successful(notifications_for_user_zero, notifications.Notifications)
    assert len(notifications_for_user_zero.data.data) == 1
    assert notifications_for_user_zero.data.data[0].message == "Hello!"
    assert notifications_for_user_zero.data.data[0].seen == False

    notifications_to_add: List[notifications.NotifyUserPayload] = []
    soon = int((datetime.utcnow() + timedelta(seconds=10)
                ).timestamp() * 1_000_000)
    for i in range(1, 5):
        notifications_to_add.append(
            notifications.NotifyUserPayload(0, f"Hello: {i}!", utilities.Just(soon)))

    for notification in notifications_to_add:
        add_result = execute_request(notifications.NotifyUser(notification))
        add_result = assert_successful(
            add_result, notifications.NotificationAdded)
        assert add_result.data.userId == notification.id
        assert add_result.data.notification.message == notification.message
        assert add_result.data.notification.expiration == utilities.Just(soon)

    clear_for_user_zero = execute_request(notifications.ClearNotifications(0))
    assert_successful(clear_for_user_zero, notifications.NotificationsCleared)

    notifications_for_user_zero = execute_request(
        notifications.GetNotifications(0))
    assert_successful(notifications_for_user_zero, notifications.Notifications)
    assert notifications_for_user_zero.data.data == []

    ids_to_remove = []
    for notification in notifications_to_add:
        add_result = execute_request(notifications.NotifyUser(notification))
        add_result = assert_successful(
            add_result, notifications.NotificationAdded)
        assert add_result.data.userId == notification.id
        assert add_result.data.notification.message == notification.message

    for i, id_to_remove in enumerate(ids_to_remove):
        remove_result = execute_request(notifications.RemoveNotification(
            notifications.RemoveNotificationPayload(0, id_to_remove)))
        remove_result = assert_successful(
            remove_result, notifications.NotificationRemoved)
        assert len(remove_result.data.remainingNotifications) == len(
            ids_to_remove) - (i + 1)
        assert remove_result.data.removedNotification.id == notifications_to_add[i].id
        assert remove_result.data.removedNotification.message == notifications_to_add[
            i].message


if __name__ == "__main__":
    test()
