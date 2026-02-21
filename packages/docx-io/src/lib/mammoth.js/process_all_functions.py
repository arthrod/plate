#!/usr/bin/env python3

import os
import re
from pathlib import Path
import json

OLD_DIFFS_DIR = Path("old_implementation_diffs")
LIB_DIR = Path("lib")

def search_function_in_lib(func_name):
    """Search for a function in lib/ directory and return location info"""
    patterns = [
        f"function {func_name}\\s*\\(",
        f"(export\\s+)?const\\s+{func_name}\\s*[=:]",
        f"(export\\s+)?class\\s+{func_name}\\b",
        f"(export\\s+)(async\\s+)?function\\s+{func_name}",
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
    # Get all files
    all_files = list(OLD_DIFFS_DIR.glob("*.js"))
    all_files = [f for f in all_files if not f.name.startswith("_inexistent") and not f.name.endswith("_local.js")]
    
    found_list = []
    not_found_list = []
    
    print(f"Searching {len(all_files)} functions in lib/...")
    
    for i, file_path in enumerate(sorted(all_files)):
        if (i + 1) % 50 == 0:
            print(f"  Progress: {i+1}/{len(all_files)}")
        
        func_name = file_path.stem
        filepath, line_num = search_function_in_lib(func_name)
        
        if filepath:
            rel_path = os.path.relpath(filepath)
            found_list.append((func_name, rel_path, line_num))
        else:
            not_found_list.append(func_name)
    
    print(f"\n=== SUMMARY ===")
    print(f"Found: {len(found_list)}/{len(all_files)}")
    print(f"Not found: {len(not_found_list)}/{len(all_files)}")
    
    # Save results
    with open("function_mapping.json", "w") as f:
        json.dump({
            "found": [(n, p, l) for n, p, l in found_list],
            "not_found": not_found_list
        }, f, indent=2)
    
    print(f"\nResults saved to function_mapping.json")
    print(f"\nFirst 10 found:")
    for name, path, line in found_list[:10]:
        print(f"  {name}: {path}:{line}")
    
    print(f"\nFirst 10 not found:")
    for name in not_found_list[:10]:
        print(f"  {name}")

if __name__ == "__main__":
    main()
