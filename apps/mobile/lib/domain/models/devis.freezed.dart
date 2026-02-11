// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'devis.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$Devis {

 String get id; String get chantierId; String get numero; DateTime get dateEmission; DateTime get dateValidite; double get totalHT; double get totalTVA; double get totalTTC; DevisStatut get statut; DateTime? get dateAcceptation; String? get signatureClient; String? get pdfUrl; String? get conditionsParticulieres; String? get notes; DateTime? get deletedAt; DateTime get createdAt; DateTime get updatedAt;
/// Create a copy of Devis
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DevisCopyWith<Devis> get copyWith => _$DevisCopyWithImpl<Devis>(this as Devis, _$identity);

  /// Serializes this Devis to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Devis&&(identical(other.id, id) || other.id == id)&&(identical(other.chantierId, chantierId) || other.chantierId == chantierId)&&(identical(other.numero, numero) || other.numero == numero)&&(identical(other.dateEmission, dateEmission) || other.dateEmission == dateEmission)&&(identical(other.dateValidite, dateValidite) || other.dateValidite == dateValidite)&&(identical(other.totalHT, totalHT) || other.totalHT == totalHT)&&(identical(other.totalTVA, totalTVA) || other.totalTVA == totalTVA)&&(identical(other.totalTTC, totalTTC) || other.totalTTC == totalTTC)&&(identical(other.statut, statut) || other.statut == statut)&&(identical(other.dateAcceptation, dateAcceptation) || other.dateAcceptation == dateAcceptation)&&(identical(other.signatureClient, signatureClient) || other.signatureClient == signatureClient)&&(identical(other.pdfUrl, pdfUrl) || other.pdfUrl == pdfUrl)&&(identical(other.conditionsParticulieres, conditionsParticulieres) || other.conditionsParticulieres == conditionsParticulieres)&&(identical(other.notes, notes) || other.notes == notes)&&(identical(other.deletedAt, deletedAt) || other.deletedAt == deletedAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,chantierId,numero,dateEmission,dateValidite,totalHT,totalTVA,totalTTC,statut,dateAcceptation,signatureClient,pdfUrl,conditionsParticulieres,notes,deletedAt,createdAt,updatedAt);

