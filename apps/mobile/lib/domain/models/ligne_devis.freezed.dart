// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'ligne_devis.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$LigneDevis {

 String get id; String get devisId; String get description; double get quantite; String get unite; double get prixUnitaireHT; double get tva; double get montantHT; double get montantTTC; int get ordre;
/// Create a copy of LigneDevis
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$LigneDevisCopyWith<LigneDevis> get copyWith => _$LigneDevisCopyWithImpl<LigneDevis>(this as LigneDevis, _$identity);

  /// Serializes this LigneDevis to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is LigneDevis&&(identical(other.id, id) || other.id == id)&&(identical(other.devisId, devisId) || other.devisId == devisId)&&(identical(other.description, description) || other.description == description)&&(identical(other.quantite, quantite) || other.quantite == quantite)&&(identical(other.unite, unite) || other.unite == unite)&&(identical(other.prixUnitaireHT, prixUnitaireHT) || other.prixUnitaireHT == prixUnitaireHT)&&(identical(other.tva, tva) || other.tva == tva)&&(identical(other.montantHT, montantHT) || other.montantHT == montantHT)&&(identical(other.montantTTC, montantTTC) || other.montantTTC == montantTTC)&&(identical(other.ordre, ordre) || other.ordre == ordre));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,devisId,description,quantite,unite,prixUnitaireHT,tva,montantHT,montantTTC,ordre);

@override
String toString() {
  return 'LigneDevis(id: $id, devisId: $devisId, description: $description, quantite: $quantite, unite: $unite, prixUnitaireHT: $prixUnitaireHT, tva: $tva, montantHT: $montantHT, montantTTC: $montantTTC, ordre: $ordre)';
}


}

/// @nodoc
abstract mixin class $LigneDevisCopyWith<$Res>  {
  factory $LigneDevisCopyWith(LigneDevis value, $Res Function(LigneDevis) _then) = _$LigneDevisCopyWithImpl;
@useResult
$Res call({
 String id, String devisId, String description, double quantite, String unite, double prixUnitaireHT, double tva, double montantHT, double montantTTC, int ordre
});




}
/// @nodoc
class _$LigneDevisCopyWithImpl<$Res>
    implements $LigneDevisCopyWith<$Res> {
  _$LigneDevisCopyWithImpl(this._self, this._then);

  final LigneDevis _self;
  final $Res Function(LigneDevis) _then;

/// Create a copy of LigneDevis
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? devisId = null,Object? description = null,Object? quantite = null,Object? unite = null,Object? prixUnitaireHT = null,Object? tva = null,Object? montantHT = null,Object? montantTTC = null,Object? ordre = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,devisId: null == devisId ? _self.devisId : devisId // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,quantite: null == quantite ? _self.quantite : quantite // ignore: cast_nullable_to_non_nullable
as double,unite: null == unite ? _self.unite : unite // ignore: cast_nullable_to_non_nullable
as String,prixUnitaireHT: null == prixUnitaireHT ? _self.prixUnitaireHT : prixUnitaireHT // ignore: cast_nullable_to_non_nullable
as double,tva: null == tva ? _self.tva : tva // ignore: cast_nullable_to_non_nullable
as double,montantHT: null == montantHT ? _self.montantHT : montantHT // ignore: cast_nullable_to_non_nullable
as double,montantTTC: null == montantTTC ? _self.montantTTC : montantTTC // ignore: cast_nullable_to_non_nullable
as double,ordre: null == ordre ? _self.ordre : ordre // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [LigneDevis].
extension LigneDevisPatterns on LigneDevis {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _LigneDevis value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _LigneDevis() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _LigneDevis value)  $default,){
final _that = this;
switch (_that) {
case _LigneDevis():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _LigneDevis value)?  $default,){
final _that = this;
switch (_that) {
case _LigneDevis() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String devisId,  String description,  double quantite,  String unite,  double prixUnitaireHT,  double tva,  double montantHT,  double montantTTC,  int ordre)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _LigneDevis() when $default != null:
return $default(_that.id,_that.devisId,_that.description,_that.quantite,_that.unite,_that.prixUnitaireHT,_that.tva,_that.montantHT,_that.montantTTC,_that.ordre);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String devisId,  String description,  double quantite,  String unite,  double prixUnitaireHT,  double tva,  double montantHT,  double montantTTC,  int ordre)  $default,) {final _that = this;
switch (_that) {
case _LigneDevis():
return $default(_that.id,_that.devisId,_that.description,_that.quantite,_that.unite,_that.prixUnitaireHT,_that.tva,_that.montantHT,_that.montantTTC,_that.ordre);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String devisId,  String description,  double quantite,  String unite,  double prixUnitaireHT,  double tva,  double montantHT,  double montantTTC,  int ordre)?  $default,) {final _that = this;
switch (_that) {
case _LigneDevis() when $default != null:
return $default(_that.id,_that.devisId,_that.description,_that.quantite,_that.unite,_that.prixUnitaireHT,_that.tva,_that.montantHT,_that.montantTTC,_that.ordre);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _LigneDevis implements LigneDevis {
  const _LigneDevis({required this.id, required this.devisId, required this.description, required this.quantite, required this.unite, required this.prixUnitaireHT, this.tva = 20.0, required this.montantHT, required this.montantTTC, this.ordre = 0});
  factory _LigneDevis.fromJson(Map<String, dynamic> json) => _$LigneDevisFromJson(json);

@override final  String id;
@override final  String devisId;
@override final  String description;
@override final  double quantite;
@override final  String unite;
@override final  double prixUnitaireHT;
@override@JsonKey() final  double tva;
@override final  double montantHT;
@override final  double montantTTC;
@override@JsonKey() final  int ordre;

/// Create a copy of LigneDevis
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$LigneDevisCopyWith<_LigneDevis> get copyWith => __$LigneDevisCopyWithImpl<_LigneDevis>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$LigneDevisToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _LigneDevis&&(identical(other.id, id) || other.id == id)&&(identical(other.devisId, devisId) || other.devisId == devisId)&&(identical(other.description, description) || other.description == description)&&(identical(other.quantite, quantite) || other.quantite == quantite)&&(identical(other.unite, unite) || other.unite == unite)&&(identical(other.prixUnitaireHT, prixUnitaireHT) || other.prixUnitaireHT == prixUnitaireHT)&&(identical(other.tva, tva) || other.tva == tva)&&(identical(other.montantHT, montantHT) || other.montantHT == montantHT)&&(identical(other.montantTTC, montantTTC) || other.montantTTC == montantTTC)&&(identical(other.ordre, ordre) || other.ordre == ordre));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,devisId,description,quantite,unite,prixUnitaireHT,tva,montantHT,montantTTC,ordre);

@override
String toString() {
  return 'LigneDevis(id: $id, devisId: $devisId, description: $description, quantite: $quantite, unite: $unite, prixUnitaireHT: $prixUnitaireHT, tva: $tva, montantHT: $montantHT, montantTTC: $montantTTC, ordre: $ordre)';
}


}

