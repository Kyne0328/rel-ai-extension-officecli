import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = path.join(ROOT, 'relai-extension.json');
const SKILL_PATH = path.join(ROOT, 'SKILL.md');
const AGENT_PATH = path.join(ROOT, 'agents', 'openai.yaml');

const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const PLATFORMS = new Set(['win32', 'darwin', 'linux']);
const ARCHITECTURES = new Set(['x64', 'arm64']);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function validateManifest(manifest) {
  assert(manifest.schemaVersion === 1, 'schemaVersion must be 1.');
  assert(manifest.id === 'officecli', 'id must be officecli.');
  assert(manifest.kind === 'cli', 'kind must be cli.');
  assert(typeof manifest.version === 'string' && manifest.version.length > 0, 'version is required.');
  assert(
    manifest.repository === 'https://github.com/Kyne0328/rel-ai-extension-officecli',
    'repository URL is incorrect.'
  );

  assert(manifest.entrypoints?.skill === 'SKILL.md', 'skill entry point is incorrect.');
  assert(manifest.entrypoints?.command === 'officecli', 'command entry point is incorrect.');
  assert(manifest.permissions?.includes('command.execute'), 'command.execute permission is required.');

  assert(manifest.install?.type === 'binary', 'install.type must be binary.');

  const targets = new Set();
  for (const artifact of manifest.install.artifacts || []) {
    assert(PLATFORMS.has(artifact.platform), `Unsupported platform: ${artifact.platform}`);
    assert(ARCHITECTURES.has(artifact.arch), `Unsupported architecture: ${artifact.arch}`);
    assert(new URL(artifact.url).protocol === 'https:', 'Artifact URL must use HTTPS.');
    assert(SHA256_PATTERN.test(artifact.sha256), 'Artifact SHA-256 is invalid.');

    const target = `${artifact.platform}/${artifact.arch}`;
    assert(!targets.has(target), `Duplicate artifact target: ${target}`);
    targets.add(target);
  }

  const requiredTargets = new Set([
    'win32/x64',
    'win32/arm64',
    'darwin/x64',
    'darwin/arm64',
    'linux/x64',
    'linux/arm64'
  ]);

  assert(
    targets.size === requiredTargets.size && [...requiredTargets].every(target => targets.has(target)),
    'Artifact target set is incomplete.'
  );
}

function validatePackageFiles(manifest) {
  const declaredPaths = new Set((manifest.files || []).map(item => item.path));
  const requiredPaths = new Set(['SKILL.md', 'agents/openai.yaml']);

  assert(
    declaredPaths.size === requiredPaths.size && [...requiredPaths].every(file => declaredPaths.has(file)),
    'Package file list is incorrect.'
  );

  for (const item of manifest.files) {
    const filePath = path.resolve(ROOT, item.path);
    assert(fs.existsSync(filePath) && fs.statSync(filePath).isFile(), `Missing package file: ${item.path}`);
    const digest = sha256(filePath);
    assert(digest === item.sha256, `Hash mismatch for ${item.path}: ${digest}`);
  }
}

function validateSkill() {
  const skill = fs.readFileSync(SKILL_PATH, 'utf8').replaceAll('\r\n', '\n');
  assert(skill.startsWith('---\nname: officecli\n'), 'SKILL.md frontmatter is incorrect.');
  assert(skill.includes('OFFICECLI_SKIP_UPDATE=1'), 'SKILL.md must disable OfficeCLI self-update.');
  assert(fs.existsSync(AGENT_PATH), 'agents/openai.yaml is missing.');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const manifest = readJson(MANIFEST_PATH);
validateManifest(manifest);
validatePackageFiles(manifest);
validateSkill();
console.log('OfficeCLI extension checks passed.');
