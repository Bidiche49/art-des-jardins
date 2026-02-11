// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'intervention.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$Intervention {

 String get id; String get chantierId; String get employeId; DateTime get date; DateTime get heureDebut; DateTime? get heureFin; int? get dureeMinutes; String? get description; List<String> get photos; String? get notes; bool get valide; String? get externalCalendarEventId; DateTime? get deletedAt; DateTime get createdAt; DateTime get updatedAt;
/// Create a copy of Intervention
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$InterventionCopyWith<Intervention> get copyWith => _$InterventionCopyWithImpl<Intervention>(this as Intervention, _$identity);

  /// Serializes this Intervention to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Intervention&&(identical(other.id, id) || other.id == id)&&(identical(other.chantierId, chantierId) || other.chantierId == chantierId)&&(identical(other.employeId, employeId) || other.employeId == employeId)&&(identical(other.date, date) || other.date == date)&&(identical(other.heureDebut, heureDebut) || other.heureDebut == heureDebut)&&(identical(other.heureFin, heureFin) || other.heureFin == heureFin)&&(identical(other.dureeMinutes, dureeMinutes) || other.dureeMinutes == dureeMinutes)&&(identical(other.description, description) || other.description == description)&&const DeepCollectionEquality().equals(other.photos, photos)&&(identical(other.notes, notes) || other.notes == notes)&&(identical(other.valide, valide) || other.valide == valide)&&(identical(other.externalCalendarEventId, externalCalendarEventId) || other.externalCalendarEventId == externalCalendarEventId)&&(identical(other.deletedAt, deletedAt) || other.deletedAt == deletedAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,chantierId,employeId,date,heureDebut,heureFin,dureeMinutes,description,const DeepCollectionEquality().hash(photos),notes,valide,externalCalendarEventId,deletedAt,createdAt,updatedAt);

