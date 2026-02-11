// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'client.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$Client {

 String get id; ClientType get type; String get nom; String? get prenom; String? get raisonSociale; String get email; String get telephone; String? get telephoneSecondaire; String get adresse; String get codePostal; String get ville; String? get notes; List<String> get tags; DateTime? get deletedAt; DateTime get createdAt; DateTime get updatedAt;
/// Create a copy of Client
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ClientCopyWith<Client> get copyWith => _$ClientCopyWithImpl<Client>(this as Client, _$identity);

  /// Serializes this Client to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Client&&(identical(other.id, id) || other.id == id)&&(identical(other.type, type) || other.type == type)&&(identical(other.nom, nom) || other.nom == nom)&&(identical(other.prenom, prenom) || other.prenom == prenom)&&(identical(other.raisonSociale, raisonSociale) || other.raisonSociale == raisonSociale)&&(identical(other.email, email) || other.email == email)&&(identical(other.telephone, telephone) || other.telephone == telephone)&&(identical(other.telephoneSecondaire, telephoneSecondaire) || other.telephoneSecondaire == telephoneSecondaire)&&(identical(other.adresse, adresse) || other.adresse == adresse)&&(identical(other.codePostal, codePostal) || other.codePostal == codePostal)&&(identical(other.ville, ville) || other.ville == ville)&&(identical(other.notes, notes) || other.notes == notes)&&const DeepCollectionEquality().equals(other.tags, tags)&&(identical(other.deletedAt, deletedAt) || other.deletedAt == deletedAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,type,nom,prenom,raisonSociale,email,telephone,telephoneSecondaire,adresse,codePostal,ville,notes,const DeepCollectionEquality().hash(tags),deletedAt,createdAt,updatedAt);

