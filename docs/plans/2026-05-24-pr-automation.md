# PR Automation Implementation Plan

## Goal
Add missing GitHub Actions workflows to cicero-im/plate fork:
1. PR title validation (conventional commits)
2. Auto-merge for approved bot PRs (CodeRabbit)

## Context
- Existing: PULL_REQUEST_TEMPLATE.md, ci.yml, changeset workflows
- Missing: title validation, auto-merge
- Triggered by: PR #428 (CodeRabbit pagination fix) + pull-request-automation task

## Phases

### Phase 1: PR Title Validation [ ]
- File: `.github/workflows/pr-title-validation.yml`
- Use: `amannn/action-semantic-pull-request@v5`
- Types: feat, fix, docs, chore, ci, refactor, perf, test, build, revert

### Phase 2: Auto-merge for Bot PRs [ ]
- File: `.github/workflows/auto-merge.yml`
- Trigger: pull_request_review (approved) + workflow_run (CI pass)
- Target: CodeRabbit bot PRs and other trusted bots

### Phase 3: Address PR #428 [ ]
- Changes look correct (ResizeObserver guard + dep array fix)
- No action needed — changes already on claude/cool-tesla-iCvO7

## Verification
- [ ] Lint
- [ ] Commit + push to claude/cool-tesla-iCvO7
- [ ] Create/update PR

## Errors
| Error | Attempt | Resolution |
|-------|---------|------------|
| none yet | - | - |
