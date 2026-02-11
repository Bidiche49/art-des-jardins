import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:drift/drift.dart';

import '../../../core/network/api_endpoints.dart';
import '../../../core/network/connectivity_service.dart';
import '../../../data/local/database/app_database.dart';
import '../../../data/local/database/daos/clients_dao.dart';
import '../../../domain/enums/client_type.dart';
import '../../../domain/models/client.dart';
import '../../../services/sync/sync_service.dart';
import '../domain/clients_repository.dart';

class ClientsRepositoryImpl implements ClientsRepository {
  ClientsRepositoryImpl({
    required ClientsDao clientsDao,
    required Dio authDio,
    required ConnectivityService connectivityService,
    required SyncService syncService,
  })  : _clientsDao = clientsDao,
        _authDio = authDio,
        _connectivity = connectivityService,
        _syncService = syncService;

  final ClientsDao _clientsDao;
  final Dio _authDio;
  final ConnectivityService _connectivity;
  final SyncService _syncService;

  @override
  Future<List<Client>> getAll() async {
    if (await _connectivity.isOnline) {
      try {
        final response = await _authDio.get(ApiEndpoints.clients);
        final clients = _parseClientsList(response.data);
        await _cacheAll(clients);
        return clients;
      } catch (_) {
        return _getAllFromCache();
      }
    }
    return _getAllFromCache();
  }

  @override
  Future<Client> getById(String id) async {
    if (await _connectivity.isOnline) {
      try {
        final response = await _authDio.get(ApiEndpoints.client(id));
        final client = _parseClient(response.data);
        await _cacheClient(client);
        return client;
      } catch (_) {
        return _getByIdFromCache(id);
      }
    }
    return _getByIdFromCache(id);
  }

  @override
  Future<Client> create(Client client) async {
    final now = DateTime.now();
    final newClient = client.copyWith(
      id: client.id.isEmpty ? 'temp-${now.millisecondsSinceEpoch}' : client.id,
      createdAt: now,
      updatedAt: now,
    );

    if (await _connectivity.isOnline) {
      try {
        final response = await _authDio.post(
          ApiEndpoints.clients,
          data: newClient.toJson()..remove('id'),
        );
        final created = _parseClient(response.data);
        await _cacheClient(created);
        return created;
      } catch (_) {
        return _createOffline(newClient);
      }
    }
    return _createOffline(newClient);
  }

  @override
  Future<Client> update(Client client) async {
    final updated = client.copyWith(updatedAt: DateTime.now());

    if (await _connectivity.isOnline) {
      try {
        final response = await _authDio.put(
          ApiEndpoints.client(client.id),
          data: updated.toJson(),
        );
        final result = _parseClient(response.data);
        await _cacheClient(result);
        return result;
      } catch (_) {
        return _updateOffline(updated);
      }
    }
    return _updateOffline(updated);
  }

  @override
  Future<void> delete(String id) async {
    if (await _connectivity.isOnline) {
      try {
        await _authDio.delete(ApiEndpoints.client(id));
        await _clientsDao.deleteById(id);
        return;
      } catch (_) {
        await _deleteOffline(id);
        return;
      }
    }
    await _deleteOffline(id);
  }

  @override
  Future<List<Client>> searchByName(String query) async {
    final all = await getAll();
    final q = query.toLowerCase();
    return all
        .where((c) =>
            c.nom.toLowerCase().contains(q) ||
            c.email.toLowerCase().contains(q) ||
            (c.prenom?.toLowerCase().contains(q) ?? false) ||
            (c.raisonSociale?.toLowerCase().contains(q) ?? false))
        .toList();
  }

  @override
  Future<List<Client>> getByType(ClientType type) async {
    final cached = await _clientsDao.getByType(type.value);
    return cached.map(_fromData).toList();
  }

  // ============== Private helpers ==============

  Future<List<Client>> _getAllFromCache() async {
    final cached = await _clientsDao.getAll();
    return cached.map(_fromData).toList();
  }

  Future<Client> _getByIdFromCache(String id) async {
    final data = await _clientsDao.getById(id);
    if (data == null) throw Exception('Client $id not found in cache');
    return _fromData(data);
  }

  Future<void> _cacheAll(List<Client> clients) async {
    for (final client in clients) {
      await _cacheClient(client);
    }
  }

  Future<void> _cacheClient(Client client) async {
    final companion = _toCompanion(client, syncedAt: DateTime.now());
    final existing = await _clientsDao.getById(client.id);
    if (existing != null) {
      await _clientsDao.updateOne(companion);
    } else {
      await _clientsDao.insertOne(companion);
    }
  }

  Future<Client> _createOffline(Client client) async {
    await _clientsDao.insertOne(_toCompanion(client));
    await _syncService.addToQueue(
      operation: 'create',
      entity: 'client',
      data: client.toJson(),
      entityId: client.id,
    );
    return client;
  }

  Future<Client> _updateOffline(Client client) async {
    await _clientsDao.updateOne(_toCompanion(client));
    await _syncService.addToQueue(
      operation: 'update',
      entity: 'client',
      data: client.toJson(),
      entityId: client.id,
    );
    return client;
  }

  Future<void> _deleteOffline(String id) async {
    await _clientsDao.deleteById(id);
    await _syncService.addToQueue(
      operation: 'delete',
      entity: 'client',
      data: {},
      entityId: id,
    );
  }

  // ============== Mappers ==============

  List<Client> _parseClientsList(dynamic responseData) {
    List<dynamic> items;
    if (responseData is Map) {
      items = responseData['data'] as List? ?? [];
    } else if (responseData is List) {
      items = responseData;
    } else {
      return [];
    }
    return items
        .map((json) => Client.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Client _parseClient(dynamic responseData) {
    if (responseData is Map<String, dynamic>) {
      if (responseData.containsKey('data')) {
        return Client.fromJson(responseData['data'] as Map<String, dynamic>);
      }
      return Client.fromJson(responseData);
    }
    throw Exception('Invalid client response');
  }

  Client _fromData(ClientsTableData data) {
    return Client(
      id: data.id,
      type: ClientType.values.firstWhere(
        (t) => t.value == data.type,
        orElse: () => ClientType.particulier,
      ),
      nom: data.nom,
      prenom: data.prenom,
      raisonSociale: data.raisonSociale,
      email: data.email,
      telephone: data.telephone,
      telephoneSecondaire: data.telephoneSecondaire,
      adresse: data.adresse,
      codePostal: data.codePostal,
      ville: data.ville,
      notes: data.notes,
      tags: _parseTags(data.tags),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    );
  }

  List<String> _parseTags(String tags) {
    try {
      return (jsonDecode(tags) as List).cast<String>();
    } catch (_) {
      return [];
    }
  }

  ClientsTableCompanion _toCompanion(Client client, {DateTime? syncedAt}) {
    return ClientsTableCompanion(
      id: Value(client.id),
      type: Value(client.type.value),
      nom: Value(client.nom),
      prenom: Value(client.prenom),
      raisonSociale: Value(client.raisonSociale),
      email: Value(client.email),
      telephone: Value(client.telephone),
      telephoneSecondaire: Value(client.telephoneSecondaire),
      adresse: Value(client.adresse),
      codePostal: Value(client.codePostal),
      ville: Value(client.ville),
      notes: Value(client.notes),
      tags: Value(jsonEncode(client.tags)),
      createdAt: Value(client.createdAt),
      updatedAt: Value(client.updatedAt),
      syncedAt: Value(syncedAt),
    );
  }
}
