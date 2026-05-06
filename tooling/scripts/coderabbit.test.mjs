/**
 * Tests for .coderabbit.yaml
 *
 * Validates the structure, required fields, and expected values of the
 * CodeRabbit configuration file at the repository root.
 *
 * Uses only Node built-ins (node:fs, node:path, node:test, node:assert)
 * since no YAML parser dependency is available in this repo.
 * Assertions operate on the raw file text using line-level patterns.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
const CONFIG_PATH = join(REPO_ROOT, '.coderabbit.yaml');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read the config file once for all tests. */
function readConfig() {
  return readFileSync(CONFIG_PATH, 'utf8');
}

/**
 * Minimal line-by-line YAML value extractor.
 * Handles only top-level `key: "value"` and `key: value` patterns.
 */
function getTopLevelValue(text, key) {
  const re = new RegExp(`^${key}:\\s*["\']?([^"'\\n#]+)["\']?`, 'm');
  const m = text.match(re);
  return m ? m[1].trim() : undefined;
}

/** Return true when the file contains the exact string `needle`. */
function hasLine(text, needle) {
  return text.includes(needle);
}

/** Collect all values of a YAML list under a given parent key. */
function getListValues(text, parentKey) {
  // Find the block that starts after `parentKey:` and collect `  - value` lines
  const startRe = new RegExp(`^${parentKey}:\\s*$`, 'm');
  const startMatch = startRe.exec(text);
  if (!startMatch) return [];

  const block = text.slice(startMatch.index + startMatch[0].length);
  const values = [];
  for (const line of block.split('\n')) {
    // Stop when we hit a non-indented line (end of the list block)
    if (line.length > 0 && !/^\s/.test(line)) break;
    const itemMatch = line.match(/^\s+-\s+"?([^"#\n]+)"?\s*$/);
    if (itemMatch) values.push(itemMatch[1].trim());
  }
  return values;
}

// ---------------------------------------------------------------------------
// File existence and parseability
// ---------------------------------------------------------------------------

test('config file exists at repo root', () => {
  // readConfig() throws ENOENT if missing — that IS the assertion
  const content = readConfig();
  assert.ok(content.length > 0, 'file must not be empty');
});

test('config file is valid UTF-8 text', () => {
  const content = readConfig();
  // If the file contained non-UTF-8 bytes, readFileSync('utf8') would throw
  assert.equal(typeof content, 'string');
});

test('config declares the CodeRabbit schema reference', () => {
  const content = readConfig();
  assert.ok(
    content.includes('$schema=https://coderabbit.ai/integrations/schema.v2.json'),
    'schema URL must be present'
  );
});

// ---------------------------------------------------------------------------
// Top-level fields
// ---------------------------------------------------------------------------

test('language is set to en-US', () => {
  const content = readConfig();
  const value = getTopLevelValue(content, 'language');
  assert.equal(value, 'en-US');
});

test('early_access is disabled', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, 'early_access: false'),
    'early_access must be false'
  );
});

test('tone_instructions are present and non-empty', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, 'tone_instructions:'),
    'tone_instructions key must be present'
  );
  // Must mention "file:line" — a key terse-review convention
  assert.ok(
    content.includes('file:line'),
    'tone_instructions must include file:line citation requirement'
  );
  // Must call out scope creep
  assert.ok(
    content.includes('scope creep'),
    'tone_instructions must flag scope creep'
  );
});

// ---------------------------------------------------------------------------
// reviews block
// ---------------------------------------------------------------------------

test('reviews.profile is chill', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '  profile: "chill"'),
    'review profile must be "chill"'
  );
});

test('reviews.request_changes_workflow is false (advisory-only)', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '  request_changes_workflow: false'),
    'request_changes_workflow must be false for advisory-only mode'
  );
});

test('reviews.high_level_summary is enabled', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '  high_level_summary: true'),
    'high_level_summary must be enabled'
  );
});

test('reviews.poem is disabled', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '  poem: false'),
    'poem must be disabled'
  );
});

test('reviews.collapse_walkthrough is enabled', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '  collapse_walkthrough: true'),
    'collapse_walkthrough must be enabled'
  );
});

test('reviews.sequence_diagrams is disabled', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '  sequence_diagrams: false'),
    'sequence_diagrams must be disabled'
  );
});

test('reviews.changed_files_summary is enabled', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '  changed_files_summary: true'),
    'changed_files_summary must be enabled'
  );
});

test('reviews.abort_on_close is enabled', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '  abort_on_close: true'),
    'abort_on_close must be true'
  );
});

