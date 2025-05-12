import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define paths
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('✅ Created dist directory');
}

// Copy necessary files and directories
const directoriesToCopy = ['controllers', 'middleware', 'models', 'routes', 'services', 'utils'];
const filesToCopy = ['index.js'];

// Copy directories
directoriesToCopy.forEach(dir => {
  const srcDir = path.resolve(rootDir, dir);
  const destDir = path.resolve(distDir, dir);
  
  if (fs.existsSync(srcDir)) {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copy all files in the directory
    const files = fs.readdirSync(srcDir);
    files.forEach(file => {
      const srcFile = path.resolve(srcDir, file);
      const destFile = path.resolve(destDir, file);
      
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
        console.log(`✅ Copied ${dir}/${file}`);
      }
    });
  }
});

// Copy individual files
filesToCopy.forEach(file => {
  const srcFile = path.resolve(rootDir, file);
  const destFile = path.resolve(distDir, file);
  
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, destFile);
    console.log(`✅ Copied ${file}`);
  }
});

// Create a sample .env.example file in the dist directory
const envExampleContent = `PORT=8000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLERK_SECRET_KEY=your_clerk_secret_key
`;

fs.writeFileSync(path.resolve(distDir, '.env.example'), envExampleContent);
console.log('✅ Created .env.example file');

// Create package.json for the dist directory
const packageJson = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'package.json'), 'utf8'));

// Modify package.json for production
delete packageJson.scripts.dev;
packageJson.scripts.start = 'node index.js';
delete packageJson.scripts.build;

// Remove development dependencies
delete packageJson.devDependencies;

// Write the modified package.json to the dist directory
fs.writeFileSync(
  path.resolve(distDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);
console.log('✅ Created production package.json');

console.log('🚀 Build completed successfully!');