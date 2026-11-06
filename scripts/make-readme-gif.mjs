// Convert verified native window captures, not a simulated page, into a paced GIF.
// Usage: node scripts/make-readme-gif.mjs /path/to/native-captures
// Requires ffmpeg on PATH. Raw captures stay outside the published evidence.
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

const captures = process.argv[2];
if (!captures) throw new Error('Pass the directory containing native window captures.');
const root = resolve(import.meta.dirname, '..');
const work = resolve(root, 'dist/readme-gif');
const output = resolve(root, 'docs/evidence/reading-two-expansions-110.gif');
const frames = [
  [41, 2, 'Both thoughts collapsed'],
  [43, 1.2, 'First thought expanded; original reasoning precedes novel'],
  [45, 0.7, 'Scroll within the actual conversation'],
  [47, 0.5, 'Adjust viewport without altering content'],
  [49, 5, 'First thought and first novel passage readable'],
  [51, 1.5, 'First thought collapsed'],
  [53, 2, 'Second distinct thought expanded; next novel passage'],
  [55, 5, 'Scroll to read the second passage'],
  [59, 2, 'Second thought collapsed'],
];
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
await mkdir(work, { recursive: true });
const provenance = [];
const entries = [];
for (const [id, seconds, action] of frames) {
  const file = resolve(captures, `${id}-root_result_content_0.png`);
  const bytes = await readFile(file);
  if (bytes.toString('hex', 0, 8) !== '89504e470d0a1a0a' ||
      bytes.readUInt32BE(16) !== 1567 || bytes.readUInt32BE(20) !== 983) {
    throw new Error(`Unexpected native capture dimensions: ${id}`);
  }
  const escape = value => value.replaceAll("'", "'\\''");
  entries.push(`file '${escape(file)}'\nduration ${seconds}`);
  provenance.push({ capture: id, sha256: sha256(bytes), seconds, action });
}
const last = resolve(captures, `${frames.at(-1)[0]}-root_result_content_0.png`);
entries.push(`file '${last.replaceAll("'", "'\\''")}'`);
const list = resolve(work, 'frames.ffconcat');
await writeFile(list, `ffconcat version 1.0\n${entries.join('\n')}\n`);
// Opaque removal of unrelated workspace/session names, quota, account and avatar.
// The logo, navigation, current project/session, conversation and composer remain.
const filter = '[0:v]drawbox=x=0:y=541:w=298:h=442:color=0xF8F9FA:t=fill,' +
  'crop=1567:856:0:94,split[a][b];[a]palettegen=stats_mode=full[p];' +
  '[b][p]paletteuse=dither=none';
const result = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y',
  '-f', 'concat', '-safe', '0', '-i', list, '-filter_complex', filter,
  '-fps_mode', 'vfr', '-loop', '0', output], { encoding: 'utf8' });
if (result.status !== 0) throw new Error(result.stderr || 'ffmpeg failed');
const gif = await readFile(output);
const bundle = await readFile(resolve(root, 'lib/client.js'));
const record = {
  capturedOn: '2026-11-07', host: 'DSH Web 0.2.2-alpha.2',
  source: 'Actual running DSH GUI, native Cua window captures; not a mock Host.',
  method: 'Paced native before/after window frames; not continuous desktop video. No interpolated or fabricated UI frames.',
  interaction: 'Expand first thought, scroll, collapse; expand a different thought, scroll, collapse. No model messages sent.',
  book: 'Existing user-imported AQ TXT, 98 segments, intentionally preserved by migration. New bundled AQ MD is independently tested.',
  crop: { x: 0, y: 94, width: 1567, height: 856 },
  redaction: { x: 0, y: 541, width: 298, height: 442, scope: 'Original capture pixels; opaque mask over unrelated sidebar sessions, quota and account.' },
  unchanged: 'No rewriting of the reasoning, novel, plugin controls, logo or current project/session.',
  frames: provenance,
  output: { file: relative(root, output), bytes: gif.length, sha256: sha256(gif), width: 1567, height: 856 },
  testedBundle: { bytes: bundle.length, sha256: sha256(bundle) },
};
await writeFile(resolve(root, 'docs/evidence/reading-two-expansions-110.json'), `${JSON.stringify(record, null, 2)}\n`);
console.log(JSON.stringify(record, null, 2));