@override
String toString() {
  return 'Devis(id: $id, chantierId: $chantierId, numero: $numero, dateEmission: $dateEmission, dateValidite: $dateValidite, totalHT: $totalHT, totalTVA: $totalTVA, totalTTC: $totalTTC, statut: $statut, dateAcceptation: $dateAcceptation, signatureClient: $signatureClient, pdfUrl: $pdfUrl, conditionsParticulieres: $conditionsParticulieres, notes: $notes, deletedAt: $deletedAt, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $DevisCopyWith<$Res>  {
  factory $DevisCopyWith(Devis value, $Res Function(Devis) _then) = _$DevisCopyWithImpl;
@useResult
$Res call({
 String id, String chantierId, String numero, DateTime dateEmission, DateTime dateValidite, double totalHT, double totalTVA, double totalTTC, DevisStatut statut, DateTime? dateAcceptation, String? signatureClient, String? pdfUrl, String? conditionsParticulieres, String? notes, DateTime? deletedAt, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class _$DevisCopyWithImpl<$Res>
    implements $DevisCopyWith<$Res> {
  _$DevisCopyWithImpl(this._self, this._then);

  final Devis _self;
  final $Res Function(Devis) _then;

/// Create a copy of Devis
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? chantierId = null,Object? numero = null,Object? dateEmission = null,Object? dateValidite = null,Object? totalHT = null,Object? totalTVA = null,Object? totalTTC = null,Object? statut = null,Object? dateAcceptation = freezed,Object? signatureClient = freezed,Object? pdfUrl = freezed,Object? conditionsParticulieres = freezed,Object? notes = freezed,Object? deletedAt = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,chantierId: null == chantierId ? _self.chantierId : chantierId // ignore: cast_nullable_to_non_nullable
as String,numero: null == numero ? _self.numero : numero // ignore: cast_nullable_to_non_nullable
as String,dateEmission: null == dateEmission ? _self.dateEmission : dateEmission // ignore: cast_nullable_to_non_nullable
as DateTime,dateValidite: null == dateValidite ? _self.dateValidite : dateValidite // ignore: cast_nullable_to_non_nullable
as DateTime,totalHT: null == totalHT ? _self.totalHT : totalHT // ignore: cast_nullable_to_non_nullable
as double,totalTVA: null == totalTVA ? _self.totalTVA : totalTVA // ignore: cast_nullable_to_non_nullable
as double,totalTTC: null == totalTTC ? _self.totalTTC : totalTTC // ignore: cast_nullable_to_non_nullable
as double,statut: null == statut ? _self.statut : statut // ignore: cast_nullable_to_non_nullable
as DevisStatut,dateAcceptation: freezed == dateAcceptation ? _self.dateAcceptation : dateAcceptation // ignore: cast_nullable_to_non_nullable
as DateTime?,signatureClient: freezed == signatureClient ? _self.signatureClient : signatureClient // ignore: cast_nullable_to_non_nullable
as String?,pdfUrl: freezed == pdfUrl ? _self.pdfUrl : pdfUrl // ignore: cast_nullable_to_non_nullable
as String?,conditionsParticulieres: freezed == conditionsParticulieres ? _self.conditionsParticulieres : conditionsParticulieres // ignore: cast_nullable_to_non_nullable
as String?,notes: freezed == notes ? _self.notes : notes // ignore: cast_nullable_to_non_nullable
as String?,deletedAt: freezed == deletedAt ? _self.deletedAt : deletedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [Devis].
extension DevisPatterns on Devis {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Devis value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _Devis() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Devis value)  $default,){
final _that = this;
switch (_that) {
case _Devis():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Devis value)?  $default,){
final _that = this;
switch (_that) {
case _Devis() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String chantierId,  String numero,  DateTime dateEmission,  DateTime dateValidite,  double totalHT,  double totalTVA,  double totalTTC,  DevisStatut statut,  DateTime? dateAcceptation,  String? signatureClient,  String? pdfUrl,  String? conditionsParticulieres,  String? notes,  DateTime? deletedAt,  DateTime createdAt,  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Devis() when $default != null:
return $default(_that.id,_that.chantierId,_that.numero,_that.dateEmission,_that.dateValidite,_that.totalHT,_that.totalTVA,_that.totalTTC,_that.statut,_that.dateAcceptation,_that.signatureClient,_that.pdfUrl,_that.conditionsParticulieres,_that.notes,_that.deletedAt,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String chantierId,  String numero,  DateTime dateEmission,  DateTime dateValidite,  double totalHT,  double totalTVA,  double totalTTC,  DevisStatut statut,  DateTime? dateAcceptation,  String? signatureClient,  String? pdfUrl,  String? conditionsParticulieres,  String? notes,  DateTime? deletedAt,  DateTime createdAt,  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _Devis():
return $default(_that.id,_that.chantierId,_that.numero,_that.dateEmission,_that.dateValidite,_that.totalHT,_that.totalTVA,_that.totalTTC,_that.statut,_that.dateAcceptation,_that.signatureClient,_that.pdfUrl,_that.conditionsParticulieres,_that.notes,_that.deletedAt,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String chantierId,  String numero,  DateTime dateEmission,  DateTime dateValidite,  double totalHT,  double totalTVA,  double totalTTC,  DevisStatut statut,  DateTime? dateAcceptation,  String? signatureClient,  String? pdfUrl,  String? conditionsParticulieres,  String? notes,  DateTime? deletedAt,  DateTime createdAt,  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _Devis() when $default != null:
return $default(_that.id,_that.chantierId,_that.numero,_that.dateEmission,_that.dateValidite,_that.totalHT,_that.totalTVA,_that.totalTTC,_that.statut,_that.dateAcceptation,_that.signatureClient,_that.pdfUrl,_that.conditionsParticulieres,_that.notes,_that.deletedAt,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _Devis implements Devis {
  const _Devis({required this.id, required this.chantierId, required this.numero, required this.dateEmission, required this.dateValidite, required this.totalHT, required this.totalTVA, required this.totalTTC, this.statut = DevisStatut.brouillon, this.dateAcceptation, this.signatureClient, this.pdfUrl, this.conditionsParticulieres, this.notes, this.deletedAt, required this.createdAt, required this.updatedAt});
  factory _Devis.fromJson(Map<String, dynamic> json) => _$DevisFromJson(json);

@override final  String id;
@override final  String chantierId;
@override final  String numero;
@override final  DateTime dateEmission;
@override final  DateTime dateValidite;
@override final  double totalHT;
@override final  double totalTVA;
@override final  double totalTTC;
@override@JsonKey() final  DevisStatut statut;
@override final  DateTime? dateAcceptation;
@override final  String? signatureClient;
@override final  String? pdfUrl;
@override final  String? conditionsParticulieres;
@override final  String? notes;
@override final  DateTime? deletedAt;
@override final  DateTime createdAt;
@override final  DateTime updatedAt;

/// Create a copy of Devis
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DevisCopyWith<_Devis> get copyWith => __$DevisCopyWithImpl<_Devis>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DevisToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _Devis&&(identical(other.id, id) || other.id == id)&&(identical(other.chantierId, chantierId) || other.chantierId == chantierId)&&(identical(other.numero, numero) || other.numero == numero)&&(identical(other.dateEmission, dateEmission) || other.dateEmission == dateEmission)&&(identical(other.dateValidite, dateValidite) || other.dateValidite == dateValidite)&&(identical(other.totalHT, totalHT) || other.totalHT == totalHT)&&(identical(other.totalTVA, totalTVA) || other.totalTVA == totalTVA)&&(identical(other.totalTTC, totalTTC) || other.totalTTC == totalTTC)&&(identical(other.statut, statut) || other.statut == statut)&&(identical(other.dateAcceptation, dateAcceptation) || other.dateAcceptation == dateAcceptation)&&(identical(other.signatureClient, signatureClient) || other.signatureClient == signatureClient)&&(identical(other.pdfUrl, pdfUrl) || other.pdfUrl == pdfUrl)&&(identical(other.conditionsParticulieres, conditionsParticulieres) || other.conditionsParticulieres == conditionsParticulieres)&&(identical(other.notes, notes) || other.notes == notes)&&(identical(other.deletedAt, deletedAt) || other.deletedAt == deletedAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,chantierId,numero,dateEmission,dateValidite,totalHT,totalTVA,totalTTC,statut,dateAcceptation,signatureClient,pdfUrl,conditionsParticulieres,notes,deletedAt,createdAt,updatedAt);

@override
String toString() {
  return 'Devis(id: $id, chantierId: $chantierId, numero: $numero, dateEmission: $dateEmission, dateValidite: $dateValidite, totalHT: $totalHT, totalTVA: $totalTVA, totalTTC: $totalTTC, statut: $statut, dateAcceptation: $dateAcceptation, signatureClient: $signatureClient, pdfUrl: $pdfUrl, conditionsParticulieres: $conditionsParticulieres, notes: $notes, deletedAt: $deletedAt, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$DevisCopyWith<$Res> implements $DevisCopyWith<$Res> {
  factory _$DevisCopyWith(_Devis value, $Res Function(_Devis) _then) = __$DevisCopyWithImpl;
@override @useResult
$Res call({
 String id, String chantierId, String numero, DateTime dateEmission, DateTime dateValidite, double totalHT, double totalTVA, double totalTTC, DevisStatut statut, DateTime? dateAcceptation, String? signatureClient, String? pdfUrl, String? conditionsParticulieres, String? notes, DateTime? deletedAt, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class __$DevisCopyWithImpl<$Res>
    implements _$DevisCopyWith<$Res> {
  __$DevisCopyWithImpl(this._self, this._then);

  final _Devis _self;
  final $Res Function(_Devis) _then;

/// Create a copy of Devis
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? chantierId = null,Object? numero = null,Object? dateEmission = null,Object? dateValidite = null,Object? totalHT = null,Object? totalTVA = null,Object? totalTTC = null,Object? statut = null,Object? dateAcceptation = freezed,Object? signatureClient = freezed,Object? pdfUrl = freezed,Object? conditionsParticulieres = freezed,Object? notes = freezed,Object? deletedAt = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_Devis(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,chantierId: null == chantierId ? _self.chantierId : chantierId // ignore: cast_nullable_to_non_nullable
as String,numero: null == numero ? _self.numero : numero // ignore: cast_nullable_to_non_nullable
as String,dateEmission: null == dateEmission ? _self.dateEmission : dateEmission // ignore: cast_nullable_to_non_nullable
as DateTime,dateValidite: null == dateValidite ? _self.dateValidite : dateValidite // ignore: cast_nullable_to_non_nullable
as DateTime,totalHT: null == totalHT ? _self.totalHT : totalHT // ignore: cast_nullable_to_non_nullable
as double,totalTVA: null == totalTVA ? _self.totalTVA : totalTVA // ignore: cast_nullable_to_non_nullable
as double,totalTTC: null == totalTTC ? _self.totalTTC : totalTTC // ignore: cast_nullable_to_non_nullable
as double,statut: null == statut ? _self.statut : statut // ignore: cast_nullable_to_non_nullable
as DevisStatut,dateAcceptation: freezed == dateAcceptation ? _self.dateAcceptation : dateAcceptation // ignore: cast_nullable_to_non_nullable
as DateTime?,signatureClient: freezed == signatureClient ? _self.signatureClient : signatureClient // ignore: cast_nullable_to_non_nullable
as String?,pdfUrl: freezed == pdfUrl ? _self.pdfUrl : pdfUrl // ignore: cast_nullable_to_non_nullable
as String?,conditionsParticulieres: freezed == conditionsParticulieres ? _self.conditionsParticulieres : conditionsParticulieres // ignore: cast_nullable_to_non_nullable
as String?,notes: freezed == notes ? _self.notes : notes // ignore: cast_nullable_to_non_nullable
as String?,deletedAt: freezed == deletedAt ? _self.deletedAt : deletedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}

// dart format on
