# git-publisher

Similar to browsing on GitHub website, but these are supported.

- YAML front matter
- Custom markdown, via Showdown.js extension
- Pug, with custom filters
- Custom page type. For example, [Reveal-md](https://github.com/patarapolw/reveal-md)

## Installation

[Lerna monorepo / Yarn workspaces](https://dev.to/patarapolw/monorepo-with-three-subrepos-for-web-apps-2ohc) is highly recommended.

```sh
npm install -g yarn
yarn global add lerna
yarn init -y
git init
lerna init
```

Then, change `./lerna.json` to the following.

```json
{
  "version": "independent",
  "npmClient": "yarn",
  "useWorkspaces": true
}
```

Add, `./package.json` to the following.

```json
{
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

After that, [clone](https://git-scm.com/docs/git-clone) or [submodularize](https://git-scm.com/docs/git-submodule) this repo.

```sh
git clone https://github.com/patarapolw/git-publisher.git packages/git-publisher
# git submodule add https://github.com/patarapolw/git-publisher.git packages/git-publisher
```

Now, after running `yarn install` (or simply, `yarn`), you can

- Run dev server via `git-publisher`
- Publsh to GitHub Pages via `git-publisher --publish`

## Editing the config

You can edit the config in `git-publisher.(json|js|yaml)`, or `"git-publisher"` field in `package.json`.

The defaults can be viewed at [/default-config.js](/default-config.js).

## Commenting

Commenting system is based on <https://utteranc.es/>. To enable it, you will have to

- Make sure the repo is public, otherwise your readers will not be able to view the issues/comments.
- Make sure the utterances app is installed on the repo, otherwise users will not be able to post comments.

## Real result

- <https://patarapolw.github.io/mylang>