// ---------------------------------------------------------------------------
// labeling_instructions
// ---------------------------------------------------------------------------

test('labeling_instructions includes performance label', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '    - label: "performance"'),
    'performance label must be defined'
  );
  assert.ok(
    content.includes('hot paths'),
    'performance label instructions must mention hot paths'
  );
});

test('labeling_instructions includes documentation label', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '    - label: "documentation"'),
    'documentation label must be defined'
  );
  assert.ok(
    content.includes('.agents/rules/*.mdc'),
    'documentation label must reference .agents/rules/*.mdc'
  );
});

// ---------------------------------------------------------------------------
// path_filters — generated/noisy paths excluded
// ---------------------------------------------------------------------------

test('path_filters excludes lock files', () => {
  const content = readConfig();
  assert.ok(hasLine(content, '    - "!**/*.lock"'), 'must exclude *.lock');
  assert.ok(hasLine(content, '    - "!**/pnpm-lock.yaml"'), 'must exclude pnpm-lock.yaml');
  assert.ok(hasLine(content, '    - "!**/yarn.lock"'), 'must exclude yarn.lock');
  assert.ok(hasLine(content, '    - "!**/package-lock.json"'), 'must exclude package-lock.json');
});

test('path_filters excludes build and dist artifacts', () => {
  const content = readConfig();
  assert.ok(hasLine(content, '    - "!**/dist/**"'), 'must exclude dist/');
  assert.ok(hasLine(content, '    - "!**/.turbo/**"'), 'must exclude .turbo/');
  assert.ok(hasLine(content, '    - "!**/.next/**"'), 'must exclude .next/');
  assert.ok(hasLine(content, '    - "!**/.contentlayer/**"'), 'must exclude .contentlayer/');
  assert.ok(hasLine(content, '    - "!**/*.tsbuildinfo"'), 'must exclude *.tsbuildinfo');
});

test('path_filters excludes node_modules and coverage', () => {
  const content = readConfig();
  assert.ok(hasLine(content, '    - "!**/node_modules/**"'), 'must exclude node_modules/');
  assert.ok(hasLine(content, '    - "!**/coverage/**"'), 'must exclude coverage/');
});

test('path_filters excludes snapshot files', () => {
  const content = readConfig();
  assert.ok(hasLine(content, '    - "!**/__snapshots__/**"'), 'must exclude __snapshots__/');
  assert.ok(hasLine(content, '    - "!**/*.snap"'), 'must exclude *.snap files');
});

test('path_filters excludes CI-controlled template and registry paths', () => {
  const content = readConfig();
  assert.ok(hasLine(content, '    - "!templates/**"'), 'must exclude templates/');
  assert.ok(hasLine(content, '    - "!apps/www/public/r/**"'), 'must exclude apps/www/public/r/');
  assert.ok(hasLine(content, '    - "!apps/www/.contentlayer/**"'), 'must exclude apps/www/.contentlayer/');
});

test('path_filters excludes CHANGELOG.md files', () => {
  const content = readConfig();
  assert.ok(hasLine(content, '    - "!**/CHANGELOG.md"'), 'must exclude CHANGELOG.md');
});

test('path_filters contains exactly 17 exclusion entries', () => {
  const content = readConfig();
  // Extract the path_filters block
  const start = content.indexOf('  path_filters:');
  const end = content.indexOf('  path_instructions:', start);
  const block = content.slice(start, end);
  const entries = (block.match(/^\s+-\s+"/gm) || []);
  assert.equal(entries.length, 17, `expected 17 path_filters entries, got ${entries.length}`);
});

// ---------------------------------------------------------------------------
// path_instructions — per-path review rules
// ---------------------------------------------------------------------------

test('path_instructions covers the src/lib Slate-first lane', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '    - path: "packages/**/src/lib/**/*.{ts,tsx}"'),
    'must have path_instructions for packages/**/src/lib/**/*.{ts,tsx}'
  );
  assert.ok(
    content.includes('Slate-first lane'),
    'src/lib instructions must declare Slate-first lane'
  );
  assert.ok(
    content.includes('toPlatePlugin'),
    'src/lib instructions must mention toPlatePlugin'
  );
});

test('path_instructions covers the src/react Plate wrapper lane', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '    - path: "packages/**/src/react/**/*.{ts,tsx}"'),
    'must have path_instructions for packages/**/src/react/**/*.{ts,tsx}'
  );
  assert.ok(
    content.includes('Plate/React wrapper lane'),
    'src/react instructions must declare Plate/React wrapper lane'
  );
});

