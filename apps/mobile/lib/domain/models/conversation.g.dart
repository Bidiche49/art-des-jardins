// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'conversation.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_Conversation _$ConversationFromJson(Map<String, dynamic> json) =>
    _Conversation(
      id: json['id'] as String,
      clientId: json['clientId'] as String,
      chantierId: json['chantierId'] as String?,
      subject: json['subject'] as String,
      lastMessageAt: DateTime.parse(json['lastMessageAt'] as String),
      unreadByClient: json['unreadByClient'] as bool? ?? false,
      unreadByAdmin: json['unreadByAdmin'] as bool? ?? true,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$ConversationToJson(_Conversation instance) =>
    <String, dynamic>{
      'id': instance.id,
      'clientId': instance.clientId,
      'chantierId': instance.chantierId,
      'subject': instance.subject,
      'lastMessageAt': instance.lastMessageAt.toIso8601String(),
      'unreadByClient': instance.unreadByClient,
      'unreadByAdmin': instance.unreadByAdmin,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
