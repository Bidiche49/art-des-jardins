// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'facture.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$Facture {

 String get id; String get devisId; String get numero; DateTime get dateEmission; DateTime get dateEcheance; DateTime? get datePaiement; double get totalHT; double get totalTVA; double get totalTTC; FactureStatut get statut; ModePaiement? get modePaiement; String? get referencePaiement; String? get pdfUrl; String? get mentionsLegales; String? get notes; DateTime? get deletedAt; DateTime get createdAt; DateTime get updatedAt;
/// Create a copy of Facture
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$FactureCopyWith<Facture> get copyWith => _$FactureCopyWithImpl<Facture>(this as Facture, _$identity);

  /// Serializes this Facture to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Facture&&(identical(other.id, id) || other.id == id)&&(identical(other.devisId, devisId) || other.devisId == devisId)&&(identical(other.numero, numero) || other.numero == numero)&&(identical(other.dateEmission, dateEmission) || other.dateEmission == dateEmission)&&(identical(other.dateEcheance, dateEcheance) || other.dateEcheance == dateEcheance)&&(identical(other.datePaiement, datePaiement) || other.datePaiement == datePaiement)&&(identical(other.totalHT, totalHT) || other.totalHT == totalHT)&&(identical(other.totalTVA, totalTVA) || other.totalTVA == totalTVA)&&(identical(other.totalTTC, totalTTC) || other.totalTTC == totalTTC)&&(identical(other.statut, statut) || other.statut == statut)&&(identical(other.modePaiement, modePaiement) || other.modePaiement == modePaiement)&&(identical(other.referencePaiement, referencePaiement) || other.referencePaiement == referencePaiement)&&(identical(other.pdfUrl, pdfUrl) || other.pdfUrl == pdfUrl)&&(identical(other.mentionsLegales, mentionsLegales) || other.mentionsLegales == mentionsLegales)&&(identical(other.notes, notes) || other.notes == notes)&&(identical(other.deletedAt, deletedAt) || other.deletedAt == deletedAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,devisId,numero,dateEmission,dateEcheance,datePaiement,totalHT,totalTVA,totalTTC,statut,modePaiement,referencePaiement,pdfUrl,mentionsLegales,notes,deletedAt,createdAt,updatedAt);

