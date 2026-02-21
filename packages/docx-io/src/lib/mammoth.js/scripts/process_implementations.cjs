#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Process old implementations:
 * - Find functions in current codebase
 * - Add location comments
 * - Create _local.js or _inexistent.js files
 * - Validate size differences
 */

const OLD_IMPL_DIR = path.join(__dirname, '../old_implementation_diffs');
const LIB_DIR = path.join(__dirname, '../lib');
const OUTPUT_DIR = path.join(__dirname, '../old_implementation_diffs_processed');
const REPORT_FILE = path.join(__dirname, '../.ralph/agent/processing_report.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function getOldFiles() {
  return fs.readdirSync(OLD_IMPL_DIR)
    .filter(f => f.endsWith('.js'))
    .sort();
}

function readOldFile(filename) {
  return fs.readFileSync(path.join(OLD_IMPL_DIR, filename), 'utf8');
}

function extractFunctionName(filename) {
  return filename.replace(/\.js$/, '').replace(/_\d+$/, '');
}

function searchFunctionInCodebase(functionName) {
  try {
    const patterns = [
      `function ${functionName}\\s*\\(`,
      `const ${functionName}\\s*=`,
      `export.*${functionName}`,
      `${functionName}\\s*:\\s*function`,
      `\\b${functionName}\\s*=\\s*(?:function|\\(|async)`,
    ];

    for (const pattern of patterns) {
      try {
        const cmd = `grep -rn "${pattern}" "${LIB_DIR}" --include="*.ts" --include="*.js" 2>/dev/null | head -1`;
        const result = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        if (result) {
          const match = result.trim();
          const parts = match.split(':');
          if (parts.length >= 2) {
            return {
              found: true,
              file: parts[0].replace(LIB_DIR, ''),
              line: parts[1],
              content: parts.slice(2).join(':').trim()
            };
          }
        }
      } catch (e) {
        // Continue
      }
    }

    return { found: false };
  } catch (error) {
    return { found: false, error: error.message };
  }
}

function processFile(filename) {
  const oldContent = readOldFile(filename);
  const funcName = extractFunctionName(filename);
  const searchResult = searchFunctionInCodebase(funcName);

  let outputContent = oldContent;
  let outputFilename;
  let locationComment = '';

  if (searchResult.found) {
    locationComment = `// Found in: ${searchResult.file}:${searchResult.line}\n`;
    outputContent = locationComment + oldContent;
    outputFilename = filename.replace(/\.js$/, '_local.js');
  } else {
    outputFilename = filename.replace(/\.js$/, '_inexistent.js');
    outputContent = ''; // Empty for inexistent
  }

  const outputPath = path.join(OUTPUT_DIR, outputFilename);
  fs.writeFileSync(outputPath, outputContent);

  return {
    oldFile: filename,
    newFile: outputFilename,
    found: searchResult.found,
    location: searchResult.found ? `${searchResult.file}:${searchResult.line}` : null,
    oldSize: Buffer.byteLength(oldContent),
    newSize: Buffer.byteLength(outputContent),
    sizeDiff: searchResult.found ?
      (((Buffer.byteLength(outputContent) - Buffer.byteLength(oldContent)) / Buffer.byteLength(oldContent)) * 100).toFixed(2) + '%' :
      'N/A'
  };
}

function main() {
  const oldFiles = getOldFiles();
  console.log(`Processing ${oldFiles.length} files...`);

  const results = [];
  let found = 0, notFound = 0;

  for (let i = 0; i < oldFiles.length; i++) {
    if (i % 100 === 0) {
      console.log(`  Progress: ${i}/${oldFiles.length}`);
    }

    try {
      const result = processFile(oldFiles[i]);
      results.push(result);
      if (result.found) {
        found++;
      } else {
        notFound++;
      }
    } catch (error) {
      console.error(`Error processing ${oldFiles[i]}: ${error.message}`);
      results.push({
        oldFile: oldFiles[i],
        error: error.message
      });
    }
  }

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: oldFiles.length,
      found,
      notFound,
      foundPercentage: ((found / oldFiles.length) * 100).toFixed(2) + '%'
    },
    outputDir: OUTPUT_DIR,
    results: results,
    largeChanges: results.filter(r => r.sizeDiff !== 'N/A' &&
      Math.abs(parseFloat(r.sizeDiff)) > 30)
  };

  // Ensure report directory exists
  const reportDir = path.dirname(REPORT_FILE);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  console.log(`\n=== Processing Complete ===`);
  console.log(`Total: ${oldFiles.length}`);
  console.log(`Found: ${found}`);
  console.log(`Not found (empty _inexistent.js): ${notFound}`);
  console.log(`Percentage found: ${report.summary.foundPercentage}`);
  console.log(`\nOutput directory: ${OUTPUT_DIR}`);
  console.log(`Report saved to: ${REPORT_FILE}`);

  if (report.largeChanges.length > 0) {
    console.log(`\nFiles with >30% size difference: ${report.largeChanges.length}`);
    report.largeChanges.slice(0, 10).forEach(r => {
      console.log(`  - ${r.oldFile}: ${r.sizeDiff}`);
    });
  }

  return report;
}

main();
