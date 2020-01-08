# git-publisher

Similar to browsing on GitHub website, but these are supported.

- YAML front matter
- Custom markdown, via Showdown.js extension
- Pug, with custom filters
- Custom page type. For example, [Reveal-md](https://github.com/patarapolw/reveal-md)

## Installation

[Git submodules](https://git-scm.com/docs/git-submodule) + [Lerna monorepo / Yarn workspaces](https://dev.to/patarapolw/monorepo-with-three-subrepos-for-web-apps-2ohc) is highly recommended.

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

After that, [submodularize](https://git-scm.com/docs/git-submodule) / clone this repo.

```sh
git submodule add https://github.com/patarapolw/git-publisher.git packages/git-publisher
```

Now, after running `yarn install` (or simply, `yarn`), you can

- Run dev server via `git-publisher .`
- Publsh to GitHub Pages via `git-publisher . --publish`

## Editing the config

You can edit the config in `git-publisher.(json|js|yaml)`, or `"git-publisher"` field in `package.json`.

The defaults are

```js
module.exports = {
  /**
   * The config to be sent to https://www.npmjs.com/package/gh-pages
   */
  ghPages: undefined,
  /**
   * Path the scan the directory tree
   */
  data: './data',
  /**
   * Additional path to JavaScript files, to be loaded by Vue CLI (vue.config.js)
   * @accepts string[]
   */
  plugins: undefined,
  /**
   *  Additional page types, such as Reveal
   */
  pages: {
    [type]: PATH_TO_PAGE_TYPE
  }
}
```
