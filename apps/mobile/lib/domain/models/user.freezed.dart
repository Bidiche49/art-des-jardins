// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'user.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$User {

 String get id; String get email; String get nom; String get prenom; String? get telephone; UserRole get role; bool get actif; String? get avatarUrl; DateTime? get derniereConnexion; bool get onboardingCompleted; int get onboardingStep; double? get hourlyRate; DateTime get createdAt; DateTime get updatedAt;
/// Create a copy of User
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$UserCopyWith<User> get copyWith => _$UserCopyWithImpl<User>(this as User, _$identity);

  /// Serializes this User to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is User&&(identical(other.id, id) || other.id == id)&&(identical(other.email, email) || other.email == email)&&(identical(other.nom, nom) || other.nom == nom)&&(identical(other.prenom, prenom) || other.prenom == prenom)&&(identical(other.telephone, telephone) || other.telephone == telephone)&&(identical(other.role, role) || other.role == role)&&(identical(other.actif, actif) || other.actif == actif)&&(identical(other.avatarUrl, avatarUrl) || other.avatarUrl == avatarUrl)&&(identical(other.derniereConnexion, derniereConnexion) || other.derniereConnexion == derniereConnexion)&&(identical(other.onboardingCompleted, onboardingCompleted) || other.onboardingCompleted == onboardingCompleted)&&(identical(other.onboardingStep, onboardingStep) || other.onboardingStep == onboardingStep)&&(identical(other.hourlyRate, hourlyRate) || other.hourlyRate == hourlyRate)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,email,nom,prenom,telephone,role,actif,avatarUrl,derniereConnexion,onboardingCompleted,onboardingStep,hourlyRate,createdAt,updatedAt);

