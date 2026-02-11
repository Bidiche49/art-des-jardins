// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_database.dart';

// ignore_for_file: type=lint
class $ClientsTableTable extends ClientsTable
    with TableInfo<$ClientsTableTable, ClientsTableData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $ClientsTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _typeMeta = const VerificationMeta('type');
  @override
  late final GeneratedColumn<String> type = GeneratedColumn<String>(
    'type',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nomMeta = const VerificationMeta('nom');
  @override
  late final GeneratedColumn<String> nom = GeneratedColumn<String>(
    'nom',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _prenomMeta = const VerificationMeta('prenom');
  @override
  late final GeneratedColumn<String> prenom = GeneratedColumn<String>(
    'prenom',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _raisonSocialeMeta = const VerificationMeta(
    'raisonSociale',
  );
  @override
  late final GeneratedColumn<String> raisonSociale = GeneratedColumn<String>(
    'raison_sociale',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _emailMeta = const VerificationMeta('email');
  @override
  late final GeneratedColumn<String> email = GeneratedColumn<String>(
    'email',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _telephoneMeta = const VerificationMeta(
    'telephone',
  );
  @override
  late final GeneratedColumn<String> telephone = GeneratedColumn<String>(
    'telephone',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _telephoneSecondaireMeta =
      const VerificationMeta('telephoneSecondaire');
  @override
  late final GeneratedColumn<String> telephoneSecondaire =
      GeneratedColumn<String>(
        'telephone_secondaire',
        aliasedName,
        true,
        type: DriftSqlType.string,
        requiredDuringInsert: false,
      );
  static const VerificationMeta _adresseMeta = const VerificationMeta(
    'adresse',
  );
  @override
  late final GeneratedColumn<String> adresse = GeneratedColumn<String>(
    'adresse',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _codePostalMeta = const VerificationMeta(
    'codePostal',
  );
  @override
  late final GeneratedColumn<String> codePostal = GeneratedColumn<String>(
    'code_postal',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _villeMeta = const VerificationMeta('ville');
  @override
  late final GeneratedColumn<String> ville = GeneratedColumn<String>(
    'ville',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _notesMeta = const VerificationMeta('notes');
  @override
  late final GeneratedColumn<String> notes = GeneratedColumn<String>(
    'notes',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _tagsMeta = const VerificationMeta('tags');
  @override
  late final GeneratedColumn<String> tags = GeneratedColumn<String>(
    'tags',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('[]'),
  );
  static const VerificationMeta _createdAtMeta = const VerificationMeta(
    'createdAt',
  );
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
    'created_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _updatedAtMeta = const VerificationMeta(
    'updatedAt',
  );
  @override
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
    'updated_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _syncedAtMeta = const VerificationMeta(
    'syncedAt',
  );
  @override
  late final GeneratedColumn<DateTime> syncedAt = GeneratedColumn<DateTime>(
    'synced_at',
    aliasedName,
    true,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    type,
    nom,
    prenom,
    raisonSociale,
    email,
    telephone,
    telephoneSecondaire,
    adresse,
    codePostal,
    ville,
    notes,
    tags,
    createdAt,
    updatedAt,
    syncedAt,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'clients';
  @override
  VerificationContext validateIntegrity(
    Insertable<ClientsTableData> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('type')) {
      context.handle(
        _typeMeta,
        type.isAcceptableOrUnknown(data['type']!, _typeMeta),
      );
    } else if (isInserting) {
      context.missing(_typeMeta);
    }
    if (data.containsKey('nom')) {
      context.handle(
        _nomMeta,
        nom.isAcceptableOrUnknown(data['nom']!, _nomMeta),
      );
    } else if (isInserting) {
      context.missing(_nomMeta);
    }
    if (data.containsKey('prenom')) {
      context.handle(
        _prenomMeta,
        prenom.isAcceptableOrUnknown(data['prenom']!, _prenomMeta),
      );
    }
    if (data.containsKey('raison_sociale')) {
      context.handle(
        _raisonSocialeMeta,
        raisonSociale.isAcceptableOrUnknown(
          data['raison_sociale']!,
          _raisonSocialeMeta,
        ),
      );
    }
    if (data.containsKey('email')) {
      context.handle(
        _emailMeta,
        email.isAcceptableOrUnknown(data['email']!, _emailMeta),
      );
    } else if (isInserting) {
      context.missing(_emailMeta);
    }
    if (data.containsKey('telephone')) {
      context.handle(
        _telephoneMeta,
        telephone.isAcceptableOrUnknown(data['telephone']!, _telephoneMeta),
      );
    } else if (isInserting) {
      context.missing(_telephoneMeta);
    }
    if (data.containsKey('telephone_secondaire')) {
      context.handle(
        _telephoneSecondaireMeta,
        telephoneSecondaire.isAcceptableOrUnknown(
          data['telephone_secondaire']!,
          _telephoneSecondaireMeta,
        ),
      );
    }
    if (data.containsKey('adresse')) {
      context.handle(
        _adresseMeta,
        adresse.isAcceptableOrUnknown(data['adresse']!, _adresseMeta),
      );
    } else if (isInserting) {
      context.missing(_adresseMeta);
    }
    if (data.containsKey('code_postal')) {
      context.handle(
        _codePostalMeta,
        codePostal.isAcceptableOrUnknown(data['code_postal']!, _codePostalMeta),
      );
    } else if (isInserting) {
      context.missing(_codePostalMeta);
    }
    if (data.containsKey('ville')) {
      context.handle(
        _villeMeta,
        ville.isAcceptableOrUnknown(data['ville']!, _villeMeta),
      );
    } else if (isInserting) {
      context.missing(_villeMeta);
    }
    if (data.containsKey('notes')) {
      context.handle(
        _notesMeta,
        notes.isAcceptableOrUnknown(data['notes']!, _notesMeta),
      );
    }
    if (data.containsKey('tags')) {
      context.handle(
        _tagsMeta,
        tags.isAcceptableOrUnknown(data['tags']!, _tagsMeta),
      );
    }
    if (data.containsKey('created_at')) {
      context.handle(
        _createdAtMeta,
        createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta),
      );
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(
        _updatedAtMeta,
        updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta),
      );
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('synced_at')) {
      context.handle(
        _syncedAtMeta,
        syncedAt.isAcceptableOrUnknown(data['synced_at']!, _syncedAtMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  ClientsTableData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return ClientsTableData(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      type: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}type'],
      )!,
      nom: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}nom'],
      )!,
      prenom: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}prenom'],
      ),
      raisonSociale: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}raison_sociale'],
      ),
      email: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}email'],
      )!,
      telephone: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}telephone'],
      )!,
      telephoneSecondaire: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}telephone_secondaire'],
      ),
      adresse: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}adresse'],
      )!,
      codePostal: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}code_postal'],
      )!,
      ville: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}ville'],
      )!,
      notes: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}notes'],
      ),
      tags: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}tags'],
      )!,
      createdAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}created_at'],
      )!,
      updatedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}updated_at'],
      )!,
      syncedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}synced_at'],
      ),
    );
  }

  @override
  $ClientsTableTable createAlias(String alias) {
    return $ClientsTableTable(attachedDatabase, alias);
  }
}

class ClientsTableData extends DataClass
    implements Insertable<ClientsTableData> {
  final String id;
  final String type;
  final String nom;
  final String? prenom;
  final String? raisonSociale;
  final String email;
  final String telephone;
  final String? telephoneSecondaire;
  final String adresse;
  final String codePostal;
  final String ville;
  final String? notes;
  final String tags;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? syncedAt;
  const ClientsTableData({
    required this.id,
    required this.type,
    required this.nom,
    this.prenom,
    this.raisonSociale,
    required this.email,
    required this.telephone,
    this.telephoneSecondaire,
    required this.adresse,
    required this.codePostal,
    required this.ville,
    this.notes,
    required this.tags,
    required this.createdAt,
    required this.updatedAt,
    this.syncedAt,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['type'] = Variable<String>(type);
    map['nom'] = Variable<String>(nom);
    if (!nullToAbsent || prenom != null) {
      map['prenom'] = Variable<String>(prenom);
    }
    if (!nullToAbsent || raisonSociale != null) {
      map['raison_sociale'] = Variable<String>(raisonSociale);
    }
    map['email'] = Variable<String>(email);
    map['telephone'] = Variable<String>(telephone);
    if (!nullToAbsent || telephoneSecondaire != null) {
      map['telephone_secondaire'] = Variable<String>(telephoneSecondaire);
    }
    map['adresse'] = Variable<String>(adresse);
    map['code_postal'] = Variable<String>(codePostal);
    map['ville'] = Variable<String>(ville);
    if (!nullToAbsent || notes != null) {
      map['notes'] = Variable<String>(notes);
    }
    map['tags'] = Variable<String>(tags);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    if (!nullToAbsent || syncedAt != null) {
      map['synced_at'] = Variable<DateTime>(syncedAt);
    }
    return map;
  }

  ClientsTableCompanion toCompanion(bool nullToAbsent) {
    return ClientsTableCompanion(
      id: Value(id),
      type: Value(type),
      nom: Value(nom),
      prenom: prenom == null && nullToAbsent
          ? const Value.absent()
          : Value(prenom),
      raisonSociale: raisonSociale == null && nullToAbsent
          ? const Value.absent()
          : Value(raisonSociale),
      email: Value(email),
      telephone: Value(telephone),
      telephoneSecondaire: telephoneSecondaire == null && nullToAbsent
          ? const Value.absent()
          : Value(telephoneSecondaire),
      adresse: Value(adresse),
      codePostal: Value(codePostal),
      ville: Value(ville),
      notes: notes == null && nullToAbsent
          ? const Value.absent()
          : Value(notes),
      tags: Value(tags),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
      syncedAt: syncedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(syncedAt),
    );
  }

  factory ClientsTableData.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return ClientsTableData(
      id: serializer.fromJson<String>(json['id']),
      type: serializer.fromJson<String>(json['type']),
      nom: serializer.fromJson<String>(json['nom']),
      prenom: serializer.fromJson<String?>(json['prenom']),
      raisonSociale: serializer.fromJson<String?>(json['raisonSociale']),
      email: serializer.fromJson<String>(json['email']),
      telephone: serializer.fromJson<String>(json['telephone']),
      telephoneSecondaire: serializer.fromJson<String?>(
        json['telephoneSecondaire'],
      ),
      adresse: serializer.fromJson<String>(json['adresse']),
      codePostal: serializer.fromJson<String>(json['codePostal']),
      ville: serializer.fromJson<String>(json['ville']),
      notes: serializer.fromJson<String?>(json['notes']),
      tags: serializer.fromJson<String>(json['tags']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
      updatedAt: serializer.fromJson<DateTime>(json['updatedAt']),
      syncedAt: serializer.fromJson<DateTime?>(json['syncedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'type': serializer.toJson<String>(type),
      'nom': serializer.toJson<String>(nom),
      'prenom': serializer.toJson<String?>(prenom),
      'raisonSociale': serializer.toJson<String?>(raisonSociale),
      'email': serializer.toJson<String>(email),
      'telephone': serializer.toJson<String>(telephone),
      'telephoneSecondaire': serializer.toJson<String?>(telephoneSecondaire),
      'adresse': serializer.toJson<String>(adresse),
      'codePostal': serializer.toJson<String>(codePostal),
      'ville': serializer.toJson<String>(ville),
      'notes': serializer.toJson<String?>(notes),
      'tags': serializer.toJson<String>(tags),
      'createdAt': serializer.toJson<DateTime>(createdAt),
      'updatedAt': serializer.toJson<DateTime>(updatedAt),
      'syncedAt': serializer.toJson<DateTime?>(syncedAt),
    };
  }

  ClientsTableData copyWith({
    String? id,
    String? type,
    String? nom,
    Value<String?> prenom = const Value.absent(),
    Value<String?> raisonSociale = const Value.absent(),
    String? email,
    String? telephone,
    Value<String?> telephoneSecondaire = const Value.absent(),
    String? adresse,
    String? codePostal,
    String? ville,
    Value<String?> notes = const Value.absent(),
    String? tags,
    DateTime? createdAt,
    DateTime? updatedAt,
    Value<DateTime?> syncedAt = const Value.absent(),
  }) => ClientsTableData(
    id: id ?? this.id,
    type: type ?? this.type,
    nom: nom ?? this.nom,
    prenom: prenom.present ? prenom.value : this.prenom,
    raisonSociale: raisonSociale.present
        ? raisonSociale.value
        : this.raisonSociale,
    email: email ?? this.email,
    telephone: telephone ?? this.telephone,
    telephoneSecondaire: telephoneSecondaire.present
        ? telephoneSecondaire.value
        : this.telephoneSecondaire,
    adresse: adresse ?? this.adresse,
    codePostal: codePostal ?? this.codePostal,
    ville: ville ?? this.ville,
    notes: notes.present ? notes.value : this.notes,
    tags: tags ?? this.tags,
    createdAt: createdAt ?? this.createdAt,
    updatedAt: updatedAt ?? this.updatedAt,
    syncedAt: syncedAt.present ? syncedAt.value : this.syncedAt,
  );
  ClientsTableData copyWithCompanion(ClientsTableCompanion data) {
    return ClientsTableData(
      id: data.id.present ? data.id.value : this.id,
      type: data.type.present ? data.type.value : this.type,
      nom: data.nom.present ? data.nom.value : this.nom,
      prenom: data.prenom.present ? data.prenom.value : this.prenom,
      raisonSociale: data.raisonSociale.present
          ? data.raisonSociale.value
          : this.raisonSociale,
      email: data.email.present ? data.email.value : this.email,
      telephone: data.telephone.present ? data.telephone.value : this.telephone,
      telephoneSecondaire: data.telephoneSecondaire.present
          ? data.telephoneSecondaire.value
          : this.telephoneSecondaire,
      adresse: data.adresse.present ? data.adresse.value : this.adresse,
      codePostal: data.codePostal.present
          ? data.codePostal.value
          : this.codePostal,
      ville: data.ville.present ? data.ville.value : this.ville,
      notes: data.notes.present ? data.notes.value : this.notes,
      tags: data.tags.present ? data.tags.value : this.tags,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
      syncedAt: data.syncedAt.present ? data.syncedAt.value : this.syncedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('ClientsTableData(')
          ..write('id: $id, ')
          ..write('type: $type, ')
          ..write('nom: $nom, ')
          ..write('prenom: $prenom, ')
          ..write('raisonSociale: $raisonSociale, ')
          ..write('email: $email, ')
          ..write('telephone: $telephone, ')
          ..write('telephoneSecondaire: $telephoneSecondaire, ')
          ..write('adresse: $adresse, ')
          ..write('codePostal: $codePostal, ')
          ..write('ville: $ville, ')
          ..write('notes: $notes, ')
          ..write('tags: $tags, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('syncedAt: $syncedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    type,
    nom,
    prenom,
    raisonSociale,
    email,
    telephone,
    telephoneSecondaire,
    adresse,
    codePostal,
    ville,
    notes,
    tags,
    createdAt,
    updatedAt,
    syncedAt,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is ClientsTableData &&
          other.id == this.id &&
          other.type == this.type &&
          other.nom == this.nom &&
          other.prenom == this.prenom &&
          other.raisonSociale == this.raisonSociale &&
          other.email == this.email &&
          other.telephone == this.telephone &&
          other.telephoneSecondaire == this.telephoneSecondaire &&
          other.adresse == this.adresse &&
          other.codePostal == this.codePostal &&
          other.ville == this.ville &&
          other.notes == this.notes &&
          other.tags == this.tags &&
          other.createdAt == this.createdAt &&
          other.updatedAt == this.updatedAt &&
          other.syncedAt == this.syncedAt);
}

class ClientsTableCompanion extends UpdateCompanion<ClientsTableData> {
  final Value<String> id;
  final Value<String> type;
  final Value<String> nom;
  final Value<String?> prenom;
  final Value<String?> raisonSociale;
  final Value<String> email;
  final Value<String> telephone;
  final Value<String?> telephoneSecondaire;
  final Value<String> adresse;
  final Value<String> codePostal;
  final Value<String> ville;
  final Value<String?> notes;
  final Value<String> tags;
  final Value<DateTime> createdAt;
  final Value<DateTime> updatedAt;
  final Value<DateTime?> syncedAt;
  final Value<int> rowid;
  const ClientsTableCompanion({
    this.id = const Value.absent(),
    this.type = const Value.absent(),
    this.nom = const Value.absent(),
    this.prenom = const Value.absent(),
    this.raisonSociale = const Value.absent(),
    this.email = const Value.absent(),
    this.telephone = const Value.absent(),
    this.telephoneSecondaire = const Value.absent(),
    this.adresse = const Value.absent(),
    this.codePostal = const Value.absent(),
    this.ville = const Value.absent(),
    this.notes = const Value.absent(),
    this.tags = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  ClientsTableCompanion.insert({
    required String id,
    required String type,
    required String nom,
    this.prenom = const Value.absent(),
    this.raisonSociale = const Value.absent(),
    required String email,
    required String telephone,
    this.telephoneSecondaire = const Value.absent(),
    required String adresse,
    required String codePostal,
    required String ville,
    this.notes = const Value.absent(),
    this.tags = const Value.absent(),
    required DateTime createdAt,
    required DateTime updatedAt,
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       type = Value(type),
       nom = Value(nom),
       email = Value(email),
       telephone = Value(telephone),
       adresse = Value(adresse),
       codePostal = Value(codePostal),
       ville = Value(ville),
       createdAt = Value(createdAt),
       updatedAt = Value(updatedAt);
  static Insertable<ClientsTableData> custom({
    Expression<String>? id,
    Expression<String>? type,
    Expression<String>? nom,
    Expression<String>? prenom,
    Expression<String>? raisonSociale,
    Expression<String>? email,
    Expression<String>? telephone,
    Expression<String>? telephoneSecondaire,
    Expression<String>? adresse,
    Expression<String>? codePostal,
    Expression<String>? ville,
    Expression<String>? notes,
    Expression<String>? tags,
    Expression<DateTime>? createdAt,
    Expression<DateTime>? updatedAt,
    Expression<DateTime>? syncedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (type != null) 'type': type,
      if (nom != null) 'nom': nom,
      if (prenom != null) 'prenom': prenom,
      if (raisonSociale != null) 'raison_sociale': raisonSociale,
      if (email != null) 'email': email,
      if (telephone != null) 'telephone': telephone,
      if (telephoneSecondaire != null)
        'telephone_secondaire': telephoneSecondaire,
      if (adresse != null) 'adresse': adresse,
      if (codePostal != null) 'code_postal': codePostal,
      if (ville != null) 'ville': ville,
      if (notes != null) 'notes': notes,
      if (tags != null) 'tags': tags,
      if (createdAt != null) 'created_at': createdAt,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (syncedAt != null) 'synced_at': syncedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  ClientsTableCompanion copyWith({
    Value<String>? id,
    Value<String>? type,
    Value<String>? nom,
    Value<String?>? prenom,
    Value<String?>? raisonSociale,
    Value<String>? email,
    Value<String>? telephone,
    Value<String?>? telephoneSecondaire,
    Value<String>? adresse,
    Value<String>? codePostal,
    Value<String>? ville,
    Value<String?>? notes,
    Value<String>? tags,
    Value<DateTime>? createdAt,
    Value<DateTime>? updatedAt,
    Value<DateTime?>? syncedAt,
    Value<int>? rowid,
  }) {
    return ClientsTableCompanion(
      id: id ?? this.id,
      type: type ?? this.type,
      nom: nom ?? this.nom,
      prenom: prenom ?? this.prenom,
      raisonSociale: raisonSociale ?? this.raisonSociale,
      email: email ?? this.email,
      telephone: telephone ?? this.telephone,
      telephoneSecondaire: telephoneSecondaire ?? this.telephoneSecondaire,
      adresse: adresse ?? this.adresse,
      codePostal: codePostal ?? this.codePostal,
      ville: ville ?? this.ville,
      notes: notes ?? this.notes,
      tags: tags ?? this.tags,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      syncedAt: syncedAt ?? this.syncedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (type.present) {
      map['type'] = Variable<String>(type.value);
    }
    if (nom.present) {
      map['nom'] = Variable<String>(nom.value);
    }
    if (prenom.present) {
      map['prenom'] = Variable<String>(prenom.value);
    }
    if (raisonSociale.present) {
      map['raison_sociale'] = Variable<String>(raisonSociale.value);
    }
    if (email.present) {
      map['email'] = Variable<String>(email.value);
    }
    if (telephone.present) {
      map['telephone'] = Variable<String>(telephone.value);
    }
    if (telephoneSecondaire.present) {
      map['telephone_secondaire'] = Variable<String>(telephoneSecondaire.value);
    }
    if (adresse.present) {
      map['adresse'] = Variable<String>(adresse.value);
    }
    if (codePostal.present) {
      map['code_postal'] = Variable<String>(codePostal.value);
    }
    if (ville.present) {
      map['ville'] = Variable<String>(ville.value);
    }
    if (notes.present) {
      map['notes'] = Variable<String>(notes.value);
    }
    if (tags.present) {
      map['tags'] = Variable<String>(tags.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (syncedAt.present) {
      map['synced_at'] = Variable<DateTime>(syncedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('ClientsTableCompanion(')
          ..write('id: $id, ')
          ..write('type: $type, ')
          ..write('nom: $nom, ')
          ..write('prenom: $prenom, ')
          ..write('raisonSociale: $raisonSociale, ')
          ..write('email: $email, ')
          ..write('telephone: $telephone, ')
          ..write('telephoneSecondaire: $telephoneSecondaire, ')
          ..write('adresse: $adresse, ')
          ..write('codePostal: $codePostal, ')
          ..write('ville: $ville, ')
          ..write('notes: $notes, ')
          ..write('tags: $tags, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('syncedAt: $syncedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $ChantiersTableTable extends ChantiersTable
    with TableInfo<$ChantiersTableTable, ChantiersTableData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $ChantiersTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _clientIdMeta = const VerificationMeta(
    'clientId',
  );
  @override
  late final GeneratedColumn<String> clientId = GeneratedColumn<String>(
    'client_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _adresseMeta = const VerificationMeta(
    'adresse',
  );
  @override
  late final GeneratedColumn<String> adresse = GeneratedColumn<String>(
    'adresse',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _codePostalMeta = const VerificationMeta(
    'codePostal',
  );
  @override
  late final GeneratedColumn<String> codePostal = GeneratedColumn<String>(
    'code_postal',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _villeMeta = const VerificationMeta('ville');
  @override
  late final GeneratedColumn<String> ville = GeneratedColumn<String>(
    'ville',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _latitudeMeta = const VerificationMeta(
    'latitude',
  );
  @override
  late final GeneratedColumn<double> latitude = GeneratedColumn<double>(
    'latitude',
    aliasedName,
    true,
    type: DriftSqlType.double,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _longitudeMeta = const VerificationMeta(
    'longitude',
  );
  @override
  late final GeneratedColumn<double> longitude = GeneratedColumn<double>(
    'longitude',
    aliasedName,
    true,
    type: DriftSqlType.double,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _typePrestationMeta = const VerificationMeta(
    'typePrestation',
  );
  @override
  late final GeneratedColumn<String> typePrestation = GeneratedColumn<String>(
    'type_prestation',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('[]'),
  );
  static const VerificationMeta _descriptionMeta = const VerificationMeta(
    'description',
  );
  @override
  late final GeneratedColumn<String> description = GeneratedColumn<String>(
    'description',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _surfaceMeta = const VerificationMeta(
    'surface',
  );
  @override
  late final GeneratedColumn<double> surface = GeneratedColumn<double>(
    'surface',
    aliasedName,
    true,
    type: DriftSqlType.double,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _statutMeta = const VerificationMeta('statut');
  @override
  late final GeneratedColumn<String> statut = GeneratedColumn<String>(
    'statut',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('lead'),
  );
  static const VerificationMeta _dateDebutMeta = const VerificationMeta(
    'dateDebut',
  );
  @override
  late final GeneratedColumn<DateTime> dateDebut = GeneratedColumn<DateTime>(
    'date_debut',
    aliasedName,
    true,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _dateFinMeta = const VerificationMeta(
    'dateFin',
  );
  @override
  late final GeneratedColumn<DateTime> dateFin = GeneratedColumn<DateTime>(
    'date_fin',
    aliasedName,
    true,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _responsableIdMeta = const VerificationMeta(
    'responsableId',
  );
  @override
  late final GeneratedColumn<String> responsableId = GeneratedColumn<String>(
    'responsable_id',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _notesMeta = const VerificationMeta('notes');
  @override
  late final GeneratedColumn<String> notes = GeneratedColumn<String>(
    'notes',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _createdAtMeta = const VerificationMeta(
    'createdAt',
  );
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
    'created_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _updatedAtMeta = const VerificationMeta(
    'updatedAt',
  );
  @override
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
    'updated_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _syncedAtMeta = const VerificationMeta(
    'syncedAt',
  );
  @override
  late final GeneratedColumn<DateTime> syncedAt = GeneratedColumn<DateTime>(
    'synced_at',
    aliasedName,
    true,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    clientId,
    adresse,
    codePostal,
    ville,
    latitude,
    longitude,
    typePrestation,
    description,
    surface,
    statut,
    dateDebut,
    dateFin,
    responsableId,
    notes,
    createdAt,
    updatedAt,
    syncedAt,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'chantiers';
  @override
  VerificationContext validateIntegrity(
    Insertable<ChantiersTableData> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('client_id')) {
      context.handle(
        _clientIdMeta,
        clientId.isAcceptableOrUnknown(data['client_id']!, _clientIdMeta),
      );
    } else if (isInserting) {
      context.missing(_clientIdMeta);
    }
    if (data.containsKey('adresse')) {
      context.handle(
        _adresseMeta,
        adresse.isAcceptableOrUnknown(data['adresse']!, _adresseMeta),
      );
    } else if (isInserting) {
      context.missing(_adresseMeta);
    }
    if (data.containsKey('code_postal')) {
      context.handle(
        _codePostalMeta,
        codePostal.isAcceptableOrUnknown(data['code_postal']!, _codePostalMeta),
      );
    } else if (isInserting) {
      context.missing(_codePostalMeta);
    }
    if (data.containsKey('ville')) {
      context.handle(
        _villeMeta,
        ville.isAcceptableOrUnknown(data['ville']!, _villeMeta),
      );
    } else if (isInserting) {
      context.missing(_villeMeta);
    }
    if (data.containsKey('latitude')) {
      context.handle(
        _latitudeMeta,
        latitude.isAcceptableOrUnknown(data['latitude']!, _latitudeMeta),
      );
    }
    if (data.containsKey('longitude')) {
      context.handle(
        _longitudeMeta,
        longitude.isAcceptableOrUnknown(data['longitude']!, _longitudeMeta),
      );
    }
    if (data.containsKey('type_prestation')) {
      context.handle(
        _typePrestationMeta,
        typePrestation.isAcceptableOrUnknown(
          data['type_prestation']!,
          _typePrestationMeta,
        ),
      );
    }
    if (data.containsKey('description')) {
      context.handle(
        _descriptionMeta,
        description.isAcceptableOrUnknown(
          data['description']!,
          _descriptionMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_descriptionMeta);
    }
    if (data.containsKey('surface')) {
      context.handle(
        _surfaceMeta,
        surface.isAcceptableOrUnknown(data['surface']!, _surfaceMeta),
      );
    }
    if (data.containsKey('statut')) {
      context.handle(
        _statutMeta,
        statut.isAcceptableOrUnknown(data['statut']!, _statutMeta),
      );
    }
    if (data.containsKey('date_debut')) {
      context.handle(
        _dateDebutMeta,
        dateDebut.isAcceptableOrUnknown(data['date_debut']!, _dateDebutMeta),
      );
    }
    if (data.containsKey('date_fin')) {
      context.handle(
        _dateFinMeta,
        dateFin.isAcceptableOrUnknown(data['date_fin']!, _dateFinMeta),
      );
    }
    if (data.containsKey('responsable_id')) {
      context.handle(
        _responsableIdMeta,
        responsableId.isAcceptableOrUnknown(
          data['responsable_id']!,
          _responsableIdMeta,
        ),
      );
    }
    if (data.containsKey('notes')) {
      context.handle(
        _notesMeta,
        notes.isAcceptableOrUnknown(data['notes']!, _notesMeta),
      );
    }
    if (data.containsKey('created_at')) {
      context.handle(
        _createdAtMeta,
        createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta),
      );
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(
        _updatedAtMeta,
        updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta),
      );
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('synced_at')) {
      context.handle(
        _syncedAtMeta,
        syncedAt.isAcceptableOrUnknown(data['synced_at']!, _syncedAtMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  ChantiersTableData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return ChantiersTableData(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      clientId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}client_id'],
      )!,
      adresse: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}adresse'],
      )!,
      codePostal: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}code_postal'],
      )!,
      ville: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}ville'],
      )!,
      latitude: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}latitude'],
      ),
      longitude: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}longitude'],
      ),
      typePrestation: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}type_prestation'],
      )!,
      description: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}description'],
      )!,
      surface: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}surface'],
      ),
      statut: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}statut'],
      )!,
      dateDebut: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}date_debut'],
      ),
      dateFin: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}date_fin'],
      ),
      responsableId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}responsable_id'],
      ),
      notes: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}notes'],
      ),
      createdAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}created_at'],
      )!,
      updatedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}updated_at'],
      )!,
      syncedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}synced_at'],
      ),
    );
  }

  @override
  $ChantiersTableTable createAlias(String alias) {
    return $ChantiersTableTable(attachedDatabase, alias);
  }
}

