import * as svt from "simple-validation-tools";

import * as utilities from "./utilities";

export type NotifyUserPayload = {
    id: number;
    message: string;
};

export function isNotifyUserPayload(value: unknown): value is NotifyUserPayload {
    return svt.isInterface<NotifyUserPayload>(value, {id: svt.isNumber, message: svt.isString});
}

export function validateNotifyUserPayload(value: unknown): svt.ValidationResult<NotifyUserPayload> {
    return svt.validate<NotifyUserPayload>(value, {id: svt.validateNumber, message: svt.validateString});
}

export type Notification = {
    id: number;
    message: string;
    seen: boolean;
};

export function isNotification(value: unknown): value is Notification {
    return svt.isInterface<Notification>(value, {id: svt.isNumber, message: svt.isString, seen: svt.isBoolean});
}

export function validateNotification(value: unknown): svt.ValidationResult<Notification> {
    return svt.validate<Notification>(value, {id: svt.validateNumber, message: svt.validateString, seen: svt.validateBoolean});
}

export type AddNotificationError = {
    userId: number;
    notification: Notification;
    error: string;
};

export function isAddNotificationError(value: unknown): value is AddNotificationError {
    return svt.isInterface<AddNotificationError>(value, {userId: svt.isNumber, notification: isNotification, error: svt.isString});
}

export function validateAddNotificationError(value: unknown): svt.ValidationResult<AddNotificationError> {
    return svt.validate<AddNotificationError>(value, {userId: svt.validateNumber, notification: validateNotification, error: svt.validateString});
}

export type RemoveNotificationError = {
    userId: number;
    notificationId: number;
    error: string;
};

export function isRemoveNotificationError(value: unknown): value is RemoveNotificationError {
    return svt.isInterface<RemoveNotificationError>(value, {userId: svt.isNumber, notificationId: svt.isNumber, error: svt.isString});
}

export function validateRemoveNotificationError(value: unknown): svt.ValidationResult<RemoveNotificationError> {
    return svt.validate<RemoveNotificationError>(value, {userId: svt.validateNumber, notificationId: svt.validateNumber, error: svt.validateString});
}

export type RemoveNotificationResult = {
    remainingNotifications: Notification[];
    removedNotification: Notification;
};

export function isRemoveNotificationResult(value: unknown): value is RemoveNotificationResult {
    return svt.isInterface<RemoveNotificationResult>(value, {remainingNotifications: svt.arrayOf(isNotification), removedNotification: isNotification});
}

export function validateRemoveNotificationResult(value: unknown): svt.ValidationResult<RemoveNotificationResult> {
    return svt.validate<RemoveNotificationResult>(value, {remainingNotifications: svt.validateArray(validateNotification), removedNotification: validateNotification});
}

export type RemoveNotificationPayload = {
    userId: number;
    id: number;
};

export function isRemoveNotificationPayload(value: unknown): value is RemoveNotificationPayload {
    return svt.isInterface<RemoveNotificationPayload>(value, {userId: svt.isNumber, id: svt.isNumber});
}

export function validateRemoveNotificationPayload(value: unknown): svt.ValidationResult<RemoveNotificationPayload> {
    return svt.validate<RemoveNotificationPayload>(value, {userId: svt.validateNumber, id: svt.validateNumber});
}

export type NotificationCommand = GetNotifications | NotifyUser | RemoveNotification | ClearNotifications | ClearAllNotifications;

export enum NotificationCommandTag {
    GetNotifications = "GetNotifications",
    NotifyUser = "NotifyUser",
    RemoveNotification = "RemoveNotification",
    ClearNotifications = "ClearNotifications",
    ClearAllNotifications = "ClearAllNotifications",
}

export type GetNotifications = {
    type: NotificationCommandTag.GetNotifications;
    data: number;
};

export type NotifyUser = {
    type: NotificationCommandTag.NotifyUser;
    data: NotifyUserPayload;
};

export type RemoveNotification = {
    type: NotificationCommandTag.RemoveNotification;
    data: RemoveNotificationPayload;
};

export type ClearNotifications = {
    type: NotificationCommandTag.ClearNotifications;
    data: number;
};

export type ClearAllNotifications = {
    type: NotificationCommandTag.ClearAllNotifications;
};

export function GetNotifications(data: number): GetNotifications {
    return {type: NotificationCommandTag.GetNotifications, data};
}

export function NotifyUser(data: NotifyUserPayload): NotifyUser {
    return {type: NotificationCommandTag.NotifyUser, data};
}

export function RemoveNotification(data: RemoveNotificationPayload): RemoveNotification {
    return {type: NotificationCommandTag.RemoveNotification, data};
}

