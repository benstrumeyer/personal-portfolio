# Quick Reference - AI Steering Guidelines

## 🎯 Essential Files for Every Chat

### Always Attach These 3 Files:
1. `project-context.md` - Complete project overview
2. `ai-behavior-guide.md` - How AI should behave
3. `development-workflow.md` - Development process

### Plus Mode-Specific Files:
- **Planning:** `modes/planner-mode.md`
- **Implementation:** `modes/executor-mode.md`
- **AI Configuration:** `modes/steering-architect-mode.md`

## 🚀 Quick Start Prompts

### Planner Mode
```
I'm in Planner mode. Let's specify a new feature: "[feature description]"

Please review the attached steering guidelines and help me create comprehensive specifications.
```

### Executor Mode
```
I'm in Executor mode. Go and execute the tasks in `docs/features/[feature-name]/tasks.md`

Please review the attached steering guidelines and implement the approved specifications.
```

### Steering Architect Mode
```
I'm in Steering Architect mode. Create the steering files for this project.

Please review the attached steering guidelines and create comprehensive AI rules.
```

## 📁 File Structure

```
docs/steering/
├── README.md                    # Overview and purpose
├── project-context.md          # Complete project context
├── ai-behavior-guide.md        # AI interaction guidelines
├── development-workflow.md     # Development process
├── USAGE_INSTRUCTIONS.md       # Detailed usage guide
├── QUICK_REFERENCE.md          # This file
├── modes/
│   ├── planner-mode.md         # Feature planning
│   ├── executor-mode.md        # Implementation
│   └── steering-architect-mode.md # AI configuration
├── technical/
│   ├── technical-standards.md  # Code quality standards
│   ├── project-patterns.md     # Established patterns
│   └── troubleshooting-guide.md # Common issues
└── templates/
    ├── feature-spec-template.md # Feature specification template
    ├── task-breakdown-template.md # Task breakdown template
    └── ai-rules-template.md    # AI rules template
```

## 🎨 Project Context Summary

**Project:** Interactive Personal Portfolio  
**Tech Stack:** React + TypeScript + P5.js + Redux  
**Focus:** Canvas-based interactions with environmental effects  
**Standards:** 60fps animations, WCAG 2.1 AA compliance  
**Development:** Spec-driven methodology with AI assistance  

## 🔄 Development Workflow

1. **Planning Phase:** Use Planner mode to create specifications
2. **Review & Approval:** Human review of generated specifications
3. **Execution Phase:** Use Executor mode to implement approved specs
4. **Testing & Validation:** Ensure implementation meets requirements
5. **Documentation Update:** Update relevant docs as needed

## 📋 Quality Standards

### Code Quality
- TypeScript strict mode
- 100% test coverage for components
- 60fps animation performance
- WCAG 2.1 AA accessibility compliance

### Documentation
- Comprehensive specifications before implementation
- Clear acceptance criteria and testing requirements
- Updated documentation for all changes
- Consistent patterns and conventions

## 🎯 Success Metrics

- **Consistency:** AI responses follow established patterns
- **Quality:** High-quality output with fewer iterations
- **Speed:** Faster development through structured assistance
- **Satisfaction:** Improved developer experience

---

*This quick reference provides essential information for effective use of AI steering guidelines.*
