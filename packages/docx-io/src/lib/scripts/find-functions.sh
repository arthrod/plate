#!/bin/bash

# Script to find old implementation functions in current codebase
# Creates {FunctionName}_local.js files with current implementation + location

OLD_DIFFS_DIR="./old_implementation_diffs"
OUTPUT_DIR="./old_implementation_diffs"
FOUND_COUNT=0
NOT_FOUND_COUNT=0
NOT_FOUND_FILE="$OUTPUT_DIR/_inexistent.js"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Track not found functions
> "$NOT_FOUND_FILE"

echo "Starting search for functions in lib/ directory..."

# Get list of all function files
for file in $(ls -1 "$OLD_DIFFS_DIR"/*.js | grep -v "_inexistent\|_local" | xargs -I {} basename {} .js); do
  # Search in lib/ for the function
  found_location=$(grep -rn "function $file\|export.*$file\|const $file.*=\|class $file" lib/ --include="*.ts" --include="*.js" 2>/dev/null | head -1)
  
  if [ -n "$found_location" ]; then
    echo "✓ Found: $file"
    FOUND_COUNT=$((FOUND_COUNT + 1))
  else
    echo "✗ Not found: $file"
    NOT_FOUND_COUNT=$((NOT_FOUND_COUNT + 1))
    echo "$file" >> "$NOT_FOUND_FILE"
  fi
done

echo ""
echo "Summary:"
echo "  Found: $FOUND_COUNT"
echo "  Not found: $NOT_FOUND_COUNT"
echo "  Total: $((FOUND_COUNT + NOT_FOUND_COUNT))"
