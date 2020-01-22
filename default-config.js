module.exports = {
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
   * Additional path to JavaScript files, to be auto-loaded. Accepts globbing.
   */
  plugins: [
    'plugins/**/*.js',
  ],
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
   * Set baseUrl to deploy elsewhere than GitHub Pages, for example "/"
   */
  baseUrl: '',
  outputDir: './dist',
  /**
   * Disqus shortname
   */
  disqus: '',
}
