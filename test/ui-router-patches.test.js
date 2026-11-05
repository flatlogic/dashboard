const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

test('router backport remains repeatable and rejects changed distribution files before writing', async context => {
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'router-backport-'));
  context.after(() => fs.rm(temporary, { recursive: true, force: true }));
  const relative = 'bower_components/angular-ui-router';
  const directory = path.join(temporary, relative);
  await fs.mkdir(path.join(directory, 'release'), { recursive: true });
  const names = ['bower.json', 'release/angular-ui-router.js', 'release/angular-ui-router.min.js'];
  const original = await Promise.all(names.map(name => fs.readFile(path.join(relative, name))));
  for (const [index, name] of names.entries()) await fs.writeFile(path.join(directory, name), original[index]);
  const run = () => spawnSync(process.execPath, [path.resolve('build/patch-ui-router.cjs')], { cwd: temporary, encoding: 'utf8' });
  const repeated = run();
  assert.equal(repeated.status, 0, repeated.stderr);
  for (const [index, name] of names.entries()) assert.deepEqual(await fs.readFile(path.join(directory, name)), original[index]);
  await fs.appendFile(path.join(directory, names[2]), '\n// changed minified file\n');
  const rejected = run();
  assert.notEqual(rejected.status, 0);
  assert.match(rejected.stderr, /input mismatch/);
  assert.deepEqual(await fs.readFile(path.join(directory, names[1])), original[1]);
});
