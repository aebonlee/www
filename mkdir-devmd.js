const fs = require('fs');
const dir = 'D:\\dreamit-web\\ai-hub\\Dev_md';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
console.log('Dev_md created');
