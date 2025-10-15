import p5 from 'p5';

/**
 * Union type for identifying different sky module types
 */
export type SkyModuleType = 'celestial' | 'clouds' | 'rain' | 'snow' | 'fog' | 'mountains' | 'lightning' | 'leaves' | 'wind';

/**
 * Configuration object for initializing sky modules
 */
export interface ModuleConfig {
  canvasWidth: number;
  canvasHeight: number;
  performanceMode: 'high' | 'medium' | 'low';
  customSettings?: Record<string, any>;
}

/**
 * Global sky state managed by Redux
 * @deprecated Use Redux state from store instead
 */
export interface SkyState {
  currentTime: number;
  dayProgress: number;
  skyColors: SkyColors;
  performanceMode: boolean;
  activeModules: Record<SkyModuleType, boolean>;
}

/**
 * Color palette for sky rendering
 */
export interface SkyColors {
  top: string;
  middle: string;
  bottom: string;
  horizon: string;
}

/**
 * 2D vector for position calculations
 */
export interface Vector2D {
  x: number;
  y: number;
}

/**
 * Interface for sky module hooks implementing React hook patterns
 */
export interface SkyModuleHook {
  type: SkyModuleType;
  name: string;
  isActive: boolean;
  priority: number; // Render order - higher numbers render on top
  isInitialized: boolean;
  
  /**
   * Initialize the module with P5.js instance and configuration
   * @param p5 - P5.js instance for canvas operations
   * @param config - Module configuration object
   */
  initialize(p5: p5, config: ModuleConfig): void;
  
  /**
   * Update module state and calculations
   * @param p5 - P5.js instance for canvas operations
   * @param deltaTime - Time elapsed since last update in milliseconds
   * @param globalState - Current global sky state (any type for compatibility)
   */
  update(p5: p5, deltaTime: number, globalState: any): void;
  
  /**
   * Render the module to the canvas
   * @param p5 - P5.js instance for canvas operations
   * @param globalState - Current global sky state (any type for compatibility)
   */
  render(p5: p5, globalState: any): void;
  
  /**
   * Set performance mode for the module
   * @param mode - Performance quality level
   */
  setPerformanceMode(mode: 'high' | 'medium' | 'low'): void;
  
  /**
   * Update responsive configuration for the module (optional)
   * @param config - Responsive configuration object
   */
  updateResponsiveConfig?(config: any): void;
  
  /**
   * Update canvas dimensions for the module (optional)
   * @param width - New canvas width
   * @param height - New canvas height
   */
  updateCanvasDimensions?(width: number, height: number): void;
  // No destroy method needed - useEffect handles cleanup automatically
}

/**
 * Props interface for SkyCanvas container component
 */
export interface SkyCanvasProps {
  width?: number;
  height?: number;
  timeMultiplier?: number;
  enablePerformanceMode?: boolean;
  enabledModules?: SkyModuleType[];
}

/**
 * Redux store structure for sky state management
 */
export interface SkySlice {
  global: {
    currentTime: number;
    dayDuration: number;
    timeMultiplier: number;
    dayProgress: number;
  };
  sky: {
    colors: SkyColors;
    baseColor: string;
  };
  modules: {
    enabled: Record<SkyModuleType, boolean>;
    configurations: Record<SkyModuleType, ModuleConfig>;
  };
  performance: {
    frameRate: number;
    globalQualityMode: 'high' | 'medium' | 'low';
    moduleQualityModes: Record<SkyModuleType, 'high' | 'medium' | 'low'>;
  };
}

/**
 * Animation configuration for celestial objects
 */
export interface AnimationConfig {
  sunPath: EllipticalPath;
  moonPath: EllipticalPath;
  transitionDuration: number;
  glowIntensity: number;
  atmosphericEffects: boolean;
}

/**
 * Elliptical path definition for celestial object movement
 */
export interface EllipticalPath {
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  startAngle: number;
  endAngle: number;
}
