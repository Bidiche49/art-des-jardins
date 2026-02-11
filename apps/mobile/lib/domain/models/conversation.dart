import 'package:freezed_annotation/freezed_annotation.dart';

part 'conversation.freezed.dart';
part 'conversation.g.dart';

@freezed
abstract class Conversation with _$Conversation {
  const factory Conversation({
    required String id,
    required String clientId,
    String? chantierId,
    required String subject,
    required DateTime lastMessageAt,
    @Default(false) bool unreadByClient,
    @Default(true) bool unreadByAdmin,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _Conversation;

  factory Conversation.fromJson(Map<String, dynamic> json) =>
      _$ConversationFromJson(json);
}
