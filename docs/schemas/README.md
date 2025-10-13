# Data Schemas & Types

This directory contains data models, API schemas, and TypeScript type definitions for the Interactive Personal Portfolio project.

## Type Definitions

### Core Types
- **Canvas Configuration:** P5.js canvas settings and dimensions
- **Effect Systems:** Particle systems and interactive effects
- **Animation States:** Timeline and animation control
- **Environmental Data:** Weather and atmospheric conditions

### Component Props
- **Canvas Components:** P5.js canvas props and lifecycle
- **Effect Components:** Particle system and animation props
- **UI Components:** Button, Input, Modal props
- **Layout Components:** Header, Footer, Sidebar props

## Data Models

### Canvas Configuration
```typescript
interface CanvasConfig {
  width: number;
  height: number;
  pixelDensity: number;
  renderer: 'p2d' | 'webgl';
  frameRate: number;
  backgroundColor: string;
}

interface P5CanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (p: p5) => void;
  onMousePressed?: (p: p5) => void;
  onMouseMoved?: (p: p5) => void;
  onTouchStarted?: (p: p5) => void;
}
```

### Effect Systems
```typescript
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  opacity: number;
}

interface EffectConfig {
  type: 'laser' | 'firework' | 'snow' | 'rain' | 'sun' | 'moon';
  intensity: number;
  duration: number;
  position?: { x: number; y: number };
  colors?: string[];
  particleCount?: number;
}
```

### Animation States
```typescript
interface AnimationState {
  isPlaying: boolean;
  frameRate: number;
  currentFrame: number;
  duration: number;
  loop: boolean;
  easing: string;
}

interface TimelineEvent {
  time: number;
  action: () => void;
  label?: string;
}
```

## Hook Types

### Custom Hooks
```typescript
interface UseP5CanvasReturn {
  p5Instance: p5 | null;
  canvasRef: React.RefObject<HTMLDivElement>;
  isReady: boolean;
  error: string | null;
}

interface UseAnimationReturn {
  isPlaying: boolean;
  frameRate: number;
  toggleAnimation: () => void;
  setFrameRate: (rate: number) => void;
}

interface UseEffectsReturn {
  activeEffects: EffectConfig[];
  addEffect: (effect: EffectConfig) => void;
  removeEffect: (id: string) => void;
  clearEffects: () => void;
}

interface ReduxEffectsState {
  activeEffects: EffectConfig[];
  performance: PerformanceMetrics;
  settings: OptimizationConfig;
}
```

## Performance Types

### Monitoring
```typescript
interface PerformanceMetrics {
  frameRate: number;
  particleCount: number;
  memoryUsage: number;
  renderTime: number;
}

interface OptimizationConfig {
  maxParticles: number;
  objectPoolSize: number;
  enableWebGL: boolean;
  enableAntialiasing: boolean;
}
```

## Schema Evolution

### Versioning
- **Breaking Changes:** Update major version
- **Additive Changes:** Update minor version
- **Bug Fixes:** Update patch version

### Migration Strategy
- **Backward Compatibility:** Maintain for 2 versions
- **Deprecation Notice:** 1 version advance notice
- **Documentation:** Update with each change

