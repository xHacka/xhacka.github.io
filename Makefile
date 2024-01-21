# https://github.com/MichaelCurrin/jekyll-blog-demo/blob/master/Makefile

default: serve

all: install build

h help:
	@grep '^[a-z]' Makefile


i install:
	bundle config set --local path vendor/bundle
	bundle install

u upgrade:
	bundle update

s serve:
	bundle exec jekyll serve --trace --livereload

b build:
	JEKYLL_ENV=production bundle exec jekyll build --trace