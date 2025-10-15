import p5 from 'p5';
import { SkyModuleHook, ModuleConfig } from '@/types/skyTypes';

/**
 * Wind Module Factory
 * 
 * Creates a wind module that generates wind swirls and gusts
 * that can affect other modules like leaves.
 */

interface WindGust {
  id: number;
  x: number;
  y: number;
  radius: number;
  strength: number;
  angle: number;
  speed: number;
  life: number;
  maxLife: number;
  opacity: number;
}

interface WindModuleState {
  gusts: WindGust[];
  isInitialized: boolean;
  performanceMode: 'high' | 'medium' | 'low';
  canvasWidth: number;
  canvasHeight: number;
  lastGustTime: number;
  gustInterval: number;
  nextGustId: number;
  globalWindStrength: number;
}

/**
 * Create a wind module instance
 */
export const createWindModule = (): SkyModuleHook => {
  // Module state
  let state: WindModuleState = {
    gusts: [],
    isInitialized: false,
    performanceMode: 'high',
    canvasWidth: 800,
    canvasHeight: 600,
    lastGustTime: 0,
    gustInterval: 1000, // 1 second between gusts for testing
    nextGustId: 0,
    globalWindStrength: 0.5,
  };

  // Create a new wind gust
  const createWindGust = (): WindGust => {
    return {
      id: state.nextGustId++,
      x: Math.random() * state.canvasWidth,
      y: Math.random() * state.canvasHeight * 0.7, // Stay in upper 70% of screen
      radius: 100 + Math.random() * 150, // 100-250 pixel radius (larger)
      strength: 0.5 + Math.random() * 0.8, // 0.5-1.3 strength (stronger)
      angle: Math.random() * Math.PI * 2, // Random direction
      speed: 0.8 + Math.random() * 1.2, // 0.8-2.0 speed (faster)
      life: 0,
      maxLife: 4000 + Math.random() * 3000, // 4-7 second life (longer)
      opacity: 0.3 + Math.random() * 0.4, // More visible
    };
  };

  // Update wind gusts
  const updateWindGusts = (deltaTime: number) => {
    const currentTime = Date.now();
    
    // Check if it's time for a new gust
    if (currentTime - state.lastGustTime >= state.gustInterval) {
      const newGust = createWindGust();
      state.gusts.push(newGust);
      state.lastGustTime = currentTime;
    }
    
    // Update existing gusts
    state.gusts = state.gusts.filter(gust => {
      gust.life += deltaTime;
      
      // Move the gust
      gust.x += Math.cos(gust.angle) * gust.speed * (deltaTime / 16);
      gust.y += Math.sin(gust.angle) * gust.speed * (deltaTime / 16);
      
      // Update opacity based on life
      gust.opacity = (1 - (gust.life / gust.maxLife)) * (0.1 + Math.random() * 0.2);
      
      // Remove if expired or off screen
      if (gust.life >= gust.maxLife || 
          gust.x < -gust.radius || gust.x > state.canvasWidth + gust.radius ||
          gust.y < -gust.radius || gust.y > state.canvasHeight + gust.radius) {
        return false;
      }
      
      return true;
    });

    // Update global wind strength with some variation
    state.globalWindStrength = 0.3 + Math.sin(currentTime * 0.001) * 0.4;
  };

  // Get wind influence at a specific position
  const getWindInfluence = (x: number, y: number): { x: number; y: number; strength: number } => {
    let totalInfluenceX = 0;
    let totalInfluenceY = 0;
    let totalStrength = state.globalWindStrength * 0.3; // Base wind

    state.gusts.forEach(gust => {
      const dx = x - gust.x;
      const dy = y - gust.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < gust.radius) {
        const influence = (1 - distance / gust.radius) * gust.strength;
        const angle = Math.atan2(dy, dx);
        
        // Wind pushes away from gust center
        totalInfluenceX += Math.cos(angle + Math.PI) * influence;
        totalInfluenceY += Math.sin(angle + Math.PI) * influence;
        totalStrength += influence;
      }
    });

    return {
      x: totalInfluenceX,
      y: totalInfluenceY,
      strength: Math.min(totalStrength, 2.0) // Cap total strength
    };
  };

  // Render wind gusts (subtle swirls)
  const renderWindGusts = (p: p5) => {
    state.gusts.forEach(gust => {
      if (gust.opacity < 0.01) return;
      
      p.push();
      
      // Draw more visible wind swirl
      p.noFill();
      p.stroke(255, 255, 255, gust.opacity * 400); // More visible
      p.strokeWeight(2); // Thicker lines
      
      // Draw multiple concentric circles for swirl effect
      for (let i = 0; i < 3; i++) {
        const radius = gust.radius * (0.3 + i * 0.3);
        p.ellipse(gust.x, gust.y, radius, radius);
        
        // Add some swirl lines
        const points = 8;
        for (let j = 0; j < points; j++) {
          const angle = (j / points) * Math.PI * 2 + gust.life * 0.01;
          const startRadius = radius * 0.3;
          const endRadius = radius * 0.8;
          
          const startX = gust.x + Math.cos(angle) * startRadius;
          const startY = gust.y + Math.sin(angle) * startRadius;
          const endX = gust.x + Math.cos(angle) * endRadius;
          const endY = gust.y + Math.sin(angle) * endRadius;
          
          p.line(startX, startY, endX, endY);
        }
      }
      
      p.pop();
    });
  };

  // Create the module object
  const module: SkyModuleHook = {
    type: 'wind',
    name: 'Wind Module',
    isActive: true,
    priority: 10, // Low priority, affects other modules
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
        lastGustTime: Date.now(),
      };
    },
    
    update: (_p: p5, deltaTime: number, globalState: any) => {
      if (!state.isInitialized) return;
      
      // Only show wind when sun is visible (day time)
      const dayProgress = globalState.global?.dayProgress || 0;
      const isSunVisible = dayProgress <= 0.5; // Sun is visible from 0.0-0.5
      
      if (!isSunVisible) {
        // Clear wind gusts during night time
        state.gusts = [];
        return;
      }
      
      updateWindGusts(deltaTime);
    },
    
    render: (p: p5, _globalState: any) => {
      if (!state.isInitialized) return;
      
      // Render wind gusts for visibility
      renderWindGusts(p);
    },
    
    setPerformanceMode: (mode: 'high' | 'medium' | 'low') => {
      state = {
        ...state,
        performanceMode: mode,
      };
    },
    
    updateCanvasDimensions: (width: number, height: number) => {
      state = {
        ...state,
        canvasWidth: width,
        canvasHeight: height,
      };
    },
    
    // Expose wind influence function for other modules
    getWindInfluence: (x: number, y: number) => getWindInfluence(x, y),
  } as SkyModuleHook & {
    getWindInfluence: (x: number, y: number) => { x: number; y: number; strength: number };
  };

  return module;
};

// Export the wind influence function for use by other modules
export const getWindInfluence = (windModule: any, x: number, y: number) => {
  if (windModule && typeof windModule.getWindInfluence === 'function') {
    return windModule.getWindInfluence(x, y);
  }
  return { x: 0, y: 0, strength: 0 };
};
