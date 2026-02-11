// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'search_result.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SearchResult _$SearchResultFromJson(Map<String, dynamic> json) =>
    _SearchResult(
      entity: json['entity'] as String,
      entityId: json['entityId'] as String,
      title: json['title'] as String,
      subtitle: json['subtitle'] as String?,
      matchField: json['matchField'] as String?,
    );

Map<String, dynamic> _$SearchResultToJson(_SearchResult instance) =>
    <String, dynamic>{
      'entity': instance.entity,
      'entityId': instance.entityId,
      'title': instance.title,
      'subtitle': instance.subtitle,
      'matchField': instance.matchField,
    };
