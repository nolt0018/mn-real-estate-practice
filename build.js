/* Bundles the app into one self-contained HTML file.
   Run: node build.js  ->  dist/mn-real-estate-practice.html
   The single file works offline, emails/AirDrops cleanly, and can be saved to
   a phone home screen. */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

let html = read('index.html');

// NOTE: the replacements must be FUNCTIONS, not strings. The source contains
// the two-character sequence $' (from the "'$'" in the money formatter), which
// a string replacement would interpret as "insert everything after the match",
// duplicating the rest of the document.

// inline the stylesheet
html = html.replace(
  /<link rel="stylesheet" href="css\/style\.css">/,
  () => '<style>\n' + read('css/style.css') + '\n</style>'
);

// inline the scripts, in order
['js/mathgen.js', 'js/questions.js', 'js/app.js'].forEach(src => {
  html = html.replace(
    new RegExp('<script src="' + src.replace('/', '\\/') + '"><\\/script>'),
    () => '<script>\n' + read(src) + '\n</script>'
  );
});

if (/<script src=|<link rel="stylesheet"/.test(html)) {
  console.error('ERROR: some external references were not inlined.');
  process.exit(1);
}

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const out = path.join(root, 'dist', 'mn-real-estate-practice.html');
fs.writeFileSync(out, html);
console.log('Wrote ' + out + '  (' + Math.round(html.length / 1024) + ' KB, no external files needed)');

/* Artifact variant: the publisher wraps the file in its own
   <!doctype><head><body> skeleton, so strip ours and keep <title> + content. */
const title = html.match(/<title>([\s\S]*?)<\/title>/)[1];
const style = html.match(/<style>[\s\S]*?<\/style>/)[0];
const body = html.match(/<body>([\s\S]*)<\/body>/)[1];
const artifact = '<title>' + title + '</title>\n' + style + '\n' + body.trim() + '\n';

const aout = path.join(root, 'dist', 'artifact.html');
fs.writeFileSync(aout, artifact);
if (/<!DOCTYPE|<html|<head>|<body>/i.test(artifact)) {
  console.error('ERROR: artifact variant still contains document skeleton tags.');
  process.exit(1);
}
console.log('Wrote ' + aout + '  (' + Math.round(artifact.length / 1024) + ' KB, artifact-ready)');
