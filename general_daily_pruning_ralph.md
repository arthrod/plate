## Daily AI PR Pruning — Ralph Execution Wrapper

This file is the Ralph-loop variant of `general_daily_pruning.md`.

`general_daily_pruning.md` is the policy source of truth for:

- classification
- merge criteria
- validation scope
- design archival rules
- escalation behavior

This wrapper adds orchestration only: fresh context, one-PR-per-invocation, state tracking, mandatory execution, and mandatory handoff.

## Plate fork safety rule

IF THE CURRENT REPOSITORY IS `plate`, DO NOT PUSH TO THE ORIGINAL PLATE REPOSITORY.
ONLY PUSH TO THE INTENDED FORK, SUCH AS `arthrod/plate`.
IF THERE IS ANY UNCERTAINTY ABOUT THE REMOTE, STOP AND VERIFY BEFORE PUSHING.

## Operating mode

- Each invocation starts with fresh context.
- Process **exactly one PR per invocation**.
- Read `general_daily_pruning.md` before acting.
- Read and update `PRUNING_STATE.md`.
- **Actually execute** the `gh`, `git`, validation, and Playwright commands you need.
- Show actual terminal output for important commands.
- After one PR, you **must** call `finish_iteration(...)`.

## Step 0 — Load policy and state

1. Read `./general_daily_pruning.md`.
2. Read `PRUNING_STATE.md` if it exists.
3. If `PRUNING_STATE.md` does not exist, create it with this shape:

```markdown
# Pruning Session — {UTC_DATE}
## Status: IN_PROGRESS

| PR | Title | Action |
|---|---|---|
```

## Step 1 — Choose the next PR

If `PROMPT.md` contains an explicit PR list in the TEMPORARY PRUNING OVERRIDE section,
use that list as the canonical queue. **Do not re-discover PRs by time window.**
Skip any PR already listed in `PRUNING_STATE.md`.

If no explicit list is present, fall back to:

Run `gh pr list --state open --json number,title,author,createdAt,updatedAt,url,additions,deletions,changedFiles,labels --limit 100`.

Filter exactly as required by `general_daily_pruning.md`:

- AI-authored or AI-generated
- created or updated within the last 48 hours
- not already listed in `PRUNING_STATE.md`

If no qualifying unprocessed PRs remain:

- mark `PRUNING_STATE.md` as `Status: DONE`
- call `finish_iteration(status="PRUNING_COMPLETE", summary="Queue empty — all AI PRs processed")`
- stop

Otherwise, process exactly one PR:

- prefer the **oldest** by `createdAt` (ascending — process oldest PRs first)
- print `▶ Processing PR #N: <title>`

## Step 2 — Gather evidence

Run `gh pr view <N> --json number,title,body,author,url,reviewDecision,comments,reviews,files,additions,deletions,changedFiles,headRefName,baseRefName`.

Then inspect what `general_daily_pruning.md` requires:

- PR metadata and body
- diff / changed files
- review comments and review decision
- CI / status checks if available
- base and head branches

If inline thread resolution data is needed and missing, use `gh api` to fetch it.

Write a short reasoning paragraph and classify the PR using `general_daily_pruning.md`.

## Step 3 — Execute the action

### If category = `merge_now`

- Make only tiny/mechanical reviewer-requested fixes if needed.
- Run the **smallest feasible validation** required by policy.
- Leave a comment summarizing what you checked and changed.
- Approve if appropriate.
- Merge the PR **remotely** using `gh pr merge <N> --merge --delete-branch`.
  Do **not** pull the branch locally to merge. Use the GitHub CLI to merge on the remote.

### If category = `design_exploration`

- Ensure `devdesign` exists locally and remotely.
- **Extract only design-related files** from the PR branch (HTML prototypes, CSS, images, design notes). Do NOT copy lockfile changes, dependency additions, or unrelated source code.
- Archive to `design_explorations/subject_matter/PR{N}` on `devdesign`.
- If the PR changes visible UI and screenshots are missing, use Playwright when the app can reasonably be rendered.
- Add a `README.md` with PR title, URL, author, date, what the exploration covers.
- **Commit and push** the archive to `devdesign`:
  ```bash
  git checkout devdesign
  git add design_explorations/subject_matter/PR{N}
  git commit -m "design: archive PR #{N} — {title}"
  git push origin devdesign
  ```
  You **must** push so the archive is on the remote. Do not leave changes only local.
- Comment on the PR with the archive location.
- **Close the PR** with `gh pr close <N> --delete-branch`. Do NOT merge design exploration PRs.

### If category = `escalate`

- Leave a thorough assessment comment.
- Do **not** approve.
- Do **not** merge.

## Step 4 — Update state

Append one row to `PRUNING_STATE.md`:

```markdown
| #<N> | <title> | <MERGED / ARCHIVED_AND_CLOSED / ESCALATED> |
```

## Step 5 — Mandatory handoff

After updating state:

- if more qualifying PRs remain, call:
  - `finish_iteration(status="PRUNING_CONTINUE", summary="Processed PR #N: <title>")`
- if the queue is empty, call:
  - `finish_iteration(status="PRUNING_COMPLETE", summary="Queue empty — all AI PRs processed")`

Do **not** print those statuses as plain text instead of calling the tool.

## Hard rules

- **Execute or fail**. Describing commands without running them is failure.
- One PR per invocation.
- Do not ask for impossible validation.
- Use the smallest feasible validation that gives a real signal.
- Normal PR merges go to the PR’s actual base branch.
- Design archives go to `devdesign`.
- IF THE CURRENT REPOSITORY IS `plate`, DO NOT PUSH TO THE ORIGINAL PLATE REPOSITORY. ONLY PUSH TO THE INTENDED FORK.
- If a command fails, show the output and decide whether to retry, escalate, or stop.
- If you are uncertain, escalate rather than guessing.