#!/usr/bin/env python3

import os
from pathlib import Path

OLD_DIFFS_DIR = Path("old_implementation_diffs")

def get_file_size(filepath):
    """Get file size in bytes"""
    if filepath.exists():
        return filepath.stat().st_size
    return 0

def size_diff_percent(old_size, new_size):
    """Calculate size difference percentage"""
    if old_size == 0:
        return 100 if new_size > 0 else 0
    return abs(new_size - old_size) / old_size * 100

def main():
    print("Verifying file sizes and differences...")
    
    large_diffs = []
    total_checked = 0
    
    # Check each pair of old and local files
    for old_file in sorted((OLD_DIFFS_DIR).glob("*.js")):
        if "_local" in old_file.name or old_file.name == "_inexistent.js":
            continue
        
        func_name = old_file.stem
        local_file = OLD_DIFFS_DIR / f"{func_name}_local.js"
        
        if local_file.exists():
            old_size = get_file_size(old_file)
            new_size = get_file_size(local_file)
            diff_pct = size_diff_percent(old_size, new_size)
            
            total_checked += 1
            
            if diff_pct > 30:
                large_diffs.append((func_name, old_size, new_size, diff_pct))
                if len(large_diffs) <= 20:
                    print(f"⚠ {func_name}: {old_size}b → {new_size}b ({diff_pct:.1f}%)")
    
    print(f"\n=== SIZE VERIFICATION COMPLETE ===")
    print(f"Total checked: {total_checked}")
    print(f"Large differences (>30%): {len(large_diffs)}")
    
    if large_diffs:
        print("\nFiles needing re-examination:")
        for func_name, old_size, new_size, diff_pct in large_diffs[:10]:
            print(f"  {func_name}: {old_size}b → {new_size}b ({diff_pct:.1f}%)")

if __name__ == "__main__":
    main()
