import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';

export const CANONICAL_PROMPT_FILE = 'PROMPT.md';
const LOWERCASE_PROMPT_FILE = 'prompt.md';

const MISSING_CANONICAL_MESSAGE = 'missing canonical prompt file';
const CASING_CONFLICT_MESSAGE =
  'casing-conflict: both prompt.md and PROMPT.md exist; keep one canonical file.';
const UNTRACKED_MESSAGE = 'PROMPT.md exists but is untracked; track/commit before push.';
const NORMALIZED_MESSAGE =
  'Normalized prompt.md -> PROMPT.md; status checked on canonical file.';
const CLEAN_AFTER_PUSH_MESSAGE =
  'PROMPT.md clean after push (no staged/unstaged/untracked prompt-file changes).';
const PUSH_FAILED_MESSAGE =
  'Push failed; cannot confirm post-push prompt status until push succeeds.';

export type PromptStatusState = 'PASS' | 'FAIL' | 'BLOCKED' | 'ERROR';

export interface GitCommandResult {
  code: number;
  stdout: string;
  stderr: string;
}

export interface PromptStatusResult {
  canonicalFile: typeof CANONICAL_PROMPT_FILE;
  message: string;
  normalizedInput: boolean;
  state: PromptStatusState;
  statusCode?: string;
}

export interface PromptStatusDeps {
  cwd?: string;
  readRootEntries?: (cwd: string) => string[];
  runGit?: (args: string[], cwd: string) => GitCommandResult;
}

type PromptCommand = 'validate' | 'fix' | 'push-confirm';

const EXIT_CODE_BY_STATE: Record<PromptStatusState, number> = {
  PASS: 0,
  FAIL: 1,
  BLOCKED: 2,
  ERROR: 3,
};

function getReadRootEntries(
  deps: PromptStatusDeps
): (cwd: string) => string[] {
  if (deps.readRootEntries) {
    return deps.readRootEntries;
  }

  return (cwd: string) => readdirSync(cwd);
}

function getGitRunner(
  deps: PromptStatusDeps
): (args: string[], cwd: string) => GitCommandResult {
  if (deps.runGit) {
    return deps.runGit;
  }

  return (args: string[], cwd: string) => {
    const result = spawnSync('git', args, {
      cwd,
      encoding: 'utf8',
    });
    if (result.error) {
      return {
        code: 1,
        stderr: result.error.message,
        stdout: '',
      };
    }

    return {
      code: result.status ?? 1,
      stderr: result.stderr ?? '',
      stdout: result.stdout ?? '',
    };
  };
}

function buildResult(
  state: PromptStatusState,
  message: string,
  normalizedInput: boolean,
  statusCode?: string
): PromptStatusResult {
  return {
    canonicalFile: CANONICAL_PROMPT_FILE,
    message,
    normalizedInput,
    state,
    statusCode,
  };
}

function normalizeInput(input?: string): { normalizedInput: boolean } {
  return {
    normalizedInput: (input ?? CANONICAL_PROMPT_FILE) === LOWERCASE_PROMPT_FILE,
  };
}

function getPromptStatusCode(stdout: string): string | undefined {
  const lines = stdout
    .split(/\r?\n/u)
    .map((line) => line.trimEnd())
    .filter(Boolean);

  for (const line of lines) {
    if (!line.endsWith(` ${CANONICAL_PROMPT_FILE}`)) {
      continue;
    }

    const rawCode = line.slice(0, 2);
    if (rawCode === '??') {
      return rawCode;
    }

    const trimmed = rawCode.trim();
    return trimmed || rawCode;
  }

  return undefined;
}

function sanitizeError(value: string): string {
  const redactedHttp = value.replace(/https?:\/\/\S+/gu, '<redacted-url>');
  const redactedSsh = redactedHttp.replace(
    /\bgit@[^:\s]+:[^\s]+/gu,
    '<redacted-remote>'
  );
  return redactedSsh.trim();
}

function assertPromptFiles(
  cwd: string,
  normalizedInput: boolean,
  readRootEntries: (cwd: string) => string[]
): PromptStatusResult | null {
  let entries: string[];
  try {
    entries = readRootEntries(cwd);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'unknown filesystem error';
    return buildResult('ERROR', message, normalizedInput);
  }

  const hasCanonical = entries.includes(CANONICAL_PROMPT_FILE);
  const hasLowercase = entries.includes(LOWERCASE_PROMPT_FILE);

  if (hasCanonical && hasLowercase) {
    return buildResult('FAIL', CASING_CONFLICT_MESSAGE, normalizedInput);
  }

  if (!hasCanonical) {
    return buildResult('FAIL', MISSING_CANONICAL_MESSAGE, normalizedInput);
  }

  return null;
}

function getPromptScopedStatus(
  cwd: string,
  normalizedInput: boolean,
  runGit: (args: string[], cwd: string) => GitCommandResult
): PromptStatusResult | { statusCode?: string } {
  const statusResult = runGit(['status', '--short', '--', CANONICAL_PROMPT_FILE], cwd);
  if (statusResult.code !== 0) {
    return buildResult(
      'ERROR',
      sanitizeError(statusResult.stderr || statusResult.stdout),
      normalizedInput
    );
  }

  return {
    statusCode: getPromptStatusCode(statusResult.stdout),
  };
}

