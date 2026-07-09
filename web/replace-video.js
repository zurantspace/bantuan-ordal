const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// The lines we want to replace
const targetThumbnail = '      <div style={{"overflow":"hidden","borderRadius":"20px","left":"43px","top":"392px","width":"305px","height":"155px","position":"absolute","filter":"drop-shadow(0px 3px 4px rgba(0,0,0,0.25))"}}><img src="images/95bdde574663222db6a16fc32e08d608bf39b10f.png" alt="Rectangle 22" style={{"opacity":"0.8999999761581421","inset":"0","width":"100%","height":"100%","position":"absolute","objectFit":"cover"}} /></div>';

const targetPlayBtn = '      <div style={{"overflow":"hidden","left":"166px","top":"439px","aspectRatio":"1","width":"auto","height":"61px","position":"absolute","filter":"drop-shadow(0px 4px 4px rgba(0,0,0,0.25))","backfaceVisibility":"hidden","transform":"translateZ(0)"}}><svg width="50.00001144409181" height="50.83334732055664" viewBox="0 0 50.00001144409181 50.83334732055664" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" style={{"left":"8.3%","top":"8.3%","right":"8.3%","bottom":"8.3%","width":"83.3%","height":"83.3%","position":"absolute"}}> <path d="M25 0C20.0555 0 15.222 1.4907 11.1108 4.2835 6.9995 7.0763 3.7952 11.0458 1.903 15.6901 0.0108 20.3344-0.4843 25.4449 0.4804 30.3752 1.445 35.3056 3.826 39.8344 7.3223 43.389 10.8187 46.9435 15.2732 49.3643 20.1228 50.345 24.9723 51.3257 29.9989 50.8223 34.5671 48.8986 39.1353 46.9749 43.0397 43.7172 45.7867 39.5374 48.5338 35.3577 50 30.4436 50 25.4167 50 22.0789 49.3534 18.7738 48.097 15.6901 46.8406 12.6064 44.9991 9.8045 42.6777 7.4444 40.3562 5.0842 37.6002 3.212 34.5671 1.9347 31.534 0.6574 28.2831 0 25 0ZM20 36.8542V13.9792L35 25.4167 20 36.8542Z" style={{"fillRule":"nonzero","fill":"#fff"}}></path> </svg></div>';

const replaceWith = `      <VideoPlayer 
        poster="images/95bdde574663222db6a16fc32e08d608bf39b10f.png"
        style={{
          borderRadius: "20px",
          left: "43px",
          top: "392px",
          width: "305px",
          height: "155px",
          filter: "drop-shadow(0px 3px 4px rgba(0,0,0,0.25))"
        }}
      />`;

if (code.includes(targetThumbnail)) {
  code = code.replace(targetThumbnail + '\\n' + targetPlayBtn, replaceWith);
} else {
  // If line endings are different or something
  code = code.replace(targetThumbnail, replaceWith);
  code = code.replace(targetPlayBtn, '');
}

// Add import if not exists
if (!code.includes('import VideoPlayer')) {
  code = code.replace('export default function LandingPageOriginal() {', 'import VideoPlayer from "./components/VideoPlayer";\\n\\nexport default function LandingPageOriginal() {');
}

fs.writeFileSync('src/app/page.tsx', code);
console.log('Replacement complete!');
