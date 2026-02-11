import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/core/network/connectivity_service.dart';
import 'package:art_et_jardin/data/local/database/app_database.dart';
import 'package:art_et_jardin/data/local/database/daos/photo_queue_dao.dart';
import 'package:art_et_jardin/domain/enums/photo_type.dart';
import 'package:art_et_jardin/domain/models/photo.dart';
import 'package:art_et_jardin/services/photo/photo_service.dart';
import 'package:art_et_jardin/services/photo/photo_queue_service.dart';
import 'package:image_picker/image_picker.dart';

class MockDio extends Mock implements Dio {}

class MockConnectivityService extends Mock implements ConnectivityService {}

class MockPhotoQueueDao extends Mock implements PhotoQueueDao {}

class MockImagePicker extends Mock implements ImagePicker {}

Photo _testPhoto({
  String id = 'p1',
  String interventionId = 'i1',
  PhotoType type = PhotoType.before,
}) =>
    Photo(
      id: id,
      interventionId: interventionId,
      type: type,
      filename: 'photo.jpg',
      s3Key: 'photos/photo.jpg',
      mimeType: 'image/jpeg',
      size: 1024,
      width: 800,
      height: 600,
      takenAt: DateTime(2026, 2, 10, 10, 0),
      uploadedAt: DateTime(2026, 2, 10, 10, 5),
      uploadedBy: 'emp1',
    );

