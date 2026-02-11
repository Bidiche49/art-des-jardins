import 'package:freezed_annotation/freezed_annotation.dart';

import '../enums/notification_type.dart';

part 'in_app_notification.freezed.dart';
part 'in_app_notification.g.dart';

@freezed
abstract class InAppNotification with _$InAppNotification {
  const factory InAppNotification({
    required String id,
    required String userId,
    @Default(NotificationType.info) NotificationType type,
    required String title,
    required String message,
    String? link,
    DateTime? readAt,
    required DateTime createdAt,
  }) = _InAppNotification;

  factory InAppNotification.fromJson(Map<String, dynamic> json) =>
      _$InAppNotificationFromJson(json);
}
