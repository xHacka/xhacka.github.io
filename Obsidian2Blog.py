from pprint import pprint
import re
from pathlib import Path
import shutil
from datetime import datetime

class Obsidian:
    def __init__(self, path: Path) -> None:
        self.path = path
        self.name = path.name.replace(' ', '-').replace(',', '')
        self.writeup = path / 'Writeup.md'
        self.nmap = path / 'nmap_scan.log.md'
        self.images = path / 'images'

        self.post_images = IMAGES / path.parent.name / self.name
        self.post_dir = POSTS / path.parent.name
        self.post = self.get_post_name()

    def create_post_dir(self) -> None:
        self.post_dir.mkdir(parents=True, exist_ok=True)
    
    def create_post_images_dir(self) -> None:
        self.post_images.mkdir(parents=True, exist_ok=True)

    def copy_post_images(self):
        for image in self.images.glob('*'):
            shutil.copy(image, self.post_images)

    def copy_post_post(self):
        shutil.copy(self.writeup, self.post)

    def get_post_name(self) -> Path:
        return self.post_dir / f'{datetime.now().date()}-{self.name}.md'

    def replace_post_contents(self) -> None:
        def replace_nmap(post_text) -> str:
            with open(self.nmap) as nmap:
                scan = (
                    '{::options parse_block_html="true" /}\n\n'
                    '<details>\n\n'
                    '<summary markdown="span">nmap_scan.log</summary>\n\n'
                    f'{nmap.read()}\n'
                    '</details>\n\n'
                    '{::options parse_block_html="false" /}'
                )
                return post_text.replace(re.findall(r'!\[\[.*nmap_scan.log.*\]\]', post_text)[0], scan)

        def replace_images(post_text) -> str:
            image_links = re.findall(r'!\[\[.*/images/.*\]\]', post_text) 
            if not image_links:
                return post_text
            image_filenames = (Path(image[3:-2]).name for image in image_links)
            image_paths = (self.post_images / image_filename for image_filename in image_filenames)
            image_links_new = [f'![{image_path.name}](/{image_path})' for image_path in image_paths]
            replacement = dict(zip(image_links, image_links_new))
            pattern = re.compile("|".join(map(re.escape, image_links)))
            return pattern.sub(lambda match: replacement[match.group(0)], post_text)

        with open(self.post, 'r', encoding='UTF-8') as post:
            post_text = post.read()
            post_text = replace_nmap(post_text)
            post_text = replace_images(post_text)

        with open(self.post, 'w', encoding='UTF-8') as post:
            post.write(post_text)

    def setup(self):
        print(f'Processing {self.post}')
        self.create_post_dir()
        self.create_post_images_dir()
        self.copy_post_post()
        self.copy_post_images()
        self.replace_post_contents()

    def __str__(self) -> str:
        return str(self.path)

def get_unix_timestamp():
    return datetime.now().strftime('%a %b %d %I:%M:%S %p %Z %Y')


OBSIDIAN = Path('/media/sf_VBoxShare/Labs')
POSTS = Path('./_posts')
IMAGES = Path('./assets/images/')
WHITELIST_DIR = [
    'Season 5',
    'Season 6',
    'Machines',
    'Vulnhub',
]
BLACKLIST_FILES = [
    'Crafty',
    'Jab',
    'Usage',
    'SolarLab'
]

directories = [
    Obsidian(path) for path in OBSIDIAN.glob('**/*/')
    if any(name == path.parent.name for name in WHITELIST_DIR)
    and not any(name == path.name for name in BLACKLIST_FILES)
] 

for directory in directories:
    directory.setup()