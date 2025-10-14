import React, { useRef, useEffect, useMemo, useState } from 'react';
import p5 from 'p5';
import { Provider } from 'react-redux';
import { SkyCanvasProps, SkyModuleHook, SkyModuleType } from '@/types/skyTypes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateTime, updateSkyColors, updateFrameRate } from '@/store/skySlice';
import { createCelestialModule } from '@/modules/celestialModule';
import { createSnowModule } from '@/modules/snowModule';
import { createMountainsModule } from '@/modules/mountainsModule';
import { useResponsiveConfig } from '@/hooks/useMediaQuery';
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
  enabledModules: _enabledModules = ['celestial']
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);
  const modulesRef = useRef<SkyModuleHook[]>([]);
  const dispatch = useAppDispatch();
  const [dimensions, setDimensions] = useState({ width: width || window.innerWidth, height: height || window.innerHeight });

  // Get current sky state
  const currentSkyState = useAppSelector(state => state.sky);
  
  // Get enabled modules from Redux store - memoized to prevent infinite re-renders
  const enabledModules = useMemo(() => {
    return Object.keys(currentSkyState.modules.enabled)
      .filter(moduleType => currentSkyState.modules.enabled[moduleType as SkyModuleType])
      .map(moduleType => moduleType as SkyModuleType);
  }, [currentSkyState.modules.enabled]);
  
  // Get responsive configuration
  const responsiveConfig = useResponsiveConfig();

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Get the actual canvas container dimensions, not window dimensions
      const containerElement = canvasRef.current?.parentElement;
      const newWidth = width || (containerElement ? containerElement.clientWidth : window.innerWidth);
      const newHeight = height || (containerElement ? containerElement.clientHeight : window.innerHeight);
      
      console.log('SkyCanvas resize:', {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        containerWidth: containerElement?.clientWidth,
        containerHeight: containerElement?.clientHeight,
        newWidth,
        newHeight,
        currentDimensions: dimensions
      });
      
      // Only update if dimensions actually changed
      if (newWidth !== dimensions.width || newHeight !== dimensions.height) {
        setDimensions({ width: newWidth, height: newHeight });
        
        if (p5Instance.current) {
          p5Instance.current.resizeCanvas(newWidth, newHeight);
          
          // Update module configurations with new dimensions
          modulesRef.current.forEach(module => {
            if (module.isInitialized && 'updateCanvasDimensions' in module) {
              (module as any).updateCanvasDimensions(newWidth, newHeight);
            }
          });
        }
      }
    };

    // Call handleResize immediately to set initial dimensions
    handleResize();
    
    // Use ResizeObserver to detect container size changes
    let resizeObserver: ResizeObserver | null = null;
    const containerElement = canvasRef.current?.parentElement;
    
    if (containerElement && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(containerElement);
    }
    
    // Also listen for window resize as fallback
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [width, height, enablePerformanceMode, dimensions.width, dimensions.height]);

  // Update CSS gradient background when sky colors change
  useEffect(() => {
    const { top, middle, bottom } = currentSkyState.sky.colors.current;
    const gradientStyle = `linear-gradient(to bottom, ${top} 0%, ${middle} 50%, ${bottom} 100%)`;
    
    if (canvasRef.current) {
      canvasRef.current.style.background = gradientStyle;
    }
  }, [currentSkyState.sky.colors.current]);

  // Update celestial module with responsive configuration
  useEffect(() => {
    modulesRef.current.forEach(module => {
      if (module.isInitialized && 'updateResponsiveConfig' in module) {
        (module as any).updateResponsiveConfig(responsiveConfig);
      }
    });
  }, [responsiveConfig]);

  // Module registry for dynamic module loading - memoized to prevent infinite re-renders
  const moduleRegistry: Record<string, () => SkyModuleHook> = useMemo(() => ({
    celestial: () => createCelestialModule(),
    snow: () => createSnowModule(),
    mountains: () => createMountainsModule(),
    // Additional modules will be added in future tasks
  }), []);

  // Initialize P5.js canvas and modules
  useEffect(() => {
    if (canvasRef.current) {
      // Clean up existing P5 instance if it exists
      if (p5Instance.current) {
        modulesRef.current = [];
        p5Instance.current.remove();
        p5Instance.current = null;
      }
      const sketch = (p: p5) => {
        let lastTime = 0;

        p.setup = () => {
          p.createCanvas(dimensions.width, dimensions.height);
          
          // Set transparent background so CSS gradient shows through
          p.clear();
          p.background(0, 0, 0, 0); // Transparent background
          
          // Initialize enabled modules
          modulesRef.current = enabledModules
            .map((moduleType: SkyModuleType) => {
              const moduleFactory = moduleRegistry[moduleType];
              if (moduleFactory) {
                const module = moduleFactory();
                module.initialize(p, {
                  canvasWidth: dimensions.width,
                  canvasHeight: dimensions.height,
                  performanceMode: enablePerformanceMode ? 'medium' : 'high'
                });
                
                // Immediately update with current responsive config after initialization
                if ('updateResponsiveConfig' in module) {
                  (module as any).updateResponsiveConfig(responsiveConfig);
                }
                
                return module;
              }
              return null;
            })
            .filter((module): module is SkyModuleHook => module !== null)
            .sort((a, b) => a.priority - b.priority); // Sort by priority for rendering order

          // SkyCanvas initialized
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

          // Clear canvas with transparent background
          p.clear();
          p.background(0, 0, 0, 0); // Transparent background

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
  }, [dimensions.width, dimensions.height, enabledModules, enablePerformanceMode, moduleRegistry, dispatch]);

  // Removed duplicate resize handler - using the comprehensive one above

  return (
    <div 
      className="sky-canvas"
      style={{ 
        width: width ? `${width}px` : '100vw', 
        height: height ? `${height}px` : '100vh',
        position: 'relative'
      }}
    >
      <div 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          background: `linear-gradient(to bottom, ${currentSkyState.sky.colors.current.top} 0%, ${currentSkyState.sky.colors.current.middle} 50%, ${currentSkyState.sky.colors.current.bottom} 100%)`
        }}
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

