import { describe, expect, it } from 'bun:test';

import {
  fixPromptTracking,
  pushAndConfirmPromptStatus,
  type GitCommandResult,
  type PromptStatusDeps,
  validatePromptStatus,
} from './prompt-status';

function ok(stdout = ''): GitCommandResult {
  return {
    code: 0,
    stderr: '',
    stdout,
  };
}

function fail(stderr = 'fatal'): GitCommandResult {
  return {
    code: 1,
    stderr,
    stdout: '',
  };
}

function createDeps({
  entries = ['PROMPT.md'],
  gitQueue = [],
  readError,
}: {
  entries?: string[];
  gitQueue?: GitCommandResult[];
  readError?: Error;
}): { calls: string[][]; deps: PromptStatusDeps; remaining: () => number } {
  const queue = [...gitQueue];
  const calls: string[][] = [];

  return {
    calls,
    deps: {
      cwd: '/tmp/repo',
      readRootEntries: () => {
        if (readError) {
          throw readError;
        }
        return [...entries];
      },
      runGit: (args) => {
        calls.push(args);
        const next = queue.shift();
        if (!next) {
          throw new Error(`No queued git response for command: ${args.join(' ')}`);
        }
        return next;
      },
    },
    remaining: () => queue.length,
  };
}

describe('Given prompt status workflow from approved spec', () => {
  it('When PROMPT.md is untracked and fix workflow runs Then it becomes tracked and not ??', () => {
    const harness = createDeps({
      gitQueue: [ok('?? PROMPT.md\n'), ok(), ok('A  PROMPT.md\n')],
    });

    const result = fixPromptTracking('PROMPT.md', harness.deps);

    expect(result.state).toBe('PASS');
    expect(result.statusCode).toBe('A');
    expect(result.message).toBe('PROMPT.md tracked by git and no longer untracked.');
    expect(harness.calls).toEqual([
      ['status', '--short', '--', 'PROMPT.md'],
      ['add', '--', 'PROMPT.md'],
      ['status', '--short', '--', 'PROMPT.md'],
    ]);
    expect(harness.remaining()).toBe(0);
  });

  it('When request references prompt.md Then workflow normalizes to canonical PROMPT.md', () => {
    const harness = createDeps({
      gitQueue: [ok('')],
    });

    const result = validatePromptStatus('prompt.md', harness.deps);

    expect(result.state).toBe('PASS');
    expect(result.normalizedInput).toBe(true);
    expect(result.message).toBe(
      'Normalized prompt.md -> PROMPT.md; status checked on canonical file.'
    );
    expect(harness.calls).toEqual([['status', '--short', '--', 'PROMPT.md']]);
  });

  it('When both prompt.md and PROMPT.md exist Then pre-push validation fails with casing conflict', () => {
    const harness = createDeps({
      entries: ['PROMPT.md', 'prompt.md'],
    });

    const result = pushAndConfirmPromptStatus('PROMPT.md', harness.deps);

    expect(result.state).toBe('FAIL');
    expect(result.message).toBe(
      'casing-conflict: both prompt.md and PROMPT.md exist; keep one canonical file.'
    );
    expect(harness.calls).toEqual([]);
  });

  it('When push succeeds Then post-push validation confirms PROMPT.md is clean', () => {
    const harness = createDeps({
      gitQueue: [
        ok(''),
        ok('feature/prompt-status-fix\n'),
        ok('origin/feature/prompt-status-fix\n'),
        ok(),
        ok(''),
      ],
    });

    const result = pushAndConfirmPromptStatus('PROMPT.md', harness.deps);

    expect(result.state).toBe('PASS');
    expect(result.message).toBe(
      'PROMPT.md clean after push (no staged/unstaged/untracked prompt-file changes).'
    );
    expect(harness.calls[3]).toEqual(['push']);
    expect(harness.calls[4]).toEqual(['status', '--short', '--', 'PROMPT.md']);
    expect(harness.remaining()).toBe(0);
  });

  it('When push is rejected Then workflow reports BLOCKED and skips post-push clean confirmation', () => {
    const harness = createDeps({
      gitQueue: [
        ok(''),
        ok('feature/prompt-status-fix\n'),
        ok('origin/feature/prompt-status-fix\n'),
        fail('! [rejected] non-fast-forward'),
      ],
    });

    const result = pushAndConfirmPromptStatus('PROMPT.md', harness.deps);

    expect(result.state).toBe('BLOCKED');
    expect(result.message).toBe(
      'Push failed; cannot confirm post-push prompt status until push succeeds.'
    );
    expect(harness.calls).toEqual([
      ['status', '--short', '--', 'PROMPT.md'],
      ['rev-parse', '--abbrev-ref', 'HEAD'],
      ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'],
      ['push'],
    ]);
  });

  it('When unrelated files are dirty Then prompt status checks stay scoped to PROMPT.md', () => {
    const calls: string[][] = [];
    const deps: PromptStatusDeps = {
      cwd: '/tmp/repo',
      readRootEntries: () => ['PROMPT.md'],
      runGit: (args) => {
        calls.push(args);
        expect(args).toEqual(['status', '--short', '--', 'PROMPT.md']);
        return ok('');
      },
    };

    const result = validatePromptStatus('PROMPT.md', deps);

    expect(result.state).toBe('PASS');
    expect(calls).toEqual([['status', '--short', '--', 'PROMPT.md']]);
  });
});

describe('Given prompt status edge cases from spec', () => {
  it('returns FAIL when canonical prompt file is missing', () => {
    const harness = createDeps({
      entries: ['README.md'],
    });

    const result = validatePromptStatus('PROMPT.md', harness.deps);

    expect(result.state).toBe('FAIL');
    expect(result.message).toBe('missing canonical prompt file');
  });

  it('returns BLOCKED when on detached HEAD', () => {
    const harness = createDeps({
      gitQueue: [ok(''), ok('HEAD\n')],
    });

    const result = pushAndConfirmPromptStatus('PROMPT.md', harness.deps);

    expect(result.state).toBe('BLOCKED');
    expect(result.message).toBe(
      'Push blocked: detached HEAD; checkout a branch and set upstream before retrying.'
    );
  });

  it('returns BLOCKED when no upstream is configured', () => {
    const harness = createDeps({
      gitQueue: [ok(''), ok('feature/prompt-status-fix\n'), fail('no upstream')],
    });

    const result = pushAndConfirmPromptStatus('PROMPT.md', harness.deps);

    expect(result.state).toBe('BLOCKED');
    expect(result.message).toBe(
      'Push blocked: no upstream configured; run git push --set-upstream origin feature/prompt-status-fix.'
    );
  });

  it('returns FAIL with exact short status code when prompt file changes remain after push', () => {
    const harness = createDeps({
      gitQueue: [
        ok(''),
        ok('feature/prompt-status-fix\n'),
        ok('origin/feature/prompt-status-fix\n'),
        ok(),
        ok(' M PROMPT.md\n'),
      ],
    });

    const result = pushAndConfirmPromptStatus('PROMPT.md', harness.deps);

    expect(result.state).toBe('FAIL');
    expect(result.statusCode).toBe('M');
    expect(result.message).toBe(
      'PROMPT.md has pending local changes after push (status: M).'
    );
  });

  it('returns ERROR with OS text when root entries cannot be read', () => {
    const deps = createDeps({
      readError: new Error('EACCES: permission denied'),
    });

    const result = validatePromptStatus('PROMPT.md', deps.deps);

    expect(result.state).toBe('ERROR');
    expect(result.message).toContain('EACCES: permission denied');
  });
});
