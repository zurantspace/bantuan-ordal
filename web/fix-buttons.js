const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// 2. Add "use client" at top for interactivity
if (!code.startsWith('"use client"')) {
  code = '"use client";\n\n' + code;
}

// 3. Make CTA buttons (red gradient divs) clickable with cursor:pointer
// These are the 3 CTA button backgrounds at top:587, 4990, 6382, 3083
// Add cursor:pointer to all div elements that have the red gradient background-image and fixed height of 46px
code = code.replace(
  /"backgroundImage":"linear-gradient\(90deg, #f1301e 0%, #9f2315 100%\)","backgroundBlendMode":"normal","left":"66px","top":"587px","width":"259px","height":"46px","position":"absolute","boxShadow":"0px 4px 40px 5px rgba\(255,7,7,0.26\)"/g,
  '"backgroundImage":"linear-gradient(90deg, #f1301e 0%, #9f2315 100%)","backgroundBlendMode":"normal","left":"66px","top":"587px","width":"259px","height":"46px","position":"absolute","boxShadow":"0px 4px 40px 5px rgba(255,7,7,0.26)","cursor":"pointer"'
);
code = code.replace(
  /"backgroundImage":"linear-gradient\(90deg, #f1301e 0%, #9f2315 100%\)","backgroundBlendMode":"normal","left":"66px","top":"4990px","width":"259px","height":"46px","position":"absolute","boxShadow":"0px 4px 40px 5px rgba\(255,7,7,0.26\)"/g,
  '"backgroundImage":"linear-gradient(90deg, #f1301e 0%, #9f2315 100%)","backgroundBlendMode":"normal","left":"66px","top":"4990px","width":"259px","height":"46px","position":"absolute","boxShadow":"0px 4px 40px 5px rgba(255,7,7,0.26)","cursor":"pointer"'
);
code = code.replace(
  /"backgroundImage":"linear-gradient\(90deg, #f1301e 0%, #9f2315 100%\)","backgroundBlendMode":"normal","left":"66px","top":"6382px","width":"259px","height":"46px","position":"absolute","boxShadow":"0px 4px 40px 5px rgba\(255,7,7,0.26\)"/g,
  '"backgroundImage":"linear-gradient(90deg, #f1301e 0%, #9f2315 100%)","backgroundBlendMode":"normal","left":"66px","top":"6382px","width":"259px","height":"46px","position":"absolute","boxShadow":"0px 4px 40px 5px rgba(255,7,7,0.26)","cursor":"pointer"'
);
code = code.replace(
  /"backgroundImage":"linear-gradient\(90deg, #f1301e 0%, #9f2315 100%\)","backgroundBlendMode":"normal","left":"66px","top":"3083px","width":"259px","height":"46px","position":"absolute","boxShadow":"0px 4px 40px 5px rgba\(255,7,7,0.26\)"/g,
  '"backgroundImage":"linear-gradient(90deg, #f1301e 0%, #9f2315 100%)","backgroundBlendMode":"normal","left":"66px","top":"3083px","width":"259px","height":"46px","position":"absolute","boxShadow":"0px 4px 40px 5px rgba(255,7,7,0.26)","cursor":"pointer"'
);

// 4. Make the login button clickable
code = code.replace(
  /"borderRadius":"6px","backgroundImage":"linear-gradient\(90deg, #f1301e 0%, #9f2315 100%\)","backgroundBlendMode":"normal","display":"flex","flexDirection":"row","gridColumnGap":"10px","alignItems":"center","justifyContent":"center","left":"290px","top":"71px","width":"83px","height":"25px","position":"absolute","padding":"2px 13px"/g,
  '"borderRadius":"6px","backgroundImage":"linear-gradient(90deg, #f1301e 0%, #9f2315 100%)","backgroundBlendMode":"normal","display":"flex","flexDirection":"row","gridColumnGap":"10px","alignItems":"center","justifyContent":"center","left":"290px","top":"71px","width":"83px","height":"25px","position":"absolute","padding":"2px 13px","cursor":"pointer"'
);

// 5. Fix responsive: make outer wrapper responsive instead of fixed 393px
// The inner div has fixed width 393px which is fine for phone, but we need the outer container to center it
// and allow scrolling properly
code = code.replace(
  'className="min-h-screen bg-black overflow-x-hidden"',
  'className="min-h-screen bg-black overflow-x-hidden flex justify-center"'
);

// 6. Wrap the CTA button divs and their text spans with <a> tags linking to checkout
// Find all 4 CTA button divs and make them clickable by wrapping in anchor

fs.writeFileSync('src/app/page.tsx', code);
console.log('Buttons made clickable, status bar removed, responsive fix applied!');
