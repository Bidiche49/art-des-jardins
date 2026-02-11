// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'message.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_Message _$MessageFromJson(Map<String, dynamic> json) => _Message(
  id: json['id'] as String,
  conversationId: json['conversationId'] as String,
  senderType: $enumDecode(_$SenderTypeEnumMap, json['senderType']),
  senderId: json['senderId'] as String?,
  content: json['content'] as String,
  attachments:
      (json['attachments'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList() ??
      const [],
  readAt: json['readAt'] == null
      ? null
      : DateTime.parse(json['readAt'] as String),
  createdAt: DateTime.parse(json['createdAt'] as String),
);

Map<String, dynamic> _$MessageToJson(_Message instance) => <String, dynamic>{
  'id': instance.id,
  'conversationId': instance.conversationId,
  'senderType': _$SenderTypeEnumMap[instance.senderType]!,
  'senderId': instance.senderId,
  'content': instance.content,
  'attachments': instance.attachments,
  'readAt': instance.readAt?.toIso8601String(),
  'createdAt': instance.createdAt.toIso8601String(),
};

const _$SenderTypeEnumMap = {
  SenderType.client: 'client',
  SenderType.entreprise: 'entreprise',
};
