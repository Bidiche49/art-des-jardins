// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'rentabilite_data.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$RentabiliteData {

 String get chantierId; double get totalHeures; double get coutMainOeuvre; double get totalMateriel; double get totalDevis; double get marge; double get margePercent;
/// Create a copy of RentabiliteData
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$RentabiliteDataCopyWith<RentabiliteData> get copyWith => _$RentabiliteDataCopyWithImpl<RentabiliteData>(this as RentabiliteData, _$identity);

  /// Serializes this RentabiliteData to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is RentabiliteData&&(identical(other.chantierId, chantierId) || other.chantierId == chantierId)&&(identical(other.totalHeures, totalHeures) || other.totalHeures == totalHeures)&&(identical(other.coutMainOeuvre, coutMainOeuvre) || other.coutMainOeuvre == coutMainOeuvre)&&(identical(other.totalMateriel, totalMateriel) || other.totalMateriel == totalMateriel)&&(identical(other.totalDevis, totalDevis) || other.totalDevis == totalDevis)&&(identical(other.marge, marge) || other.marge == marge)&&(identical(other.margePercent, margePercent) || other.margePercent == margePercent));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,chantierId,totalHeures,coutMainOeuvre,totalMateriel,totalDevis,marge,margePercent);

@override
String toString() {
  return 'RentabiliteData(chantierId: $chantierId, totalHeures: $totalHeures, coutMainOeuvre: $coutMainOeuvre, totalMateriel: $totalMateriel, totalDevis: $totalDevis, marge: $marge, margePercent: $margePercent)';
}


}

/// @nodoc
abstract mixin class $RentabiliteDataCopyWith<$Res>  {
  factory $RentabiliteDataCopyWith(RentabiliteData value, $Res Function(RentabiliteData) _then) = _$RentabiliteDataCopyWithImpl;
@useResult
$Res call({
 String chantierId, double totalHeures, double coutMainOeuvre, double totalMateriel, double totalDevis, double marge, double margePercent
});




}
/// @nodoc
class _$RentabiliteDataCopyWithImpl<$Res>
    implements $RentabiliteDataCopyWith<$Res> {
  _$RentabiliteDataCopyWithImpl(this._self, this._then);

  final RentabiliteData _self;
  final $Res Function(RentabiliteData) _then;

/// Create a copy of RentabiliteData
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? chantierId = null,Object? totalHeures = null,Object? coutMainOeuvre = null,Object? totalMateriel = null,Object? totalDevis = null,Object? marge = null,Object? margePercent = null,}) {
  return _then(_self.copyWith(
chantierId: null == chantierId ? _self.chantierId : chantierId // ignore: cast_nullable_to_non_nullable
as String,totalHeures: null == totalHeures ? _self.totalHeures : totalHeures // ignore: cast_nullable_to_non_nullable
as double,coutMainOeuvre: null == coutMainOeuvre ? _self.coutMainOeuvre : coutMainOeuvre // ignore: cast_nullable_to_non_nullable
as double,totalMateriel: null == totalMateriel ? _self.totalMateriel : totalMateriel // ignore: cast_nullable_to_non_nullable
as double,totalDevis: null == totalDevis ? _self.totalDevis : totalDevis // ignore: cast_nullable_to_non_nullable
as double,marge: null == marge ? _self.marge : marge // ignore: cast_nullable_to_non_nullable
as double,margePercent: null == margePercent ? _self.margePercent : margePercent // ignore: cast_nullable_to_non_nullable
as double,
  ));
}

}