class ChantiersTableData extends DataClass
    implements Insertable<ChantiersTableData> {
  final String id;
  final String clientId;
  final String adresse;
  final String codePostal;
  final String ville;
  final double? latitude;
  final double? longitude;
  final String typePrestation;
  final String description;
  final double? surface;
  final String statut;
  final DateTime? dateDebut;
  final DateTime? dateFin;
  final String? responsableId;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? syncedAt;
  const ChantiersTableData({
    required this.id,
    required this.clientId,
    required this.adresse,
    required this.codePostal,
    required this.ville,
    this.latitude,
    this.longitude,
    required this.typePrestation,
    required this.description,
    this.surface,
    required this.statut,
    this.dateDebut,
    this.dateFin,
    this.responsableId,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
    this.syncedAt,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['client_id'] = Variable<String>(clientId);
    map['adresse'] = Variable<String>(adresse);
    map['code_postal'] = Variable<String>(codePostal);
    map['ville'] = Variable<String>(ville);
    if (!nullToAbsent || latitude != null) {
      map['latitude'] = Variable<double>(latitude);
    }
    if (!nullToAbsent || longitude != null) {
      map['longitude'] = Variable<double>(longitude);
    }
    map['type_prestation'] = Variable<String>(typePrestation);
    map['description'] = Variable<String>(description);
    if (!nullToAbsent || surface != null) {
      map['surface'] = Variable<double>(surface);
    }
    map['statut'] = Variable<String>(statut);
    if (!nullToAbsent || dateDebut != null) {
      map['date_debut'] = Variable<DateTime>(dateDebut);
    }
    if (!nullToAbsent || dateFin != null) {
      map['date_fin'] = Variable<DateTime>(dateFin);
    }
    if (!nullToAbsent || responsableId != null) {
      map['responsable_id'] = Variable<String>(responsableId);
    }
    if (!nullToAbsent || notes != null) {
      map['notes'] = Variable<String>(notes);
    }
    map['created_at'] = Variable<DateTime>(createdAt);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    if (!nullToAbsent || syncedAt != null) {
      map['synced_at'] = Variable<DateTime>(syncedAt);
    }
    return map;
  }

  ChantiersTableCompanion toCompanion(bool nullToAbsent) {
    return ChantiersTableCompanion(
      id: Value(id),
      clientId: Value(clientId),
      adresse: Value(adresse),
      codePostal: Value(codePostal),
      ville: Value(ville),
      latitude: latitude == null && nullToAbsent
          ? const Value.absent()
          : Value(latitude),
      longitude: longitude == null && nullToAbsent
          ? const Value.absent()
          : Value(longitude),
      typePrestation: Value(typePrestation),
      description: Value(description),
      surface: surface == null && nullToAbsent
          ? const Value.absent()
          : Value(surface),
      statut: Value(statut),
      dateDebut: dateDebut == null && nullToAbsent
          ? const Value.absent()
          : Value(dateDebut),
      dateFin: dateFin == null && nullToAbsent
          ? const Value.absent()
          : Value(dateFin),
      responsableId: responsableId == null && nullToAbsent
          ? const Value.absent()
          : Value(responsableId),
      notes: notes == null && nullToAbsent
          ? const Value.absent()
          : Value(notes),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
      syncedAt: syncedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(syncedAt),
    );
  }

  factory ChantiersTableData.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return ChantiersTableData(
      id: serializer.fromJson<String>(json['id']),
      clientId: serializer.fromJson<String>(json['clientId']),
      adresse: serializer.fromJson<String>(json['adresse']),
      codePostal: serializer.fromJson<String>(json['codePostal']),
      ville: serializer.fromJson<String>(json['ville']),
      latitude: serializer.fromJson<double?>(json['latitude']),
      longitude: serializer.fromJson<double?>(json['longitude']),
      typePrestation: serializer.fromJson<String>(json['typePrestation']),
      description: serializer.fromJson<String>(json['description']),
      surface: serializer.fromJson<double?>(json['surface']),
      statut: serializer.fromJson<String>(json['statut']),
      dateDebut: serializer.fromJson<DateTime?>(json['dateDebut']),
      dateFin: serializer.fromJson<DateTime?>(json['dateFin']),
      responsableId: serializer.fromJson<String?>(json['responsableId']),
      notes: serializer.fromJson<String?>(json['notes']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
      updatedAt: serializer.fromJson<DateTime>(json['updatedAt']),
      syncedAt: serializer.fromJson<DateTime?>(json['syncedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'clientId': serializer.toJson<String>(clientId),
      'adresse': serializer.toJson<String>(adresse),
      'codePostal': serializer.toJson<String>(codePostal),
      'ville': serializer.toJson<String>(ville),
      'latitude': serializer.toJson<double?>(latitude),
      'longitude': serializer.toJson<double?>(longitude),
      'typePrestation': serializer.toJson<String>(typePrestation),
      'description': serializer.toJson<String>(description),
      'surface': serializer.toJson<double?>(surface),
      'statut': serializer.toJson<String>(statut),
      'dateDebut': serializer.toJson<DateTime?>(dateDebut),
      'dateFin': serializer.toJson<DateTime?>(dateFin),
      'responsableId': serializer.toJson<String?>(responsableId),
      'notes': serializer.toJson<String?>(notes),
      'createdAt': serializer.toJson<DateTime>(createdAt),
      'updatedAt': serializer.toJson<DateTime>(updatedAt),
      'syncedAt': serializer.toJson<DateTime?>(syncedAt),
    };
  }

  ChantiersTableData copyWith({
    String? id,
    String? clientId,
    String? adresse,
    String? codePostal,
    String? ville,
    Value<double?> latitude = const Value.absent(),
    Value<double?> longitude = const Value.absent(),
    String? typePrestation,
    String? description,
    Value<double?> surface = const Value.absent(),
    String? statut,
    Value<DateTime?> dateDebut = const Value.absent(),
    Value<DateTime?> dateFin = const Value.absent(),
    Value<String?> responsableId = const Value.absent(),
    Value<String?> notes = const Value.absent(),
    DateTime? createdAt,
    DateTime? updatedAt,
    Value<DateTime?> syncedAt = const Value.absent(),
  }) => ChantiersTableData(
    id: id ?? this.id,
    clientId: clientId ?? this.clientId,
    adresse: adresse ?? this.adresse,
    codePostal: codePostal ?? this.codePostal,
    ville: ville ?? this.ville,
    latitude: latitude.present ? latitude.value : this.latitude,
    longitude: longitude.present ? longitude.value : this.longitude,
    typePrestation: typePrestation ?? this.typePrestation,
    description: description ?? this.description,
    surface: surface.present ? surface.value : this.surface,
    statut: statut ?? this.statut,
    dateDebut: dateDebut.present ? dateDebut.value : this.dateDebut,
    dateFin: dateFin.present ? dateFin.value : this.dateFin,
    responsableId: responsableId.present
        ? responsableId.value
        : this.responsableId,
    notes: notes.present ? notes.value : this.notes,
    createdAt: createdAt ?? this.createdAt,
    updatedAt: updatedAt ?? this.updatedAt,
    syncedAt: syncedAt.present ? syncedAt.value : this.syncedAt,
  );
  ChantiersTableData copyWithCompanion(ChantiersTableCompanion data) {
    return ChantiersTableData(
      id: data.id.present ? data.id.value : this.id,
      clientId: data.clientId.present ? data.clientId.value : this.clientId,
      adresse: data.adresse.present ? data.adresse.value : this.adresse,
      codePostal: data.codePostal.present
          ? data.codePostal.value
          : this.codePostal,
      ville: data.ville.present ? data.ville.value : this.ville,
      latitude: data.latitude.present ? data.latitude.value : this.latitude,
      longitude: data.longitude.present ? data.longitude.value : this.longitude,
      typePrestation: data.typePrestation.present
          ? data.typePrestation.value
          : this.typePrestation,
      description: data.description.present
          ? data.description.value
          : this.description,
      surface: data.surface.present ? data.surface.value : this.surface,
      statut: data.statut.present ? data.statut.value : this.statut,
      dateDebut: data.dateDebut.present ? data.dateDebut.value : this.dateDebut,
      dateFin: data.dateFin.present ? data.dateFin.value : this.dateFin,
      responsableId: data.responsableId.present
          ? data.responsableId.value
          : this.responsableId,
      notes: data.notes.present ? data.notes.value : this.notes,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
      syncedAt: data.syncedAt.present ? data.syncedAt.value : this.syncedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('ChantiersTableData(')
          ..write('id: $id, ')
          ..write('clientId: $clientId, ')
          ..write('adresse: $adresse, ')
          ..write('codePostal: $codePostal, ')
          ..write('ville: $ville, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('typePrestation: $typePrestation, ')
          ..write('description: $description, ')
          ..write('surface: $surface, ')
          ..write('statut: $statut, ')
          ..write('dateDebut: $dateDebut, ')
          ..write('dateFin: $dateFin, ')
          ..write('responsableId: $responsableId, ')
          ..write('notes: $notes, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('syncedAt: $syncedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    clientId,
    adresse,
    codePostal,
    ville,
    latitude,
    longitude,
    typePrestation,
    description,
    surface,
    statut,
    dateDebut,
    dateFin,
    responsableId,
    notes,
    createdAt,
    updatedAt,
    syncedAt,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is ChantiersTableData &&
          other.id == this.id &&
          other.clientId == this.clientId &&
          other.adresse == this.adresse &&
          other.codePostal == this.codePostal &&
          other.ville == this.ville &&
          other.latitude == this.latitude &&
          other.longitude == this.longitude &&
          other.typePrestation == this.typePrestation &&
          other.description == this.description &&
          other.surface == this.surface &&
          other.statut == this.statut &&
          other.dateDebut == this.dateDebut &&
          other.dateFin == this.dateFin &&
          other.responsableId == this.responsableId &&
          other.notes == this.notes &&
          other.createdAt == this.createdAt &&
          other.updatedAt == this.updatedAt &&
          other.syncedAt == this.syncedAt);
}

class ChantiersTableCompanion extends UpdateCompanion<ChantiersTableData> {
  final Value<String> id;
  final Value<String> clientId;
  final Value<String> adresse;
  final Value<String> codePostal;
  final Value<String> ville;
  final Value<double?> latitude;
  final Value<double?> longitude;
  final Value<String> typePrestation;
  final Value<String> description;
  final Value<double?> surface;
  final Value<String> statut;
  final Value<DateTime?> dateDebut;
  final Value<DateTime?> dateFin;
  final Value<String?> responsableId;
  final Value<String?> notes;
  final Value<DateTime> createdAt;
  final Value<DateTime> updatedAt;
  final Value<DateTime?> syncedAt;
  final Value<int> rowid;
  const ChantiersTableCompanion({
    this.id = const Value.absent(),
    this.clientId = const Value.absent(),
    this.adresse = const Value.absent(),
    this.codePostal = const Value.absent(),
    this.ville = const Value.absent(),
    this.latitude = const Value.absent(),
    this.longitude = const Value.absent(),
    this.typePrestation = const Value.absent(),
    this.description = const Value.absent(),
    this.surface = const Value.absent(),
    this.statut = const Value.absent(),
    this.dateDebut = const Value.absent(),
    this.dateFin = const Value.absent(),
    this.responsableId = const Value.absent(),
    this.notes = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  ChantiersTableCompanion.insert({
    required String id,
    required String clientId,
    required String adresse,
    required String codePostal,
    required String ville,
    this.latitude = const Value.absent(),
    this.longitude = const Value.absent(),
    this.typePrestation = const Value.absent(),
    required String description,
    this.surface = const Value.absent(),
    this.statut = const Value.absent(),
    this.dateDebut = const Value.absent(),
    this.dateFin = const Value.absent(),
    this.responsableId = const Value.absent(),
    this.notes = const Value.absent(),
    required DateTime createdAt,
    required DateTime updatedAt,
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       clientId = Value(clientId),
       adresse = Value(adresse),
       codePostal = Value(codePostal),
       ville = Value(ville),
       description = Value(description),
       createdAt = Value(createdAt),
       updatedAt = Value(updatedAt);
  static Insertable<ChantiersTableData> custom({
    Expression<String>? id,
    Expression<String>? clientId,
    Expression<String>? adresse,
    Expression<String>? codePostal,
    Expression<String>? ville,
    Expression<double>? latitude,
    Expression<double>? longitude,
    Expression<String>? typePrestation,
    Expression<String>? description,
    Expression<double>? surface,
    Expression<String>? statut,
    Expression<DateTime>? dateDebut,
    Expression<DateTime>? dateFin,
    Expression<String>? responsableId,
    Expression<String>? notes,
    Expression<DateTime>? createdAt,
    Expression<DateTime>? updatedAt,
    Expression<DateTime>? syncedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (clientId != null) 'client_id': clientId,
      if (adresse != null) 'adresse': adresse,
      if (codePostal != null) 'code_postal': codePostal,
      if (ville != null) 'ville': ville,
      if (latitude != null) 'latitude': latitude,
      if (longitude != null) 'longitude': longitude,
      if (typePrestation != null) 'type_prestation': typePrestation,
      if (description != null) 'description': description,
      if (surface != null) 'surface': surface,
      if (statut != null) 'statut': statut,
      if (dateDebut != null) 'date_debut': dateDebut,
      if (dateFin != null) 'date_fin': dateFin,
      if (responsableId != null) 'responsable_id': responsableId,
      if (notes != null) 'notes': notes,
      if (createdAt != null) 'created_at': createdAt,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (syncedAt != null) 'synced_at': syncedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  ChantiersTableCompanion copyWith({
    Value<String>? id,
    Value<String>? clientId,
    Value<String>? adresse,
    Value<String>? codePostal,
    Value<String>? ville,
    Value<double?>? latitude,
    Value<double?>? longitude,
    Value<String>? typePrestation,
    Value<String>? description,
    Value<double?>? surface,
    Value<String>? statut,
    Value<DateTime?>? dateDebut,
    Value<DateTime?>? dateFin,
    Value<String?>? responsableId,
    Value<String?>? notes,
    Value<DateTime>? createdAt,
    Value<DateTime>? updatedAt,
    Value<DateTime?>? syncedAt,
    Value<int>? rowid,
  }) {
    return ChantiersTableCompanion(
      id: id ?? this.id,
      clientId: clientId ?? this.clientId,
      adresse: adresse ?? this.adresse,
      codePostal: codePostal ?? this.codePostal,
      ville: ville ?? this.ville,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      typePrestation: typePrestation ?? this.typePrestation,
      description: description ?? this.description,
      surface: surface ?? this.surface,
      statut: statut ?? this.statut,
      dateDebut: dateDebut ?? this.dateDebut,
      dateFin: dateFin ?? this.dateFin,
      responsableId: responsableId ?? this.responsableId,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      syncedAt: syncedAt ?? this.syncedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (clientId.present) {
      map['client_id'] = Variable<String>(clientId.value);
    }
    if (adresse.present) {
      map['adresse'] = Variable<String>(adresse.value);
    }
    if (codePostal.present) {
      map['code_postal'] = Variable<String>(codePostal.value);
    }
    if (ville.present) {
      map['ville'] = Variable<String>(ville.value);
    }
    if (latitude.present) {
      map['latitude'] = Variable<double>(latitude.value);
    }
    if (longitude.present) {
      map['longitude'] = Variable<double>(longitude.value);
    }
    if (typePrestation.present) {
      map['type_prestation'] = Variable<String>(typePrestation.value);
    }
    if (description.present) {
      map['description'] = Variable<String>(description.value);
    }
    if (surface.present) {
      map['surface'] = Variable<double>(surface.value);
    }
    if (statut.present) {
      map['statut'] = Variable<String>(statut.value);
    }
    if (dateDebut.present) {
      map['date_debut'] = Variable<DateTime>(dateDebut.value);
    }
    if (dateFin.present) {
      map['date_fin'] = Variable<DateTime>(dateFin.value);
    }
    if (responsableId.present) {
      map['responsable_id'] = Variable<String>(responsableId.value);
    }
    if (notes.present) {
      map['notes'] = Variable<String>(notes.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (syncedAt.present) {
      map['synced_at'] = Variable<DateTime>(syncedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('ChantiersTableCompanion(')
          ..write('id: $id, ')
          ..write('clientId: $clientId, ')
          ..write('adresse: $adresse, ')
          ..write('codePostal: $codePostal, ')
          ..write('ville: $ville, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('typePrestation: $typePrestation, ')
          ..write('description: $description, ')
          ..write('surface: $surface, ')
          ..write('statut: $statut, ')
          ..write('dateDebut: $dateDebut, ')
          ..write('dateFin: $dateFin, ')
          ..write('responsableId: $responsableId, ')
          ..write('notes: $notes, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('syncedAt: $syncedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $InterventionsTableTable extends InterventionsTable
    with TableInfo<$InterventionsTableTable, InterventionsTableData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $InterventionsTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _chantierIdMeta = const VerificationMeta(
    'chantierId',
  );
  @override
  late final GeneratedColumn<String> chantierId = GeneratedColumn<String>(
    'chantier_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _employeIdMeta = const VerificationMeta(
    'employeId',
  );
  @override
  late final GeneratedColumn<String> employeId = GeneratedColumn<String>(
    'employe_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _dateMeta = const VerificationMeta('date');
  @override
  late final GeneratedColumn<DateTime> date = GeneratedColumn<DateTime>(
    'date',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _heureDebutMeta = const VerificationMeta(
    'heureDebut',
  );
  @override
  late final GeneratedColumn<DateTime> heureDebut = GeneratedColumn<DateTime>(
    'heure_debut',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _heureFinMeta = const VerificationMeta(
    'heureFin',
  );
  @override
  late final GeneratedColumn<DateTime> heureFin = GeneratedColumn<DateTime>(
    'heure_fin',
    aliasedName,
    true,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _dureeMinutesMeta = const VerificationMeta(
    'dureeMinutes',
  );
  @override
  late final GeneratedColumn<int> dureeMinutes = GeneratedColumn<int>(
    'duree_minutes',
    aliasedName,
    true,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _descriptionMeta = const VerificationMeta(
    'description',
  );
  @override
  late final GeneratedColumn<String> description = GeneratedColumn<String>(
    'description',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _notesMeta = const VerificationMeta('notes');
  @override
  late final GeneratedColumn<String> notes = GeneratedColumn<String>(
    'notes',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _valideMeta = const VerificationMeta('valide');
  @override
  late final GeneratedColumn<bool> valide = GeneratedColumn<bool>(
    'valide',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("valide" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  static const VerificationMeta _createdAtMeta = const VerificationMeta(
    'createdAt',
  );
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
    'created_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _updatedAtMeta = const VerificationMeta(
    'updatedAt',
  );
  @override
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
    'updated_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _syncedAtMeta = const VerificationMeta(
    'syncedAt',
  );
  @override
  late final GeneratedColumn<DateTime> syncedAt = GeneratedColumn<DateTime>(
    'synced_at',
    aliasedName,
    true,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    chantierId,
    employeId,
    date,
    heureDebut,
    heureFin,
    dureeMinutes,
    description,
    notes,
    valide,
    createdAt,
    updatedAt,
    syncedAt,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'interventions';
  @override
  VerificationContext validateIntegrity(
    Insertable<InterventionsTableData> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('chantier_id')) {
      context.handle(
        _chantierIdMeta,
        chantierId.isAcceptableOrUnknown(data['chantier_id']!, _chantierIdMeta),
      );
    } else if (isInserting) {
      context.missing(_chantierIdMeta);
    }
    if (data.containsKey('employe_id')) {
      context.handle(
        _employeIdMeta,
        employeId.isAcceptableOrUnknown(data['employe_id']!, _employeIdMeta),
      );
    } else if (isInserting) {
      context.missing(_employeIdMeta);
    }
    if (data.containsKey('date')) {
      context.handle(
        _dateMeta,
        date.isAcceptableOrUnknown(data['date']!, _dateMeta),
      );
    } else if (isInserting) {
      context.missing(_dateMeta);
    }
    if (data.containsKey('heure_debut')) {
      context.handle(
        _heureDebutMeta,
        heureDebut.isAcceptableOrUnknown(data['heure_debut']!, _heureDebutMeta),
      );
    } else if (isInserting) {
      context.missing(_heureDebutMeta);
    }
    if (data.containsKey('heure_fin')) {
      context.handle(
        _heureFinMeta,
        heureFin.isAcceptableOrUnknown(data['heure_fin']!, _heureFinMeta),
      );
    }
    if (data.containsKey('duree_minutes')) {
      context.handle(
        _dureeMinutesMeta,
        dureeMinutes.isAcceptableOrUnknown(
          data['duree_minutes']!,
          _dureeMinutesMeta,
        ),
      );
    }
    if (data.containsKey('description')) {
      context.handle(
        _descriptionMeta,
        description.isAcceptableOrUnknown(
          data['description']!,
          _descriptionMeta,
        ),
      );
    }
    if (data.containsKey('notes')) {
      context.handle(
        _notesMeta,
        notes.isAcceptableOrUnknown(data['notes']!, _notesMeta),
      );
    }
    if (data.containsKey('valide')) {
      context.handle(
        _valideMeta,
        valide.isAcceptableOrUnknown(data['valide']!, _valideMeta),
      );
    }
    if (data.containsKey('created_at')) {
      context.handle(
        _createdAtMeta,
        createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta),
      );
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(
        _updatedAtMeta,
        updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta),
      );
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('synced_at')) {
      context.handle(
        _syncedAtMeta,
        syncedAt.isAcceptableOrUnknown(data['synced_at']!, _syncedAtMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  InterventionsTableData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return InterventionsTableData(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      chantierId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}chantier_id'],
      )!,
      employeId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}employe_id'],
      )!,
      date: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}date'],
      )!,
      heureDebut: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}heure_debut'],
      )!,
      heureFin: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}heure_fin'],
      ),
      dureeMinutes: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}duree_minutes'],
      ),
      description: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}description'],
      ),
      notes: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}notes'],
      ),
      valide: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}valide'],
      )!,
      createdAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}created_at'],
      )!,
      updatedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}updated_at'],
      )!,
      syncedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}synced_at'],
      ),
    );
  }

  @override
  $InterventionsTableTable createAlias(String alias) {
    return $InterventionsTableTable(attachedDatabase, alias);
  }
}

class InterventionsTableData extends DataClass
    implements Insertable<InterventionsTableData> {
  final String id;
  final String chantierId;
  final String employeId;
  final DateTime date;
  final DateTime heureDebut;
  final DateTime? heureFin;
  final int? dureeMinutes;
  final String? description;
  final String? notes;
  final bool valide;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? syncedAt;
  const InterventionsTableData({
    required this.id,
    required this.chantierId,
    required this.employeId,
    required this.date,
    required this.heureDebut,
    this.heureFin,
    this.dureeMinutes,
    this.description,
    this.notes,
    required this.valide,
    required this.createdAt,
    required this.updatedAt,
    this.syncedAt,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['chantier_id'] = Variable<String>(chantierId);
    map['employe_id'] = Variable<String>(employeId);
    map['date'] = Variable<DateTime>(date);
    map['heure_debut'] = Variable<DateTime>(heureDebut);
    if (!nullToAbsent || heureFin != null) {
      map['heure_fin'] = Variable<DateTime>(heureFin);
    }
    if (!nullToAbsent || dureeMinutes != null) {
      map['duree_minutes'] = Variable<int>(dureeMinutes);
    }
    if (!nullToAbsent || description != null) {
      map['description'] = Variable<String>(description);
    }
    if (!nullToAbsent || notes != null) {
      map['notes'] = Variable<String>(notes);
    }
    map['valide'] = Variable<bool>(valide);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    if (!nullToAbsent || syncedAt != null) {
      map['synced_at'] = Variable<DateTime>(syncedAt);
    }
    return map;
  }

  InterventionsTableCompanion toCompanion(bool nullToAbsent) {
    return InterventionsTableCompanion(
      id: Value(id),
      chantierId: Value(chantierId),
      employeId: Value(employeId),
      date: Value(date),
      heureDebut: Value(heureDebut),
      heureFin: heureFin == null && nullToAbsent
          ? const Value.absent()
          : Value(heureFin),
      dureeMinutes: dureeMinutes == null && nullToAbsent
          ? const Value.absent()
          : Value(dureeMinutes),
      description: description == null && nullToAbsent
          ? const Value.absent()
          : Value(description),
      notes: notes == null && nullToAbsent
          ? const Value.absent()
          : Value(notes),
      valide: Value(valide),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
      syncedAt: syncedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(syncedAt),
    );
  }

  factory InterventionsTableData.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return InterventionsTableData(
      id: serializer.fromJson<String>(json['id']),
      chantierId: serializer.fromJson<String>(json['chantierId']),
      employeId: serializer.fromJson<String>(json['employeId']),
      date: serializer.fromJson<DateTime>(json['date']),
      heureDebut: serializer.fromJson<DateTime>(json['heureDebut']),
      heureFin: serializer.fromJson<DateTime?>(json['heureFin']),
      dureeMinutes: serializer.fromJson<int?>(json['dureeMinutes']),
      description: serializer.fromJson<String?>(json['description']),
      notes: serializer.fromJson<String?>(json['notes']),
      valide: serializer.fromJson<bool>(json['valide']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
      updatedAt: serializer.fromJson<DateTime>(json['updatedAt']),
      syncedAt: serializer.fromJson<DateTime?>(json['syncedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'chantierId': serializer.toJson<String>(chantierId),
      'employeId': serializer.toJson<String>(employeId),
      'date': serializer.toJson<DateTime>(date),
      'heureDebut': serializer.toJson<DateTime>(heureDebut),
      'heureFin': serializer.toJson<DateTime?>(heureFin),
      'dureeMinutes': serializer.toJson<int?>(dureeMinutes),
      'description': serializer.toJson<String?>(description),
      'notes': serializer.toJson<String?>(notes),
      'valide': serializer.toJson<bool>(valide),
      'createdAt': serializer.toJson<DateTime>(createdAt),
      'updatedAt': serializer.toJson<DateTime>(updatedAt),
      'syncedAt': serializer.toJson<DateTime?>(syncedAt),
    };
  }

  InterventionsTableData copyWith({
    String? id,
    String? chantierId,
    String? employeId,
    DateTime? date,
    DateTime? heureDebut,
    Value<DateTime?> heureFin = const Value.absent(),
    Value<int?> dureeMinutes = const Value.absent(),
    Value<String?> description = const Value.absent(),
    Value<String?> notes = const Value.absent(),
    bool? valide,
    DateTime? createdAt,
    DateTime? updatedAt,
    Value<DateTime?> syncedAt = const Value.absent(),
  }) => InterventionsTableData(
    id: id ?? this.id,
    chantierId: chantierId ?? this.chantierId,
    employeId: employeId ?? this.employeId,
    date: date ?? this.date,
    heureDebut: heureDebut ?? this.heureDebut,
    heureFin: heureFin.present ? heureFin.value : this.heureFin,
    dureeMinutes: dureeMinutes.present ? dureeMinutes.value : this.dureeMinutes,
    description: description.present ? description.value : this.description,
    notes: notes.present ? notes.value : this.notes,
    valide: valide ?? this.valide,
    createdAt: createdAt ?? this.createdAt,
    updatedAt: updatedAt ?? this.updatedAt,
    syncedAt: syncedAt.present ? syncedAt.value : this.syncedAt,
  );
  InterventionsTableData copyWithCompanion(InterventionsTableCompanion data) {
    return InterventionsTableData(
      id: data.id.present ? data.id.value : this.id,
      chantierId: data.chantierId.present
          ? data.chantierId.value
          : this.chantierId,
      employeId: data.employeId.present ? data.employeId.value : this.employeId,
      date: data.date.present ? data.date.value : this.date,
      heureDebut: data.heureDebut.present
          ? data.heureDebut.value
          : this.heureDebut,
      heureFin: data.heureFin.present ? data.heureFin.value : this.heureFin,
      dureeMinutes: data.dureeMinutes.present
          ? data.dureeMinutes.value
          : this.dureeMinutes,
      description: data.description.present
          ? data.description.value
          : this.description,
      notes: data.notes.present ? data.notes.value : this.notes,
      valide: data.valide.present ? data.valide.value : this.valide,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
      syncedAt: data.syncedAt.present ? data.syncedAt.value : this.syncedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('InterventionsTableData(')
          ..write('id: $id, ')
          ..write('chantierId: $chantierId, ')
          ..write('employeId: $employeId, ')
          ..write('date: $date, ')
          ..write('heureDebut: $heureDebut, ')
          ..write('heureFin: $heureFin, ')
          ..write('dureeMinutes: $dureeMinutes, ')
          ..write('description: $description, ')
          ..write('notes: $notes, ')
          ..write('valide: $valide, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('syncedAt: $syncedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    chantierId,
    employeId,
    date,
    heureDebut,
    heureFin,
    dureeMinutes,
    description,
    notes,
    valide,
    createdAt,
    updatedAt,
    syncedAt,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is InterventionsTableData &&
          other.id == this.id &&
          other.chantierId == this.chantierId &&
          other.employeId == this.employeId &&
          other.date == this.date &&
          other.heureDebut == this.heureDebut &&
          other.heureFin == this.heureFin &&
          other.dureeMinutes == this.dureeMinutes &&
          other.description == this.description &&
          other.notes == this.notes &&
          other.valide == this.valide &&
          other.createdAt == this.createdAt &&
          other.updatedAt == this.updatedAt &&
          other.syncedAt == this.syncedAt);
}

class InterventionsTableCompanion
    extends UpdateCompanion<InterventionsTableData> {
  final Value<String> id;
  final Value<String> chantierId;
  final Value<String> employeId;
  final Value<DateTime> date;
  final Value<DateTime> heureDebut;
  final Value<DateTime?> heureFin;
  final Value<int?> dureeMinutes;
  final Value<String?> description;
  final Value<String?> notes;
  final Value<bool> valide;
  final Value<DateTime> createdAt;
  final Value<DateTime> updatedAt;
  final Value<DateTime?> syncedAt;
  final Value<int> rowid;
  const InterventionsTableCompanion({
    this.id = const Value.absent(),
    this.chantierId = const Value.absent(),
    this.employeId = const Value.absent(),
    this.date = const Value.absent(),
    this.heureDebut = const Value.absent(),
    this.heureFin = const Value.absent(),
    this.dureeMinutes = const Value.absent(),
    this.description = const Value.absent(),
    this.notes = const Value.absent(),
    this.valide = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  InterventionsTableCompanion.insert({
    required String id,
    required String chantierId,
    required String employeId,
    required DateTime date,
    required DateTime heureDebut,
    this.heureFin = const Value.absent(),
    this.dureeMinutes = const Value.absent(),
    this.description = const Value.absent(),
    this.notes = const Value.absent(),
    this.valide = const Value.absent(),
    required DateTime createdAt,
    required DateTime updatedAt,
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       chantierId = Value(chantierId),
       employeId = Value(employeId),
       date = Value(date),
       heureDebut = Value(heureDebut),
       createdAt = Value(createdAt),
       updatedAt = Value(updatedAt);
  static Insertable<InterventionsTableData> custom({
    Expression<String>? id,
    Expression<String>? chantierId,
    Expression<String>? employeId,
    Expression<DateTime>? date,
    Expression<DateTime>? heureDebut,
    Expression<DateTime>? heureFin,
    Expression<int>? dureeMinutes,
    Expression<String>? description,
    Expression<String>? notes,
    Expression<bool>? valide,
    Expression<DateTime>? createdAt,
    Expression<DateTime>? updatedAt,
    Expression<DateTime>? syncedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (chantierId != null) 'chantier_id': chantierId,
      if (employeId != null) 'employe_id': employeId,
      if (date != null) 'date': date,
      if (heureDebut != null) 'heure_debut': heureDebut,
      if (heureFin != null) 'heure_fin': heureFin,
      if (dureeMinutes != null) 'duree_minutes': dureeMinutes,
      if (description != null) 'description': description,
      if (notes != null) 'notes': notes,
      if (valide != null) 'valide': valide,
      if (createdAt != null) 'created_at': createdAt,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (syncedAt != null) 'synced_at': syncedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  InterventionsTableCompanion copyWith({
    Value<String>? id,
    Value<String>? chantierId,
    Value<String>? employeId,
    Value<DateTime>? date,
    Value<DateTime>? heureDebut,
    Value<DateTime?>? heureFin,
    Value<int?>? dureeMinutes,
    Value<String?>? description,
    Value<String?>? notes,
    Value<bool>? valide,
    Value<DateTime>? createdAt,
    Value<DateTime>? updatedAt,
    Value<DateTime?>? syncedAt,
    Value<int>? rowid,
  }) {
    return InterventionsTableCompanion(
      id: id ?? this.id,
      chantierId: chantierId ?? this.chantierId,
      employeId: employeId ?? this.employeId,
      date: date ?? this.date,
      heureDebut: heureDebut ?? this.heureDebut,
      heureFin: heureFin ?? this.heureFin,
      dureeMinutes: dureeMinutes ?? this.dureeMinutes,
      description: description ?? this.description,
      notes: notes ?? this.notes,
      valide: valide ?? this.valide,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      syncedAt: syncedAt ?? this.syncedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (chantierId.present) {
      map['chantier_id'] = Variable<String>(chantierId.value);
    }
    if (employeId.present) {
      map['employe_id'] = Variable<String>(employeId.value);
    }
    if (date.present) {
      map['date'] = Variable<DateTime>(date.value);
    }
    if (heureDebut.present) {
      map['heure_debut'] = Variable<DateTime>(heureDebut.value);
    }
    if (heureFin.present) {
      map['heure_fin'] = Variable<DateTime>(heureFin.value);
    }
    if (dureeMinutes.present) {
      map['duree_minutes'] = Variable<int>(dureeMinutes.value);
    }
    if (description.present) {
      map['description'] = Variable<String>(description.value);
    }
    if (notes.present) {
      map['notes'] = Variable<String>(notes.value);
    }
    if (valide.present) {
      map['valide'] = Variable<bool>(valide.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (syncedAt.present) {
      map['synced_at'] = Variable<DateTime>(syncedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('InterventionsTableCompanion(')
          ..write('id: $id, ')
          ..write('chantierId: $chantierId, ')
          ..write('employeId: $employeId, ')
          ..write('date: $date, ')
          ..write('heureDebut: $heureDebut, ')
          ..write('heureFin: $heureFin, ')
          ..write('dureeMinutes: $dureeMinutes, ')
          ..write('description: $description, ')
          ..write('notes: $notes, ')
          ..write('valide: $valide, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('syncedAt: $syncedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $DevisTableTable extends DevisTable
    with TableInfo<$DevisTableTable, DevisTableData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $DevisTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _chantierIdMeta = const VerificationMeta(
    'chantierId',
  );
  @override
  late final GeneratedColumn<String> chantierId = GeneratedColumn<String>(
    'chantier_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _numeroMeta = const VerificationMeta('numero');
  @override
  late final GeneratedColumn<String> numero = GeneratedColumn<String>(
    'numero',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _dateEmissionMeta = const VerificationMeta(
    'dateEmission',
  );
  @override
  late final GeneratedColumn<DateTime> dateEmission = GeneratedColumn<DateTime>(
    'date_emission',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _dateValiditeMeta = const VerificationMeta(
    'dateValidite',
  );
  @override
  late final GeneratedColumn<DateTime> dateValidite = GeneratedColumn<DateTime>(
    'date_validite',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _totalHTMeta = const VerificationMeta(
    'totalHT',
  );
  @override
  late final GeneratedColumn<double> totalHT = GeneratedColumn<double>(
    'total_h_t',
    aliasedName,
    false,
    type: DriftSqlType.double,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _totalTVAMeta = const VerificationMeta(
    'totalTVA',
  );
  @override
  late final GeneratedColumn<double> totalTVA = GeneratedColumn<double>(
    'total_t_v_a',
    aliasedName,
    false,
    type: DriftSqlType.double,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _totalTTCMeta = const VerificationMeta(
    'totalTTC',
  );
  @override
  late final GeneratedColumn<double> totalTTC = GeneratedColumn<double>(
    'total_t_t_c',
    aliasedName,
    false,
    type: DriftSqlType.double,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _statutMeta = const VerificationMeta('statut');
  @override
  late final GeneratedColumn<String> statut = GeneratedColumn<String>(
    'statut',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('brouillon'),
  );
  static const VerificationMeta _pdfUrlMeta = const VerificationMeta('pdfUrl');
  @override
  late final GeneratedColumn<String> pdfUrl = GeneratedColumn<String>(
    'pdf_url',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _notesMeta = const VerificationMeta('notes');
  @override
  late final GeneratedColumn<String> notes = GeneratedColumn<String>(
    'notes',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _createdAtMeta = const VerificationMeta(
    'createdAt',
  );
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
    'created_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _updatedAtMeta = const VerificationMeta(
    'updatedAt',
  );
  @override
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
    'updated_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _syncedAtMeta = const VerificationMeta(
    'syncedAt',
  );
  @override
  late final GeneratedColumn<DateTime> syncedAt = GeneratedColumn<DateTime>(
    'synced_at',
    aliasedName,
    true,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    chantierId,
    numero,
    dateEmission,
    dateValidite,
    totalHT,
    totalTVA,
    totalTTC,
    statut,
    pdfUrl,
    notes,
    createdAt,
    updatedAt,
    syncedAt,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'devis';
  @override
  VerificationContext validateIntegrity(
    Insertable<DevisTableData> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('chantier_id')) {
      context.handle(
        _chantierIdMeta,
        chantierId.isAcceptableOrUnknown(data['chantier_id']!, _chantierIdMeta),
      );
    } else if (isInserting) {
      context.missing(_chantierIdMeta);
    }
    if (data.containsKey('numero')) {
      context.handle(
        _numeroMeta,
        numero.isAcceptableOrUnknown(data['numero']!, _numeroMeta),
      );
    } else if (isInserting) {
      context.missing(_numeroMeta);
    }
    if (data.containsKey('date_emission')) {
      context.handle(
        _dateEmissionMeta,
        dateEmission.isAcceptableOrUnknown(
          data['date_emission']!,
          _dateEmissionMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_dateEmissionMeta);
    }
    if (data.containsKey('date_validite')) {
      context.handle(
        _dateValiditeMeta,
        dateValidite.isAcceptableOrUnknown(
          data['date_validite']!,
          _dateValiditeMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_dateValiditeMeta);
    }
    if (data.containsKey('total_h_t')) {
      context.handle(
        _totalHTMeta,
        totalHT.isAcceptableOrUnknown(data['total_h_t']!, _totalHTMeta),
      );
    } else if (isInserting) {
      context.missing(_totalHTMeta);
    }
    if (data.containsKey('total_t_v_a')) {
      context.handle(
        _totalTVAMeta,
        totalTVA.isAcceptableOrUnknown(data['total_t_v_a']!, _totalTVAMeta),
      );
    } else if (isInserting) {
      context.missing(_totalTVAMeta);
    }
    if (data.containsKey('total_t_t_c')) {
      context.handle(
        _totalTTCMeta,
        totalTTC.isAcceptableOrUnknown(data['total_t_t_c']!, _totalTTCMeta),
      );
    } else if (isInserting) {
      context.missing(_totalTTCMeta);
    }
    if (data.containsKey('statut')) {
      context.handle(
        _statutMeta,
        statut.isAcceptableOrUnknown(data['statut']!, _statutMeta),
      );
    }
    if (data.containsKey('pdf_url')) {
      context.handle(
        _pdfUrlMeta,
        pdfUrl.isAcceptableOrUnknown(data['pdf_url']!, _pdfUrlMeta),
      );
    }
    if (data.containsKey('notes')) {
      context.handle(
        _notesMeta,
        notes.isAcceptableOrUnknown(data['notes']!, _notesMeta),
      );
    }
    if (data.containsKey('created_at')) {
      context.handle(
        _createdAtMeta,
        createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta),
      );
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(
        _updatedAtMeta,
        updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta),
      );
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('synced_at')) {
      context.handle(
        _syncedAtMeta,
        syncedAt.isAcceptableOrUnknown(data['synced_at']!, _syncedAtMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  DevisTableData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return DevisTableData(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      chantierId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}chantier_id'],
      )!,
      numero: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}numero'],
      )!,
      dateEmission: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}date_emission'],
      )!,
      dateValidite: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}date_validite'],
      )!,
      totalHT: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}total_h_t'],
      )!,
      totalTVA: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}total_t_v_a'],
      )!,
      totalTTC: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}total_t_t_c'],
      )!,
      statut: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}statut'],
      )!,
      pdfUrl: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}pdf_url'],
      ),
      notes: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}notes'],
      ),
      createdAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}created_at'],
      )!,
      updatedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}updated_at'],
      )!,
      syncedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}synced_at'],
      ),
    );
  }

  @override
  $DevisTableTable createAlias(String alias) {
    return $DevisTableTable(attachedDatabase, alias);
  }
}

class DevisTableData extends DataClass implements Insertable<DevisTableData> {
  final String id;
  final String chantierId;
  final String numero;
  final DateTime dateEmission;
  final DateTime dateValidite;
  final double totalHT;
  final double totalTVA;
  final double totalTTC;
  final String statut;
  final String? pdfUrl;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? syncedAt;
  const DevisTableData({
    required this.id,
    required this.chantierId,
    required this.numero,
    required this.dateEmission,
    required this.dateValidite,
    required this.totalHT,
    required this.totalTVA,
    required this.totalTTC,
    required this.statut,
    this.pdfUrl,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
    this.syncedAt,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['chantier_id'] = Variable<String>(chantierId);
    map['numero'] = Variable<String>(numero);
    map['date_emission'] = Variable<DateTime>(dateEmission);
    map['date_validite'] = Variable<DateTime>(dateValidite);
    map['total_h_t'] = Variable<double>(totalHT);
    map['total_t_v_a'] = Variable<double>(totalTVA);
    map['total_t_t_c'] = Variable<double>(totalTTC);
    map['statut'] = Variable<String>(statut);
    if (!nullToAbsent || pdfUrl != null) {
      map['pdf_url'] = Variable<String>(pdfUrl);
    }
    if (!nullToAbsent || notes != null) {
      map['notes'] = Variable<String>(notes);
    }
    map['created_at'] = Variable<DateTime>(createdAt);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    if (!nullToAbsent || syncedAt != null) {
      map['synced_at'] = Variable<DateTime>(syncedAt);
    }
    return map;
  }

  DevisTableCompanion toCompanion(bool nullToAbsent) {
    return DevisTableCompanion(
      id: Value(id),
      chantierId: Value(chantierId),
      numero: Value(numero),
      dateEmission: Value(dateEmission),
      dateValidite: Value(dateValidite),
      totalHT: Value(totalHT),
      totalTVA: Value(totalTVA),
      totalTTC: Value(totalTTC),
      statut: Value(statut),
      pdfUrl: pdfUrl == null && nullToAbsent
          ? const Value.absent()
          : Value(pdfUrl),
      notes: notes == null && nullToAbsent
          ? const Value.absent()
          : Value(notes),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
      syncedAt: syncedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(syncedAt),
    );
  }

  factory DevisTableData.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return DevisTableData(
      id: serializer.fromJson<String>(json['id']),
      chantierId: serializer.fromJson<String>(json['chantierId']),
      numero: serializer.fromJson<String>(json['numero']),
      dateEmission: serializer.fromJson<DateTime>(json['dateEmission']),
      dateValidite: serializer.fromJson<DateTime>(json['dateValidite']),
      totalHT: serializer.fromJson<double>(json['totalHT']),
      totalTVA: serializer.fromJson<double>(json['totalTVA']),
      totalTTC: serializer.fromJson<double>(json['totalTTC']),
      statut: serializer.fromJson<String>(json['statut']),
      pdfUrl: serializer.fromJson<String?>(json['pdfUrl']),
      notes: serializer.fromJson<String?>(json['notes']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
      updatedAt: serializer.fromJson<DateTime>(json['updatedAt']),
      syncedAt: serializer.fromJson<DateTime?>(json['syncedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'chantierId': serializer.toJson<String>(chantierId),
      'numero': serializer.toJson<String>(numero),
      'dateEmission': serializer.toJson<DateTime>(dateEmission),
      'dateValidite': serializer.toJson<DateTime>(dateValidite),
      'totalHT': serializer.toJson<double>(totalHT),
      'totalTVA': serializer.toJson<double>(totalTVA),
      'totalTTC': serializer.toJson<double>(totalTTC),
      'statut': serializer.toJson<String>(statut),
      'pdfUrl': serializer.toJson<String?>(pdfUrl),
      'notes': serializer.toJson<String?>(notes),
      'createdAt': serializer.toJson<DateTime>(createdAt),
      'updatedAt': serializer.toJson<DateTime>(updatedAt),
      'syncedAt': serializer.toJson<DateTime?>(syncedAt),
    };
  }

  DevisTableData copyWith({
    String? id,
    String? chantierId,
    String? numero,
    DateTime? dateEmission,
    DateTime? dateValidite,
    double? totalHT,
    double? totalTVA,
    double? totalTTC,
    String? statut,
    Value<String?> pdfUrl = const Value.absent(),
    Value<String?> notes = const Value.absent(),
    DateTime? createdAt,
    DateTime? updatedAt,
    Value<DateTime?> syncedAt = const Value.absent(),
  }) => DevisTableData(
    id: id ?? this.id,
    chantierId: chantierId ?? this.chantierId,
    numero: numero ?? this.numero,
    dateEmission: dateEmission ?? this.dateEmission,
    dateValidite: dateValidite ?? this.dateValidite,
    totalHT: totalHT ?? this.totalHT,
    totalTVA: totalTVA ?? this.totalTVA,
    totalTTC: totalTTC ?? this.totalTTC,
    statut: statut ?? this.statut,
    pdfUrl: pdfUrl.present ? pdfUrl.value : this.pdfUrl,
    notes: notes.present ? notes.value : this.notes,
    createdAt: createdAt ?? this.createdAt,
    updatedAt: updatedAt ?? this.updatedAt,
    syncedAt: syncedAt.present ? syncedAt.value : this.syncedAt,
  );
  DevisTableData copyWithCompanion(DevisTableCompanion data) {
    return DevisTableData(
      id: data.id.present ? data.id.value : this.id,
      chantierId: data.chantierId.present
          ? data.chantierId.value
          : this.chantierId,
      numero: data.numero.present ? data.numero.value : this.numero,
      dateEmission: data.dateEmission.present
          ? data.dateEmission.value
          : this.dateEmission,
      dateValidite: data.dateValidite.present
          ? data.dateValidite.value
          : this.dateValidite,
      totalHT: data.totalHT.present ? data.totalHT.value : this.totalHT,
      totalTVA: data.totalTVA.present ? data.totalTVA.value : this.totalTVA,
      totalTTC: data.totalTTC.present ? data.totalTTC.value : this.totalTTC,
      statut: data.statut.present ? data.statut.value : this.statut,
      pdfUrl: data.pdfUrl.present ? data.pdfUrl.value : this.pdfUrl,
      notes: data.notes.present ? data.notes.value : this.notes,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
      syncedAt: data.syncedAt.present ? data.syncedAt.value : this.syncedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('DevisTableData(')
          ..write('id: $id, ')
          ..write('chantierId: $chantierId, ')
          ..write('numero: $numero, ')
          ..write('dateEmission: $dateEmission, ')
          ..write('dateValidite: $dateValidite, ')
          ..write('totalHT: $totalHT, ')
          ..write('totalTVA: $totalTVA, ')
          ..write('totalTTC: $totalTTC, ')
          ..write('statut: $statut, ')
          ..write('pdfUrl: $pdfUrl, ')
          ..write('notes: $notes, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('syncedAt: $syncedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    chantierId,
    numero,
    dateEmission,
    dateValidite,
    totalHT,
    totalTVA,
    totalTTC,
    statut,
    pdfUrl,
    notes,
    createdAt,
    updatedAt,
    syncedAt,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is DevisTableData &&
          other.id == this.id &&
          other.chantierId == this.chantierId &&
          other.numero == this.numero &&
          other.dateEmission == this.dateEmission &&
          other.dateValidite == this.dateValidite &&
          other.totalHT == this.totalHT &&
          other.totalTVA == this.totalTVA &&
          other.totalTTC == this.totalTTC &&
          other.statut == this.statut &&
          other.pdfUrl == this.pdfUrl &&
          other.notes == this.notes &&
          other.createdAt == this.createdAt &&
          other.updatedAt == this.updatedAt &&
          other.syncedAt == this.syncedAt);
}

class DevisTableCompanion extends UpdateCompanion<DevisTableData> {
  final Value<String> id;
  final Value<String> chantierId;
  final Value<String> numero;
  final Value<DateTime> dateEmission;
  final Value<DateTime> dateValidite;
  final Value<double> totalHT;
  final Value<double> totalTVA;
  final Value<double> totalTTC;
  final Value<String> statut;
  final Value<String?> pdfUrl;
  final Value<String?> notes;
  final Value<DateTime> createdAt;
  final Value<DateTime> updatedAt;
  final Value<DateTime?> syncedAt;
  final Value<int> rowid;
  const DevisTableCompanion({
    this.id = const Value.absent(),
    this.chantierId = const Value.absent(),
    this.numero = const Value.absent(),
    this.dateEmission = const Value.absent(),
    this.dateValidite = const Value.absent(),
    this.totalHT = const Value.absent(),
    this.totalTVA = const Value.absent(),
    this.totalTTC = const Value.absent(),
    this.statut = const Value.absent(),
    this.pdfUrl = const Value.absent(),
    this.notes = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  DevisTableCompanion.insert({
    required String id,
    required String chantierId,
    required String numero,
    required DateTime dateEmission,
    required DateTime dateValidite,
    required double totalHT,
    required double totalTVA,
    required double totalTTC,
    this.statut = const Value.absent(),
    this.pdfUrl = const Value.absent(),
    this.notes = const Value.absent(),
    required DateTime createdAt,
    required DateTime updatedAt,
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       chantierId = Value(chantierId),
       numero = Value(numero),
       dateEmission = Value(dateEmission),
       dateValidite = Value(dateValidite),
       totalHT = Value(totalHT),
       totalTVA = Value(totalTVA),
       totalTTC = Value(totalTTC),
       createdAt = Value(createdAt),
       updatedAt = Value(updatedAt);
  static Insertable<DevisTableData> custom({
    Expression<String>? id,
    Expression<String>? chantierId,
    Expression<String>? numero,
    Expression<DateTime>? dateEmission,
    Expression<DateTime>? dateValidite,
    Expression<double>? totalHT,
    Expression<double>? totalTVA,
    Expression<double>? totalTTC,
    Expression<String>? statut,
    Expression<String>? pdfUrl,
    Expression<String>? notes,
    Expression<DateTime>? createdAt,
    Expression<DateTime>? updatedAt,
    Expression<DateTime>? syncedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (chantierId != null) 'chantier_id': chantierId,
      if (numero != null) 'numero': numero,
      if (dateEmission != null) 'date_emission': dateEmission,
      if (dateValidite != null) 'date_validite': dateValidite,
      if (totalHT != null) 'total_h_t': totalHT,
      if (totalTVA != null) 'total_t_v_a': totalTVA,
      if (totalTTC != null) 'total_t_t_c': totalTTC,
      if (statut != null) 'statut': statut,
      if (pdfUrl != null) 'pdf_url': pdfUrl,
      if (notes != null) 'notes': notes,
      if (createdAt != null) 'created_at': createdAt,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (syncedAt != null) 'synced_at': syncedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  DevisTableCompanion copyWith({
    Value<String>? id,
    Value<String>? chantierId,
    Value<String>? numero,
    Value<DateTime>? dateEmission,
    Value<DateTime>? dateValidite,
    Value<double>? totalHT,
    Value<double>? totalTVA,
    Value<double>? totalTTC,
    Value<String>? statut,
    Value<String?>? pdfUrl,
    Value<String?>? notes,
    Value<DateTime>? createdAt,
    Value<DateTime>? updatedAt,
    Value<DateTime?>? syncedAt,
    Value<int>? rowid,
  }) {
    return DevisTableCompanion(
      id: id ?? this.id,
      chantierId: chantierId ?? this.chantierId,
      numero: numero ?? this.numero,
      dateEmission: dateEmission ?? this.dateEmission,
      dateValidite: dateValidite ?? this.dateValidite,
      totalHT: totalHT ?? this.totalHT,
      totalTVA: totalTVA ?? this.totalTVA,
      totalTTC: totalTTC ?? this.totalTTC,
      statut: statut ?? this.statut,
      pdfUrl: pdfUrl ?? this.pdfUrl,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      syncedAt: syncedAt ?? this.syncedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (chantierId.present) {
      map['chantier_id'] = Variable<String>(chantierId.value);
    }
    if (numero.present) {
      map['numero'] = Variable<String>(numero.value);
    }
    if (dateEmission.present) {
      map['date_emission'] = Variable<DateTime>(dateEmission.value);
    }
    if (dateValidite.present) {
      map['date_validite'] = Variable<DateTime>(dateValidite.value);
    }
    if (totalHT.present) {
      map['total_h_t'] = Variable<double>(totalHT.value);
    }
    if (totalTVA.present) {
      map['total_t_v_a'] = Variable<double>(totalTVA.value);
    }
    if (totalTTC.present) {
      map['total_t_t_c'] = Variable<double>(totalTTC.value);
    }
    if (statut.present) {
      map['statut'] = Variable<String>(statut.value);
    }
    if (pdfUrl.present) {
      map['pdf_url'] = Variable<String>(pdfUrl.value);
    }
    if (notes.present) {
      map['notes'] = Variable<String>(notes.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (syncedAt.present) {
      map['synced_at'] = Variable<DateTime>(syncedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('DevisTableCompanion(')
          ..write('id: $id, ')
          ..write('chantierId: $chantierId, ')
          ..write('numero: $numero, ')
          ..write('dateEmission: $dateEmission, ')
          ..write('dateValidite: $dateValidite, ')
          ..write('totalHT: $totalHT, ')
          ..write('totalTVA: $totalTVA, ')
          ..write('totalTTC: $totalTTC, ')
          ..write('statut: $statut, ')
          ..write('pdfUrl: $pdfUrl, ')
          ..write('notes: $notes, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('syncedAt: $syncedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $FacturesTableTable extends FacturesTable
    with TableInfo<$FacturesTableTable, FacturesTableData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $FacturesTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _devisIdMeta = const VerificationMeta(
    'devisId',
  );
  @override
  late final GeneratedColumn<String> devisId = GeneratedColumn<String>(
    'devis_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _numeroMeta = const VerificationMeta('numero');
  @override
  late final GeneratedColumn<String> numero = GeneratedColumn<String>(
    'numero',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _dateEmissionMeta = const VerificationMeta(
    'dateEmission',
  );
  @override
  late final GeneratedColumn<DateTime> dateEmission = GeneratedColumn<DateTime>(
    'date_emission',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _dateEcheanceMeta = const VerificationMeta(
    'dateEcheance',
  );
  @override
  late final GeneratedColumn<DateTime> dateEcheance = GeneratedColumn<DateTime>(
    'date_echeance',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _datePaiementMeta = const VerificationMeta(
    'datePaiement',
  );
  @override
  late final GeneratedColumn<DateTime> datePaiement = GeneratedColumn<DateTime>(
    'date_paiement',
    aliasedName,
    true,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _totalHTMeta = const VerificationMeta(
    'totalHT',
  );
  @override
  late final GeneratedColumn<double> totalHT = GeneratedColumn<double>(
    'total_h_t',
    aliasedName,
    false,
    type: DriftSqlType.double,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _totalTVAMeta = const VerificationMeta(
    'totalTVA',
  );
  @override
  late final GeneratedColumn<double> totalTVA = GeneratedColumn<double>(
    'total_t_v_a',
    aliasedName,
    false,
    type: DriftSqlType.double,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _totalTTCMeta = const VerificationMeta(
    'totalTTC',
  );
  @override
  late final GeneratedColumn<double> totalTTC = GeneratedColumn<double>(
    'total_t_t_c',
    aliasedName,
    false,
    type: DriftSqlType.double,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _statutMeta = const VerificationMeta('statut');
  @override
  late final GeneratedColumn<String> statut = GeneratedColumn<String>(
    'statut',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('brouillon'),
  );
  static const VerificationMeta _modePaiementMeta = const VerificationMeta(
    'modePaiement',
  );
  @override
  late final GeneratedColumn<String> modePaiement = GeneratedColumn<String>(
    'mode_paiement',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _pdfUrlMeta = const VerificationMeta('pdfUrl');
  @override
  late final GeneratedColumn<String> pdfUrl = GeneratedColumn<String>(
    'pdf_url',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _notesMeta = const VerificationMeta('notes');
  @override
  late final GeneratedColumn<String> notes = GeneratedColumn<String>(
    'notes',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _createdAtMeta = const VerificationMeta(
    'createdAt',
  );
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
    'created_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _updatedAtMeta = const VerificationMeta(
    'updatedAt',
  );
  @override
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
    'updated_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _syncedAtMeta = const VerificationMeta(
    'syncedAt',
  );
  @override
  late final GeneratedColumn<DateTime> syncedAt = GeneratedColumn<DateTime>(
    'synced_at',
    aliasedName,
    true,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    devisId,
    numero,
    dateEmission,
    dateEcheance,
    datePaiement,
    totalHT,
    totalTVA,
    totalTTC,
    statut,
    modePaiement,
    pdfUrl,
    notes,
    createdAt,
    updatedAt,
    syncedAt,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'factures';
  @override
  VerificationContext validateIntegrity(
    Insertable<FacturesTableData> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('devis_id')) {
      context.handle(
        _devisIdMeta,
        devisId.isAcceptableOrUnknown(data['devis_id']!, _devisIdMeta),
      );
    } else if (isInserting) {
      context.missing(_devisIdMeta);
    }
    if (data.containsKey('numero')) {
      context.handle(
        _numeroMeta,
        numero.isAcceptableOrUnknown(data['numero']!, _numeroMeta),
      );
    } else if (isInserting) {
      context.missing(_numeroMeta);
    }
    if (data.containsKey('date_emission')) {
      context.handle(
        _dateEmissionMeta,
        dateEmission.isAcceptableOrUnknown(
          data['date_emission']!,
          _dateEmissionMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_dateEmissionMeta);
    }
    if (data.containsKey('date_echeance')) {
      context.handle(
        _dateEcheanceMeta,
        dateEcheance.isAcceptableOrUnknown(
          data['date_echeance']!,
          _dateEcheanceMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_dateEcheanceMeta);
    }
    if (data.containsKey('date_paiement')) {
      context.handle(
        _datePaiementMeta,
        datePaiement.isAcceptableOrUnknown(
          data['date_paiement']!,
          _datePaiementMeta,
        ),
      );
    }
    if (data.containsKey('total_h_t')) {
      context.handle(
        _totalHTMeta,
        totalHT.isAcceptableOrUnknown(data['total_h_t']!, _totalHTMeta),
      );
    } else if (isInserting) {
      context.missing(_totalHTMeta);
    }
    if (data.containsKey('total_t_v_a')) {
      context.handle(
        _totalTVAMeta,
        totalTVA.isAcceptableOrUnknown(data['total_t_v_a']!, _totalTVAMeta),
      );
    } else if (isInserting) {
      context.missing(_totalTVAMeta);
    }
    if (data.containsKey('total_t_t_c')) {
      context.handle(
        _totalTTCMeta,
        totalTTC.isAcceptableOrUnknown(data['total_t_t_c']!, _totalTTCMeta),
      );
    } else if (isInserting) {
      context.missing(_totalTTCMeta);
    }
    if (data.containsKey('statut')) {
      context.handle(
        _statutMeta,
        statut.isAcceptableOrUnknown(data['statut']!, _statutMeta),
      );
    }
    if (data.containsKey('mode_paiement')) {
      context.handle(
        _modePaiementMeta,
        modePaiement.isAcceptableOrUnknown(
          data['mode_paiement']!,
          _modePaiementMeta,
        ),
      );
    }
    if (data.containsKey('pdf_url')) {
      context.handle(
        _pdfUrlMeta,
        pdfUrl.isAcceptableOrUnknown(data['pdf_url']!, _pdfUrlMeta),
      );
    }
    if (data.containsKey('notes')) {
      context.handle(
        _notesMeta,
        notes.isAcceptableOrUnknown(data['notes']!, _notesMeta),
      );
    }
    if (data.containsKey('created_at')) {
      context.handle(
        _createdAtMeta,
        createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta),
      );
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(
        _updatedAtMeta,
        updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta),
      );
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('synced_at')) {
      context.handle(
        _syncedAtMeta,
        syncedAt.isAcceptableOrUnknown(data['synced_at']!, _syncedAtMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  FacturesTableData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return FacturesTableData(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      devisId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}devis_id'],
      )!,
      numero: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}numero'],
      )!,
      dateEmission: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}date_emission'],
      )!,
      dateEcheance: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}date_echeance'],
      )!,
      datePaiement: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}date_paiement'],
      ),
      totalHT: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}total_h_t'],
      )!,
      totalTVA: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}total_t_v_a'],
      )!,
      totalTTC: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}total_t_t_c'],
      )!,
      statut: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}statut'],
      )!,
      modePaiement: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}mode_paiement'],
      ),
      pdfUrl: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}pdf_url'],
      ),
      notes: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}notes'],
      ),
      createdAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}created_at'],
      )!,
      updatedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}updated_at'],
      )!,
      syncedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}synced_at'],
      ),
    );
  }

  @override
  $FacturesTableTable createAlias(String alias) {
    return $FacturesTableTable(attachedDatabase, alias);
  }
}

class FacturesTableData extends DataClass
    implements Insertable<FacturesTableData> {
  final String id;
  final String devisId;
  final String numero;
  final DateTime dateEmission;
  final DateTime dateEcheance;
  final DateTime? datePaiement;
  final double totalHT;
  final double totalTVA;
  final double totalTTC;
  final String statut;
  final String? modePaiement;
  final String? pdfUrl;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? syncedAt;
  const FacturesTableData({
    required this.id,
    required this.devisId,
    required this.numero,
    required this.dateEmission,
    required this.dateEcheance,
    this.datePaiement,
    required this.totalHT,
    required this.totalTVA,
    required this.totalTTC,
    required this.statut,
    this.modePaiement,
    this.pdfUrl,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
    this.syncedAt,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['devis_id'] = Variable<String>(devisId);
    map['numero'] = Variable<String>(numero);
    map['date_emission'] = Variable<DateTime>(dateEmission);
    map['date_echeance'] = Variable<DateTime>(dateEcheance);
    if (!nullToAbsent || datePaiement != null) {
      map['date_paiement'] = Variable<DateTime>(datePaiement);
    }
    map['total_h_t'] = Variable<double>(totalHT);
    map['total_t_v_a'] = Variable<double>(totalTVA);
    map['total_t_t_c'] = Variable<double>(totalTTC);
    map['statut'] = Variable<String>(statut);
    if (!nullToAbsent || modePaiement != null) {
      map['mode_paiement'] = Variable<String>(modePaiement);
    }
    if (!nullToAbsent || pdfUrl != null) {
      map['pdf_url'] = Variable<String>(pdfUrl);
    }
    if (!nullToAbsent || notes != null) {
      map['notes'] = Variable<String>(notes);
    }
    map['created_at'] = Variable<DateTime>(createdAt);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    if (!nullToAbsent || syncedAt != null) {
      map['synced_at'] = Variable<DateTime>(syncedAt);
    }
    return map;
  }

  FacturesTableCompanion toCompanion(bool nullToAbsent) {
    return FacturesTableCompanion(
      id: Value(id),
      devisId: Value(devisId),
      numero: Value(numero),
      dateEmission: Value(dateEmission),
      dateEcheance: Value(dateEcheance),
      datePaiement: datePaiement == null && nullToAbsent
          ? const Value.absent()
          : Value(datePaiement),
      totalHT: Value(totalHT),
      totalTVA: Value(totalTVA),
      totalTTC: Value(totalTTC),
      statut: Value(statut),
      modePaiement: modePaiement == null && nullToAbsent
          ? const Value.absent()
          : Value(modePaiement),
      pdfUrl: pdfUrl == null && nullToAbsent
          ? const Value.absent()
          : Value(pdfUrl),
      notes: notes == null && nullToAbsent
          ? const Value.absent()
          : Value(notes),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
      syncedAt: syncedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(syncedAt),
    );
  }

  factory FacturesTableData.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return FacturesTableData(
      id: serializer.fromJson<String>(json['id']),
      devisId: serializer.fromJson<String>(json['devisId']),
      numero: serializer.fromJson<String>(json['numero']),
      dateEmission: serializer.fromJson<DateTime>(json['dateEmission']),
      dateEcheance: serializer.fromJson<DateTime>(json['dateEcheance']),
      datePaiement: serializer.fromJson<DateTime?>(json['datePaiement']),
      totalHT: serializer.fromJson<double>(json['totalHT']),
      totalTVA: serializer.fromJson<double>(json['totalTVA']),
      totalTTC: serializer.fromJson<double>(json['totalTTC']),
      statut: serializer.fromJson<String>(json['statut']),
      modePaiement: serializer.fromJson<String?>(json['modePaiement']),
      pdfUrl: serializer.fromJson<String?>(json['pdfUrl']),
      notes: serializer.fromJson<String?>(json['notes']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
      updatedAt: serializer.fromJson<DateTime>(json['updatedAt']),
      syncedAt: serializer.fromJson<DateTime?>(json['syncedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'devisId': serializer.toJson<String>(devisId),
      'numero': serializer.toJson<String>(numero),
      'dateEmission': serializer.toJson<DateTime>(dateEmission),
      'dateEcheance': serializer.toJson<DateTime>(dateEcheance),
      'datePaiement': serializer.toJson<DateTime?>(datePaiement),
      'totalHT': serializer.toJson<double>(totalHT),
      'totalTVA': serializer.toJson<double>(totalTVA),
      'totalTTC': serializer.toJson<double>(totalTTC),
      'statut': serializer.toJson<String>(statut),
      'modePaiement': serializer.toJson<String?>(modePaiement),
      'pdfUrl': serializer.toJson<String?>(pdfUrl),
      'notes': serializer.toJson<String?>(notes),
      'createdAt': serializer.toJson<DateTime>(createdAt),
      'updatedAt': serializer.toJson<DateTime>(updatedAt),
      'syncedAt': serializer.toJson<DateTime?>(syncedAt),
    };
  }

  FacturesTableData copyWith({
    String? id,
    String? devisId,
    String? numero,
    DateTime? dateEmission,
    DateTime? dateEcheance,
    Value<DateTime?> datePaiement = const Value.absent(),
    double? totalHT,
    double? totalTVA,
    double? totalTTC,
    String? statut,
    Value<String?> modePaiement = const Value.absent(),
    Value<String?> pdfUrl = const Value.absent(),
    Value<String?> notes = const Value.absent(),
    DateTime? createdAt,
    DateTime? updatedAt,
    Value<DateTime?> syncedAt = const Value.absent(),
  }) => FacturesTableData(
    id: id ?? this.id,
    devisId: devisId ?? this.devisId,
    numero: numero ?? this.numero,
    dateEmission: dateEmission ?? this.dateEmission,
    dateEcheance: dateEcheance ?? this.dateEcheance,
    datePaiement: datePaiement.present ? datePaiement.value : this.datePaiement,
    totalHT: totalHT ?? this.totalHT,
    totalTVA: totalTVA ?? this.totalTVA,
    totalTTC: totalTTC ?? this.totalTTC,
    statut: statut ?? this.statut,
    modePaiement: modePaiement.present ? modePaiement.value : this.modePaiement,
    pdfUrl: pdfUrl.present ? pdfUrl.value : this.pdfUrl,
    notes: notes.present ? notes.value : this.notes,
    createdAt: createdAt ?? this.createdAt,
    updatedAt: updatedAt ?? this.updatedAt,
    syncedAt: syncedAt.present ? syncedAt.value : this.syncedAt,
  );
  FacturesTableData copyWithCompanion(FacturesTableCompanion data) {
    return FacturesTableData(
      id: data.id.present ? data.id.value : this.id,
      devisId: data.devisId.present ? data.devisId.value : this.devisId,
      numero: data.numero.present ? data.numero.value : this.numero,
      dateEmission: data.dateEmission.present
          ? data.dateEmission.value
          : this.dateEmission,
      dateEcheance: data.dateEcheance.present
          ? data.dateEcheance.value
          : this.dateEcheance,
      datePaiement: data.datePaiement.present
          ? data.datePaiement.value
          : this.datePaiement,
      totalHT: data.totalHT.present ? data.totalHT.value : this.totalHT,
      totalTVA: data.totalTVA.present ? data.totalTVA.value : this.totalTVA,
      totalTTC: data.totalTTC.present ? data.totalTTC.value : this.totalTTC,
      statut: data.statut.present ? data.statut.value : this.statut,
      modePaiement: data.modePaiement.present
          ? data.modePaiement.value
          : this.modePaiement,
      pdfUrl: data.pdfUrl.present ? data.pdfUrl.value : this.pdfUrl,
      notes: data.notes.present ? data.notes.value : this.notes,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
      syncedAt: data.syncedAt.present ? data.syncedAt.value : this.syncedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('FacturesTableData(')
          ..write('id: $id, ')
          ..write('devisId: $devisId, ')
          ..write('numero: $numero, ')
          ..write('dateEmission: $dateEmission, ')
          ..write('dateEcheance: $dateEcheance, ')
          ..write('datePaiement: $datePaiement, ')
          ..write('totalHT: $totalHT, ')
          ..write('totalTVA: $totalTVA, ')
          ..write('totalTTC: $totalTTC, ')
          ..write('statut: $statut, ')
          ..write('modePaiement: $modePaiement, ')
          ..write('pdfUrl: $pdfUrl, ')
          ..write('notes: $notes, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('syncedAt: $syncedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    devisId,
    numero,
    dateEmission,
    dateEcheance,
    datePaiement,
    totalHT,
    totalTVA,
    totalTTC,
    statut,
    modePaiement,
    pdfUrl,
    notes,
    createdAt,
    updatedAt,
    syncedAt,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is FacturesTableData &&
          other.id == this.id &&
          other.devisId == this.devisId &&
          other.numero == this.numero &&
          other.dateEmission == this.dateEmission &&
          other.dateEcheance == this.dateEcheance &&
          other.datePaiement == this.datePaiement &&
          other.totalHT == this.totalHT &&
          other.totalTVA == this.totalTVA &&
          other.totalTTC == this.totalTTC &&
          other.statut == this.statut &&
          other.modePaiement == this.modePaiement &&
          other.pdfUrl == this.pdfUrl &&
          other.notes == this.notes &&
          other.createdAt == this.createdAt &&
          other.updatedAt == this.updatedAt &&
          other.syncedAt == this.syncedAt);
}

class FacturesTableCompanion extends UpdateCompanion<FacturesTableData> {
  final Value<String> id;
  final Value<String> devisId;
  final Value<String> numero;
  final Value<DateTime> dateEmission;
  final Value<DateTime> dateEcheance;
  final Value<DateTime?> datePaiement;
  final Value<double> totalHT;
  final Value<double> totalTVA;
  final Value<double> totalTTC;
  final Value<String> statut;
  final Value<String?> modePaiement;
  final Value<String?> pdfUrl;
  final Value<String?> notes;
  final Value<DateTime> createdAt;
  final Value<DateTime> updatedAt;
  final Value<DateTime?> syncedAt;
  final Value<int> rowid;
  const FacturesTableCompanion({
    this.id = const Value.absent(),
    this.devisId = const Value.absent(),
    this.numero = const Value.absent(),
    this.dateEmission = const Value.absent(),
    this.dateEcheance = const Value.absent(),
    this.datePaiement = const Value.absent(),
    this.totalHT = const Value.absent(),
    this.totalTVA = const Value.absent(),
    this.totalTTC = const Value.absent(),
    this.statut = const Value.absent(),
    this.modePaiement = const Value.absent(),
    this.pdfUrl = const Value.absent(),
    this.notes = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  FacturesTableCompanion.insert({
    required String id,
    required String devisId,
    required String numero,
    required DateTime dateEmission,
    required DateTime dateEcheance,
    this.datePaiement = const Value.absent(),
    required double totalHT,
    required double totalTVA,
    required double totalTTC,
    this.statut = const Value.absent(),
    this.modePaiement = const Value.absent(),
    this.pdfUrl = const Value.absent(),
    this.notes = const Value.absent(),
    required DateTime createdAt,
    required DateTime updatedAt,
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       devisId = Value(devisId),
       numero = Value(numero),
       dateEmission = Value(dateEmission),
       dateEcheance = Value(dateEcheance),
       totalHT = Value(totalHT),
       totalTVA = Value(totalTVA),
       totalTTC = Value(totalTTC),
       createdAt = Value(createdAt),
       updatedAt = Value(updatedAt);
  static Insertable<FacturesTableData> custom({
    Expression<String>? id,
    Expression<String>? devisId,
    Expression<String>? numero,
    Expression<DateTime>? dateEmission,
    Expression<DateTime>? dateEcheance,
    Expression<DateTime>? datePaiement,
    Expression<double>? totalHT,
    Expression<double>? totalTVA,
    Expression<double>? totalTTC,
    Expression<String>? statut,
    Expression<String>? modePaiement,
    Expression<String>? pdfUrl,
    Expression<String>? notes,
    Expression<DateTime>? createdAt,
    Expression<DateTime>? updatedAt,
    Expression<DateTime>? syncedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (devisId != null) 'devis_id': devisId,
      if (numero != null) 'numero': numero,
      if (dateEmission != null) 'date_emission': dateEmission,
      if (dateEcheance != null) 'date_echeance': dateEcheance,
      if (datePaiement != null) 'date_paiement': datePaiement,
      if (totalHT != null) 'total_h_t': totalHT,
      if (totalTVA != null) 'total_t_v_a': totalTVA,
      if (totalTTC != null) 'total_t_t_c': totalTTC,
      if (statut != null) 'statut': statut,
      if (modePaiement != null) 'mode_paiement': modePaiement,
      if (pdfUrl != null) 'pdf_url': pdfUrl,
      if (notes != null) 'notes': notes,
      if (createdAt != null) 'created_at': createdAt,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (syncedAt != null) 'synced_at': syncedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  FacturesTableCompanion copyWith({
    Value<String>? id,
    Value<String>? devisId,
    Value<String>? numero,
    Value<DateTime>? dateEmission,
    Value<DateTime>? dateEcheance,
    Value<DateTime?>? datePaiement,
    Value<double>? totalHT,
    Value<double>? totalTVA,
    Value<double>? totalTTC,
    Value<String>? statut,
    Value<String?>? modePaiement,
    Value<String?>? pdfUrl,
    Value<String?>? notes,
    Value<DateTime>? createdAt,
    Value<DateTime>? updatedAt,
    Value<DateTime?>? syncedAt,
    Value<int>? rowid,
  }) {
    return FacturesTableCompanion(
      id: id ?? this.id,
      devisId: devisId ?? this.devisId,
      numero: numero ?? this.numero,
      dateEmission: dateEmission ?? this.dateEmission,
      dateEcheance: dateEcheance ?? this.dateEcheance,
      datePaiement: datePaiement ?? this.datePaiement,
      totalHT: totalHT ?? this.totalHT,
      totalTVA: totalTVA ?? this.totalTVA,
      totalTTC: totalTTC ?? this.totalTTC,
      statut: statut ?? this.statut,
      modePaiement: modePaiement ?? this.modePaiement,
      pdfUrl: pdfUrl ?? this.pdfUrl,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      syncedAt: syncedAt ?? this.syncedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (devisId.present) {
      map['devis_id'] = Variable<String>(devisId.value);
    }
    if (numero.present) {
      map['numero'] = Variable<String>(numero.value);
    }
    if (dateEmission.present) {
      map['date_emission'] = Variable<DateTime>(dateEmission.value);
    }
    if (dateEcheance.present) {
      map['date_echeance'] = Variable<DateTime>(dateEcheance.value);
    }
    if (datePaiement.present) {
      map['date_paiement'] = Variable<DateTime>(datePaiement.value);
    }
    if (totalHT.present) {
      map['total_h_t'] = Variable<double>(totalHT.value);
    }
    if (totalTVA.present) {
      map['total_t_v_a'] = Variable<double>(totalTVA.value);
    }
    if (totalTTC.present) {
      map['total_t_t_c'] = Variable<double>(totalTTC.value);
    }
    if (statut.present) {
      map['statut'] = Variable<String>(statut.value);
    }
    if (modePaiement.present) {
      map['mode_paiement'] = Variable<String>(modePaiement.value);
    }
    if (pdfUrl.present) {
      map['pdf_url'] = Variable<String>(pdfUrl.value);
    }
    if (notes.present) {
      map['notes'] = Variable<String>(notes.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (syncedAt.present) {
      map['synced_at'] = Variable<DateTime>(syncedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('FacturesTableCompanion(')
          ..write('id: $id, ')
          ..write('devisId: $devisId, ')
          ..write('numero: $numero, ')
          ..write('dateEmission: $dateEmission, ')
          ..write('dateEcheance: $dateEcheance, ')
          ..write('datePaiement: $datePaiement, ')
          ..write('totalHT: $totalHT, ')
          ..write('totalTVA: $totalTVA, ')
          ..write('totalTTC: $totalTTC, ')
          ..write('statut: $statut, ')
          ..write('modePaiement: $modePaiement, ')
          ..write('pdfUrl: $pdfUrl, ')
          ..write('notes: $notes, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('syncedAt: $syncedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $AbsencesTableTable extends AbsencesTable
    with TableInfo<$AbsencesTableTable, AbsencesTableData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $AbsencesTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _userIdMeta = const VerificationMeta('userId');
  @override
  late final GeneratedColumn<String> userId = GeneratedColumn<String>(
    'user_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _dateDebutMeta = const VerificationMeta(
    'dateDebut',
  );
  @override
  late final GeneratedColumn<DateTime> dateDebut = GeneratedColumn<DateTime>(
    'date_debut',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _dateFinMeta = const VerificationMeta(
    'dateFin',
  );
  @override
  late final GeneratedColumn<DateTime> dateFin = GeneratedColumn<DateTime>(
    'date_fin',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _typeMeta = const VerificationMeta('type');
  @override
  late final GeneratedColumn<String> type = GeneratedColumn<String>(
    'type',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _motifMeta = const VerificationMeta('motif');
  @override
  late final GeneratedColumn<String> motif = GeneratedColumn<String>(
    'motif',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _valideeMeta = const VerificationMeta(
    'validee',
  );
  @override
  late final GeneratedColumn<bool> validee = GeneratedColumn<bool>(
    'validee',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("validee" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  static const VerificationMeta _createdAtMeta = const VerificationMeta(
    'createdAt',
  );
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
    'created_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _updatedAtMeta = const VerificationMeta(
    'updatedAt',
  );
  @override
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
    'updated_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _syncedAtMeta = const VerificationMeta(
    'syncedAt',
  );
  @override
  late final GeneratedColumn<DateTime> syncedAt = GeneratedColumn<DateTime>(
    'synced_at',
    aliasedName,
    true,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    userId,
    dateDebut,
    dateFin,
    type,
    motif,
    validee,
    createdAt,
    updatedAt,
    syncedAt,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'absences';
  @override
  VerificationContext validateIntegrity(
    Insertable<AbsencesTableData> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('user_id')) {
      context.handle(
        _userIdMeta,
        userId.isAcceptableOrUnknown(data['user_id']!, _userIdMeta),
      );
    } else if (isInserting) {
      context.missing(_userIdMeta);
    }
    if (data.containsKey('date_debut')) {
      context.handle(
        _dateDebutMeta,
        dateDebut.isAcceptableOrUnknown(data['date_debut']!, _dateDebutMeta),
      );
    } else if (isInserting) {
      context.missing(_dateDebutMeta);
    }
    if (data.containsKey('date_fin')) {
      context.handle(
        _dateFinMeta,
        dateFin.isAcceptableOrUnknown(data['date_fin']!, _dateFinMeta),
      );
    } else if (isInserting) {
      context.missing(_dateFinMeta);
    }
    if (data.containsKey('type')) {
      context.handle(
        _typeMeta,
        type.isAcceptableOrUnknown(data['type']!, _typeMeta),
      );
    } else if (isInserting) {
      context.missing(_typeMeta);
    }
    if (data.containsKey('motif')) {
      context.handle(
        _motifMeta,
        motif.isAcceptableOrUnknown(data['motif']!, _motifMeta),
      );
    }
    if (data.containsKey('validee')) {
      context.handle(
        _valideeMeta,
        validee.isAcceptableOrUnknown(data['validee']!, _valideeMeta),
      );
    }
    if (data.containsKey('created_at')) {
      context.handle(
        _createdAtMeta,
        createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta),
      );
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(
        _updatedAtMeta,
        updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta),
      );
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('synced_at')) {
      context.handle(
        _syncedAtMeta,
        syncedAt.isAcceptableOrUnknown(data['synced_at']!, _syncedAtMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  AbsencesTableData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return AbsencesTableData(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      userId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}user_id'],
      )!,
      dateDebut: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}date_debut'],
      )!,
      dateFin: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}date_fin'],
      )!,
      type: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}type'],
      )!,
      motif: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}motif'],
      ),
      validee: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}validee'],
      )!,
      createdAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}created_at'],
      )!,
      updatedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}updated_at'],
      )!,
      syncedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}synced_at'],
      ),
    );
  }

  @override
  $AbsencesTableTable createAlias(String alias) {
    return $AbsencesTableTable(attachedDatabase, alias);
  }
}

class AbsencesTableData extends DataClass
    implements Insertable<AbsencesTableData> {
  final String id;
  final String userId;
  final DateTime dateDebut;
  final DateTime dateFin;
  final String type;
  final String? motif;
  final bool validee;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? syncedAt;
  const AbsencesTableData({
    required this.id,
    required this.userId,
    required this.dateDebut,
    required this.dateFin,
    required this.type,
    this.motif,
    required this.validee,
    required this.createdAt,
    required this.updatedAt,
    this.syncedAt,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['user_id'] = Variable<String>(userId);
    map['date_debut'] = Variable<DateTime>(dateDebut);
    map['date_fin'] = Variable<DateTime>(dateFin);
    map['type'] = Variable<String>(type);
    if (!nullToAbsent || motif != null) {
      map['motif'] = Variable<String>(motif);
    }
    map['validee'] = Variable<bool>(validee);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    if (!nullToAbsent || syncedAt != null) {
      map['synced_at'] = Variable<DateTime>(syncedAt);
    }
    return map;
  }

  AbsencesTableCompanion toCompanion(bool nullToAbsent) {
    return AbsencesTableCompanion(
      id: Value(id),
      userId: Value(userId),
      dateDebut: Value(dateDebut),
      dateFin: Value(dateFin),
      type: Value(type),
      motif: motif == null && nullToAbsent
          ? const Value.absent()
          : Value(motif),
      validee: Value(validee),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
      syncedAt: syncedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(syncedAt),
    );
  }

  factory AbsencesTableData.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return AbsencesTableData(
      id: serializer.fromJson<String>(json['id']),
      userId: serializer.fromJson<String>(json['userId']),
      dateDebut: serializer.fromJson<DateTime>(json['dateDebut']),
      dateFin: serializer.fromJson<DateTime>(json['dateFin']),
      type: serializer.fromJson<String>(json['type']),
      motif: serializer.fromJson<String?>(json['motif']),
      validee: serializer.fromJson<bool>(json['validee']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
      updatedAt: serializer.fromJson<DateTime>(json['updatedAt']),
      syncedAt: serializer.fromJson<DateTime?>(json['syncedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'userId': serializer.toJson<String>(userId),
      'dateDebut': serializer.toJson<DateTime>(dateDebut),
      'dateFin': serializer.toJson<DateTime>(dateFin),
      'type': serializer.toJson<String>(type),
      'motif': serializer.toJson<String?>(motif),
      'validee': serializer.toJson<bool>(validee),
      'createdAt': serializer.toJson<DateTime>(createdAt),
      'updatedAt': serializer.toJson<DateTime>(updatedAt),
      'syncedAt': serializer.toJson<DateTime?>(syncedAt),
    };
  }

  AbsencesTableData copyWith({
    String? id,
    String? userId,
    DateTime? dateDebut,
    DateTime? dateFin,
    String? type,
    Value<String?> motif = const Value.absent(),
    bool? validee,
    DateTime? createdAt,
    DateTime? updatedAt,
    Value<DateTime?> syncedAt = const Value.absent(),
  }) => AbsencesTableData(
    id: id ?? this.id,
    userId: userId ?? this.userId,
    dateDebut: dateDebut ?? this.dateDebut,
    dateFin: dateFin ?? this.dateFin,
    type: type ?? this.type,
    motif: motif.present ? motif.value : this.motif,
    validee: validee ?? this.validee,
    createdAt: createdAt ?? this.createdAt,
    updatedAt: updatedAt ?? this.updatedAt,
    syncedAt: syncedAt.present ? syncedAt.value : this.syncedAt,
  );
  AbsencesTableData copyWithCompanion(AbsencesTableCompanion data) {
    return AbsencesTableData(
      id: data.id.present ? data.id.value : this.id,
      userId: data.userId.present ? data.userId.value : this.userId,
      dateDebut: data.dateDebut.present ? data.dateDebut.value : this.dateDebut,
      dateFin: data.dateFin.present ? data.dateFin.value : this.dateFin,
      type: data.type.present ? data.type.value : this.type,
      motif: data.motif.present ? data.motif.value : this.motif,
      validee: data.validee.present ? data.validee.value : this.validee,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
      syncedAt: data.syncedAt.present ? data.syncedAt.value : this.syncedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('AbsencesTableData(')
          ..write('id: $id, ')
          ..write('userId: $userId, ')
          ..write('dateDebut: $dateDebut, ')
          ..write('dateFin: $dateFin, ')
          ..write('type: $type, ')
          ..write('motif: $motif, ')
          ..write('validee: $validee, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('syncedAt: $syncedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    userId,
    dateDebut,
    dateFin,
    type,
    motif,
    validee,
    createdAt,
    updatedAt,
    syncedAt,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is AbsencesTableData &&
          other.id == this.id &&
          other.userId == this.userId &&
          other.dateDebut == this.dateDebut &&
          other.dateFin == this.dateFin &&
          other.type == this.type &&
          other.motif == this.motif &&
          other.validee == this.validee &&
          other.createdAt == this.createdAt &&
          other.updatedAt == this.updatedAt &&
          other.syncedAt == this.syncedAt);
}

class AbsencesTableCompanion extends UpdateCompanion<AbsencesTableData> {
  final Value<String> id;
  final Value<String> userId;
  final Value<DateTime> dateDebut;
  final Value<DateTime> dateFin;
  final Value<String> type;
  final Value<String?> motif;
  final Value<bool> validee;
  final Value<DateTime> createdAt;
  final Value<DateTime> updatedAt;
  final Value<DateTime?> syncedAt;
  final Value<int> rowid;
  const AbsencesTableCompanion({
    this.id = const Value.absent(),
    this.userId = const Value.absent(),
    this.dateDebut = const Value.absent(),
    this.dateFin = const Value.absent(),
    this.type = const Value.absent(),
    this.motif = const Value.absent(),
    this.validee = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  AbsencesTableCompanion.insert({
    required String id,
    required String userId,
    required DateTime dateDebut,
    required DateTime dateFin,
    required String type,
    this.motif = const Value.absent(),
    this.validee = const Value.absent(),
    required DateTime createdAt,
    required DateTime updatedAt,
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       userId = Value(userId),
       dateDebut = Value(dateDebut),
       dateFin = Value(dateFin),
       type = Value(type),
       createdAt = Value(createdAt),
       updatedAt = Value(updatedAt);
  static Insertable<AbsencesTableData> custom({
    Expression<String>? id,
    Expression<String>? userId,
    Expression<DateTime>? dateDebut,
    Expression<DateTime>? dateFin,
    Expression<String>? type,
    Expression<String>? motif,
    Expression<bool>? validee,
    Expression<DateTime>? createdAt,
    Expression<DateTime>? updatedAt,
    Expression<DateTime>? syncedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (userId != null) 'user_id': userId,
      if (dateDebut != null) 'date_debut': dateDebut,
      if (dateFin != null) 'date_fin': dateFin,
      if (type != null) 'type': type,
      if (motif != null) 'motif': motif,
      if (validee != null) 'validee': validee,
      if (createdAt != null) 'created_at': createdAt,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (syncedAt != null) 'synced_at': syncedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  AbsencesTableCompanion copyWith({
    Value<String>? id,
    Value<String>? userId,
    Value<DateTime>? dateDebut,
    Value<DateTime>? dateFin,
    Value<String>? type,
    Value<String?>? motif,
    Value<bool>? validee,
    Value<DateTime>? createdAt,
    Value<DateTime>? updatedAt,
    Value<DateTime?>? syncedAt,
    Value<int>? rowid,
  }) {
    return AbsencesTableCompanion(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      dateDebut: dateDebut ?? this.dateDebut,
      dateFin: dateFin ?? this.dateFin,
      type: type ?? this.type,
      motif: motif ?? this.motif,
      validee: validee ?? this.validee,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      syncedAt: syncedAt ?? this.syncedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (userId.present) {
      map['user_id'] = Variable<String>(userId.value);
    }
    if (dateDebut.present) {
      map['date_debut'] = Variable<DateTime>(dateDebut.value);
    }
    if (dateFin.present) {
      map['date_fin'] = Variable<DateTime>(dateFin.value);
    }
    if (type.present) {
      map['type'] = Variable<String>(type.value);
    }
    if (motif.present) {
      map['motif'] = Variable<String>(motif.value);
    }
    if (validee.present) {
      map['validee'] = Variable<bool>(validee.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (syncedAt.present) {
      map['synced_at'] = Variable<DateTime>(syncedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('AbsencesTableCompanion(')
          ..write('id: $id, ')
          ..write('userId: $userId, ')
          ..write('dateDebut: $dateDebut, ')
          ..write('dateFin: $dateFin, ')
          ..write('type: $type, ')
          ..write('motif: $motif, ')
          ..write('validee: $validee, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('syncedAt: $syncedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $SyncQueueTableTable extends SyncQueueTable
    with TableInfo<$SyncQueueTableTable, SyncQueueTableData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $SyncQueueTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
    'id',
    aliasedName,
    false,
    hasAutoIncrement: true,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'PRIMARY KEY AUTOINCREMENT',
    ),
  );
  static const VerificationMeta _operationMeta = const VerificationMeta(
    'operation',
  );
  @override
  late final GeneratedColumn<String> operation = GeneratedColumn<String>(
    'operation',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _entityMeta = const VerificationMeta('entity');
  @override
  late final GeneratedColumn<String> entity = GeneratedColumn<String>(
    'entity',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _entityIdMeta = const VerificationMeta(
    'entityId',
  );
  @override
  late final GeneratedColumn<String> entityId = GeneratedColumn<String>(
    'entity_id',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _dataMeta = const VerificationMeta('data');
  @override
  late final GeneratedColumn<String> data = GeneratedColumn<String>(
    'data',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _timestampMeta = const VerificationMeta(
    'timestamp',
  );
  @override
  late final GeneratedColumn<int> timestamp = GeneratedColumn<int>(
    'timestamp',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _retryCountMeta = const VerificationMeta(
    'retryCount',
  );
  @override
  late final GeneratedColumn<int> retryCount = GeneratedColumn<int>(
    'retry_count',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0),
  );
  static const VerificationMeta _lastErrorMeta = const VerificationMeta(
    'lastError',
  );
  @override
  late final GeneratedColumn<String> lastError = GeneratedColumn<String>(
    'last_error',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
    'status',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('pending'),
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    operation,
    entity,
    entityId,
    data,
    timestamp,
    retryCount,
    lastError,
    status,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'sync_queue';
  @override
  VerificationContext validateIntegrity(
    Insertable<SyncQueueTableData> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('operation')) {
      context.handle(
        _operationMeta,
        operation.isAcceptableOrUnknown(data['operation']!, _operationMeta),
      );
    } else if (isInserting) {
      context.missing(_operationMeta);
    }
    if (data.containsKey('entity')) {
      context.handle(
        _entityMeta,
        entity.isAcceptableOrUnknown(data['entity']!, _entityMeta),
      );
    } else if (isInserting) {
      context.missing(_entityMeta);
    }
    if (data.containsKey('entity_id')) {
      context.handle(
        _entityIdMeta,
        entityId.isAcceptableOrUnknown(data['entity_id']!, _entityIdMeta),
      );
    }
    if (data.containsKey('data')) {
      context.handle(
        _dataMeta,
        this.data.isAcceptableOrUnknown(data['data']!, _dataMeta),
      );
    } else if (isInserting) {
      context.missing(_dataMeta);
    }
    if (data.containsKey('timestamp')) {
      context.handle(
        _timestampMeta,
        timestamp.isAcceptableOrUnknown(data['timestamp']!, _timestampMeta),
      );
    } else if (isInserting) {
      context.missing(_timestampMeta);
    }
    if (data.containsKey('retry_count')) {
      context.handle(
        _retryCountMeta,
        retryCount.isAcceptableOrUnknown(data['retry_count']!, _retryCountMeta),
      );
    }
    if (data.containsKey('last_error')) {
      context.handle(
        _lastErrorMeta,
        lastError.isAcceptableOrUnknown(data['last_error']!, _lastErrorMeta),
      );
    }
    if (data.containsKey('status')) {
      context.handle(
        _statusMeta,
        status.isAcceptableOrUnknown(data['status']!, _statusMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  SyncQueueTableData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return SyncQueueTableData(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}id'],
      )!,
      operation: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}operation'],
      )!,
      entity: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}entity'],
      )!,
      entityId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}entity_id'],
      ),
      data: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}data'],
      )!,
      timestamp: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}timestamp'],
      )!,
      retryCount: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}retry_count'],
      )!,
      lastError: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}last_error'],
      ),
      status: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}status'],
      )!,
    );
  }

  @override
  $SyncQueueTableTable createAlias(String alias) {
    return $SyncQueueTableTable(attachedDatabase, alias);
  }
}

class SyncQueueTableData extends DataClass
    implements Insertable<SyncQueueTableData> {
  final int id;
  final String operation;
  final String entity;
  final String? entityId;
  final String data;
  final int timestamp;
  final int retryCount;
  final String? lastError;
  final String status;
  const SyncQueueTableData({
    required this.id,
    required this.operation,
    required this.entity,
    this.entityId,
    required this.data,
    required this.timestamp,
    required this.retryCount,
    this.lastError,
    required this.status,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['operation'] = Variable<String>(operation);
    map['entity'] = Variable<String>(entity);
    if (!nullToAbsent || entityId != null) {
      map['entity_id'] = Variable<String>(entityId);
    }
    map['data'] = Variable<String>(data);
    map['timestamp'] = Variable<int>(timestamp);
    map['retry_count'] = Variable<int>(retryCount);
    if (!nullToAbsent || lastError != null) {
      map['last_error'] = Variable<String>(lastError);
    }
    map['status'] = Variable<String>(status);
    return map;
  }

  SyncQueueTableCompanion toCompanion(bool nullToAbsent) {
    return SyncQueueTableCompanion(
      id: Value(id),
      operation: Value(operation),
      entity: Value(entity),
      entityId: entityId == null && nullToAbsent
          ? const Value.absent()
          : Value(entityId),
      data: Value(data),
      timestamp: Value(timestamp),
      retryCount: Value(retryCount),
      lastError: lastError == null && nullToAbsent
          ? const Value.absent()
          : Value(lastError),
      status: Value(status),
    );
  }

  factory SyncQueueTableData.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return SyncQueueTableData(
      id: serializer.fromJson<int>(json['id']),
      operation: serializer.fromJson<String>(json['operation']),
      entity: serializer.fromJson<String>(json['entity']),
      entityId: serializer.fromJson<String?>(json['entityId']),
      data: serializer.fromJson<String>(json['data']),
      timestamp: serializer.fromJson<int>(json['timestamp']),
      retryCount: serializer.fromJson<int>(json['retryCount']),
      lastError: serializer.fromJson<String?>(json['lastError']),
      status: serializer.fromJson<String>(json['status']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'operation': serializer.toJson<String>(operation),
      'entity': serializer.toJson<String>(entity),
      'entityId': serializer.toJson<String?>(entityId),
      'data': serializer.toJson<String>(data),
      'timestamp': serializer.toJson<int>(timestamp),
      'retryCount': serializer.toJson<int>(retryCount),
      'lastError': serializer.toJson<String?>(lastError),
      'status': serializer.toJson<String>(status),
    };
  }

  SyncQueueTableData copyWith({
    int? id,
    String? operation,
    String? entity,
    Value<String?> entityId = const Value.absent(),
    String? data,
    int? timestamp,
    int? retryCount,
    Value<String?> lastError = const Value.absent(),
    String? status,
  }) => SyncQueueTableData(
    id: id ?? this.id,
    operation: operation ?? this.operation,
    entity: entity ?? this.entity,
    entityId: entityId.present ? entityId.value : this.entityId,
    data: data ?? this.data,
    timestamp: timestamp ?? this.timestamp,
    retryCount: retryCount ?? this.retryCount,
    lastError: lastError.present ? lastError.value : this.lastError,
    status: status ?? this.status,
  );
  SyncQueueTableData copyWithCompanion(SyncQueueTableCompanion data) {
    return SyncQueueTableData(
      id: data.id.present ? data.id.value : this.id,
      operation: data.operation.present ? data.operation.value : this.operation,
      entity: data.entity.present ? data.entity.value : this.entity,
      entityId: data.entityId.present ? data.entityId.value : this.entityId,
      data: data.data.present ? data.data.value : this.data,
      timestamp: data.timestamp.present ? data.timestamp.value : this.timestamp,
      retryCount: data.retryCount.present
          ? data.retryCount.value
          : this.retryCount,
      lastError: data.lastError.present ? data.lastError.value : this.lastError,
      status: data.status.present ? data.status.value : this.status,
    );
  }

  @override
  String toString() {
    return (StringBuffer('SyncQueueTableData(')
          ..write('id: $id, ')
          ..write('operation: $operation, ')
          ..write('entity: $entity, ')
          ..write('entityId: $entityId, ')
          ..write('data: $data, ')
          ..write('timestamp: $timestamp, ')
          ..write('retryCount: $retryCount, ')
          ..write('lastError: $lastError, ')
          ..write('status: $status')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    operation,
    entity,
    entityId,
    data,
    timestamp,
    retryCount,
    lastError,
    status,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is SyncQueueTableData &&
          other.id == this.id &&
          other.operation == this.operation &&
          other.entity == this.entity &&
          other.entityId == this.entityId &&
          other.data == this.data &&
          other.timestamp == this.timestamp &&
          other.retryCount == this.retryCount &&
          other.lastError == this.lastError &&
          other.status == this.status);
}

class SyncQueueTableCompanion extends UpdateCompanion<SyncQueueTableData> {
  final Value<int> id;
  final Value<String> operation;
  final Value<String> entity;
  final Value<String?> entityId;
  final Value<String> data;
  final Value<int> timestamp;
  final Value<int> retryCount;
  final Value<String?> lastError;
  final Value<String> status;
  const SyncQueueTableCompanion({
    this.id = const Value.absent(),
    this.operation = const Value.absent(),
    this.entity = const Value.absent(),
    this.entityId = const Value.absent(),
    this.data = const Value.absent(),
    this.timestamp = const Value.absent(),
    this.retryCount = const Value.absent(),
    this.lastError = const Value.absent(),
    this.status = const Value.absent(),
  });
  SyncQueueTableCompanion.insert({
    this.id = const Value.absent(),
    required String operation,
    required String entity,
    this.entityId = const Value.absent(),
    required String data,
    required int timestamp,
    this.retryCount = const Value.absent(),
    this.lastError = const Value.absent(),
    this.status = const Value.absent(),
  }) : operation = Value(operation),
       entity = Value(entity),
       data = Value(data),
       timestamp = Value(timestamp);
  static Insertable<SyncQueueTableData> custom({
    Expression<int>? id,
    Expression<String>? operation,
    Expression<String>? entity,
    Expression<String>? entityId,
    Expression<String>? data,
    Expression<int>? timestamp,
    Expression<int>? retryCount,
    Expression<String>? lastError,
    Expression<String>? status,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (operation != null) 'operation': operation,
      if (entity != null) 'entity': entity,
      if (entityId != null) 'entity_id': entityId,
      if (data != null) 'data': data,
      if (timestamp != null) 'timestamp': timestamp,
      if (retryCount != null) 'retry_count': retryCount,
      if (lastError != null) 'last_error': lastError,
      if (status != null) 'status': status,
    });
  }

  SyncQueueTableCompanion copyWith({
    Value<int>? id,
    Value<String>? operation,
    Value<String>? entity,
    Value<String?>? entityId,
    Value<String>? data,
    Value<int>? timestamp,
    Value<int>? retryCount,
    Value<String?>? lastError,
    Value<String>? status,
  }) {
    return SyncQueueTableCompanion(
      id: id ?? this.id,
      operation: operation ?? this.operation,
      entity: entity ?? this.entity,
      entityId: entityId ?? this.entityId,
      data: data ?? this.data,
      timestamp: timestamp ?? this.timestamp,
      retryCount: retryCount ?? this.retryCount,
      lastError: lastError ?? this.lastError,
      status: status ?? this.status,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (operation.present) {
      map['operation'] = Variable<String>(operation.value);
    }
    if (entity.present) {
      map['entity'] = Variable<String>(entity.value);
    }
    if (entityId.present) {
      map['entity_id'] = Variable<String>(entityId.value);
    }
    if (data.present) {
      map['data'] = Variable<String>(data.value);
    }
    if (timestamp.present) {
      map['timestamp'] = Variable<int>(timestamp.value);
    }
    if (retryCount.present) {
      map['retry_count'] = Variable<int>(retryCount.value);
    }
    if (lastError.present) {
      map['last_error'] = Variable<String>(lastError.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('SyncQueueTableCompanion(')
          ..write('id: $id, ')
          ..write('operation: $operation, ')
          ..write('entity: $entity, ')
          ..write('entityId: $entityId, ')
          ..write('data: $data, ')
          ..write('timestamp: $timestamp, ')
          ..write('retryCount: $retryCount, ')
          ..write('lastError: $lastError, ')
          ..write('status: $status')
          ..write(')'))
        .toString();
  }
}

class $SyncMetaTableTable extends SyncMetaTable
    with TableInfo<$SyncMetaTableTable, SyncMetaTableData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $SyncMetaTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _entityMeta = const VerificationMeta('entity');
  @override
  late final GeneratedColumn<String> entity = GeneratedColumn<String>(
    'entity',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _lastSyncAtMeta = const VerificationMeta(
    'lastSyncAt',
  );
  @override
  late final GeneratedColumn<DateTime> lastSyncAt = GeneratedColumn<DateTime>(
    'last_sync_at',
    aliasedName,
    true,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _lastSyncCursorMeta = const VerificationMeta(
    'lastSyncCursor',
  );
  @override
  late final GeneratedColumn<String> lastSyncCursor = GeneratedColumn<String>(
    'last_sync_cursor',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _totalSyncedMeta = const VerificationMeta(
    'totalSynced',
  );
  @override
  late final GeneratedColumn<int> totalSynced = GeneratedColumn<int>(
    'total_synced',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0),
  );
  @override
  List<GeneratedColumn> get $columns => [
    entity,
    lastSyncAt,
    lastSyncCursor,
    totalSynced,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'sync_meta';
  @override
  VerificationContext validateIntegrity(
    Insertable<SyncMetaTableData> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('entity')) {
      context.handle(
        _entityMeta,
        entity.isAcceptableOrUnknown(data['entity']!, _entityMeta),
      );
    } else if (isInserting) {
      context.missing(_entityMeta);
    }
    if (data.containsKey('last_sync_at')) {
      context.handle(
        _lastSyncAtMeta,
        lastSyncAt.isAcceptableOrUnknown(
          data['last_sync_at']!,
          _lastSyncAtMeta,
        ),
      );
    }
    if (data.containsKey('last_sync_cursor')) {
      context.handle(
        _lastSyncCursorMeta,
        lastSyncCursor.isAcceptableOrUnknown(
          data['last_sync_cursor']!,
          _lastSyncCursorMeta,
        ),
      );
    }
    if (data.containsKey('total_synced')) {
      context.handle(
        _totalSyncedMeta,
        totalSynced.isAcceptableOrUnknown(
          data['total_synced']!,
          _totalSyncedMeta,
        ),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {entity};
  @override
  SyncMetaTableData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return SyncMetaTableData(
      entity: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}entity'],
      )!,
      lastSyncAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}last_sync_at'],
      ),
      lastSyncCursor: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}last_sync_cursor'],
      ),
      totalSynced: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}total_synced'],
      )!,
    );
  }

  @override
  $SyncMetaTableTable createAlias(String alias) {
    return $SyncMetaTableTable(attachedDatabase, alias);
  }
}

class SyncMetaTableData extends DataClass
    implements Insertable<SyncMetaTableData> {
  final String entity;
  final DateTime? lastSyncAt;
  final String? lastSyncCursor;
  final int totalSynced;
  const SyncMetaTableData({
    required this.entity,
    this.lastSyncAt,
    this.lastSyncCursor,
    required this.totalSynced,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['entity'] = Variable<String>(entity);
    if (!nullToAbsent || lastSyncAt != null) {
      map['last_sync_at'] = Variable<DateTime>(lastSyncAt);
    }
    if (!nullToAbsent || lastSyncCursor != null) {
      map['last_sync_cursor'] = Variable<String>(lastSyncCursor);
    }
    map['total_synced'] = Variable<int>(totalSynced);
    return map;
  }

  SyncMetaTableCompanion toCompanion(bool nullToAbsent) {
    return SyncMetaTableCompanion(
      entity: Value(entity),
      lastSyncAt: lastSyncAt == null && nullToAbsent
          ? const Value.absent()
          : Value(lastSyncAt),
      lastSyncCursor: lastSyncCursor == null && nullToAbsent
          ? const Value.absent()
          : Value(lastSyncCursor),
      totalSynced: Value(totalSynced),
    );
  }

  factory SyncMetaTableData.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return SyncMetaTableData(
      entity: serializer.fromJson<String>(json['entity']),
      lastSyncAt: serializer.fromJson<DateTime?>(json['lastSyncAt']),
      lastSyncCursor: serializer.fromJson<String?>(json['lastSyncCursor']),
      totalSynced: serializer.fromJson<int>(json['totalSynced']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'entity': serializer.toJson<String>(entity),
      'lastSyncAt': serializer.toJson<DateTime?>(lastSyncAt),
      'lastSyncCursor': serializer.toJson<String?>(lastSyncCursor),
      'totalSynced': serializer.toJson<int>(totalSynced),
    };
  }

  SyncMetaTableData copyWith({
    String? entity,
    Value<DateTime?> lastSyncAt = const Value.absent(),
    Value<String?> lastSyncCursor = const Value.absent(),
    int? totalSynced,
  }) => SyncMetaTableData(
    entity: entity ?? this.entity,
    lastSyncAt: lastSyncAt.present ? lastSyncAt.value : this.lastSyncAt,
    lastSyncCursor: lastSyncCursor.present
        ? lastSyncCursor.value
        : this.lastSyncCursor,
    totalSynced: totalSynced ?? this.totalSynced,
  );
  SyncMetaTableData copyWithCompanion(SyncMetaTableCompanion data) {
    return SyncMetaTableData(
      entity: data.entity.present ? data.entity.value : this.entity,
      lastSyncAt: data.lastSyncAt.present
          ? data.lastSyncAt.value
          : this.lastSyncAt,
      lastSyncCursor: data.lastSyncCursor.present
          ? data.lastSyncCursor.value
          : this.lastSyncCursor,
      totalSynced: data.totalSynced.present
          ? data.totalSynced.value
          : this.totalSynced,
    );
  }

  @override
  String toString() {
    return (StringBuffer('SyncMetaTableData(')
          ..write('entity: $entity, ')
          ..write('lastSyncAt: $lastSyncAt, ')
          ..write('lastSyncCursor: $lastSyncCursor, ')
          ..write('totalSynced: $totalSynced')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(entity, lastSyncAt, lastSyncCursor, totalSynced);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is SyncMetaTableData &&
          other.entity == this.entity &&
          other.lastSyncAt == this.lastSyncAt &&
          other.lastSyncCursor == this.lastSyncCursor &&
          other.totalSynced == this.totalSynced);
}

class SyncMetaTableCompanion extends UpdateCompanion<SyncMetaTableData> {
  final Value<String> entity;
  final Value<DateTime?> lastSyncAt;
  final Value<String?> lastSyncCursor;
  final Value<int> totalSynced;
  final Value<int> rowid;
  const SyncMetaTableCompanion({
    this.entity = const Value.absent(),
    this.lastSyncAt = const Value.absent(),
    this.lastSyncCursor = const Value.absent(),
    this.totalSynced = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  SyncMetaTableCompanion.insert({
    required String entity,
    this.lastSyncAt = const Value.absent(),
    this.lastSyncCursor = const Value.absent(),
    this.totalSynced = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : entity = Value(entity);
  static Insertable<SyncMetaTableData> custom({
    Expression<String>? entity,
    Expression<DateTime>? lastSyncAt,
    Expression<String>? lastSyncCursor,
    Expression<int>? totalSynced,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (entity != null) 'entity': entity,
      if (lastSyncAt != null) 'last_sync_at': lastSyncAt,
      if (lastSyncCursor != null) 'last_sync_cursor': lastSyncCursor,
      if (totalSynced != null) 'total_synced': totalSynced,
      if (rowid != null) 'rowid': rowid,
    });
  }

  SyncMetaTableCompanion copyWith({
    Value<String>? entity,
    Value<DateTime?>? lastSyncAt,
    Value<String?>? lastSyncCursor,
    Value<int>? totalSynced,
    Value<int>? rowid,
  }) {
    return SyncMetaTableCompanion(
      entity: entity ?? this.entity,
      lastSyncAt: lastSyncAt ?? this.lastSyncAt,
      lastSyncCursor: lastSyncCursor ?? this.lastSyncCursor,
      totalSynced: totalSynced ?? this.totalSynced,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (entity.present) {
      map['entity'] = Variable<String>(entity.value);
    }
    if (lastSyncAt.present) {
      map['last_sync_at'] = Variable<DateTime>(lastSyncAt.value);
    }
    if (lastSyncCursor.present) {
      map['last_sync_cursor'] = Variable<String>(lastSyncCursor.value);
    }
    if (totalSynced.present) {
      map['total_synced'] = Variable<int>(totalSynced.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('SyncMetaTableCompanion(')
          ..write('entity: $entity, ')
          ..write('lastSyncAt: $lastSyncAt, ')
          ..write('lastSyncCursor: $lastSyncCursor, ')
          ..write('totalSynced: $totalSynced, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $PhotoQueueTableTable extends PhotoQueueTable
    with TableInfo<$PhotoQueueTableTable, PhotoQueueTableData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $PhotoQueueTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
    'id',
    aliasedName,
    false,
    hasAutoIncrement: true,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'PRIMARY KEY AUTOINCREMENT',
    ),
  );
  static const VerificationMeta _interventionIdMeta = const VerificationMeta(
    'interventionId',
  );
  @override
  late final GeneratedColumn<String> interventionId = GeneratedColumn<String>(
    'intervention_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _typeMeta = const VerificationMeta('type');
  @override
  late final GeneratedColumn<String> type = GeneratedColumn<String>(
    'type',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _filePathMeta = const VerificationMeta(
    'filePath',
  );
  @override
  late final GeneratedColumn<String> filePath = GeneratedColumn<String>(
    'file_path',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _mimeTypeMeta = const VerificationMeta(
    'mimeType',
  );
  @override
  late final GeneratedColumn<String> mimeType = GeneratedColumn<String>(
    'mime_type',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _fileSizeMeta = const VerificationMeta(
    'fileSize',
  );
  @override
  late final GeneratedColumn<int> fileSize = GeneratedColumn<int>(
    'file_size',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _latitudeMeta = const VerificationMeta(
    'latitude',
  );
  @override
  late final GeneratedColumn<double> latitude = GeneratedColumn<double>(
    'latitude',
    aliasedName,
    true,
    type: DriftSqlType.double,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _longitudeMeta = const VerificationMeta(
    'longitude',
  );
  @override
  late final GeneratedColumn<double> longitude = GeneratedColumn<double>(
    'longitude',
    aliasedName,
    true,
    type: DriftSqlType.double,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _takenAtMeta = const VerificationMeta(
    'takenAt',
  );
  @override
  late final GeneratedColumn<DateTime> takenAt = GeneratedColumn<DateTime>(
    'taken_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _attemptsMeta = const VerificationMeta(
    'attempts',
  );
  @override
  late final GeneratedColumn<int> attempts = GeneratedColumn<int>(
    'attempts',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0),
  );
  static const VerificationMeta _lastErrorMeta = const VerificationMeta(
    'lastError',
  );
  @override
  late final GeneratedColumn<String> lastError = GeneratedColumn<String>(
    'last_error',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
    'status',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('pending'),
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    interventionId,
    type,
    filePath,
    mimeType,
    fileSize,
    latitude,
    longitude,
    takenAt,
    attempts,
    lastError,
    status,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'photo_queue';
  @override
  VerificationContext validateIntegrity(
    Insertable<PhotoQueueTableData> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('intervention_id')) {
      context.handle(
        _interventionIdMeta,
        interventionId.isAcceptableOrUnknown(
          data['intervention_id']!,
          _interventionIdMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_interventionIdMeta);
    }
    if (data.containsKey('type')) {
      context.handle(
        _typeMeta,
        type.isAcceptableOrUnknown(data['type']!, _typeMeta),
      );
    } else if (isInserting) {
      context.missing(_typeMeta);
    }
    if (data.containsKey('file_path')) {
      context.handle(
        _filePathMeta,
        filePath.isAcceptableOrUnknown(data['file_path']!, _filePathMeta),
      );
    } else if (isInserting) {
      context.missing(_filePathMeta);
    }
    if (data.containsKey('mime_type')) {
      context.handle(
        _mimeTypeMeta,
        mimeType.isAcceptableOrUnknown(data['mime_type']!, _mimeTypeMeta),
      );
    } else if (isInserting) {
      context.missing(_mimeTypeMeta);
    }
    if (data.containsKey('file_size')) {
      context.handle(
        _fileSizeMeta,
        fileSize.isAcceptableOrUnknown(data['file_size']!, _fileSizeMeta),
      );
    } else if (isInserting) {
      context.missing(_fileSizeMeta);
    }
    if (data.containsKey('latitude')) {
      context.handle(
        _latitudeMeta,
        latitude.isAcceptableOrUnknown(data['latitude']!, _latitudeMeta),
      );
    }
    if (data.containsKey('longitude')) {
      context.handle(
        _longitudeMeta,
        longitude.isAcceptableOrUnknown(data['longitude']!, _longitudeMeta),
      );
    }
    if (data.containsKey('taken_at')) {
      context.handle(
        _takenAtMeta,
        takenAt.isAcceptableOrUnknown(data['taken_at']!, _takenAtMeta),
      );
    } else if (isInserting) {
      context.missing(_takenAtMeta);
    }
    if (data.containsKey('attempts')) {
      context.handle(
        _attemptsMeta,
        attempts.isAcceptableOrUnknown(data['attempts']!, _attemptsMeta),
      );
    }
    if (data.containsKey('last_error')) {
      context.handle(
        _lastErrorMeta,
        lastError.isAcceptableOrUnknown(data['last_error']!, _lastErrorMeta),
      );
    }
    if (data.containsKey('status')) {
      context.handle(
        _statusMeta,
        status.isAcceptableOrUnknown(data['status']!, _statusMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  PhotoQueueTableData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return PhotoQueueTableData(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}id'],
      )!,
      interventionId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}intervention_id'],
      )!,
      type: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}type'],
      )!,
      filePath: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}file_path'],
      )!,
      mimeType: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}mime_type'],
      )!,
      fileSize: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}file_size'],
      )!,
      latitude: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}latitude'],
      ),
      longitude: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}longitude'],
      ),
      takenAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}taken_at'],
      )!,
      attempts: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}attempts'],
      )!,
      lastError: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}last_error'],
      ),
      status: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}status'],
      )!,
    );
  }

  @override
  $PhotoQueueTableTable createAlias(String alias) {
    return $PhotoQueueTableTable(attachedDatabase, alias);
  }
}

class PhotoQueueTableData extends DataClass
    implements Insertable<PhotoQueueTableData> {
  final int id;
  final String interventionId;
  final String type;
  final String filePath;
  final String mimeType;
  final int fileSize;
  final double? latitude;
  final double? longitude;
  final DateTime takenAt;
  final int attempts;
  final String? lastError;
  final String status;
  const PhotoQueueTableData({
    required this.id,
    required this.interventionId,
    required this.type,
    required this.filePath,
    required this.mimeType,
    required this.fileSize,
    this.latitude,
    this.longitude,
    required this.takenAt,
    required this.attempts,
    this.lastError,
    required this.status,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['intervention_id'] = Variable<String>(interventionId);
    map['type'] = Variable<String>(type);
    map['file_path'] = Variable<String>(filePath);
    map['mime_type'] = Variable<String>(mimeType);
    map['file_size'] = Variable<int>(fileSize);
    if (!nullToAbsent || latitude != null) {
      map['latitude'] = Variable<double>(latitude);
    }
    if (!nullToAbsent || longitude != null) {
      map['longitude'] = Variable<double>(longitude);
    }
    map['taken_at'] = Variable<DateTime>(takenAt);
    map['attempts'] = Variable<int>(attempts);
    if (!nullToAbsent || lastError != null) {
      map['last_error'] = Variable<String>(lastError);
    }
    map['status'] = Variable<String>(status);
    return map;
  }

  PhotoQueueTableCompanion toCompanion(bool nullToAbsent) {
    return PhotoQueueTableCompanion(
      id: Value(id),
      interventionId: Value(interventionId),
      type: Value(type),
      filePath: Value(filePath),
      mimeType: Value(mimeType),
      fileSize: Value(fileSize),
      latitude: latitude == null && nullToAbsent
          ? const Value.absent()
          : Value(latitude),
      longitude: longitude == null && nullToAbsent
          ? const Value.absent()
          : Value(longitude),
      takenAt: Value(takenAt),
      attempts: Value(attempts),
      lastError: lastError == null && nullToAbsent
          ? const Value.absent()
          : Value(lastError),
      status: Value(status),
    );
  }

  factory PhotoQueueTableData.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return PhotoQueueTableData(
      id: serializer.fromJson<int>(json['id']),
      interventionId: serializer.fromJson<String>(json['interventionId']),
      type: serializer.fromJson<String>(json['type']),
      filePath: serializer.fromJson<String>(json['filePath']),
      mimeType: serializer.fromJson<String>(json['mimeType']),
      fileSize: serializer.fromJson<int>(json['fileSize']),
      latitude: serializer.fromJson<double?>(json['latitude']),
      longitude: serializer.fromJson<double?>(json['longitude']),
      takenAt: serializer.fromJson<DateTime>(json['takenAt']),
      attempts: serializer.fromJson<int>(json['attempts']),
      lastError: serializer.fromJson<String?>(json['lastError']),
      status: serializer.fromJson<String>(json['status']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'interventionId': serializer.toJson<String>(interventionId),
      'type': serializer.toJson<String>(type),
      'filePath': serializer.toJson<String>(filePath),
      'mimeType': serializer.toJson<String>(mimeType),
      'fileSize': serializer.toJson<int>(fileSize),
      'latitude': serializer.toJson<double?>(latitude),
      'longitude': serializer.toJson<double?>(longitude),
      'takenAt': serializer.toJson<DateTime>(takenAt),
      'attempts': serializer.toJson<int>(attempts),
      'lastError': serializer.toJson<String?>(lastError),
      'status': serializer.toJson<String>(status),
    };
  }

  PhotoQueueTableData copyWith({
    int? id,
    String? interventionId,
    String? type,
    String? filePath,
    String? mimeType,
    int? fileSize,
    Value<double?> latitude = const Value.absent(),
    Value<double?> longitude = const Value.absent(),
    DateTime? takenAt,
    int? attempts,
    Value<String?> lastError = const Value.absent(),
    String? status,
  }) => PhotoQueueTableData(
    id: id ?? this.id,
    interventionId: interventionId ?? this.interventionId,
    type: type ?? this.type,
    filePath: filePath ?? this.filePath,
    mimeType: mimeType ?? this.mimeType,
    fileSize: fileSize ?? this.fileSize,
    latitude: latitude.present ? latitude.value : this.latitude,
    longitude: longitude.present ? longitude.value : this.longitude,
    takenAt: takenAt ?? this.takenAt,
    attempts: attempts ?? this.attempts,
    lastError: lastError.present ? lastError.value : this.lastError,
    status: status ?? this.status,
  );
  PhotoQueueTableData copyWithCompanion(PhotoQueueTableCompanion data) {
    return PhotoQueueTableData(
      id: data.id.present ? data.id.value : this.id,
      interventionId: data.interventionId.present
          ? data.interventionId.value
          : this.interventionId,
      type: data.type.present ? data.type.value : this.type,
      filePath: data.filePath.present ? data.filePath.value : this.filePath,
      mimeType: data.mimeType.present ? data.mimeType.value : this.mimeType,
      fileSize: data.fileSize.present ? data.fileSize.value : this.fileSize,
      latitude: data.latitude.present ? data.latitude.value : this.latitude,
      longitude: data.longitude.present ? data.longitude.value : this.longitude,
      takenAt: data.takenAt.present ? data.takenAt.value : this.takenAt,
      attempts: data.attempts.present ? data.attempts.value : this.attempts,
      lastError: data.lastError.present ? data.lastError.value : this.lastError,
      status: data.status.present ? data.status.value : this.status,
    );
  }

  @override
  String toString() {
    return (StringBuffer('PhotoQueueTableData(')
          ..write('id: $id, ')
          ..write('interventionId: $interventionId, ')
          ..write('type: $type, ')
          ..write('filePath: $filePath, ')
          ..write('mimeType: $mimeType, ')
          ..write('fileSize: $fileSize, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('takenAt: $takenAt, ')
          ..write('attempts: $attempts, ')
          ..write('lastError: $lastError, ')
          ..write('status: $status')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    interventionId,
    type,
    filePath,
    mimeType,
    fileSize,
    latitude,
    longitude,
    takenAt,
    attempts,
    lastError,
    status,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is PhotoQueueTableData &&
          other.id == this.id &&
          other.interventionId == this.interventionId &&
          other.type == this.type &&
          other.filePath == this.filePath &&
          other.mimeType == this.mimeType &&
          other.fileSize == this.fileSize &&
          other.latitude == this.latitude &&
          other.longitude == this.longitude &&
          other.takenAt == this.takenAt &&
          other.attempts == this.attempts &&
          other.lastError == this.lastError &&
          other.status == this.status);
}

class PhotoQueueTableCompanion extends UpdateCompanion<PhotoQueueTableData> {
  final Value<int> id;
  final Value<String> interventionId;
  final Value<String> type;
  final Value<String> filePath;
  final Value<String> mimeType;
  final Value<int> fileSize;
  final Value<double?> latitude;
  final Value<double?> longitude;
  final Value<DateTime> takenAt;
  final Value<int> attempts;
  final Value<String?> lastError;
  final Value<String> status;
  const PhotoQueueTableCompanion({
    this.id = const Value.absent(),
    this.interventionId = const Value.absent(),
    this.type = const Value.absent(),
    this.filePath = const Value.absent(),
    this.mimeType = const Value.absent(),
    this.fileSize = const Value.absent(),
    this.latitude = const Value.absent(),
    this.longitude = const Value.absent(),
    this.takenAt = const Value.absent(),
    this.attempts = const Value.absent(),
    this.lastError = const Value.absent(),
    this.status = const Value.absent(),
  });
  PhotoQueueTableCompanion.insert({
    this.id = const Value.absent(),
    required String interventionId,
    required String type,
    required String filePath,
    required String mimeType,
    required int fileSize,
    this.latitude = const Value.absent(),
    this.longitude = const Value.absent(),
    required DateTime takenAt,
    this.attempts = const Value.absent(),
    this.lastError = const Value.absent(),
    this.status = const Value.absent(),
  }) : interventionId = Value(interventionId),
       type = Value(type),
       filePath = Value(filePath),
       mimeType = Value(mimeType),
       fileSize = Value(fileSize),
       takenAt = Value(takenAt);
  static Insertable<PhotoQueueTableData> custom({
    Expression<int>? id,
    Expression<String>? interventionId,
    Expression<String>? type,
    Expression<String>? filePath,
    Expression<String>? mimeType,
    Expression<int>? fileSize,
    Expression<double>? latitude,
    Expression<double>? longitude,
    Expression<DateTime>? takenAt,
    Expression<int>? attempts,
    Expression<String>? lastError,
    Expression<String>? status,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (interventionId != null) 'intervention_id': interventionId,
      if (type != null) 'type': type,
      if (filePath != null) 'file_path': filePath,
      if (mimeType != null) 'mime_type': mimeType,
      if (fileSize != null) 'file_size': fileSize,
      if (latitude != null) 'latitude': latitude,
      if (longitude != null) 'longitude': longitude,
      if (takenAt != null) 'taken_at': takenAt,
      if (attempts != null) 'attempts': attempts,
      if (lastError != null) 'last_error': lastError,
      if (status != null) 'status': status,
    });
  }

  PhotoQueueTableCompanion copyWith({
    Value<int>? id,
    Value<String>? interventionId,
    Value<String>? type,
    Value<String>? filePath,
    Value<String>? mimeType,
    Value<int>? fileSize,
    Value<double?>? latitude,
    Value<double?>? longitude,
    Value<DateTime>? takenAt,
    Value<int>? attempts,
    Value<String?>? lastError,
    Value<String>? status,
  }) {
    return PhotoQueueTableCompanion(
      id: id ?? this.id,
      interventionId: interventionId ?? this.interventionId,
      type: type ?? this.type,
      filePath: filePath ?? this.filePath,
      mimeType: mimeType ?? this.mimeType,
      fileSize: fileSize ?? this.fileSize,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      takenAt: takenAt ?? this.takenAt,
      attempts: attempts ?? this.attempts,
      lastError: lastError ?? this.lastError,
      status: status ?? this.status,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (interventionId.present) {
      map['intervention_id'] = Variable<String>(interventionId.value);
    }
    if (type.present) {
      map['type'] = Variable<String>(type.value);
    }
    if (filePath.present) {
      map['file_path'] = Variable<String>(filePath.value);
    }
    if (mimeType.present) {
      map['mime_type'] = Variable<String>(mimeType.value);
    }
    if (fileSize.present) {
      map['file_size'] = Variable<int>(fileSize.value);
    }
    if (latitude.present) {
      map['latitude'] = Variable<double>(latitude.value);
    }
    if (longitude.present) {
      map['longitude'] = Variable<double>(longitude.value);
    }
    if (takenAt.present) {
      map['taken_at'] = Variable<DateTime>(takenAt.value);
    }
    if (attempts.present) {
      map['attempts'] = Variable<int>(attempts.value);
    }
    if (lastError.present) {
      map['last_error'] = Variable<String>(lastError.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('PhotoQueueTableCompanion(')
          ..write('id: $id, ')
          ..write('interventionId: $interventionId, ')
          ..write('type: $type, ')
          ..write('filePath: $filePath, ')
          ..write('mimeType: $mimeType, ')
          ..write('fileSize: $fileSize, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('takenAt: $takenAt, ')
          ..write('attempts: $attempts, ')
          ..write('lastError: $lastError, ')
          ..write('status: $status')
          ..write(')'))
        .toString();
  }
}

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  $AppDatabaseManager get managers => $AppDatabaseManager(this);
  late final $ClientsTableTable clientsTable = $ClientsTableTable(this);
  late final $ChantiersTableTable chantiersTable = $ChantiersTableTable(this);
  late final $InterventionsTableTable interventionsTable =
      $InterventionsTableTable(this);
  late final $DevisTableTable devisTable = $DevisTableTable(this);
  late final $FacturesTableTable facturesTable = $FacturesTableTable(this);
  late final $AbsencesTableTable absencesTable = $AbsencesTableTable(this);
  late final $SyncQueueTableTable syncQueueTable = $SyncQueueTableTable(this);
  late final $SyncMetaTableTable syncMetaTable = $SyncMetaTableTable(this);
  late final $PhotoQueueTableTable photoQueueTable = $PhotoQueueTableTable(
    this,
  );
  late final ClientsDao clientsDao = ClientsDao(this as AppDatabase);
  late final ChantiersDao chantiersDao = ChantiersDao(this as AppDatabase);
  late final InterventionsDao interventionsDao = InterventionsDao(
    this as AppDatabase,
  );
  late final DevisDao devisDao = DevisDao(this as AppDatabase);
  late final FacturesDao facturesDao = FacturesDao(this as AppDatabase);
  late final AbsencesDao absencesDao = AbsencesDao(this as AppDatabase);
  late final SyncQueueDao syncQueueDao = SyncQueueDao(this as AppDatabase);
  late final SyncMetaDao syncMetaDao = SyncMetaDao(this as AppDatabase);
  late final PhotoQueueDao photoQueueDao = PhotoQueueDao(this as AppDatabase);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [
    clientsTable,
    chantiersTable,
    interventionsTable,
    devisTable,
    facturesTable,
    absencesTable,
    syncQueueTable,
    syncMetaTable,
    photoQueueTable,
  ];
}

typedef $$ClientsTableTableCreateCompanionBuilder =
    ClientsTableCompanion Function({
      required String id,
      required String type,
      required String nom,
      Value<String?> prenom,
      Value<String?> raisonSociale,
      required String email,
      required String telephone,
      Value<String?> telephoneSecondaire,
      required String adresse,
      required String codePostal,
      required String ville,
      Value<String?> notes,
      Value<String> tags,
      required DateTime createdAt,
      required DateTime updatedAt,
      Value<DateTime?> syncedAt,
      Value<int> rowid,
    });
typedef $$ClientsTableTableUpdateCompanionBuilder =
    ClientsTableCompanion Function({
      Value<String> id,
      Value<String> type,
      Value<String> nom,
      Value<String?> prenom,
      Value<String?> raisonSociale,
      Value<String> email,
      Value<String> telephone,
      Value<String?> telephoneSecondaire,
      Value<String> adresse,
      Value<String> codePostal,
      Value<String> ville,
      Value<String?> notes,
      Value<String> tags,
      Value<DateTime> createdAt,
      Value<DateTime> updatedAt,
      Value<DateTime?> syncedAt,
      Value<int> rowid,
    });

class $$ClientsTableTableFilterComposer
    extends Composer<_$AppDatabase, $ClientsTableTable> {
  $$ClientsTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get type => $composableBuilder(
    column: $table.type,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get nom => $composableBuilder(
    column: $table.nom,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get prenom => $composableBuilder(
    column: $table.prenom,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get raisonSociale => $composableBuilder(
    column: $table.raisonSociale,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get email => $composableBuilder(
    column: $table.email,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get telephone => $composableBuilder(
    column: $table.telephone,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get telephoneSecondaire => $composableBuilder(
    column: $table.telephoneSecondaire,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get adresse => $composableBuilder(
    column: $table.adresse,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get codePostal => $composableBuilder(
    column: $table.codePostal,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get ville => $composableBuilder(
    column: $table.ville,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get notes => $composableBuilder(
    column: $table.notes,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get tags => $composableBuilder(
    column: $table.tags,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get syncedAt => $composableBuilder(
    column: $table.syncedAt,
    builder: (column) => ColumnFilters(column),
  );
}

class $$ClientsTableTableOrderingComposer
    extends Composer<_$AppDatabase, $ClientsTableTable> {
  $$ClientsTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get type => $composableBuilder(
    column: $table.type,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get nom => $composableBuilder(
    column: $table.nom,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get prenom => $composableBuilder(
    column: $table.prenom,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get raisonSociale => $composableBuilder(
    column: $table.raisonSociale,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get email => $composableBuilder(
    column: $table.email,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get telephone => $composableBuilder(
    column: $table.telephone,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get telephoneSecondaire => $composableBuilder(
    column: $table.telephoneSecondaire,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get adresse => $composableBuilder(
    column: $table.adresse,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get codePostal => $composableBuilder(
    column: $table.codePostal,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get ville => $composableBuilder(
    column: $table.ville,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get notes => $composableBuilder(
    column: $table.notes,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get tags => $composableBuilder(
    column: $table.tags,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get syncedAt => $composableBuilder(
    column: $table.syncedAt,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$ClientsTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $ClientsTableTable> {
  $$ClientsTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get type =>
      $composableBuilder(column: $table.type, builder: (column) => column);

  GeneratedColumn<String> get nom =>
      $composableBuilder(column: $table.nom, builder: (column) => column);

  GeneratedColumn<String> get prenom =>
      $composableBuilder(column: $table.prenom, builder: (column) => column);

  GeneratedColumn<String> get raisonSociale => $composableBuilder(
    column: $table.raisonSociale,
    builder: (column) => column,
  );

  GeneratedColumn<String> get email =>
      $composableBuilder(column: $table.email, builder: (column) => column);

  GeneratedColumn<String> get telephone =>
      $composableBuilder(column: $table.telephone, builder: (column) => column);

  GeneratedColumn<String> get telephoneSecondaire => $composableBuilder(
    column: $table.telephoneSecondaire,
    builder: (column) => column,
  );

  GeneratedColumn<String> get adresse =>
      $composableBuilder(column: $table.adresse, builder: (column) => column);

  GeneratedColumn<String> get codePostal => $composableBuilder(
    column: $table.codePostal,
    builder: (column) => column,
  );

  GeneratedColumn<String> get ville =>
      $composableBuilder(column: $table.ville, builder: (column) => column);

  GeneratedColumn<String> get notes =>
      $composableBuilder(column: $table.notes, builder: (column) => column);

  GeneratedColumn<String> get tags =>
      $composableBuilder(column: $table.tags, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<DateTime> get updatedAt =>
      $composableBuilder(column: $table.updatedAt, builder: (column) => column);

  GeneratedColumn<DateTime> get syncedAt =>
      $composableBuilder(column: $table.syncedAt, builder: (column) => column);
}

class $$ClientsTableTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $ClientsTableTable,
          ClientsTableData,
          $$ClientsTableTableFilterComposer,
          $$ClientsTableTableOrderingComposer,
          $$ClientsTableTableAnnotationComposer,
          $$ClientsTableTableCreateCompanionBuilder,
          $$ClientsTableTableUpdateCompanionBuilder,
          (
            ClientsTableData,
            BaseReferences<_$AppDatabase, $ClientsTableTable, ClientsTableData>,
          ),
          ClientsTableData,
          PrefetchHooks Function()
        > {
  $$ClientsTableTableTableManager(_$AppDatabase db, $ClientsTableTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$ClientsTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$ClientsTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$ClientsTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> type = const Value.absent(),
                Value<String> nom = const Value.absent(),
                Value<String?> prenom = const Value.absent(),
                Value<String?> raisonSociale = const Value.absent(),
                Value<String> email = const Value.absent(),
                Value<String> telephone = const Value.absent(),
                Value<String?> telephoneSecondaire = const Value.absent(),
                Value<String> adresse = const Value.absent(),
                Value<String> codePostal = const Value.absent(),
                Value<String> ville = const Value.absent(),
                Value<String?> notes = const Value.absent(),
                Value<String> tags = const Value.absent(),
                Value<DateTime> createdAt = const Value.absent(),
                Value<DateTime> updatedAt = const Value.absent(),
                Value<DateTime?> syncedAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => ClientsTableCompanion(
                id: id,
                type: type,
                nom: nom,
                prenom: prenom,
                raisonSociale: raisonSociale,
                email: email,
                telephone: telephone,
                telephoneSecondaire: telephoneSecondaire,
                adresse: adresse,
                codePostal: codePostal,
                ville: ville,
                notes: notes,
                tags: tags,
                createdAt: createdAt,
                updatedAt: updatedAt,
                syncedAt: syncedAt,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String type,
                required String nom,
                Value<String?> prenom = const Value.absent(),
                Value<String?> raisonSociale = const Value.absent(),
                required String email,
                required String telephone,
                Value<String?> telephoneSecondaire = const Value.absent(),
                required String adresse,
                required String codePostal,
                required String ville,
                Value<String?> notes = const Value.absent(),
                Value<String> tags = const Value.absent(),
                required DateTime createdAt,
                required DateTime updatedAt,
                Value<DateTime?> syncedAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => ClientsTableCompanion.insert(
                id: id,
                type: type,
                nom: nom,
                prenom: prenom,
                raisonSociale: raisonSociale,
                email: email,
                telephone: telephone,
                telephoneSecondaire: telephoneSecondaire,
                adresse: adresse,
                codePostal: codePostal,
                ville: ville,
                notes: notes,
                tags: tags,
                createdAt: createdAt,
                updatedAt: updatedAt,
                syncedAt: syncedAt,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$ClientsTableTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $ClientsTableTable,
      ClientsTableData,
      $$ClientsTableTableFilterComposer,
      $$ClientsTableTableOrderingComposer,
      $$ClientsTableTableAnnotationComposer,
      $$ClientsTableTableCreateCompanionBuilder,
      $$ClientsTableTableUpdateCompanionBuilder,
      (
        ClientsTableData,
        BaseReferences<_$AppDatabase, $ClientsTableTable, ClientsTableData>,
      ),
      ClientsTableData,
      PrefetchHooks Function()
    >;
typedef $$ChantiersTableTableCreateCompanionBuilder =
    ChantiersTableCompanion Function({
      required String id,
      required String clientId,
      required String adresse,
      required String codePostal,
      required String ville,
      Value<double?> latitude,
      Value<double?> longitude,
      Value<String> typePrestation,
      required String description,
      Value<double?> surface,
      Value<String> statut,
      Value<DateTime?> dateDebut,
      Value<DateTime?> dateFin,
      Value<String?> responsableId,
      Value<String?> notes,
      required DateTime createdAt,
      required DateTime updatedAt,
      Value<DateTime?> syncedAt,
      Value<int> rowid,
    });
typedef $$ChantiersTableTableUpdateCompanionBuilder =
    ChantiersTableCompanion Function({
      Value<String> id,
      Value<String> clientId,
      Value<String> adresse,
      Value<String> codePostal,
      Value<String> ville,
      Value<double?> latitude,
      Value<double?> longitude,
      Value<String> typePrestation,
      Value<String> description,
      Value<double?> surface,
      Value<String> statut,
      Value<DateTime?> dateDebut,
      Value<DateTime?> dateFin,
      Value<String?> responsableId,
      Value<String?> notes,
      Value<DateTime> createdAt,
      Value<DateTime> updatedAt,
      Value<DateTime?> syncedAt,
      Value<int> rowid,
    });

class $$ChantiersTableTableFilterComposer
    extends Composer<_$AppDatabase, $ChantiersTableTable> {
  $$ChantiersTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get clientId => $composableBuilder(
    column: $table.clientId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get adresse => $composableBuilder(
    column: $table.adresse,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get codePostal => $composableBuilder(
    column: $table.codePostal,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get ville => $composableBuilder(
    column: $table.ville,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get latitude => $composableBuilder(
    column: $table.latitude,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get longitude => $composableBuilder(
    column: $table.longitude,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get typePrestation => $composableBuilder(
    column: $table.typePrestation,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get description => $composableBuilder(
    column: $table.description,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get surface => $composableBuilder(
    column: $table.surface,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get statut => $composableBuilder(
    column: $table.statut,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get dateDebut => $composableBuilder(
    column: $table.dateDebut,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get dateFin => $composableBuilder(
    column: $table.dateFin,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get responsableId => $composableBuilder(
    column: $table.responsableId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get notes => $composableBuilder(
    column: $table.notes,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get syncedAt => $composableBuilder(
    column: $table.syncedAt,
    builder: (column) => ColumnFilters(column),
  );
}

class $$ChantiersTableTableOrderingComposer
    extends Composer<_$AppDatabase, $ChantiersTableTable> {
  $$ChantiersTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get clientId => $composableBuilder(
    column: $table.clientId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get adresse => $composableBuilder(
    column: $table.adresse,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get codePostal => $composableBuilder(
    column: $table.codePostal,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get ville => $composableBuilder(
    column: $table.ville,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get latitude => $composableBuilder(
    column: $table.latitude,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get longitude => $composableBuilder(
    column: $table.longitude,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get typePrestation => $composableBuilder(
    column: $table.typePrestation,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get description => $composableBuilder(
    column: $table.description,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get surface => $composableBuilder(
    column: $table.surface,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get statut => $composableBuilder(
    column: $table.statut,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get dateDebut => $composableBuilder(
    column: $table.dateDebut,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get dateFin => $composableBuilder(
    column: $table.dateFin,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get responsableId => $composableBuilder(
    column: $table.responsableId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get notes => $composableBuilder(
    column: $table.notes,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get syncedAt => $composableBuilder(
    column: $table.syncedAt,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$ChantiersTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $ChantiersTableTable> {
  $$ChantiersTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get clientId =>
      $composableBuilder(column: $table.clientId, builder: (column) => column);

  GeneratedColumn<String> get adresse =>
      $composableBuilder(column: $table.adresse, builder: (column) => column);

  GeneratedColumn<String> get codePostal => $composableBuilder(
    column: $table.codePostal,
    builder: (column) => column,
  );

  GeneratedColumn<String> get ville =>
      $composableBuilder(column: $table.ville, builder: (column) => column);

  GeneratedColumn<double> get latitude =>
      $composableBuilder(column: $table.latitude, builder: (column) => column);

  GeneratedColumn<double> get longitude =>
      $composableBuilder(column: $table.longitude, builder: (column) => column);

  GeneratedColumn<String> get typePrestation => $composableBuilder(
    column: $table.typePrestation,
    builder: (column) => column,
  );

  GeneratedColumn<String> get description => $composableBuilder(
    column: $table.description,
    builder: (column) => column,
  );

  GeneratedColumn<double> get surface =>
      $composableBuilder(column: $table.surface, builder: (column) => column);

  GeneratedColumn<String> get statut =>
      $composableBuilder(column: $table.statut, builder: (column) => column);

  GeneratedColumn<DateTime> get dateDebut =>
      $composableBuilder(column: $table.dateDebut, builder: (column) => column);

  GeneratedColumn<DateTime> get dateFin =>
      $composableBuilder(column: $table.dateFin, builder: (column) => column);

  GeneratedColumn<String> get responsableId => $composableBuilder(
    column: $table.responsableId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get notes =>
      $composableBuilder(column: $table.notes, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<DateTime> get updatedAt =>
      $composableBuilder(column: $table.updatedAt, builder: (column) => column);

  GeneratedColumn<DateTime> get syncedAt =>
      $composableBuilder(column: $table.syncedAt, builder: (column) => column);
}

class $$ChantiersTableTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $ChantiersTableTable,
          ChantiersTableData,
          $$ChantiersTableTableFilterComposer,
          $$ChantiersTableTableOrderingComposer,
          $$ChantiersTableTableAnnotationComposer,
          $$ChantiersTableTableCreateCompanionBuilder,
          $$ChantiersTableTableUpdateCompanionBuilder,
          (
            ChantiersTableData,
            BaseReferences<
              _$AppDatabase,
              $ChantiersTableTable,
              ChantiersTableData
            >,
          ),
          ChantiersTableData,
          PrefetchHooks Function()
        > {
  $$ChantiersTableTableTableManager(
    _$AppDatabase db,
    $ChantiersTableTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$ChantiersTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$ChantiersTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$ChantiersTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> clientId = const Value.absent(),
                Value<String> adresse = const Value.absent(),
                Value<String> codePostal = const Value.absent(),
                Value<String> ville = const Value.absent(),
                Value<double?> latitude = const Value.absent(),
                Value<double?> longitude = const Value.absent(),
                Value<String> typePrestation = const Value.absent(),
                Value<String> description = const Value.absent(),
                Value<double?> surface = const Value.absent(),
                Value<String> statut = const Value.absent(),
                Value<DateTime?> dateDebut = const Value.absent(),
                Value<DateTime?> dateFin = const Value.absent(),
                Value<String?> responsableId = const Value.absent(),
                Value<String?> notes = const Value.absent(),
                Value<DateTime> createdAt = const Value.absent(),
                Value<DateTime> updatedAt = const Value.absent(),
                Value<DateTime?> syncedAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => ChantiersTableCompanion(
                id: id,
                clientId: clientId,
                adresse: adresse,
                codePostal: codePostal,
                ville: ville,
                latitude: latitude,
                longitude: longitude,
                typePrestation: typePrestation,
                description: description,
                surface: surface,
                statut: statut,
                dateDebut: dateDebut,
                dateFin: dateFin,
                responsableId: responsableId,
                notes: notes,
                createdAt: createdAt,
                updatedAt: updatedAt,
                syncedAt: syncedAt,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String clientId,
                required String adresse,
                required String codePostal,
                required String ville,
                Value<double?> latitude = const Value.absent(),
                Value<double?> longitude = const Value.absent(),
                Value<String> typePrestation = const Value.absent(),
                required String description,
                Value<double?> surface = const Value.absent(),
                Value<String> statut = const Value.absent(),
                Value<DateTime?> dateDebut = const Value.absent(),
                Value<DateTime?> dateFin = const Value.absent(),
                Value<String?> responsableId = const Value.absent(),
                Value<String?> notes = const Value.absent(),
                required DateTime createdAt,
                required DateTime updatedAt,
                Value<DateTime?> syncedAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => ChantiersTableCompanion.insert(
                id: id,
                clientId: clientId,
                adresse: adresse,
                codePostal: codePostal,
                ville: ville,
                latitude: latitude,
                longitude: longitude,
                typePrestation: typePrestation,
                description: description,
                surface: surface,
                statut: statut,
                dateDebut: dateDebut,
                dateFin: dateFin,
                responsableId: responsableId,
                notes: notes,
                createdAt: createdAt,
                updatedAt: updatedAt,
                syncedAt: syncedAt,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$ChantiersTableTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $ChantiersTableTable,
      ChantiersTableData,
      $$ChantiersTableTableFilterComposer,
      $$ChantiersTableTableOrderingComposer,
      $$ChantiersTableTableAnnotationComposer,
      $$ChantiersTableTableCreateCompanionBuilder,
      $$ChantiersTableTableUpdateCompanionBuilder,
      (
        ChantiersTableData,
        BaseReferences<_$AppDatabase, $ChantiersTableTable, ChantiersTableData>,
      ),
      ChantiersTableData,
      PrefetchHooks Function()
    >;
typedef $$InterventionsTableTableCreateCompanionBuilder =
    InterventionsTableCompanion Function({
      required String id,
      required String chantierId,
      required String employeId,
      required DateTime date,
      required DateTime heureDebut,
      Value<DateTime?> heureFin,
      Value<int?> dureeMinutes,
      Value<String?> description,
      Value<String?> notes,
      Value<bool> valide,
      required DateTime createdAt,
      required DateTime updatedAt,
      Value<DateTime?> syncedAt,
      Value<int> rowid,
    });
typedef $$InterventionsTableTableUpdateCompanionBuilder =
    InterventionsTableCompanion Function({
      Value<String> id,
      Value<String> chantierId,
      Value<String> employeId,
      Value<DateTime> date,
      Value<DateTime> heureDebut,
      Value<DateTime?> heureFin,
      Value<int?> dureeMinutes,
      Value<String?> description,
      Value<String?> notes,
      Value<bool> valide,
      Value<DateTime> createdAt,
      Value<DateTime> updatedAt,
      Value<DateTime?> syncedAt,
      Value<int> rowid,
    });

class $$InterventionsTableTableFilterComposer
    extends Composer<_$AppDatabase, $InterventionsTableTable> {
  $$InterventionsTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get chantierId => $composableBuilder(
    column: $table.chantierId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get employeId => $composableBuilder(
    column: $table.employeId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get date => $composableBuilder(
    column: $table.date,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get heureDebut => $composableBuilder(
    column: $table.heureDebut,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get heureFin => $composableBuilder(
    column: $table.heureFin,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get dureeMinutes => $composableBuilder(
    column: $table.dureeMinutes,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get description => $composableBuilder(
    column: $table.description,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get notes => $composableBuilder(
    column: $table.notes,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get valide => $composableBuilder(
    column: $table.valide,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get syncedAt => $composableBuilder(
    column: $table.syncedAt,
    builder: (column) => ColumnFilters(column),
  );
}

class $$InterventionsTableTableOrderingComposer
    extends Composer<_$AppDatabase, $InterventionsTableTable> {
  $$InterventionsTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get chantierId => $composableBuilder(
    column: $table.chantierId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get employeId => $composableBuilder(
    column: $table.employeId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get date => $composableBuilder(
    column: $table.date,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get heureDebut => $composableBuilder(
    column: $table.heureDebut,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get heureFin => $composableBuilder(
    column: $table.heureFin,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get dureeMinutes => $composableBuilder(
    column: $table.dureeMinutes,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get description => $composableBuilder(
    column: $table.description,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get notes => $composableBuilder(
    column: $table.notes,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get valide => $composableBuilder(
    column: $table.valide,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get syncedAt => $composableBuilder(
    column: $table.syncedAt,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$InterventionsTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $InterventionsTableTable> {
  $$InterventionsTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get chantierId => $composableBuilder(
    column: $table.chantierId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get employeId =>
      $composableBuilder(column: $table.employeId, builder: (column) => column);

  GeneratedColumn<DateTime> get date =>
      $composableBuilder(column: $table.date, builder: (column) => column);

  GeneratedColumn<DateTime> get heureDebut => $composableBuilder(
    column: $table.heureDebut,
    builder: (column) => column,
  );

  GeneratedColumn<DateTime> get heureFin =>
      $composableBuilder(column: $table.heureFin, builder: (column) => column);

  GeneratedColumn<int> get dureeMinutes => $composableBuilder(
    column: $table.dureeMinutes,
    builder: (column) => column,
  );

  GeneratedColumn<String> get description => $composableBuilder(
    column: $table.description,
    builder: (column) => column,
  );

  GeneratedColumn<String> get notes =>
      $composableBuilder(column: $table.notes, builder: (column) => column);

  GeneratedColumn<bool> get valide =>
      $composableBuilder(column: $table.valide, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<DateTime> get updatedAt =>
      $composableBuilder(column: $table.updatedAt, builder: (column) => column);

  GeneratedColumn<DateTime> get syncedAt =>
      $composableBuilder(column: $table.syncedAt, builder: (column) => column);
}

class $$InterventionsTableTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $InterventionsTableTable,
          InterventionsTableData,
          $$InterventionsTableTableFilterComposer,
          $$InterventionsTableTableOrderingComposer,
          $$InterventionsTableTableAnnotationComposer,
          $$InterventionsTableTableCreateCompanionBuilder,
          $$InterventionsTableTableUpdateCompanionBuilder,
          (
            InterventionsTableData,
            BaseReferences<
              _$AppDatabase,
              $InterventionsTableTable,
              InterventionsTableData
            >,
          ),
          InterventionsTableData,
          PrefetchHooks Function()
        > {
  $$InterventionsTableTableTableManager(
    _$AppDatabase db,
    $InterventionsTableTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$InterventionsTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$InterventionsTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$InterventionsTableTableAnnotationComposer(
                $db: db,
                $table: table,
              ),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> chantierId = const Value.absent(),
                Value<String> employeId = const Value.absent(),
                Value<DateTime> date = const Value.absent(),
                Value<DateTime> heureDebut = const Value.absent(),
                Value<DateTime?> heureFin = const Value.absent(),
                Value<int?> dureeMinutes = const Value.absent(),
                Value<String?> description = const Value.absent(),
                Value<String?> notes = const Value.absent(),
                Value<bool> valide = const Value.absent(),
                Value<DateTime> createdAt = const Value.absent(),
                Value<DateTime> updatedAt = const Value.absent(),
                Value<DateTime?> syncedAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => InterventionsTableCompanion(
                id: id,
                chantierId: chantierId,
                employeId: employeId,
                date: date,
                heureDebut: heureDebut,
                heureFin: heureFin,
                dureeMinutes: dureeMinutes,
                description: description,
                notes: notes,
                valide: valide,
                createdAt: createdAt,
                updatedAt: updatedAt,
                syncedAt: syncedAt,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String chantierId,
                required String employeId,
                required DateTime date,
                required DateTime heureDebut,
                Value<DateTime?> heureFin = const Value.absent(),
                Value<int?> dureeMinutes = const Value.absent(),
                Value<String?> description = const Value.absent(),
                Value<String?> notes = const Value.absent(),
                Value<bool> valide = const Value.absent(),
                required DateTime createdAt,
                required DateTime updatedAt,
                Value<DateTime?> syncedAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => InterventionsTableCompanion.insert(
                id: id,
                chantierId: chantierId,
                employeId: employeId,
                date: date,
                heureDebut: heureDebut,
                heureFin: heureFin,
                dureeMinutes: dureeMinutes,
                description: description,
                notes: notes,
                valide: valide,
                createdAt: createdAt,
                updatedAt: updatedAt,
                syncedAt: syncedAt,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$InterventionsTableTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $InterventionsTableTable,
      InterventionsTableData,
      $$InterventionsTableTableFilterComposer,
      $$InterventionsTableTableOrderingComposer,
      $$InterventionsTableTableAnnotationComposer,
      $$InterventionsTableTableCreateCompanionBuilder,
      $$InterventionsTableTableUpdateCompanionBuilder,
      (
        InterventionsTableData,
        BaseReferences<
          _$AppDatabase,
          $InterventionsTableTable,
          InterventionsTableData
        >,
      ),
      InterventionsTableData,
      PrefetchHooks Function()
    >;
typedef $$DevisTableTableCreateCompanionBuilder =
    DevisTableCompanion Function({
      required String id,
      required String chantierId,
      required String numero,
      required DateTime dateEmission,
      required DateTime dateValidite,
      required double totalHT,
      required double totalTVA,
      required double totalTTC,
      Value<String> statut,
      Value<String?> pdfUrl,
      Value<String?> notes,
      required DateTime createdAt,
      required DateTime updatedAt,
      Value<DateTime?> syncedAt,
      Value<int> rowid,
    });
typedef $$DevisTableTableUpdateCompanionBuilder =
    DevisTableCompanion Function({
      Value<String> id,
      Value<String> chantierId,
      Value<String> numero,
      Value<DateTime> dateEmission,
      Value<DateTime> dateValidite,
      Value<double> totalHT,
      Value<double> totalTVA,
      Value<double> totalTTC,
      Value<String> statut,
      Value<String?> pdfUrl,
      Value<String?> notes,
      Value<DateTime> createdAt,
      Value<DateTime> updatedAt,
      Value<DateTime?> syncedAt,
      Value<int> rowid,
    });

class $$DevisTableTableFilterComposer
    extends Composer<_$AppDatabase, $DevisTableTable> {
  $$DevisTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get chantierId => $composableBuilder(
    column: $table.chantierId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get numero => $composableBuilder(
    column: $table.numero,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get dateEmission => $composableBuilder(
    column: $table.dateEmission,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get dateValidite => $composableBuilder(
    column: $table.dateValidite,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get totalHT => $composableBuilder(
    column: $table.totalHT,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get totalTVA => $composableBuilder(
    column: $table.totalTVA,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get totalTTC => $composableBuilder(
    column: $table.totalTTC,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get statut => $composableBuilder(
    column: $table.statut,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get pdfUrl => $composableBuilder(
    column: $table.pdfUrl,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get notes => $composableBuilder(
    column: $table.notes,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get syncedAt => $composableBuilder(
    column: $table.syncedAt,
    builder: (column) => ColumnFilters(column),
  );
}

class $$DevisTableTableOrderingComposer
    extends Composer<_$AppDatabase, $DevisTableTable> {
  $$DevisTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get chantierId => $composableBuilder(
    column: $table.chantierId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get numero => $composableBuilder(
    column: $table.numero,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get dateEmission => $composableBuilder(
    column: $table.dateEmission,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get dateValidite => $composableBuilder(
    column: $table.dateValidite,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get totalHT => $composableBuilder(
    column: $table.totalHT,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get totalTVA => $composableBuilder(
    column: $table.totalTVA,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get totalTTC => $composableBuilder(
    column: $table.totalTTC,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get statut => $composableBuilder(
    column: $table.statut,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get pdfUrl => $composableBuilder(
    column: $table.pdfUrl,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get notes => $composableBuilder(
    column: $table.notes,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get syncedAt => $composableBuilder(
    column: $table.syncedAt,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$DevisTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $DevisTableTable> {
  $$DevisTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get chantierId => $composableBuilder(
    column: $table.chantierId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get numero =>
      $composableBuilder(column: $table.numero, builder: (column) => column);

  GeneratedColumn<DateTime> get dateEmission => $composableBuilder(
    column: $table.dateEmission,
    builder: (column) => column,
  );

  GeneratedColumn<DateTime> get dateValidite => $composableBuilder(
    column: $table.dateValidite,
    builder: (column) => column,
  );

  GeneratedColumn<double> get totalHT =>
      $composableBuilder(column: $table.totalHT, builder: (column) => column);

  GeneratedColumn<double> get totalTVA =>
      $composableBuilder(column: $table.totalTVA, builder: (column) => column);

  GeneratedColumn<double> get totalTTC =>
      $composableBuilder(column: $table.totalTTC, builder: (column) => column);

  GeneratedColumn<String> get statut =>
      $composableBuilder(column: $table.statut, builder: (column) => column);

  GeneratedColumn<String> get pdfUrl =>
      $composableBuilder(column: $table.pdfUrl, builder: (column) => column);

  GeneratedColumn<String> get notes =>
      $composableBuilder(column: $table.notes, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<DateTime> get updatedAt =>
      $composableBuilder(column: $table.updatedAt, builder: (column) => column);

  GeneratedColumn<DateTime> get syncedAt =>
      $composableBuilder(column: $table.syncedAt, builder: (column) => column);
}

class $$DevisTableTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $DevisTableTable,
          DevisTableData,
          $$DevisTableTableFilterComposer,
          $$DevisTableTableOrderingComposer,
          $$DevisTableTableAnnotationComposer,
          $$DevisTableTableCreateCompanionBuilder,
          $$DevisTableTableUpdateCompanionBuilder,
          (
            DevisTableData,
            BaseReferences<_$AppDatabase, $DevisTableTable, DevisTableData>,
          ),
          DevisTableData,
          PrefetchHooks Function()
        > {
  $$DevisTableTableTableManager(_$AppDatabase db, $DevisTableTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$DevisTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$DevisTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$DevisTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> chantierId = const Value.absent(),
                Value<String> numero = const Value.absent(),
                Value<DateTime> dateEmission = const Value.absent(),
                Value<DateTime> dateValidite = const Value.absent(),
                Value<double> totalHT = const Value.absent(),
                Value<double> totalTVA = const Value.absent(),
                Value<double> totalTTC = const Value.absent(),
                Value<String> statut = const Value.absent(),
                Value<String?> pdfUrl = const Value.absent(),
                Value<String?> notes = const Value.absent(),
                Value<DateTime> createdAt = const Value.absent(),
                Value<DateTime> updatedAt = const Value.absent(),
                Value<DateTime?> syncedAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => DevisTableCompanion(
                id: id,
                chantierId: chantierId,
                numero: numero,
                dateEmission: dateEmission,
                dateValidite: dateValidite,
                totalHT: totalHT,
                totalTVA: totalTVA,
                totalTTC: totalTTC,
                statut: statut,
                pdfUrl: pdfUrl,
                notes: notes,
                createdAt: createdAt,
                updatedAt: updatedAt,
                syncedAt: syncedAt,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String chantierId,
                required String numero,
                required DateTime dateEmission,
                required DateTime dateValidite,
                required double totalHT,
                required double totalTVA,
                required double totalTTC,
                Value<String> statut = const Value.absent(),
                Value<String?> pdfUrl = const Value.absent(),
                Value<String?> notes = const Value.absent(),
                required DateTime createdAt,
                required DateTime updatedAt,
                Value<DateTime?> syncedAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => DevisTableCompanion.insert(
                id: id,
                chantierId: chantierId,
                numero: numero,
                dateEmission: dateEmission,
                dateValidite: dateValidite,
                totalHT: totalHT,
                totalTVA: totalTVA,
                totalTTC: totalTTC,
                statut: statut,
                pdfUrl: pdfUrl,
                notes: notes,
                createdAt: createdAt,
                updatedAt: updatedAt,
                syncedAt: syncedAt,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$DevisTableTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $DevisTableTable,
      DevisTableData,
      $$DevisTableTableFilterComposer,
      $$DevisTableTableOrderingComposer,
      $$DevisTableTableAnnotationComposer,
      $$DevisTableTableCreateCompanionBuilder,
      $$DevisTableTableUpdateCompanionBuilder,
      (
        DevisTableData,
        BaseReferences<_$AppDatabase, $DevisTableTable, DevisTableData>,
      ),
      DevisTableData,
      PrefetchHooks Function()
    >;
typedef $$FacturesTableTableCreateCompanionBuilder =
    FacturesTableCompanion Function({
      required String id,
      required String devisId,
      required String numero,
      required DateTime dateEmission,
      required DateTime dateEcheance,
      Value<DateTime?> datePaiement,
      required double totalHT,
      required double totalTVA,
      required double totalTTC,
      Value<String> statut,
      Value<String?> modePaiement,
      Value<String?> pdfUrl,
      Value<String?> notes,
      required DateTime createdAt,
      required DateTime updatedAt,
      Value<DateTime?> syncedAt,
      Value<int> rowid,
    });
typedef $$FacturesTableTableUpdateCompanionBuilder =
    FacturesTableCompanion Function({
      Value<String> id,
      Value<String> devisId,
      Value<String> numero,
      Value<DateTime> dateEmission,
      Value<DateTime> dateEcheance,
      Value<DateTime?> datePaiement,
      Value<double> totalHT,
      Value<double> totalTVA,
      Value<double> totalTTC,
      Value<String> statut,
      Value<String?> modePaiement,
      Value<String?> pdfUrl,
      Value<String?> notes,
      Value<DateTime> createdAt,
      Value<DateTime> updatedAt,
      Value<DateTime?> syncedAt,
      Value<int> rowid,
    });

class $$FacturesTableTableFilterComposer
    extends Composer<_$AppDatabase, $FacturesTableTable> {
  $$FacturesTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get devisId => $composableBuilder(
    column: $table.devisId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get numero => $composableBuilder(
    column: $table.numero,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get dateEmission => $composableBuilder(
    column: $table.dateEmission,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get dateEcheance => $composableBuilder(
    column: $table.dateEcheance,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get datePaiement => $composableBuilder(
    column: $table.datePaiement,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get totalHT => $composableBuilder(
    column: $table.totalHT,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get totalTVA => $composableBuilder(
    column: $table.totalTVA,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get totalTTC => $composableBuilder(
    column: $table.totalTTC,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get statut => $composableBuilder(
    column: $table.statut,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get modePaiement => $composableBuilder(
    column: $table.modePaiement,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get pdfUrl => $composableBuilder(
    column: $table.pdfUrl,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get notes => $composableBuilder(
    column: $table.notes,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get syncedAt => $composableBuilder(
    column: $table.syncedAt,
    builder: (column) => ColumnFilters(column),
  );
}

class $$FacturesTableTableOrderingComposer
    extends Composer<_$AppDatabase, $FacturesTableTable> {
  $$FacturesTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get devisId => $composableBuilder(
    column: $table.devisId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get numero => $composableBuilder(
    column: $table.numero,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get dateEmission => $composableBuilder(
    column: $table.dateEmission,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get dateEcheance => $composableBuilder(
    column: $table.dateEcheance,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get datePaiement => $composableBuilder(
    column: $table.datePaiement,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get totalHT => $composableBuilder(
    column: $table.totalHT,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get totalTVA => $composableBuilder(
    column: $table.totalTVA,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get totalTTC => $composableBuilder(
    column: $table.totalTTC,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get statut => $composableBuilder(
    column: $table.statut,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get modePaiement => $composableBuilder(
    column: $table.modePaiement,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get pdfUrl => $composableBuilder(
    column: $table.pdfUrl,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get notes => $composableBuilder(
    column: $table.notes,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get syncedAt => $composableBuilder(
    column: $table.syncedAt,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$FacturesTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $FacturesTableTable> {
  $$FacturesTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get devisId =>
      $composableBuilder(column: $table.devisId, builder: (column) => column);

  GeneratedColumn<String> get numero =>
      $composableBuilder(column: $table.numero, builder: (column) => column);

  GeneratedColumn<DateTime> get dateEmission => $composableBuilder(
    column: $table.dateEmission,
    builder: (column) => column,
  );

  GeneratedColumn<DateTime> get dateEcheance => $composableBuilder(
    column: $table.dateEcheance,
    builder: (column) => column,
  );

  GeneratedColumn<DateTime> get datePaiement => $composableBuilder(
    column: $table.datePaiement,
    builder: (column) => column,
  );

  GeneratedColumn<double> get totalHT =>
      $composableBuilder(column: $table.totalHT, builder: (column) => column);

  GeneratedColumn<double> get totalTVA =>
      $composableBuilder(column: $table.totalTVA, builder: (column) => column);

  GeneratedColumn<double> get totalTTC =>
      $composableBuilder(column: $table.totalTTC, builder: (column) => column);

  GeneratedColumn<String> get statut =>
      $composableBuilder(column: $table.statut, builder: (column) => column);

  GeneratedColumn<String> get modePaiement => $composableBuilder(
    column: $table.modePaiement,
    builder: (column) => column,
  );

  GeneratedColumn<String> get pdfUrl =>
      $composableBuilder(column: $table.pdfUrl, builder: (column) => column);

  GeneratedColumn<String> get notes =>
      $composableBuilder(column: $table.notes, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<DateTime> get updatedAt =>
      $composableBuilder(column: $table.updatedAt, builder: (column) => column);

  GeneratedColumn<DateTime> get syncedAt =>
      $composableBuilder(column: $table.syncedAt, builder: (column) => column);
}

class $$FacturesTableTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $FacturesTableTable,
          FacturesTableData,
          $$FacturesTableTableFilterComposer,
          $$FacturesTableTableOrderingComposer,
          $$FacturesTableTableAnnotationComposer,
          $$FacturesTableTableCreateCompanionBuilder,
          $$FacturesTableTableUpdateCompanionBuilder,
          (
            FacturesTableData,
            BaseReferences<
              _$AppDatabase,
              $FacturesTableTable,
              FacturesTableData
            >,
          ),
          FacturesTableData,
          PrefetchHooks Function()
        > {
  $$FacturesTableTableTableManager(_$AppDatabase db, $FacturesTableTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$FacturesTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$FacturesTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$FacturesTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> devisId = const Value.absent(),
                Value<String> numero = const Value.absent(),
                Value<DateTime> dateEmission = const Value.absent(),
                Value<DateTime> dateEcheance = const Value.absent(),
                Value<DateTime?> datePaiement = const Value.absent(),
                Value<double> totalHT = const Value.absent(),
                Value<double> totalTVA = const Value.absent(),
                Value<double> totalTTC = const Value.absent(),
                Value<String> statut = const Value.absent(),
                Value<String?> modePaiement = const Value.absent(),
                Value<String?> pdfUrl = const Value.absent(),
                Value<String?> notes = const Value.absent(),
                Value<DateTime> createdAt = const Value.absent(),
                Value<DateTime> updatedAt = const Value.absent(),
                Value<DateTime?> syncedAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => FacturesTableCompanion(
                id: id,
                devisId: devisId,
                numero: numero,
                dateEmission: dateEmission,
                dateEcheance: dateEcheance,
                datePaiement: datePaiement,
                totalHT: totalHT,
                totalTVA: totalTVA,
                totalTTC: totalTTC,
                statut: statut,
                modePaiement: modePaiement,
                pdfUrl: pdfUrl,
                notes: notes,
                createdAt: createdAt,
                updatedAt: updatedAt,
                syncedAt: syncedAt,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String devisId,
                required String numero,
                required DateTime dateEmission,
                required DateTime dateEcheance,
                Value<DateTime?> datePaiement = const Value.absent(),
                required double totalHT,
                required double totalTVA,
                required double totalTTC,
                Value<String> statut = const Value.absent(),
                Value<String?> modePaiement = const Value.absent(),
                Value<String?> pdfUrl = const Value.absent(),
                Value<String?> notes = const Value.absent(),
                required DateTime createdAt,
                required DateTime updatedAt,
                Value<DateTime?> syncedAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => FacturesTableCompanion.insert(
                id: id,
                devisId: devisId,
                numero: numero,
                dateEmission: dateEmission,
                dateEcheance: dateEcheance,
                datePaiement: datePaiement,
                totalHT: totalHT,
                totalTVA: totalTVA,
                totalTTC: totalTTC,
                statut: statut,
                modePaiement: modePaiement,
                pdfUrl: pdfUrl,
                notes: notes,
                createdAt: createdAt,
                updatedAt: updatedAt,
                syncedAt: syncedAt,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$FacturesTableTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $FacturesTableTable,
      FacturesTableData,
      $$FacturesTableTableFilterComposer,
      $$FacturesTableTableOrderingComposer,
      $$FacturesTableTableAnnotationComposer,
      $$FacturesTableTableCreateCompanionBuilder,
      $$FacturesTableTableUpdateCompanionBuilder,
      (
        FacturesTableData,
        BaseReferences<_$AppDatabase, $FacturesTableTable, FacturesTableData>,
      ),
      FacturesTableData,
      PrefetchHooks Function()
    >;
typedef $$AbsencesTableTableCreateCompanionBuilder =
    AbsencesTableCompanion Function({
      required String id,
      required String userId,
      required DateTime dateDebut,
      required DateTime dateFin,
      required String type,
      Value<String?> motif,
      Value<bool> validee,
      required DateTime createdAt,
      required DateTime updatedAt,
      Value<DateTime?> syncedAt,
      Value<int> rowid,
    });
typedef $$AbsencesTableTableUpdateCompanionBuilder =
    AbsencesTableCompanion Function({
      Value<String> id,
      Value<String> userId,
      Value<DateTime> dateDebut,
      Value<DateTime> dateFin,
      Value<String> type,
      Value<String?> motif,
      Value<bool> validee,
      Value<DateTime> createdAt,
      Value<DateTime> updatedAt,
      Value<DateTime?> syncedAt,
      Value<int> rowid,
    });

class $$AbsencesTableTableFilterComposer
    extends Composer<_$AppDatabase, $AbsencesTableTable> {
  $$AbsencesTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get userId => $composableBuilder(
    column: $table.userId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get dateDebut => $composableBuilder(
    column: $table.dateDebut,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get dateFin => $composableBuilder(
    column: $table.dateFin,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get type => $composableBuilder(
    column: $table.type,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get motif => $composableBuilder(
    column: $table.motif,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get validee => $composableBuilder(
    column: $table.validee,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get syncedAt => $composableBuilder(
    column: $table.syncedAt,
    builder: (column) => ColumnFilters(column),
  );
}

class $$AbsencesTableTableOrderingComposer
    extends Composer<_$AppDatabase, $AbsencesTableTable> {
  $$AbsencesTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get userId => $composableBuilder(
    column: $table.userId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get dateDebut => $composableBuilder(
    column: $table.dateDebut,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get dateFin => $composableBuilder(
    column: $table.dateFin,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get type => $composableBuilder(
    column: $table.type,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get motif => $composableBuilder(
    column: $table.motif,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get validee => $composableBuilder(
    column: $table.validee,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get syncedAt => $composableBuilder(
    column: $table.syncedAt,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$AbsencesTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $AbsencesTableTable> {
  $$AbsencesTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get userId =>
      $composableBuilder(column: $table.userId, builder: (column) => column);

  GeneratedColumn<DateTime> get dateDebut =>
      $composableBuilder(column: $table.dateDebut, builder: (column) => column);

  GeneratedColumn<DateTime> get dateFin =>
      $composableBuilder(column: $table.dateFin, builder: (column) => column);

  GeneratedColumn<String> get type =>
      $composableBuilder(column: $table.type, builder: (column) => column);

  GeneratedColumn<String> get motif =>
      $composableBuilder(column: $table.motif, builder: (column) => column);

  GeneratedColumn<bool> get validee =>
      $composableBuilder(column: $table.validee, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<DateTime> get updatedAt =>
      $composableBuilder(column: $table.updatedAt, builder: (column) => column);

  GeneratedColumn<DateTime> get syncedAt =>
      $composableBuilder(column: $table.syncedAt, builder: (column) => column);
}

class $$AbsencesTableTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $AbsencesTableTable,
          AbsencesTableData,
          $$AbsencesTableTableFilterComposer,
          $$AbsencesTableTableOrderingComposer,
          $$AbsencesTableTableAnnotationComposer,
          $$AbsencesTableTableCreateCompanionBuilder,
          $$AbsencesTableTableUpdateCompanionBuilder,
          (
            AbsencesTableData,
            BaseReferences<
              _$AppDatabase,
              $AbsencesTableTable,
              AbsencesTableData
            >,
          ),
          AbsencesTableData,
          PrefetchHooks Function()
        > {
  $$AbsencesTableTableTableManager(_$AppDatabase db, $AbsencesTableTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$AbsencesTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$AbsencesTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$AbsencesTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> userId = const Value.absent(),
                Value<DateTime> dateDebut = const Value.absent(),
                Value<DateTime> dateFin = const Value.absent(),
                Value<String> type = const Value.absent(),
                Value<String?> motif = const Value.absent(),
                Value<bool> validee = const Value.absent(),
                Value<DateTime> createdAt = const Value.absent(),
                Value<DateTime> updatedAt = const Value.absent(),
                Value<DateTime?> syncedAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => AbsencesTableCompanion(
                id: id,
                userId: userId,
                dateDebut: dateDebut,
                dateFin: dateFin,
                type: type,
                motif: motif,
                validee: validee,
                createdAt: createdAt,
                updatedAt: updatedAt,
                syncedAt: syncedAt,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String userId,
                required DateTime dateDebut,
                required DateTime dateFin,
                required String type,
                Value<String?> motif = const Value.absent(),
                Value<bool> validee = const Value.absent(),
                required DateTime createdAt,
                required DateTime updatedAt,
                Value<DateTime?> syncedAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => AbsencesTableCompanion.insert(
                id: id,
                userId: userId,
                dateDebut: dateDebut,
                dateFin: dateFin,
                type: type,
                motif: motif,
                validee: validee,
                createdAt: createdAt,
                updatedAt: updatedAt,
                syncedAt: syncedAt,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$AbsencesTableTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $AbsencesTableTable,
      AbsencesTableData,
      $$AbsencesTableTableFilterComposer,
      $$AbsencesTableTableOrderingComposer,
      $$AbsencesTableTableAnnotationComposer,
      $$AbsencesTableTableCreateCompanionBuilder,
      $$AbsencesTableTableUpdateCompanionBuilder,
      (
        AbsencesTableData,
        BaseReferences<_$AppDatabase, $AbsencesTableTable, AbsencesTableData>,
      ),
      AbsencesTableData,
      PrefetchHooks Function()
    >;
typedef $$SyncQueueTableTableCreateCompanionBuilder =
    SyncQueueTableCompanion Function({
      Value<int> id,
      required String operation,
      required String entity,
      Value<String?> entityId,
      required String data,
      required int timestamp,
      Value<int> retryCount,
      Value<String?> lastError,
      Value<String> status,
    });
typedef $$SyncQueueTableTableUpdateCompanionBuilder =
    SyncQueueTableCompanion Function({
      Value<int> id,
      Value<String> operation,
      Value<String> entity,
      Value<String?> entityId,
      Value<String> data,
      Value<int> timestamp,
      Value<int> retryCount,
      Value<String?> lastError,
      Value<String> status,
    });

class $$SyncQueueTableTableFilterComposer
    extends Composer<_$AppDatabase, $SyncQueueTableTable> {
  $$SyncQueueTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get operation => $composableBuilder(
    column: $table.operation,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get entity => $composableBuilder(
    column: $table.entity,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get entityId => $composableBuilder(
    column: $table.entityId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get data => $composableBuilder(
    column: $table.data,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get timestamp => $composableBuilder(
    column: $table.timestamp,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get retryCount => $composableBuilder(
    column: $table.retryCount,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get lastError => $composableBuilder(
    column: $table.lastError,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get status => $composableBuilder(
    column: $table.status,
    builder: (column) => ColumnFilters(column),
  );
}

class $$SyncQueueTableTableOrderingComposer
    extends Composer<_$AppDatabase, $SyncQueueTableTable> {
  $$SyncQueueTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get operation => $composableBuilder(
    column: $table.operation,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get entity => $composableBuilder(
    column: $table.entity,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get entityId => $composableBuilder(
    column: $table.entityId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get data => $composableBuilder(
    column: $table.data,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get timestamp => $composableBuilder(
    column: $table.timestamp,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get retryCount => $composableBuilder(
    column: $table.retryCount,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get lastError => $composableBuilder(
    column: $table.lastError,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get status => $composableBuilder(
    column: $table.status,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$SyncQueueTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $SyncQueueTableTable> {
  $$SyncQueueTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get operation =>
      $composableBuilder(column: $table.operation, builder: (column) => column);

  GeneratedColumn<String> get entity =>
      $composableBuilder(column: $table.entity, builder: (column) => column);

  GeneratedColumn<String> get entityId =>
      $composableBuilder(column: $table.entityId, builder: (column) => column);

  GeneratedColumn<String> get data =>
      $composableBuilder(column: $table.data, builder: (column) => column);

  GeneratedColumn<int> get timestamp =>
      $composableBuilder(column: $table.timestamp, builder: (column) => column);

  GeneratedColumn<int> get retryCount => $composableBuilder(
    column: $table.retryCount,
    builder: (column) => column,
  );

  GeneratedColumn<String> get lastError =>
      $composableBuilder(column: $table.lastError, builder: (column) => column);

  GeneratedColumn<String> get status =>
      $composableBuilder(column: $table.status, builder: (column) => column);
}

class $$SyncQueueTableTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $SyncQueueTableTable,
          SyncQueueTableData,
          $$SyncQueueTableTableFilterComposer,
          $$SyncQueueTableTableOrderingComposer,
          $$SyncQueueTableTableAnnotationComposer,
          $$SyncQueueTableTableCreateCompanionBuilder,
          $$SyncQueueTableTableUpdateCompanionBuilder,
          (
            SyncQueueTableData,
            BaseReferences<
              _$AppDatabase,
              $SyncQueueTableTable,
              SyncQueueTableData
            >,
          ),
          SyncQueueTableData,
          PrefetchHooks Function()
        > {
  $$SyncQueueTableTableTableManager(
    _$AppDatabase db,
    $SyncQueueTableTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$SyncQueueTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$SyncQueueTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$SyncQueueTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<int> id = const Value.absent(),
                Value<String> operation = const Value.absent(),
                Value<String> entity = const Value.absent(),
                Value<String?> entityId = const Value.absent(),
                Value<String> data = const Value.absent(),
                Value<int> timestamp = const Value.absent(),
                Value<int> retryCount = const Value.absent(),
                Value<String?> lastError = const Value.absent(),
                Value<String> status = const Value.absent(),
              }) => SyncQueueTableCompanion(
                id: id,
                operation: operation,
                entity: entity,
                entityId: entityId,
                data: data,
                timestamp: timestamp,
                retryCount: retryCount,
                lastError: lastError,
                status: status,
              ),
          createCompanionCallback:
              ({
                Value<int> id = const Value.absent(),
                required String operation,
                required String entity,
                Value<String?> entityId = const Value.absent(),
                required String data,
                required int timestamp,
                Value<int> retryCount = const Value.absent(),
                Value<String?> lastError = const Value.absent(),
                Value<String> status = const Value.absent(),
              }) => SyncQueueTableCompanion.insert(
                id: id,
                operation: operation,
                entity: entity,
                entityId: entityId,
                data: data,
                timestamp: timestamp,
                retryCount: retryCount,
                lastError: lastError,
                status: status,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$SyncQueueTableTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $SyncQueueTableTable,
      SyncQueueTableData,
      $$SyncQueueTableTableFilterComposer,
      $$SyncQueueTableTableOrderingComposer,
      $$SyncQueueTableTableAnnotationComposer,
      $$SyncQueueTableTableCreateCompanionBuilder,
      $$SyncQueueTableTableUpdateCompanionBuilder,
      (
        SyncQueueTableData,
        BaseReferences<_$AppDatabase, $SyncQueueTableTable, SyncQueueTableData>,
      ),
      SyncQueueTableData,
      PrefetchHooks Function()
    >;
typedef $$SyncMetaTableTableCreateCompanionBuilder =
    SyncMetaTableCompanion Function({
      required String entity,
      Value<DateTime?> lastSyncAt,
      Value<String?> lastSyncCursor,
      Value<int> totalSynced,
      Value<int> rowid,
    });
typedef $$SyncMetaTableTableUpdateCompanionBuilder =
    SyncMetaTableCompanion Function({
      Value<String> entity,
      Value<DateTime?> lastSyncAt,
      Value<String?> lastSyncCursor,
      Value<int> totalSynced,
      Value<int> rowid,
    });

class $$SyncMetaTableTableFilterComposer
    extends Composer<_$AppDatabase, $SyncMetaTableTable> {
  $$SyncMetaTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get entity => $composableBuilder(
    column: $table.entity,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get lastSyncAt => $composableBuilder(
    column: $table.lastSyncAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get lastSyncCursor => $composableBuilder(
    column: $table.lastSyncCursor,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get totalSynced => $composableBuilder(
    column: $table.totalSynced,
    builder: (column) => ColumnFilters(column),
  );
}

class $$SyncMetaTableTableOrderingComposer
    extends Composer<_$AppDatabase, $SyncMetaTableTable> {
  $$SyncMetaTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get entity => $composableBuilder(
    column: $table.entity,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get lastSyncAt => $composableBuilder(
    column: $table.lastSyncAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get lastSyncCursor => $composableBuilder(
    column: $table.lastSyncCursor,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get totalSynced => $composableBuilder(
    column: $table.totalSynced,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$SyncMetaTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $SyncMetaTableTable> {
  $$SyncMetaTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get entity =>
      $composableBuilder(column: $table.entity, builder: (column) => column);

  GeneratedColumn<DateTime> get lastSyncAt => $composableBuilder(
    column: $table.lastSyncAt,
    builder: (column) => column,
  );

  GeneratedColumn<String> get lastSyncCursor => $composableBuilder(
    column: $table.lastSyncCursor,
    builder: (column) => column,
  );

  GeneratedColumn<int> get totalSynced => $composableBuilder(
    column: $table.totalSynced,
    builder: (column) => column,
  );
}

class $$SyncMetaTableTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $SyncMetaTableTable,
          SyncMetaTableData,
          $$SyncMetaTableTableFilterComposer,
          $$SyncMetaTableTableOrderingComposer,
          $$SyncMetaTableTableAnnotationComposer,
          $$SyncMetaTableTableCreateCompanionBuilder,
          $$SyncMetaTableTableUpdateCompanionBuilder,
          (
            SyncMetaTableData,
            BaseReferences<
              _$AppDatabase,
              $SyncMetaTableTable,
              SyncMetaTableData
            >,
          ),
          SyncMetaTableData,
          PrefetchHooks Function()
        > {
  $$SyncMetaTableTableTableManager(_$AppDatabase db, $SyncMetaTableTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$SyncMetaTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$SyncMetaTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$SyncMetaTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> entity = const Value.absent(),
                Value<DateTime?> lastSyncAt = const Value.absent(),
                Value<String?> lastSyncCursor = const Value.absent(),
                Value<int> totalSynced = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => SyncMetaTableCompanion(
                entity: entity,
                lastSyncAt: lastSyncAt,
                lastSyncCursor: lastSyncCursor,
                totalSynced: totalSynced,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String entity,
                Value<DateTime?> lastSyncAt = const Value.absent(),
                Value<String?> lastSyncCursor = const Value.absent(),
                Value<int> totalSynced = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => SyncMetaTableCompanion.insert(
                entity: entity,
                lastSyncAt: lastSyncAt,
                lastSyncCursor: lastSyncCursor,
                totalSynced: totalSynced,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$SyncMetaTableTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $SyncMetaTableTable,
      SyncMetaTableData,
      $$SyncMetaTableTableFilterComposer,
      $$SyncMetaTableTableOrderingComposer,
      $$SyncMetaTableTableAnnotationComposer,
      $$SyncMetaTableTableCreateCompanionBuilder,
      $$SyncMetaTableTableUpdateCompanionBuilder,
      (
        SyncMetaTableData,
        BaseReferences<_$AppDatabase, $SyncMetaTableTable, SyncMetaTableData>,
      ),
      SyncMetaTableData,
      PrefetchHooks Function()
    >;
typedef $$PhotoQueueTableTableCreateCompanionBuilder =
    PhotoQueueTableCompanion Function({
      Value<int> id,
      required String interventionId,
      required String type,
      required String filePath,
      required String mimeType,
      required int fileSize,
      Value<double?> latitude,
      Value<double?> longitude,
      required DateTime takenAt,
      Value<int> attempts,
      Value<String?> lastError,
      Value<String> status,
    });
typedef $$PhotoQueueTableTableUpdateCompanionBuilder =
    PhotoQueueTableCompanion Function({
      Value<int> id,
      Value<String> interventionId,
      Value<String> type,
      Value<String> filePath,
      Value<String> mimeType,
      Value<int> fileSize,
      Value<double?> latitude,
      Value<double?> longitude,
      Value<DateTime> takenAt,
      Value<int> attempts,
      Value<String?> lastError,
      Value<String> status,
    });

class $$PhotoQueueTableTableFilterComposer
    extends Composer<_$AppDatabase, $PhotoQueueTableTable> {
  $$PhotoQueueTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get interventionId => $composableBuilder(
    column: $table.interventionId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get type => $composableBuilder(
    column: $table.type,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get filePath => $composableBuilder(
    column: $table.filePath,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get mimeType => $composableBuilder(
    column: $table.mimeType,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get fileSize => $composableBuilder(
    column: $table.fileSize,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get latitude => $composableBuilder(
    column: $table.latitude,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get longitude => $composableBuilder(
    column: $table.longitude,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get takenAt => $composableBuilder(
    column: $table.takenAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get attempts => $composableBuilder(
    column: $table.attempts,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get lastError => $composableBuilder(
    column: $table.lastError,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get status => $composableBuilder(
    column: $table.status,
    builder: (column) => ColumnFilters(column),
  );
}

class $$PhotoQueueTableTableOrderingComposer
    extends Composer<_$AppDatabase, $PhotoQueueTableTable> {
  $$PhotoQueueTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get interventionId => $composableBuilder(
    column: $table.interventionId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get type => $composableBuilder(
    column: $table.type,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get filePath => $composableBuilder(
    column: $table.filePath,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get mimeType => $composableBuilder(
    column: $table.mimeType,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get fileSize => $composableBuilder(
    column: $table.fileSize,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get latitude => $composableBuilder(
    column: $table.latitude,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get longitude => $composableBuilder(
    column: $table.longitude,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get takenAt => $composableBuilder(
    column: $table.takenAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get attempts => $composableBuilder(
    column: $table.attempts,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get lastError => $composableBuilder(
    column: $table.lastError,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get status => $composableBuilder(
    column: $table.status,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$PhotoQueueTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $PhotoQueueTableTable> {
  $$PhotoQueueTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get interventionId => $composableBuilder(
    column: $table.interventionId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get type =>
      $composableBuilder(column: $table.type, builder: (column) => column);

  GeneratedColumn<String> get filePath =>
      $composableBuilder(column: $table.filePath, builder: (column) => column);

  GeneratedColumn<String> get mimeType =>
      $composableBuilder(column: $table.mimeType, builder: (column) => column);

  GeneratedColumn<int> get fileSize =>
      $composableBuilder(column: $table.fileSize, builder: (column) => column);

  GeneratedColumn<double> get latitude =>
      $composableBuilder(column: $table.latitude, builder: (column) => column);

  GeneratedColumn<double> get longitude =>
      $composableBuilder(column: $table.longitude, builder: (column) => column);

  GeneratedColumn<DateTime> get takenAt =>
      $composableBuilder(column: $table.takenAt, builder: (column) => column);

  GeneratedColumn<int> get attempts =>
      $composableBuilder(column: $table.attempts, builder: (column) => column);

  GeneratedColumn<String> get lastError =>
      $composableBuilder(column: $table.lastError, builder: (column) => column);

  GeneratedColumn<String> get status =>
      $composableBuilder(column: $table.status, builder: (column) => column);
}

class $$PhotoQueueTableTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $PhotoQueueTableTable,
          PhotoQueueTableData,
          $$PhotoQueueTableTableFilterComposer,
          $$PhotoQueueTableTableOrderingComposer,
          $$PhotoQueueTableTableAnnotationComposer,
          $$PhotoQueueTableTableCreateCompanionBuilder,
          $$PhotoQueueTableTableUpdateCompanionBuilder,
          (
            PhotoQueueTableData,
            BaseReferences<
              _$AppDatabase,
              $PhotoQueueTableTable,
              PhotoQueueTableData
            >,
          ),
          PhotoQueueTableData,
          PrefetchHooks Function()
        > {
  $$PhotoQueueTableTableTableManager(
    _$AppDatabase db,
    $PhotoQueueTableTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$PhotoQueueTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$PhotoQueueTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$PhotoQueueTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<int> id = const Value.absent(),
                Value<String> interventionId = const Value.absent(),
                Value<String> type = const Value.absent(),
                Value<String> filePath = const Value.absent(),
                Value<String> mimeType = const Value.absent(),
                Value<int> fileSize = const Value.absent(),
                Value<double?> latitude = const Value.absent(),
                Value<double?> longitude = const Value.absent(),
                Value<DateTime> takenAt = const Value.absent(),
                Value<int> attempts = const Value.absent(),
                Value<String?> lastError = const Value.absent(),
                Value<String> status = const Value.absent(),
              }) => PhotoQueueTableCompanion(
                id: id,
                interventionId: interventionId,
                type: type,
                filePath: filePath,
                mimeType: mimeType,
                fileSize: fileSize,
                latitude: latitude,
                longitude: longitude,
                takenAt: takenAt,
                attempts: attempts,
                lastError: lastError,
                status: status,
              ),
          createCompanionCallback:
              ({
                Value<int> id = const Value.absent(),
                required String interventionId,
                required String type,
                required String filePath,
                required String mimeType,
                required int fileSize,
                Value<double?> latitude = const Value.absent(),
                Value<double?> longitude = const Value.absent(),
                required DateTime takenAt,
                Value<int> attempts = const Value.absent(),
                Value<String?> lastError = const Value.absent(),
                Value<String> status = const Value.absent(),
              }) => PhotoQueueTableCompanion.insert(
                id: id,
                interventionId: interventionId,
                type: type,
                filePath: filePath,
                mimeType: mimeType,
                fileSize: fileSize,
                latitude: latitude,
                longitude: longitude,
                takenAt: takenAt,
                attempts: attempts,
                lastError: lastError,
                status: status,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$PhotoQueueTableTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $PhotoQueueTableTable,
      PhotoQueueTableData,
      $$PhotoQueueTableTableFilterComposer,
      $$PhotoQueueTableTableOrderingComposer,
      $$PhotoQueueTableTableAnnotationComposer,
      $$PhotoQueueTableTableCreateCompanionBuilder,
      $$PhotoQueueTableTableUpdateCompanionBuilder,
      (
        PhotoQueueTableData,
        BaseReferences<
          _$AppDatabase,
          $PhotoQueueTableTable,
          PhotoQueueTableData
        >,
      ),
      PhotoQueueTableData,
      PrefetchHooks Function()
    >;

class $AppDatabaseManager {
  final _$AppDatabase _db;
  $AppDatabaseManager(this._db);
  $$ClientsTableTableTableManager get clientsTable =>
      $$ClientsTableTableTableManager(_db, _db.clientsTable);
  $$ChantiersTableTableTableManager get chantiersTable =>
      $$ChantiersTableTableTableManager(_db, _db.chantiersTable);
  $$InterventionsTableTableTableManager get interventionsTable =>
      $$InterventionsTableTableTableManager(_db, _db.interventionsTable);
  $$DevisTableTableTableManager get devisTable =>
      $$DevisTableTableTableManager(_db, _db.devisTable);
  $$FacturesTableTableTableManager get facturesTable =>
      $$FacturesTableTableTableManager(_db, _db.facturesTable);
  $$AbsencesTableTableTableManager get absencesTable =>
      $$AbsencesTableTableTableManager(_db, _db.absencesTable);
  $$SyncQueueTableTableTableManager get syncQueueTable =>
      $$SyncQueueTableTableTableManager(_db, _db.syncQueueTable);
  $$SyncMetaTableTableTableManager get syncMetaTable =>
      $$SyncMetaTableTableTableManager(_db, _db.syncMetaTable);
  $$PhotoQueueTableTableTableManager get photoQueueTable =>
      $$PhotoQueueTableTableTableManager(_db, _db.photoQueueTable);
}