test('path_instructions covers barrel index files', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '    - path: "packages/**/src/**/index.{ts,tsx}"'),
    'must have path_instructions for index barrel files'
  );
  assert.ok(
    content.includes('pnpm brl'),
    'barrel instructions must mention pnpm brl as the generator'
  );
});

test('path_instructions covers spec files with Bun runner policy', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '    - path: "packages/**/src/**/*.spec.{ts,tsx}"'),
    'must have path_instructions for *.spec.{ts,tsx}'
  );
  assert.ok(
    content.includes('Bun test runner'),
    'spec instructions must reference Bun test runner'
  );
});

test('path_instructions covers changeset version bump policy', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '    - path: ".changeset/*.md"'),
    'must have path_instructions for .changeset/*.md'
  );
  assert.ok(
    content.includes('new package = minor'),
    'changeset instructions must specify minor for new packages'
  );
  assert.ok(
    content.includes('breaking ='),
    'changeset instructions must specify major for breaking changes'
  );
});

test('path_instructions covers docs with no-changelog-language rule', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '    - path: "apps/www/content/docs/**/*.{md,mdx}"'),
    'must have path_instructions for docs/**/*.{md,mdx}'
  );
  assert.ok(
    content.includes('changelog-style language'),
    'docs instructions must reject changelog-style language'
  );
});

test('path_instructions covers AGENTS.md sync requirement', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '    - path: ".agents/AGENTS.md"'),
    'must have path_instructions for .agents/AGENTS.md'
  );
  assert.ok(
    content.includes('Source of truth for agent rules'),
    '.agents/AGENTS.md instructions must declare it as source of truth'
  );
});

test('path_instructions covers .agents/rules/*.mdc sync requirement', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '    - path: ".agents/rules/*.mdc"'),
    'must have path_instructions for .agents/rules/*.mdc'
  );
  assert.ok(
    content.includes('Source of truth for agent skill rules'),
    '.agents/rules/*.mdc instructions must declare it as source of truth'
  );
});

test('path_instructions covers templates with reject-manual-edits policy', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '    - path: "templates/**"'),
    'must have path_instructions for templates/**'
  );
  assert.ok(
    content.includes('CI-controlled output'),
    'templates instructions must declare CI-controlled output'
  );
  assert.ok(
    content.includes('Reject manual edits unconditionally'),
    'templates instructions must unconditionally reject manual edits'
  );
});

test('path_instructions contains exactly 8 entries', () => {
  const content = readConfig();
  const entries = (content.match(/^\s+- path:/gm) || []);
  assert.equal(entries.length, 9, `expected 9 path_instructions entries, got ${entries.length}`);
});

// ---------------------------------------------------------------------------
// auto_review settings
// ---------------------------------------------------------------------------

test('auto_review is enabled', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '    enabled: true'),
    'auto_review.enabled must be true'
  );
});

test('auto_incremental_review is enabled', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '    auto_incremental_review: true'),
    'auto_incremental_review must be true'
  );
});

test('auto_review.drafts is disabled', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '    drafts: false'),
    'drafts must be false — draft PRs should not be auto-reviewed'
  );
});

test('auto_review skips WIP pull requests', () => {
  const content = readConfig();
  assert.ok(
    content.includes('      - "WIP"'),
    'ignore_title_keywords must include WIP'
  );
});

test('auto_review skips DO NOT MERGE pull requests', () => {
  const content = readConfig();
  assert.ok(
    content.includes('      - "DO NOT MERGE"'),
    'ignore_title_keywords must include DO NOT MERGE'
  );
});

test('auto_review skips [skip ci] pull requests', () => {
  const content = readConfig();
  assert.ok(
    content.includes('      - "[skip ci]"'),
    'ignore_title_keywords must include [skip ci]'
  );
});

test('auto_review skips [skip release] pull requests', () => {
  const content = readConfig();
  assert.ok(
    content.includes('      - "[skip release]"'),
    'ignore_title_keywords must include [skip release]'
  );
});

test('auto_review targets main branch', () => {
  const content = readConfig();
  assert.ok(
    content.includes('      - "main"'),
    'base_branches must include main'
  );
});

test('auto_review targets codex/* branches', () => {
  const content = readConfig();
  assert.ok(
    content.includes('      - "codex/.*"'),
    'base_branches must include codex/.* regex'
  );
});

// ---------------------------------------------------------------------------
// finishing_touches
// ---------------------------------------------------------------------------

