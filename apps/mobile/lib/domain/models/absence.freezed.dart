// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'absence.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$Absence {

 String get id; String get userId; DateTime get dateDebut; DateTime get dateFin; AbsenceType get type; String? get motif; bool get validee; DateTime get createdAt; DateTime get updatedAt;
/// Create a copy of Absence
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AbsenceCopyWith<Absence> get copyWith => _$AbsenceCopyWithImpl<Absence>(this as Absence, _$identity);

  /// Serializes this Absence to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Absence&&(identical(other.id, id) || other.id == id)&&(identical(other.userId, userId) || other.userId == userId)&&(identical(other.dateDebut, dateDebut) || other.dateDebut == dateDebut)&&(identical(other.dateFin, dateFin) || other.dateFin == dateFin)&&(identical(other.type, type) || other.type == type)&&(identical(other.motif, motif) || other.motif == motif)&&(identical(other.validee, validee) || other.validee == validee)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,userId,dateDebut,dateFin,type,motif,validee,createdAt,updatedAt);

@override
String toString() {
  return 'Absence(id: $id, userId: $userId, dateDebut: $dateDebut, dateFin: $dateFin, type: $type, motif: $motif, validee: $validee, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $AbsenceCopyWith<$Res>  {
  factory $AbsenceCopyWith(Absence value, $Res Function(Absence) _then) = _$AbsenceCopyWithImpl;
@useResult
$Res call({
 String id, String userId, DateTime dateDebut, DateTime dateFin, AbsenceType type, String? motif, bool validee, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class _$AbsenceCopyWithImpl<$Res>
    implements $AbsenceCopyWith<$Res> {
  _$AbsenceCopyWithImpl(this._self, this._then);

  final Absence _self;
  final $Res Function(Absence) _then;

/// Create a copy of Absence
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? userId = null,Object? dateDebut = null,Object? dateFin = null,Object? type = null,Object? motif = freezed,Object? validee = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,dateDebut: null == dateDebut ? _self.dateDebut : dateDebut // ignore: cast_nullable_to_non_nullable
as DateTime,dateFin: null == dateFin ? _self.dateFin : dateFin // ignore: cast_nullable_to_non_nullable
as DateTime,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as AbsenceType,motif: freezed == motif ? _self.motif : motif // ignore: cast_nullable_to_non_nullable
as String?,validee: null == validee ? _self.validee : validee // ignore: cast_nullable_to_non_nullable
as bool,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [Absence].
extension AbsencePatterns on Absence {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Absence value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _Absence() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Absence value)  $default,){
final _that = this;
switch (_that) {
case _Absence():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Absence value)?  $default,){
final _that = this;
switch (_that) {
case _Absence() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String userId,  DateTime dateDebut,  DateTime dateFin,  AbsenceType type,  String? motif,  bool validee,  DateTime createdAt,  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Absence() when $default != null:
return $default(_that.id,_that.userId,_that.dateDebut,_that.dateFin,_that.type,_that.motif,_that.validee,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String userId,  DateTime dateDebut,  DateTime dateFin,  AbsenceType type,  String? motif,  bool validee,  DateTime createdAt,  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _Absence():
return $default(_that.id,_that.userId,_that.dateDebut,_that.dateFin,_that.type,_that.motif,_that.validee,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String userId,  DateTime dateDebut,  DateTime dateFin,  AbsenceType type,  String? motif,  bool validee,  DateTime createdAt,  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _Absence() when $default != null:
return $default(_that.id,_that.userId,_that.dateDebut,_that.dateFin,_that.type,_that.motif,_that.validee,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _Absence implements Absence {
  const _Absence({required this.id, required this.userId, required this.dateDebut, required this.dateFin, required this.type, this.motif, this.validee = false, required this.createdAt, required this.updatedAt});
  factory _Absence.fromJson(Map<String, dynamic> json) => _$AbsenceFromJson(json);

@override final  String id;
@override final  String userId;
@override final  DateTime dateDebut;
@override final  DateTime dateFin;
@override final  AbsenceType type;
@override final  String? motif;
@override@JsonKey() final  bool validee;
@override final  DateTime createdAt;
@override final  DateTime updatedAt;

/// Create a copy of Absence
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AbsenceCopyWith<_Absence> get copyWith => __$AbsenceCopyWithImpl<_Absence>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AbsenceToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _Absence&&(identical(other.id, id) || other.id == id)&&(identical(other.userId, userId) || other.userId == userId)&&(identical(other.dateDebut, dateDebut) || other.dateDebut == dateDebut)&&(identical(other.dateFin, dateFin) || other.dateFin == dateFin)&&(identical(other.type, type) || other.type == type)&&(identical(other.motif, motif) || other.motif == motif)&&(identical(other.validee, validee) || other.validee == validee)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,userId,dateDebut,dateFin,type,motif,validee,createdAt,updatedAt);

@override
String toString() {
  return 'Absence(id: $id, userId: $userId, dateDebut: $dateDebut, dateFin: $dateFin, type: $type, motif: $motif, validee: $validee, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$AbsenceCopyWith<$Res> implements $AbsenceCopyWith<$Res> {
  factory _$AbsenceCopyWith(_Absence value, $Res Function(_Absence) _then) = __$AbsenceCopyWithImpl;
@override @useResult
$Res call({
 String id, String userId, DateTime dateDebut, DateTime dateFin, AbsenceType type, String? motif, bool validee, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class __$AbsenceCopyWithImpl<$Res>
    implements _$AbsenceCopyWith<$Res> {
  __$AbsenceCopyWithImpl(this._self, this._then);

  final _Absence _self;
  final $Res Function(_Absence) _then;

/// Create a copy of Absence
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? userId = null,Object? dateDebut = null,Object? dateFin = null,Object? type = null,Object? motif = freezed,Object? validee = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_Absence(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,dateDebut: null == dateDebut ? _self.dateDebut : dateDebut // ignore: cast_nullable_to_non_nullable
as DateTime,dateFin: null == dateFin ? _self.dateFin : dateFin // ignore: cast_nullable_to_non_nullable
as DateTime,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as AbsenceType,motif: freezed == motif ? _self.motif : motif // ignore: cast_nullable_to_non_nullable
as String?,validee: null == validee ? _self.validee : validee // ignore: cast_nullable_to_non_nullable
as bool,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}

// dart format on