/// @nodoc
abstract mixin class _$LigneDevisCopyWith<$Res> implements $LigneDevisCopyWith<$Res> {
  factory _$LigneDevisCopyWith(_LigneDevis value, $Res Function(_LigneDevis) _then) = __$LigneDevisCopyWithImpl;
@override @useResult
$Res call({
 String id, String devisId, String description, double quantite, String unite, double prixUnitaireHT, double tva, double montantHT, double montantTTC, int ordre
});




}
/// @nodoc
class __$LigneDevisCopyWithImpl<$Res>
    implements _$LigneDevisCopyWith<$Res> {
  __$LigneDevisCopyWithImpl(this._self, this._then);

  final _LigneDevis _self;
  final $Res Function(_LigneDevis) _then;

/// Create a copy of LigneDevis
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? devisId = null,Object? description = null,Object? quantite = null,Object? unite = null,Object? prixUnitaireHT = null,Object? tva = null,Object? montantHT = null,Object? montantTTC = null,Object? ordre = null,}) {
  return _then(_LigneDevis(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,devisId: null == devisId ? _self.devisId : devisId // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,quantite: null == quantite ? _self.quantite : quantite // ignore: cast_nullable_to_non_nullable
as double,unite: null == unite ? _self.unite : unite // ignore: cast_nullable_to_non_nullable
as String,prixUnitaireHT: null == prixUnitaireHT ? _self.prixUnitaireHT : prixUnitaireHT // ignore: cast_nullable_to_non_nullable
as double,tva: null == tva ? _self.tva : tva // ignore: cast_nullable_to_non_nullable
as double,montantHT: null == montantHT ? _self.montantHT : montantHT // ignore: cast_nullable_to_non_nullable
as double,montantTTC: null == montantTTC ? _self.montantTTC : montantTTC // ignore: cast_nullable_to_non_nullable
as double,ordre: null == ordre ? _self.ordre : ordre // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
