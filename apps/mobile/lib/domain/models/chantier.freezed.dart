// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'chantier.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$Chantier {

 String get id; String get clientId; String get adresse; String get codePostal; String get ville; double? get latitude; double? get longitude; List<TypePrestation> get typePrestation; String get description; double? get surface; ChantierStatut get statut; DateTime? get dateVisite; DateTime? get dateDebut; DateTime? get dateFin; String? get responsableId; String? get notes; List<String> get photos; DateTime? get deletedAt; DateTime get createdAt; DateTime get updatedAt;
/// Create a copy of Chantier
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ChantierCopyWith<Chantier> get copyWith => _$ChantierCopyWithImpl<Chantier>(this as Chantier, _$identity);

  /// Serializes this Chantier to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Chantier&&(identical(other.id, id) || other.id == id)&&(identical(other.clientId, clientId) || other.clientId == clientId)&&(identical(other.adresse, adresse) || other.adresse == adresse)&&(identical(other.codePostal, codePostal) || other.codePostal == codePostal)&&(identical(other.ville, ville) || other.ville == ville)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&const DeepCollectionEquality().equals(other.typePrestation, typePrestation)&&(identical(other.description, description) || other.description == description)&&(identical(other.surface, surface) || other.surface == surface)&&(identical(other.statut, statut) || other.statut == statut)&&(identical(other.dateVisite, dateVisite) || other.dateVisite == dateVisite)&&(identical(other.dateDebut, dateDebut) || other.dateDebut == dateDebut)&&(identical(other.dateFin, dateFin) || other.dateFin == dateFin)&&(identical(other.responsableId, responsableId) || other.responsableId == responsableId)&&(identical(other.notes, notes) || other.notes == notes)&&const DeepCollectionEquality().equals(other.photos, photos)&&(identical(other.deletedAt, deletedAt) || other.deletedAt == deletedAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,clientId,adresse,codePostal,ville,latitude,longitude,const DeepCollectionEquality().hash(typePrestation),description,surface,statut,dateVisite,dateDebut,dateFin,responsableId,notes,const DeepCollectionEquality().hash(photos),deletedAt,createdAt,updatedAt]);

