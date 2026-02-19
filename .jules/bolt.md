## 2024-05-22 - Workspace Dependency Building for Bun Tests
**Learning:** Running `bun test` in a workspace package (like `packages/core`) fails if its workspace dependencies (e.g., `@platejs/slate`, `@udecode/react-utils`) are not pre-built, even if they are linked. Bun (or the environment) doesn't automatically build source dependencies on the fly for these imports.
**Action:** When running tests in a workspace, ensure all upstream workspace dependencies are built first using `yarn build` in their respective directories.

## 2024-05-22 - Plate Workspace Postinstall Issue
**Learning:** The root `postinstall` script `bunx skiller@latest ...` fails in this environment with `exit code 127` (command not found), likely due to `bunx` availability or path issues.
**Action:** Use `yarn install --mode=skip-build` to bypass the failing postinstall script when just needing to install dependencies for development/testing, or verify `bun` availability before running such scripts.
