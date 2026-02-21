#!/usr/bin/env bun
import { basename } from "path";
import { help, convertFromDocx, convertToDocx } from "./commands.js";

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  if (!command || command === "--help" || command === "-h") {
    help();
    process.exit(0);
  }

  if (command === "version" || command === "-v" || command === "--version") {
    console.log("@platejs/docx-cli 52.2.0");
    process.exit(0);
  }

  if (
    command === "convert-from-docx" ||
    command === "from-docx" ||
    command === "import"
  ) {
    const inputFile = args[1];
    const outputFormat = args[2] || "all";

    if (!inputFile) {
      console.error(
        "Error: input DOCX file path is required\nUsage: docx-cli from-docx <file> [format]\n"
      );
      process.exit(1);
    }

    try {
      await convertFromDocx(inputFile, outputFormat);
    } catch (error) {
      console.error(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      process.exit(1);
    }
  } else if (
    command === "convert-to-docx" ||
    command === "to-docx" ||
    command === "export"
  ) {
    const inputFile = args[1];
    const outputPath = args[2];

    if (!inputFile) {
      console.error(
        "Error: input Plate/HTML file path is required\nUsage: docx-cli to-docx <file> [outputPath]\n"
      );
      process.exit(1);
    }

    try {
      await convertToDocx(inputFile, outputPath);
    } catch (error) {
      console.error(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      process.exit(1);
    }
  } else {
    console.error(`Unknown command: ${command}\n`);
    help();
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
