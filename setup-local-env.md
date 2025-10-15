# Local Development Setup

## Environment Configuration

To enable the hobbies section locally while keeping it disabled in production:

### Option 1: Manual Setup
1. Copy the environment example file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and set:
   ```
   VITE_SHOW_HOBBIES=true
   ```

### Option 2: Automatic (Already Configured)
The Vite configuration automatically sets:
- **Development mode:** `VITE_SHOW_HOBBIES=true` (hobbies button visible)
- **Production mode:** `VITE_SHOW_HOBBIES=false` (hobbies button hidden)

## Current Status
- ✅ **Local Development:** Hobbies button will be visible when running `npm run dev`
- ✅ **Production Build:** Hobbies button will be hidden when running `npm run build` or deployed
- ✅ **Environment Variables:** Automatically managed by Vite config

## Commands
```bash
# Start development server (hobbies button visible)
npm run dev

# Build for production (hobbies button hidden)
npm run build

# Deploy to GitHub Pages (hobbies button hidden)
npm run deploy
```

The feature flag is now properly configured for both development and production environments!
