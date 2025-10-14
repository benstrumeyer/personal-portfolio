import { renderHook } from '@testing-library/react';
import { useCelestialModule } from '../useCelestialModule';

// Mock P5.js for testing
const mockP5 = {
  red: jest.fn((_color) => 255),
  green: jest.fn((_color) => 255),
  blue: jest.fn((_color) => 0),
  fill: jest.fn(),
  noStroke: jest.fn(),
  circle: jest.fn(),
  line: jest.fn(),
  stroke: jest.fn(),
  strokeWeight: jest.fn(),
  strokeCap: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  ROUND: 'round',
};

describe('useCelestialModule', () => {
  it('should create a hook that implements SkyModuleHook interface', () => {
    const { result } = renderHook(() => useCelestialModule());
    const hook = result.current;

    // Test interface compliance
    expect(hook.type).toBe('celestial');
    expect(hook.name).toBe('Celestial Objects');
    expect(hook.isActive).toBe(true);
    expect(hook.priority).toBe(100);
    expect(hook.isInitialized).toBe(false);
    expect(typeof hook.initialize).toBe('function');
    expect(typeof hook.update).toBe('function');
    expect(typeof hook.render).toBe('function');
    expect(typeof hook.setPerformanceMode).toBe('function');
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useCelestialModule());
    const hook = result.current;

    const mockConfig = {
      canvasWidth: 800,
      canvasHeight: 600,
      performanceMode: 'high' as const,
      customSettings: {},
    };

    hook.initialize(mockP5 as any, mockConfig);
    
    // Hook should now be initialized
    expect(result.current.isInitialized).toBe(true);
  });

  it('should update performance mode', () => {
    const { result } = renderHook(() => useCelestialModule());
    const hook = result.current;

    hook.setPerformanceMode('medium');
    
    // Performance mode should be updated
    expect(hook.setPerformanceMode).toBeDefined();
  });

  it('should render without errors', () => {
    const { result } = renderHook(() => useCelestialModule());
    const hook = result.current;

    // Initialize first
    const mockConfig = {
      canvasWidth: 800,
      canvasHeight: 600,
      performanceMode: 'high' as const,
      customSettings: {},
    };
    
    hook.initialize(mockP5 as any, mockConfig);
    
    // Mock global state
    const mockGlobalState = {
      global: {
        dayProgress: 0.5, // Noon
      },
    };

    // Should not throw errors
    expect(() => {
      hook.update(mockP5 as any, 16, mockGlobalState);
      hook.render(mockP5 as any, mockGlobalState);
    }).not.toThrow();
  });

  it('should handle cleanup properly', () => {
    const { unmount } = renderHook(() => useCelestialModule());
    
    // Unmount should not throw errors
    expect(() => unmount()).not.toThrow();
  });
});
