# Usage Instructions - AI Steering Guidelines

## 🚀 Quick Start

### For Every Chat Session

**Attach these files to your AI chat:**

1. **Always Include:**
   - `project-context.md` - Complete project overview
   - `ai-behavior-guide.md` - How AI should behave
   - `development-workflow.md` - Development process

2. **Mode-Specific (Include based on your task):**
   - `modes/planner-mode.md` - For feature planning
   - `modes/executor-mode.md` - For implementation
   - `modes/steering-architect-mode.md` - For AI configuration

3. **Technical Reference (Include when relevant):**
   - `technical/technical-standards.md` - Code quality standards
   - `templates/` - Templates for specifications and tasks

## 🎯 AI Mode Selection

### Planner Mode
**Use when:** Starting a new feature or planning complex functionality

**Prompt:**
```
I'm in Planner mode. Let's specify a new feature: "[feature description]"

Please review the attached steering guidelines and help me create comprehensive specifications including requirements, design, and implementation tasks.
```

**Attach files:**
- `project-context.md`
- `ai-behavior-guide.md`
- `modes/planner-mode.md`
- `templates/feature-spec-template.md`

### Executor Mode
**Use when:** Implementing approved specifications

**Prompt:**
```
I'm in Executor mode. Go and execute the tasks in `docs/features/[feature-name]/tasks.md`

Please review the attached steering guidelines and implement the approved specifications following established patterns and standards.
```

**Attach files:**
- `project-context.md`
- `ai-behavior-guide.md`
- `modes/executor-mode.md`
- `technical/technical-standards.md`

### Steering Architect Mode
**Use when:** Setting up or updating AI rules

**Prompt:**
```
I'm in Steering Architect mode. Create the steering files for this project.

Please review the attached steering guidelines and create comprehensive AI rules that ensure consistent, high-quality assistance.
```

**Attach files:**
- `project-context.md`
- `ai-behavior-guide.md`
- `modes/steering-architect-mode.md`
- `templates/ai-rules-template.md`

## 📋 File Attachment Guide

### Essential Files (Always Include)
```
docs/steering/project-context.md
docs/steering/ai-behavior-guide.md
docs/steering/development-workflow.md
```

### Mode-Specific Files
```
docs/steering/modes/planner-mode.md          # For planning
docs/steering/modes/executor-mode.md         # For implementation
docs/steering/modes/steering-architect-mode.md # For AI configuration
```

### Technical Reference Files
```
docs/steering/technical/technical-standards.md
docs/steering/technical/project-patterns.md
docs/steering/technical/troubleshooting-guide.md
```

### Templates (When Creating New Content)
```
docs/steering/templates/feature-spec-template.md
docs/steering/templates/task-breakdown-template.md
docs/steering/templates/ai-rules-template.md
```

## 🎨 Canvas-Specific Usage

### For P5.js Canvas Features
**Additional context needed:**
- Current canvas system architecture
- Existing effect modules and patterns
- Performance requirements and constraints
- Integration with React state management

**Special considerations:**
- WebGL vs 2D rendering requirements
- Object pooling for particle systems
- Mobile device compatibility
- Accessibility for canvas interactions

### For Interactive Effects
**Additional context needed:**
- User interaction patterns and triggers
- Visual feedback and animation requirements
- Integration with existing effect system
- Performance optimization needs

## 🔧 Tool-Specific Instructions

### Claude
**Usage:**
1. Attach relevant steering files
2. Use specific mode prompts
3. Reference project context in requests
4. Ask for clarification when needed

**Best practices:**
- Be specific about which mode you're using
- Reference existing patterns and conventions
- Ask for progress updates during implementation
- Request code review and quality checks

### Cursor
**Usage:**
1. Attach steering files to chat context
2. Use mode-specific prompts
3. Reference existing code patterns
4. Ask for incremental implementation

**Best practices:**
- Break down complex tasks into smaller steps
- Reference existing components and patterns
- Ask for code examples and implementations
- Request testing and validation

### Gemini
**Usage:**
1. Attach steering files for context
2. Use clear, specific prompts
3. Reference project requirements
4. Ask for comprehensive responses

**Best practices:**
- Provide clear context and requirements
- Ask for detailed explanations and reasoning
- Request code examples and implementations
- Ask for testing and quality assurance

## 📊 Quality Assurance

### Before Starting
- [ ] Confirm AI understands project context
- [ ] Verify mode selection is appropriate
- [ ] Ensure all relevant files are attached
- [ ] Check that requirements are clear

### During Development
- [ ] Request progress updates regularly
- [ ] Ask for code review and quality checks
- [ ] Verify adherence to established patterns
- [ ] Ensure testing requirements are met

### After Completion
- [ ] Verify all acceptance criteria are met
- [ ] Check code quality and standards compliance
- [ ] Ensure documentation is updated
- [ ] Validate performance and accessibility requirements

## 🚨 Troubleshooting

### Common Issues

**AI doesn't understand project context:**
- Re-attach `project-context.md`
- Explicitly reference project patterns
- Ask AI to confirm understanding

**AI not following established patterns:**
- Attach `technical/technical-standards.md`
- Reference existing code examples
- Ask for pattern compliance

**AI providing generic advice:**
- Attach mode-specific files
- Use specific, project-focused prompts
- Reference existing implementations

**AI not maintaining quality standards:**
- Attach `ai-behavior-guide.md`
- Request quality assurance checks
- Ask for code review and validation

### Getting Better Results

**Be specific:**
- Use clear, detailed prompts
- Reference specific files and patterns
- Ask for specific deliverables

**Provide context:**
- Attach relevant steering files
- Reference existing implementations
- Explain project requirements clearly

**Ask for validation:**
- Request progress updates
- Ask for quality checks
- Verify adherence to standards

## 📈 Continuous Improvement

### Regular Updates
- **Monthly:** Review steering file effectiveness
- **Quarterly:** Update based on project evolution
- **Annually:** Comprehensive review and overhaul

### Feedback Collection
- **Developer feedback:** What's working well and what needs improvement
- **Quality metrics:** Track consistency and quality of AI assistance
- **Process metrics:** Monitor development speed and efficiency

### Rule Evolution
- **Pattern updates:** Incorporate new patterns and conventions
- **Technology changes:** Update for new tools and frameworks
- **Process improvements:** Enhance workflow and methodology

## 🎯 Success Metrics

### Quality Metrics
- **Consistency:** AI responses follow established patterns
- **Accuracy:** AI understands project context correctly
- **Completeness:** AI provides comprehensive assistance
- **Relevance:** AI advice is specific to project needs

### Productivity Metrics
- **Development Speed:** Faster feature development
- **Reduced Context Switching:** Less time explaining project context
- **Quality Improvement:** Higher quality output with fewer iterations
- **Team Satisfaction:** Improved developer experience

---

*These usage instructions ensure effective use of AI steering guidelines across all development tools and sessions.*
