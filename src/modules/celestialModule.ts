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

interface CelestialModuleState {
  sun: CelestialObject;
  moon: CelestialObject;
  isInitialized: boolean;
  performanceMode: 'high' | 'medium' | 'low';
  canvasWidth: number;
  canvasHeight: number;
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
      size: 70, // Match CSS sun size
      glowIntensity: 0.9,
      color: '#FFFFFF', // White like the CSS
      isVisible: true,
    },
    moon: {
      x: 0,
      y: 0,
      size: 30, // Smaller moon
      glowIntensity: 0.7,
      color: '#E6E6FA', // Lavender
      isVisible: false,
    },
    isInitialized: false,
    performanceMode: 'high',
    canvasWidth: 800,
    canvasHeight: 600,
  };

  // Calculate sun position using arc equation y = -0.02x² + 5
  const calculateSunPosition = (dayProgress: number) => {
    // Sun visible for first half (0.0 to 0.5) - comes up first
    const visibleStart = 0.0;
    const visibleEnd = 0.5;
    
    if (dayProgress < visibleStart || dayProgress > visibleEnd) {
      return { x: -state.sun.size, y: state.canvasHeight * 0.8, isVisible: false };
    }
    
    // Normalize day progress to visible range
    const normalizedProgress = (dayProgress - visibleStart) / (visibleEnd - visibleStart);
    
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
    
    return { x, y, isVisible: true };
  };

  // Calculate moon position using same arc equation y = -0.02x² + 5
  const calculateMoonPosition = (dayProgress: number) => {
    // Moon visible for second half (0.5 to 1.0) - comes up after sun
    const visibleStart = 0.5;
    const visibleEnd = 1.0;
    
    if (dayProgress < visibleStart || dayProgress > visibleEnd) {
      return { x: state.canvasWidth + state.moon.size, y: state.canvasHeight * 0.8, isVisible: false };
    }
    
    // Normalize day progress to visible range (0.5 to 1.0 becomes 0 to 1)
    const normalizedProgress = (dayProgress - visibleStart) / (visibleEnd - visibleStart);
    
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
    
    return { x, y, isVisible: true };
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
    // Skip sun rendering since it's now handled by JSX component
    if (isSun) return;
    
    if (!obj.isVisible) return;
    
    p.push();
    
    // Moon glow (lavender)
    const glowLayers = state.performanceMode === 'high' ? 6 : 
                      state.performanceMode === 'medium' ? 4 : 2;
    
    for (let i = glowLayers; i > 0; i--) {
      const alpha = (obj.glowIntensity * (1 - i / glowLayers)) * 255;
      const size = obj.size + (glowLayers - i) * 6;
      
      p.fill(p.red(obj.color), p.green(obj.color), p.blue(obj.color), alpha);
      p.noStroke();
      p.circle(obj.x, obj.y, size);
    }
    
    // Draw main moon object
    p.fill(obj.color);
    p.noStroke();
    p.circle(obj.x, obj.y, obj.size);
    
    p.pop();
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
      
      console.log('Celestial module initialized with config:', config);
    },
    
    update: (_p: p5, _deltaTime: number, globalState: any) => {
      if (!state.isInitialized) return;
      
      // Update positions based on day progress
      const dayProgress = globalState.global?.dayProgress || 0.25;
      updatePositions(dayProgress);
    },
    
    render: (p: p5, _globalState: any) => {
      if (!state.isInitialized) return;
      
      // Render sun and moon
      renderCelestialObject(p, state.sun, true);
      renderCelestialObject(p, state.moon, false);
    },
    
    setPerformanceMode: (mode: 'high' | 'medium' | 'low') => {
      state = {
        ...state,
        performanceMode: mode,
      };
      
      console.log(`Celestial module performance mode set to: ${mode}`);
    },
  };

  return module;
};