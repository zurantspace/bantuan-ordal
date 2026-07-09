const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// The CTA buttons are composed of:
// 1. A red gradient background div  
// 2. A span with the text on top (absolute positioned)
// These two are separate elements in absolute layout, so we need to add onClick to BOTH
// plus the overlapping text spans

// Instead, let's overlay an invisible clickable div on top of each CTA area
// We'll insert it right before the closing </div> of the main container

// Actually the cleanest approach: wrap pairs of button+text in a clickable region
// Let's use a different approach: add a transparent clickable overlay on each button position

const ctaPositions = [
  { top: '587px', left: '66px', width: '259px', height: '46px' },
  { top: '4990px', left: '66px', width: '259px', height: '46px' },
  { top: '6382px', left: '66px', width: '259px', height: '46px' },
  { top: '3083px', left: '66px', width: '259px', height: '46px' },
];

// Build the overlay divs to insert before the closing </div> of the inner wrapper
let overlays = '';
for (const pos of ctaPositions) {
  overlays += `
      <a href="/checkout" style={{"display":"block","left":"${pos.left}","top":"${pos.top}","width":"${pos.width}","height":"${pos.height}","position":"absolute","cursor":"pointer","zIndex":10}} aria-label="Klaim Sekarang" />`;
}

// Also add clickable overlay for the login button
overlays += `
      <a href="/login" style={{"display":"block","left":"290px","top":"71px","width":"83px","height":"25px","position":"absolute","cursor":"pointer","zIndex":10}} aria-label="Login" />`;

// Insert overlays just before the closing </div>\n  </div> of the inner container
const insertPoint = '    </div>\n  </div>';
if (code.includes(insertPoint)) {
  code = code.replace(insertPoint, overlays + '\n' + insertPoint);
  console.log('Clickable overlays inserted!');
} else {
  // Try alternate
  const alt = '</div>\n    </>\n  )\n}';
  const idx = code.lastIndexOf('    </div>');
  if (idx !== -1) {
    code = code.substring(0, idx) + overlays + '\n' + code.substring(idx);
    console.log('Clickable overlays inserted (alt method)!');
  } else {
    console.log('Insert point not found');
  }
}

fs.writeFileSync('src/app/page.tsx', code);
console.log('Done!');
