// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'sync_conflict.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SyncConflict {

 String get id; String get entityType; String get entityId; String get entityLabel; Map<String, dynamic> get localVersion; Map<String, dynamic> get serverVersion; DateTime get localTimestamp; DateTime get serverTimestamp; List<String> get conflictingFields; DateTime? get resolvedAt;
/// Create a copy of SyncConflict
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SyncConflictCopyWith<SyncConflict> get copyWith => _$SyncConflictCopyWithImpl<SyncConflict>(this as SyncConflict, _$identity);

  /// Serializes this SyncConflict to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SyncConflict&&(identical(other.id, id) || other.id == id)&&(identical(other.entityType, entityType) || other.entityType == entityType)&&(identical(other.entityId, entityId) || other.entityId == entityId)&&(identical(other.entityLabel, entityLabel) || other.entityLabel == entityLabel)&&const DeepCollectionEquality().equals(other.localVersion, localVersion)&&const DeepCollectionEquality().equals(other.serverVersion, serverVersion)&&(identical(other.localTimestamp, localTimestamp) || other.localTimestamp == localTimestamp)&&(identical(other.serverTimestamp, serverTimestamp) || other.serverTimestamp == serverTimestamp)&&const DeepCollectionEquality().equals(other.conflictingFields, conflictingFields)&&(identical(other.resolvedAt, resolvedAt) || other.resolvedAt == resolvedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,entityType,entityId,entityLabel,const DeepCollectionEquality().hash(localVersion),const DeepCollectionEquality().hash(serverVersion),localTimestamp,serverTimestamp,const DeepCollectionEquality().hash(conflictingFields),resolvedAt);

@override
String toString() {
  return 'SyncConflict(id: $id, entityType: $entityType, entityId: $entityId, entityLabel: $entityLabel, localVersion: $localVersion, serverVersion: $serverVersion, localTimestamp: $localTimestamp, serverTimestamp: $serverTimestamp, conflictingFields: $conflictingFields, resolvedAt: $resolvedAt)';
}


}

/// @nodoc
abstract mixin class $SyncConflictCopyWith<$Res>  {
  factory $SyncConflictCopyWith(SyncConflict value, $Res Function(SyncConflict) _then) = _$SyncConflictCopyWithImpl;
@useResult
$Res call({
 String id, String entityType, String entityId, String entityLabel, Map<String, dynamic> localVersion, Map<String, dynamic> serverVersion, DateTime localTimestamp, DateTime serverTimestamp, List<String> conflictingFields, DateTime? resolvedAt
});




}
/// @nodoc
class _$SyncConflictCopyWithImpl<$Res>
    implements $SyncConflictCopyWith<$Res> {
  _$SyncConflictCopyWithImpl(this._self, this._then);

  final SyncConflict _self;
  final $Res Function(SyncConflict) _then;

/// Create a copy of SyncConflict
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? entityType = null,Object? entityId = null,Object? entityLabel = null,Object? localVersion = null,Object? serverVersion = null,Object? localTimestamp = null,Object? serverTimestamp = null,Object? conflictingFields = null,Object? resolvedAt = freezed,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,entityType: null == entityType ? _self.entityType : entityType // ignore: cast_nullable_to_non_nullable
as String,entityId: null == entityId ? _self.entityId : entityId // ignore: cast_nullable_to_non_nullable
as String,entityLabel: null == entityLabel ? _self.entityLabel : entityLabel // ignore: cast_nullable_to_non_nullable
as String,localVersion: null == localVersion ? _self.localVersion : localVersion // ignore: cast_nullable_to_non_nullable
as Map<String, dynamic>,serverVersion: null == serverVersion ? _self.serverVersion : serverVersion // ignore: cast_nullable_to_non_nullable
as Map<String, dynamic>,localTimestamp: null == localTimestamp ? _self.localTimestamp : localTimestamp // ignore: cast_nullable_to_non_nullable
as DateTime,serverTimestamp: null == serverTimestamp ? _self.serverTimestamp : serverTimestamp // ignore: cast_nullable_to_non_nullable
as DateTime,conflictingFields: null == conflictingFields ? _self.conflictingFields : conflictingFields // ignore: cast_nullable_to_non_nullable
as List<String>,resolvedAt: freezed == resolvedAt ? _self.resolvedAt : resolvedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}

}


