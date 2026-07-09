const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Remove the phone status bar section (9:41 time, signal, wifi, battery icons)
// This is the div at top (top:0px) that contains "9:41" text and signal/wifi/battery icons
// It spans lines 346-363 in the original
const statusBarPattern = /<div style=\{\{"display":"flex","flexDirection":"row","gridColumnGap":"154px","alignItems":"center","justifyContent":"center","left":"0px","top":"0px","width":"393px","position":"absolute","padding":"21px 24px 19px"\}\}>/;
const startTag = `      <div style={{"display":"flex","flexDirection":"row","gridColumnGap":"154px","alignItems":"center","justifyContent":"center","left":"0px","top":"0px","width":"393px","position":"absolute","padding":"21px 24px 19px"}}>`;

const idx = code.indexOf(startTag);
if (idx !== -1) {
  // Find closing </div> of this element - we need to count nested divs
  let depth = 0;
  let i = idx;
  let inTag = false;
  let start = idx;
  let end = -1;
  
  // Find the end of this element
  while (i < code.length) {
    if (code[i] === '<') {
      if (code[i+1] === '/') {
        // closing tag
        const closeEnd = code.indexOf('>', i);
        if (closeEnd !== -1) {
          depth--;
          if (depth === 0) {
            end = closeEnd + 1;
            break;
          }
          i = closeEnd + 1;
          continue;
        }
      } else if (code[i+1] !== '!') {
        // opening tag - check if self-closing
        const closeEnd = code.indexOf('>', i);
        if (closeEnd !== -1) {
          const tag = code.substring(i, closeEnd + 1);
          if (!tag.endsWith('/>')) {
            depth++;
          }
          i = closeEnd + 1;
          continue;
        }
      }
    }
    i++;
  }
  
  if (end !== -1) {
    const removed = code.substring(start, end);
    console.log('Removing status bar, length:', removed.length);
    console.log('Preview:', removed.substring(0, 200));
    code = code.substring(0, start) + code.substring(end);
    console.log('Status bar removed!');
  } else {
    console.log('Could not find end of status bar');
  }
} else {
  console.log('Status bar start not found!');
}

fs.writeFileSync('src/app/page.tsx', code);
console.log('Done!');
