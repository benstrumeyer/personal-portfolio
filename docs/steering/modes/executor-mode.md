# Executor Mode - Implementation Guide

## 🎯 Mode Overview

**Role:** Meticulous Engineer  
**Primary Function:** Implement approved specifications with high quality  
**Focus:** Code implementation following established patterns and standards  

## 🚀 When to Use Executor Mode

### Ideal Scenarios
- Implementing approved feature specifications
- Following up on incomplete implementations
- Fixing bugs identified in specifications
- Refactoring code according to updated specs
- Completing partially implemented features

### Prerequisites
- Approved specifications in `docs/features/[feature-name]/`
- Clear understanding of existing codebase patterns
- Access to relevant documentation and examples
- Understanding of project architecture and constraints

## 📋 Implementation Process

### 1. Specification Review
**Objective:** Understand the complete implementation requirements

**Review Checklist:**
- [ ] Read and understand `requirements.md`
- [ ] Review technical design in `design.md`
- [ ] Study implementation tasks in `tasks.md`
- [ ] Understand feature overview in `README.md`
- [ ] Review existing codebase patterns and conventions

**Key Information to Gather:**
- Complete feature scope and requirements
- Technical architecture and component design
- Integration points with existing systems
- Performance and accessibility requirements
- Testing and validation approaches

### 2. Codebase Analysis
**Objective:** Understand existing patterns and integration points

**Analysis Areas:**
- Component architecture and patterns
- State management approaches
- Canvas and P5.js integration
- Styling and theming systems
- Testing strategies and coverage
- Import/export patterns

**Key Files to Review:**
- Similar existing components
- Relevant hooks and utilities
- State management slices
- Type definitions
- Test files and patterns

### 3. Sequential Implementation
**Objective:** Execute tasks in order with quality assurance

**Implementation Approach:**
- Execute tasks from `tasks.md` sequentially
- Implement one task at a time with clear progress updates
- Follow established coding standards and patterns
- Add comprehensive tests for all functionality
- Update documentation as implementation progresses

## 🛠️ Implementation Standards

### Code Quality Requirements
- **TypeScript:** Strict typing with comprehensive interfaces
- **Performance:** Optimized rendering and memory management
- **Accessibility:** Screen reader support and keyboard navigation
- **Testing:** Unit tests for all components and utilities
- **Documentation:** Clear comments and comprehensive README files

### Component Implementation Pattern
```typescript
// Standard React component implementation
import React from 'react';
import { ComponentProps } from './types';

interface Props {
  // Define props interface with proper typing
}

export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // Component logic with proper hooks and state management
  
  return (
    <div>
      {/* JSX content with proper accessibility */}
    </div>
  );
};

export default ComponentName;
```

### P5.js Canvas Implementation Pattern
```typescript
// P5.js canvas component implementation
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
          // Animation loop with performance optimization
        };

        p.mousePressed = () => {
          // Mouse interaction with proper event handling
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

### Effect Module Implementation Pattern
```typescript
// Effect module implementation
export const effectModule = {
  setup: (p: p5) => {
    // Initialization logic with proper setup
  },
  
  draw: (p: p5) => {
    // Animation logic with performance optimization
  },
  
  cleanup: () => {
    // Cleanup logic with proper resource management
  }
};
```

## 🧪 Testing Implementation

### Component Testing
```typescript
// Component test implementation
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName prop1="value" />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    // Test user interactions and state changes
  });

  it('meets accessibility requirements', () => {
    // Test accessibility compliance
  });
});
```

### Hook Testing
```typescript
// Hook test implementation
import { renderHook, act } from '@testing-library/react';
import { useCustomHook } from './useCustomHook';

describe('useCustomHook', () => {
  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.value).toBe(expectedValue);
  });

  it('updates state correctly', () => {
    // Test state updates and side effects
  });
});
```

## 📊 Progress Tracking

### Task Completion Updates
**Format for progress updates:**
```
✅ Task 1: [Task Description] - COMPLETED
   - Implementation: [Brief description of what was implemented]
   - Testing: [Testing approach and results]
   - Documentation: [Documentation updates made]

🔄 Task 2: [Task Description] - IN PROGRESS
   - Current status: [What's been done so far]
   - Next steps: [What needs to be done next]
   - Blockers: [Any issues or dependencies]

⏳ Task 3: [Task Description] - PENDING
   - Dependencies: [What needs to be completed first]
   - Estimated time: [Time estimate for completion]
```

### Quality Assurance Checklist
- [ ] All acceptance criteria met
- [ ] Code follows established patterns
- [ ] TypeScript typing is comprehensive
- [ ] Tests are comprehensive and passing
- [ ] Performance requirements met
- [ ] Accessibility requirements met
- [ ] Documentation is updated
- [ ] No linting errors or warnings

## 🔄 Integration and Validation

### Integration Testing
- **Component Integration:** Test integration with existing components
- **State Management:** Verify Redux state changes and side effects
- **Canvas Integration:** Test P5.js integration and performance
- **API Integration:** Test external service integrations if applicable

### Performance Validation
- **Animation Performance:** Ensure 60fps target is met
- **Memory Usage:** Verify no memory leaks or excessive usage
- **Bundle Size:** Check impact on overall bundle size
- **Loading Performance:** Ensure fast initial load times

### Accessibility Validation
- **Keyboard Navigation:** Test all interactive elements
- **Screen Reader:** Verify screen reader compatibility
- **Color Contrast:** Check color contrast ratios
- **Focus Management:** Ensure proper focus handling

## 🚀 Getting Started

### Initial Prompt
```
I'm in Executor mode. Go and execute the tasks in `docs/features/[feature-name]/tasks.md`

Please:
1. Review the approved specifications
2. Understand the existing codebase patterns
3. Implement tasks sequentially with progress updates
4. Ensure all quality standards are met
5. Update documentation as needed

Let's start with reviewing the specifications and understanding the requirements.
```

### Progress Updates
**Regular progress updates should include:**
- Current task status and completion percentage
- Any issues or blockers encountered
- Quality assurance results
- Next steps and timeline
- Documentation updates made

## 📋 Completion Criteria

### Feature Completion Checklist
- [ ] All tasks from `tasks.md` completed
- [ ] All acceptance criteria from `requirements.md` met
- [ ] Technical design from `design.md` implemented
- [ ] Comprehensive tests written and passing
- [ ] Documentation updated and accurate
- [ ] Performance and accessibility requirements met
- [ ] Code review completed and approved
- [ ] Integration testing completed successfully

### Handoff Requirements
- **Implementation Summary:** Brief overview of what was implemented
- **Testing Results:** Test coverage and results summary
- **Performance Metrics:** Performance benchmarks and optimization results
- **Documentation Updates:** List of documentation files updated
- **Known Issues:** Any known issues or limitations
- **Future Considerations:** Recommendations for future improvements

---

*Executor mode ensures high-quality implementation of approved specifications following established patterns and standards.*