@override
String toString() {
  return 'Facture(id: $id, devisId: $devisId, numero: $numero, dateEmission: $dateEmission, dateEcheance: $dateEcheance, datePaiement: $datePaiement, totalHT: $totalHT, totalTVA: $totalTVA, totalTTC: $totalTTC, statut: $statut, modePaiement: $modePaiement, referencePaiement: $referencePaiement, pdfUrl: $pdfUrl, mentionsLegales: $mentionsLegales, notes: $notes, deletedAt: $deletedAt, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $FactureCopyWith<$Res>  {
  factory $FactureCopyWith(Facture value, $Res Function(Facture) _then) = _$FactureCopyWithImpl;
@useResult
$Res call({
 String id, String devisId, String numero, DateTime dateEmission, DateTime dateEcheance, DateTime? datePaiement, double totalHT, double totalTVA, double totalTTC, FactureStatut statut, ModePaiement? modePaiement, String? referencePaiement, String? pdfUrl, String? mentionsLegales, String? notes, DateTime? deletedAt, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class _$FactureCopyWithImpl<$Res>
    implements $FactureCopyWith<$Res> {
  _$FactureCopyWithImpl(this._self, this._then);

  final Facture _self;
  final $Res Function(Facture) _then;

/// Create a copy of Facture
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? devisId = null,Object? numero = null,Object? dateEmission = null,Object? dateEcheance = null,Object? datePaiement = freezed,Object? totalHT = null,Object? totalTVA = null,Object? totalTTC = null,Object? statut = null,Object? modePaiement = freezed,Object? referencePaiement = freezed,Object? pdfUrl = freezed,Object? mentionsLegales = freezed,Object? notes = freezed,Object? deletedAt = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,devisId: null == devisId ? _self.devisId : devisId // ignore: cast_nullable_to_non_nullable
as String,numero: null == numero ? _self.numero : numero // ignore: cast_nullable_to_non_nullable
as String,dateEmission: null == dateEmission ? _self.dateEmission : dateEmission // ignore: cast_nullable_to_non_nullable
as DateTime,dateEcheance: null == dateEcheance ? _self.dateEcheance : dateEcheance // ignore: cast_nullable_to_non_nullable
as DateTime,datePaiement: freezed == datePaiement ? _self.datePaiement : datePaiement // ignore: cast_nullable_to_non_nullable
as DateTime?,totalHT: null == totalHT ? _self.totalHT : totalHT // ignore: cast_nullable_to_non_nullable
as double,totalTVA: null == totalTVA ? _self.totalTVA : totalTVA // ignore: cast_nullable_to_non_nullable
as double,totalTTC: null == totalTTC ? _self.totalTTC : totalTTC // ignore: cast_nullable_to_non_nullable
as double,statut: null == statut ? _self.statut : statut // ignore: cast_nullable_to_non_nullable
as FactureStatut,modePaiement: freezed == modePaiement ? _self.modePaiement : modePaiement // ignore: cast_nullable_to_non_nullable
as ModePaiement?,referencePaiement: freezed == referencePaiement ? _self.referencePaiement : referencePaiement // ignore: cast_nullable_to_non_nullable
as String?,pdfUrl: freezed == pdfUrl ? _self.pdfUrl : pdfUrl // ignore: cast_nullable_to_non_nullable
as String?,mentionsLegales: freezed == mentionsLegales ? _self.mentionsLegales : mentionsLegales // ignore: cast_nullable_to_non_nullable
as String?,notes: freezed == notes ? _self.notes : notes // ignore: cast_nullable_to_non_nullable
as String?,deletedAt: freezed == deletedAt ? _self.deletedAt : deletedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [Facture].
extension FacturePatterns on Facture {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Facture value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _Facture() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Facture value)  $default,){
final _that = this;
switch (_that) {
case _Facture():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Facture value)?  $default,){
final _that = this;
switch (_that) {
case _Facture() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String devisId,  String numero,  DateTime dateEmission,  DateTime dateEcheance,  DateTime? datePaiement,  double totalHT,  double totalTVA,  double totalTTC,  FactureStatut statut,  ModePaiement? modePaiement,  String? referencePaiement,  String? pdfUrl,  String? mentionsLegales,  String? notes,  DateTime? deletedAt,  DateTime createdAt,  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Facture() when $default != null:
return $default(_that.id,_that.devisId,_that.numero,_that.dateEmission,_that.dateEcheance,_that.datePaiement,_that.totalHT,_that.totalTVA,_that.totalTTC,_that.statut,_that.modePaiement,_that.referencePaiement,_that.pdfUrl,_that.mentionsLegales,_that.notes,_that.deletedAt,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String devisId,  String numero,  DateTime dateEmission,  DateTime dateEcheance,  DateTime? datePaiement,  double totalHT,  double totalTVA,  double totalTTC,  FactureStatut statut,  ModePaiement? modePaiement,  String? referencePaiement,  String? pdfUrl,  String? mentionsLegales,  String? notes,  DateTime? deletedAt,  DateTime createdAt,  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _Facture():
return $default(_that.id,_that.devisId,_that.numero,_that.dateEmission,_that.dateEcheance,_that.datePaiement,_that.totalHT,_that.totalTVA,_that.totalTTC,_that.statut,_that.modePaiement,_that.referencePaiement,_that.pdfUrl,_that.mentionsLegales,_that.notes,_that.deletedAt,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String devisId,  String numero,  DateTime dateEmission,  DateTime dateEcheance,  DateTime? datePaiement,  double totalHT,  double totalTVA,  double totalTTC,  FactureStatut statut,  ModePaiement? modePaiement,  String? referencePaiement,  String? pdfUrl,  String? mentionsLegales,  String? notes,  DateTime? deletedAt,  DateTime createdAt,  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _Facture() when $default != null:
return $default(_that.id,_that.devisId,_that.numero,_that.dateEmission,_that.dateEcheance,_that.datePaiement,_that.totalHT,_that.totalTVA,_that.totalTTC,_that.statut,_that.modePaiement,_that.referencePaiement,_that.pdfUrl,_that.mentionsLegales,_that.notes,_that.deletedAt,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _Facture implements Facture {
  const _Facture({required this.id, required this.devisId, required this.numero, required this.dateEmission, required this.dateEcheance, this.datePaiement, required this.totalHT, required this.totalTVA, required this.totalTTC, this.statut = FactureStatut.brouillon, this.modePaiement, this.referencePaiement, this.pdfUrl, this.mentionsLegales, this.notes, this.deletedAt, required this.createdAt, required this.updatedAt});
  factory _Facture.fromJson(Map<String, dynamic> json) => _$FactureFromJson(json);

@override final  String id;
@override final  String devisId;
@override final  String numero;
@override final  DateTime dateEmission;
@override final  DateTime dateEcheance;
@override final  DateTime? datePaiement;
@override final  double totalHT;
@override final  double totalTVA;
@override final  double totalTTC;
@override@JsonKey() final  FactureStatut statut;
@override final  ModePaiement? modePaiement;
@override final  String? referencePaiement;
@override final  String? pdfUrl;
@override final  String? mentionsLegales;
@override final  String? notes;
@override final  DateTime? deletedAt;
@override final  DateTime createdAt;
@override final  DateTime updatedAt;

/// Create a copy of Facture
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$FactureCopyWith<_Facture> get copyWith => __$FactureCopyWithImpl<_Facture>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$FactureToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _Facture&&(identical(other.id, id) || other.id == id)&&(identical(other.devisId, devisId) || other.devisId == devisId)&&(identical(other.numero, numero) || other.numero == numero)&&(identical(other.dateEmission, dateEmission) || other.dateEmission == dateEmission)&&(identical(other.dateEcheance, dateEcheance) || other.dateEcheance == dateEcheance)&&(identical(other.datePaiement, datePaiement) || other.datePaiement == datePaiement)&&(identical(other.totalHT, totalHT) || other.totalHT == totalHT)&&(identical(other.totalTVA, totalTVA) || other.totalTVA == totalTVA)&&(identical(other.totalTTC, totalTTC) || other.totalTTC == totalTTC)&&(identical(other.statut, statut) || other.statut == statut)&&(identical(other.modePaiement, modePaiement) || other.modePaiement == modePaiement)&&(identical(other.referencePaiement, referencePaiement) || other.referencePaiement == referencePaiement)&&(identical(other.pdfUrl, pdfUrl) || other.pdfUrl == pdfUrl)&&(identical(other.mentionsLegales, mentionsLegales) || other.mentionsLegales == mentionsLegales)&&(identical(other.notes, notes) || other.notes == notes)&&(identical(other.deletedAt, deletedAt) || other.deletedAt == deletedAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,devisId,numero,dateEmission,dateEcheance,datePaiement,totalHT,totalTVA,totalTTC,statut,modePaiement,referencePaiement,pdfUrl,mentionsLegales,notes,deletedAt,createdAt,updatedAt);

@override
String toString() {
  return 'Facture(id: $id, devisId: $devisId, numero: $numero, dateEmission: $dateEmission, dateEcheance: $dateEcheance, datePaiement: $datePaiement, totalHT: $totalHT, totalTVA: $totalTVA, totalTTC: $totalTTC, statut: $statut, modePaiement: $modePaiement, referencePaiement: $referencePaiement, pdfUrl: $pdfUrl, mentionsLegales: $mentionsLegales, notes: $notes, deletedAt: $deletedAt, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$FactureCopyWith<$Res> implements $FactureCopyWith<$Res> {
  factory _$FactureCopyWith(_Facture value, $Res Function(_Facture) _then) = __$FactureCopyWithImpl;
@override @useResult
$Res call({
 String id, String devisId, String numero, DateTime dateEmission, DateTime dateEcheance, DateTime? datePaiement, double totalHT, double totalTVA, double totalTTC, FactureStatut statut, ModePaiement? modePaiement, String? referencePaiement, String? pdfUrl, String? mentionsLegales, String? notes, DateTime? deletedAt, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class __$FactureCopyWithImpl<$Res>
    implements _$FactureCopyWith<$Res> {
  __$FactureCopyWithImpl(this._self, this._then);

  final _Facture _self;
  final $Res Function(_Facture) _then;

/// Create a copy of Facture
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? devisId = null,Object? numero = null,Object? dateEmission = null,Object? dateEcheance = null,Object? datePaiement = freezed,Object? totalHT = null,Object? totalTVA = null,Object? totalTTC = null,Object? statut = null,Object? modePaiement = freezed,Object? referencePaiement = freezed,Object? pdfUrl = freezed,Object? mentionsLegales = freezed,Object? notes = freezed,Object? deletedAt = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_Facture(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,devisId: null == devisId ? _self.devisId : devisId // ignore: cast_nullable_to_non_nullable
as String,numero: null == numero ? _self.numero : numero // ignore: cast_nullable_to_non_nullable
as String,dateEmission: null == dateEmission ? _self.dateEmission : dateEmission // ignore: cast_nullable_to_non_nullable
as DateTime,dateEcheance: null == dateEcheance ? _self.dateEcheance : dateEcheance // ignore: cast_nullable_to_non_nullable
as DateTime,datePaiement: freezed == datePaiement ? _self.datePaiement : datePaiement // ignore: cast_nullable_to_non_nullable
as DateTime?,totalHT: null == totalHT ? _self.totalHT : totalHT // ignore: cast_nullable_to_non_nullable
as double,totalTVA: null == totalTVA ? _self.totalTVA : totalTVA // ignore: cast_nullable_to_non_nullable
as double,totalTTC: null == totalTTC ? _self.totalTTC : totalTTC // ignore: cast_nullable_to_non_nullable
as double,statut: null == statut ? _self.statut : statut // ignore: cast_nullable_to_non_nullable
as FactureStatut,modePaiement: freezed == modePaiement ? _self.modePaiement : modePaiement // ignore: cast_nullable_to_non_nullable
as ModePaiement?,referencePaiement: freezed == referencePaiement ? _self.referencePaiement : referencePaiement // ignore: cast_nullable_to_non_nullable
as String?,pdfUrl: freezed == pdfUrl ? _self.pdfUrl : pdfUrl // ignore: cast_nullable_to_non_nullable
as String?,mentionsLegales: freezed == mentionsLegales ? _self.mentionsLegales : mentionsLegales // ignore: cast_nullable_to_non_nullable
as String?,notes: freezed == notes ? _self.notes : notes // ignore: cast_nullable_to_non_nullable
as String?,deletedAt: freezed == deletedAt ? _self.deletedAt : deletedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}

// dart format on
