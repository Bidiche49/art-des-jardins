import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../../../../domain/enums/photo_type.dart';

class PhotoGallery extends StatefulWidget {
  const PhotoGallery({
    super.key,
    required this.photoUrls,
    this.photoTypes,
  });

  final List<String> photoUrls;
  final Map<String, PhotoType>? photoTypes;

  @override
  State<PhotoGallery> createState() => _PhotoGalleryState();
}

class _PhotoGalleryState extends State<PhotoGallery> {
  PhotoType? _filterType;

  List<String> get _filteredPhotos {
    if (_filterType == null || widget.photoTypes == null) {
      return widget.photoUrls;
    }
    return widget.photoUrls
        .where((url) => widget.photoTypes![url] == _filterType)
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Filter chips
        if (widget.photoTypes != null && widget.photoTypes!.isNotEmpty)
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                FilterChip(
                  label: const Text('Toutes'),
                  selected: _filterType == null,
                  onSelected: (_) => setState(() => _filterType = null),
                ),
                const SizedBox(width: 8),
                for (final type in PhotoType.values) ...[
                  FilterChip(
                    label: Text(type.label),
                    selected: _filterType == type,
                    onSelected: (_) => setState(() =>
                        _filterType = _filterType == type ? null : type),
                  ),
                  const SizedBox(width: 8),
                ],
              ],
            ),
          ),
        const SizedBox(height: 8),

        // Grid
        if (_filteredPhotos.isEmpty)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 8),
            child: Text('Aucune photo'),
          )
        else
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 4,
              mainAxisSpacing: 4,
            ),
            itemCount: _filteredPhotos.length,
            itemBuilder: (context, index) {
              final url = _filteredPhotos[index];
              return ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: CachedNetworkImage(
                  imageUrl: url,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(
                    color: theme.colorScheme.surfaceContainerHighest,
                    child: const Center(
                      child: SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      ),
                    ),
                  ),
                  errorWidget: (context, url, error) => Container(
                    color: theme.colorScheme.surfaceContainerHighest,
                    child: const Icon(Icons.broken_image),
                  ),
                ),
              );
            },
          ),
      ],
    );
  }
}
