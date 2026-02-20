import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, basename, extname, join, dirname } from "path";
import { convertToHtmlWithTracking, htmlToDocxBlob } from "@platejs/docx-io";
import JSZip from "jszip";

const VERSION = "52.2.0";

export function help() {
  console.log(`
docx-cli - DOCX Import/Export Testing Tool
Version: ${VERSION}

Convert DOCX documents to/from Plate JSON and HTML formats without deploying the editor.

USAGE:
  docx-cli <command> [options]

COMMANDS:
  from-docx <file> [format]    Convert DOCX to Plate JSON and/or HTML
                               format: 'all' (default), 'plate', 'html'

  to-docx <file> [output]      Convert Plate JSON or HTML to DOCX
                               input can be .json (Plate) or .html
                               output: optional path for DOCX file

  help                         Show this help message
  version                      Show version

EXAMPLES:
  # Convert DOCX to Plate JSON (outputs to stdout and file)
  docx-cli from-docx document.docx plate

  # Convert DOCX to both HTML and Plate JSON
  docx-cli from-docx document.docx all

  # Convert Plate JSON to DOCX
  docx-cli to-docx plate-document.json output.docx

  # Convert HTML to DOCX
  docx-cli to-docx document.html output.docx

OUTPUT:
  When converting from DOCX:
  - Plate JSON is printed to stdout
  - Both Plate JSON and HTML are saved as .plate.json and .html files

  When converting to DOCX:
  - DOCX file is created and unzipped for inspection
  - Raw XML files are available in the output directory
`);
}

export async function convertFromDocx(
  inputPath: string,
  format: string = "all"
): Promise<void> {
  const absolutePath = resolve(inputPath);

  if (!existsSync(absolutePath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  if (!absolutePath.toLowerCase().endsWith(".docx")) {
    throw new Error("Input file must be a .docx file");
  }

  console.error(`Converting: ${inputPath}...`);

  // Read DOCX file
  const docxBuffer = readFileSync(absolutePath);
  const arrayBuffer = docxBuffer.buffer.slice(
    docxBuffer.byteOffset,
    docxBuffer.byteOffset + docxBuffer.byteLength
  );

  // Convert DOCX to HTML using mammoth
  const conversionResult = await convertToHtmlWithTracking(arrayBuffer);

  const html = conversionResult.value;

  // For now, create a simple Plate JSON structure from the HTML
  // In production, this would deserialize the HTML using Plate's editor API
  const plateDocument = {
    type: "doc",
    children: [
      {
        type: "paragraph",
        children: [
          {
            text: `Converted from: ${basename(absolutePath)}`,
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "",
          },
        ],
      },
    ],
    metadata: {
      sourceFile: basename(absolutePath),
      conversionTimestamp: new Date().toISOString(),
      htmlPreview: html.substring(0, 200),
    },
  };

  const plateJson = JSON.stringify(plateDocument, null, 2);

  // Save to files
  const baseName = basename(absolutePath, ".docx");

  if (format === "all" || format === "plate") {
    const plateOutputPath = `${baseName}.plate.json`;
    writeFileSync(plateOutputPath, plateJson);
    console.log(plateJson); // Also output to stdout
    console.error(`Plate JSON saved to: ${plateOutputPath}`);
  }

  if (format === "all" || format === "html") {
    const htmlOutputPath = `${baseName}.html`;
    writeFileSync(htmlOutputPath, html);
    if (format === "html") {
      console.log(html); // Output HTML to stdout if requested
    }
    console.error(`HTML saved to: ${htmlOutputPath}`);
  }

  // Show conversion messages
  if (conversionResult.messages.length > 0) {
    console.error("\nConversion messages:");
    conversionResult.messages.forEach((msg: any) => {
      console.error(
        `  ${msg.type}: ${msg.message}${msg.line ? ` (line ${msg.line})` : ""}`
      );
    });
  }
}

export async function convertToDocx(
  inputPath: string,
  outputPath?: string
): Promise<void> {
  const absolutePath = resolve(inputPath);

  if (!existsSync(absolutePath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  const ext = extname(absolutePath).toLowerCase();

  if (ext !== ".json" && ext !== ".html") {
    throw new Error("Input file must be .json (Plate) or .html");
  }

  console.error(`Converting: ${inputPath} to DOCX...`);

  // Read input file
  const content = readFileSync(absolutePath, "utf-8");

  let html: string;

  // Convert to HTML if needed
  if (ext === ".json") {
    try {
      const parsed = JSON.parse(content);
      // For now, just create a simple HTML representation
      // In production, this would use Plate's serializer
      html = `<h1>Document</h1><pre>${JSON.stringify(parsed, null, 2)}</pre>`;
    } catch (error) {
      throw new Error("Invalid JSON in input file");
    }
  } else {
    html = content;
  }

  // Determine output path
  const baseName = basename(absolutePath, ext);
  const docxPath = outputPath || `${baseName}.docx`;
  const absoluteDocxPath = resolve(docxPath);

  // Convert HTML to DOCX blob
  const docxBlob = await htmlToDocxBlob(html);

  // Write DOCX file
  const arrayBuffer = await docxBlob.arrayBuffer();
  writeFileSync(absoluteDocxPath, Buffer.from(arrayBuffer));
  console.error(`DOCX saved to: ${absoluteDocxPath}`);

  // Unzip DOCX for inspection
  const unzipDir = `${baseName}-docx-unzipped`;
  const absoluteUnzipDir = resolve(unzipDir);

  try {
    mkdirSync(absoluteUnzipDir, { recursive: true });

    // Load and extract DOCX
    const zip = await JSZip.loadAsync(arrayBuffer);

    for (const [filePath, zipFile] of Object.entries(zip.files)) {
      if (!zipFile.dir) {
        const content = await zipFile.async("arraybuffer");
        const targetPath = join(absoluteUnzipDir, filePath);

        // Create directories as needed
        const targetDir = dirname(targetPath);
        mkdirSync(targetDir, { recursive: true });

        // Write file
        writeFileSync(targetPath, Buffer.from(content));
      }
    }

    console.error(
      `DOCX unzipped to: ${absoluteUnzipDir} for inspection`
    );
  } catch (error: any) {
    console.error(
      `Warning: Could not unzip DOCX for inspection: ${error.message}`
    );
  }
}
