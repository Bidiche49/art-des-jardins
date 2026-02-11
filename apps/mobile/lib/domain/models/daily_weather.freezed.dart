// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'daily_weather.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$DailyWeather {

 String get date; double get tempMax; double get tempMin; double get precipitation; double get windSpeed; int get weatherCode; String get icon; String get description;
/// Create a copy of DailyWeather
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DailyWeatherCopyWith<DailyWeather> get copyWith => _$DailyWeatherCopyWithImpl<DailyWeather>(this as DailyWeather, _$identity);

  /// Serializes this DailyWeather to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DailyWeather&&(identical(other.date, date) || other.date == date)&&(identical(other.tempMax, tempMax) || other.tempMax == tempMax)&&(identical(other.tempMin, tempMin) || other.tempMin == tempMin)&&(identical(other.precipitation, precipitation) || other.precipitation == precipitation)&&(identical(other.windSpeed, windSpeed) || other.windSpeed == windSpeed)&&(identical(other.weatherCode, weatherCode) || other.weatherCode == weatherCode)&&(identical(other.icon, icon) || other.icon == icon)&&(identical(other.description, description) || other.description == description));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,date,tempMax,tempMin,precipitation,windSpeed,weatherCode,icon,description);

@override
String toString() {
  return 'DailyWeather(date: $date, tempMax: $tempMax, tempMin: $tempMin, precipitation: $precipitation, windSpeed: $windSpeed, weatherCode: $weatherCode, icon: $icon, description: $description)';
}


}

