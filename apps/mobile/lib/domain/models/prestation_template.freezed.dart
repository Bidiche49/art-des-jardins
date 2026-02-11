// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'prestation_template.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$PrestationTemplate {

 String get id; String get name; String? get description; String get category; String get unit; double get unitPriceHT; double get tvaRate; bool get isGlobal; String? get createdBy; DateTime get createdAt; DateTime get updatedAt;
/// Create a copy of PrestationTemplate
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PrestationTemplateCopyWith<PrestationTemplate> get copyWith => _$PrestationTemplateCopyWithImpl<PrestationTemplate>(this as PrestationTemplate, _$identity);

  /// Serializes this PrestationTemplate to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is PrestationTemplate&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.description, description) || other.description == description)&&(identical(other.category, category) || other.category == category)&&(identical(other.unit, unit) || other.unit == unit)&&(identical(other.unitPriceHT, unitPriceHT) || other.unitPriceHT == unitPriceHT)&&(identical(other.tvaRate, tvaRate) || other.tvaRate == tvaRate)&&(identical(other.isGlobal, isGlobal) || other.isGlobal == isGlobal)&&(identical(other.createdBy, createdBy) || other.createdBy == createdBy)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,description,category,unit,unitPriceHT,tvaRate,isGlobal,createdBy,createdAt,updatedAt);

