# AI Steering Guidelines

This directory contains comprehensive steering documentation that should be used in every AI chat session to ensure consistent, high-quality assistance across all development tools and platforms.

## 🎯 Purpose

These steering guidelines provide:
- **Consistent AI behavior** across different tools (Claude, Cursor, Gemini, etc.)
- **Project-specific context** for accurate and relevant assistance
- **Development workflow standards** for structured, spec-driven development
- **Quality assurance** through established patterns and best practices

## 📋 How to Use These Guidelines

### For Every Chat Session

**Attach these files to your AI chat:**

1. **Primary Context Files** (Always include):
   - `project-context.md` - Complete project overview and vision
   - `ai-behavior-guide.md` - How AI should behave and respond
   - `development-workflow.md` - Structured development process

2. **Mode-Specific Files** (Include based on your current task):
   - `planner-mode.md` - For feature planning and specification
   - `executor-mode.md` - For implementing approved specifications
   - `steering-architect-mode.md` - For configuring AI rules and standards

3. **Reference Files** (Include when relevant):
   - `technical-standards.md` - Code quality and technical requirements
   - `project-patterns.md` - Established patterns and conventions
   - `troubleshooting-guide.md` - Common issues and solutions

### Quick Start Prompts

**Starting a new chat with context:**
```
I'm working on my Personal Portfolio project. Please review the attached steering guidelines and confirm you understand the project context, development workflow, and your role in this session.
```

**For specific modes:**
```
I'm in [PLANNER/EXECUTOR/STEERING ARCHITECT] mode. Please review the relevant steering guidelines and begin assisting with [specific task].
```

## 📁 File Structure

```
docs/steering/
├── README.md                    # This overview file
├── project-context.md          # Complete project context and vision
├── ai-behavior-guide.md        # AI interaction and response guidelines
├── development-workflow.md     # Structured development process
├── modes/
│   ├── planner-mode.md         # Feature planning specifications
│   ├── executor-mode.md        # Implementation execution
│   └── steering-architect-mode.md # AI configuration management
├── technical/
│   ├── technical-standards.md  # Code quality and requirements
│   ├── project-patterns.md     # Established patterns and conventions
│   └── troubleshooting-guide.md # Common issues and solutions
└── templates/
    ├── feature-spec-template.md # Template for new feature specs
    ├── task-breakdown-template.md # Template for implementation tasks
    └── ai-rules-template.md    # Template for AI steering files
```

## 🔄 Integration with Existing AI Rules

These steering guidelines work alongside the existing `.ai-rules/` directory:

- **`.ai-rules/`** - Project-specific configuration files
- **`docs/steering/`** - Comprehensive guidelines and context for AI behavior

The steering guidelines provide the "how to think and behave" while the AI rules provide the "what the project needs."

## 🎨 Customization

These guidelines are designed to be:
- **Project-specific** - Tailored to the Personal Portfolio project
- **Tool-agnostic** - Work across Claude, Cursor, Gemini, and other AI tools
- **Evolvable** - Update as the project grows and requirements change
- **Comprehensive** - Cover all aspects of development assistance

## 📈 Benefits

Using these steering guidelines ensures:
- ✅ **Consistent quality** across all AI interactions
- ✅ **Faster onboarding** for new AI tools and team members
- ✅ **Reduced context switching** between different development sessions
- ✅ **Better project understanding** leading to more accurate assistance
- ✅ **Structured development** following spec-driven methodology

## 🚀 Getting Started

1. **Review** the main steering files to understand the project
2. **Attach** the relevant files to your AI chat session
3. **Confirm** the AI understands the context and workflow
4. **Begin** your development task with confidence

---

*These steering guidelines are living documents that should be updated as the project evolves and new patterns emerge.*
