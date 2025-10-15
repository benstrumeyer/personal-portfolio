---
title: Technical Stack
description: "Defines the technology stack, development standards, and technical requirements."
inclusion: always
---

# Technical Stack & Standards

## Core Technology Stack
- **Frontend Framework:** React 18+ with TypeScript
- **Build Tool:** Vite (for fast development and optimized builds)
- **Canvas Engine:** P5.js
- **State Management:** React Context API (for simple state) / Redux (for complex state)
- **Routing:** React Router v6
- **Animation:** GSAP
- **Icons:** Lucide React or Heroicons

## Development Standards
- **Code Style:** ESLint + Prettier configuration
- **TypeScript:** Strict mode enabled
- **Component Architecture:** Functional components with hooks
- **File Naming:** PascalCase for components, camelCase for utilities
- **Import Organization:** Absolute imports with path mapping
- **P5.js Integration:** Use React P5 wrapper for canvas management
- **Canvas Management:** One main canvas per component, proper cleanup on unmount
- **Animation Loops:** Use P5.js draw() loop for smooth 60fps animations

## Code Quality Standards
- **Testing:** Jest + React Testing Library for unit tests
- **Linting:** ESLint with React and TypeScript rules
- **Formatting:** Prettier with consistent configuration
- **Type Safety:** Strict TypeScript configuration
- **Performance:** React.memo for optimization, lazy loading for routes

## File Structure Conventions
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

## Performance Requirements
- **Bundle Size:** Keep main bundle under 250KB gzipped
- **Canvas Performance:** Maintain 60fps for smooth animations
- **Loading:** Implement code splitting and lazy loading for effect components
- **Memory Management:** Proper cleanup of P5.js instances and event listeners
- **Particle Systems:** Optimize particle counts and use object pooling
- **Images:** Optimize and use modern formats (WebP, AVIF) for textures
- **Fonts:** Use font-display: swap for better loading experience
- **Animation Optimization:** Use requestAnimationFrame and avoid blocking operations

## Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile:** iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement:** Graceful degradation for older browsers
- **Canvas Support:** WebGL 2.0 for advanced effects, Canvas 2D fallback
- **Touch Events:** Full touch support for mobile interactions

## Deployment
- **Platform:** Vercel or Netlify for static hosting
- **Domain:** Custom domain with SSL certificate
- **CDN:** Built-in CDN for global performance