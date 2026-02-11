import 'package:freezed_annotation/freezed_annotation.dart';

import '../enums/client_type.dart';

part 'client.freezed.dart';
part 'client.g.dart';

@freezed
abstract class Client with _$Client {
  const factory Client({
    required String id,
    required ClientType type,
    required String nom,
    String? prenom,
    String? raisonSociale,
    required String email,
    required String telephone,
    String? telephoneSecondaire,
    required String adresse,
    required String codePostal,
    required String ville,
    String? notes,
    @Default([]) List<String> tags,
    DateTime? deletedAt,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _Client;

  factory Client.fromJson(Map<String, dynamic> json) => _$ClientFromJson(json);
}
