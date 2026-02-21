#!/usr/bin/env python3

import os
import re
import sys
from pathlib import Path

OLD_DIFFS_DIR = Path("old_implementation_diffs")
LIB_DIR = Path("lib")

def search_function_in_lib(func_name):
    """Search for a function in lib/ directory and return location info"""
    patterns = [
        f"function {func_name}\\s*\\(",
        f"export.*{func_name}",
        f"const {func_name}\\s*=",
        f"class {func_name}",
        f"^export {{.*{func_name}",
    ]
    
    for root, dirs, files in os.walk(LIB_DIR):
        for file in files:
            if file.endswith(('.ts', '.js')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = f.readlines()
                        for line_num, line in enumerate(lines, 1):
                            for pattern in patterns:
                                if re.search(pattern, line):
                                    return filepath, line_num
                except:
                    pass
    return None, None

def main():
    # Count total
    all_files = list(OLD_DIFFS_DIR.glob("*.js"))
    all_files = [f for f in all_files if not f.name.startswith("_inexistent") and not f.name.endswith("_local.js")]
    
    found = 0
    not_found = []
    
    print(f"Processing {len(all_files)} files...")
    
    for file_path in sorted(all_files)[:10]:  # Process first 10 for now
        func_name = file_path.stem
        filepath, line_num = search_function_in_lib(func_name)
        
        if filepath:
            rel_path = os.path.relpath(filepath)
            print(f"✓ {func_name}: {rel_path}:{line_num}")
            found += 1
        else:
            print(f"✗ {func_name}: NOT FOUND")
            not_found.append(func_name)
    
    print(f"\nSummary: Found {found}/{len(all_files[:10])}")
    if not_found:
        print(f"Not found: {', '.join(not_found[:5])}")

if __name__ == "__main__":
    main()
