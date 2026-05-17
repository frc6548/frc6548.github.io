#!/usr/bin/env python3
"""
Script to convert all image files (png, jpg, jpeg, gif, bmp) in the project to WebP format.
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
                webp_path = os.path.join(dirpath, name + '.webp')
                try:
                    with Image.open(filepath) as img:
                        img.save(webp_path, 'WEBP', quality=85)  # Adjust quality as needed
                    print(f"Converted {filepath} to {webp_path}")
                except Exception as e:
                    print(f"Failed to convert {filepath}: {e}")

def main():
    root_dir = "C:\\Users\\Robotics\\frc6548.github.io"
    print(f"Root directory: {root_dir}")
    convert_images_to_webp(root_dir)
    print("Conversion complete.")

if __name__ == "__main__":
    main()