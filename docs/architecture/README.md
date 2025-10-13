# Architecture Overview

## System Architecture

The Personal Portfolio is an interactive single-page application (SPA) built with React, TypeScript, and P5.js, featuring an immersive canvas-based experience with environmental effects and interactive animations.

## Core Architecture Principles

- **Component-Based:** Modular React components with P5.js canvas integration
- **Type-Safe:** Full TypeScript implementation with strict typing
- **Performance-First:** 60fps canvas animations with optimized particle systems
- **Interactive:** Mouse/touch-driven effects and environmental interactions
- **Immersive:** Canvas-based visual experience with atmospheric effects
- **Responsive:** Mobile-first design with touch event support
- **Accessible:** WCAG 2.1 AA compliance with keyboard navigation

## Technology Stack

### Frontend
- **React 18+** - Component library with hooks and modern features
- **TypeScript** - Type safety and developer experience
- **Vite** - Fast build tool and development server
- **P5.js** - Canvas rendering and interactive graphics
- **GSAP** - High-performance animations and timeline control
- **React Router** - Client-side routing
- **Redux Toolkit** - State management for effects and application state

### Canvas & Graphics
- **P5.js** - Main canvas rendering engine
- **WebGL 2.0** - Hardware-accelerated graphics (with 2D fallback)
- **Particle Systems** - Object-pooled particle effects
- **Environmental Effects** - Weather, lighting, and atmospheric systems

### Development Tools
- **ESLint + Prettier** - Code quality and formatting
- **Jest + React Testing Library** - Testing framework
- **Husky** - Git hooks for quality gates

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI elements (Button, Input, etc.)
│   ├── layout/         # Layout components (Header, Footer, etc.)
│   ├── canvas/         # P5.js canvas components
│   │   ├── BackgroundCanvas.tsx    # Main background with landscape
│   │   ├── SkyCanvas.tsx           # Sun/moon movement
│   │   └── WeatherCanvas.tsx       # Snow, rain effects
│   ├── effects/        # Interactive effects
│   │   ├── LaserEffect.tsx         # Click laser animations
│   │   ├── FireworkEffect.tsx      # Firework animations
│   │   └── ParticleEffect.tsx      # General particle systems
│   └── sections/       # Page sections (Hero, About, etc.)
├── pages/              # Route components
├── hooks/              # Custom React hooks
│   ├── useP5Canvas.ts  # P5.js canvas hook
│   ├── useAnimation.ts # Animation control hook
│   └── useEffects.ts   # Effects management hook
├── utils/              # Utility functions
│   ├── p5Helpers.ts    # P5.js utility functions
│   ├── mathUtils.ts    # Mathematical calculations
│   └── colorUtils.ts   # Color manipulation
├── types/              # TypeScript type definitions
│   ├── p5Types.ts      # P5.js related types
│   ├── effectTypes.ts  # Effect system types
│   └── animationTypes.ts # Animation types
├── assets/             # Static assets
│   ├── images/         # Images and textures
│   ├── sounds/         # Audio files for effects
│   └── shaders/        # WebGL shaders (if needed)
└── styles/             # Global styles (minimal CSS)
```

## Data Flow

- **State Management:** Redux for effects state, React Context for UI state
- **Canvas Management:** P5.js instances with proper lifecycle management
- **Effects System:** Event-driven particle systems and animations
- **Performance Monitoring:** Frame rate tracking and optimization

## Performance Considerations

- **Canvas Performance:** Maintain 60fps with optimized draw loops
- **Memory Management:** Object pooling for particles and effects
- **Code Splitting:** Lazy loading for effect components
- **Bundle Optimization:** Tree shaking and P5.js module optimization
- **Image Optimization:** WebP textures with fallbacks
- **Animation Optimization:** requestAnimationFrame and GSAP timelines

## Security

- **Content Security Policy:** Implemented headers
- **XSS Protection:** Input sanitization
- **HTTPS:** Enforced for all connections

## Browser Support

- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile:** iOS Safari 14+, Chrome Mobile 90+
- **Canvas Support:** WebGL 2.0 for advanced effects, Canvas 2D fallback
- **Touch Events:** Full touch support for mobile interactions
- **Progressive Enhancement:** Graceful degradation for older browsers

## Canvas Architecture

### Layer System
- **Background Layer:** Static landscape and environment
- **Weather Layer:** Dynamic weather effects (snow, rain, clouds)
- **Sky Layer:** Sun/moon movement and atmospheric effects
- **Interactive Layer:** User-triggered effects (lasers, fireworks)

### Effect System
- **Particle Systems:** Object-pooled particles for performance
- **Environmental Effects:** Weather, lighting, and atmospheric changes
- **Interactive Effects:** Mouse/touch-driven animations
- **Performance Monitoring:** Frame rate tracking and optimization

## Documentation Index

- [Canvas Architecture](./canvas-architecture.md)
- [Effects System](./effects-system.md)
- [Performance Optimization](./performance-optimization.md)
- [Component Architecture](./component-architecture.md)
- [Security Implementation](./security-implementation.md)