@override
String toString() {
  return 'Client(id: $id, type: $type, nom: $nom, prenom: $prenom, raisonSociale: $raisonSociale, email: $email, telephone: $telephone, telephoneSecondaire: $telephoneSecondaire, adresse: $adresse, codePostal: $codePostal, ville: $ville, notes: $notes, tags: $tags, deletedAt: $deletedAt, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $ClientCopyWith<$Res>  {
  factory $ClientCopyWith(Client value, $Res Function(Client) _then) = _$ClientCopyWithImpl;
@useResult
$Res call({
 String id, ClientType type, String nom, String? prenom, String? raisonSociale, String email, String telephone, String? telephoneSecondaire, String adresse, String codePostal, String ville, String? notes, List<String> tags, DateTime? deletedAt, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class _$ClientCopyWithImpl<$Res>
    implements $ClientCopyWith<$Res> {
  _$ClientCopyWithImpl(this._self, this._then);

  final Client _self;
  final $Res Function(Client) _then;

/// Create a copy of Client
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? type = null,Object? nom = null,Object? prenom = freezed,Object? raisonSociale = freezed,Object? email = null,Object? telephone = null,Object? telephoneSecondaire = freezed,Object? adresse = null,Object? codePostal = null,Object? ville = null,Object? notes = freezed,Object? tags = null,Object? deletedAt = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as ClientType,nom: null == nom ? _self.nom : nom // ignore: cast_nullable_to_non_nullable
as String,prenom: freezed == prenom ? _self.prenom : prenom // ignore: cast_nullable_to_non_nullable
as String?,raisonSociale: freezed == raisonSociale ? _self.raisonSociale : raisonSociale // ignore: cast_nullable_to_non_nullable
as String?,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,telephone: null == telephone ? _self.telephone : telephone // ignore: cast_nullable_to_non_nullable
as String,telephoneSecondaire: freezed == telephoneSecondaire ? _self.telephoneSecondaire : telephoneSecondaire // ignore: cast_nullable_to_non_nullable
as String?,adresse: null == adresse ? _self.adresse : adresse // ignore: cast_nullable_to_non_nullable
as String,codePostal: null == codePostal ? _self.codePostal : codePostal // ignore: cast_nullable_to_non_nullable
as String,ville: null == ville ? _self.ville : ville // ignore: cast_nullable_to_non_nullable
as String,notes: freezed == notes ? _self.notes : notes // ignore: cast_nullable_to_non_nullable
as String?,tags: null == tags ? _self.tags : tags // ignore: cast_nullable_to_non_nullable
as List<String>,deletedAt: freezed == deletedAt ? _self.deletedAt : deletedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [Client].
extension ClientPatterns on Client {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Client value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _Client() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Client value)  $default,){
final _that = this;
switch (_that) {
case _Client():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Client value)?  $default,){
final _that = this;
switch (_that) {
case _Client() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  ClientType type,  String nom,  String? prenom,  String? raisonSociale,  String email,  String telephone,  String? telephoneSecondaire,  String adresse,  String codePostal,  String ville,  String? notes,  List<String> tags,  DateTime? deletedAt,  DateTime createdAt,  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Client() when $default != null:
return $default(_that.id,_that.type,_that.nom,_that.prenom,_that.raisonSociale,_that.email,_that.telephone,_that.telephoneSecondaire,_that.adresse,_that.codePostal,_that.ville,_that.notes,_that.tags,_that.deletedAt,_that.createdAt,_that.updatedAt);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  ClientType type,  String nom,  String? prenom,  String? raisonSociale,  String email,  String telephone,  String? telephoneSecondaire,  String adresse,  String codePostal,  String ville,  String? notes,  List<String> tags,  DateTime? deletedAt,  DateTime createdAt,  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _Client():
return $default(_that.id,_that.type,_that.nom,_that.prenom,_that.raisonSociale,_that.email,_that.telephone,_that.telephoneSecondaire,_that.adresse,_that.codePostal,_that.ville,_that.notes,_that.tags,_that.deletedAt,_that.createdAt,_that.updatedAt);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  ClientType type,  String nom,  String? prenom,  String? raisonSociale,  String email,  String telephone,  String? telephoneSecondaire,  String adresse,  String codePostal,  String ville,  String? notes,  List<String> tags,  DateTime? deletedAt,  DateTime createdAt,  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _Client() when $default != null:
return $default(_that.id,_that.type,_that.nom,_that.prenom,_that.raisonSociale,_that.email,_that.telephone,_that.telephoneSecondaire,_that.adresse,_that.codePostal,_that.ville,_that.notes,_that.tags,_that.deletedAt,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _Client implements Client {
  const _Client({required this.id, required this.type, required this.nom, this.prenom, this.raisonSociale, required this.email, required this.telephone, this.telephoneSecondaire, required this.adresse, required this.codePostal, required this.ville, this.notes, final  List<String> tags = const [], this.deletedAt, required this.createdAt, required this.updatedAt}): _tags = tags;
  factory _Client.fromJson(Map<String, dynamic> json) => _$ClientFromJson(json);

@override final  String id;
@override final  ClientType type;
@override final  String nom;
@override final  String? prenom;
@override final  String? raisonSociale;
@override final  String email;
@override final  String telephone;
@override final  String? telephoneSecondaire;
@override final  String adresse;
@override final  String codePostal;
@override final  String ville;
@override final  String? notes;
 final  List<String> _tags;
@override@JsonKey() List<String> get tags {
  if (_tags is EqualUnmodifiableListView) return _tags;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_tags);
}

@override final  DateTime? deletedAt;
@override final  DateTime createdAt;
@override final  DateTime updatedAt;

/// Create a copy of Client
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ClientCopyWith<_Client> get copyWith => __$ClientCopyWithImpl<_Client>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ClientToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _Client&&(identical(other.id, id) || other.id == id)&&(identical(other.type, type) || other.type == type)&&(identical(other.nom, nom) || other.nom == nom)&&(identical(other.prenom, prenom) || other.prenom == prenom)&&(identical(other.raisonSociale, raisonSociale) || other.raisonSociale == raisonSociale)&&(identical(other.email, email) || other.email == email)&&(identical(other.telephone, telephone) || other.telephone == telephone)&&(identical(other.telephoneSecondaire, telephoneSecondaire) || other.telephoneSecondaire == telephoneSecondaire)&&(identical(other.adresse, adresse) || other.adresse == adresse)&&(identical(other.codePostal, codePostal) || other.codePostal == codePostal)&&(identical(other.ville, ville) || other.ville == ville)&&(identical(other.notes, notes) || other.notes == notes)&&const DeepCollectionEquality().equals(other._tags, _tags)&&(identical(other.deletedAt, deletedAt) || other.deletedAt == deletedAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,type,nom,prenom,raisonSociale,email,telephone,telephoneSecondaire,adresse,codePostal,ville,notes,const DeepCollectionEquality().hash(_tags),deletedAt,createdAt,updatedAt);

@override
String toString() {
  return 'Client(id: $id, type: $type, nom: $nom, prenom: $prenom, raisonSociale: $raisonSociale, email: $email, telephone: $telephone, telephoneSecondaire: $telephoneSecondaire, adresse: $adresse, codePostal: $codePostal, ville: $ville, notes: $notes, tags: $tags, deletedAt: $deletedAt, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$ClientCopyWith<$Res> implements $ClientCopyWith<$Res> {
  factory _$ClientCopyWith(_Client value, $Res Function(_Client) _then) = __$ClientCopyWithImpl;
@override @useResult
$Res call({
 String id, ClientType type, String nom, String? prenom, String? raisonSociale, String email, String telephone, String? telephoneSecondaire, String adresse, String codePostal, String ville, String? notes, List<String> tags, DateTime? deletedAt, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class __$ClientCopyWithImpl<$Res>
    implements _$ClientCopyWith<$Res> {
  __$ClientCopyWithImpl(this._self, this._then);

  final _Client _self;
  final $Res Function(_Client) _then;

/// Create a copy of Client
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? type = null,Object? nom = null,Object? prenom = freezed,Object? raisonSociale = freezed,Object? email = null,Object? telephone = null,Object? telephoneSecondaire = freezed,Object? adresse = null,Object? codePostal = null,Object? ville = null,Object? notes = freezed,Object? tags = null,Object? deletedAt = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_Client(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as ClientType,nom: null == nom ? _self.nom : nom // ignore: cast_nullable_to_non_nullable
as String,prenom: freezed == prenom ? _self.prenom : prenom // ignore: cast_nullable_to_non_nullable
as String?,raisonSociale: freezed == raisonSociale ? _self.raisonSociale : raisonSociale // ignore: cast_nullable_to_non_nullable
as String?,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,telephone: null == telephone ? _self.telephone : telephone // ignore: cast_nullable_to_non_nullable
as String,telephoneSecondaire: freezed == telephoneSecondaire ? _self.telephoneSecondaire : telephoneSecondaire // ignore: cast_nullable_to_non_nullable
as String?,adresse: null == adresse ? _self.adresse : adresse // ignore: cast_nullable_to_non_nullable
as String,codePostal: null == codePostal ? _self.codePostal : codePostal // ignore: cast_nullable_to_non_nullable
as String,ville: null == ville ? _self.ville : ville // ignore: cast_nullable_to_non_nullable
as String,notes: freezed == notes ? _self.notes : notes // ignore: cast_nullable_to_non_nullable
as String?,tags: null == tags ? _self._tags : tags // ignore: cast_nullable_to_non_nullable
as List<String>,deletedAt: freezed == deletedAt ? _self.deletedAt : deletedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}

// dart format on
