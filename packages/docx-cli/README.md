# @platejs/docx-cli

A command-line tool for testing DOCX import/export functionality without deploying the Plate editor. This CLI enables developers to quickly verify document conversion between DOCX, Plate JSON, and HTML formats.

## Installation

```bash
npm install -g @platejs/docx-cli
# or
yarn add -g @platejs/docx-cli
# or
bun install -g @platejs/docx-cli
```

## Usage

### Convert DOCX to Plate JSON and HTML

Convert a DOCX file to both Plate JSON and HTML formats:

```bash
docx-cli from-docx document.docx
```

This will:
- Output Plate JSON to stdout
- Save Plate JSON to `document.plate.json`
- Save HTML to `document.html`
- Display any conversion messages

Convert only to Plate JSON:

```bash
docx-cli from-docx document.docx plate
```

Convert only to HTML:

```bash
docx-cli from-docx document.docx html
```

### Convert Plate JSON or HTML to DOCX

Convert Plate JSON to DOCX:

```bash
docx-cli to-docx plate-document.json
docx-cli to-docx plate-document.json output.docx  # Specify output path
```

Convert HTML to DOCX:

```bash
docx-cli to-docx document.html
docx-cli to-docx document.html output.docx  # Specify output path
```

When converting to DOCX, the tool will:
- Create a DOCX file with the specified name (or `{input-name}.docx` by default)
- Unzip the DOCX file for inspection (creates `{input-name}-docx-unzipped` directory)
- Display file paths in stderr messages

## API Usage

You can also use the CLI functions programmatically:

```typescript
import { convertFromDocx, convertToDocx } from "@platejs/docx-cli";

// Convert DOCX to Plate JSON
await convertFromDocx("document.docx", "all");

// Convert HTML to DOCX
await convertToDocx("document.html", "output.docx");
```

## Implementation Details

### DOCX to Plate JSON Conversion

The conversion uses the `convertToHtmlWithTracking` function from `@platejs/docx-io`:

1. Reads the DOCX file as an ArrayBuffer
2. Converts DOCX to HTML using the mammoth library (with tracking token support)
3. Creates a Plate JSON structure with conversion metadata
4. Outputs both HTML and Plate JSON

**Note:** Currently, the Plate JSON is a simplified structure. For full Plate deserialization, integrate with Plate's editor API using `editor.api.html.deserialize()`.

### Plate JSON or HTML to DOCX Conversion

The conversion uses the `htmlToDocxBlob` function from `@platejs/docx-io`:

1. Reads the input file
2. If JSON, converts to HTML (currently a simple wrapper)
3. Converts HTML to DOCX using the xmlbuilder library
4. Unzips the DOCX file for inspection (showing raw XML structure)

## Output Structure

### DOCX Import Output

```
document.plate.json    # Plate JSON format
document.html          # HTML format
```

### DOCX Export Output

```
output.docx                   # DOCX file
output-docx-unzipped/         # Unzipped DOCX directory
  ├── word/
  │   ├── document.xml       # Main document content
  │   ├── styles.xml         # Styling information
  │   └── ...other files
  ├── _rels/
  ├── [Content_Types].xml
  └── ...other OOXML files
```

## Development

### Build

```bash
yarn build
```

### Test

```bash
yarn test
```

### Lint

```bash
yarn lint
yarn lint:fix
```

### Type Check

```bash
yarn typecheck
```

## Architecture

The CLI is structured as follows:

- `src/cli.ts` - Command-line argument parsing and routing
- `src/commands.ts` - Core conversion functions
- `src/index.ts` - Library exports (for programmatic use)

The build output is in `dist/` and can be used as both a CLI tool and an npm package.

## Limitations

1. **Plate JSON Generation**: Currently creates a simplified Plate structure. Full deserialization requires Plate editor integration.
2. **HTML to Plate**: Plate JSON from HTML requires the full Plate editor API for proper deserialization.
3. **Formatting**: While DOCX formatting is preserved in the intermediate HTML, some complex Plate-specific styles may not round-trip perfectly.
4. **Tracked Changes**: Currently strips tracking tokens. Use `@platejs/docx-io` advanced APIs for tracked changes support.

## Related Packages

- `@platejs/docx-io` - Core DOCX import/export library
- `@platejs/docx` - Plate DOCX plugin
- `platejs` - Core Plate editor

## License

MIT
