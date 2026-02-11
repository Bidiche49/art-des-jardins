import 'package:freezed_annotation/freezed_annotation.dart';

import '../enums/photo_type.dart';

part 'photo.freezed.dart';
part 'photo.g.dart';

@freezed
abstract class Photo with _$Photo {
  const factory Photo({
    required String id,
    required String interventionId,
    required PhotoType type,
    required String filename,
    required String s3Key,
    required String mimeType,
    required int size,
    required int width,
    required int height,
    double? latitude,
    double? longitude,
    required DateTime takenAt,
    required DateTime uploadedAt,
    required String uploadedBy,
  }) = _Photo;

  factory Photo.fromJson(Map<String, dynamic> json) => _$PhotoFromJson(json);
}
