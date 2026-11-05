const fs = require('node:fs/promises');
const crypto = require('node:crypto');
const { minify } = require('terser');
const inputs = require('./ui-router-inputs.json');
const digest = value => crypto.createHash('sha256').update(value).digest('hex');

async function patchUiRouter() {
  const root = 'bower_components/angular-ui-router/';
  const metadata = JSON.parse(await fs.readFile(root + 'bower.json', 'utf8'));
  if (metadata.version !== inputs.version) throw new Error('Unreviewed legacy UI-Router version');
  const sourceFile = root + 'release/angular-ui-router.js';
  const current = await fs.readFile(sourceFile, 'utf8');
  let original = current;
  for (const change of [...inputs.changes].reverse()) original = original.replace(change.after, change.before);
  if (digest(original) !== inputs.sourceSha256) throw new Error('UI-Router source input mismatch');
  let patched = original;
  for (const change of inputs.changes) {
    if (patched.split(change.before).length !== 2) throw new Error('UI-Router patch context changed');
    patched = patched.replace(change.before, change.after);
  }
  const minified = (await minify(patched, { format: { comments: /^!|@license|@preserve/ } })).code;
  const minifiedFile = root + 'release/angular-ui-router.min.js';
  const currentMinified = await fs.readFile(minifiedFile, 'utf8');
  if (currentMinified !== minified && digest(currentMinified) !== inputs.minifiedSha256) throw new Error('UI-Router minified input mismatch');
  await fs.writeFile(sourceFile, patched);
  await fs.writeFile(minifiedFile, minified);
}
module.exports = { patchUiRouter };
if (require.main === module) patchUiRouter().catch(error => { console.error(error); process.exitCode = 1; });
