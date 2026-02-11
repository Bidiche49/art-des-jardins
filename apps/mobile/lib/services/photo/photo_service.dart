import 'dart:io';
import 'dart:isolate';

import 'package:dio/dio.dart';
import 'package:drift/drift.dart' show Value;
import 'package:geolocator/geolocator.dart';
import 'package:image/image.dart' as img;
import 'package:image_picker/image_picker.dart';
import 'package:path_provider/path_provider.dart';

import '../../core/network/api_endpoints.dart';
import '../../core/network/connectivity_service.dart';
import '../../data/local/database/app_database.dart';
import '../../data/local/database/daos/photo_queue_dao.dart';
import '../../domain/enums/photo_type.dart';
import '../../domain/models/photo.dart';

class PhotoService {
  PhotoService({
    required Dio authDio,
    required ConnectivityService connectivityService,
    required PhotoQueueDao photoQueueDao,
    ImagePicker? imagePicker,
  })  : _authDio = authDio,
        _connectivity = connectivityService,
        _photoQueueDao = photoQueueDao,
        _imagePicker = imagePicker ?? ImagePicker();

  final Dio _authDio;
  final ConnectivityService _connectivity;
  final PhotoQueueDao _photoQueueDao;
  final ImagePicker _imagePicker;

  Future<File?> capturePhoto() async {
    final pickedFile = await _imagePicker.pickImage(
      source: ImageSource.camera,
      maxWidth: 1920,
      maxHeight: 1920,
      imageQuality: 85,
    );
    if (pickedFile == null) return null;
    return File(pickedFile.path);
  }

  Future<({double latitude, double longitude})?> getGpsCoordinates() async {
    final permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      final requested = await Geolocator.requestPermission();
      if (requested == LocationPermission.denied ||
          requested == LocationPermission.deniedForever) {
        return null;
      }
    }
    if (permission == LocationPermission.deniedForever) {
      return null;
    }

    final position = await Geolocator.getCurrentPosition(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        timeLimit: Duration(seconds: 10),
      ),
    );
    return (latitude: position.latitude, longitude: position.longitude);
  }

  Future<File> compressPhoto(File file) async {
    final bytes = await file.readAsBytes();
    final compressed = await Isolate.run(() {
      final image = img.decodeImage(bytes);
      if (image == null) return bytes;
      final resized = image.width > 1200
          ? img.copyResize(image, width: 1200)
          : image;
      return img.encodeJpg(resized, quality: 75);
    });

    final dir = await getTemporaryDirectory();
    final compressedFile = File(
        '${dir.path}/compressed_${DateTime.now().millisecondsSinceEpoch}.jpg');
    await compressedFile.writeAsBytes(compressed);
    return compressedFile;
  }

  Future<Photo?> uploadPhoto({
    required String interventionId,
    required File file,
    required PhotoType type,
    double? latitude,
    double? longitude,
  }) async {
    final takenAt = DateTime.now();

    if (await _connectivity.isOnline) {
      try {
        final formData = FormData.fromMap({
          'file': await MultipartFile.fromFile(
            file.path,
            filename: file.path.split('/').last,
          ),
          'type': type.value,
          // ignore: use_null_aware_elements
          if (latitude != null) 'latitude': latitude,
          // ignore: use_null_aware_elements
          if (longitude != null) 'longitude': longitude,
          'takenAt': takenAt.toIso8601String(),
        });

        final response = await _authDio.post(
          ApiEndpoints.interventionPhotos(interventionId),
          data: formData,
        );

        if (response.data is Map<String, dynamic>) {
          final data = response.data as Map<String, dynamic>;
          if (data.containsKey('data')) {
            return Photo.fromJson(data['data'] as Map<String, dynamic>);
          }
          return Photo.fromJson(data);
        }
        return null;
      } catch (_) {
        await _enqueuePhoto(
          interventionId: interventionId,
          file: file,
          type: type,
          latitude: latitude,
          longitude: longitude,
          takenAt: takenAt,
        );
        return null;
      }
    }

    await _enqueuePhoto(
      interventionId: interventionId,
      file: file,
      type: type,
      latitude: latitude,
      longitude: longitude,
      takenAt: takenAt,
    );
    return null;
  }

  Future<void> _enqueuePhoto({
    required String interventionId,
    required File file,
    required PhotoType type,
    double? latitude,
    double? longitude,
    required DateTime takenAt,
  }) async {
    final stat = await file.stat();
    await _photoQueueDao.insertOne(PhotoQueueTableCompanion(
      interventionId: Value(interventionId),
      type: Value(type.value),
      filePath: Value(file.path),
      mimeType: const Value('image/jpeg'),
      fileSize: Value(stat.size),
      latitude: Value(latitude),
      longitude: Value(longitude),
      takenAt: Value(takenAt),
    ));
  }

  Future<List<Photo>> getPhotosForIntervention(String interventionId) async {
    if (await _connectivity.isOnline) {
      try {
        final response = await _authDio.get(
          ApiEndpoints.interventionPhotos(interventionId),
        );
        List<dynamic> items;
        final responseData = response.data;
        if (responseData is Map) {
          items = responseData['data'] as List? ?? [];
        } else if (responseData is List) {
          items = responseData;
        } else {
          items = [];
        }
        return items
            .map((json) => Photo.fromJson(json as Map<String, dynamic>))
            .toList();
      } catch (_) {
        return [];
      }
    }
    return [];
  }

  Future<List<Photo>> filterByType(
      List<Photo> photos, PhotoType type) async {
    return photos.where((p) => p.type == type).toList();
  }
}
