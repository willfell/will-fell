const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'src', 'assets', 'WillFellhoelterResume.pdf');
const destPath = path.join(__dirname, 'public', 'WillFellhoelterResume.pdf');

if (!fs.existsSync(path.join(__dirname, 'public'))) {
  fs.mkdirSync(path.join(__dirname, 'public'));
}

try {
  fs.copyFileSync(sourcePath, destPath);
  console.log('✅ Resume copied successfully to public/WillFellhoelterResume.pdf');
} catch (err) {
  console.error('❌ Error copying resume:', err);
}