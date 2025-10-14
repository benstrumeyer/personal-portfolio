import React, { useRef, useEffect, useMemo, useState } from 'react';
import p5 from 'p5';
import { Provider } from 'react-redux';
import { SkyCanvasProps, SkyModuleHook, SkyModuleType } from '@/types/skyTypes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateTime, updateSkyColors, updateFrameRate } from '@/store/skySlice';
import { createCelestialModule } from '@/modules/celestialModule';
import { Sun } from '@/components/Sun';
import store from '@/store';


/**
 * SkyCanvas Inner Component (uses Redux hooks)
 * 
 * This component uses Redux hooks and must be wrapped with Redux Provider.
 */
const SkyCanvasInner: React.FC<SkyCanvasProps> = ({
  width,
  height,
  timeMultiplier: _timeMultiplier = 1.0,
  enablePerformanceMode = false,
  enabledModules = ['celestial']
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);
  const modulesRef = useRef<SkyModuleHook[]>([]);
  const dispatch = useAppDispatch();
  const [sunPosition, setSunPosition] = useState({ x: 0, y: 0, isVisible: false });

  // Get current sky state
  const currentSkyState = useAppSelector(state => state.sky);

  // Calculate sun position using arc equation y = -0.02x² + 5
  const calculateSunPosition = (dayProgress: number) => {
    // Sun visible for first half (0.0 to 0.5) - comes up first
    const visibleStart = 0.0;
    const visibleEnd = 0.5;

    if (dayProgress < visibleStart || dayProgress > visibleEnd) {
      return { x: 0, y: height * 0.8, isVisible: false };
    }

    const normalizedProgress = (dayProgress - visibleStart) / (visibleEnd - visibleStart);
    
    // Map progress to x position across the screen width
    // Start from left edge and move to right edge
    const x = normalizedProgress * width;
    
    // Calculate y position using arc equation: y = -0.02x² + 5
    // Scale the equation to fit the canvas height
    const scaledX = (x / width) * 20 - 10; // Scale x to range -10 to 10
    const arcY = -0.02 * scaledX * scaledX + 5;
    
    // Map arc result to canvas coordinates
    // The arc gives us values roughly 0-5, map to top portion of screen
    const y = height * 0.2 + (5 - arcY) * (height * 0.3) / 5;
    
    return { x, y, isVisible: true };
  };

  // Update sun position when day progress changes
  useEffect(() => {
    const newPosition = calculateSunPosition(currentSkyState.global.dayProgress);
    setSunPosition(newPosition);
  }, [currentSkyState.global.dayProgress, width, height]);

  // Update CSS gradient background when sky colors change
  useEffect(() => {
    const { top, middle, bottom } = currentSkyState.sky.colors.current;
    const gradientStyle = `linear-gradient(to bottom, ${top} 0%, ${middle} 50%, ${bottom} 100%)`;
    
    if (canvasRef.current) {
      canvasRef.current.style.background = gradientStyle;
    }
  }, [currentSkyState.sky.colors.current]);

  // Module registry for dynamic module loading - memoized to prevent infinite re-renders
  const moduleRegistry: Record<string, () => SkyModuleHook> = useMemo(() => ({
    celestial: () => createCelestialModule(),
    // Additional modules will be added in future tasks
  }), []);

  // Initialize P5.js canvas and modules
  useEffect(() => {
    if (canvasRef.current && !p5Instance.current) {
      const sketch = (p: p5) => {
        let lastTime = 0;

        p.setup = () => {
          p.createCanvas(width, height);
          
          // Set transparent background so CSS gradient shows through
          p.clear();
          
          // Initialize enabled modules
          modulesRef.current = enabledModules
            .map((moduleType: SkyModuleType) => {
              const moduleFactory = moduleRegistry[moduleType];
              if (moduleFactory) {
                const module = moduleFactory();
                module.initialize(p, {
                  canvasWidth: width,
                  canvasHeight: height,
                  performanceMode: enablePerformanceMode ? 'medium' : 'high'
                });
                return module;
              }
              return null;
            })
            .filter((module): module is SkyModuleHook => module !== null)
            .sort((a, b) => a.priority - b.priority); // Sort by priority for rendering order

          console.log(`SkyCanvas initialized with ${modulesRef.current.length} modules`);
        };

        p.draw = () => {
          const currentTime = p.millis();
          const deltaTime = currentTime - lastTime;
          lastTime = currentTime;

          // Update Redux state
          dispatch(updateTime(currentTime));
          dispatch(updateSkyColors());
          dispatch(updateFrameRate(currentTime));

          // Get current sky state for rendering
          const currentSkyState = store.getState().sky;

          // Clear canvas with transparent background (gradient will be handled by CSS)
          p.clear();

          // Update all active modules
          modulesRef.current.forEach(module => {
            if (module.isActive && module.isInitialized) {
              module.update(p, deltaTime, currentSkyState);
            }
          });

          // Render all modules in priority order
          modulesRef.current.forEach(module => {
            if (module.isActive && module.isInitialized) {
              module.render(p, currentSkyState);
            }
          });
        };
      };

      p5Instance.current = new p5(sketch, canvasRef.current);
    }

    // Cleanup function
    return () => {
      if (p5Instance.current) {
        // Modules will be cleaned up automatically via useEffect cleanup
        modulesRef.current = [];
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, [width, height, enabledModules, enablePerformanceMode, moduleRegistry, dispatch]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (p5Instance.current) {
        p5Instance.current.resizeCanvas(width, height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  return (
    <div 
      className="sky-canvas"
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        position: 'relative'
      }}
    >
      <div 
        ref={canvasRef} 
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          position: 'absolute',
          top: 0,
          left: 0,
          background: `linear-gradient(to bottom, ${currentSkyState.sky.colors.current.top} 0%, ${currentSkyState.sky.colors.current.middle} 50%, ${currentSkyState.sky.colors.current.bottom} 100%)`
        }}
      />
      <Sun 
        x={sunPosition.x}
        y={sunPosition.y}
        isVisible={sunPosition.isVisible}
        size={70}
      />
    </div>
  );
};

/**
 * SkyCanvas Container Component
 * 
 * Main component that provides Redux store context to the inner component.
 */
export const SkyCanvas: React.FC<SkyCanvasProps> = (props) => {
  return (
    <Provider store={store}>
      <SkyCanvasInner {...props} />
    </Provider>
  );
};

export default SkyCanvas;

