
from pathlib import Path
import json
from titlecase import titlecase
from Obsidian2VitePress import norm

s = 'Machines'
base = Path.home() / r'OneDrive\Documents\Obsidian Vault\Labs\HackMyVM' / s

config = []
for file in Path(base).rglob('**/*.md'):
    if 'nmap' in file.name: continue
    section = next((c for c in config if c['text'] == file.parent.parent.name), None)
    if section is None:
        section = {'text': file.parent.parent.name, 'collapsed': True, 'items': []}
        config.append(section)
    # writeup = norm(f'/pentest/{s}/{file.parent.name}/{file.name}')
    writeup = norm(f'/pentest/hackmyvm/{file.parent.parent.name}/{file.parent.with_suffix(".md").name}')
    section['items'].append({'text': titlecase(file.parent.stem), 'link': writeup})

print(json.dumps(config, indent=4))

# config = []
# dirs = Path('./src/ctf')
# for year in dirs.glob('*'):
#     config.append({'text': year.name, 'collapsed': True, 'items': []})

#     for ctf in year.glob('*'):
#         config[-1]['items'].append({'text': titlecase(ctf.name).replace('ctf', 'CTF'), 'collapsed': True, 'items': []})

#         for writeup in ctf.glob('*'):
#             if writeup.is_dir():
#                 config[-1]['items'][-1]['items'].append({'text': writeup.name, 'collapsed': True, 'items': []})
#                 for writeup2 in writeup.glob('*'):
#                     with open(writeup2, encoding='utf-8', errors='ignore') as f:
#                         for title in f:
#                             if '#' not in title: raise Exception(f'{writeup2}: No title!')
#                             break
#                         title = title.strip('# \r\n')
#                         path = '/' + Path(*writeup2.parts[1:]).as_posix()

#                         config[-1]['items'][-1]['items'][-1]['items'].append({'text': title, 'link': path})      
#             else:
#                 with open(writeup, encoding='utf-8', errors='ignore') as f:
#                     for title in f:
#                         if '#' not in title: raise Exception(f'{writeup}: No title!')
#                         break
#                     title = title.strip('# \r\n')
#                     path = '/' + Path(*writeup.parts[1:]).as_posix()

#                     config[-1]['items'][-1]['items'].append({'text': title, 'link': path})

# config_js = json.dumps(config, indent=4)
# # config_js = (
# #     config_js
# #     .replace('"text"', 'text')
# #     .replace('"collapsed"', 'collapsed')
# #     .replace('"items"', 'items')
# #     .replace('"link"', 'link')
# # )
# print(config_js)

# from pathlib import Path
# import argparse

# def lowercase_directories(root: Path, dry_run=True):
#     for dir_path in sorted(root.rglob('*'), key=lambda p: -len(p.parts)):
#         if dir_path.is_dir():
#             new_name = dir_path.name.lower()
#             if new_name != dir_path.name:
#                 new_path = dir_path.with_name(new_name)
#                 if dry_run:
#                     print(f"[DRY RUN] Rename dir: {dir_path} -> {new_path}")
#                 else:
#                     dir_path.rename(new_path)

# def process_files(root: Path, dry_run=True):
#     for file_path in root.rglob('*'):
#         if file_path.is_file():
#             new_name = file_path.name.lower().replace(' ', '-')
#             if new_name != file_path.name:
#                 new_path = file_path.with_name(new_name)
#                 if dry_run:
#                     print(f"[DRY RUN] Rename file: {file_path} -> {new_path}")
#                 else:
#                     file_path.rename(new_path)

# def main():
#     parser = argparse.ArgumentParser(description="Lowercase directories and files, replace spaces with dashes in files.")
#     parser.add_argument("root", type=Path, help="Root directory to process")
#     parser.add_argument("-d", "--dry-run", action="store_true", help="Actually rename files/directories")
#     args = parser.parse_args()

#     dry_run = args.dry_run
#     lowercase_directories(args.root, dry_run=dry_run)
#     process_files(args.root, dry_run=dry_run)

# if __name__ == "__main__":
#     main()

# import os
# import re
# from pathlib import Path

# ctf_dir = Path("./src/ctf/root-me")
# assets_dir = Path("./src/public/assets")

# # enable / disable dry run
# dry_run = True

# # regex to match Markdown images
# pattern = re.compile(r'!\[([^\]]*)\]\(([^)]+)\)')

# def find_asset(filename: str) -> str | None:
#     """Search assets_dir recursively for the filename, return /assets/... path if found"""
#     for f in assets_dir.rglob(filename):
#         return '/' + Path(*f.parts[2:]).as_posix().lower()
#     return None

# for file in ctf_dir.rglob("*.md"):
#     text = file.read_text(encoding="utf-8")
#     changed = False

#     def replacer(match):
#         global changed
#         alt, old_path = match.groups()
#         fname = Path(old_path).name
#         new_path = find_asset(fname)
#         print(new_path)
#         if new_path and new_path != old_path:
#             changed = True
#             if dry_run:
#                 print(f"[DRY RUN] {file}: {old_path} → {new_path}")
#             return f"![{alt}]({new_path})"
#         return match.group(0)

#     new_text = pattern.sub(replacer, text)

#     if changed and not dry_run:
#         file.write_text(new_text, encoding="utf-8")
#         print(f"Updated {file}")
