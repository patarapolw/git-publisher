module.exports = {
  /**
   * The config to be sent to https://www.npmjs.com/package/gh-pages
   */
  ghPages: undefined,
  /**
   * The config to be sent to https://www.npmjs.com/package/dree
   */
  dree: {
    exclude: [
      /\.git/,
      /node_modules/,
      /\.cache/,
    ],
    extensions: ['md', 'pug'],
    excludeEmptyDirectories: true,
  },
  /**
   * Path the scan the directory tree
   */
  data: './data',
  /**
   * Additional path to JavaScript files, to be auto-loaded by Vue CLI (vue.config.js)
   * @accepts string[]
   */
  plugins: [],
  /**
   * Path to additional page types, such as Reveal
   */
  pages: './pages',
  /**
   * Config object to pass to Vue Router (currently only mode matters)
   */
  vueRouter: {
    mode: 'hash',
  },
  /**
   * Config object to pass to vue.config.js
   */
  vueConfig: {},
  /**
   * GitHub branch to look for
   */
  branch: 'master',
  /**
   * Set deploy url to deploy elsewhere than GitHub Pages
   */
  deploy: {
    url: '',
  },
}