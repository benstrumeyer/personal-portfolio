import p5 from 'p5';
import { SkyModuleHook, SkyModuleType, ModuleConfig } from '@/types/skyTypes';

/**
 * Celestial Module Factory
 * 
 * Creates a celestial module instance that implements the SkyModuleHook interface
 * with linear movement across the screen and proper day/night synchronization.
 */

interface CelestialObject {
  x: number;
  y: number;
  size: number;
  glowIntensity: number;
  color: string;
  isVisible: boolean;
}

interface ResponsiveConfig {
  sunVisibleStart: number;
  sunVisibleEnd: number;
  moonVisibleStart: number;
  moonVisibleEnd: number;
  sunBaseSize: number;
  moonBaseSize: number;
}

interface CelestialModuleState {
  sun: CelestialObject;
  moon: CelestialObject;
  isInitialized: boolean;
  performanceMode: 'high' | 'medium' | 'low';
  canvasWidth: number;
  canvasHeight: number;
  responsiveConfig: ResponsiveConfig;
}

/**
 * Create a celestial module instance
 */
export const createCelestialModule = (): SkyModuleHook => {
  // Module state
  let state: CelestialModuleState = {
    sun: {
      x: 0,
      y: 0,
      size: 80, // Base size, will be updated by responsive config
      glowIntensity: 0.1, // Halved glow
      color: '#FFFF96', // Yellowish sun
      isVisible: true,
    },
    moon: {
      x: 0,
      y: 0,
      size: 91, // Base size, will be updated by responsive config
      glowIntensity: 0.4, // Reduced glow
      color: '#E6E6FA', // Lavender
      isVisible: false,
    },
    isInitialized: false,
    performanceMode: 'high',
    canvasWidth: 800,
    canvasHeight: 600,
    responsiveConfig: {
      sunVisibleStart: 0.0,
      sunVisibleEnd: 0.5,
      moonVisibleStart: 0.5,
      moonVisibleEnd: 1.0,
      sunBaseSize: 80,
      moonBaseSize: 91,
    },
  };

  // Calculate responsive size scaling
  const getScaledSize = (baseSize: number) => {
    const baseCanvasSize = 800; // Reference canvas width
    const scale = Math.min(state.canvasWidth / baseCanvasSize, state.canvasHeight / 600);
    return Math.max(baseSize * scale, baseSize * 0.5); // Minimum 50% of base size
  };

  // Calculate sun position using arc equation y = -0.02x² + 5
  const calculateSunPosition = (dayProgress: number) => {
    const { sunVisibleEnd } = state.responsiveConfig;
    
    // Safety check: ensure we have valid configuration and canvas dimensions
    if (!state.responsiveConfig || state.canvasWidth <= 0 || state.canvasHeight <= 0) {
      console.warn('Sun calculation: Invalid state', {
        responsiveConfig: state.responsiveConfig,
        canvasWidth: state.canvasWidth,
        canvasHeight: state.canvasHeight
      });
      return { x: 0, y: 0, isVisible: false };
    }
    
    // Clamp dayProgress to valid range
    const clampedProgress = Math.max(0, Math.min(1, dayProgress));
    
    // Debug logging removed for performance
    
    let normalizedProgress;
    let isVisible = true;
    
    if (clampedProgress > sunVisibleEnd) {
      // After sun period: hide sun when moon is active
      isVisible = false;
      normalizedProgress = 0; // Reset position for when it comes back
    } else {
      // During sun period: normal movement from 0 to 1
      // Start immediately at dayProgress 0.0 and move to 1.0
      normalizedProgress = clampedProgress / sunVisibleEnd;
    }
    
    // Map progress to x position across the screen width
    // Start from left edge and move to right edge
    const x = normalizedProgress * state.canvasWidth;
    
    // Calculate y position using arc equation: y = -0.02x² + 5
    // Scale the equation to fit the canvas height
    const scaledX = (x / state.canvasWidth) * 20 - 10; // Scale x to range -10 to 10
    const arcY = -0.02 * scaledX * scaledX + 5;
    
    // Map arc result to canvas coordinates
    // The arc gives us values roughly 0-5, map to top portion of screen
    const y = state.canvasHeight * 0.2 + (5 - arcY) * (state.canvasHeight * 0.3) / 5;
    
    // Debug logging removed for performance
    
    return { x, y, isVisible };
  };

  // Calculate moon position using same arc equation y = -0.02x² + 5
  const calculateMoonPosition = (dayProgress: number) => {
    const { moonVisibleStart } = state.responsiveConfig;
    
    // Clamp dayProgress to valid range
    const clampedProgress = Math.max(0, Math.min(1, dayProgress));
    
    let normalizedProgress;
    let isVisible = true;
    
    if (clampedProgress < moonVisibleStart) {
      // Before moon period: hide moon when sun is active
      isVisible = false;
      normalizedProgress = 0; // Reset position for when it comes back
    } else {
      // During moon period: normal movement from 0 to 1
      // Map from moonVisibleStart to 1.0, then normalize to 0-1
      const moonProgress = (clampedProgress - moonVisibleStart) / (1.0 - moonVisibleStart);
      normalizedProgress = Math.min(moonProgress, 1.0);
    }
    
    // Map progress to x position across the screen width
    // Start from left edge and move to right edge
    const x = normalizedProgress * state.canvasWidth;
    
    // Calculate y position using arc equation: y = -0.02x² + 5
    // Scale the equation to fit the canvas height
    const scaledX = (x / state.canvasWidth) * 20 - 10; // Scale x to range -10 to 10
    const arcY = -0.02 * scaledX * scaledX + 5;
    
    // Map arc result to canvas coordinates
    // The arc gives us values roughly 0-5, map to top portion of screen
    const y = state.canvasHeight * 0.2 + (5 - arcY) * (state.canvasHeight * 0.3) / 5;
    
    return { x, y, isVisible };
  };

  // Update celestial object positions based on day progress
  const updatePositions = (dayProgress: number) => {
    const sunPos = calculateSunPosition(dayProgress);
    const moonPos = calculateMoonPosition(dayProgress);
    
    state = {
      ...state,
      sun: {
        ...state.sun,
        x: sunPos.x,
        y: sunPos.y,
        isVisible: sunPos.isVisible,
      },
      moon: {
        ...state.moon,
        x: moonPos.x,
        y: moonPos.y,
        isVisible: moonPos.isVisible,
      },
    };
  };

  // Render celestial object with glow effect
  const renderCelestialObject = (
    p: p5, 
    obj: CelestialObject, 
    isSun: boolean = true
  ) => {
    if (!obj.isVisible) return;
    
    p.push();
    
    if (isSun) {
      // Enhanced sun rendering with rotating rays and glow
      renderSun(p, obj);
    } else {
      // Enhanced moon rendering with glow and effects
      renderMoon(p, obj);
    }
    
    p.pop();
  };

  // Render sun with glow effects
  const renderSun = (p: p5, sun: CelestialObject) => {
    const scaledSize = getScaledSize(sun.size);
    
    // Sun glow layers
    const glowLayers = state.performanceMode === 'high' ? 8 : 
                      state.performanceMode === 'medium' ? 6 : 4;
    
    for (let i = glowLayers; i > 0; i--) {
      const alpha = (sun.glowIntensity * (1 - i / glowLayers)) * 255;
      const size = scaledSize + (glowLayers - i) * 6; // Smaller glow spread
      
      p.fill(255, 255, 150, alpha); // Yellowish glow
      p.noStroke();
      p.circle(sun.x, sun.y, size);
    }
    
    // Main sun body
    p.fill(255, 255, 150); // Yellowish sun
    p.noStroke();
    p.circle(sun.x, sun.y, scaledSize);
    
    // Inner glow
    p.fill(255, 255, 120, 80); // Yellowish inner glow
    p.circle(sun.x, sun.y, scaledSize * 0.8);
  };

  // Render moon with enhanced effects (no pulsing)
  const renderMoon = (p: p5, moon: CelestialObject) => {
    const scaledSize = getScaledSize(moon.size);
    
    // Moon glow layers with lavender color (reduced glow)
    const glowLayers = state.performanceMode === 'high' ? 4 : 
                      state.performanceMode === 'medium' ? 3 : 2;
    
    for (let i = glowLayers; i > 0; i--) {
      const alpha = (moon.glowIntensity * (1 - i / glowLayers)) * 255;
      const size = scaledSize + (glowLayers - i) * 4; // Smaller glow spread
      
      p.fill(230, 230, 250, alpha); // Lavender glow
      p.noStroke();
      p.circle(moon.x, moon.y, size);
    }
    
    // Main moon body with subtle texture
    p.fill(240, 240, 255); // Slightly warmer white
    p.noStroke();
    p.circle(moon.x, moon.y, scaledSize);
    
    // Moon craters (subtle dark spots)
    p.fill(220, 220, 240, 80);
    p.circle(moon.x - scaledSize * 0.2, moon.y - scaledSize * 0.1, scaledSize * 0.15);
    p.circle(moon.x + scaledSize * 0.15, moon.y + scaledSize * 0.2, scaledSize * 0.1);
    p.circle(moon.x - scaledSize * 0.1, moon.y + scaledSize * 0.15, scaledSize * 0.08);
  };

  // Create the module object
  const module: SkyModuleHook = {
    type: 'celestial' as SkyModuleType,
    name: 'Celestial Objects',
    isActive: true,
    priority: 100,
    get isInitialized() {
      return state.isInitialized;
    },
    
    initialize: (_p: p5, config: ModuleConfig) => {
      state = {
        ...state,
        isInitialized: true,
        canvasWidth: config.canvasWidth,
        canvasHeight: config.canvasHeight,
        performanceMode: config.performanceMode,
      };
      
      // Module initialized
    },
    
    update: (_p: p5, _deltaTime: number, globalState: any) => {
      if (!state.isInitialized) return;
      
      // Update positions based on day progress
      const dayProgress = globalState.global?.dayProgress || 0.0;
      updatePositions(dayProgress);
    },
    
    render: (p: p5, _globalState: any) => {
      if (!state.isInitialized) return;
      
      // Render celestial objects
      
      // Render sun and moon with enhanced effects
      renderCelestialObject(p, state.sun, true);
      renderCelestialObject(p, state.moon, false);
    },
    
    setPerformanceMode: (mode: 'high' | 'medium' | 'low') => {
      state = {
        ...state,
        performanceMode: mode,
      };
      
      // Performance mode updated
    },
    
    updateResponsiveConfig: (config: ResponsiveConfig) => {
      state = {
        ...state,
        responsiveConfig: config,
        sun: {
          ...state.sun,
          size: config.sunBaseSize,
        },
        moon: {
          ...state.moon,
          size: config.moonBaseSize,
        },
      };
      
      // Responsive config updated
    },
    
    updateCanvasDimensions: (width: number, height: number) => {
      state = {
        ...state,
        canvasWidth: width,
        canvasHeight: height,
      };
      
      // Canvas dimensions updated
    },
  };

  return module;
};