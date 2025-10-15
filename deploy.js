import { execSync } from 'child_process';

// Starting deployment to GitHub Pages

try {
  // Build the project
  // Building project
  execSync('npm run build', { stdio: 'inherit' });
  
  // Deploy to GitHub Pages
  // Deploying to GitHub Pages
  execSync('npx gh-pages -d dist', { stdio: 'inherit' });
  
  // Deployment successful
  // Your site should be available at: https://benstrumeyer.github.io/portfolio
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
