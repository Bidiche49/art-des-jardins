// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'in_app_notification.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_InAppNotification _$InAppNotificationFromJson(Map<String, dynamic> json) =>
    _InAppNotification(
      id: json['id'] as String,
      userId: json['userId'] as String,
      type:
          $enumDecodeNullable(_$NotificationTypeEnumMap, json['type']) ??
          NotificationType.info,
      title: json['title'] as String,
      message: json['message'] as String,
      link: json['link'] as String?,
      readAt: json['readAt'] == null
          ? null
          : DateTime.parse(json['readAt'] as String),
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$InAppNotificationToJson(_InAppNotification instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'type': _$NotificationTypeEnumMap[instance.type]!,
      'title': instance.title,
      'message': instance.message,
      'link': instance.link,
      'readAt': instance.readAt?.toIso8601String(),
      'createdAt': instance.createdAt.toIso8601String(),
    };

const _$NotificationTypeEnumMap = {
  NotificationType.info: 'info',
  NotificationType.warning: 'warning',
  NotificationType.success: 'success',
  NotificationType.actionRequired: 'action_required',
};
