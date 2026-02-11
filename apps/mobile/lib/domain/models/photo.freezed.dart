// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'photo.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$Photo {

 String get id; String get interventionId; PhotoType get type; String get filename; String get s3Key; String get mimeType; int get size; int get width; int get height; double? get latitude; double? get longitude; DateTime get takenAt; DateTime get uploadedAt; String get uploadedBy;
/// Create a copy of Photo
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$PhotoCopyWith<Photo> get copyWith => _$PhotoCopyWithImpl<Photo>(this as Photo, _$identity);

  /// Serializes this Photo to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Photo&&(identical(other.id, id) || other.id == id)&&(identical(other.interventionId, interventionId) || other.interventionId == interventionId)&&(identical(other.type, type) || other.type == type)&&(identical(other.filename, filename) || other.filename == filename)&&(identical(other.s3Key, s3Key) || other.s3Key == s3Key)&&(identical(other.mimeType, mimeType) || other.mimeType == mimeType)&&(identical(other.size, size) || other.size == size)&&(identical(other.width, width) || other.width == width)&&(identical(other.height, height) || other.height == height)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&(identical(other.takenAt, takenAt) || other.takenAt == takenAt)&&(identical(other.uploadedAt, uploadedAt) || other.uploadedAt == uploadedAt)&&(identical(other.uploadedBy, uploadedBy) || other.uploadedBy == uploadedBy));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,interventionId,type,filename,s3Key,mimeType,size,width,height,latitude,longitude,takenAt,uploadedAt,uploadedBy);

@override
String toString() {
  return 'Photo(id: $id, interventionId: $interventionId, type: $type, filename: $filename, s3Key: $s3Key, mimeType: $mimeType, size: $size, width: $width, height: $height, latitude: $latitude, longitude: $longitude, takenAt: $takenAt, uploadedAt: $uploadedAt, uploadedBy: $uploadedBy)';
}


}

/// @nodoc
abstract mixin class $PhotoCopyWith<$Res>  {
  factory $PhotoCopyWith(Photo value, $Res Function(Photo) _then) = _$PhotoCopyWithImpl;
@useResult
$Res call({
 String id, String interventionId, PhotoType type, String filename, String s3Key, String mimeType, int size, int width, int height, double? latitude, double? longitude, DateTime takenAt, DateTime uploadedAt, String uploadedBy
});




}
/// @nodoc
class _$PhotoCopyWithImpl<$Res>
    implements $PhotoCopyWith<$Res> {
  _$PhotoCopyWithImpl(this._self, this._then);

  final Photo _self;
  final $Res Function(Photo) _then;

/// Create a copy of Photo
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? interventionId = null,Object? type = null,Object? filename = null,Object? s3Key = null,Object? mimeType = null,Object? size = null,Object? width = null,Object? height = null,Object? latitude = freezed,Object? longitude = freezed,Object? takenAt = null,Object? uploadedAt = null,Object? uploadedBy = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,interventionId: null == interventionId ? _self.interventionId : interventionId // ignore: cast_nullable_to_non_nullable
as String,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as PhotoType,filename: null == filename ? _self.filename : filename // ignore: cast_nullable_to_non_nullable
as String,s3Key: null == s3Key ? _self.s3Key : s3Key // ignore: cast_nullable_to_non_nullable
as String,mimeType: null == mimeType ? _self.mimeType : mimeType // ignore: cast_nullable_to_non_nullable
as String,size: null == size ? _self.size : size // ignore: cast_nullable_to_non_nullable
as int,width: null == width ? _self.width : width // ignore: cast_nullable_to_non_nullable
as int,height: null == height ? _self.height : height // ignore: cast_nullable_to_non_nullable
as int,latitude: freezed == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double?,longitude: freezed == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double?,takenAt: null == takenAt ? _self.takenAt : takenAt // ignore: cast_nullable_to_non_nullable
as DateTime,uploadedAt: null == uploadedAt ? _self.uploadedAt : uploadedAt // ignore: cast_nullable_to_non_nullable
as DateTime,uploadedBy: null == uploadedBy ? _self.uploadedBy : uploadedBy // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [Photo].
extension PhotoPatterns on Photo {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Photo value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _Photo() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Photo value)  $default,){
final _that = this;
switch (_that) {
case _Photo():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Photo value)?  $default,){
final _that = this;
switch (_that) {
case _Photo() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String interventionId,  PhotoType type,  String filename,  String s3Key,  String mimeType,  int size,  int width,  int height,  double? latitude,  double? longitude,  DateTime takenAt,  DateTime uploadedAt,  String uploadedBy)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Photo() when $default != null:
return $default(_that.id,_that.interventionId,_that.type,_that.filename,_that.s3Key,_that.mimeType,_that.size,_that.width,_that.height,_that.latitude,_that.longitude,_that.takenAt,_that.uploadedAt,_that.uploadedBy);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String interventionId,  PhotoType type,  String filename,  String s3Key,  String mimeType,  int size,  int width,  int height,  double? latitude,  double? longitude,  DateTime takenAt,  DateTime uploadedAt,  String uploadedBy)  $default,) {final _that = this;
switch (_that) {
case _Photo():
return $default(_that.id,_that.interventionId,_that.type,_that.filename,_that.s3Key,_that.mimeType,_that.size,_that.width,_that.height,_that.latitude,_that.longitude,_that.takenAt,_that.uploadedAt,_that.uploadedBy);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String interventionId,  PhotoType type,  String filename,  String s3Key,  String mimeType,  int size,  int width,  int height,  double? latitude,  double? longitude,  DateTime takenAt,  DateTime uploadedAt,  String uploadedBy)?  $default,) {final _that = this;
switch (_that) {
case _Photo() when $default != null:
return $default(_that.id,_that.interventionId,_that.type,_that.filename,_that.s3Key,_that.mimeType,_that.size,_that.width,_that.height,_that.latitude,_that.longitude,_that.takenAt,_that.uploadedAt,_that.uploadedBy);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _Photo implements Photo {
  const _Photo({required this.id, required this.interventionId, required this.type, required this.filename, required this.s3Key, required this.mimeType, required this.size, required this.width, required this.height, this.latitude, this.longitude, required this.takenAt, required this.uploadedAt, required this.uploadedBy});
  factory _Photo.fromJson(Map<String, dynamic> json) => _$PhotoFromJson(json);

@override final  String id;
@override final  String interventionId;
@override final  PhotoType type;
@override final  String filename;
@override final  String s3Key;
@override final  String mimeType;
@override final  int size;
@override final  int width;
@override final  int height;
@override final  double? latitude;
@override final  double? longitude;
@override final  DateTime takenAt;
@override final  DateTime uploadedAt;
@override final  String uploadedBy;

/// Create a copy of Photo
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$PhotoCopyWith<_Photo> get copyWith => __$PhotoCopyWithImpl<_Photo>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$PhotoToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _Photo&&(identical(other.id, id) || other.id == id)&&(identical(other.interventionId, interventionId) || other.interventionId == interventionId)&&(identical(other.type, type) || other.type == type)&&(identical(other.filename, filename) || other.filename == filename)&&(identical(other.s3Key, s3Key) || other.s3Key == s3Key)&&(identical(other.mimeType, mimeType) || other.mimeType == mimeType)&&(identical(other.size, size) || other.size == size)&&(identical(other.width, width) || other.width == width)&&(identical(other.height, height) || other.height == height)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&(identical(other.takenAt, takenAt) || other.takenAt == takenAt)&&(identical(other.uploadedAt, uploadedAt) || other.uploadedAt == uploadedAt)&&(identical(other.uploadedBy, uploadedBy) || other.uploadedBy == uploadedBy));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,interventionId,type,filename,s3Key,mimeType,size,width,height,latitude,longitude,takenAt,uploadedAt,uploadedBy);

@override
String toString() {
  return 'Photo(id: $id, interventionId: $interventionId, type: $type, filename: $filename, s3Key: $s3Key, mimeType: $mimeType, size: $size, width: $width, height: $height, latitude: $latitude, longitude: $longitude, takenAt: $takenAt, uploadedAt: $uploadedAt, uploadedBy: $uploadedBy)';
}


}