export function ClearNotifications(data: number): ClearNotifications {
    return {type: NotificationCommandTag.ClearNotifications, data};
}

export function ClearAllNotifications(): ClearAllNotifications {
    return {type: NotificationCommandTag.ClearAllNotifications};
}

export function isNotificationCommand(value: unknown): value is NotificationCommand {
    return [isGetNotifications, isNotifyUser, isRemoveNotification, isClearNotifications, isClearAllNotifications].some((typePredicate) => typePredicate(value));
}

export function isGetNotifications(value: unknown): value is GetNotifications {
    return svt.isInterface<GetNotifications>(value, {type: NotificationCommandTag.GetNotifications, data: svt.isNumber});
}

export function isNotifyUser(value: unknown): value is NotifyUser {
    return svt.isInterface<NotifyUser>(value, {type: NotificationCommandTag.NotifyUser, data: isNotifyUserPayload});
}

export function isRemoveNotification(value: unknown): value is RemoveNotification {
    return svt.isInterface<RemoveNotification>(value, {type: NotificationCommandTag.RemoveNotification, data: isRemoveNotificationPayload});
}

export function isClearNotifications(value: unknown): value is ClearNotifications {
    return svt.isInterface<ClearNotifications>(value, {type: NotificationCommandTag.ClearNotifications, data: svt.isNumber});
}

export function isClearAllNotifications(value: unknown): value is ClearAllNotifications {
    return svt.isInterface<ClearAllNotifications>(value, {type: NotificationCommandTag.ClearAllNotifications});
}

export function validateNotificationCommand(value: unknown): svt.ValidationResult<NotificationCommand> {
    return svt.validateWithTypeTag<NotificationCommand>(value, {[NotificationCommandTag.GetNotifications]: validateGetNotifications, [NotificationCommandTag.NotifyUser]: validateNotifyUser, [NotificationCommandTag.RemoveNotification]: validateRemoveNotification, [NotificationCommandTag.ClearNotifications]: validateClearNotifications, [NotificationCommandTag.ClearAllNotifications]: validateClearAllNotifications}, "type");
}

export function validateGetNotifications(value: unknown): svt.ValidationResult<GetNotifications> {
    return svt.validate<GetNotifications>(value, {type: NotificationCommandTag.GetNotifications, data: svt.validateNumber});
}

export function validateNotifyUser(value: unknown): svt.ValidationResult<NotifyUser> {
    return svt.validate<NotifyUser>(value, {type: NotificationCommandTag.NotifyUser, data: validateNotifyUserPayload});
}

export function validateRemoveNotification(value: unknown): svt.ValidationResult<RemoveNotification> {
    return svt.validate<RemoveNotification>(value, {type: NotificationCommandTag.RemoveNotification, data: validateRemoveNotificationPayload});
}

export function validateClearNotifications(value: unknown): svt.ValidationResult<ClearNotifications> {
    return svt.validate<ClearNotifications>(value, {type: NotificationCommandTag.ClearNotifications, data: svt.validateNumber});
}

export function validateClearAllNotifications(value: unknown): svt.ValidationResult<ClearAllNotifications> {
    return svt.validate<ClearAllNotifications>(value, {type: NotificationCommandTag.ClearAllNotifications});
}

export type NotificationCommandSuccess = Notifications | NotificationAdded | NotificationRemoved | NotificationsCleared | AllNotificationsCleared;

export enum NotificationCommandSuccessTag {
    Notifications = "Notifications",
    NotificationAdded = "NotificationAdded",
    NotificationRemoved = "NotificationRemoved",
    NotificationsCleared = "NotificationsCleared",
    AllNotificationsCleared = "AllNotificationsCleared",
}

export type Notifications = {
    type: NotificationCommandSuccessTag.Notifications;
    data: Notification[];
};

export type NotificationAdded = {
    type: NotificationCommandSuccessTag.NotificationAdded;
    data: NotifyUserPayload;
};

export type NotificationRemoved = {
    type: NotificationCommandSuccessTag.NotificationRemoved;
    data: RemoveNotificationResult;
};

export type NotificationsCleared = {
    type: NotificationCommandSuccessTag.NotificationsCleared;
    data: number;
};

export type AllNotificationsCleared = {
    type: NotificationCommandSuccessTag.AllNotificationsCleared;
};

export function Notifications(data: Notification[]): Notifications {
    return {type: NotificationCommandSuccessTag.Notifications, data};
}

export function NotificationAdded(data: NotifyUserPayload): NotificationAdded {
    return {type: NotificationCommandSuccessTag.NotificationAdded, data};
}