@override
String toString() {
  return 'PrestationTemplate(id: $id, name: $name, description: $description, category: $category, unit: $unit, unitPriceHT: $unitPriceHT, tvaRate: $tvaRate, isGlobal: $isGlobal, createdBy: $createdBy, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $PrestationTemplateCopyWith<$Res>  {
  factory $PrestationTemplateCopyWith(PrestationTemplate value, $Res Function(PrestationTemplate) _then) = _$PrestationTemplateCopyWithImpl;
@useResult
$Res call({
 String id, String name, String? description, String category, String unit, double unitPriceHT, double tvaRate, bool isGlobal, String? createdBy, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class _$PrestationTemplateCopyWithImpl<$Res>
    implements $PrestationTemplateCopyWith<$Res> {
  _$PrestationTemplateCopyWithImpl(this._self, this._then);

  final PrestationTemplate _self;
  final $Res Function(PrestationTemplate) _then;

/// Create a copy of PrestationTemplate
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? description = freezed,Object? category = null,Object? unit = null,Object? unitPriceHT = null,Object? tvaRate = null,Object? isGlobal = null,Object? createdBy = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,category: null == category ? _self.category : category // ignore: cast_nullable_to_non_nullable
as String,unit: null == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String,unitPriceHT: null == unitPriceHT ? _self.unitPriceHT : unitPriceHT // ignore: cast_nullable_to_non_nullable
as double,tvaRate: null == tvaRate ? _self.tvaRate : tvaRate // ignore: cast_nullable_to_non_nullable
as double,isGlobal: null == isGlobal ? _self.isGlobal : isGlobal // ignore: cast_nullable_to_non_nullable
as bool,createdBy: freezed == createdBy ? _self.createdBy : createdBy // ignore: cast_nullable_to_non_nullable
as String?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [PrestationTemplate].
extension PrestationTemplatePatterns on PrestationTemplate {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _PrestationTemplate value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _PrestationTemplate() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _PrestationTemplate value)  $default,){
final _that = this;
switch (_that) {
case _PrestationTemplate():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _PrestationTemplate value)?  $default,){
final _that = this;
switch (_that) {
case _PrestationTemplate() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  String? description,  String category,  String unit,  double unitPriceHT,  double tvaRate,  bool isGlobal,  String? createdBy,  DateTime createdAt,  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _PrestationTemplate() when $default != null:
return $default(_that.id,_that.name,_that.description,_that.category,_that.unit,_that.unitPriceHT,_that.tvaRate,_that.isGlobal,_that.createdBy,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  String? description,  String category,  String unit,  double unitPriceHT,  double tvaRate,  bool isGlobal,  String? createdBy,  DateTime createdAt,  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _PrestationTemplate():
return $default(_that.id,_that.name,_that.description,_that.category,_that.unit,_that.unitPriceHT,_that.tvaRate,_that.isGlobal,_that.createdBy,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  String? description,  String category,  String unit,  double unitPriceHT,  double tvaRate,  bool isGlobal,  String? createdBy,  DateTime createdAt,  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _PrestationTemplate() when $default != null:
return $default(_that.id,_that.name,_that.description,_that.category,_that.unit,_that.unitPriceHT,_that.tvaRate,_that.isGlobal,_that.createdBy,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _PrestationTemplate implements PrestationTemplate {
  const _PrestationTemplate({required this.id, required this.name, this.description, required this.category, required this.unit, required this.unitPriceHT, this.tvaRate = 20.0, this.isGlobal = false, this.createdBy, required this.createdAt, required this.updatedAt});
  factory _PrestationTemplate.fromJson(Map<String, dynamic> json) => _$PrestationTemplateFromJson(json);

@override final  String id;
@override final  String name;
@override final  String? description;
@override final  String category;
@override final  String unit;
@override final  double unitPriceHT;
@override@JsonKey() final  double tvaRate;
@override@JsonKey() final  bool isGlobal;
@override final  String? createdBy;
@override final  DateTime createdAt;
@override final  DateTime updatedAt;

/// Create a copy of PrestationTemplate
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PrestationTemplateCopyWith<_PrestationTemplate> get copyWith => __$PrestationTemplateCopyWithImpl<_PrestationTemplate>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PrestationTemplateToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _PrestationTemplate&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.description, description) || other.description == description)&&(identical(other.category, category) || other.category == category)&&(identical(other.unit, unit) || other.unit == unit)&&(identical(other.unitPriceHT, unitPriceHT) || other.unitPriceHT == unitPriceHT)&&(identical(other.tvaRate, tvaRate) || other.tvaRate == tvaRate)&&(identical(other.isGlobal, isGlobal) || other.isGlobal == isGlobal)&&(identical(other.createdBy, createdBy) || other.createdBy == createdBy)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,description,category,unit,unitPriceHT,tvaRate,isGlobal,createdBy,createdAt,updatedAt);

@override
String toString() {
  return 'PrestationTemplate(id: $id, name: $name, description: $description, category: $category, unit: $unit, unitPriceHT: $unitPriceHT, tvaRate: $tvaRate, isGlobal: $isGlobal, createdBy: $createdBy, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$PrestationTemplateCopyWith<$Res> implements $PrestationTemplateCopyWith<$Res> {
  factory _$PrestationTemplateCopyWith(_PrestationTemplate value, $Res Function(_PrestationTemplate) _then) = __$PrestationTemplateCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, String? description, String category, String unit, double unitPriceHT, double tvaRate, bool isGlobal, String? createdBy, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class __$PrestationTemplateCopyWithImpl<$Res>
    implements _$PrestationTemplateCopyWith<$Res> {
  __$PrestationTemplateCopyWithImpl(this._self, this._then);

  final _PrestationTemplate _self;
  final $Res Function(_PrestationTemplate) _then;

/// Create a copy of PrestationTemplate
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? description = freezed,Object? category = null,Object? unit = null,Object? unitPriceHT = null,Object? tvaRate = null,Object? isGlobal = null,Object? createdBy = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_PrestationTemplate(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,category: null == category ? _self.category : category // ignore: cast_nullable_to_non_nullable
as String,unit: null == unit ? _self.unit : unit // ignore: cast_nullable_to_non_nullable
as String,unitPriceHT: null == unitPriceHT ? _self.unitPriceHT : unitPriceHT // ignore: cast_nullable_to_non_nullable
as double,tvaRate: null == tvaRate ? _self.tvaRate : tvaRate // ignore: cast_nullable_to_non_nullable
as double,isGlobal: null == isGlobal ? _self.isGlobal : isGlobal // ignore: cast_nullable_to_non_nullable
as bool,createdBy: freezed == createdBy ? _self.createdBy : createdBy // ignore: cast_nullable_to_non_nullable
as String?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}

// dart format on
