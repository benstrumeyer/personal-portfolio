import React, { useRef, useEffect, useMemo } from 'react';
import p5 from 'p5';
import { SkyCanvasProps, SkyModuleHook, SkyModuleType, SkyState } from '@/types/skyTypes';

/**
 * SkyCanvas Container Component
 * 
 * A React component that manages multiple atmospheric effect modules using P5.js canvas.
 * Each module is implemented as a React hook and integrated into the animation loop.
 */
export const SkyCanvas: React.FC<SkyCanvasProps> = ({
  width,
  height,
  timeMultiplier: _timeMultiplier = 1.0,
  enablePerformanceMode = false,
  enabledModules = ['celestial']
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);
  const modulesRef = useRef<SkyModuleHook[]>([]);

  // Mock sky state for now (will be replaced with Redux in task 1.3)
  const mockSkyState: SkyState = useMemo(() => ({
    currentTime: Date.now(),
    dayProgress: 0.25, // 25% through day cycle
    skyColors: {
      top: '#87CEEB',
      middle: '#B0E0E6',
      bottom: '#F0F8FF',
      horizon: '#FFB347'
    },
    performanceMode: enablePerformanceMode,
    activeModules: {
      celestial: enabledModules.includes('celestial'),
      clouds: enabledModules.includes('clouds'),
      rain: enabledModules.includes('rain'),
      snow: enabledModules.includes('snow'),
      fog: enabledModules.includes('fog')
    }
  }), [enablePerformanceMode, enabledModules]);

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
        update: (_p: p5, _deltaTime: number, _globalState: SkyState) => {
          // Mock update logic
        },
        render: (p: p5, _globalState: SkyState) => {
          // Mock render logic - draw a simple circle for testing
          p.fill(255, 255, 0, 200);
          p.noStroke();
          p.circle(p.width / 2, p.height / 2, 50);
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

          // Clear canvas with sky background color
          const bgColor = mockSkyState.skyColors.top;
          p.background(bgColor);

          // Update all active modules
          modulesRef.current.forEach(module => {
            if (module.isActive && module.isInitialized) {
              module.update(p, deltaTime, mockSkyState);
            }
          });

          // Render all modules in priority order
          modulesRef.current.forEach(module => {
            if (module.isActive && module.isInitialized) {
              module.render(p, mockSkyState);
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
  }, [width, height, enabledModules, enablePerformanceMode, moduleRegistry, mockSkyState]);

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

export default SkyCanvas;

