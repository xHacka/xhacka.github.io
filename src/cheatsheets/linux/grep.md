# grep

## Extract all URLs

```bash
grep -Eo "https?://[a-zA-Z0-9./?=_%:;#&-]*" inlanefreight | sort -u
...
https://www.inlanefreight.com/index.php/wp-json/
https://www.inlanefreight.com/index.php/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.inlanefreight.com%2F
https://www.inlanefreight.com/index.php/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.inlanefreight.com%2F&#038;format=xml
https://www.inlanefreight.com/index.php/wp-json/wp/v2/pages/7
https://www.inlanefreight.com/wp-content/themes/ben_theme/css/animate.css?ver=5.6.14
...
```