export function NotificationRemoved(data: RemoveNotificationResult): NotificationRemoved {
    return {type: NotificationCommandSuccessTag.NotificationRemoved, data};
}

export function NotificationsCleared(data: number): NotificationsCleared {
    return {type: NotificationCommandSuccessTag.NotificationsCleared, data};
}

export function AllNotificationsCleared(): AllNotificationsCleared {
    return {type: NotificationCommandSuccessTag.AllNotificationsCleared};
}

export function isNotificationCommandSuccess(value: unknown): value is NotificationCommandSuccess {
    return [isNotifications, isNotificationAdded, isNotificationRemoved, isNotificationsCleared, isAllNotificationsCleared].some((typePredicate) => typePredicate(value));
}

export function isNotifications(value: unknown): value is Notifications {
    return svt.isInterface<Notifications>(value, {type: NotificationCommandSuccessTag.Notifications, data: svt.arrayOf(isNotification)});
}

export function isNotificationAdded(value: unknown): value is NotificationAdded {
    return svt.isInterface<NotificationAdded>(value, {type: NotificationCommandSuccessTag.NotificationAdded, data: isNotifyUserPayload});
}

export function isNotificationRemoved(value: unknown): value is NotificationRemoved {
    return svt.isInterface<NotificationRemoved>(value, {type: NotificationCommandSuccessTag.NotificationRemoved, data: isRemoveNotificationResult});
}

export function isNotificationsCleared(value: unknown): value is NotificationsCleared {
    return svt.isInterface<NotificationsCleared>(value, {type: NotificationCommandSuccessTag.NotificationsCleared, data: svt.isNumber});
}

export function isAllNotificationsCleared(value: unknown): value is AllNotificationsCleared {
    return svt.isInterface<AllNotificationsCleared>(value, {type: NotificationCommandSuccessTag.AllNotificationsCleared});
}

export function validateNotificationCommandSuccess(value: unknown): svt.ValidationResult<NotificationCommandSuccess> {
    return svt.validateWithTypeTag<NotificationCommandSuccess>(value, {[NotificationCommandSuccessTag.Notifications]: validateNotifications, [NotificationCommandSuccessTag.NotificationAdded]: validateNotificationAdded, [NotificationCommandSuccessTag.NotificationRemoved]: validateNotificationRemoved, [NotificationCommandSuccessTag.NotificationsCleared]: validateNotificationsCleared, [NotificationCommandSuccessTag.AllNotificationsCleared]: validateAllNotificationsCleared}, "type");
}

export function validateNotifications(value: unknown): svt.ValidationResult<Notifications> {
    return svt.validate<Notifications>(value, {type: NotificationCommandSuccessTag.Notifications, data: svt.validateArray(validateNotification)});
}

export function validateNotificationAdded(value: unknown): svt.ValidationResult<NotificationAdded> {
    return svt.validate<NotificationAdded>(value, {type: NotificationCommandSuccessTag.NotificationAdded, data: validateNotifyUserPayload});
}

export function validateNotificationRemoved(value: unknown): svt.ValidationResult<NotificationRemoved> {
    return svt.validate<NotificationRemoved>(value, {type: NotificationCommandSuccessTag.NotificationRemoved, data: validateRemoveNotificationResult});
}

export function validateNotificationsCleared(value: unknown): svt.ValidationResult<NotificationsCleared> {
    return svt.validate<NotificationsCleared>(value, {type: NotificationCommandSuccessTag.NotificationsCleared, data: svt.validateNumber});
}

export function validateAllNotificationsCleared(value: unknown): svt.ValidationResult<AllNotificationsCleared> {
    return svt.validate<AllNotificationsCleared>(value, {type: NotificationCommandSuccessTag.AllNotificationsCleared});
}

export type NotificationCommandFailure = NotificationNotRemoved | NotificationNotAdded | InvalidCommand;

export enum NotificationCommandFailureTag {
    NotificationNotRemoved = "NotificationNotRemoved",
    NotificationNotAdded = "NotificationNotAdded",
    InvalidCommand = "InvalidCommand",
}

export type NotificationNotRemoved = {
    type: NotificationCommandFailureTag.NotificationNotRemoved;
    data: RemoveNotificationError;
};

export type NotificationNotAdded = {
    type: NotificationCommandFailureTag.NotificationNotAdded;
    data: AddNotificationError;
};

export type InvalidCommand = {
    type: NotificationCommandFailureTag.InvalidCommand;
    data: string;
};

export function NotificationNotRemoved(data: RemoveNotificationError): NotificationNotRemoved {
    return {type: NotificationCommandFailureTag.NotificationNotRemoved, data};
}

