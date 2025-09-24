from pathlib import Path
import re
import argparse
from shutil import copy 
from titlecase import titlecase

def obsidian_to_vitepress(input_file: Path, output_file: Path, images_dir: Path):
    content = input_file.read_text(encoding="utf-8")
    # title = input_file.parent.stem.capitalize()  # default title is directory name. e.g.: Alert/Writeup.md -> Alert
    title = titlecase(input_file.stem.replace('-',' ')) # i-am-groot.md -> I Am Groot

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
        target = input_file.parent / Path(parts[0].strip()).name
        target_name = target.name.replace(' ', '-').lower()

        # --- Images ---
        if target.suffix.lower() == ".png":
            # Find relative subpath after "public"
            index = next(i+1 for i, part in enumerate(images_dir.parts) if part == 'public')
            images_subdir = Path(*images_dir.parts[index:]).as_posix()
            return f"![{target_name}](/{images_subdir}/{target_name})"

        target = target.with_name(target.name + '.md')
        
        # --- Inline log files ---
        if target_name == "nmap_scan.log":
            if target.exists():
                scan = ''
                skip = True
                with open(target, encoding='utf-8', errors='replace') as f:
                    for line in f:
                        if line.startswith(('Open', 'PORT')):
                            skip = False
                        if line.startswith(('Depending', 'NSE')):
                            skip = True
                        
                        if skip: continue
                        scan += line
                        
                return (
                    f"::: details {target_name}\n"
                    f"```log\n{scan.strip()}\n```\n"
                    f":::"
                )
            else:
                raise FileNotFoundError(f"Missing log file: {target}")
        
        # --- Fallback ---
        # return f"[{rel_path}]({rel_path})"
        text = target.read_text(encoding='utf-8', errors='replace').strip('`').strip()
        return (
            f"::: details {target_name}\n"
            f"```replaceme\n{text}\n```\n"
            f":::"
        )

    content = re.sub(r"!\[\[(.*?)\]\]", replace_embed, content)

    # 4. Write new file next to input
    output_file.write_text(content, encoding="utf-8")

    print(f"Converted: {input_file} → {output_file}")

def norm(s): 
    name = str(s).lower()
    name = name.replace(')', '')
    name = name.replace(' - NOPE', '')
    name = name.replace(' ', '-')
    name = name.replace('(', '-')
    name = name.replace('---', '-')
    name = name.replace('--', '-')
    name = name.strip()
    return name

if __name__ == "__main__":
    # parser = argparse.ArgumentParser(description="Convert Obsidian MD notes to VitePress-compatible Markdown.")
    # parser.add_argument("input_file", type=Path, help="Obsidian markdown file")
    # parser.add_argument("output_file", type=Path, help="Vitepress markdown file")
    # parser.add_argument("images_dir", type=Path, help="Directory containing log files (default: current dir)")
    
    # args = parser.parse_args()
    # obsidian_to_vitepress(args.input_file, args.output_file, args.images_dir)

    dry = 0
    
    s = 'SuNiNaTaS'
    base = Path.home() / r'OneDrive\Documents\Obsidian Vault\CTF' / s
    output_dir = Path(r'src\ctf') / s.lower()
    images_dir = Path(r'src\public\assets\ctf') / s.lower()
    
    if not dry:
        output_dir.mkdir(exist_ok=True, parents=True)
        images_dir.mkdir(exist_ok=True, parents=True)
    
    for file in base.rglob('*.md'):
        output_file = Path(norm(output_dir / file.parent.name / file.name))

        if not dry:
            output_file.parent.mkdir(exist_ok=True)
        else:
            print(Path(*file.parts[6:]), '-->', output_file)

        if not dry:
            obsidian_to_vitepress(file, output_file, images_dir)
        
        images_src = base.rglob('**/images/*')
        for image in images_src:
            image_name = norm(images_dir / image.parent.parent.name / image.name)
            if not dry:
                copy(image, image_name)
            else:
                print(image, '-->', image_name)
                        
    ### WriteupCategory\WriteupName\Writeup.md
    # base = Path.home() / r'OneDrive\Documents\Obsidian Vault\Labs\HackTheBox\Sherlocks'
    # for base_dir in base.glob('*'):
    #     input_dir = Path.home() / r'OneDrive\Documents\Obsidian Vault\Labs\HackTheBox\Sherlocks' / base_dir
    #     output_dir = Path(r'src\soc\sherlocks')
    #     images_dir = Path(r'src\public\assets\soc\sherlocks')
    #     for directory in input_dir.glob('*'):
    #         writeup = directory / 'Writeup.md'
            
    #         directory_name = directory.name.replace('- NOPE', '').lower().strip()
    #         vitepress = (output_dir / base_dir.name.lower() / directory_name).with_suffix('.md')
    #         images = images_dir / directory_name.replace(' ', '-').lower()
            
    #         print(f'{writeup=}\n{vitepress=}\n{images=}\n--- --- --- --- --- ---')
    #         # break
            
    #         vitepress.parent.mkdir(exist_ok=True, parents=True)
    #         output_dir.mkdir(exist_ok=True, parents=True)
    #         images.mkdir(exist_ok=True, parents=True)
            

    #         images_src = (directory / 'images').glob('*')
    #         for image in images_src:
    #             copy(image, images / image.name)

    #         obsidian_to_vitepress(writeup, vitepress, images)
    
    # base = Path.home() / r'OneDrive\Documents\Obsidian Vault\CTF'
    # for base_dir in base.glob('*'):
    #     input_dir = base / base_dir
    #     output_dir = Path(r'src\ctf')
    #     images_dir = Path(r'src\public\assets\ctf')
    #     for directory in input_dir.glob('*'):
    #        if directory.name.isdigit():
    #             for directory2 in directory.glob('*'):
    #                 for writeup in directory2.glob('*.md'):
    #                     directory_name = directory2.name.replace('- NOPE', '').lower().strip()
    #                     vitepress = Path(str(output_dir / directory.name / base_dir.name / directory_name / writeup.name).lower().replace(' ', '-')).with_suffix('.md')
    #                     images = Path(str(images_dir / base_dir.name / directory.name / directory2.name).replace(' ', '-').lower())
    #                     print(f'{writeup=}\n{vitepress=}\n{images=}\n--- --- --- --- --- ---')
    #                     vitepress.parent.mkdir(exist_ok=True, parents=True)
    #                     output_dir.mkdir(exist_ok=True, parents=True)
    #                     images.mkdir(exist_ok=True, parents=True)
    #                     images_src = (directory2 / 'images').glob('*')
    #                     for image in images_src:
    #                         if (images / image.name).exists(): 
    #                             continue
    #                         copy(image, images / image.name)
    #                     obsidian_to_vitepress(writeup, vitepress, images)
        #                 break
        #             break
        #         break
        #     break
        # break
