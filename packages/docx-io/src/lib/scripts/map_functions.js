#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Maps old implementation functions to their locations in the current codebase
 * Outputs a JSON mapping file for reference and processing
 */

const OLD_IMPL_DIR = path.join(__dirname, '../old_implementation_diffs');
const LIB_DIR = path.join(__dirname, '../lib');
const OUTPUT_FILE = path.join(__dirname, '../.ralph/agent/function_mapping.json');

// Get all old implementation files
function getAllOldFiles() {
  return fs.readdirSync(OLD_IMPL_DIR)
    .filter(f => f.endsWith('.js'))
    .map(f => f.replace('.js', ''));
}

// Extract function name from file (e.g., _addNamedNode -> _addNamedNode or addNamedNode)
function extractFunctionName(filename) {
  // Remove common suffixes like _2, _3, etc.
  const base = filename.replace(/_\d+$/, '');
  return base;
}

// Search for a function in TypeScript/JavaScript files
function searchFunctionInCodebase(functionName) {
  try {
    // Search for function definition patterns
    const patterns = [
      `function ${functionName}\\s*\\(`,           // function name()
      `const ${functionName}\\s*=`,                // const name =
      `export (const|function|default) ${functionName}`, // exports
      `${functionName}\\s*:`,                      // object method
      `\\b${functionName}\\s*=\\s*function`,       // var name = function
    ];

    for (const pattern of patterns) {
      try {
        const cmd = `grep -r "${pattern}" "${LIB_DIR}" --include="*.ts" --include="*.js" 2>/dev/null`;
        const result = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        if (result) {
          const lines = result.split('\n').filter(l => l);
          if (lines.length > 0) {
            return {
              found: true,
              type: 'grep_match',
              matches: lines.slice(0, 3), // First 3 matches
              pattern: pattern
            };
          }
        }
      } catch (e) {
        // Continue to next pattern
      }
    }

    return { found: false, type: 'not_found' };
  } catch (error) {
    return { found: false, type: 'error', error: error.message };
  }
}

// Main mapping function
function generateMapping() {
  const oldFiles = getAllOldFiles();
  const mapping = {
    total: oldFiles.length,
    timestamp: new Date().toISOString(),
    results: {}
  };

  let found = 0;
  let notFound = 0;

  console.log(`Mapping ${oldFiles.length} functions...`);

  for (let i = 0; i < oldFiles.length; i++) {
    const file = oldFiles[i];
    const funcName = extractFunctionName(file);

    if (i % 50 === 0) {
      console.log(`  Progress: ${i}/${oldFiles.length}`);
    }

    const result = searchFunctionInCodebase(funcName);

    mapping.results[file] = {
      oldFile: `${file}.js`,
      searchedName: funcName,
      ...result
    };

    if (result.found) {
      found++;
    } else {
      notFound++;
    }
  }

  mapping.summary = {
    found,
    notFound,
    percentage: ((found / oldFiles.length) * 100).toFixed(2) + '%'
  };

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mapping, null, 2));

  console.log(`\nMapping complete:`);
  console.log(`  Found: ${found}`);
  console.log(`  Not found: ${notFound}`);
  console.log(`  Percentage: ${mapping.summary.percentage}`);
  console.log(`\nMapping saved to: ${OUTPUT_FILE}`);

  return mapping;
}

generateMapping();
