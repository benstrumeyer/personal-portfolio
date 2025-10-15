import p5 from 'p5';
import { SkyModuleHook, ModuleConfig } from '@/types/skyTypes';

/**
 * Leaves Module Factory
 * 
 * Creates a leaves module that renders falling leaves during daytime
 * with gentle swaying motion and realistic physics.
 */

interface Leaf {
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  swaySpeed: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: p5.Color;
  windResistance: number;
}

interface LeavesModuleState {
  leaves: Leaf[];
  isInitialized: boolean;
  performanceMode: 'high' | 'medium' | 'low';
  canvasWidth: number;
  canvasHeight: number;
  windStrength: number;
  maxLeaves: number;
  currentTargetCount: number;
  lastBuildupTime: number;
  buildupSpeed: number;
}

/**
 * Create a leaves module instance
 */
export const createLeavesModule = (): SkyModuleHook => {
  // Module state
  let state: LeavesModuleState = {
    leaves: [],
    isInitialized: false,
    performanceMode: 'high',
    canvasWidth: 800,
    canvasHeight: 600,
    windStrength: 0.3,
    maxLeaves: 40, // More leaves for testing
    currentTargetCount: 10, // Start with 10 leaves
    lastBuildupTime: 0,
    buildupSpeed: 2, // 2 leaves per second
  };

  // Create a new leaf
  const createLeaf = (p: p5): Leaf => {
    const colors = [
      p.color(139, 69, 19), // Brown
      p.color(160, 82, 45), // Saddle brown
      p.color(210, 180, 140), // Tan
      p.color(205, 133, 63), // Peru
      p.color(222, 184, 135), // Burlywood
    ];
    
    return {
      x: p.random(-20, state.canvasWidth + 20),
      y: -20, // Start above the canvas
      size: p.random(8, 16), // Size between 8-16 pixels
      speed: p.random(0.5, 1.5), // Slow falling speed
      sway: p.random(0, Math.PI * 2), // Random sway phase
      swaySpeed: p.random(0.01, 0.03), // Gentle sway speed
      rotation: p.random(0, Math.PI * 2), // Random rotation
      rotationSpeed: p.random(0.01, 0.05), // Slow rotation
      opacity: p.random(0.6, 0.9), // Semi-transparent
      color: p.random(colors),
      windResistance: p.random(0.5, 1.0), // How much wind affects this leaf
    };
  };

  // Update leaf physics
  const updateLeaf = (leaf: Leaf, deltaTime: number): void => {
    // Vertical movement (falling)
    leaf.y += leaf.speed * (deltaTime / 16); // Normalize to 60fps
    
    // Horizontal sway (wind effect)
    leaf.sway += leaf.swaySpeed * (deltaTime / 16);
    leaf.x += Math.sin(leaf.sway) * state.windStrength * leaf.windResistance * 0.3;
    
    // Rotation
    leaf.rotation += leaf.rotationSpeed * (deltaTime / 16);
    
    // Reset leaf when it goes off screen
    if (leaf.y > state.canvasHeight + 20) {
      leaf.y = -20;
      leaf.x = Math.random() * state.canvasWidth;
    }
    
    // Keep leaf within horizontal bounds with wrapping
    if (leaf.x < -30) leaf.x = state.canvasWidth + 30;
    if (leaf.x > state.canvasWidth + 30) leaf.x = -30;
  };

  // Render a single leaf
  const renderLeaf = (p: p5, leaf: Leaf): void => {
    p.push();
    
    // Set leaf properties
    p.fill(leaf.color);
    p.colorMode(p.RGB, 255, 255, 255, 1);
    p.fill(p.red(leaf.color), p.green(leaf.color), p.blue(leaf.color), leaf.opacity);
    p.noStroke();
    
    // Position and rotate
    p.translate(leaf.x, leaf.y);
    p.rotate(leaf.rotation);
    
    // Draw leaf shape (simple oval)
    p.ellipse(0, 0, leaf.size, leaf.size * 1.3);
    
    // Add a subtle stem
    p.stroke(p.red(leaf.color) * 0.7, p.green(leaf.color) * 0.7, p.blue(leaf.color) * 0.7, leaf.opacity * 0.8);
    p.strokeWeight(1);
    p.line(0, leaf.size * 0.6, 0, leaf.size * 0.9);
    
    p.pop();
  };

  // Gradual leaf buildup system
  const updateLeafCount = (currentTime: number): void => {
    // Calculate final target count based on performance mode
    const finalTargetCount = state.performanceMode === 'high' ? state.maxLeaves :
                            state.performanceMode === 'medium' ? Math.floor(state.maxLeaves * 0.75) :
                            Math.floor(state.maxLeaves * 0.5);

    // Gradually increase leaf count over time
    if (state.currentTargetCount < finalTargetCount) {
      const timeSinceLastBuildup = currentTime - state.lastBuildupTime;
      const leavesToAdd = Math.floor((timeSinceLastBuildup / 1000) * state.buildupSpeed);
      
      if (leavesToAdd > 0) {
        const actualToAdd = Math.min(leavesToAdd, finalTargetCount - state.currentTargetCount);
        state.currentTargetCount += actualToAdd;
        state.lastBuildupTime = currentTime;
      }
    }
    
    // Add or remove leaves to match current target
    while (state.leaves.length < state.currentTargetCount) {
      // We'll create leaves in the update method with p5 instance
    }
    while (state.leaves.length > state.currentTargetCount) {
      state.leaves.pop();
    }
  };

  // Create the module object
  const module: SkyModuleHook = {
    type: 'leaves',
    name: 'Leaves Module',
    isActive: true,
    priority: 150, // Render above mountains, below celestial objects
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
      };
      
      // Initialize leaf buildup system
      state.lastBuildupTime = Date.now();
      
      // Create initial leaves
      for (let i = 0; i < state.currentTargetCount; i++) {
        state.leaves.push(createLeaf(p));
      }
    },
    
    update: (p: p5, deltaTime: number, globalState: any) => {
      if (!state.isInitialized) return;
      
      // TEMPORARY: Show leaves all the time for testing
      // const dayProgress = globalState.global?.dayProgress || 0;
      // const isSunVisible = dayProgress <= 0.5; // Sun is visible from 0.0-0.5
      
      // if (!isSunVisible) {
      //   // Clear leaves during night time (when moon is visible)
      //   state.leaves = [];
      //   return;
      // }
      
      // Get current time for gradual buildup
      const currentTime = globalState.global?.currentTime || Date.now();
      
      // Gradually increase leaf count over time
      updateLeafCount(currentTime);
      
      // Add new leaves if needed
      while (state.leaves.length < state.currentTargetCount) {
        state.leaves.push(createLeaf(p));
      }
      
      // Update all leaves
      state.leaves.forEach(leaf => {
        updateLeaf(leaf, deltaTime);
      });
    },
    
    render: (p: p5, _globalState: any) => {
      if (!state.isInitialized) return;
      
      // Render all leaves
      state.leaves.forEach(leaf => {
        renderLeaf(p, leaf);
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
      
      // Update existing leaves to stay within new canvas bounds
      state.leaves.forEach(leaf => {
        if (leaf.x > width) leaf.x = width;
        if (leaf.y > height) leaf.y = height;
      });
    },
  };

  return module;
};