/// @nodoc
abstract mixin class _$PhotoCopyWith<$Res> implements $PhotoCopyWith<$Res> {
  factory _$PhotoCopyWith(_Photo value, $Res Function(_Photo) _then) = __$PhotoCopyWithImpl;
@override @useResult
$Res call({
 String id, String interventionId, PhotoType type, String filename, String s3Key, String mimeType, int size, int width, int height, double? latitude, double? longitude, DateTime takenAt, DateTime uploadedAt, String uploadedBy
});




}
/// @nodoc
class __$PhotoCopyWithImpl<$Res>
    implements _$PhotoCopyWith<$Res> {
  __$PhotoCopyWithImpl(this._self, this._then);

  final _Photo _self;
  final $Res Function(_Photo) _then;

/// Create a copy of Photo
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? interventionId = null,Object? type = null,Object? filename = null,Object? s3Key = null,Object? mimeType = null,Object? size = null,Object? width = null,Object? height = null,Object? latitude = freezed,Object? longitude = freezed,Object? takenAt = null,Object? uploadedAt = null,Object? uploadedBy = null,}) {
  return _then(_Photo(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,interventionId: null == interventionId ? _self.interventionId : interventionId // ignore: cast_nullable_to_non_nullable
as String,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as PhotoType,filename: null == filename ? _self.filename : filename // ignore: cast_nullable_to_non_nullable
as String,s3Key: null == s3Key ? _self.s3Key : s3Key // ignore: cast_nullable_to_non_nullable
as String,mimeType: null == mimeType ? _self.mimeType : mimeType // ignore: cast_nullable_to_non_nullable
as String,size: null == size ? _self.size : size // ignore: cast_nullable_to_non_nullable
as int,width: null == width ? _self.width : width // ignore: cast_nullable_to_non_nullable
as int,height: null == height ? _self.height : height // ignore: cast_nullable_to_non_nullable
as int,latitude: freezed == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double?,longitude: freezed == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double?,takenAt: null == takenAt ? _self.takenAt : takenAt // ignore: cast_nullable_to_non_nullable
as DateTime,uploadedAt: null == uploadedAt ? _self.uploadedAt : uploadedAt // ignore: cast_nullable_to_non_nullable
as DateTime,uploadedBy: null == uploadedBy ? _self.uploadedBy : uploadedBy // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
