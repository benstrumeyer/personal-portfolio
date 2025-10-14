import { useState, useCallback, useEffect, useMemo } from 'react';
import p5 from 'p5';
import { SkyModuleHook, SkyModuleType, ModuleConfig } from '@/types/skyTypes';

/**
 * useCelestialModule React Hook
 * 
 * A React hook that implements the SkyModuleHook interface for managing
 * celestial objects (sun and moon) in the sky canvas system.
 * 
 * Features:
 * - Sun and moon positioning based on elliptical paths
 * - Day/night cycle integration
 * - Performance mode configuration
 * - Automatic cleanup and lifecycle management
 */

interface CelestialObject {
  x: number;
  y: number;
  size: number;
  glowIntensity: number;
  color: string;
  isVisible: boolean;
}

interface CelestialModuleState {
  sun: CelestialObject;
  moon: CelestialObject;
  isInitialized: boolean;
  performanceMode: 'high' | 'medium' | 'low';
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * useCelestialModule hook implementation
 */
export const useCelestialModule = (): SkyModuleHook => {
  // Module state management
  const [state, setState] = useState<CelestialModuleState>({
    sun: {
      x: 0,
      y: 0,
      size: 60,
      glowIntensity: 0.8,
      color: '#FFD700', // Gold
      isVisible: true,
    },
    moon: {
      x: 0,
      y: 0,
      size: 45,
      glowIntensity: 0.6,
      color: '#E6E6FA', // Lavender
      isVisible: false,
    },
    isInitialized: false,
    performanceMode: 'high',
    canvasWidth: 800,
    canvasHeight: 600,
  });

  // Calculate sun position based on day progress (0-1)
  const calculateSunPosition = useCallback((dayProgress: number) => {
    // Elliptical path for sun movement
    const centerX = state.canvasWidth / 2;
    const centerY = state.canvasHeight * 0.8; // Sun goes below horizon
    const radiusX = state.canvasWidth * 0.6;
    const radiusY = state.canvasHeight * 0.4;
    
    // Map day progress to angle (0 = midnight, 0.5 = noon)
    const angle = (dayProgress - 0.25) * 2 * Math.PI; // Start at dawn (0.25)
    
    const x = centerX + Math.cos(angle) * radiusX;
    const y = centerY + Math.sin(angle) * radiusY;
    
    return { x, y, isVisible: dayProgress >= 0.2 && dayProgress <= 0.8 };
  }, [state.canvasWidth, state.canvasHeight]);

  // Calculate moon position (opposite of sun)
  const calculateMoonPosition = useCallback((dayProgress: number) => {
    // Moon follows opposite path to sun
    const centerX = state.canvasWidth / 2;
    const centerY = state.canvasHeight * 0.8;
    const radiusX = state.canvasWidth * 0.6;
    const radiusY = state.canvasHeight * 0.4;
    
    // Moon is 180 degrees offset from sun
    const angle = (dayProgress - 0.25) * 2 * Math.PI + Math.PI;
    
    const x = centerX + Math.cos(angle) * radiusX;
    const y = centerY + Math.sin(angle) * radiusY;
    
    return { x, y, isVisible: dayProgress < 0.2 || dayProgress > 0.8 };
  }, [state.canvasWidth, state.canvasHeight]);

  // Update celestial object positions based on day progress
  const updatePositions = useCallback((dayProgress: number) => {
    const sunPos = calculateSunPosition(dayProgress);
    const moonPos = calculateMoonPosition(dayProgress);
    
    setState(prev => ({
      ...prev,
      sun: {
        ...prev.sun,
        x: sunPos.x,
        y: sunPos.y,
        isVisible: sunPos.isVisible,
      },
      moon: {
        ...prev.moon,
        x: moonPos.x,
        y: moonPos.y,
        isVisible: moonPos.isVisible,
      },
    }));
  }, [calculateSunPosition, calculateMoonPosition]);

  // Render celestial object with glow effect
  const renderCelestialObject = useCallback((
    p: p5, 
    obj: CelestialObject, 
    isSun: boolean = true
  ) => {
    if (!obj.isVisible) return;
    
    p.push();
    
    // Draw glow effect (multiple circles with decreasing opacity)
    const glowLayers = state.performanceMode === 'high' ? 8 : 
                      state.performanceMode === 'medium' ? 5 : 3;
    
    for (let i = glowLayers; i > 0; i--) {
      const alpha = (obj.glowIntensity * (1 - i / glowLayers)) * 255;
      const size = obj.size + (glowLayers - i) * 15;
      
      p.fill(p.red(obj.color), p.green(obj.color), p.blue(obj.color), alpha);
      p.noStroke();
      p.circle(obj.x, obj.y, size);
    }
    
    // Draw main object
    p.fill(obj.color);
    p.noStroke();
    p.circle(obj.x, obj.y, obj.size);
    
    // Add atmospheric effects for sun
    if (isSun && state.performanceMode === 'high') {
      // Sun rays
      const rayCount = 12;
      const rayLength = obj.size * 1.5;
      
      p.stroke(obj.color);
      p.strokeWeight(2);
      p.strokeCap(p.ROUND);
      
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * 2 * Math.PI;
        const endX = obj.x + Math.cos(angle) * rayLength;
        const endY = obj.y + Math.sin(angle) * rayLength;
        
        p.line(obj.x, obj.y, endX, endY);
      }
    }
    
    p.pop();
  }, [state.performanceMode]);

  // Hook lifecycle methods
  const initialize = useCallback((_p: p5, config: ModuleConfig) => {
    setState(prev => ({
      ...prev,
      isInitialized: true,
      canvasWidth: config.canvasWidth,
      canvasHeight: config.canvasHeight,
      performanceMode: config.performanceMode,
    }));
    
    console.log('Celestial module initialized with config:', config);
  }, []);

  const update = useCallback((_p: p5, _deltaTime: number, globalState: any) => {
    if (!state.isInitialized) return;
    
    // Update positions based on day progress
    const dayProgress = globalState.global?.dayProgress || 0.25;
    updatePositions(dayProgress);
  }, [state.isInitialized, updatePositions]);

  const render = useCallback((p: p5, _globalState: any) => {
    if (!state.isInitialized) return;
    
    // Render sun and moon
    renderCelestialObject(p, state.sun, true);
    renderCelestialObject(p, state.moon, false);
  }, [state.isInitialized, state.sun, state.moon, renderCelestialObject]);

  const setPerformanceMode = useCallback((mode: 'high' | 'medium' | 'low') => {
    setState(prev => ({
      ...prev,
      performanceMode: mode,
    }));
    
    console.log(`Celestial module performance mode set to: ${mode}`);
  }, []);

  // Create the hook object that implements SkyModuleHook interface
  const hook: SkyModuleHook = useMemo(() => ({
    type: 'celestial' as SkyModuleType,
    name: 'Celestial Objects',
    isActive: true,
    priority: 100,
    isInitialized: state.isInitialized,
    initialize,
    update,
    render,
    setPerformanceMode,
  }), [
    state.isInitialized,
    initialize,
    update,
    render,
    setPerformanceMode,
  ]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      console.log('Celestial module cleanup');
      setState(prev => ({
        ...prev,
        isInitialized: false,
      }));
    };
  }, []);

  return hook;
};

export default useCelestialModule;
