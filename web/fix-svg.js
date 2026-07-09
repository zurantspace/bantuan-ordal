const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// React DOM property casing
code = code.replace(/stop-color/g, 'stopColor');
code = code.replace(/fill-rule/g, 'fillRule');
code = code.replace(/clip-rule/g, 'clipRule');
code = code.replace(/clip-path/g, 'clipPath');
code = code.replace(/stroke-width/g, 'strokeWidth');
code = code.replace(/stroke-linecap/g, 'strokeLinecap');
code = code.replace(/stroke-linejoin/g, 'strokeLinejoin');
code = code.replace(/stroke-miterlimit/g, 'strokeMiterlimit');
code = code.replace(/xmlns:xlink/g, 'xmlnsXlink');
code = code.replace(/lineargradient/g, 'linearGradient');
code = code.replace(/gradienttransform/g, 'gradientTransform');
code = code.replace(/gradientunits/g, 'gradientUnits');
code = code.replace(/preserveaspectratio/g, 'preserveAspectRatio');
code = code.replace(/viewbox/g, 'viewBox');
code = code.replace(/<br>/g, '<br />'); // just in case

fs.writeFileSync('src/app/page.tsx', code);
console.log('SVG attributes fixed');
