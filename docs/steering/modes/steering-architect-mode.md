# Steering Architect Mode - AI Configuration Guide

## 🎯 Mode Overview

**Role:** Configuration Manager  
**Primary Function:** Create and maintain AI rules and project standards  
**Focus:** Ensuring consistent AI behavior across all development tools and sessions  

## 🚀 When to Use Steering Architect Mode

### Ideal Scenarios
- Setting up AI rules for a new project
- Updating AI rules as project evolves
- Standardizing AI behavior across different tools
- Creating comprehensive project guidelines
- Analyzing and improving existing AI configuration

### Prerequisites
- Understanding of project architecture and requirements
- Knowledge of existing patterns and conventions
- Clear vision of desired AI behavior and standards
- Access to project documentation and codebase

## 📋 Configuration Process

### 1. Project Analysis
**Objective:** Understand current project state and requirements

**Analysis Areas:**
- Existing codebase structure and patterns
- Current AI rules and configuration
- Project goals and technical requirements
- Development workflow and standards
- Team preferences and conventions

**Key Questions:**
- What are the current project patterns and conventions?
- What AI behavior is working well and what needs improvement?
- What new requirements or changes need to be addressed?
- How can AI assistance be more consistent and effective?

### 2. Rule Creation/Updates
**Objective:** Create comprehensive, actionable AI rules

**Rule Categories:**
- **Product Rules:** Project vision, goals, and requirements
- **Technical Rules:** Technology stack, standards, and patterns
- **Structure Rules:** File organization, naming, and conventions
- **Behavior Rules:** AI interaction patterns and response standards

**Rule Quality Criteria:**
- Specific and actionable
- Aligned with project goals
- Promote consistency and quality
- Easy to understand and follow
- Comprehensive but not overwhelming

### 3. Validation and Testing
**Objective:** Ensure rules work effectively in practice

**Validation Process:**
- Test rules with sample scenarios
- Verify consistency across different AI tools
- Gather feedback from development team
- Iterate and improve based on results

## 🛠️ AI Rules Structure

### Product Rules (`.ai-rules/product.md`)
```markdown
---
title: Project Vision
description: "Defines project goals, vision, and core principles."
inclusion: always
---

# Project Vision & Goals

## Project Overview
- Project name and purpose
- Target audience and use cases
- Key differentiators and value proposition

## Core Objectives
- Primary goals and success metrics
- Quality standards and requirements
- Performance and accessibility targets

## Design Philosophy
- Core principles and values
- User experience priorities
- Technical approach and methodology
```

### Technical Rules (`.ai-rules/tech.md`)
```markdown
---
title: Technical Standards
description: "Defines technology stack, coding standards, and technical requirements."
inclusion: always
---

# Technical Standards

## Technology Stack
- Core technologies and frameworks
- Development tools and environment
- Build and deployment processes

## Coding Standards
- Code style and formatting
- TypeScript and typing requirements
- Performance and optimization standards
- Testing requirements and coverage

## Architecture Patterns
- Component architecture and patterns
- State management approaches
- Integration patterns and conventions
- Canvas and P5.js specific patterns
```

### Structure Rules (`.ai-rules/structure.md`)
```markdown
---
title: Project Structure
description: "Defines file organization, naming conventions, and development standards."
inclusion: always
---

# Project Structure & Conventions

## Directory Organization
- File and folder structure
- Naming conventions
- Import/export patterns

## Component Structure
- React component patterns
- P5.js canvas component patterns
- Hook and utility patterns

## Documentation Standards
- README requirements
- Code commenting standards
- API documentation requirements
```

## 🎨 Canvas-Specific Rules

### P5.js Integration Rules
```markdown
## Canvas Development Standards

### Component Patterns
- Standard P5.js component structure
- Canvas lifecycle management
- Performance optimization requirements
- WebGL vs 2D rendering considerations

### Effect Module Standards
- Effect module structure and lifecycle
- Object pooling and memory management
- Performance monitoring and optimization
- Integration with React state management

### Accessibility Standards
- Canvas accessibility requirements
- Keyboard navigation for canvas interactions
- Screen reader compatibility
- Alternative interaction methods
```

### Performance Rules
```markdown
## Performance Standards

### Animation Requirements
- 60fps target for all animations
- Frame rate monitoring and optimization
- Memory usage limits and management
- Battery usage optimization for mobile

### Rendering Optimization
- WebGL acceleration with 2D fallback
- Object pooling for particle systems
- Efficient update cycles and dirty checking
- Mobile device compatibility and optimization
```

## 🔍 Quality Assurance

### Rule Quality Checklist
- [ ] Rules are specific and actionable
- [ ] Rules align with project goals and requirements
- [ ] Rules promote consistency and quality
- [ ] Rules are comprehensive but not overwhelming
- [ ] Rules are easy to understand and follow
- [ ] Rules work across different AI tools and platforms

### Testing and Validation
- **Rule Testing:** Test rules with sample scenarios
- **Consistency Testing:** Verify behavior across different AI tools
- **Team Feedback:** Gather input from development team
- **Iteration:** Improve rules based on feedback and results

## 📊 Rule Effectiveness Metrics

### Consistency Metrics
- **Response Quality:** Consistency in AI response quality
- **Pattern Adherence:** Adherence to established patterns
- **Code Quality:** Consistency in generated code quality
- **Documentation:** Consistency in documentation standards

### Productivity Metrics
- **Development Speed:** Faster development through consistent assistance
- **Reduced Context Switching:** Less time explaining project context
- **Quality Improvement:** Higher quality output with fewer iterations
- **Team Satisfaction:** Improved developer experience and satisfaction

## 🚀 Getting Started

### Initial Prompt
```
I'm in Steering Architect mode. Create the steering files for this project.

Please:
1. Analyze the existing project structure and patterns
2. Review current AI rules and configuration
3. Create or update comprehensive steering files
4. Ensure rules are specific, actionable, and aligned with project goals
5. Test and validate the rules for effectiveness

Let's start by analyzing the current project state and requirements.
```

### Analysis Process
1. **Project Review:** Analyze existing codebase and documentation
2. **Rule Assessment:** Review current AI rules and identify gaps
3. **Requirement Gathering:** Understand project goals and team preferences
4. **Rule Creation:** Create or update comprehensive steering files
5. **Validation:** Test rules and gather feedback for improvement

## 📋 Completion Criteria

### Rule Creation Checklist
- [ ] Product rules clearly define project vision and goals
- [ ] Technical rules specify technology stack and standards
- [ ] Structure rules define file organization and conventions
- [ ] Rules are specific, actionable, and comprehensive
- [ ] Rules align with project requirements and team preferences
- [ ] Rules are tested and validated for effectiveness

### Documentation Requirements
- **Rule Documentation:** Clear documentation of all rules and their purpose
- **Usage Guidelines:** Instructions for using and maintaining rules
- **Update Process:** Process for updating rules as project evolves
- **Team Training:** Guidelines for team members on rule usage

## 🔄 Maintenance and Updates

### Regular Review Process
- **Monthly Review:** Assess rule effectiveness and identify improvements
- **Quarterly Update:** Update rules based on project evolution
- **Annual Overhaul:** Comprehensive review and update of all rules
- **Continuous Improvement:** Ongoing refinement based on feedback

### Update Triggers
- **Project Evolution:** Changes in project goals or requirements
- **Technology Changes:** Updates to technology stack or tools
- **Team Feedback:** Issues or suggestions from development team
- **Performance Issues:** Problems with AI assistance quality or consistency

---

*Steering Architect mode ensures consistent, high-quality AI assistance through comprehensive rule creation and maintenance.*
