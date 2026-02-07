# DOCX-IO CLI Tools

Command-line utilities for HTML ↔ Plate conversion and round-trip validation using the same logic as the editor UI.

## Installation

From the monorepo root:

```bash
npm install
npm run build
```

## Commands

### html-to-plate

Convert HTML files to Plate JSON format.

```bash
# Using npm script
npm run cli:html-to-plate -- -i input.html -o output.json --pretty

# Using tsx directly
tsx packages/docx-io/cli/html-to-plate.ts -i input.html -o output.json
```

**Options:**
- `-i, --input <file>` - Input HTML file (required)
- `-o, --output <file>` - Output JSON file (prints to stdout if omitted)
- `-p, --pretty` - Pretty-print JSON output
- `--preserve-whitespace` - Don't collapse whitespace
- `-h, --help` - Show help

### plate-to-html

Convert Plate JSON files to HTML format.

```bash
# Using npm script
npm run cli:plate-to-html -- -i input.json -o output.html

# Using tsx directly
tsx packages/docx-io/cli/plate-to-html.ts -i input.json -o output.html
```

**Options:**
- `-i, --input <file>` - Input Plate JSON file (required)
- `-o, --output <file>` - Output HTML file (prints to stdout if omitted)
- `--strip-classes` - Remove all CSS class names
- `--strip-data` - Remove all data-* attributes
- `--preserve-class <name>` - Keep specific class name (can use multiple times)
- `-h, --help` - Show help

### validate-roundtrip

Validate HTML → Plate → HTML round-trip fidelity and generate reports.

```bash
# Using npm script
npm run cli:validate -- -i sample.html -o report.json --verbose

# Using tsx directly
tsx packages/docx-io/cli/validate-roundtrip.ts -i sample.html -o report.json -v
```

**Options:**
- `-i, --input <file>` - Input HTML file (required)
- `-o, --output <file>` - Output JSON report file
- `-v, --verbose` - Show detailed validation output
- `--fail-on-diff` - Exit with code 1 if differences found (useful for CI)
- `-h, --help` - Show help

## Validation Report

The validator checks:

✅ **HTML Structural Fidelity**: Original vs. regenerated HTML match
✅ **Field Preservation**: Reply IDs, paraId, parentParaId present
✅ **Round-trip Stability**: Content survives HTML → Plate → HTML cycle

Example report structure:

```json
{
  "success": true,
  "originalHtml": "...",
  "plateJson": [...],
  "regeneratedHtml": "...",
  "errors": []
}
```

## CI Integration

Use in continuous integration to catch fidelity regressions:

```bash
# Validate sample files and fail build if issues found
npm run cli:validate -- -i test-data/sample.html --fail-on-diff
```

## Known Issues

⚠️ **paraId/parentParaId Fidelity** (TODO): Threading IDs are currently lost during import/export. See TODO comments in:
- `packages/docx-io/src/lib/importComments.ts` (line 763)
- `apps/www/src/registry/ui/discussion-kit.tsx` (line 9-19)
- `packages/docx-io/src/lib/exportTrackChanges.ts` (lines 46-62)
- `packages/docx-io/src/lib/html-to-docx/tracking.ts` (line 40)
- `packages/docx-io/src/lib/html-to-docx/docx-document.ts` (line 1131)

✅ **Reply ID Fidelity**: Fixed in PR `#45`

## Development

The CLI tools use the exact same editor configuration and serialization logic as the UI, ensuring consistency between manual edits and programmatic conversions.

### Architecture

- `shared/editor-config.ts` - Production editor setup
- `html-to-plate.ts` - Uses `editor.api.html.deserialize()`
- `plate-to-html.ts` - Uses `serializeHtml()`
- `validate-roundtrip.ts` - Combines both + structural validation

### Adding New Validations

Edit `validate-roundtrip.ts` and add checks in the `validateFields()` function:

```typescript
// Example: Check for custom field
if (node.type === 'custom' && !node.requiredField) {
  result.errors.push(`Missing requiredField at ${nodePath}`);
  result.success = false;
}
```
