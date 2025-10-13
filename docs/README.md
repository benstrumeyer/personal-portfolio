# Project Documentation

This directory contains comprehensive documentation for the Interactive Personal Portfolio project, organized following spec-driven development principles. The portfolio features an immersive P5.js canvas experience with environmental effects and interactive animations.

## Quick Start

1. **New to the project?** Start with [Architecture Overview](./architecture/README.md)
2. **Planning a feature?** Use the [Features Index](./features/README.md)
3. **Deploying?** Check [Deployment Guide](./operations/deployment.md)

## Documentation Structure

### `/architecture/`
Core architectural documentation including system design, data models, and technical decisions.

### `/features/`
Feature-specific documentation. Each feature gets its own subdirectory with:
- `requirements.md` - User stories and acceptance criteria
- `design.md` - Technical architecture and components  
- `tasks.md` - Step-by-step implementation plan
- `README.md` - Feature overview and operation

### `/operations/`
Deployment, monitoring, and maintenance documentation.

### `/schemas/`
Data models, API schemas, and type definitions.

## AI Development Workflow

This project follows a spec-driven development approach:

1. **Planning Phase:** Use AI Planner to create feature specifications
2. **Execution Phase:** Use AI Executor to implement features from specs
3. **Steering:** Configure AI behavior via `.ai-rules/` directory

## Contributing

When adding new features:
1. Create feature specification in `/features/`
2. Update relevant architecture docs
3. Follow the structured development workflow
4. Update this README if needed