export function NotificationNotAdded(data: AddNotificationError): NotificationNotAdded {
    return {type: NotificationCommandFailureTag.NotificationNotAdded, data};
}

export function InvalidCommand(data: string): InvalidCommand {
    return {type: NotificationCommandFailureTag.InvalidCommand, data};
}

export function isNotificationCommandFailure(value: unknown): value is NotificationCommandFailure {
    return [isNotificationNotRemoved, isNotificationNotAdded, isInvalidCommand].some((typePredicate) => typePredicate(value));
}

export function isNotificationNotRemoved(value: unknown): value is NotificationNotRemoved {
    return svt.isInterface<NotificationNotRemoved>(value, {type: NotificationCommandFailureTag.NotificationNotRemoved, data: isRemoveNotificationError});
}

export function isNotificationNotAdded(value: unknown): value is NotificationNotAdded {
    return svt.isInterface<NotificationNotAdded>(value, {type: NotificationCommandFailureTag.NotificationNotAdded, data: isAddNotificationError});
}

export function isInvalidCommand(value: unknown): value is InvalidCommand {
    return svt.isInterface<InvalidCommand>(value, {type: NotificationCommandFailureTag.InvalidCommand, data: svt.isString});
}

export function validateNotificationCommandFailure(value: unknown): svt.ValidationResult<NotificationCommandFailure> {
    return svt.validateWithTypeTag<NotificationCommandFailure>(value, {[NotificationCommandFailureTag.NotificationNotRemoved]: validateNotificationNotRemoved, [NotificationCommandFailureTag.NotificationNotAdded]: validateNotificationNotAdded, [NotificationCommandFailureTag.InvalidCommand]: validateInvalidCommand}, "type");
}

export function validateNotificationNotRemoved(value: unknown): svt.ValidationResult<NotificationNotRemoved> {
    return svt.validate<NotificationNotRemoved>(value, {type: NotificationCommandFailureTag.NotificationNotRemoved, data: validateRemoveNotificationError});
}

export function validateNotificationNotAdded(value: unknown): svt.ValidationResult<NotificationNotAdded> {
    return svt.validate<NotificationNotAdded>(value, {type: NotificationCommandFailureTag.NotificationNotAdded, data: validateAddNotificationError});
}

export function validateInvalidCommand(value: unknown): svt.ValidationResult<InvalidCommand> {
    return svt.validate<InvalidCommand>(value, {type: NotificationCommandFailureTag.InvalidCommand, data: svt.validateString});
}

export type NotificationCommandResult = CommandSuccess | CommandFailure;

export enum NotificationCommandResultTag {
    CommandSuccess = "CommandSuccess",
    CommandFailure = "CommandFailure",
}

export type CommandSuccess = {
    type: NotificationCommandResultTag.CommandSuccess;
    data: NotificationCommandSuccess;
};

export type CommandFailure = {
    type: NotificationCommandResultTag.CommandFailure;
    data: NotificationCommandFailure;
};

export function CommandSuccess(data: NotificationCommandSuccess): CommandSuccess {
    return {type: NotificationCommandResultTag.CommandSuccess, data};
}

export function CommandFailure(data: NotificationCommandFailure): CommandFailure {
    return {type: NotificationCommandResultTag.CommandFailure, data};
}

export function isNotificationCommandResult(value: unknown): value is NotificationCommandResult {
    return [isCommandSuccess, isCommandFailure].some((typePredicate) => typePredicate(value));
}

export function isCommandSuccess(value: unknown): value is CommandSuccess {
    return svt.isInterface<CommandSuccess>(value, {type: NotificationCommandResultTag.CommandSuccess, data: isNotificationCommandSuccess});
}

export function isCommandFailure(value: unknown): value is CommandFailure {
    return svt.isInterface<CommandFailure>(value, {type: NotificationCommandResultTag.CommandFailure, data: isNotificationCommandFailure});
}

export function validateNotificationCommandResult(value: unknown): svt.ValidationResult<NotificationCommandResult> {
    return svt.validateWithTypeTag<NotificationCommandResult>(value, {[NotificationCommandResultTag.CommandSuccess]: validateCommandSuccess, [NotificationCommandResultTag.CommandFailure]: validateCommandFailure}, "type");
}

export function validateCommandSuccess(value: unknown): svt.ValidationResult<CommandSuccess> {
    return svt.validate<CommandSuccess>(value, {type: NotificationCommandResultTag.CommandSuccess, data: validateNotificationCommandSuccess});
}

export function validateCommandFailure(value: unknown): svt.ValidationResult<CommandFailure> {
    return svt.validate<CommandFailure>(value, {type: NotificationCommandResultTag.CommandFailure, data: validateNotificationCommandFailure});
}