@override
String toString() {
  return 'Intervention(id: $id, chantierId: $chantierId, employeId: $employeId, date: $date, heureDebut: $heureDebut, heureFin: $heureFin, dureeMinutes: $dureeMinutes, description: $description, photos: $photos, notes: $notes, valide: $valide, externalCalendarEventId: $externalCalendarEventId, deletedAt: $deletedAt, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $InterventionCopyWith<$Res>  {
  factory $InterventionCopyWith(Intervention value, $Res Function(Intervention) _then) = _$InterventionCopyWithImpl;
@useResult
$Res call({
 String id, String chantierId, String employeId, DateTime date, DateTime heureDebut, DateTime? heureFin, int? dureeMinutes, String? description, List<String> photos, String? notes, bool valide, String? externalCalendarEventId, DateTime? deletedAt, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class _$InterventionCopyWithImpl<$Res>
    implements $InterventionCopyWith<$Res> {
  _$InterventionCopyWithImpl(this._self, this._then);

  final Intervention _self;
  final $Res Function(Intervention) _then;

/// Create a copy of Intervention
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? chantierId = null,Object? employeId = null,Object? date = null,Object? heureDebut = null,Object? heureFin = freezed,Object? dureeMinutes = freezed,Object? description = freezed,Object? photos = null,Object? notes = freezed,Object? valide = null,Object? externalCalendarEventId = freezed,Object? deletedAt = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,chantierId: null == chantierId ? _self.chantierId : chantierId // ignore: cast_nullable_to_non_nullable
as String,employeId: null == employeId ? _self.employeId : employeId // ignore: cast_nullable_to_non_nullable
as String,date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as DateTime,heureDebut: null == heureDebut ? _self.heureDebut : heureDebut // ignore: cast_nullable_to_non_nullable
as DateTime,heureFin: freezed == heureFin ? _self.heureFin : heureFin // ignore: cast_nullable_to_non_nullable
as DateTime?,dureeMinutes: freezed == dureeMinutes ? _self.dureeMinutes : dureeMinutes // ignore: cast_nullable_to_non_nullable
as int?,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,photos: null == photos ? _self.photos : photos // ignore: cast_nullable_to_non_nullable
as List<String>,notes: freezed == notes ? _self.notes : notes // ignore: cast_nullable_to_non_nullable
as String?,valide: null == valide ? _self.valide : valide // ignore: cast_nullable_to_non_nullable
as bool,externalCalendarEventId: freezed == externalCalendarEventId ? _self.externalCalendarEventId : externalCalendarEventId // ignore: cast_nullable_to_non_nullable
as String?,deletedAt: freezed == deletedAt ? _self.deletedAt : deletedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [Intervention].
extension InterventionPatterns on Intervention {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Intervention value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _Intervention() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Intervention value)  $default,){
final _that = this;
switch (_that) {
case _Intervention():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Intervention value)?  $default,){
final _that = this;
switch (_that) {
case _Intervention() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String chantierId,  String employeId,  DateTime date,  DateTime heureDebut,  DateTime? heureFin,  int? dureeMinutes,  String? description,  List<String> photos,  String? notes,  bool valide,  String? externalCalendarEventId,  DateTime? deletedAt,  DateTime createdAt,  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Intervention() when $default != null:
return $default(_that.id,_that.chantierId,_that.employeId,_that.date,_that.heureDebut,_that.heureFin,_that.dureeMinutes,_that.description,_that.photos,_that.notes,_that.valide,_that.externalCalendarEventId,_that.deletedAt,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String chantierId,  String employeId,  DateTime date,  DateTime heureDebut,  DateTime? heureFin,  int? dureeMinutes,  String? description,  List<String> photos,  String? notes,  bool valide,  String? externalCalendarEventId,  DateTime? deletedAt,  DateTime createdAt,  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _Intervention():
return $default(_that.id,_that.chantierId,_that.employeId,_that.date,_that.heureDebut,_that.heureFin,_that.dureeMinutes,_that.description,_that.photos,_that.notes,_that.valide,_that.externalCalendarEventId,_that.deletedAt,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String chantierId,  String employeId,  DateTime date,  DateTime heureDebut,  DateTime? heureFin,  int? dureeMinutes,  String? description,  List<String> photos,  String? notes,  bool valide,  String? externalCalendarEventId,  DateTime? deletedAt,  DateTime createdAt,  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _Intervention() when $default != null:
return $default(_that.id,_that.chantierId,_that.employeId,_that.date,_that.heureDebut,_that.heureFin,_that.dureeMinutes,_that.description,_that.photos,_that.notes,_that.valide,_that.externalCalendarEventId,_that.deletedAt,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _Intervention implements Intervention {
  const _Intervention({required this.id, required this.chantierId, required this.employeId, required this.date, required this.heureDebut, this.heureFin, this.dureeMinutes, this.description, final  List<String> photos = const [], this.notes, this.valide = false, this.externalCalendarEventId, this.deletedAt, required this.createdAt, required this.updatedAt}): _photos = photos;
  factory _Intervention.fromJson(Map<String, dynamic> json) => _$InterventionFromJson(json);

@override final  String id;
@override final  String chantierId;
@override final  String employeId;
@override final  DateTime date;
@override final  DateTime heureDebut;
@override final  DateTime? heureFin;
@override final  int? dureeMinutes;
@override final  String? description;
 final  List<String> _photos;
@override@JsonKey() List<String> get photos {
  if (_photos is EqualUnmodifiableListView) return _photos;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_photos);
}

@override final  String? notes;
@override@JsonKey() final  bool valide;
@override final  String? externalCalendarEventId;
@override final  DateTime? deletedAt;
@override final  DateTime createdAt;
@override final  DateTime updatedAt;

/// Create a copy of Intervention
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$InterventionCopyWith<_Intervention> get copyWith => __$InterventionCopyWithImpl<_Intervention>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$InterventionToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _Intervention&&(identical(other.id, id) || other.id == id)&&(identical(other.chantierId, chantierId) || other.chantierId == chantierId)&&(identical(other.employeId, employeId) || other.employeId == employeId)&&(identical(other.date, date) || other.date == date)&&(identical(other.heureDebut, heureDebut) || other.heureDebut == heureDebut)&&(identical(other.heureFin, heureFin) || other.heureFin == heureFin)&&(identical(other.dureeMinutes, dureeMinutes) || other.dureeMinutes == dureeMinutes)&&(identical(other.description, description) || other.description == description)&&const DeepCollectionEquality().equals(other._photos, _photos)&&(identical(other.notes, notes) || other.notes == notes)&&(identical(other.valide, valide) || other.valide == valide)&&(identical(other.externalCalendarEventId, externalCalendarEventId) || other.externalCalendarEventId == externalCalendarEventId)&&(identical(other.deletedAt, deletedAt) || other.deletedAt == deletedAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,chantierId,employeId,date,heureDebut,heureFin,dureeMinutes,description,const DeepCollectionEquality().hash(_photos),notes,valide,externalCalendarEventId,deletedAt,createdAt,updatedAt);

@override
String toString() {
  return 'Intervention(id: $id, chantierId: $chantierId, employeId: $employeId, date: $date, heureDebut: $heureDebut, heureFin: $heureFin, dureeMinutes: $dureeMinutes, description: $description, photos: $photos, notes: $notes, valide: $valide, externalCalendarEventId: $externalCalendarEventId, deletedAt: $deletedAt, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$InterventionCopyWith<$Res> implements $InterventionCopyWith<$Res> {
  factory _$InterventionCopyWith(_Intervention value, $Res Function(_Intervention) _then) = __$InterventionCopyWithImpl;
@override @useResult
$Res call({
 String id, String chantierId, String employeId, DateTime date, DateTime heureDebut, DateTime? heureFin, int? dureeMinutes, String? description, List<String> photos, String? notes, bool valide, String? externalCalendarEventId, DateTime? deletedAt, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class __$InterventionCopyWithImpl<$Res>
    implements _$InterventionCopyWith<$Res> {
  __$InterventionCopyWithImpl(this._self, this._then);

  final _Intervention _self;
  final $Res Function(_Intervention) _then;

/// Create a copy of Intervention
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? chantierId = null,Object? employeId = null,Object? date = null,Object? heureDebut = null,Object? heureFin = freezed,Object? dureeMinutes = freezed,Object? description = freezed,Object? photos = null,Object? notes = freezed,Object? valide = null,Object? externalCalendarEventId = freezed,Object? deletedAt = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_Intervention(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,chantierId: null == chantierId ? _self.chantierId : chantierId // ignore: cast_nullable_to_non_nullable
as String,employeId: null == employeId ? _self.employeId : employeId // ignore: cast_nullable_to_non_nullable
as String,date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as DateTime,heureDebut: null == heureDebut ? _self.heureDebut : heureDebut // ignore: cast_nullable_to_non_nullable
as DateTime,heureFin: freezed == heureFin ? _self.heureFin : heureFin // ignore: cast_nullable_to_non_nullable
as DateTime?,dureeMinutes: freezed == dureeMinutes ? _self.dureeMinutes : dureeMinutes // ignore: cast_nullable_to_non_nullable
as int?,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,photos: null == photos ? _self._photos : photos // ignore: cast_nullable_to_non_nullable
as List<String>,notes: freezed == notes ? _self.notes : notes // ignore: cast_nullable_to_non_nullable
as String?,valide: null == valide ? _self.valide : valide // ignore: cast_nullable_to_non_nullable
as bool,externalCalendarEventId: freezed == externalCalendarEventId ? _self.externalCalendarEventId : externalCalendarEventId // ignore: cast_nullable_to_non_nullable
as String?,deletedAt: freezed == deletedAt ? _self.deletedAt : deletedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}

// dart format on