test('finishing_touches.docstrings is enabled', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '    docstrings:'),
    'finishing_touches.docstrings block must be present'
  );
  // The enabled: true line under docstrings
  const idx = content.indexOf('  finishing_touches:');
  const block = content.slice(idx, idx + 200);
  assert.ok(
    block.includes('enabled: true'),
    'finishing_touches.docstrings.enabled must be true'
  );
});

// ---------------------------------------------------------------------------
// chat settings
// ---------------------------------------------------------------------------

test('chat.auto_reply is enabled', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '  auto_reply: true'),
    'chat.auto_reply must be true'
  );
});

test('chat Jira integration is disabled', () => {
  const content = readConfig();
  const jiraIdx = content.indexOf('    jira:');
  assert.ok(jiraIdx !== -1, 'chat.integrations.jira block must be present');
  const jiraBlock = content.slice(jiraIdx, jiraIdx + 60);
  assert.ok(
    jiraBlock.includes('usage: "disabled"'),
    'chat.integrations.jira.usage must be "disabled"'
  );
});

test('chat Linear integration is disabled', () => {
  const content = readConfig();
  const linearIdx = content.indexOf('    linear:');
  assert.ok(linearIdx !== -1, 'chat.integrations.linear block must be present');
  const linearBlock = content.slice(linearIdx, linearIdx + 60);
  assert.ok(
    linearBlock.includes('usage: "disabled"'),
    'chat.integrations.linear.usage must be "disabled"'
  );
});

// ---------------------------------------------------------------------------
// knowledge_base settings
// ---------------------------------------------------------------------------

test('knowledge_base.opt_out is false (opting in)', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '  opt_out: false'),
    'knowledge_base.opt_out must be false (participation enabled)'
  );
});

test('knowledge_base.learnings scope is auto', () => {
  const content = readConfig();
  const learnIdx = content.indexOf('  learnings:');
  assert.ok(learnIdx !== -1, 'knowledge_base.learnings block must be present');
  const block = content.slice(learnIdx, learnIdx + 50);
  assert.ok(
    block.includes('scope: "auto"'),
    'knowledge_base.learnings.scope must be "auto"'
  );
});

test('knowledge_base.issues scope is auto', () => {
  const content = readConfig();
  const issuesIdx = content.indexOf('  issues:');
  assert.ok(issuesIdx !== -1, 'knowledge_base.issues block must be present');
  const block = content.slice(issuesIdx, issuesIdx + 50);
  assert.ok(
    block.includes('scope: "auto"'),
    'knowledge_base.issues.scope must be "auto"'
  );
});

test('knowledge_base.pull_requests scope is auto', () => {
  const content = readConfig();
  const prIdx = content.indexOf('  pull_requests:');
  assert.ok(prIdx !== -1, 'knowledge_base.pull_requests block must be present');
  const block = content.slice(prIdx, prIdx + 50);
  assert.ok(
    block.includes('scope: "auto"'),
    'knowledge_base.pull_requests.scope must be "auto"'
  );
});

// ---------------------------------------------------------------------------
// Regression / boundary cases
// ---------------------------------------------------------------------------

test('config does not contain Windows-style CRLF line endings', () => {
  const content = readConfig();
  assert.ok(
    !content.includes('\r\n'),
    'file must use LF (Unix) line endings, not CRLF'
  );
});

test('config does not use tab indentation', () => {
  const content = readConfig();
  const lines = content.split('\n');
  for (const [i, line] of lines.entries()) {
    assert.ok(
      !line.startsWith('\t'),
      `line ${i + 1} must not start with a tab character`
    );
  }
});

test('all path_filter entries are negation patterns (prefixed with !)', () => {
  const content = readConfig();
  const start = content.indexOf('  path_filters:');
  const end = content.indexOf('  path_instructions:', start);
  const block = content.slice(start, end);
  const entries = block.match(/^\s+-\s+"([^"]+)"/gm) || [];
  for (const entry of entries) {
    const value = entry.match(/"([^"]+)"/)[1];
    assert.ok(
      value.startsWith('!'),
      `path_filter entry "${value}" must start with ! (negation)`
    );
  }
});

test('high_level_summary_placeholder references @coderabbitai', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '  high_level_summary_placeholder: "@coderabbitai summary"'),
    'high_level_summary_placeholder must be "@coderabbitai summary"'
  );
});

test('auto_title_placeholder references @coderabbitai', () => {
  const content = readConfig();
  assert.ok(
    hasLine(content, '  auto_title_placeholder: "@coderabbitai"'),
    'auto_title_placeholder must be "@coderabbitai"'
  );
});
