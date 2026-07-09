const fs = require('fs');
const lines = fs.readFileSync('src/app/page.tsx', 'utf8').split('\n');
let out = '';
const idx = lines.findIndex(l => l.includes('top":"439px"'));
if (idx !== -1) {
  out += '=== 439px ===\n' + lines.slice(Math.max(0, idx - 15), idx + 15).join('\n') + '\n\n';
}

const idx2 = lines.findIndex(l => l.includes('Rectangle_23'));
if (idx2 !== -1) {
  out += '=== Rectangle_23 ===\n' + lines.slice(Math.max(0, idx2 - 5), idx2 + 10).join('\n') + '\n\n';
}
fs.writeFileSync('btn-out.txt', out);
