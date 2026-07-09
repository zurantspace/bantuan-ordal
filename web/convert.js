const fs = require('fs');

const html = fs.readFileSync('../pages/Landing Page/index.html', 'utf8');

// Copy images to public/images
if (!fs.existsSync('public/images')) {
  fs.mkdirSync('public/images', { recursive: true });
}
const imagesDir = '../pages/Landing Page/images/';
if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir);
    for (const file of files) {
        fs.copyFileSync(imagesDir + file, 'public/images/' + file);
    }
}

// Quick and dirty HTML to JSX
let jsx = html.substring(html.indexOf('<body'), html.indexOf('</body>') + 7);

// Remove body tags
jsx = jsx.replace(/<body[^>]*>/, '<div className="min-h-screen bg-black overflow-x-hidden">');
jsx = jsx.replace(/<\/body>/, '</div>');

// Basic replaces
jsx = jsx.replace(/class=/g, 'className=');
jsx = jsx.replace(/<!--[\s\S]*?-->/g, ''); // remove comments
jsx = jsx.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
jsx = jsx.replace(/<br([^>]*[^\/])>/g, '<br$1 />');
jsx = jsx.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
jsx = jsx.replace(/<meta([^>]*[^\/])>/g, '<meta$1 />');
jsx = jsx.replace(/<hr([^>]*[^\/])>/g, '<hr$1 />');
jsx = jsx.replace(/<link([^>]*[^\/])>/g, '<link$1 />');

// style handling
jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
    const rules = p1.split(';').filter(r => r.trim().length > 0);
    const obj = {};
    rules.forEach(r => {
        let [k, v] = r.split(':');
        if(k && v) {
            k = k.trim().replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
            obj[k] = v.trim();
        }
    });
    return 'style={' + JSON.stringify(obj) + '}';
});

// also extract <style> blocks
const styleMatches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)];
let globalCss = fs.readFileSync('src/app/globals.css', 'utf8');
styleMatches.forEach(m => {
    globalCss += '\n' + m[1];
});
fs.writeFileSync('src/app/globals.css', globalCss);

const out = `
export default function LandingPageOriginal() {
  return (
    <>
      ${jsx}
    </>
  )
}
`;
fs.writeFileSync('src/app/page.tsx', out);
console.log('Conversion script finished');
