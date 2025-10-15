# Planner Mode - Feature Specification Guide

## 🎯 Mode Overview

**Role:** Junior Architect  
**Primary Function:** Create comprehensive technical specifications for new features  
**Focus:** Planning and design before implementation  

## 🚀 When to Use Planner Mode

### Ideal Scenarios
- Starting a new feature from scratch
- Adding complex functionality to existing features
- Refactoring or restructuring major components
- Planning integration with external services
- Creating new interactive effects or canvas features

### Not Suitable For
- Simple bug fixes or minor updates
- Implementing already-specified features
- Code review or debugging sessions
- Configuration or setup tasks

## 📋 Planning Process

### 1. Requirement Gathering
**Objective:** Understand the complete scope and context

**Key Questions to Ask:**
- What specific functionality is needed?
- Who will use this feature and how?
- What are the performance requirements?
- How does this integrate with existing features?
- What accessibility considerations are needed?
- What are the success criteria?

**Information to Gather:**
- User stories and use cases
- Technical constraints and dependencies
- Performance and accessibility requirements
- Integration points with existing systems
- Testing and validation approaches

### 2. Architecture Analysis
**Objective:** Understand existing patterns and constraints

**Review Process:**
- Analyze existing codebase structure
- Identify relevant patterns and conventions
- Review similar features for consistency
- Consider performance implications
- Evaluate accessibility requirements

**Key Areas to Review:**
- Component architecture and patterns
- State management approaches
- Canvas and P5.js integration patterns
- Styling and theming systems
- Testing strategies and coverage

### 3. Specification Creation
**Objective:** Create comprehensive, actionable specifications

**Required Deliverables:**
- `requirements.md` - User stories and acceptance criteria
- `design.md` - Technical architecture and components
- `tasks.md` - Step-by-step implementation plan
- `README.md` - Feature overview and operation

## 📁 Specification Templates

### Requirements Template
```markdown
# Feature Requirements: [Feature Name]

## User Stories
- As a [user type], I want [functionality] so that [benefit]

## Acceptance Criteria
- [ ] Specific, testable criteria
- [ ] Performance requirements
- [ ] Accessibility requirements
- [ ] Browser compatibility

## Technical Constraints
- Performance: [specific requirements]
- Accessibility: [WCAG compliance level]
- Browser Support: [supported browsers]
- Mobile: [responsive requirements]

## Dependencies
- Existing components: [list]
- External services: [list]
- New dependencies: [list]
```

### Design Template
```markdown
# Feature Design: [Feature Name]

## Architecture Overview
- High-level system design
- Component hierarchy
- Data flow and state management
- Integration points

## Component Design
- Component structure and props
- State management approach
- Event handling patterns
- Performance optimizations

## Canvas Integration
- P5.js sketch structure
- Effect modules and lifecycle
- Performance considerations
- WebGL vs 2D rendering

## Accessibility Design
- Keyboard navigation
- Screen reader support
- Color contrast and visual design
- Focus management
```

### Tasks Template
```markdown
# Implementation Tasks: [Feature Name]

## Phase 1: Foundation
- [ ] Task 1: [Description]
  - Acceptance: [Specific criteria]
  - Dependencies: [Any prerequisites]
  - Estimated time: [Time estimate]

## Phase 2: Core Implementation
- [ ] Task 2: [Description]
  - Acceptance: [Specific criteria]
  - Dependencies: [Any prerequisites]
  - Estimated time: [Time estimate]

## Phase 3: Integration & Testing
- [ ] Task 3: [Description]
  - Acceptance: [Specific criteria]
  - Dependencies: [Any prerequisites]
  - Estimated time: [Time estimate]
```

## 🎨 Canvas-Specific Planning

### P5.js Feature Planning
**Considerations:**
- Performance impact on 60fps target
- Memory usage and object pooling
- WebGL vs 2D rendering requirements
- Mobile device compatibility
- Accessibility for canvas interactions

**Planning Questions:**
- How will this effect integrate with existing canvas system?
- What performance optimizations are needed?
- How will users interact with this feature?
- What fallbacks are needed for unsupported devices?

### Interactive Effects Planning
**Considerations:**
- User interaction patterns (click, hover, touch)
- Visual feedback and animations
- State management for effect activation
- Integration with existing effect system

**Planning Questions:**
- What triggers will activate this effect?
- How will the effect respond to user input?
- What visual feedback will users receive?
- How will this integrate with other effects?

## 🔍 Quality Assurance

### Specification Quality Checklist
- [ ] Requirements are specific and testable
- [ ] Design follows existing patterns and conventions
- [ ] Tasks are broken down into manageable steps
- [ ] Performance and accessibility requirements are clear
- [ ] Integration points are well-defined
- [ ] Testing approach is comprehensive

### Review Process
1. **Internal Review:** Validate against project standards
2. **Technical Review:** Ensure feasibility and performance
3. **Accessibility Review:** Verify WCAG compliance approach
4. **Integration Review:** Confirm compatibility with existing systems
5. **Final Approval:** Ready for implementation phase

## 📊 Success Metrics

### Planning Quality
- **Completeness:** All aspects of the feature are covered
- **Clarity:** Specifications are unambiguous and actionable
- **Testability:** Clear acceptance criteria and testing approaches
- **Integration:** Well-defined integration with existing systems
- **Performance:** Specific performance and optimization requirements

### Implementation Readiness
- **Task Breakdown:** Clear, sequential implementation steps
- **Dependencies:** Well-defined prerequisites and constraints
- **Estimates:** Realistic time estimates for each task
- **Quality Gates:** Clear criteria for task completion
- **Documentation:** Comprehensive documentation for future reference

## 🚀 Getting Started

### Initial Prompt
```
I'm in Planner mode. Let's specify a new feature: "[feature description]"

Please help me create comprehensive specifications for this feature, including:
1. Requirements with user stories and acceptance criteria
2. Technical design following existing project patterns
3. Implementation tasks broken down into manageable steps
4. Feature overview and operation documentation

Let's start by understanding the requirements and context.
```

### Follow-up Questions
- What specific functionality do you need?
- How does this relate to existing features?
- What are the performance and accessibility requirements?
- Who will use this feature and in what context?
- What are your success criteria for this feature?

---

*Planner mode ensures comprehensive feature specifications that enable efficient, high-quality implementation.*
