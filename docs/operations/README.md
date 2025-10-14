# Operations Guide

This directory contains documentation for deployment, monitoring, and maintenance of the Interactive Personal Portfolio.

## Deployment

### Production Build
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Deployment Platforms

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. Deploy automatically on push to main branch

#### Netlify
1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build Command: `npm run build && npm run preview`
   - Publish Directory: `dist`
3. Deploy automatically on push to main branch

#### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Use GitHub Actions for automated deployment
3. Configure custom domain if needed

## Performance Monitoring

### Canvas Performance
- Monitor frame rate using browser dev tools
- Check particle count and memory usage
- Optimize based on device capabilities

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

### Lighthouse Audits
- Run Lighthouse audits regularly
- Focus on Performance and Best Practices scores
- Optimize based on recommendations

## Maintenance

### Dependency Updates
```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Update specific packages
npm install package@latest
```

### Security Audits
```bash
# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix
```

### Code Quality
```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run type checking
npm run type-check

# Format code
npm run format
```

## Environment Configuration

### Development
- Use `.env.local` for local development
- Configure P5.js debug mode
- Enable performance monitoring

### Production
- Optimize P5.js settings for performance
- Disable debug logging
- Enable production optimizations

## Monitoring

### Performance Metrics
- Page load time
- Canvas initialization time
- Frame rate consistency
- Memory usage patterns

### Error Tracking
- Implement error boundaries for React components
- Monitor P5.js canvas errors
- Track user interaction patterns

## Troubleshooting

### Common Issues
1. **Canvas not rendering:** Check P5.js initialization
2. **Performance issues:** Reduce particle count or enable WebGL
3. **Mobile touch issues:** Verify touch event handlers
4. **Build failures:** Check TypeScript errors and dependencies

### Debug Mode
```javascript
// Enable P5.js debug mode in development
const isDevelopment = import.meta.env.DEV;
if (isDevelopment) {
  // Enable debug logging
}
```