/// @nodoc
abstract mixin class $DailyWeatherCopyWith<$Res>  {
  factory $DailyWeatherCopyWith(DailyWeather value, $Res Function(DailyWeather) _then) = _$DailyWeatherCopyWithImpl;
@useResult
$Res call({
 String date, double tempMax, double tempMin, double precipitation, double windSpeed, int weatherCode, String icon, String description
});




}
/// @nodoc
class _$DailyWeatherCopyWithImpl<$Res>
    implements $DailyWeatherCopyWith<$Res> {
  _$DailyWeatherCopyWithImpl(this._self, this._then);

  final DailyWeather _self;
  final $Res Function(DailyWeather) _then;

/// Create a copy of DailyWeather
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? date = null,Object? tempMax = null,Object? tempMin = null,Object? precipitation = null,Object? windSpeed = null,Object? weatherCode = null,Object? icon = null,Object? description = null,}) {
  return _then(_self.copyWith(
date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as String,tempMax: null == tempMax ? _self.tempMax : tempMax // ignore: cast_nullable_to_non_nullable
as double,tempMin: null == tempMin ? _self.tempMin : tempMin // ignore: cast_nullable_to_non_nullable
as double,precipitation: null == precipitation ? _self.precipitation : precipitation // ignore: cast_nullable_to_non_nullable
as double,windSpeed: null == windSpeed ? _self.windSpeed : windSpeed // ignore: cast_nullable_to_non_nullable
as double,weatherCode: null == weatherCode ? _self.weatherCode : weatherCode // ignore: cast_nullable_to_non_nullable
as int,icon: null == icon ? _self.icon : icon // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [DailyWeather].
extension DailyWeatherPatterns on DailyWeather {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DailyWeather value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DailyWeather() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DailyWeather value)  $default,){
final _that = this;
switch (_that) {
case _DailyWeather():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DailyWeather value)?  $default,){
final _that = this;
switch (_that) {
case _DailyWeather() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String date,  double tempMax,  double tempMin,  double precipitation,  double windSpeed,  int weatherCode,  String icon,  String description)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DailyWeather() when $default != null:
return $default(_that.date,_that.tempMax,_that.tempMin,_that.precipitation,_that.windSpeed,_that.weatherCode,_that.icon,_that.description);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String date,  double tempMax,  double tempMin,  double precipitation,  double windSpeed,  int weatherCode,  String icon,  String description)  $default,) {final _that = this;
switch (_that) {
case _DailyWeather():
return $default(_that.date,_that.tempMax,_that.tempMin,_that.precipitation,_that.windSpeed,_that.weatherCode,_that.icon,_that.description);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String date,  double tempMax,  double tempMin,  double precipitation,  double windSpeed,  int weatherCode,  String icon,  String description)?  $default,) {final _that = this;
switch (_that) {
case _DailyWeather() when $default != null:
return $default(_that.date,_that.tempMax,_that.tempMin,_that.precipitation,_that.windSpeed,_that.weatherCode,_that.icon,_that.description);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DailyWeather implements DailyWeather {
  const _DailyWeather({required this.date, required this.tempMax, required this.tempMin, this.precipitation = 0.0, this.windSpeed = 0.0, this.weatherCode = 0, this.icon = '', this.description = ''});
  factory _DailyWeather.fromJson(Map<String, dynamic> json) => _$DailyWeatherFromJson(json);

@override final  String date;
@override final  double tempMax;
@override final  double tempMin;
@override@JsonKey() final  double precipitation;
@override@JsonKey() final  double windSpeed;
@override@JsonKey() final  int weatherCode;
@override@JsonKey() final  String icon;
@override@JsonKey() final  String description;

/// Create a copy of DailyWeather
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DailyWeatherCopyWith<_DailyWeather> get copyWith => __$DailyWeatherCopyWithImpl<_DailyWeather>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DailyWeatherToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _DailyWeather&&(identical(other.date, date) || other.date == date)&&(identical(other.tempMax, tempMax) || other.tempMax == tempMax)&&(identical(other.tempMin, tempMin) || other.tempMin == tempMin)&&(identical(other.precipitation, precipitation) || other.precipitation == precipitation)&&(identical(other.windSpeed, windSpeed) || other.windSpeed == windSpeed)&&(identical(other.weatherCode, weatherCode) || other.weatherCode == weatherCode)&&(identical(other.icon, icon) || other.icon == icon)&&(identical(other.description, description) || other.description == description));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,date,tempMax,tempMin,precipitation,windSpeed,weatherCode,icon,description);

@override
String toString() {
  return 'DailyWeather(date: $date, tempMax: $tempMax, tempMin: $tempMin, precipitation: $precipitation, windSpeed: $windSpeed, weatherCode: $weatherCode, icon: $icon, description: $description)';
}


}

/// @nodoc
abstract mixin class _$DailyWeatherCopyWith<$Res> implements $DailyWeatherCopyWith<$Res> {
  factory _$DailyWeatherCopyWith(_DailyWeather value, $Res Function(_DailyWeather) _then) = __$DailyWeatherCopyWithImpl;
@override @useResult
$Res call({
 String date, double tempMax, double tempMin, double precipitation, double windSpeed, int weatherCode, String icon, String description
});




}
/// @nodoc
class __$DailyWeatherCopyWithImpl<$Res>
    implements _$DailyWeatherCopyWith<$Res> {
  __$DailyWeatherCopyWithImpl(this._self, this._then);

  final _DailyWeather _self;
  final $Res Function(_DailyWeather) _then;

/// Create a copy of DailyWeather
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? date = null,Object? tempMax = null,Object? tempMin = null,Object? precipitation = null,Object? windSpeed = null,Object? weatherCode = null,Object? icon = null,Object? description = null,}) {
  return _then(_DailyWeather(
date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as String,tempMax: null == tempMax ? _self.tempMax : tempMax // ignore: cast_nullable_to_non_nullable
as double,tempMin: null == tempMin ? _self.tempMin : tempMin // ignore: cast_nullable_to_non_nullable
as double,precipitation: null == precipitation ? _self.precipitation : precipitation // ignore: cast_nullable_to_non_nullable
as double,windSpeed: null == windSpeed ? _self.windSpeed : windSpeed // ignore: cast_nullable_to_non_nullable
as double,weatherCode: null == weatherCode ? _self.weatherCode : weatherCode // ignore: cast_nullable_to_non_nullable
as int,icon: null == icon ? _self.icon : icon // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
