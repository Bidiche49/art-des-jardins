import { useEffect, useCallback } from 'react';
import { useUIStore, TerrainModeSettings } from '@/stores/ui';

interface UseTerrainModeReturn {
  isEnabled: boolean;
  settings: TerrainModeSettings;
  toggle: () => void;
  setSettings: (settings: Partial<TerrainModeSettings>) => void;
  triggerHaptic: () => void;
}

export function useTerrainMode(): UseTerrainModeReturn {
  const { terrainMode, setTerrainMode, toggleTerrainMode } = useUIStore();

  // Apply terrain mode class to document root
  useEffect(() => {
    const root = document.documentElement;

    if (terrainMode.enabled) {
      root.setAttribute('data-terrain', 'true');
    } else {
      root.removeAttribute('data-terrain');
    }

    if (terrainMode.highContrast) {
      root.setAttribute('data-high-contrast', 'true');
    } else {
      root.removeAttribute('data-high-contrast');
    }
  }, [terrainMode.enabled, terrainMode.highContrast]);

  // Auto-detect mobile device and enable terrain mode
  useEffect(() => {
    if (!terrainMode.autoDetect) return;

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.matchMedia('(max-width: 768px)').matches;

    if (isMobile && !terrainMode.enabled) {
      setTerrainMode({ enabled: true });
    }
  }, [terrainMode.autoDetect, terrainMode.enabled, setTerrainMode]);

  // Haptic feedback function
  const triggerHaptic = useCallback(() => {
    if (terrainMode.hapticFeedback && terrainMode.enabled && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, [terrainMode.hapticFeedback, terrainMode.enabled]);

  return {
    isEnabled: terrainMode.enabled,
    settings: terrainMode,
    toggle: toggleTerrainMode,
    setSettings: setTerrainMode,
    triggerHaptic,
  };
}
