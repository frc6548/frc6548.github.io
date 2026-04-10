#!/usr/bin/env python3
"""
Script to convert all image files (png, jpg, jpeg, gif, bmp) in the project to WebP format,
then update all references in HTML, JS, CSS, and JSON files to use .webp extensions.
"""

import os
import re
from PIL import Image

# Extensions to convert
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.tif'}

# File types to update references in
TEXT_EXTENSIONS = {'.html', '.htm', '.js', '.css', '.json'}

def convert_images_to_webp(root_dir):
    """Convert all image files to WebP format."""
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            name, ext = os.path.splitext(filename)
            if ext.lower() in IMAGE_EXTENSIONS:
                filepath = os.path.join(dirpath, filename)
                webp_path = os.path.join(dirpath, name + '.webp')
                try:
                    with Image.open(filepath) as img:
                        img.save(webp_path, 'WEBP', quality=85)  # Adjust quality as needed
                    print(f"Converted {filepath} to {webp_path}")
                except Exception as e:
                    print(f"Failed to convert {filepath}: {e}")

def update_references(root_dir):
    """Update file extensions in text files."""
    # Regex patterns for different contexts
    patterns = [
        (r'(\.png|\.jpg|\.jpeg|\.gif|\.bmp|\.tiff|\.tif)(\b)', r'.webp\2'),  # General extensions
    ]

    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            name, ext = os.path.splitext(filename)
            if ext.lower() in TEXT_EXTENSIONS:
                filepath = os.path.join(dirpath, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    original_content = content
                    for pattern, replacement in patterns:
                        content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
                    if content != original_content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Updated references in {filepath}")
                except Exception as e:
                    print(f"Failed to update {filepath}: {e}")

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # Assuming script is in data/sponsors/
    print(f"Root directory: {root_dir}")
    convert_images_to_webp(root_dir)
    update_references(root_dir)
    print("Conversion and update complete.")

if __name__ == "__main__":
    main()