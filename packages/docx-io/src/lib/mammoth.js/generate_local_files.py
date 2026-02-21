#!/usr/bin/env python3

import os
import json
import re
from pathlib import Path

def extract_function_code(filepath, line_num):
    """Extract function code from source file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except:
        return None
    
    # Start from the line with the function
    if line_num > len(lines):
        return None
    
    start_idx = line_num - 1
    code_lines = []
    brace_count = 0
    in_code = False
    
    # Get lines until function is complete
    for i in range(start_idx, min(start_idx + 100, len(lines))):
        line = lines[i]
        code_lines.append(line.rstrip())
        
        # Count braces to find end of function
        brace_count += line.count('{') - line.count('}')
        
        if '{' in line:
            in_code = True
        
        if in_code and brace_count == 0 and i > start_idx:
            break
    
    return '\n'.join(code_lines)

def main():
    # Load mapping
    with open("function_mapping.json") as f:
        mapping = json.load(f)
    
    found_count = 0
    not_found_count = 0
    
    print("Generating _local.js files...")
    
    # Process found functions
    for func_name, filepath, line_num in mapping["found"]:
        code = extract_function_code(filepath, line_num)
        if code:
            # Create _local.js file
            local_filename = f"old_implementation_diffs/{func_name}_local.js"
            with open(local_filename, "w") as f:
                f.write(f"// {filepath}:{line_num}\n")
                f.write(code)
                f.write("\n")
            found_count += 1
            if found_count % 50 == 0:
                print(f"  Generated: {found_count}")
    
    # Create _inexistent.js for not found
    not_found_count = len(mapping["not_found"])
    inexistent_file = "old_implementation_diffs/_inexistent.js"
    with open(inexistent_file, "w") as f:
        f.write("// Functions not found in current codebase:\n")
        for func_name in mapping["not_found"]:
            f.write(f"// - {func_name}\n")
    
    print(f"\n=== GENERATION COMPLETE ===")
    print(f"Generated _local.js files: {found_count}")
    print(f"Marked as _inexistent.js: {not_found_count}")
    print(f"Total: {found_count + not_found_count}")

if __name__ == "__main__":
    main()
