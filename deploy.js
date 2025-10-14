import { execSync } from 'child_process';

console.log('🚀 Starting deployment to GitHub Pages...');

try {
  // Build the project
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Deploy to GitHub Pages
  console.log('🌐 Deploying to GitHub Pages...');
  execSync('npx gh-pages -d dist', { stdio: 'inherit' });
  
  console.log('✅ Deployment successful!');
  console.log('🔗 Your site should be available at: https://benstrumeyer.github.io/portfolio');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
