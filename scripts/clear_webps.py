#!/usr/bin/env python3
"""
Script to delete all non webp files
"""

import os
import re
from PIL import Image

# Extensions to convert
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.tif'}

def convert_images_to_webp(root_dir):
    """Convert all image files to WebP format."""
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            name, ext = os.path.splitext(filename)
            if ext.lower() in IMAGE_EXTENSIONS:
                filepath = os.path.join(dirpath, filename)
                try:
                    os.remove(filepath)
                except Exception as e:
                    print(f"Failed to delete {filepath}: {e}")

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # Assuming script is in data/sponsors/
    print(f"Root directory: {root_dir}")
    convert_images_to_webp(root_dir)
    print("Deletion complete.")

if __name__ == "__main__":
    main()