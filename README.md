# Interactive Personal Portfolio

An immersive, interactive personal portfolio website built with React, TypeScript, and P5.js, featuring a canvas-based experience with environmental effects and interactive animations inspired by drawaurora.com.

## 🚀 Quick Start

This project uses a structured, AI-assisted development workflow that enables consistent development across multiple AI tools.

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd personal-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Canvas Engine:** P5.js with WebGL support
- **Animation:** GSAP for high-performance animations
- **State Management:** Redux for effects state
- **Routing:** React Router v6
- **Icons:** Lucide React

### Project Structure
```
.
├── .ai-rules/              # AI steering configuration
├── docs/                   # Comprehensive documentation
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── canvas/         # P5.js canvas components
│   │   ├── effects/        # Interactive effects
│   │   ├── ui/             # Basic UI components
│   │   └── layout/         # Layout components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript definitions
│   └── assets/             # Static assets
├── public/                 # Public assets
└── dist/                   # Build output
```

## ✨ Interactive Features

### Canvas Experience
- **Dynamic Landscape:** Animated background with environmental effects
- **Sky System:** Sun and moon movement across the sky with day/night cycles
- **Weather Effects:** Dynamic snow, rain, and atmospheric conditions
- **Interactive Elements:** Click to trigger lasers and fireworks
- **Particle Systems:** Optimized particle effects with object pooling

### Performance Optimized
- **60fps Animations:** Smooth canvas rendering with performance monitoring
- **WebGL Support:** Hardware-accelerated graphics with 2D fallback
- **Mobile Responsive:** Touch events and responsive canvas sizing
- **Memory Efficient:** Object pooling and proper cleanup

## 🤖 AI-Assisted Development

This project follows the [spec-driven AI coding methodology](https://github.com/andreskull/spec-driven-ai-coding) for structured development.

### Available AI Modes

#### Planner Mode
Create detailed specifications for new features:
```
You are in **Planner mode**. Let's specify a new feature: "[feature description]"
```

#### Executor Mode  
Implement features from approved specifications:
```
You are in **Executor mode**. Go and execute the tasks in `docs/features/[feature-name]/tasks.md`
```

#### Steering Architect Mode
Configure project rules and standards:
```
You are in **Steering Architect mode**. Create the steering files for this project.
```

### Supported AI Tools

- **Kiro:** Native spec mode with steering files
- **Cursor:** Custom modes with planner/executor personas
- **Claude:** Attach `CLAUDE.md` for master context
- **Gemini:** Attach `GEMINI.md` for master context

## 📚 Documentation

- **[Architecture Overview](./docs/architecture/README.md)** - System design and technical decisions
- **[Features Index](./docs/features/README.md)** - Feature specifications and implementation plans
- **[Operations Guide](./docs/operations/README.md)** - Deployment and maintenance
- **[Data Schemas](./docs/schemas/README.md)** - Type definitions and models

## 🛠️ Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Code Quality
- **ESLint + Prettier:** Code formatting and linting
- **TypeScript:** Strict type checking
- **Testing:** Jest + React Testing Library
- **Git Hooks:** Pre-commit quality gates

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Platforms
- **Vercel:** Recommended for React applications
- **Netlify:** Alternative static hosting
- **GitHub Pages:** Free hosting option

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Follow the spec-driven development workflow
2. Use AI Planner mode for new features
3. Use AI Executor mode for implementation
4. Maintain documentation in the `docs/` directory
5. Follow established coding standards

## 📞 Support

For questions or support:
- Check the documentation in `/docs/`
- Review the AI steering files in `/.ai-rules/`
- Create an issue for bugs or feature requests

