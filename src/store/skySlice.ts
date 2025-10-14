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
      dawn: {
        top: string;
        middle: string;
        bottom: string;
        horizon: string;
      };
      day: {
        top: string;
        middle: string;
        bottom: string;
        horizon: string;
      };
      dusk: {
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
    dayDuration: 360000, // 6 minutes for testing (half speed)
    timeMultiplier: 1.0,
    dayProgress: 0.083, // Start at ~1 o'clock position (1/12th through day)
    isPaused: false,
    lastUpdateTime: Date.now(),
  },
  sky: {
    colors: {
      dawn: {
        top: '#1A2A4A', // Deep blue dawn
        middle: '#2A3A5A', // Medium blue dawn
        bottom: '#3A4A6A', // Light blue dawn
        horizon: '#4A5A7A', // Horizon blue dawn
      },
      day: {
        top: '#2A4A6A', // Bright blue sky
        middle: '#3A5A7A', // Medium blue sky
        bottom: '#4A6A8A', // Light blue sky
        horizon: '#5A7A9A', // Horizon blue sky
      },
      dusk: {
        top: '#1A2A4A', // Deep blue dusk
        middle: '#2A3A5A', // Medium blue dusk
        bottom: '#3A4A6A', // Light blue dusk
        horizon: '#4A5A7A', // Horizon blue dusk
      },
      night: {
        top: '#0A1A2A', // Deep night blue
        middle: '#1A2A3A', // Dark night blue
        bottom: '#2A3A4A', // Medium night blue
        horizon: '#3A4A5A', // Light night blue
      },
      current: {
        top: '#2A4A6A',
        middle: '#3A5A7A',
        bottom: '#4A6A8A',
        horizon: '#5A7A9A',
      },
    },
    baseColor: '#2A4A6A',
    transitionSpeed: 0.02, // Smooth transitions
  },
  modules: {
    enabled: {
      celestial: true,
      clouds: false,
      rain: false,
      snow: true,
      fog: false,
      mountains: true,
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
      mountains: {
        performanceMode: 'high',
        customSettings: {
          movementSpeed: 0.5,
          layerCount: 4,
          colorIntensity: 1.0,
        },
      },
    },
    priorities: {
      celestial: 100,
      clouds: 80,
      rain: 60,
      snow: 40,
      fog: 20,
      mountains: 50,
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
      mountains: 'high',
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
        let newProgress = state.global.dayProgress + timeIncrement;
        
        // Ensure dayProgress stays within 0-1 bounds
        while (newProgress < 0) newProgress += 1;
        while (newProgress >= 1) newProgress -= 1;
        
        state.global.dayProgress = newProgress;
        
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
    
    // Sky color management - synced with sun/moon timing
    updateSkyColors: (state) => {
      const { dayProgress } = state.global;
      const { day, night, current } = state.sky.colors;
      
      // New timing synced with celestial objects:
      // 0.0-0.5: Sun visible, moving left to right + Sky getting lighter then darker (morning to evening)
      // 0.5-1.0: Moon visible, moving left to right + Sky getting darker (night)
      
      // Create smooth transition based on celestial object position
      let transitionFactor;
      if (dayProgress <= 0.5) {
        // Sun period: sky gets lighter as sun rises, then darker as sun sets
        const sunProgress = dayProgress * 2; // 0 to 1
        if (sunProgress <= 0.5) {
          // First half of sun period: getting lighter (morning)
          transitionFactor = sunProgress * 2; // 0 to 1 (night to day)
        } else {
          // Second half of sun period: getting darker (evening)
          transitionFactor = 2 - (sunProgress * 2); // 1 to 0 (day to night)
        }
      } else {
        // Moon period: sky gets darker as moon moves right (night)
        transitionFactor = 1 - ((dayProgress - 0.5) * 2); // 1 to 0 (day to night)
      }
      
      // Use sine curve for smooth transition
      const smoothTransition = Math.sin(transitionFactor * Math.PI / 2);
      
      // Interpolate between night and day colors
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
