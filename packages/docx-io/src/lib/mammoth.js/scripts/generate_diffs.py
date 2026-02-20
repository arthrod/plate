import os
import subprocess
import shutil

SOURCE_ROOT = "mammoth_before_refactoring"
TARGET_ROOT = "."
OUTPUT_DIR = "old_implementation_diffs"

def sanitize_path(path):
    # Replace separators and dots with dashes to create a flat filename
    return path.replace("/", "-").replace("\\", "-").replace(".", "-")

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    else:
        # Clean up existing files in the output directory
        for filename in os.listdir(OUTPUT_DIR):
            file_path = os.path.join(OUTPUT_DIR, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print(f"Failed to delete {file_path}. Reason: {e}")

    for root, dirs, files in os.walk(SOURCE_ROOT):
        # Filter out unwanted directories
        if "node_modules" in dirs:
            dirs.remove("node_modules")
        if ".git" in dirs:
            dirs.remove(".git")
        if "dist" in dirs:
            dirs.remove("dist")

        for file in files:
            # Skip irrelevant files
            if file in [".DS_Store", "package.json", "package-lock.json", "LICENSE", "README.md", "tsconfig.json"]:
                continue
            
            source_path = os.path.join(root, file)
            
            # Skip generated barrelsby files if they are not the target
            if file.endswith(".ts"):
                try:
                    with open(source_path, 'r', errors='ignore') as f:
                        if "barrelsby" in f.read(100): 
                            continue
                except:
                    pass

            rel_path = os.path.relpath(source_path, SOURCE_ROOT)
            
            # Determine target path
            base, ext = os.path.splitext(rel_path)
            
            # Prioritize matching .ts file in current directory structure
            target_candidates = [
                os.path.join(TARGET_ROOT, base + ".ts"), # Try .ts first
                os.path.join(TARGET_ROOT, base + ".tsx"),
                os.path.join(TARGET_ROOT, rel_path)      # Try exact name last (e.g. for .js if present)
            ]
            
            target_path = None
            for candidate in target_candidates:
                if os.path.exists(candidate):
                    target_path = candidate
                    break
            
            if target_path:
                print(f"Diffing {source_path} -> {target_path}")
                
                # Construct output filename
                source_name = sanitize_path(source_path)
                target_rel = os.path.relpath(target_path, TARGET_ROOT)
                if target_rel == ".":
                     target_name = "root"
                else:
                    target_name = sanitize_path(target_rel)

                output_filename = f"{source_name}-v--{target_name}"
                output_path = os.path.join(OUTPUT_DIR, output_filename)
                
                try:
                    # Run diff -u
                    result = subprocess.run(["diff", "-u", source_path, target_path], capture_output=True, text=True)
                    
                    if result.returncode <= 1:
                         with open(output_path, "w") as f:
                            f.write(result.stdout)
                    else:
                        print(f"Error diffing {source_path}: {result.stderr}")
                        
                except Exception as e:
                    print(f"Exception diffing {source_path}: {e}")
            else:
                print(f"Missing target for {source_path}")

if __name__ == "__main__":
    main()
