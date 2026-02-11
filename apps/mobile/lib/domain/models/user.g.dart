// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_User _$UserFromJson(Map<String, dynamic> json) => _User(
  id: json['id'] as String,
  email: json['email'] as String,
  nom: json['nom'] as String,
  prenom: json['prenom'] as String,
  telephone: json['telephone'] as String?,
  role:
      $enumDecodeNullable(_$UserRoleEnumMap, json['role']) ?? UserRole.employe,
  actif: json['actif'] as bool? ?? true,
  avatarUrl: json['avatarUrl'] as String?,
  derniereConnexion: json['derniereConnexion'] == null
      ? null
      : DateTime.parse(json['derniereConnexion'] as String),
  onboardingCompleted: json['onboardingCompleted'] as bool? ?? false,
  onboardingStep: (json['onboardingStep'] as num?)?.toInt() ?? 0,
  hourlyRate: (json['hourlyRate'] as num?)?.toDouble(),
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$UserToJson(_User instance) => <String, dynamic>{
  'id': instance.id,
  'email': instance.email,
  'nom': instance.nom,
  'prenom': instance.prenom,
  'telephone': instance.telephone,
  'role': _$UserRoleEnumMap[instance.role]!,
  'actif': instance.actif,
  'avatarUrl': instance.avatarUrl,
  'derniereConnexion': instance.derniereConnexion?.toIso8601String(),
  'onboardingCompleted': instance.onboardingCompleted,
  'onboardingStep': instance.onboardingStep,
  'hourlyRate': instance.hourlyRate,
  'createdAt': instance.createdAt.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
};

const _$UserRoleEnumMap = {
  UserRole.patron: 'patron',
  UserRole.employe: 'employe',
};
