# Development Workflow - Personal Portfolio

## 🎯 Overview

This project follows a **spec-driven development methodology** that ensures structured, high-quality development through AI-assisted coding. The workflow emphasizes planning before implementation, comprehensive documentation, and consistent patterns across all development activities.

## 🔄 Core Development Process

### 1. Planning Phase (Planner Mode)
**Objective:** Create comprehensive specifications for new features

**Process:**
1. **Requirement Gathering**
   - Understand user needs and business requirements
   - Identify technical constraints and dependencies
   - Consider performance, accessibility, and mobile requirements
   - Review existing architecture and patterns

2. **Specification Creation**
   - Create `requirements.md` with user stories and acceptance criteria
   - Design technical architecture in `design.md`
   - Break down implementation into tasks in `tasks.md`
   - Generate feature overview in `README.md`

3. **Review and Approval**
   - Human review of specifications
   - Validation against project goals and constraints
   - Approval for implementation phase

### 2. Execution Phase (Executor Mode)
**Objective:** Implement approved specifications with high quality

**Process:**
1. **Specification Review**
   - Load and understand approved specifications
   - Review existing codebase and patterns
   - Identify integration points and dependencies

2. **Implementation**
   - Execute tasks from `tasks.md` sequentially
   - Follow established coding standards and patterns
   - Implement proper TypeScript typing and error handling
   - Add comprehensive tests for all functionality

3. **Quality Assurance**
   - Run tests and ensure all pass
   - Perform code review and linting
   - Validate against acceptance criteria
   - Update documentation as needed

### 3. Configuration Phase (Steering Architect Mode)
**Objective:** Maintain and update AI rules and project standards

**Process:**
1. **Analysis**
   - Review existing patterns and conventions
   - Identify areas for improvement or standardization
   - Analyze project evolution and changing requirements

2. **Rule Creation/Updates**
   - Create or update `.ai-rules/` files
   - Ensure rules promote consistency and quality
   - Make rules actionable for AI assistants
   - Document changes and rationale

## 📁 File Organization

### Feature Documentation Structure
```
docs/features/[feature-name]/
├── README.md           # Feature overview and operation
├── requirements.md     # User stories and acceptance criteria
├── design.md          # Technical architecture and components
└── tasks.md           # Step-by-step implementation plan
```

### AI Rules Structure
```
.ai-rules/
├── product.md         # Project vision and goals
├── tech.md           # Technical stack and standards
└── structure.md      # File structure and conventions
```

## 🛠️ Development Standards

### Code Quality Requirements
- **TypeScript:** Strict typing with comprehensive interfaces
- **Performance:** 60fps animations with optimized rendering
- **Accessibility:** WCAG 2.1 AA compliance
- **Testing:** Comprehensive test coverage for all components
- **Documentation:** Clear comments and comprehensive README files

### File Naming Conventions
- **Components:** PascalCase (e.g., `UserProfile.tsx`)
- **Pages:** PascalCase (e.g., `HomePage.tsx`)
- **Utilities:** camelCase (e.g., `formatDate.ts`)
- **Hooks:** camelCase starting with 'use' (e.g., `useLocalStorage.ts`)
- **Types:** PascalCase (e.g., `UserTypes.ts`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### Import Organization
1. React imports (React, hooks, etc.)
2. Third-party libraries (P5.js, GSAP, etc.)
3. Internal components (from components directory)
4. Utilities and types (from utils, types directories)
5. Assets (images, styles, etc.)

## 🎨 Canvas Development Patterns

### P5.js Component Structure
```typescript
// Standard P5.js component pattern
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
```

### Effect Module Pattern
```typescript
// Standard effect module pattern
export const effectModule = {
  setup: (p: p5) => {
    // Initialization logic
  },
  
  draw: (p: p5) => {
    // Animation logic
  },
  
  cleanup: () => {
    // Cleanup logic
  }
};
```

### State Management Pattern
```typescript
// Redux slice for effect state
export const skySlice = createSlice({
  name: 'sky',
  initialState,
  reducers: {
    setTimeOfDay: (state, action) => {
      state.timeOfDay = action.payload;
    },
    toggleEffect: (state, action) => {
      state.effects[action.payload] = !state.effects[action.payload];
    }
  }
});
```

## 🧪 Testing Strategy

### Unit Testing
- **Components:** Test all React components with React Testing Library
- **Hooks:** Test custom hooks with comprehensive scenarios
- **Utilities:** Test all utility functions with edge cases
- **Canvas:** Test P5.js components with mocked canvas contexts

### Integration Testing
- **Feature Integration:** Test complete feature workflows
- **State Management:** Test Redux state changes and side effects
- **API Integration:** Test external service integrations
- **Performance:** Test animation performance and memory usage

### Test Organization
```
src/
├── components/
│   └── __tests__/
│       └── ComponentName.test.tsx
├── hooks/
│   └── __tests__/
│       └── hookName.test.ts
└── utils/
    └── __tests__/
        └── utilityName.test.ts
```

## 🚀 Deployment Process

### Development Environment
1. **Local Development**
   - `npm run dev` for development server
   - Hot reloading for immediate feedback
   - Source maps for debugging

2. **Testing**
   - `npm run test` for unit tests
   - `npm run test:watch` for continuous testing
   - `npm run lint` for code quality

### Production Deployment
1. **Build Process**
   - `npm run build` for production build
   - Optimized bundles with code splitting
   - Asset optimization and compression

2. **Deployment**
   - Automatic deployment to Vercel on main branch
   - Preview deployments for feature branches
   - Environment variable management

## 📋 Quality Gates

### Pre-commit Checks
- [ ] All tests pass
- [ ] Linting passes without errors
- [ ] TypeScript compilation succeeds
- [ ] No console errors or warnings
- [ ] Performance benchmarks met

### Pre-deployment Checks
- [ ] All acceptance criteria met
- [ ] Documentation updated
- [ ] Accessibility compliance verified
- [ ] Performance testing completed
- [ ] Cross-browser compatibility tested

## 🔄 Continuous Improvement

### Regular Reviews
- **Weekly:** Review development progress and blockers
- **Feature Complete:** Post-implementation review and lessons learned
- **Monthly:** Architecture review and technical debt assessment
- **Quarterly:** Process improvement and tool evaluation

### Documentation Updates
- **Feature Changes:** Update relevant documentation
- **Architecture Changes:** Update system architecture docs
- **Process Changes:** Update workflow documentation
- **Tool Changes:** Update development environment setup

## 🎯 Success Metrics

### Development Quality
- **Test Coverage:** > 90% for all components
- **Performance:** 60fps animations on target devices
- **Accessibility:** 100% WCAG 2.1 AA compliance
- **Code Quality:** Zero linting errors and warnings

### Process Efficiency
- **Specification Quality:** Clear, actionable specifications
- **Implementation Speed:** Faster development through AI assistance
- **Bug Rate:** Reduced bugs through comprehensive planning
- **Documentation:** Up-to-date and comprehensive docs

---

*This workflow ensures consistent, high-quality development through structured planning, implementation, and continuous improvement.*
