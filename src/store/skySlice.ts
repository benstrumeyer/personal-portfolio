import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SkyModuleType } from '@/types/skyTypes';

/**
 * Redux slice for managing sky state
 * 
 * This slice manages:
 * - Global time progression and day/night cycles
 * - Module configurations and enabled states
 * - Performance monitoring and quality settings
 * - Sky color palettes and atmospheric effects
 */

// Initial state structure
interface SkyState {
  global: {
    currentTime: number;
    dayDuration: number; // Duration of a full day cycle in milliseconds
    timeMultiplier: number; // Speed multiplier for time progression
    dayProgress: number; // Progress through day cycle (0-1)
    isPaused: boolean;
    lastUpdateTime: number;
  };
  sky: {
    colors: {
      day: {
        top: string;
        middle: string;
        bottom: string;
        horizon: string;
      };
      night: {
        top: string;
        middle: string;
        bottom: string;
        horizon: string;
      };
      current: {
        top: string;
        middle: string;
        bottom: string;
        horizon: string;
      };
    };
    baseColor: string;
    transitionSpeed: number; // Speed of color transitions
  };
  modules: {
    enabled: Record<SkyModuleType, boolean>;
    configurations: Record<SkyModuleType, {
      performanceMode: 'high' | 'medium' | 'low';
      customSettings: Record<string, any>;
    }>;
    priorities: Record<SkyModuleType, number>;
  };
  performance: {
    frameRate: number;
    targetFrameRate: number;
    globalQualityMode: 'high' | 'medium' | 'low';
    moduleQualityModes: Record<SkyModuleType, 'high' | 'medium' | 'low'>;
    adaptiveQuality: boolean;
    lastFrameTime: number;
    frameCount: number;
  };
}

// Initial state
const initialState: SkyState = {
  global: {
    currentTime: Date.now(),
    dayDuration: 30000, // 30 seconds for testing (will be 24 hours in production)
    timeMultiplier: 1.0,
    dayProgress: 0.25, // Start at 25% through day (morning)
    isPaused: false,
    lastUpdateTime: Date.now(),
  },
  sky: {
    colors: {
      day: {
        top: '#4A90E2', // Bright sky blue
        middle: '#87CEEB', // Sky blue
        bottom: '#B0E0E6', // Powder blue
        horizon: '#FFB347', // Warm peach
      },
      night: {
        top: '#0F0F23', // Deep space dark
        middle: '#1A1A3E', // Dark navy
        bottom: '#2D1B69', // Deep purple
        horizon: '#FF6B35', // Warm orange (for stars/sunset)
      },
      current: {
        top: '#4A90E2',
        middle: '#87CEEB',
        bottom: '#B0E0E6',
        horizon: '#FFB347',
      },
    },
    baseColor: '#4A90E2',
    transitionSpeed: 0.02, // Smooth transitions
  },
  modules: {
    enabled: {
      celestial: true,
      clouds: false,
      rain: false,
      snow: false,
      fog: false,
    },
    configurations: {
      celestial: {
        performanceMode: 'high',
        customSettings: {
          sunGlowIntensity: 0.8,
          moonGlowIntensity: 0.6,
          atmosphericEffects: true,
        },
      },
      clouds: {
        performanceMode: 'medium',
        customSettings: {
          cloudCount: 15,
          cloudSpeed: 1.0,
          cloudOpacity: 0.7,
        },
      },
      rain: {
        performanceMode: 'low',
        customSettings: {
          rainIntensity: 0.5,
          rainSpeed: 2.0,
          rainOpacity: 0.8,
        },
      },
      snow: {
        performanceMode: 'low',
        customSettings: {
          snowIntensity: 0.3,
          snowSpeed: 0.5,
          snowOpacity: 0.9,
        },
      },
      fog: {
        performanceMode: 'medium',
        customSettings: {
          fogDensity: 0.4,
          fogSpeed: 0.3,
          fogOpacity: 0.6,
        },
      },
    },
    priorities: {
      celestial: 100,
      clouds: 80,
      rain: 60,
      snow: 40,
      fog: 20,
    },
  },
  performance: {
    frameRate: 60,
    targetFrameRate: 60,
    globalQualityMode: 'high',
    moduleQualityModes: {
      celestial: 'high',
      clouds: 'medium',
      rain: 'low',
      snow: 'low',
      fog: 'medium',
    },
    adaptiveQuality: true,
    lastFrameTime: Date.now(),
    frameCount: 0,
  },
};

