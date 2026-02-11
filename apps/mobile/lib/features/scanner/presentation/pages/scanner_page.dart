import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

import '../../../../core/router/route_names.dart';
import '../../domain/scan_history_service.dart';
import '../providers/scanner_providers.dart';
import '../widgets/scanner_overlay.dart';

class ScannerPage extends ConsumerStatefulWidget {
  const ScannerPage({super.key});

  @override
  ConsumerState<ScannerPage> createState() => _ScannerPageState();
}

class _ScannerPageState extends ConsumerState<ScannerPage> {
  MobileScannerController? _cameraController;
  bool _hasNavigated = false;

  @override
  void initState() {
    super.initState();
    _cameraController = MobileScannerController(
      facing: CameraFacing.back,
      detectionSpeed: DetectionSpeed.normal,
    );
  }

  @override
  void dispose() {
    _cameraController?.dispose();
    super.dispose();
  }

  void _onDetect(BarcodeCapture capture) {
    if (_hasNavigated) return;

    final barcode = capture.barcodes.firstOrNull;
    if (barcode == null || barcode.rawValue == null) return;

    _hasNavigated = true;
    _cameraController?.stop();

    ref
        .read(scannerNotifierProvider.notifier)
        .processScan(barcode.rawValue!)
        .then((result) {
      if (!mounted) return;
      if (result != null) {
        _navigateToEntity(result.entityType, result.entityId);
      } else {
        // Reset to allow retry
        _hasNavigated = false;
        _cameraController?.start();
      }
    });
  }

  void _navigateToEntity(String entityType, String entityId) {
    switch (entityType) {
      case 'chantier':
        context.pushNamed(RouteNames.chantierDetail,
            pathParameters: {'id': entityId});
      case 'client':
        context.pushNamed(RouteNames.clientDetail,
            pathParameters: {'id': entityId});
    }
  }

  void _onHistoryTap(ScanHistoryEntry entry) {
    _navigateToEntity(entry.entityType, entry.entityId);
  }

  @override
  Widget build(BuildContext context) {
    final scannerState = ref.watch(scannerNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Scanner QR'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: Column(
        children: [
          // Camera area
          Expanded(
            flex: 3,
            child: Stack(
              children: [
                if (_cameraController != null)
                  MobileScanner(
                    controller: _cameraController!,
                    onDetect: _onDetect,
                  ),
                const ScannerOverlay(),
                if (scannerState.isProcessing)
                  const Center(
                    child: CircularProgressIndicator(color: Colors.white),
                  ),
                if (scannerState.error != null)
                  Positioned(
                    bottom: 16,
                    left: 16,
                    right: 16,
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.errorContainer,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        scannerState.error!,
                        style: TextStyle(
                          color:
                              Theme.of(context).colorScheme.onErrorContainer,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
              ],
            ),
          ),
          // History section
          Expanded(
            flex: 2,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
                  child: Text(
                    'Derniers scans',
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                  ),
                ),
                Expanded(
                  child: scannerState.history.isEmpty
                      ? Center(
                          child: Text(
                            'Aucun scan recent',
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.copyWith(
                                  color: Theme.of(context)
                                      .colorScheme
                                      .onSurfaceVariant,
                                ),
                          ),
                        )
                      : ListView.builder(
                          padding: EdgeInsets.zero,
                          itemCount: scannerState.history.length,
                          itemBuilder: (context, index) {
                            final entry = scannerState.history[index];
                            return ListTile(
                              leading: Icon(
                                entry.entityType == 'chantier'
                                    ? Icons.construction
                                    : Icons.person,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                              title: Text(entry.label),
                              subtitle: Text(
                                _formatDate(entry.scannedAt),
                                style:
                                    Theme.of(context).textTheme.bodySmall,
                              ),
                              trailing: const Icon(Icons.chevron_right,
                                  size: 20),
                              onTap: () => _onHistoryTap(entry),
                            );
                          },
                        ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    if (diff.inMinutes < 1) return "A l'instant";
    if (diff.inMinutes < 60) return 'Il y a ${diff.inMinutes} min';
    if (diff.inHours < 24) return 'Il y a ${diff.inHours}h';
    return '${date.day}/${date.month}/${date.year}';
  }
}
