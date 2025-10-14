import p5 from 'p5';
import { SkyModuleHook, ModuleConfig } from '@/types/skyTypes';

/**
 * Rain Module Factory
 * 
 * Creates realistic rain effects with gravity, wind, and responsive behavior.
 */

interface RainDrop {
  x: number;
  y: number;
  z: number; // Depth for parallax effect
  length: number;
  speed: number;
  thickness: number;
  opacity: number;
  windOffset: number;
}

interface RainModuleState {
  rainDrops: RainDrop[];
  isInitialized: boolean;
  performanceMode: 'high' | 'medium' | 'low';
  canvasWidth: number;
  canvasHeight: number;
  windStrength: number;
  rainIntensity: number;
  lastUpdateTime: number;
  isMobile: boolean;
}

/**
 * Create a rain module instance
 */
export const createRainModule = (): SkyModuleHook => {
  // Module state
  let state: RainModuleState = {
    rainDrops: [],
    isInitialized: false,
    performanceMode: 'high',
    canvasWidth: 800,
    canvasHeight: 600,
    windStrength: 0.5,
    rainIntensity: 0.7,
    lastUpdateTime: Date.now(),
    isMobile: false,
  };

  // Create a new rain drop
  const createRainDrop = (p: p5): RainDrop => {
    const z = p.random(0.3, 1.0); // Depth for parallax
    const speed = p.map(z, 0.3, 1.0, 15, 25); // Closer drops fall faster - increased speed
    const length = p.map(z, 0.3, 1.0, 20, 40); // Closer drops are longer
    const thickness = p.map(z, 0.3, 1.0, 1, 2); // Closer drops are thicker
    const opacity = p.map(z, 0.3, 1.0, 0.3, 0.8); // Closer drops are more opaque
    
    return {
      x: p.random(-50, state.canvasWidth + 50),
      y: p.random(-200, -50), // Start higher up
      z,
      length,
      speed,
      thickness,
      opacity,
      windOffset: p.random(-2, 2),
    };
  };

  // Update rain drops
  const updateRainDrops = (p: p5) => {
    const currentTime = Date.now();
    const timeDelta = currentTime - state.lastUpdateTime;
    state.lastUpdateTime = currentTime;

    // Update existing rain drops
    state.rainDrops.forEach(drop => {
      // Apply gravity - use frame-based movement instead of time-based
      drop.y += drop.speed;
      
      // Apply wind effect
      drop.x += state.windStrength * drop.z + drop.windOffset * 0.1;
      
      // Reset drops that go off screen (like snow) instead of removing them
      if (drop.y > state.canvasHeight + 50) {
        drop.y = p.random(-200, -50);
        drop.x = p.random(-50, state.canvasWidth + 50);
        drop.windOffset = p.random(-2, 2);
      }
      
      // Keep drops within horizontal bounds
      if (drop.x < -100) drop.x = state.canvasWidth + 100;
      if (drop.x > state.canvasWidth + 100) drop.x = -100;
    });

    // Gradually add new drops over time for smooth streaming
    const targetDropCount = state.performanceMode === 'high' ? 60 : 
                           state.performanceMode === 'medium' ? 40 : 30;
    
    // Only add 1 drop per frame maximum for smooth streaming - reduced probability
    if (state.rainDrops.length < targetDropCount && Math.random() < 0.15) {
      state.rainDrops.push(createRainDrop(p));
    }
  };

  // Render rain drops
  const renderRainDrops = (p: p5) => {
    p.push();
    
    // Sort drops by depth (back to front) for proper rendering
    const sortedDrops = [...state.rainDrops].sort((a, b) => a.z - b.z);
    
    sortedDrops.forEach(drop => {
      // Calculate parallax position for X only (horizontal depth)
      const parallaxX = drop.x + (drop.z - 1) * 50; // Slight horizontal parallax
      const rainY = drop.y; // Use actual Y position, no parallax
      
      // Set stroke properties based on depth
      const strokeAlpha = drop.opacity * 255;
      const strokeWeight = drop.thickness;
      
      p.stroke(200, 220, 255, strokeAlpha); // Light blue rain color
      p.strokeWeight(strokeWeight);
      p.strokeCap(p.ROUND);
      
      // Draw rain drop as a line
      p.line(
        parallaxX, 
        rainY, 
        parallaxX - drop.windOffset * 2, 
        rainY - drop.length
      );
      
      // Add subtle glow effect for closer drops
      if (drop.z > 0.7) {
        p.strokeWeight(strokeWeight * 2);
        p.stroke(220, 240, 255, strokeAlpha * 0.3);
        p.line(
          parallaxX, 
          rainY, 
          parallaxX - drop.windOffset * 2, 
          rainY - drop.length * 0.8
        );
      }
    });
    
    p.pop();
  };


  // Create the module object
  const module: SkyModuleHook = {
    type: 'rain',
    name: 'Rain Module',
    isActive: true,
    priority: 70, // Render above mountains, below clouds
    get isInitialized() {
      return state.isInitialized;
    },
    
    initialize: (p: p5, config: ModuleConfig) => {
      state = {
        ...state,
        isInitialized: true,
        canvasWidth: config.canvasWidth,
        canvasHeight: config.canvasHeight,
        performanceMode: config.performanceMode,
        lastUpdateTime: Date.now(),
      };
      
      // Initialize with a small number of drops to avoid burst effect
      const initialDropCount = state.isMobile ? 10 : 15;
      for (let i = 0; i < initialDropCount; i++) {
        state.rainDrops.push(createRainDrop(p));
      }
    },
    
    update: (p: p5, deltaTime: number, globalState: any) => {
      if (!state.isInitialized) return;
      
      // Update wind strength based on time for realistic variation
      state.windStrength = 0.3 + p.sin(Date.now() * 0.0005) * 0.4;
      
      updateRainDrops(p);
    },
    
    render: (p: p5, globalState: any) => {
      if (!state.isInitialized) return;
      
      renderRainDrops(p);
    },
    
    setPerformanceMode: (mode: 'high' | 'medium' | 'low') => {
      state = {
        ...state,
        performanceMode: mode,
      };
    },
    
    updateCanvasDimensions: (width: number, height: number) => {
      const oldWidth = state.canvasWidth;
      const oldHeight = state.canvasHeight;
      
      state = {
        ...state,
        canvasWidth: width,
        canvasHeight: height,
      };
      
      // Adjust existing drops to new canvas size smoothly
      state.rainDrops.forEach(drop => {
        // Scale X position proportionally
        drop.x = (drop.x / oldWidth) * width;
        
        // If drop is way off screen, reset it
        if (drop.x < -100 || drop.x > width + 100) {
          drop.x = Math.random() * width;
        }
        
        // If drop is below new canvas height, reset it
        if (drop.y > height + 50) {
          drop.y = Math.random() * -100 - 50;
        }
      });
    },
    
    // Update responsive configuration
    updateResponsiveConfig: (config: any) => {
      const wasMobile = state.isMobile;
      state = {
        ...state,
        isMobile: config.isMobile,
      };
      
      // If switching between mobile/desktop, don't create new drops immediately
      // Let the gradual system handle the transition
      if (wasMobile !== config.isMobile) {
        // Just update the last update time to prevent burst
        state.lastUpdateTime = Date.now();
      }
    },
  };

  return module;
};
