import 'package:freezed_annotation/freezed_annotation.dart';

import '../enums/user_role.dart';

part 'user.freezed.dart';
part 'user.g.dart';

@freezed
abstract class User with _$User {
  const factory User({
    required String id,
    required String email,
    required String nom,
    required String prenom,
    String? telephone,
    @Default(UserRole.employe) UserRole role,
    @Default(true) bool actif,
    String? avatarUrl,
    DateTime? derniereConnexion,
    @Default(false) bool onboardingCompleted,
    @Default(0) int onboardingStep,
    double? hourlyRate,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}