export function validatePromptStatus(
  input?: string,
  deps: PromptStatusDeps = {}
): PromptStatusResult {
  const cwd = deps.cwd ?? process.cwd();
  const { normalizedInput } = normalizeInput(input);
  const readRootEntries = getReadRootEntries(deps);
  const runGit = getGitRunner(deps);

  const promptFilesValidation = assertPromptFiles(cwd, normalizedInput, readRootEntries);
  if (promptFilesValidation) {
    return promptFilesValidation;
  }

  const status = getPromptScopedStatus(cwd, normalizedInput, runGit);
  if ('state' in status) {
    return status;
  }

  if (status.statusCode === '??') {
    return buildResult('FAIL', UNTRACKED_MESSAGE, normalizedInput, status.statusCode);
  }

  if (normalizedInput) {
    return buildResult('PASS', NORMALIZED_MESSAGE, normalizedInput, status.statusCode);
  }

  return buildResult(
    'PASS',
    `PROMPT.md status checked on canonical file.`,
    normalizedInput,
    status.statusCode
  );
}

export function fixPromptTracking(
  input?: string,
  deps: PromptStatusDeps = {}
): PromptStatusResult {
  const cwd = deps.cwd ?? process.cwd();
  const { normalizedInput } = normalizeInput(input);
  const runGit = getGitRunner(deps);

  const before = validatePromptStatus(input, deps);
  if (before.state !== 'FAIL' || before.message !== UNTRACKED_MESSAGE) {
    return before;
  }

  const addResult = runGit(['add', '--', CANONICAL_PROMPT_FILE], cwd);
  if (addResult.code !== 0) {
    return buildResult(
      'ERROR',
      sanitizeError(addResult.stderr || addResult.stdout),
      normalizedInput
    );
  }

  const after = getPromptScopedStatus(cwd, normalizedInput, runGit);
  if ('state' in after) {
    return after;
  }

  if (after.statusCode === '??') {
    return buildResult('FAIL', UNTRACKED_MESSAGE, normalizedInput, after.statusCode);
  }

  return buildResult(
    'PASS',
    'PROMPT.md tracked by git and no longer untracked.',
    normalizedInput,
    after.statusCode
  );
}

function getCurrentBranch(
  cwd: string,
  normalizedInput: boolean,
  runGit: (args: string[], cwd: string) => GitCommandResult
): PromptStatusResult | string {
  const branchResult = runGit(['rev-parse', '--abbrev-ref', 'HEAD'], cwd);
  if (branchResult.code !== 0) {
    return buildResult(
      'BLOCKED',
      'Push blocked: unable to determine current branch.',
      normalizedInput
    );
  }

  const branch = branchResult.stdout.trim();
  if (branch === 'HEAD') {
    return buildResult(
      'BLOCKED',
      'Push blocked: detached HEAD; checkout a branch and set upstream before retrying.',
      normalizedInput
    );
  }

  return branch;
}

function ensureUpstreamExists(
  cwd: string,
  branch: string,
  normalizedInput: boolean,
  runGit: (args: string[], cwd: string) => GitCommandResult
): PromptStatusResult | null {
  const upstreamResult = runGit(
    ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'],
    cwd
  );
  if (upstreamResult.code === 0) {
    return null;
  }

  return buildResult(
    'BLOCKED',
    `Push blocked: no upstream configured; run git push --set-upstream origin ${branch}.`,
    normalizedInput
  );
}

export function pushAndConfirmPromptStatus(
  input?: string,
  deps: PromptStatusDeps = {}
): PromptStatusResult {
  const cwd = deps.cwd ?? process.cwd();
  const { normalizedInput } = normalizeInput(input);
  const runGit = getGitRunner(deps);

  const preCheck = validatePromptStatus(input, deps);
  if (preCheck.state !== 'PASS') {
    return preCheck;
  }

  const branch = getCurrentBranch(cwd, normalizedInput, runGit);
  if (typeof branch !== 'string') {
    return branch;
  }

  const upstreamCheck = ensureUpstreamExists(cwd, branch, normalizedInput, runGit);
  if (upstreamCheck) {
    return upstreamCheck;
  }

  const pushResult = runGit(['push'], cwd);
  if (pushResult.code !== 0) {
    return buildResult('BLOCKED', PUSH_FAILED_MESSAGE, normalizedInput);
  }

  const postPushStatus = getPromptScopedStatus(cwd, normalizedInput, runGit);
  if ('state' in postPushStatus) {
    return postPushStatus;
  }

  if (postPushStatus.statusCode) {
    return buildResult(
      'FAIL',
      `PROMPT.md has pending local changes after push (status: ${postPushStatus.statusCode}).`,
      normalizedInput,
      postPushStatus.statusCode
    );
  }

  return buildResult('PASS', CLEAN_AFTER_PUSH_MESSAGE, normalizedInput);
}

export function runPromptStatusCommand(
  command: PromptCommand,
  input?: string,
  deps: PromptStatusDeps = {}
): PromptStatusResult {
  if (command === 'validate') {
    return validatePromptStatus(input, deps);
  }

  if (command === 'fix') {
    return fixPromptTracking(input, deps);
  }

  return pushAndConfirmPromptStatus(input, deps);
}

if (import.meta.main) {
  const command = (process.argv[2] ?? 'validate') as PromptCommand;
  const input = process.argv[3];
  const supportedCommands: PromptCommand[] = ['validate', 'fix', 'push-confirm'];
  if (!supportedCommands.includes(command)) {
    const result = buildResult(
      'ERROR',
      `Unknown command: ${command}. Use validate, fix, or push-confirm.`,
      false
    );
    console.log(`${result.state}: ${result.message}`);
    process.exit(EXIT_CODE_BY_STATE[result.state]);
  }

  const result = runPromptStatusCommand(command, input);
  console.log(`${result.state}: ${result.message}`);
  process.exit(EXIT_CODE_BY_STATE[result.state]);
}
