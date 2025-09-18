# Perfect Picture

## Description

by `FIREPONY57`

Someone seems awful particular about where their pixels go...

**Attachments**: [Source](https://imaginaryctf.org/r/Gdmod#perfect_picture.zip) <br> **Server**: [http://perfect-picture.chal.imaginaryctf.org](http://perfect-picture.chal.imaginaryctf.org/)

## Solution

1. Only PNG is allowed `app.config['ALLOWED_EXTENSIONS'] = {'png'}`
2. PNG goes through some checks which should be True.

```py 
def check(uploaded_image):
    with open('flag.txt', 'r') as f:
        flag = f.read()
    with Image.open(app.config['UPLOAD_FOLDER'] + uploaded_image) as image:
        w, h = image.size
        if w != 690 or h != 420:
            return 0
        if image.getpixel((412, 309)) != (52, 146, 235, 123):
            return 0
        if image.getpixel((12, 209)) != (42, 16, 125, 231):
            return 0
        if image.getpixel((264, 143)) != (122, 136, 25, 213):
            return 0

    with exiftool.ExifToolHelper() as et:
        metadata = et.get_metadata(app.config['UPLOAD_FOLDER'] + uploaded_image)[0]
        try:
            if metadata["PNG:Description"] != "jctf{not_the_flag}":
                return 0
            if metadata["PNG:Title"] != "kool_pic":
                return 0
            if metadata["PNG:Author"] != "anon":
                return 0
        except:
            return 0
    return flag
```

Let's craft the Perfect Picture!

```py
from PIL import Image
from PIL.PngImagePlugin import PngInfo

image = Image.new("RGBA", (690, 420), "white")
image.putpixel((412, 309), (52, 146, 235, 123))
image.putpixel((12, 209), (42, 16, 125, 231))
image.putpixel((264, 143), (122, 136, 25, 213))

metadata = PngInfo()
metadata.add_text("Description", "jctf{not_the_flag}")
metadata.add_text("Title", "kool_pic")
metadata.add_text("Author", "anon")

image.save('letmein.png', pnginfo=metadata)
image.close()
```

Submit and get flag.
::: tip
ictf{7ruly_th3_n3x7_p1c4ss0_753433}
:::