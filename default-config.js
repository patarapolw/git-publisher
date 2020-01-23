module.exports = {
  /**
   * Markdown (Showdown.js) and Pug extenssions (filters)
   */
  plugins: {
    pug: {},
    markdown: {},
  },
  /**
   * GitHub branch to look for
   */
  branch: 'master',
  /**
   * Set baseUrl to deploy elsewhere than GitHub Pages, for example "/"
   */
  baseUrl: '',
  /**
   * Output directory relative to ROOT
   */
  outputDir: './dist',
  /**
   * Disqus shortname
   */
  disqus: '',
}
