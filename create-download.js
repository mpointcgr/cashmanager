const fs = require('fs');
const path = require('path');

// Create a simple tar-like archive using Node.js
function createArchive() {
  const archiveData = [];
  const excludeDirs = ['node_modules', '.git', 'dist', '.bolt'];
  const excludeFiles = ['.log', 'create-download.js'];
  
  function shouldExclude(filePath) {
    return excludeDirs.some(dir => filePath.includes(dir)) || 
           excludeFiles.some(ext => filePath.endsWith(ext));
  }
  
  function addToArchive(dirPath, basePath = '') {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const relativePath = path.join(basePath, item);
      
      if (shouldExclude(relativePath)) continue;
      
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        addToArchive(fullPath, relativePath);
      } else {
        const content = fs.readFileSync(fullPath, 'utf8');
        archiveData.push({
          path: relativePath,
          content: content
        });
      }
    }
  }
  
  addToArchive('.');
  
  // Create a simple text-based archive
  let archiveContent = '# Daily Cash Manager App Archive\n';
  archiveContent += '# Extract by running the included extract script\n\n';
  
  for (const file of archiveData) {
    archiveContent += `=== FILE: ${file.path} ===\n`;
    archiveContent += file.content;
    archiveContent += '\n=== END FILE ===\n\n';
  }
  
  fs.writeFileSync('daily-cash-manager-app.txt', archiveContent);
  console.log('Archive created as daily-cash-manager-app.txt');
  console.log(`Included ${archiveData.length} files`);
}

createArchive();