import os
from PIL import Image

try:
    import pillow_avif
except ImportError:
    pass

INPUT_FOLDER = "data/sponsors"
OUTPUT_FOLDER = "data/sponsors"

TARGET_WIDTH = 400

SUPPORTED_EXTENSIONS = (".png", ".jpg", ".jpeg", ".webp", ".avif", ".bmp", ".tiff")

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def resize_image(input_path, output_path):
    try:
        with Image.open(input_path) as img:
            width, height = img.size

            if width <= TARGET_WIDTH:
                new_width = width
                new_height = height
            else:
                aspect_ratio = height / width
                new_width = TARGET_WIDTH
                new_height = int(TARGET_WIDTH * aspect_ratio)

            resized_img = img.resize((new_width, new_height), Image.LANCZOS)

            resized_img.save(output_path)
            print(f"Resized: {input_path} -> {output_path}")

    except Exception as e:
        print(f"Error processing {input_path}: {e}")

def process_folder():
    for filename in os.listdir(INPUT_FOLDER):
        if filename.lower().endswith(SUPPORTED_EXTENSIONS):
            input_path = os.path.join(INPUT_FOLDER, filename)
            output_path = os.path.join(OUTPUT_FOLDER, filename)

            resize_image(input_path, output_path)

if __name__ == "__main__":
    process_folder()