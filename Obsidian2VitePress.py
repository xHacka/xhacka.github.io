from pathlib import Path
import re
import argparse
from shutil import copy
from typing import Optional
from titlecase import titlecase
from loguru import logger

# Configure loguru
import sys
logger.remove()  # Remove default handler
logger.add(
    sys.stderr,
    format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <level>{message}</level>",
    colorize=True,
    level="INFO"
)


class ObsidianConverter:
    """Converts Obsidian markdown files to VitePress format."""
    def __init__(self, input_path: Path, output_path: Path, images_path: Path, process: bool):
        self.input_path = input_path
        self.output_path = output_path / input_path.name
        self.images_path = images_path / input_path.name
        self.process = process
        
    def normalize_filename(self, s: str) -> str:
        """Normalize filename to URL-friendly format."""
        name = str(s).lower()
        replacements = {
            '+': 'and',
            ')': '',
            ' - nope': '',
            ' ': '-',
            '(': '-',
        }
        
        for old, new in replacements.items():
            name = name.replace(old, new)
        
        # Remove multiple consecutive dashes
        while '--' in name:
            name = name.replace('--', '-')
            
        return name.strip('-')
    
    def extract_title(self, content: str, default_title: str) -> tuple[str, str]:
        """Extract H1 title from content or use default."""
        h1_match = re.match(r"^# (.+)", content, re.MULTILINE)
        
        if h1_match:
            title = h1_match.group(1).strip()
            content = re.sub(r"^# .+", f"# {title}", content, count=1, flags=re.MULTILINE)
            logger.debug(f"Extracted title from H1: {title}")
        else:
            title = default_title
            content = f"# {title}\n\n" + content
            logger.debug(f"Using default title: {title}")
            
        return title, content
    
    def handle_nmap_log(self, target: Path) -> str:
        """Process and format nmap scan log."""
        if not target.exists():
            logger.error(f"Missing log file: {target}")
            raise FileNotFoundError(f"Missing log file: {target}")
        
        scan_lines = []
        skip = True
        
        try:
            with open(target, encoding='utf-8', errors='replace') as f:
                for line in f:
                    if line.startswith(('Open', 'PORT')):
                        skip = False
                    if line.startswith(('Depending', 'NSE')):
                        skip = True
                    
                    if not skip:
                        scan_lines.append(line)
            
            logger.debug(f"Processed nmap log: {target.name}")
            return (
                f"::: details {target.name}\n"
                f"```log\n{''.join(scan_lines).strip()}\n```\n"
                f":::"
            )
        except Exception as e:
            logger.error(f"Failed to read nmap log {target}: {e}")
            raise
    
    def handle_image_embed(self, target: Path, target_name: str) -> str:
        """Process image embeds."""
        try:
            # Find relative subpath after "public"
            public_parts = [i for i, part in enumerate(self.images_path.parts) if part == 'public']
            if not public_parts:
                logger.warning(f"'public' not found in images path: {self.images_path}")
                images_subdir = self.images_path.name
            else:
                index = public_parts[0] + 1
                images_subdir = Path(*self.images_path.parts[index:]).as_posix()
            
            images_path = self.normalize_filename(f'/{images_subdir}/{target_name}')
            image_link = f"![{target_name}]({images_path})"
            logger.debug(f"Created image link: {image_link}")
            return image_link
        except Exception as e:
            logger.error(f"Failed to process image {target_name}: {e}")
            raise
    
    def handle_generic_embed(self, target: Path, target_name: str) -> str:
        """Process generic file embeds."""
        try:
            text = target.read_text(encoding='utf-8', errors='replace').strip('`').strip()
            logger.debug(f"Embedded file: {target_name}")
            return (
                f"::: details {target_name}\n"
                f"```replaceme\n{text}\n```\n"
                f":::"
            )
        except Exception as e:
            logger.error(f"Failed to read file {target}: {e}")
            raise
    
    def replace_embed(self, match: re.Match, input_file: Path) -> str:
        """Replace Obsidian embed syntax with VitePress compatible format."""
        raw = match.group(1).strip()
        parts = raw.split("|", 1)
        target = input_file.parent / Path(parts[0].strip()).name
        target_name = self.normalize_filename(target.name)
        
        # Handle images
        if target.suffix.lower() in ('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'):
            return self.handle_image_embed(target, target_name)
        
        # Handle markdown files
        target = target.with_name(target.name + '.md')
        
        # Handle nmap logs
        if target_name == "nmap_scan.log":
            return self.handle_nmap_log(target)
        
        # Handle generic embeds
        return self.handle_generic_embed(target, target_name)
    
    def convert_content(self, input_file: Path, output_file: Path) -> None:
        """Convert Obsidian markdown to VitePress format."""
        try:
            content = input_file.read_text(encoding="utf-8")
            default_title = titlecase(input_file.parent.stem)
            
            # Extract and normalize title
            title, content = self.extract_title(content, default_title)
            
            # Replace embeds
            content = re.sub(
                r"!\[\[(.*?)\]\]",
                lambda m: self.replace_embed(m, input_file),
                content
            )
            
            if self.process:
                output_file.write_text(content, encoding="utf-8")
                logger.success(f"Converted: {input_file.name} → {output_file}")
            else:
                logger.info(f"Would convert: {input_file.name} → {output_file}")
                
        except Exception as e:
            logger.error(f"Failed to convert {input_file}: {e}")
            raise
    
    def copy_images(self) -> None:
        """Copy images from source to destination."""
        images_src = self.input_path / 'images'
        
        if not images_src.exists():
            logger.warning(f"Images directory not found: {images_src}")
            return
        
        image_files = list(images_src.glob('*'))
        if not image_files:
            logger.info("No images to copy")
            return
        
        logger.info(f"Processing {len(image_files)} image(s)")
        
        for image in image_files:
            if image.is_file():
                image_name = Path(self.normalize_filename(str(self.images_path / image.name)))
                
                if self.process:
                    image_name.parent.mkdir(exist_ok=True, parents=True)
                    copy(image, image_name)
                    logger.success(f"Copied: {image.name} → {image_name}")
                else:
                    logger.info(f"Would copy: {image.name} → {image_name}")
    
    def run(self) -> None:
        """Execute the conversion process."""
        logger.info(f"Starting conversion for: {self.input_path.name}")
        
        # Create output directories
        if self.process:
            self.output_path.mkdir(exist_ok=True, parents=True)
            self.images_path.mkdir(exist_ok=True, parents=True)
            logger.debug(f"Created output directories")
        
        # Convert main writeup file
        writeup = self.input_path / 'Writeup.md'
        if not writeup.exists():
            logger.error(f"Writeup file not found: {writeup}")
            return
        
        output_file = Path(self.normalize_filename(str(self.output_path))).with_suffix('.md')
        
        if self.process:
            output_file.parent.mkdir(exist_ok=True, parents=True)
        
        # Convert content
        self.convert_content(writeup, output_file)
        
        # Copy images
        self.copy_images()
        
        logger.success("✓ Conversion completed!")


def main():
    parser = argparse.ArgumentParser(description="Convert Obsidian MD notes to VitePress-compatible Markdown.")
    parser.add_argument("input_path", type=Path, help="Obsidian markdown path")
    parser.add_argument("output_path", type=Path, help="VitePress markdown path")
    parser.add_argument("images_path", type=Path, help="Directory for images (should be in public/)")
    parser.add_argument("-p", "--process", action='store_true', help="Process the files (default: dry-run)")
    parser.add_argument("-v", "--verbose", action='store_true', help="Enable verbose logging")
    
    args = parser.parse_args()
    
    # Set log level
    if args.verbose:
        logger.remove()
        logger.add(
            sys.stderr,
            format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{function}</cyan> | <level>{message}</level>",
            colorize=True,
            level="DEBUG"
        )
    
    if not args.process:
        logger.warning("DRY-RUN MODE: No files will be modified. Use -p to process files.")
    
    # Run conversion
    converter = ObsidianConverter(args.input_path, args.output_path, args.images_path, args.process)
    converter.run()


if __name__ == "__main__":
    main()