@override
String toString() {
  return 'User(id: $id, email: $email, nom: $nom, prenom: $prenom, telephone: $telephone, role: $role, actif: $actif, avatarUrl: $avatarUrl, derniereConnexion: $derniereConnexion, onboardingCompleted: $onboardingCompleted, onboardingStep: $onboardingStep, hourlyRate: $hourlyRate, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $UserCopyWith<$Res>  {
  factory $UserCopyWith(User value, $Res Function(User) _then) = _$UserCopyWithImpl;
@useResult
$Res call({
 String id, String email, String nom, String prenom, String? telephone, UserRole role, bool actif, String? avatarUrl, DateTime? derniereConnexion, bool onboardingCompleted, int onboardingStep, double? hourlyRate, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class _$UserCopyWithImpl<$Res>
    implements $UserCopyWith<$Res> {
  _$UserCopyWithImpl(this._self, this._then);

  final User _self;
  final $Res Function(User) _then;

/// Create a copy of User
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? email = null,Object? nom = null,Object? prenom = null,Object? telephone = freezed,Object? role = null,Object? actif = null,Object? avatarUrl = freezed,Object? derniereConnexion = freezed,Object? onboardingCompleted = null,Object? onboardingStep = null,Object? hourlyRate = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,nom: null == nom ? _self.nom : nom // ignore: cast_nullable_to_non_nullable
as String,prenom: null == prenom ? _self.prenom : prenom // ignore: cast_nullable_to_non_nullable
as String,telephone: freezed == telephone ? _self.telephone : telephone // ignore: cast_nullable_to_non_nullable
as String?,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as UserRole,actif: null == actif ? _self.actif : actif // ignore: cast_nullable_to_non_nullable
as bool,avatarUrl: freezed == avatarUrl ? _self.avatarUrl : avatarUrl // ignore: cast_nullable_to_non_nullable
as String?,derniereConnexion: freezed == derniereConnexion ? _self.derniereConnexion : derniereConnexion // ignore: cast_nullable_to_non_nullable
as DateTime?,onboardingCompleted: null == onboardingCompleted ? _self.onboardingCompleted : onboardingCompleted // ignore: cast_nullable_to_non_nullable
as bool,onboardingStep: null == onboardingStep ? _self.onboardingStep : onboardingStep // ignore: cast_nullable_to_non_nullable
as int,hourlyRate: freezed == hourlyRate ? _self.hourlyRate : hourlyRate // ignore: cast_nullable_to_non_nullable
as double?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [User].
extension UserPatterns on User {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _User value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _User() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _User value)  $default,){
final _that = this;
switch (_that) {
case _User():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _User value)?  $default,){
final _that = this;
switch (_that) {
case _User() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String email,  String nom,  String prenom,  String? telephone,  UserRole role,  bool actif,  String? avatarUrl,  DateTime? derniereConnexion,  bool onboardingCompleted,  int onboardingStep,  double? hourlyRate,  DateTime createdAt,  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _User() when $default != null:
return $default(_that.id,_that.email,_that.nom,_that.prenom,_that.telephone,_that.role,_that.actif,_that.avatarUrl,_that.derniereConnexion,_that.onboardingCompleted,_that.onboardingStep,_that.hourlyRate,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String email,  String nom,  String prenom,  String? telephone,  UserRole role,  bool actif,  String? avatarUrl,  DateTime? derniereConnexion,  bool onboardingCompleted,  int onboardingStep,  double? hourlyRate,  DateTime createdAt,  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _User():
return $default(_that.id,_that.email,_that.nom,_that.prenom,_that.telephone,_that.role,_that.actif,_that.avatarUrl,_that.derniereConnexion,_that.onboardingCompleted,_that.onboardingStep,_that.hourlyRate,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String email,  String nom,  String prenom,  String? telephone,  UserRole role,  bool actif,  String? avatarUrl,  DateTime? derniereConnexion,  bool onboardingCompleted,  int onboardingStep,  double? hourlyRate,  DateTime createdAt,  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _User() when $default != null:
return $default(_that.id,_that.email,_that.nom,_that.prenom,_that.telephone,_that.role,_that.actif,_that.avatarUrl,_that.derniereConnexion,_that.onboardingCompleted,_that.onboardingStep,_that.hourlyRate,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _User implements User {
  const _User({required this.id, required this.email, required this.nom, required this.prenom, this.telephone, this.role = UserRole.employe, this.actif = true, this.avatarUrl, this.derniereConnexion, this.onboardingCompleted = false, this.onboardingStep = 0, this.hourlyRate, required this.createdAt, required this.updatedAt});
  factory _User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);

@override final  String id;
@override final  String email;
@override final  String nom;
@override final  String prenom;
@override final  String? telephone;
@override@JsonKey() final  UserRole role;
@override@JsonKey() final  bool actif;
@override final  String? avatarUrl;
@override final  DateTime? derniereConnexion;
@override@JsonKey() final  bool onboardingCompleted;
@override@JsonKey() final  int onboardingStep;
@override final  double? hourlyRate;
@override final  DateTime createdAt;
@override final  DateTime updatedAt;

/// Create a copy of User
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UserCopyWith<_User> get copyWith => __$UserCopyWithImpl<_User>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$UserToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _User&&(identical(other.id, id) || other.id == id)&&(identical(other.email, email) || other.email == email)&&(identical(other.nom, nom) || other.nom == nom)&&(identical(other.prenom, prenom) || other.prenom == prenom)&&(identical(other.telephone, telephone) || other.telephone == telephone)&&(identical(other.role, role) || other.role == role)&&(identical(other.actif, actif) || other.actif == actif)&&(identical(other.avatarUrl, avatarUrl) || other.avatarUrl == avatarUrl)&&(identical(other.derniereConnexion, derniereConnexion) || other.derniereConnexion == derniereConnexion)&&(identical(other.onboardingCompleted, onboardingCompleted) || other.onboardingCompleted == onboardingCompleted)&&(identical(other.onboardingStep, onboardingStep) || other.onboardingStep == onboardingStep)&&(identical(other.hourlyRate, hourlyRate) || other.hourlyRate == hourlyRate)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,email,nom,prenom,telephone,role,actif,avatarUrl,derniereConnexion,onboardingCompleted,onboardingStep,hourlyRate,createdAt,updatedAt);

@override
String toString() {
  return 'User(id: $id, email: $email, nom: $nom, prenom: $prenom, telephone: $telephone, role: $role, actif: $actif, avatarUrl: $avatarUrl, derniereConnexion: $derniereConnexion, onboardingCompleted: $onboardingCompleted, onboardingStep: $onboardingStep, hourlyRate: $hourlyRate, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$UserCopyWith<$Res> implements $UserCopyWith<$Res> {
  factory _$UserCopyWith(_User value, $Res Function(_User) _then) = __$UserCopyWithImpl;
@override @useResult
$Res call({
 String id, String email, String nom, String prenom, String? telephone, UserRole role, bool actif, String? avatarUrl, DateTime? derniereConnexion, bool onboardingCompleted, int onboardingStep, double? hourlyRate, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class __$UserCopyWithImpl<$Res>
    implements _$UserCopyWith<$Res> {
  __$UserCopyWithImpl(this._self, this._then);

  final _User _self;
  final $Res Function(_User) _then;

/// Create a copy of User
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? email = null,Object? nom = null,Object? prenom = null,Object? telephone = freezed,Object? role = null,Object? actif = null,Object? avatarUrl = freezed,Object? derniereConnexion = freezed,Object? onboardingCompleted = null,Object? onboardingStep = null,Object? hourlyRate = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_User(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,nom: null == nom ? _self.nom : nom // ignore: cast_nullable_to_non_nullable
as String,prenom: null == prenom ? _self.prenom : prenom // ignore: cast_nullable_to_non_nullable
as String,telephone: freezed == telephone ? _self.telephone : telephone // ignore: cast_nullable_to_non_nullable
as String?,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as UserRole,actif: null == actif ? _self.actif : actif // ignore: cast_nullable_to_non_nullable
as bool,avatarUrl: freezed == avatarUrl ? _self.avatarUrl : avatarUrl // ignore: cast_nullable_to_non_nullable
as String?,derniereConnexion: freezed == derniereConnexion ? _self.derniereConnexion : derniereConnexion // ignore: cast_nullable_to_non_nullable
as DateTime?,onboardingCompleted: null == onboardingCompleted ? _self.onboardingCompleted : onboardingCompleted // ignore: cast_nullable_to_non_nullable
as bool,onboardingStep: null == onboardingStep ? _self.onboardingStep : onboardingStep // ignore: cast_nullable_to_non_nullable
as int,hourlyRate: freezed == hourlyRate ? _self.hourlyRate : hourlyRate // ignore: cast_nullable_to_non_nullable
as double?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}

// dart format on
