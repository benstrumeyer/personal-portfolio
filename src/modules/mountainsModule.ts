import p5 from 'p5';
import { SkyModuleHook, ModuleConfig } from '@/types/skyTypes';

/**
 * Mountains Module Factory
 * 
 * Creates a mountains module that renders layered mountain silhouettes
 * using Perlin noise for natural-looking mountain ranges.
 */

interface MountainLayer {
  id: number;
  noiseScale: number; // How wavy the mountain is
  heightFactor: number; // How tall it is relative to canvas
  color: string;
  offset: number; // Used for scrolling
  speed: number; // Scroll speed multiplier
}

interface MountainsModuleState {
  layers: MountainLayer[];
  isInitialized: boolean;
  performanceMode: 'high' | 'medium' | 'low';
  canvasWidth: number;
  canvasHeight: number;
  scrollSpeed: number;
}

/**
 * Create a mountains module instance
 */
export const createMountainsModule = (): SkyModuleHook => {
  // Module state
  let state: MountainsModuleState = {
    layers: [],
    isInitialized: false,
    performanceMode: 'high',
    canvasWidth: 800,
    canvasHeight: 600,
    scrollSpeed: 2, // Base scroll speed
  };

  // Static colors are defined in initializeMountains - no dynamic color function needed

  // Initialize mountain layers with vibrant colors - better balanced heights
  const initializeMountains = (): void => {
    state.layers = [
      {
        id: 0, // Front layer - dark, vibrant foreground
        noiseScale: 0.008, // Higher frequency for more peaks and valleys
        heightFactor: 0.04, // Small height (0-4%)
        color: '#4A2C2A', // Dark, vibrant brown - darkest in foreground
        offset: 0,
        speed: 0.4, // Slower, more gentle movement
      },
      {
        id: 1, // Second layer - medium dark, vibrant
        noiseScale: 0.005, // Medium frequency for more peaks/valleys
        heightFactor: 0.08, // Small height (0-8%) - reduced from 10%
        color: '#6B4C3A', // Medium-dark, vibrant brown
        offset: 0,
        speed: 0.3, // Slower movement
      },
      {
        id: 2, // Third layer - lighter, vibrant with moderate peaks/valleys
        noiseScale: 0.008, // Moderate frequency for some peaks and valleys
        heightFactor: 0.12, // Medium height (0-12%) - reduced from 18%
        color: '#8B6B47', // Lighter, vibrant brown
        offset: 0,
        speed: 0.15, // Slow movement
      },
      {
        id: 3, // Back layer - lightest, vibrant with moderate peaks/valleys
        noiseScale: 0.006, // Moderate frequency for some peaks and valleys
        heightFactor: 0.16, // Tallest mountains (0-16%) - reduced from 25%
        color: '#A68B5B', // Lightest, vibrant sage brown
        offset: 0,
        speed: 0.05, // Very slow, barely noticeable movement
      },
    ];
  };

  // Update mountain positions for Perlin noise scrolling
  const updateMountainPositions = (_deltaTime: number, _dayProgress: number): void => {
    state.layers.forEach((layer) => {
      // Keep the static colors defined in initializeMountains
      // layer.color remains unchanged from initialization
      
      // Update offset for Perlin noise scrolling
      layer.offset += state.scrollSpeed * layer.speed * layer.noiseScale;
    });
  };

  // Render a single mountain layer using Perlin noise
  const renderMountainLayer = (p: p5, layer: MountainLayer): void => {
    p.push();
    
    // Set mountain color
    p.fill(layer.color);
    p.noStroke();
    
    // Determine if we're on mobile (width < 768px)
    const isMobile = state.canvasWidth < 768;
    
    // Debug logging removed
    
    // Adjust height factor for mobile and desktop responsiveness
    let adjustedHeightFactor = layer.heightFactor;
    if (isMobile) {
      // Make mountains 40% bigger on mobile
      adjustedHeightFactor = layer.heightFactor * 1.4;
      
      // Clamp to reasonable mobile limits
      adjustedHeightFactor = Math.max(0.02, Math.min(0.25, adjustedHeightFactor));
    } else {
      // Make mountains 15% bigger on desktop
      adjustedHeightFactor = layer.heightFactor * 1.15;
      
      // Clamp to reasonable desktop limits
      adjustedHeightFactor = Math.max(0.02, Math.min(0.25, adjustedHeightFactor));
    }
    
    // Draw mountain silhouette using Perlin noise
    p.beginShape();
    for (let x = 0; x <= state.canvasWidth; x++) {
      const y = p.noise(x * layer.noiseScale + layer.offset) * state.canvasHeight * adjustedHeightFactor;
      p.vertex(x, state.canvasHeight - y);
    }
    p.vertex(state.canvasWidth, state.canvasHeight);
    p.vertex(0, state.canvasHeight);
    p.endShape(p.CLOSE);
    
    p.pop();
  };

  // Module interface implementation
  const module: SkyModuleHook = {
    type: 'mountains',
    name: 'Mountains Module',
    isActive: true,
    priority: 50, // Render before celestial objects (behind them)
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
      
      // Initialize mountain layers
      initializeMountains();
    },
    
    update: (_p: p5, deltaTime: number, globalState: any) => {
      if (!state.isInitialized) return;
      
      // Get day progress for color changes
      const dayProgress = globalState.global?.dayProgress || 0;
      
      // Update mountain positions and colors
      updateMountainPositions(deltaTime, dayProgress);
    },
    
    render: (p: p5, _globalState: any) => {
      if (!state.isInitialized) return;
      
      // Render mountain layers from back to front (background layers first, then foreground on top)
      state.layers.slice().reverse().forEach(layer => {
        renderMountainLayer(p, layer);
      });
    },
    
    setPerformanceMode: (mode: 'high' | 'medium' | 'low') => {
      state = {
        ...state,
        performanceMode: mode,
      };
      
      // Adjust scroll speed based on performance mode
      state.scrollSpeed = mode === 'high' ? 2.0 : mode === 'medium' ? 1.5 : 1.0;
    },
    
    updateCanvasDimensions: (width: number, height: number) => {
      // Store previous dimensions to detect significant changes
      const prevWidth = state.canvasWidth;
      const prevHeight = state.canvasHeight;
      
      // Debug logging removed
      
      state = {
        ...state,
        canvasWidth: width,
        canvasHeight: height,
      };
      
      // Only reinitialize if there's a significant size change (performance optimization)
      const widthChange = Math.abs(width - prevWidth);
      const heightChange = Math.abs(height - prevHeight);
      const significantChange = widthChange > 50 || heightChange > 50;
      
      if (significantChange || prevWidth === 0 || prevHeight === 0) {
        // Reinitializing mountains due to significant change
        // Reinitialize mountains with new dimensions
        initializeMountains();
      }
    },
  };

  return module;
};
