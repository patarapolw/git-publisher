# git-publisher

Similar to browsing on GitHub website, but these are supported.

- YAML front matter stripping
- Custom markdown, via Showdown.js extension
- Pug, with custom filters
- Custom page type, e.g., [Reveal-md](https://github.com/patarapolw/reveal-md), with `type: reveal` in YAML front matter

## Installation

Simply clone the repo, and create `.env` with

```dotenv
ROOT=<PATH_TO_FOLDER_CONTAINING_DATA_FOLDER>
```

For example, you might add the repo as a submodule or repo in repo, for easy navigation.

## Running and building

Navigate to the repo, and run `yarn serve` or `yarn build`

To publish to GitHub, you might be interested in [gh-pages](https://www.npmjs.com/package/gh-pages)

- It is as simple as `gh-pages -d dist`

## Editing the config

You can edit the config in `git-publisher.(json|js|yaml)`, or `"gitPublisher"` field in `package.json`.

The defaults can be viewed at [/default-config.js](/default-config.js).

## Commenting

Commenting system is based on <https://utteranc.es/>. To enable it, you will have to

- Make sure the repo is public, otherwise your readers will not be able to view the issues/comments.
- Make sure the utterances app is installed on the repo, otherwise users will not be able to post comments.

You can also use disqus, by providing `"disqus"` field in `git-publisher.(json|js|yaml)`.

## Real result

- <https://patarapolw.github.io/mylang>

## Plans

- YAML front matter usage, e.g. to search in a search box
