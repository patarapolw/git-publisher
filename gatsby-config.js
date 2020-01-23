const { execSync } = require('child_process')
const path = require('path')

const dotenv = require('dotenv')
const { getConfig } = require('./config')
dotenv.config()

process.env.ROOT = path.resolve(process.env.ROOT)
const config = getConfig(process.env.ROOT)

config.repoUrl = execSync('git config --get remote.origin.url', {
  cwd: process.env.ROOT,
}).toString().trim()

const [_, repoAuthor, repoName] = /([^/]+)\/([^/]+)\.git$/.exec(config.repoUrl) || []

Object.assign(config, {
  repoAuthor,
  repoName,
})

config.baseUrl = config.baseUrl || (config.repoUrl ? `/${repoName}` : '/')

module.exports = {
  pathPrefix: config.baseUrl,
  siteMetadata: config,
  plugins: [
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: path.join(process.env.ROOT, 'data'),
        name: 'data',
      },
    },
    ...(config.disqus ? [
      {
        resolve: 'gatsby-plugin-disqus',
        options: {
          shortname: config.disqus,
        },
      },
    ] : []),
  ],
}
