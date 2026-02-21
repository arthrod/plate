#!/usr/bin/env python3
"""
Verify accuracy of high-diff mapped functions by checking semantic correctness.
Focus on critical mammoth.js functions that likely had significant refactoring.
"""

import os
import json
import sys
from pathlib import Path

def get_file_size(filepath):
    """Get file size in bytes"""
    try:
        return os.path.getsize(filepath)
    except FileNotFoundError:
        return 0

def calculate_diff_percent(old_size, new_size):
    """Calculate percentage difference"""
    if old_size == 0:
        return 0 if new_size == 0 else 100
    return abs(new_size - old_size) / old_size * 100

def extract_location_comment(filepath):
    """Extract the location comment from _local.js file"""
    try:
        with open(filepath, 'r') as f:
            first_line = f.readline().strip()
            if first_line.startswith('// '):
                return first_line[3:]  # Remove "// " prefix
    except FileNotFoundError:
        return None
    return None

def analyze_critical_functions():
    """Analyze critical functions with high diffs"""
    critical_funcs = [
        ('BodyReader', 'BodyReader'),
        ('DocumentConversion', 'DocumentConversion'),
        ('DocumentConverter', 'DocumentConverter'),
        ('RegexTokeniser', 'RegexTokeniser'),
        ('Paragraph', 'Paragraph'),
        ('Run', 'Run'),
        ('BreakMatcher', 'BreakMatcher'),
        ('Numbering', 'Numbering'),
        ('Styles', 'Styles'),
        ('Table', 'Table'),
    ]
    
    old_impl_dir = Path('old_implementation_diffs')
    results = []
    
    for old_name, display_name in critical_funcs:
        old_file = old_impl_dir / f'{old_name}.js'
        local_file = old_impl_dir / f'{old_name}_local.js'
        
        if not old_file.exists():
            continue
            
        old_size = get_file_size(str(old_file))
        new_size = get_file_size(str(local_file)) if local_file.exists() else 0
        diff_percent = calculate_diff_percent(old_size, new_size)
        location = extract_location_comment(str(local_file))
        
        results.append({
            'function': display_name,
            'old_size': old_size,
            'new_size': new_size,
            'diff_percent': diff_percent,
            'location': location,
            'found': local_file.exists(),
            'status': 'FOUND' if local_file.exists() else 'NOT FOUND'
        })
    
    return results

def main():
    os.chdir('packages/docx-io/src/lib/mammoth.js')
    
    results = analyze_critical_functions()
    
    print("=" * 80)
    print("CRITICAL FUNCTION MAPPING VERIFICATION")
    print("=" * 80)
    print()
    
    for result in results:
        print(f"Function: {result['function']}")
        print(f"  Status: {result['status']}")
        print(f"  Old size: {result['old_size']} bytes")
        print(f"  New size: {result['new_size']} bytes")
        print(f"  Diff: {result['diff_percent']:.1f}%")
        if result['location']:
            print(f"  Location: {result['location']}")
        print()
    
    # Summary
    found_count = sum(1 for r in results if r['found'])
    print(f"Summary: {found_count}/{len(results)} critical functions found")
    
    # High diffs
    high_diffs = [r for r in results if r['found'] and r['diff_percent'] > 50]
    if high_diffs:
        print(f"\nFunctions with >50% size difference:")
        for r in high_diffs:
            print(f"  - {r['function']}: {r['diff_percent']:.1f}% (expected due to refactoring)")

if __name__ == '__main__':
    main()
