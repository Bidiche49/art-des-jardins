// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'sync_queue_item.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SyncQueueItem {

 String get id; String get operation; String get entity; String? get entityId; Map<String, dynamic> get data; int get timestamp; int get retryCount; String? get lastError; SyncStatus get status;
/// Create a copy of SyncQueueItem
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SyncQueueItemCopyWith<SyncQueueItem> get copyWith => _$SyncQueueItemCopyWithImpl<SyncQueueItem>(this as SyncQueueItem, _$identity);

  /// Serializes this SyncQueueItem to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SyncQueueItem&&(identical(other.id, id) || other.id == id)&&(identical(other.operation, operation) || other.operation == operation)&&(identical(other.entity, entity) || other.entity == entity)&&(identical(other.entityId, entityId) || other.entityId == entityId)&&const DeepCollectionEquality().equals(other.data, data)&&(identical(other.timestamp, timestamp) || other.timestamp == timestamp)&&(identical(other.retryCount, retryCount) || other.retryCount == retryCount)&&(identical(other.lastError, lastError) || other.lastError == lastError)&&(identical(other.status, status) || other.status == status));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,operation,entity,entityId,const DeepCollectionEquality().hash(data),timestamp,retryCount,lastError,status);

@override
String toString() {
  return 'SyncQueueItem(id: $id, operation: $operation, entity: $entity, entityId: $entityId, data: $data, timestamp: $timestamp, retryCount: $retryCount, lastError: $lastError, status: $status)';
}


}

/// @nodoc
abstract mixin class $SyncQueueItemCopyWith<$Res>  {
  factory $SyncQueueItemCopyWith(SyncQueueItem value, $Res Function(SyncQueueItem) _then) = _$SyncQueueItemCopyWithImpl;
@useResult
$Res call({
 String id, String operation, String entity, String? entityId, Map<String, dynamic> data, int timestamp, int retryCount, String? lastError, SyncStatus status
});




}
/// @nodoc
class _$SyncQueueItemCopyWithImpl<$Res>
    implements $SyncQueueItemCopyWith<$Res> {
  _$SyncQueueItemCopyWithImpl(this._self, this._then);

  final SyncQueueItem _self;
  final $Res Function(SyncQueueItem) _then;

/// Create a copy of SyncQueueItem
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? operation = null,Object? entity = null,Object? entityId = freezed,Object? data = null,Object? timestamp = null,Object? retryCount = null,Object? lastError = freezed,Object? status = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,operation: null == operation ? _self.operation : operation // ignore: cast_nullable_to_non_nullable
as String,entity: null == entity ? _self.entity : entity // ignore: cast_nullable_to_non_nullable
as String,entityId: freezed == entityId ? _self.entityId : entityId // ignore: cast_nullable_to_non_nullable
as String?,data: null == data ? _self.data : data // ignore: cast_nullable_to_non_nullable
as Map<String, dynamic>,timestamp: null == timestamp ? _self.timestamp : timestamp // ignore: cast_nullable_to_non_nullable
as int,retryCount: null == retryCount ? _self.retryCount : retryCount // ignore: cast_nullable_to_non_nullable
as int,lastError: freezed == lastError ? _self.lastError : lastError // ignore: cast_nullable_to_non_nullable
as String?,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as SyncStatus,
  ));
}

}