// Sky slice
const skySlice = createSlice({
  name: 'sky',
  initialState,
  reducers: {
    // Global time management
    updateTime: (state, action: PayloadAction<number>) => {
      const currentTime = action.payload;
      const deltaTime = currentTime - state.global.lastUpdateTime;
      
      if (!state.global.isPaused) {
        // Update day progress based on time multiplier
        const timeIncrement = (deltaTime * state.global.timeMultiplier) / state.global.dayDuration;
        state.global.dayProgress = (state.global.dayProgress + timeIncrement) % 1;
        state.global.currentTime = currentTime;
      }
      
      state.global.lastUpdateTime = currentTime;
    },
    
    setTimeMultiplier: (state, action: PayloadAction<number>) => {
      state.global.timeMultiplier = Math.max(0, Math.min(action.payload, 10)); // Clamp between 0 and 10
    },
    
    setDayDuration: (state, action: PayloadAction<number>) => {
      state.global.dayDuration = Math.max(1000, action.payload); // Minimum 1 second
    },
    
    togglePause: (state) => {
      state.global.isPaused = !state.global.isPaused;
    },
    
    setDayProgress: (state, action: PayloadAction<number>) => {
      state.global.dayProgress = Math.max(0, Math.min(1, action.payload)); // Clamp between 0 and 1
    },
    
    // Sky color management
    updateSkyColors: (state) => {
      const { dayProgress } = state.global;
      const { day, night, current } = state.sky.colors;
      
      // Calculate transition factor based on day progress
      // 0.0 = midnight, 0.25 = dawn, 0.5 = noon, 0.75 = dusk, 1.0 = midnight
      let transitionFactor = 0;
      
      if (dayProgress <= 0.25) {
        // Night to dawn (0.0 to 0.25)
        transitionFactor = dayProgress * 4;
      } else if (dayProgress <= 0.5) {
        // Dawn to noon (0.25 to 0.5)
        transitionFactor = 1;
      } else if (dayProgress <= 0.75) {
        // Noon to dusk (0.5 to 0.75)
        transitionFactor = 1;
      } else {
        // Dusk to night (0.75 to 1.0)
        transitionFactor = 1 - ((dayProgress - 0.75) * 4);
      }
      
      // Smooth interpolation between night and day colors
      const smoothTransition = Math.sin(transitionFactor * Math.PI / 2);
      
      // Interpolate colors
      current.top = interpolateColor(night.top, day.top, smoothTransition);
      current.middle = interpolateColor(night.middle, day.middle, smoothTransition);
      current.bottom = interpolateColor(night.bottom, day.bottom, smoothTransition);
      current.horizon = interpolateColor(night.horizon, day.horizon, smoothTransition);
      
      state.sky.baseColor = current.top;
    },
    
    // Module management
    toggleModule: (state, action: PayloadAction<SkyModuleType>) => {
      const moduleType = action.payload;
      state.modules.enabled[moduleType] = !state.modules.enabled[moduleType];
    },
    
    setModuleEnabled: (state, action: PayloadAction<{ module: SkyModuleType; enabled: boolean }>) => {
      const { module, enabled } = action.payload;
      state.modules.enabled[module] = enabled;
    },
    
    updateModuleConfiguration: (state, action: PayloadAction<{
      module: SkyModuleType;
      configuration: Partial<SkyState['modules']['configurations'][SkyModuleType]>;
    }>) => {
      const { module, configuration } = action.payload;
      state.modules.configurations[module] = {
        ...state.modules.configurations[module],
        ...configuration,
      };
    },
    
    setModulePriority: (state, action: PayloadAction<{ module: SkyModuleType; priority: number }>) => {
      const { module, priority } = action.payload;
      state.modules.priorities[module] = priority;
    },
    
    // Performance management
    updateFrameRate: (state, action: PayloadAction<number>) => {
      const currentTime = action.payload;
      const deltaTime = currentTime - state.performance.lastFrameTime;
      
      state.performance.frameRate = 1000 / deltaTime; // Calculate FPS
      state.performance.lastFrameTime = currentTime;
      state.performance.frameCount++;
      
      // Adaptive quality adjustment
      if (state.performance.adaptiveQuality) {
        if (state.performance.frameRate < state.performance.targetFrameRate * 0.8) {
          // Frame rate is below 80% of target, reduce quality
          if (state.performance.globalQualityMode === 'high') {
            state.performance.globalQualityMode = 'medium';
          } else if (state.performance.globalQualityMode === 'medium') {
            state.performance.globalQualityMode = 'low';
          }
        } else if (state.performance.frameRate > state.performance.targetFrameRate * 0.95) {
          // Frame rate is above 95% of target, can increase quality
          if (state.performance.globalQualityMode === 'low') {
            state.performance.globalQualityMode = 'medium';
          } else if (state.performance.globalQualityMode === 'medium') {
            state.performance.globalQualityMode = 'high';
          }
        }
      }
    },
    
    setGlobalQualityMode: (state, action: PayloadAction<'high' | 'medium' | 'low'>) => {
      state.performance.globalQualityMode = action.payload;
    },
    
    setModuleQualityMode: (state, action: PayloadAction<{
      module: SkyModuleType;
      quality: 'high' | 'medium' | 'low';
    }>) => {
      const { module, quality } = action.payload;
      state.performance.moduleQualityModes[module] = quality;
    },
    
    toggleAdaptiveQuality: (state) => {
      state.performance.adaptiveQuality = !state.performance.adaptiveQuality;
    },
    
    setTargetFrameRate: (state, action: PayloadAction<number>) => {
      state.performance.targetFrameRate = Math.max(30, Math.min(120, action.payload)); // Clamp between 30 and 120 FPS
    },
  },
});

// Helper function to interpolate between two hex colors
function interpolateColor(color1: string, color2: string, factor: number): string {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);
  
  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Export actions
export const {
  updateTime,
  setTimeMultiplier,
  setDayDuration,
  togglePause,
  setDayProgress,
  updateSkyColors,
  toggleModule,
  setModuleEnabled,
  updateModuleConfiguration,
  setModulePriority,
  updateFrameRate,
  setGlobalQualityMode,
  setModuleQualityMode,
  toggleAdaptiveQuality,
  setTargetFrameRate,
} = skySlice.actions;

// Export reducer
export default skySlice.reducer;

// Export state type
export type { SkyState };
