import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { SkyModuleType } from '@/types/skyTypes';

/**
 * Redux selectors for sky state
 * 
 * These selectors provide optimized access to sky state data
 * and include memoization for performance optimization.
 */

// Base selectors
export const selectSkyState = (state: RootState) => state.sky;

// Global time selectors
export const selectGlobalTime = createSelector(
  [selectSkyState],
  (sky) => sky.global
);

export const selectCurrentTime = createSelector(
  [selectGlobalTime],
  (global) => global.currentTime
);

export const selectDayProgress = createSelector(
  [selectGlobalTime],
  (global) => global.dayProgress
);

export const selectTimeMultiplier = createSelector(
  [selectGlobalTime],
  (global) => global.timeMultiplier
);

export const selectIsPaused = createSelector(
  [selectGlobalTime],
  (global) => global.isPaused
);

export const selectDayDuration = createSelector(
  [selectGlobalTime],
  (global) => global.dayDuration
);

// Sky color selectors
export const selectSkyColors = createSelector(
  [selectSkyState],
  (sky) => sky.sky.colors
);

export const selectCurrentSkyColors = createSelector(
  [selectSkyColors],
  (colors) => colors.current
);

export const selectDayColors = createSelector(
  [selectSkyColors],
  (colors) => colors.day
);

export const selectNightColors = createSelector(
  [selectSkyColors],
  (colors) => colors.night
);

export const selectBaseColor = createSelector(
  [selectSkyState],
  (sky) => sky.sky.baseColor
);

// Module selectors
export const selectModules = createSelector(
  [selectSkyState],
  (sky) => sky.modules
);

export const selectEnabledModules = createSelector(
  [selectModules],
  (modules) => modules.enabled
);

export const selectModuleConfigurations = createSelector(
  [selectModules],
  (modules) => modules.configurations
);

export const selectModulePriorities = createSelector(
  [selectModules],
  (modules) => modules.priorities
);

// Individual module selectors
export const selectModuleEnabled = (moduleType: SkyModuleType) =>
  createSelector(
    [selectEnabledModules],
    (enabled) => enabled[moduleType]
  );

export const selectModuleConfiguration = (moduleType: SkyModuleType) =>
  createSelector(
    [selectModuleConfigurations],
    (configurations) => configurations[moduleType]
  );

export const selectModulePriority = (moduleType: SkyModuleType) =>
  createSelector(
    [selectModulePriorities],
    (priorities) => priorities[moduleType]
  );

// Active modules selector (enabled modules sorted by priority)
export const selectActiveModules = createSelector(
  [selectEnabledModules, selectModulePriorities],
  (enabled, priorities) => {
    return Object.entries(enabled)
      .filter(([_, isEnabled]) => isEnabled)
      .map(([moduleType, _]) => moduleType as SkyModuleType)
      .sort((a, b) => priorities[b] - priorities[a]); // Sort by priority (highest first)
  }
);

// Performance selectors
export const selectPerformance = createSelector(
  [selectSkyState],
  (sky) => sky.performance
);

export const selectFrameRate = createSelector(
  [selectPerformance],
  (performance) => performance.frameRate
);

export const selectTargetFrameRate = createSelector(
  [selectPerformance],
  (performance) => performance.targetFrameRate
);

export const selectGlobalQualityMode = createSelector(
  [selectPerformance],
  (performance) => performance.globalQualityMode
);

export const selectModuleQualityModes = createSelector(
  [selectPerformance],
  (performance) => performance.moduleQualityModes
);

export const selectAdaptiveQuality = createSelector(
  [selectPerformance],
  (performance) => performance.adaptiveQuality
);

// Individual module quality selector
export const selectModuleQualityMode = (moduleType: SkyModuleType) =>
  createSelector(
    [selectModuleQualityModes],
    (qualityModes) => qualityModes[moduleType]
  );

// Computed selectors
export const selectIsDaytime = createSelector(
  [selectDayProgress],
  (dayProgress) => {
    // Consider daytime as progress between 0.25 (dawn) and 0.75 (dusk)
    return dayProgress >= 0.25 && dayProgress <= 0.75;
  }
);

export const selectIsNighttime = createSelector(
  [selectDayProgress],
  (dayProgress) => {
    // Consider nighttime as progress between 0.75 (dusk) and 0.25 (dawn)
    return dayProgress < 0.25 || dayProgress > 0.75;
  }
);

export const selectTimeOfDay = createSelector(
  [selectDayProgress],
  (dayProgress) => {
    if (dayProgress < 0.25) return 'night';
    if (dayProgress < 0.5) return 'morning';
    if (dayProgress < 0.75) return 'afternoon';
    return 'evening';
  }
);

export const selectPerformanceStatus = createSelector(
  [selectFrameRate, selectTargetFrameRate],
  (frameRate, targetFrameRate) => {
    const ratio = frameRate / targetFrameRate;
    if (ratio >= 0.95) return 'excellent';
    if (ratio >= 0.8) return 'good';
    if (ratio >= 0.6) return 'fair';
    return 'poor';
  }
);

// Module-specific computed selectors
export const selectModulePerformanceConfig = (moduleType: SkyModuleType) =>
  createSelector(
    [selectModuleEnabled(moduleType), selectModuleConfiguration(moduleType), selectModuleQualityMode(moduleType)],
    (isEnabled, configuration, qualityMode) => ({
      isEnabled,
      configuration,
      qualityMode,
      performanceMode: configuration.performanceMode,
    })
  );

// Sky state for P5.js integration
export const selectSkyStateForP5 = createSelector(
  [selectCurrentTime, selectDayProgress, selectCurrentSkyColors, selectEnabledModules, selectGlobalQualityMode],
  (currentTime, dayProgress, skyColors, enabledModules, performanceMode) => ({
    currentTime,
    dayProgress,
    skyColors,
    performanceMode,
    activeModules: enabledModules,
  })
);

// All module states for rendering
export const selectModuleStatesForRendering = createSelector(
  [selectActiveModules, selectModuleConfigurations, selectModuleQualityModes],
  (activeModules, configurations, qualityModes) => {
    return activeModules.map(moduleType => ({
      type: moduleType,
      configuration: configurations[moduleType],
      qualityMode: qualityModes[moduleType],
    }));
  }
);
