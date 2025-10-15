---
title: Project Structure
description: "Defines file organization, naming conventions, and development standards."
inclusion: always
---

# Project Structure & Conventions

## Directory Organization
```
.
├── .ai-rules/              # AI steering files (this directory)
│   ├── product.md         # Project vision and goals
│   ├── tech.md           # Technical stack and standards
│   └── structure.md      # File structure and conventions (this file)
├── docs/                  # Project documentation
│   ├── architecture/     # System architecture docs
│   ├── features/         # Feature specifications
│   ├── operations/       # Deployment and operations
│   └── schemas/          # Data models and schemas
├── src/                   # Source code
├── public/                # Static assets
└── tests/                 # Test files
```

## File Naming Conventions
- **Components:** PascalCase (e.g., `UserProfile.tsx`)
- **Pages:** PascalCase (e.g., `HomePage.tsx`)
- **Utilities:** camelCase (e.g., `formatDate.ts`)
- **Hooks:** camelCase starting with 'use' (e.g., `useLocalStorage.ts`)
- **Types:** PascalCase (e.g., `UserTypes.ts`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

## Component Structure

### Standard React Component
```typescript
// Component file structure
import React from 'react';
import { ComponentProps } from './types';

interface Props {
  // Define props interface
}

export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // Component logic
  
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

### P5.js Canvas Component
```typescript
// P5.js canvas component structure
import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import { P5Types } from '@/types/p5Types';

interface CanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (p: p5) => void;
}

export const CanvasComponent: React.FC<CanvasProps> = ({ 
  width = 800, 
  height = 600,
  onCanvasReady 
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);

  useEffect(() => {
    if (canvasRef.current && !p5Instance.current) {
      const sketch = (p: p5) => {
        p.setup = () => {
          p.createCanvas(width, height);
          onCanvasReady?.(p);
        };

        p.draw = () => {
          // Animation loop
        };

        p.mousePressed = () => {
          // Mouse interaction
        };
      };

      p5Instance.current = new p5(sketch, canvasRef.current);
    }

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, [width, height, onCanvasReady]);

  return <div ref={canvasRef} />;
};

export default CanvasComponent;
```

## Import Organization
1. **React imports** (React, hooks, etc.)
2. **Third-party libraries** (P5.js, GSAP, etc.)
3. **Internal components** (from components directory)
4. **Utilities and types** (from utils, types directories)
5. **Assets** (images, styles, etc.)

## Custom Hooks Conventions
```typescript
// P5.js Canvas Hook Example
export const useP5Canvas = (width: number, height: number) => {
  const [p5Instance, setP5Instance] = useState<p5 | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Canvas setup and cleanup logic
  }, [width, height]);

  return { p5Instance, canvasRef };
};

// Animation Control Hook Example
export const useAnimation = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [frameRate, setFrameRate] = useState(60);

  const toggleAnimation = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return { isPlaying, frameRate, toggleAnimation };
};
```

## Documentation Standards
- **README files:** Present in each major directory
- **Code comments:** Explain complex logic, not obvious code
- **Type definitions:** Comprehensive TypeScript interfaces
- **API documentation:** JSDoc comments for public functions

## Git Workflow
- **Branch naming:** `feature/feature-name`, `bugfix/issue-description`
- **Commit messages:** Conventional commits format
- **Pull requests:** Required for all changes to main branch

## Environment Configuration
- **Development:** `.env.local` for local development
- **Production:** Environment variables via deployment platform
- **Secrets:** Never commit API keys or sensitive data
- **Configuration:** Centralized config files for different environments

## Asset Management
- **Images:** Store in `src/assets/images/` with descriptive names
- **Icons:** Use icon libraries (Lucide React) instead of custom SVGs when possible
- **Fonts:** Load from Google Fonts or local font files
- **Styles:** Global styles in `src/styles/`, minimal CSS for layout only
- **P5.js Assets:** Store textures and sprites in `src/assets/images/`
- **Audio:** Store sound effects in `src/assets/sounds/` (optional)
- **Shaders:** Store WebGL shaders in `src/assets/shaders/` (if needed)

## Interactive Effects Conventions
- **Effect Components:** Each effect should be a separate component with clear lifecycle
- **Particle Systems:** Use object pooling for performance with large particle counts
- **Mouse/Touch Events:** Handle both mouse and touch events for mobile compatibility
- **Performance Monitoring:** Implement frame rate monitoring for debugging
- **Effect States:** Use React state to manage effect activation/deactivation
- **Canvas Layers:** Organize effects into logical layers (background, weather, interactive)

## Testing Structure
- **Unit tests:** Co-located with components in `__tests__` folders
- **Integration tests:** In `tests/integration/` directory
- **E2E tests:** In `tests/e2e/` directory (if needed)
- **Test files:** End with `.test.tsx` or `.spec.tsx`

## Build and Deployment
- **Build output:** `dist/` directory
- **Static assets:** Served from `public/` directory
- **Environment builds:** Separate builds for development and production
- **Source maps:** Generated for development, excluded from production
