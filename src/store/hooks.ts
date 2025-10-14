import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * Redux hooks for sky system
 * 
 * These hooks provide typed access to Redux state and dispatch
 * functions for the sky system components.
 */

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Convenience hooks for common sky state access
export const useSkyState = () => useAppSelector((state) => state.sky);

export const useGlobalTime = () => useAppSelector((state) => state.sky.global);
export const useDayProgress = () => useAppSelector((state) => state.sky.global.dayProgress);
export const useTimeMultiplier = () => useAppSelector((state) => state.sky.global.timeMultiplier);
export const useIsPaused = () => useAppSelector((state) => state.sky.global.isPaused);

export const useSkyColors = () => useAppSelector((state) => state.sky.sky.colors);
export const useCurrentSkyColors = () => useAppSelector((state) => state.sky.sky.colors.current);

export const useModules = () => useAppSelector((state) => state.sky.modules);
export const useEnabledModules = () => useAppSelector((state) => state.sky.modules.enabled);
export const useModuleConfigurations = () => useAppSelector((state) => state.sky.modules.configurations);

export const usePerformance = () => useAppSelector((state) => state.sky.performance);
export const useFrameRate = () => useAppSelector((state) => state.sky.performance.frameRate);
export const useGlobalQualityMode = () => useAppSelector((state) => state.sky.performance.globalQualityMode);

// Computed state hooks
export const useIsDaytime = () => {
  const dayProgress = useDayProgress();
  return dayProgress >= 0.25 && dayProgress <= 0.75;
};

export const useTimeOfDay = () => {
  const dayProgress = useDayProgress();
  if (dayProgress < 0.25) return 'night';
  if (dayProgress < 0.5) return 'morning';
  if (dayProgress < 0.75) return 'afternoon';
  return 'evening';
};

export const usePerformanceStatus = () => {
  const frameRate = useFrameRate();
  const targetFrameRate = useAppSelector((state) => state.sky.performance.targetFrameRate);
  const ratio = frameRate / targetFrameRate;
  
  if (ratio >= 0.95) return 'excellent';
  if (ratio >= 0.8) return 'good';
  if (ratio >= 0.6) return 'fair';
  return 'poor';
};

// Module-specific hooks
export const useModuleState = (moduleType: string) => {
  const isEnabled = useAppSelector((state) => state.sky.modules.enabled[moduleType as keyof typeof state.sky.modules.enabled]);
  const configuration = useAppSelector((state) => state.sky.modules.configurations[moduleType as keyof typeof state.sky.modules.configurations]);
  const qualityMode = useAppSelector((state) => state.sky.performance.moduleQualityModes[moduleType as keyof typeof state.sky.performance.moduleQualityModes]);
  
  return {
    isEnabled,
    configuration,
    qualityMode,
    performanceMode: configuration?.performanceMode || 'medium',
  };
};