void main() {
  late MockDio mockDio;
  late MockConnectivityService mockConnectivity;
  late MockPhotoQueueDao mockPhotoQueueDao;
  late MockImagePicker mockImagePicker;
  late PhotoService photoService;

  setUp(() {
    mockDio = MockDio();
    mockConnectivity = MockConnectivityService();
    mockPhotoQueueDao = MockPhotoQueueDao();
    mockImagePicker = MockImagePicker();

    photoService = PhotoService(
      authDio: mockDio,
      connectivityService: mockConnectivity,
      photoQueueDao: mockPhotoQueueDao,
      imagePicker: mockImagePicker,
    );

    when(() => mockPhotoQueueDao.insertOne(any()))
        .thenAnswer((_) async => 1);
  });

  setUpAll(() {
    registerFallbackValue(const PhotoQueueTableCompanion());
    registerFallbackValue(ImageSource.camera);
    registerFallbackValue(PhotoQueueTableData(
      id: 0,
      interventionId: '',
      type: '',
      filePath: '',
      mimeType: '',
      fileSize: 0,
      takenAt: DateTime(2026, 1, 1),
      attempts: 0,
      status: 'pending',
    ));
  });

  group('PhotoService', () {
    test('capturePhoto retourne null si utilisateur annule', () async {
      when(() => mockImagePicker.pickImage(
            source: any(named: 'source'),
            maxWidth: any(named: 'maxWidth'),
            maxHeight: any(named: 'maxHeight'),
            imageQuality: any(named: 'imageQuality'),
          )).thenAnswer((_) async => null);

      final result = await photoService.capturePhoto();

      expect(result, isNull);
    });

    test('uploadPhoto online -> POST multipart OK', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                data: _testPhoto().toJson(),
                statusCode: 201,
                requestOptions: RequestOptions(),
              ));

      // Create a temp file for testing
      final tmpDir = Directory.systemTemp.createTempSync();
      final tmpFile = File('${tmpDir.path}/test_photo.jpg');
      tmpFile.writeAsBytesSync([0xFF, 0xD8, 0xFF]); // JPEG header

      final result = await photoService.uploadPhoto(
        interventionId: 'i1',
        file: tmpFile,
        type: PhotoType.before,
        latitude: 47.47,
        longitude: -0.55,
      );

      expect(result, isNotNull);
      expect(result!.id, 'p1');
      verify(() => mockDio.post(
            '/interventions/i1/photos',
            data: any(named: 'data'),
          )).called(1);

      // Cleanup
      tmpDir.deleteSync(recursive: true);
    });

    test('uploadPhoto offline -> enqueue dans photo_queue', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);

      final tmpDir = Directory.systemTemp.createTempSync();
      final tmpFile = File('${tmpDir.path}/test_photo.jpg');
      tmpFile.writeAsBytesSync([0xFF, 0xD8, 0xFF]);

      final result = await photoService.uploadPhoto(
        interventionId: 'i1',
        file: tmpFile,
        type: PhotoType.during,
      );

      expect(result, isNull);
      verify(() => mockPhotoQueueDao.insertOne(any())).called(1);

      tmpDir.deleteSync(recursive: true);
    });

    test('uploadPhoto online erreur -> enqueue fallback', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenThrow(DioException(requestOptions: RequestOptions()));

      final tmpDir = Directory.systemTemp.createTempSync();
      final tmpFile = File('${tmpDir.path}/test_photo.jpg');
      tmpFile.writeAsBytesSync([0xFF, 0xD8, 0xFF]);

      final result = await photoService.uploadPhoto(
        interventionId: 'i1',
        file: tmpFile,
        type: PhotoType.after,
      );

      expect(result, isNull);
      verify(() => mockPhotoQueueDao.insertOne(any())).called(1);

      tmpDir.deleteSync(recursive: true);
    });

    test('getPhotosForIntervention retourne les photos', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get(any())).thenAnswer((_) async => Response(
            data: [_testPhoto().toJson(), _testPhoto(id: 'p2').toJson()],
            statusCode: 200,
            requestOptions: RequestOptions(),
          ));

      final result =
          await photoService.getPhotosForIntervention('i1');

      expect(result, hasLength(2));
    });

    test('getPhotosForIntervention offline -> vide', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);

      final result =
          await photoService.getPhotosForIntervention('i1');

      expect(result, isEmpty);
    });

    test('filterByType filtre correctement', () async {
      final photos = [
        _testPhoto(id: 'p1', type: PhotoType.before),
        _testPhoto(id: 'p2', type: PhotoType.during),
        _testPhoto(id: 'p3', type: PhotoType.after),
        _testPhoto(id: 'p4', type: PhotoType.before),
      ];

      final result =
          await photoService.filterByType(photos, PhotoType.before);

      expect(result, hasLength(2));
      expect(result.every((p) => p.type == PhotoType.before), isTrue);
    });

    test('filterByType during filtre correctement', () async {
      final photos = [
        _testPhoto(id: 'p1', type: PhotoType.before),
        _testPhoto(id: 'p2', type: PhotoType.during),
      ];

      final result =
          await photoService.filterByType(photos, PhotoType.during);

      expect(result, hasLength(1));
      expect(result.first.id, 'p2');
    });

    test('Metadata photo : type, lat, lng, takenAt correctes', () {
      final photo = _testPhoto(type: PhotoType.after);

      expect(photo.type, PhotoType.after);
      expect(photo.type.value, 'AFTER');
      expect(photo.type.label, 'Après');
      expect(photo.takenAt, DateTime(2026, 2, 10, 10, 0));
    });

    test('Transformation date+heure -> ISO datetime', () {
      final dt = DateTime(2026, 2, 10, 14, 30);
      final iso = dt.toIso8601String();

      expect(iso, contains('2026-02-10'));
      expect(iso, contains('14:30'));
    });
  });

  group('PhotoQueueService', () {
    late PhotoQueueService queueService;

    setUp(() {
      queueService = PhotoQueueService(
        authDio: mockDio,
        connectivityService: mockConnectivity,
        photoQueueDao: mockPhotoQueueDao,
      );
    });

    test('processQueue offline -> ne traite rien', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);

      await queueService.processQueue();

      verifyNever(() => mockPhotoQueueDao.getPending());
    });

    test('getPendingCount retourne le bon nombre', () async {
      when(() => mockPhotoQueueDao.getPending()).thenAnswer((_) async => [
            PhotoQueueTableData(
              id: 1,
              interventionId: 'i1',
              type: 'BEFORE',
              filePath: '/tmp/photo.jpg',
              mimeType: 'image/jpeg',
              fileSize: 1024,
              takenAt: DateTime(2026, 2, 10),
              attempts: 0,
              status: 'pending',
            ),
            PhotoQueueTableData(
              id: 2,
              interventionId: 'i1',
              type: 'AFTER',
              filePath: '/tmp/photo2.jpg',
              mimeType: 'image/jpeg',
              fileSize: 2048,
              takenAt: DateTime(2026, 2, 10),
              attempts: 0,
              status: 'pending',
            ),
          ]);

      final count = await queueService.getPendingCount();

      expect(count, 2);
    });

    test('retryFailed reset les items failed', () async {
      when(() => mockPhotoQueueDao.getAll()).thenAnswer((_) async => [
            PhotoQueueTableData(
              id: 1,
              interventionId: 'i1',
              type: 'BEFORE',
              filePath: '/tmp/photo.jpg',
              mimeType: 'image/jpeg',
              fileSize: 1024,
              takenAt: DateTime(2026, 2, 10),
              attempts: 3,
              status: 'failed',
              lastError: 'Max retries reached',
            ),
          ]);
      when(() => mockPhotoQueueDao.updateOne(any()))
          .thenAnswer((_) async => true);
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);

      await queueService.retryFailed();

      verify(() => mockPhotoQueueDao.updateOne(any())).called(1);
    });

    test('processQueue supprime fichier local apres upload', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);

      final tmpDir = Directory.systemTemp.createTempSync();
      final tmpFile = File('${tmpDir.path}/queue_photo.jpg');
      tmpFile.writeAsBytesSync([0xFF, 0xD8, 0xFF]);

      when(() => mockPhotoQueueDao.getPending()).thenAnswer((_) async => [
            PhotoQueueTableData(
              id: 1,
              interventionId: 'i1',
              type: 'BEFORE',
              filePath: tmpFile.path,
              mimeType: 'image/jpeg',
              fileSize: 3,
              takenAt: DateTime(2026, 2, 10),
              attempts: 0,
              status: 'pending',
            ),
          ]);
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                statusCode: 201,
                requestOptions: RequestOptions(),
              ));
      when(() => mockPhotoQueueDao.deleteById(any()))
          .thenAnswer((_) async => 1);

      await queueService.processQueue();

      verify(() => mockPhotoQueueDao.deleteById(1)).called(1);
      expect(tmpFile.existsSync(), isFalse);

      tmpDir.deleteSync(recursive: true);
    });
  });
}