@override
String toString() {
  return 'Chantier(id: $id, clientId: $clientId, adresse: $adresse, codePostal: $codePostal, ville: $ville, latitude: $latitude, longitude: $longitude, typePrestation: $typePrestation, description: $description, surface: $surface, statut: $statut, dateVisite: $dateVisite, dateDebut: $dateDebut, dateFin: $dateFin, responsableId: $responsableId, notes: $notes, photos: $photos, deletedAt: $deletedAt, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $ChantierCopyWith<$Res>  {
  factory $ChantierCopyWith(Chantier value, $Res Function(Chantier) _then) = _$ChantierCopyWithImpl;
@useResult
$Res call({
 String id, String clientId, String adresse, String codePostal, String ville, double? latitude, double? longitude, List<TypePrestation> typePrestation, String description, double? surface, ChantierStatut statut, DateTime? dateVisite, DateTime? dateDebut, DateTime? dateFin, String? responsableId, String? notes, List<String> photos, DateTime? deletedAt, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class _$ChantierCopyWithImpl<$Res>
    implements $ChantierCopyWith<$Res> {
  _$ChantierCopyWithImpl(this._self, this._then);

  final Chantier _self;
  final $Res Function(Chantier) _then;

/// Create a copy of Chantier
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? clientId = null,Object? adresse = null,Object? codePostal = null,Object? ville = null,Object? latitude = freezed,Object? longitude = freezed,Object? typePrestation = null,Object? description = null,Object? surface = freezed,Object? statut = null,Object? dateVisite = freezed,Object? dateDebut = freezed,Object? dateFin = freezed,Object? responsableId = freezed,Object? notes = freezed,Object? photos = null,Object? deletedAt = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,clientId: null == clientId ? _self.clientId : clientId // ignore: cast_nullable_to_non_nullable
as String,adresse: null == adresse ? _self.adresse : adresse // ignore: cast_nullable_to_non_nullable
as String,codePostal: null == codePostal ? _self.codePostal : codePostal // ignore: cast_nullable_to_non_nullable
as String,ville: null == ville ? _self.ville : ville // ignore: cast_nullable_to_non_nullable
as String,latitude: freezed == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double?,longitude: freezed == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double?,typePrestation: null == typePrestation ? _self.typePrestation : typePrestation // ignore: cast_nullable_to_non_nullable
as List<TypePrestation>,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,surface: freezed == surface ? _self.surface : surface // ignore: cast_nullable_to_non_nullable
as double?,statut: null == statut ? _self.statut : statut // ignore: cast_nullable_to_non_nullable
as ChantierStatut,dateVisite: freezed == dateVisite ? _self.dateVisite : dateVisite // ignore: cast_nullable_to_non_nullable
as DateTime?,dateDebut: freezed == dateDebut ? _self.dateDebut : dateDebut // ignore: cast_nullable_to_non_nullable
as DateTime?,dateFin: freezed == dateFin ? _self.dateFin : dateFin // ignore: cast_nullable_to_non_nullable
as DateTime?,responsableId: freezed == responsableId ? _self.responsableId : responsableId // ignore: cast_nullable_to_non_nullable
as String?,notes: freezed == notes ? _self.notes : notes // ignore: cast_nullable_to_non_nullable
as String?,photos: null == photos ? _self.photos : photos // ignore: cast_nullable_to_non_nullable
as List<String>,deletedAt: freezed == deletedAt ? _self.deletedAt : deletedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [Chantier].
extension ChantierPatterns on Chantier {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Chantier value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _Chantier() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Chantier value)  $default,){
final _that = this;
switch (_that) {
case _Chantier():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Chantier value)?  $default,){
final _that = this;
switch (_that) {
case _Chantier() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String clientId,  String adresse,  String codePostal,  String ville,  double? latitude,  double? longitude,  List<TypePrestation> typePrestation,  String description,  double? surface,  ChantierStatut statut,  DateTime? dateVisite,  DateTime? dateDebut,  DateTime? dateFin,  String? responsableId,  String? notes,  List<String> photos,  DateTime? deletedAt,  DateTime createdAt,  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Chantier() when $default != null:
return $default(_that.id,_that.clientId,_that.adresse,_that.codePostal,_that.ville,_that.latitude,_that.longitude,_that.typePrestation,_that.description,_that.surface,_that.statut,_that.dateVisite,_that.dateDebut,_that.dateFin,_that.responsableId,_that.notes,_that.photos,_that.deletedAt,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String clientId,  String adresse,  String codePostal,  String ville,  double? latitude,  double? longitude,  List<TypePrestation> typePrestation,  String description,  double? surface,  ChantierStatut statut,  DateTime? dateVisite,  DateTime? dateDebut,  DateTime? dateFin,  String? responsableId,  String? notes,  List<String> photos,  DateTime? deletedAt,  DateTime createdAt,  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _Chantier():
return $default(_that.id,_that.clientId,_that.adresse,_that.codePostal,_that.ville,_that.latitude,_that.longitude,_that.typePrestation,_that.description,_that.surface,_that.statut,_that.dateVisite,_that.dateDebut,_that.dateFin,_that.responsableId,_that.notes,_that.photos,_that.deletedAt,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String clientId,  String adresse,  String codePostal,  String ville,  double? latitude,  double? longitude,  List<TypePrestation> typePrestation,  String description,  double? surface,  ChantierStatut statut,  DateTime? dateVisite,  DateTime? dateDebut,  DateTime? dateFin,  String? responsableId,  String? notes,  List<String> photos,  DateTime? deletedAt,  DateTime createdAt,  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _Chantier() when $default != null:
return $default(_that.id,_that.clientId,_that.adresse,_that.codePostal,_that.ville,_that.latitude,_that.longitude,_that.typePrestation,_that.description,_that.surface,_that.statut,_that.dateVisite,_that.dateDebut,_that.dateFin,_that.responsableId,_that.notes,_that.photos,_that.deletedAt,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _Chantier implements Chantier {
  const _Chantier({required this.id, required this.clientId, required this.adresse, required this.codePostal, required this.ville, this.latitude, this.longitude, final  List<TypePrestation> typePrestation = const [], required this.description, this.surface, this.statut = ChantierStatut.lead, this.dateVisite, this.dateDebut, this.dateFin, this.responsableId, this.notes, final  List<String> photos = const [], this.deletedAt, required this.createdAt, required this.updatedAt}): _typePrestation = typePrestation,_photos = photos;
  factory _Chantier.fromJson(Map<String, dynamic> json) => _$ChantierFromJson(json);

@override final  String id;
@override final  String clientId;
@override final  String adresse;
@override final  String codePostal;
@override final  String ville;
@override final  double? latitude;
@override final  double? longitude;
 final  List<TypePrestation> _typePrestation;
@override@JsonKey() List<TypePrestation> get typePrestation {
  if (_typePrestation is EqualUnmodifiableListView) return _typePrestation;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_typePrestation);
}

@override final  String description;
@override final  double? surface;
@override@JsonKey() final  ChantierStatut statut;
@override final  DateTime? dateVisite;
@override final  DateTime? dateDebut;
@override final  DateTime? dateFin;
@override final  String? responsableId;
@override final  String? notes;
 final  List<String> _photos;
@override@JsonKey() List<String> get photos {
  if (_photos is EqualUnmodifiableListView) return _photos;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_photos);
}

@override final  DateTime? deletedAt;
@override final  DateTime createdAt;
@override final  DateTime updatedAt;

/// Create a copy of Chantier
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ChantierCopyWith<_Chantier> get copyWith => __$ChantierCopyWithImpl<_Chantier>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ChantierToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _Chantier&&(identical(other.id, id) || other.id == id)&&(identical(other.clientId, clientId) || other.clientId == clientId)&&(identical(other.adresse, adresse) || other.adresse == adresse)&&(identical(other.codePostal, codePostal) || other.codePostal == codePostal)&&(identical(other.ville, ville) || other.ville == ville)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&const DeepCollectionEquality().equals(other._typePrestation, _typePrestation)&&(identical(other.description, description) || other.description == description)&&(identical(other.surface, surface) || other.surface == surface)&&(identical(other.statut, statut) || other.statut == statut)&&(identical(other.dateVisite, dateVisite) || other.dateVisite == dateVisite)&&(identical(other.dateDebut, dateDebut) || other.dateDebut == dateDebut)&&(identical(other.dateFin, dateFin) || other.dateFin == dateFin)&&(identical(other.responsableId, responsableId) || other.responsableId == responsableId)&&(identical(other.notes, notes) || other.notes == notes)&&const DeepCollectionEquality().equals(other._photos, _photos)&&(identical(other.deletedAt, deletedAt) || other.deletedAt == deletedAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,clientId,adresse,codePostal,ville,latitude,longitude,const DeepCollectionEquality().hash(_typePrestation),description,surface,statut,dateVisite,dateDebut,dateFin,responsableId,notes,const DeepCollectionEquality().hash(_photos),deletedAt,createdAt,updatedAt]);

@override
String toString() {
  return 'Chantier(id: $id, clientId: $clientId, adresse: $adresse, codePostal: $codePostal, ville: $ville, latitude: $latitude, longitude: $longitude, typePrestation: $typePrestation, description: $description, surface: $surface, statut: $statut, dateVisite: $dateVisite, dateDebut: $dateDebut, dateFin: $dateFin, responsableId: $responsableId, notes: $notes, photos: $photos, deletedAt: $deletedAt, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$ChantierCopyWith<$Res> implements $ChantierCopyWith<$Res> {
  factory _$ChantierCopyWith(_Chantier value, $Res Function(_Chantier) _then) = __$ChantierCopyWithImpl;
@override @useResult
$Res call({
 String id, String clientId, String adresse, String codePostal, String ville, double? latitude, double? longitude, List<TypePrestation> typePrestation, String description, double? surface, ChantierStatut statut, DateTime? dateVisite, DateTime? dateDebut, DateTime? dateFin, String? responsableId, String? notes, List<String> photos, DateTime? deletedAt, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class __$ChantierCopyWithImpl<$Res>
    implements _$ChantierCopyWith<$Res> {
  __$ChantierCopyWithImpl(this._self, this._then);

  final _Chantier _self;
  final $Res Function(_Chantier) _then;

/// Create a copy of Chantier
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? clientId = null,Object? adresse = null,Object? codePostal = null,Object? ville = null,Object? latitude = freezed,Object? longitude = freezed,Object? typePrestation = null,Object? description = null,Object? surface = freezed,Object? statut = null,Object? dateVisite = freezed,Object? dateDebut = freezed,Object? dateFin = freezed,Object? responsableId = freezed,Object? notes = freezed,Object? photos = null,Object? deletedAt = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_Chantier(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,clientId: null == clientId ? _self.clientId : clientId // ignore: cast_nullable_to_non_nullable
as String,adresse: null == adresse ? _self.adresse : adresse // ignore: cast_nullable_to_non_nullable
as String,codePostal: null == codePostal ? _self.codePostal : codePostal // ignore: cast_nullable_to_non_nullable
as String,ville: null == ville ? _self.ville : ville // ignore: cast_nullable_to_non_nullable
as String,latitude: freezed == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double?,longitude: freezed == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double?,typePrestation: null == typePrestation ? _self._typePrestation : typePrestation // ignore: cast_nullable_to_non_nullable
as List<TypePrestation>,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,surface: freezed == surface ? _self.surface : surface // ignore: cast_nullable_to_non_nullable
as double?,statut: null == statut ? _self.statut : statut // ignore: cast_nullable_to_non_nullable
as ChantierStatut,dateVisite: freezed == dateVisite ? _self.dateVisite : dateVisite // ignore: cast_nullable_to_non_nullable
as DateTime?,dateDebut: freezed == dateDebut ? _self.dateDebut : dateDebut // ignore: cast_nullable_to_non_nullable
as DateTime?,dateFin: freezed == dateFin ? _self.dateFin : dateFin // ignore: cast_nullable_to_non_nullable
as DateTime?,responsableId: freezed == responsableId ? _self.responsableId : responsableId // ignore: cast_nullable_to_non_nullable
as String?,notes: freezed == notes ? _self.notes : notes // ignore: cast_nullable_to_non_nullable
as String?,photos: null == photos ? _self._photos : photos // ignore: cast_nullable_to_non_nullable
as List<String>,deletedAt: freezed == deletedAt ? _self.deletedAt : deletedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}

// dart format on
