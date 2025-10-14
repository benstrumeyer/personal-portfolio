import React, { useRef, useEffect, useMemo } from 'react';
import p5 from 'p5';
import { Provider } from 'react-redux';
import { SkyCanvasProps, SkyModuleHook, SkyModuleType } from '@/types/skyTypes';
import { useAppDispatch } from '@/store/hooks';
import { updateTime, updateSkyColors, updateFrameRate } from '@/store/skySlice';
import store from '@/store';

/**
 * Helper function to convert hex color to RGB
 */
function hexToRgb(hex: string | undefined): { r: number; g: number; b: number } {
  if (!hex) return { r: 0, g: 0, b: 0 };
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1] || '00', 16),
    g: parseInt(result[2] || '00', 16),
    b: parseInt(result[3] || '00', 16)
  } : { r: 0, g: 0, b: 0 };
}

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

  // Sky state is accessed directly from store in the P5.js draw loop

  // Module registry for dynamic module loading
  const moduleRegistry: Record<string, () => SkyModuleHook> = useMemo(() => ({
    celestial: () => {
      // Mock celestial module for now (will be implemented in task 2.1)
      return {
        type: 'celestial',
        name: 'Celestial Objects',
        isActive: true,
        priority: 100,
        isInitialized: false,
        initialize: (_p: p5) => {
          console.log('Celestial module initialized');
        },
        update: (_p: p5, _deltaTime: number, _globalState: any) => {
          // Mock update logic
        },
        render: (_p: p5, _globalState: any) => {
          // Mock render logic - placeholder for future celestial objects
        },
        setPerformanceMode: (mode: 'high' | 'medium' | 'low') => {
          console.log(`Celestial module performance mode: ${mode}`);
        }
      };
    }
    // Additional modules will be added in future tasks
  }), []);

  // Initialize P5.js canvas and modules
  useEffect(() => {
    if (canvasRef.current && !p5Instance.current) {
      const sketch = (p: p5) => {
        let lastTime = 0;

        p.setup = () => {
          p.createCanvas(width, height);
          
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

          // Create gradient background based on current sky colors
          const { top, middle, bottom } = currentSkyState.sky.colors.current;
          
          // Create vertical gradient from top to bottom
          for (let i = 0; i <= p.height; i++) {
            const inter = i / p.height;
            let r, g, b;
            
            if (inter < 0.5) {
              // Top half: blend top and middle colors
              const t = inter * 2;
              const topColor = hexToRgb(top);
              const middleColor = hexToRgb(middle);
              r = Math.round(topColor.r + (middleColor.r - topColor.r) * t);
              g = Math.round(topColor.g + (middleColor.g - topColor.g) * t);
              b = Math.round(topColor.b + (middleColor.b - topColor.b) * t);
            } else {
              // Bottom half: blend middle and bottom colors
              const t = (inter - 0.5) * 2;
              const middleColor = hexToRgb(middle);
              const bottomColor = hexToRgb(bottom);
              r = Math.round(middleColor.r + (bottomColor.r - middleColor.r) * t);
              g = Math.round(middleColor.g + (bottomColor.g - middleColor.g) * t);
              b = Math.round(middleColor.b + (bottomColor.b - middleColor.b) * t);
            }
            
            p.stroke(r, g, b);
            p.line(0, i, p.width, i);
          }

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
      ref={canvasRef} 
      className="sky-canvas"
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        position: 'relative'
      }}
    />
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

