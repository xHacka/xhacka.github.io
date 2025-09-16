from pathlib import Path
import re
import argparse
from shutil import copy 

def obsidian_to_vitepress(input_file: Path, output_file: Path, images_dir: Path):
    content = input_file.read_text(encoding="utf-8")
    title = input_file.parent.stem.capitalize()  # default title is directory name. e.g.: Alert/Writeup.md -> Alert

    # 2. Extract first H1 or fallback to filename
    h1_match = re.match(r"^# (.+)", content)
    if h1_match:
        title = h1_match.group(1).strip()
        # Replace first H1 with normalized title (in case formatting differs)
        content = re.sub(r"^# .+", f"# {title}", content, count=1, flags=re.M)
    else:
        content = f"# {title}\n\n" + content

    # 3. Handle Obsidian embeds
    def replace_embed(match):
        raw = match.group(1).strip()
        parts = raw.split("|", 1)
        rel_path = Path(parts[0].strip())

        # --- Inline log files ---
        if rel_path.name == "nmap_scan.log":
            log_path = input_file.parent / f'{rel_path}.md'
            if log_path.exists():
                scan = ''
                skip = True
                with open(log_path, encoding='utf-8', errors='replace') as f:
                    for line in f:
                        if line.startswith(('Open', 'PORT')):
                            skip = False
                        if line.startswith(('Depending', 'NSE')):
                            skip = True
                        
                        if skip: continue
                        scan += line
                        
                return (
                    f"::: details {rel_path.name}\n"
                    f"```log\n{scan.strip()}\n```\n"
                    f":::"
                )
            else:
                raise FileNotFoundError(f"Missing log file: {log_path}")

        # --- Images ---
        if rel_path.suffix.lower() == ".png":
            # Find relative subpath after "public"
            index = next(i+1 for i, part in enumerate(images_dir.parts) if part == 'public')
            images_subdir = Path(*images_dir.parts[index:]).as_posix()
            return f"![{rel_path.name}](/{images_subdir}/{rel_path.name})"
        
        # --- Fallback ---
        return f"[{rel_path}]({rel_path})"

    content = re.sub(r"!\[\[(.*?)\]\]", replace_embed, content)

    # 4. Write new file next to input
    output_file.write_text(content, encoding="utf-8")

    print(f"Converted: {input_file} → {output_file}")


if __name__ == "__main__":
    # parser = argparse.ArgumentParser(description="Convert Obsidian MD notes to VitePress-compatible Markdown.")
    # parser.add_argument("input_file", type=Path, help="Obsidian markdown file")
    # parser.add_argument("output_file", type=Path, help="Vitepress markdown file")
    # parser.add_argument("images_dir", type=Path, help="Directory containing log files (default: current dir)")
    
    # args = parser.parse_args()
    # obsidian_to_vitepress(args.input_file, args.output_file, args.images_dir)

    input_dir = Path(r'C:\Users\pvpga\OneDrive\Documents\Obsidian Vault\Labs\HackTheBox\Machines\Linux\Medium')
    output_dir = Path(r'src\pentest\htb\machines\linux\medium')
    images_dir = Path(r'src\public\assets\pentest\htb')
    for directory in input_dir.glob('*'):
        writeup = directory / 'Writeup.md'
        vitepress = (output_dir / directory.name.lower()).with_suffix('.md')
        images_src = (directory / 'images').glob('*')
        images = images_dir / directory.name.lower()
        images.mkdir(exist_ok=True, parents=True)
        for image in images_src:
            copy(image, images / image.name)

        obsidian_to_vitepress(writeup, vitepress, images)