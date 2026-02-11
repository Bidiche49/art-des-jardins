import 'package:freezed_annotation/freezed_annotation.dart';

import '../enums/sender_type.dart';

part 'message.freezed.dart';
part 'message.g.dart';

@freezed
abstract class Message with _$Message {
  const factory Message({
    required String id,
    required String conversationId,
    required SenderType senderType,
    String? senderId,
    required String content,
    @Default([]) List<String> attachments,
    DateTime? readAt,
    required DateTime createdAt,
  }) = _Message;

  factory Message.fromJson(Map<String, dynamic> json) =>
      _$MessageFromJson(json);
}
