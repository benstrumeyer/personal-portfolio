import p5 from 'p5';
import { SkyModuleHook, ModuleConfig } from '@/types/skyTypes';

/**
 * Snow Module Factory
 * 
 * Creates a snow module that renders falling snowflakes with realistic physics
 * and responsive behavior for different screen sizes.
 */

interface Snowflake {
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  swaySpeed: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

interface SnowModuleState {
  snowflakes: Snowflake[];
  isInitialized: boolean;
  performanceMode: 'high' | 'medium' | 'low';
  canvasWidth: number;
  canvasHeight: number;
  windStrength: number;
  maxSnowflakes: number;
  currentTargetCount: number;
  lastBuildupTime: number;
  buildupSpeed: number;
}

/**
 * Create a snow module instance
 */
export const createSnowModule = (): SkyModuleHook => {
  // Module state
  let state: SnowModuleState = {
    snowflakes: [],
    isInitialized: false,
    performanceMode: 'high',
    canvasWidth: 800,
    canvasHeight: 600,
    windStrength: 0.5, // Wind effect strength
    maxSnowflakes: 350, // Maximum snowflakes - heavy snowfall
    currentTargetCount: 30, // Start with 30 snowflakes
    lastBuildupTime: 0, // Last buildup time
    buildupSpeed: 8, // Snowflakes added per second (faster buildup)
  };

  // Create a new snowflake
  const createSnowflake = (): Snowflake => {
    return {
      x: Math.random() * state.canvasWidth,
      y: -10, // Start above the canvas
      size: Math.random() * 3 + 0.5, // Size between 0.5-3.5 (smaller for more particles)
      speed: Math.random() * 1.5 + 0.2, // Speed between 0.2-1.7 (slower falling)
      sway: Math.random() * Math.PI * 2, // Random sway phase
      swaySpeed: Math.random() * 0.02 + 0.01, // Sway speed
      opacity: Math.random() * 0.8 + 0.2, // Opacity between 0.2-1.0
      rotation: Math.random() * Math.PI * 2, // Random rotation
      rotationSpeed: Math.random() * 0.05 + 0.02, // Rotation speed
    };
  };

  // Update snowflake physics
  const updateSnowflake = (snowflake: Snowflake, deltaTime: number): void => {
    // Vertical movement (falling)
    snowflake.y += snowflake.speed * (deltaTime / 16); // Normalize to 60fps
    
    // Horizontal sway (wind effect)
    snowflake.sway += snowflake.swaySpeed * (deltaTime / 16);
    snowflake.x += Math.sin(snowflake.sway) * state.windStrength * 0.5;
    
    // Rotation
    snowflake.rotation += snowflake.rotationSpeed * (deltaTime / 16);
    
    // Reset snowflake when it goes off screen
    if (snowflake.y > state.canvasHeight + 10) {
      snowflake.y = -10;
      snowflake.x = Math.random() * state.canvasWidth;
    }
    
    // Keep snowflake within horizontal bounds
    if (snowflake.x < -10) snowflake.x = state.canvasWidth + 10;
    if (snowflake.x > state.canvasWidth + 10) snowflake.x = -10;
  };

  // Simple gradual snowflake buildup

  // Render a single snowflake
  const renderSnowflake = (p: p5, snowflake: Snowflake): void => {
    p.push();
    
    // Set snowflake properties
    p.fill(255, 255, 255, snowflake.opacity * 255);
    p.noStroke();
    
    // Position and rotate
    p.translate(snowflake.x, snowflake.y);
    p.rotate(snowflake.rotation);
    
    // Draw snowflake (simple star shape)
    p.beginShape();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x1 = Math.cos(angle) * snowflake.size;
      const y1 = Math.sin(angle) * snowflake.size;
      const x2 = Math.cos(angle + Math.PI / 6) * (snowflake.size * 0.5);
      const y2 = Math.sin(angle + Math.PI / 6) * (snowflake.size * 0.5);
      
      if (i === 0) {
        p.vertex(x1, y1);
      } else {
        p.vertex(x2, y2);
        p.vertex(x1, y1);
      }
    }
    p.endShape(p.CLOSE);
    
    p.pop();
  };

  // Simple gradual snowflake buildup system
  const updateSnowflakeCount = (currentTime: number): void => {
    // Calculate final target count based on performance mode
    const finalTargetCount = state.performanceMode === 'high' ? state.maxSnowflakes :
                            state.performanceMode === 'medium' ? Math.floor(state.maxSnowflakes * 0.75) :
                            Math.floor(state.maxSnowflakes * 0.5);

    // Gradually increase snowflake count over time
    if (state.currentTargetCount < finalTargetCount) {
      const timeSinceLastBuildup = currentTime - state.lastBuildupTime;
      const snowflakesToAdd = Math.floor((timeSinceLastBuildup / 1000) * state.buildupSpeed);
      
      if (snowflakesToAdd > 0) {
        const actualToAdd = Math.min(snowflakesToAdd, finalTargetCount - state.currentTargetCount);
        state.currentTargetCount += actualToAdd;
        state.lastBuildupTime = currentTime;
      }
    }
    
    // Add or remove snowflakes to match current target
    while (state.snowflakes.length < state.currentTargetCount) {
      state.snowflakes.push(createSnowflake());
    }
    while (state.snowflakes.length > state.currentTargetCount) {
      state.snowflakes.pop();
    }
  };

  // Module interface implementation
  const module: SkyModuleHook = {
    type: 'snow',
    name: 'Snow Module',
    isActive: true,
    priority: 200, // Render after celestial objects
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
      
      // Initialize snowflake buildup system
      state.lastBuildupTime = Date.now();
    },
    
    update: (_p: p5, deltaTime: number, globalState: any) => {
      if (!state.isInitialized) return;
      
      // Only show snow when moon is visible (night time)
      const dayProgress = globalState.global?.dayProgress || 0;
      const isMoonVisible = dayProgress > 0.5; // Moon is visible from 0.5-1.0
      
      if (!isMoonVisible) {
        // Clear snowflakes during day time (when sun is visible)
        state.snowflakes = [];
        return;
      }
      
      // Get current time for gradual buildup
      const currentTime = globalState.global?.currentTime || Date.now();
      
      // Gradually increase snowflake count over time
      updateSnowflakeCount(currentTime);
      
      // Update all snowflakes
      state.snowflakes.forEach(snowflake => {
        updateSnowflake(snowflake, deltaTime);
      });
    },
    
    render: (p: p5, _globalState: any) => {
      if (!state.isInitialized) return;
      
      // Render snowflakes
      
      // Render all snowflakes
      state.snowflakes.forEach(snowflake => {
        renderSnowflake(p, snowflake);
      });
    },
    
    setPerformanceMode: (mode: 'high' | 'medium' | 'low') => {
      state = {
        ...state,
        performanceMode: mode,
      };
      
      // Reset buildup when performance mode changes
      state.lastBuildupTime = Date.now();
    },
    
    updateCanvasDimensions: (width: number, height: number) => {
      state = {
        ...state,
        canvasWidth: width,
        canvasHeight: height,
      };
      
      // Update existing snowflakes to stay within new canvas bounds
      state.snowflakes.forEach(snowflake => {
        if (snowflake.x > width) snowflake.x = width;
        if (snowflake.y > height) snowflake.y = height;
      });
    },
    
    // Custom snow methods (not in interface but available for future use)
    // updateSnowIntensity: (intensity: number) => { ... },
    // updateWindStrength: (strength: number) => { ... },
  };

  return module;
};