/// Adds pattern-matching-related methods to [SyncConflict].
extension SyncConflictPatterns on SyncConflict {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SyncConflict value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SyncConflict() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SyncConflict value)  $default,){
final _that = this;
switch (_that) {
case _SyncConflict():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SyncConflict value)?  $default,){
final _that = this;
switch (_that) {
case _SyncConflict() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String entityType,  String entityId,  String entityLabel,  Map<String, dynamic> localVersion,  Map<String, dynamic> serverVersion,  DateTime localTimestamp,  DateTime serverTimestamp,  List<String> conflictingFields,  DateTime? resolvedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SyncConflict() when $default != null:
return $default(_that.id,_that.entityType,_that.entityId,_that.entityLabel,_that.localVersion,_that.serverVersion,_that.localTimestamp,_that.serverTimestamp,_that.conflictingFields,_that.resolvedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String entityType,  String entityId,  String entityLabel,  Map<String, dynamic> localVersion,  Map<String, dynamic> serverVersion,  DateTime localTimestamp,  DateTime serverTimestamp,  List<String> conflictingFields,  DateTime? resolvedAt)  $default,) {final _that = this;
switch (_that) {
case _SyncConflict():
return $default(_that.id,_that.entityType,_that.entityId,_that.entityLabel,_that.localVersion,_that.serverVersion,_that.localTimestamp,_that.serverTimestamp,_that.conflictingFields,_that.resolvedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String entityType,  String entityId,  String entityLabel,  Map<String, dynamic> localVersion,  Map<String, dynamic> serverVersion,  DateTime localTimestamp,  DateTime serverTimestamp,  List<String> conflictingFields,  DateTime? resolvedAt)?  $default,) {final _that = this;
switch (_that) {
case _SyncConflict() when $default != null:
return $default(_that.id,_that.entityType,_that.entityId,_that.entityLabel,_that.localVersion,_that.serverVersion,_that.localTimestamp,_that.serverTimestamp,_that.conflictingFields,_that.resolvedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SyncConflict implements SyncConflict {
  const _SyncConflict({required this.id, required this.entityType, required this.entityId, required this.entityLabel, required final  Map<String, dynamic> localVersion, required final  Map<String, dynamic> serverVersion, required this.localTimestamp, required this.serverTimestamp, final  List<String> conflictingFields = const [], this.resolvedAt}): _localVersion = localVersion,_serverVersion = serverVersion,_conflictingFields = conflictingFields;
  factory _SyncConflict.fromJson(Map<String, dynamic> json) => _$SyncConflictFromJson(json);

@override final  String id;
@override final  String entityType;
@override final  String entityId;
@override final  String entityLabel;
 final  Map<String, dynamic> _localVersion;
@override Map<String, dynamic> get localVersion {
  if (_localVersion is EqualUnmodifiableMapView) return _localVersion;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableMapView(_localVersion);
}

 final  Map<String, dynamic> _serverVersion;
@override Map<String, dynamic> get serverVersion {
  if (_serverVersion is EqualUnmodifiableMapView) return _serverVersion;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableMapView(_serverVersion);
}

@override final  DateTime localTimestamp;
@override final  DateTime serverTimestamp;
 final  List<String> _conflictingFields;
@override@JsonKey() List<String> get conflictingFields {
  if (_conflictingFields is EqualUnmodifiableListView) return _conflictingFields;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_conflictingFields);
}

@override final  DateTime? resolvedAt;

/// Create a copy of SyncConflict
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SyncConflictCopyWith<_SyncConflict> get copyWith => __$SyncConflictCopyWithImpl<_SyncConflict>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SyncConflictToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _SyncConflict&&(identical(other.id, id) || other.id == id)&&(identical(other.entityType, entityType) || other.entityType == entityType)&&(identical(other.entityId, entityId) || other.entityId == entityId)&&(identical(other.entityLabel, entityLabel) || other.entityLabel == entityLabel)&&const DeepCollectionEquality().equals(other._localVersion, _localVersion)&&const DeepCollectionEquality().equals(other._serverVersion, _serverVersion)&&(identical(other.localTimestamp, localTimestamp) || other.localTimestamp == localTimestamp)&&(identical(other.serverTimestamp, serverTimestamp) || other.serverTimestamp == serverTimestamp)&&const DeepCollectionEquality().equals(other._conflictingFields, _conflictingFields)&&(identical(other.resolvedAt, resolvedAt) || other.resolvedAt == resolvedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,entityType,entityId,entityLabel,const DeepCollectionEquality().hash(_localVersion),const DeepCollectionEquality().hash(_serverVersion),localTimestamp,serverTimestamp,const DeepCollectionEquality().hash(_conflictingFields),resolvedAt);

@override
String toString() {
  return 'SyncConflict(id: $id, entityType: $entityType, entityId: $entityId, entityLabel: $entityLabel, localVersion: $localVersion, serverVersion: $serverVersion, localTimestamp: $localTimestamp, serverTimestamp: $serverTimestamp, conflictingFields: $conflictingFields, resolvedAt: $resolvedAt)';
}


}

/// @nodoc
abstract mixin class _$SyncConflictCopyWith<$Res> implements $SyncConflictCopyWith<$Res> {
  factory _$SyncConflictCopyWith(_SyncConflict value, $Res Function(_SyncConflict) _then) = __$SyncConflictCopyWithImpl;
@override @useResult
$Res call({
 String id, String entityType, String entityId, String entityLabel, Map<String, dynamic> localVersion, Map<String, dynamic> serverVersion, DateTime localTimestamp, DateTime serverTimestamp, List<String> conflictingFields, DateTime? resolvedAt
});




}
/// @nodoc
class __$SyncConflictCopyWithImpl<$Res>
    implements _$SyncConflictCopyWith<$Res> {
  __$SyncConflictCopyWithImpl(this._self, this._then);

  final _SyncConflict _self;
  final $Res Function(_SyncConflict) _then;

/// Create a copy of SyncConflict
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? entityType = null,Object? entityId = null,Object? entityLabel = null,Object? localVersion = null,Object? serverVersion = null,Object? localTimestamp = null,Object? serverTimestamp = null,Object? conflictingFields = null,Object? resolvedAt = freezed,}) {
  return _then(_SyncConflict(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,entityType: null == entityType ? _self.entityType : entityType // ignore: cast_nullable_to_non_nullable
as String,entityId: null == entityId ? _self.entityId : entityId // ignore: cast_nullable_to_non_nullable
as String,entityLabel: null == entityLabel ? _self.entityLabel : entityLabel // ignore: cast_nullable_to_non_nullable
as String,localVersion: null == localVersion ? _self._localVersion : localVersion // ignore: cast_nullable_to_non_nullable
as Map<String, dynamic>,serverVersion: null == serverVersion ? _self._serverVersion : serverVersion // ignore: cast_nullable_to_non_nullable
as Map<String, dynamic>,localTimestamp: null == localTimestamp ? _self.localTimestamp : localTimestamp // ignore: cast_nullable_to_non_nullable
as DateTime,serverTimestamp: null == serverTimestamp ? _self.serverTimestamp : serverTimestamp // ignore: cast_nullable_to_non_nullable
as DateTime,conflictingFields: null == conflictingFields ? _self._conflictingFields : conflictingFields // ignore: cast_nullable_to_non_nullable
as List<String>,resolvedAt: freezed == resolvedAt ? _self.resolvedAt : resolvedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}


}

// dart format on