/// Adds pattern-matching-related methods to [RentabiliteData].
extension RentabiliteDataPatterns on RentabiliteData {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _RentabiliteData value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _RentabiliteData() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _RentabiliteData value)  $default,){
final _that = this;
switch (_that) {
case _RentabiliteData():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _RentabiliteData value)?  $default,){
final _that = this;
switch (_that) {
case _RentabiliteData() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String chantierId,  double totalHeures,  double coutMainOeuvre,  double totalMateriel,  double totalDevis,  double marge,  double margePercent)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _RentabiliteData() when $default != null:
return $default(_that.chantierId,_that.totalHeures,_that.coutMainOeuvre,_that.totalMateriel,_that.totalDevis,_that.marge,_that.margePercent);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String chantierId,  double totalHeures,  double coutMainOeuvre,  double totalMateriel,  double totalDevis,  double marge,  double margePercent)  $default,) {final _that = this;
switch (_that) {
case _RentabiliteData():
return $default(_that.chantierId,_that.totalHeures,_that.coutMainOeuvre,_that.totalMateriel,_that.totalDevis,_that.marge,_that.margePercent);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String chantierId,  double totalHeures,  double coutMainOeuvre,  double totalMateriel,  double totalDevis,  double marge,  double margePercent)?  $default,) {final _that = this;
switch (_that) {
case _RentabiliteData() when $default != null:
return $default(_that.chantierId,_that.totalHeures,_that.coutMainOeuvre,_that.totalMateriel,_that.totalDevis,_that.marge,_that.margePercent);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _RentabiliteData implements RentabiliteData {
  const _RentabiliteData({required this.chantierId, this.totalHeures = 0.0, this.coutMainOeuvre = 0.0, this.totalMateriel = 0.0, this.totalDevis = 0.0, this.marge = 0.0, this.margePercent = 0.0});
  factory _RentabiliteData.fromJson(Map<String, dynamic> json) => _$RentabiliteDataFromJson(json);

@override final  String chantierId;
@override@JsonKey() final  double totalHeures;
@override@JsonKey() final  double coutMainOeuvre;
@override@JsonKey() final  double totalMateriel;
@override@JsonKey() final  double totalDevis;
@override@JsonKey() final  double marge;
@override@JsonKey() final  double margePercent;

/// Create a copy of RentabiliteData
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$RentabiliteDataCopyWith<_RentabiliteData> get copyWith => __$RentabiliteDataCopyWithImpl<_RentabiliteData>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$RentabiliteDataToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _RentabiliteData&&(identical(other.chantierId, chantierId) || other.chantierId == chantierId)&&(identical(other.totalHeures, totalHeures) || other.totalHeures == totalHeures)&&(identical(other.coutMainOeuvre, coutMainOeuvre) || other.coutMainOeuvre == coutMainOeuvre)&&(identical(other.totalMateriel, totalMateriel) || other.totalMateriel == totalMateriel)&&(identical(other.totalDevis, totalDevis) || other.totalDevis == totalDevis)&&(identical(other.marge, marge) || other.marge == marge)&&(identical(other.margePercent, margePercent) || other.margePercent == margePercent));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,chantierId,totalHeures,coutMainOeuvre,totalMateriel,totalDevis,marge,margePercent);

@override
String toString() {
  return 'RentabiliteData(chantierId: $chantierId, totalHeures: $totalHeures, coutMainOeuvre: $coutMainOeuvre, totalMateriel: $totalMateriel, totalDevis: $totalDevis, marge: $marge, margePercent: $margePercent)';
}


}

/// @nodoc
abstract mixin class _$RentabiliteDataCopyWith<$Res> implements $RentabiliteDataCopyWith<$Res> {
  factory _$RentabiliteDataCopyWith(_RentabiliteData value, $Res Function(_RentabiliteData) _then) = __$RentabiliteDataCopyWithImpl;
@override @useResult
$Res call({
 String chantierId, double totalHeures, double coutMainOeuvre, double totalMateriel, double totalDevis, double marge, double margePercent
});




}
/// @nodoc
class __$RentabiliteDataCopyWithImpl<$Res>
    implements _$RentabiliteDataCopyWith<$Res> {
  __$RentabiliteDataCopyWithImpl(this._self, this._then);

  final _RentabiliteData _self;
  final $Res Function(_RentabiliteData) _then;

/// Create a copy of RentabiliteData
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? chantierId = null,Object? totalHeures = null,Object? coutMainOeuvre = null,Object? totalMateriel = null,Object? totalDevis = null,Object? marge = null,Object? margePercent = null,}) {
  return _then(_RentabiliteData(
chantierId: null == chantierId ? _self.chantierId : chantierId // ignore: cast_nullable_to_non_nullable
as String,totalHeures: null == totalHeures ? _self.totalHeures : totalHeures // ignore: cast_nullable_to_non_nullable
as double,coutMainOeuvre: null == coutMainOeuvre ? _self.coutMainOeuvre : coutMainOeuvre // ignore: cast_nullable_to_non_nullable
as double,totalMateriel: null == totalMateriel ? _self.totalMateriel : totalMateriel // ignore: cast_nullable_to_non_nullable
as double,totalDevis: null == totalDevis ? _self.totalDevis : totalDevis // ignore: cast_nullable_to_non_nullable
as double,marge: null == marge ? _self.marge : marge // ignore: cast_nullable_to_non_nullable
as double,margePercent: null == margePercent ? _self.margePercent : margePercent // ignore: cast_nullable_to_non_nullable
as double,
  ));
}


}

// dart format on