/// Adds pattern-matching-related methods to [SyncQueueItem].
extension SyncQueueItemPatterns on SyncQueueItem {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SyncQueueItem value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SyncQueueItem() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SyncQueueItem value)  $default,){
final _that = this;
switch (_that) {
case _SyncQueueItem():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SyncQueueItem value)?  $default,){
final _that = this;
switch (_that) {
case _SyncQueueItem() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String operation,  String entity,  String? entityId,  Map<String, dynamic> data,  int timestamp,  int retryCount,  String? lastError,  SyncStatus status)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SyncQueueItem() when $default != null:
return $default(_that.id,_that.operation,_that.entity,_that.entityId,_that.data,_that.timestamp,_that.retryCount,_that.lastError,_that.status);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String operation,  String entity,  String? entityId,  Map<String, dynamic> data,  int timestamp,  int retryCount,  String? lastError,  SyncStatus status)  $default,) {final _that = this;
switch (_that) {
case _SyncQueueItem():
return $default(_that.id,_that.operation,_that.entity,_that.entityId,_that.data,_that.timestamp,_that.retryCount,_that.lastError,_that.status);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String operation,  String entity,  String? entityId,  Map<String, dynamic> data,  int timestamp,  int retryCount,  String? lastError,  SyncStatus status)?  $default,) {final _that = this;
switch (_that) {
case _SyncQueueItem() when $default != null:
return $default(_that.id,_that.operation,_that.entity,_that.entityId,_that.data,_that.timestamp,_that.retryCount,_that.lastError,_that.status);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SyncQueueItem implements SyncQueueItem {
  const _SyncQueueItem({required this.id, required this.operation, required this.entity, this.entityId, required final  Map<String, dynamic> data, required this.timestamp, this.retryCount = 0, this.lastError, this.status = SyncStatus.pending}): _data = data;
  factory _SyncQueueItem.fromJson(Map<String, dynamic> json) => _$SyncQueueItemFromJson(json);

@override final  String id;
@override final  String operation;
@override final  String entity;
@override final  String? entityId;
 final  Map<String, dynamic> _data;
@override Map<String, dynamic> get data {
  if (_data is EqualUnmodifiableMapView) return _data;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableMapView(_data);
}

@override final  int timestamp;
@override@JsonKey() final  int retryCount;
@override final  String? lastError;
@override@JsonKey() final  SyncStatus status;

/// Create a copy of SyncQueueItem
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SyncQueueItemCopyWith<_SyncQueueItem> get copyWith => __$SyncQueueItemCopyWithImpl<_SyncQueueItem>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SyncQueueItemToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _SyncQueueItem&&(identical(other.id, id) || other.id == id)&&(identical(other.operation, operation) || other.operation == operation)&&(identical(other.entity, entity) || other.entity == entity)&&(identical(other.entityId, entityId) || other.entityId == entityId)&&const DeepCollectionEquality().equals(other._data, _data)&&(identical(other.timestamp, timestamp) || other.timestamp == timestamp)&&(identical(other.retryCount, retryCount) || other.retryCount == retryCount)&&(identical(other.lastError, lastError) || other.lastError == lastError)&&(identical(other.status, status) || other.status == status));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,operation,entity,entityId,const DeepCollectionEquality().hash(_data),timestamp,retryCount,lastError,status);

@override
String toString() {
  return 'SyncQueueItem(id: $id, operation: $operation, entity: $entity, entityId: $entityId, data: $data, timestamp: $timestamp, retryCount: $retryCount, lastError: $lastError, status: $status)';
}


}

/// @nodoc
abstract mixin class _$SyncQueueItemCopyWith<$Res> implements $SyncQueueItemCopyWith<$Res> {
  factory _$SyncQueueItemCopyWith(_SyncQueueItem value, $Res Function(_SyncQueueItem) _then) = __$SyncQueueItemCopyWithImpl;
@override @useResult
$Res call({
 String id, String operation, String entity, String? entityId, Map<String, dynamic> data, int timestamp, int retryCount, String? lastError, SyncStatus status
});




}
/// @nodoc
class __$SyncQueueItemCopyWithImpl<$Res>
    implements _$SyncQueueItemCopyWith<$Res> {
  __$SyncQueueItemCopyWithImpl(this._self, this._then);

  final _SyncQueueItem _self;
  final $Res Function(_SyncQueueItem) _then;

/// Create a copy of SyncQueueItem
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? operation = null,Object? entity = null,Object? entityId = freezed,Object? data = null,Object? timestamp = null,Object? retryCount = null,Object? lastError = freezed,Object? status = null,}) {
  return _then(_SyncQueueItem(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,operation: null == operation ? _self.operation : operation // ignore: cast_nullable_to_non_nullable
as String,entity: null == entity ? _self.entity : entity // ignore: cast_nullable_to_non_nullable
as String,entityId: freezed == entityId ? _self.entityId : entityId // ignore: cast_nullable_to_non_nullable
as String?,data: null == data ? _self._data : data // ignore: cast_nullable_to_non_nullable
as Map<String, dynamic>,timestamp: null == timestamp ? _self.timestamp : timestamp // ignore: cast_nullable_to_non_nullable
as int,retryCount: null == retryCount ? _self.retryCount : retryCount // ignore: cast_nullable_to_non_nullable
as int,lastError: freezed == lastError ? _self.lastError : lastError // ignore: cast_nullable_to_non_nullable
as String?,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as SyncStatus,
  ));
}


}

// dart format on
