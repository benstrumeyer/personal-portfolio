import p5 from 'p5';
import { SkyModuleHook, ModuleConfig } from '@/types/skyTypes';

/**
 * Lightning Module Factory
 * 
 * Creates a lightning module that renders random lightning strikes
 * with glowing effects and flash animations.
 */

interface LightningStrike {
  id: number;
  x: number;
  y: number;
  width: number;
  segments: { x: number; y: number }[];
  intensity: number;
  glowRadius: number;
  isActive: boolean;
  flashDuration: number;
  timeRemaining: number;
}

interface LightningModuleState {
  strikes: LightningStrike[];
  isInitialized: boolean;
  performanceMode: 'high' | 'medium' | 'low';
  canvasWidth: number;
  canvasHeight: number;
  lastStrikeTime: number;
  strikeInterval: number;
  nextStrikeId: number;
}

/**
 * Create a lightning module instance
 */
export const createLightningModule = (): SkyModuleHook => {
  // Module state
  let state: LightningModuleState = {
    strikes: [],
    isInitialized: false,
    performanceMode: 'high',
    canvasWidth: 800,
    canvasHeight: 600,
    lastStrikeTime: 0,
    strikeInterval: 3000, // 2 seconds between strikes (more frequent for testing)
    nextStrikeId: 0,
  };

  // Generate a jagged lightning path from top to bottom
  const generateLightningPath = (startX: number, endY: number): { x: number; y: number }[] => {
    const segments: { x: number; y: number }[] = [];
    const segmentCount = Math.floor(endY / 15); // Segment every 15 pixels for more detail
    
    for (let i = 0; i <= segmentCount; i++) {
      const progress = i / segmentCount;
      const y = progress * endY;
      
      // Add controlled randomness for jagged lightning effect
      const baseX = startX;
      const randomOffset = (Math.random() - 0.5) * 20; // ±10 pixel variation (reduced from 30)
      const x = baseX + randomOffset;
      
      segments.push({ x, y });
    }
    
    return segments;
  };

  // Create a new lightning strike
  const createLightningStrike = (): LightningStrike => {
    const x = Math.random() * state.canvasWidth;
    const intensity = 0.5 + Math.random() * 0.3; // 0.5 to 0.8 intensity (subtle)
    const width = 3; // Fixed 3px width for jagged lightning
    const glowRadius = 15 + Math.random() * 25; // 15-40 pixel glow
    
    return {
      id: state.nextStrikeId++,
      x,
      y: 0, // Start at top of screen
      width,
      segments: generateLightningPath(x, state.canvasHeight),
      intensity,
      glowRadius,
      isActive: true,
      flashDuration: 50 + Math.random() * 100, // 50-150ms flash (shorter)
      timeRemaining: 50 + Math.random() * 100,
    };
  };

  // Update lightning strikes
  const updateLightningStrikes = (deltaTime: number) => {
    const currentTime = Date.now();
    
    // Check if it's time for a new strike
    if (currentTime - state.lastStrikeTime >= state.strikeInterval) {
      const newStrike = createLightningStrike();
      state.strikes.push(newStrike);
      state.lastStrikeTime = currentTime;
    }
    
    // Update existing strikes
    state.strikes = state.strikes.filter(strike => {
      strike.timeRemaining -= deltaTime;
      
      if (strike.timeRemaining <= 0) {
        strike.isActive = false;
        return false; // Remove inactive strikes
      }
      
      return true;
    });
  };

  // Render lightning glow effect
  const renderLightningGlow = (p: p5, strike: LightningStrike) => {
    if (!strike.isActive) return;
    
    p.push();
    
    // Calculate glow intensity based on remaining time
    const glowIntensity = (strike.timeRemaining / strike.flashDuration) * strike.intensity;
    const alpha = glowIntensity * 100; // 0-120 alpha
    
    // Create glow effect with multiple layers
    const glowLayers = state.performanceMode === 'high' ? 5 : 
                      state.performanceMode === 'medium' ? 3 : 2;
    
    for (let i = glowLayers; i > 0; i--) {
      const layerAlpha = (alpha * (1 - i / glowLayers)) / glowLayers;
      const layerRadius = strike.glowRadius * (glowLayers - i + 1) / glowLayers;
      
      p.fill(173, 216, 230, layerAlpha); // Light blue glow
      p.noStroke();
      
      // Draw glow along the lightning path
      strike.segments.forEach(segment => {
        p.circle(segment.x, segment.y, layerRadius);
      });
    }
    
    p.pop();
  };

  // Render lightning bolt
  const renderLightningBolt = (p: p5, strike: LightningStrike) => {
    if (!strike.isActive || strike.segments.length < 2) return;
    
    p.push();
    
    // Calculate lightning intensity based on remaining time
    const lightningIntensity = (strike.timeRemaining / strike.flashDuration) * strike.intensity;
    const alpha = lightningIntensity * 255;
    
    p.stroke(255, 255, 255, alpha); // White lightning
    p.strokeWeight(strike.width); // Use the actual width (1-3px)
    p.noFill();
    
    // Draw jagged lightning path
    p.beginShape();
    strike.segments.forEach((segment, index) => {
      if (index === 0) {
        p.vertex(segment.x, segment.y);
      } else {
        p.vertex(segment.x, segment.y);
      }
    });
    p.endShape();
    
    // Add some spark effects at the end
    if (strike.segments.length > 0) {
      const endSegment = strike.segments[strike.segments.length - 1];
      if (endSegment) {
        p.fill(255, 255, 200, alpha * 0.8); // Yellow spark
        p.noStroke();
        
        // Small sparks around the end point
        for (let i = 0; i < 3; i++) {
          const sparkX = endSegment.x + (Math.random() - 0.5) * 10;
          const sparkY = endSegment.y + (Math.random() - 0.5) * 10;
          p.circle(sparkX, sparkY, 2 + Math.random() * 2);
        }
      }
    }
    
    p.pop();
  };

  // No full-screen flash - just the glow around lightning bolts

  // Create the module object
  const module: SkyModuleHook = {
    type: 'lightning' as any, // We'll need to add this to the types
    name: 'Lightning Module',
    isActive: true,
    priority: 40, // Render below mountains
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
        lastStrikeTime: Date.now(), // Start the timer
      };
    },
    
    update: (_p: p5, deltaTime: number, globalState: any) => {
      if (!state.isInitialized) return;
      
      // Only show lightning when moon is visible (night time)
      const dayProgress = globalState.global?.dayProgress || 0;
      const isMoonVisible = dayProgress > 0.5; // Moon is visible from 0.5-1.0
      
      if (!isMoonVisible) {
        // Clear lightning strikes during day time (when sun is visible)
        state.strikes = [];
        return;
      }
      
      updateLightningStrikes(deltaTime);
    },
    
    render: (p: p5, _globalState: any) => {
      if (!state.isInitialized) return;
      
      // Render lightning glows
      state.strikes.forEach(strike => {
        renderLightningGlow(p, strike);
      });
      
      // Render lightning bolts
      state.strikes.forEach(strike => {
        renderLightningBolt(p, strike);
      });
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
  };

  return module;
};
