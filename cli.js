#!/usr/bin/env node
/* eslint-disable import/order */

const { spawnSync } = require('child_process')
const path = require('path')
const ghPages = require('gh-pages')
const { getConfig } = require('./config')

const { argv } = require('yargs')
  .scriptName('git-publisher')
  .version(require('./package.json').version)
  .option('publish', {
    alias: 'deploy',
    type: 'boolean',
    description: 'Publish with gh-pages',
  })
  .option('build', {
    alias: 'b',
    describe: 'Build to ./dist, or specify a path',
  })
  .option('root', {
    alias: 'r',
    type: 'string',
    default: process.cwd(),
    describe: 'Path to find for git-publisher.(json|js|yaml) or package.json with "git-publisher" field',
  })

if (argv.publish || argv.build) {
  spawnSync('yarn', [
    'build',
  ], {
    cwd: __dirname,
    stdio: 'inherit',
    env: {
      ...process.env,
      ROOT: argv.root,
      BUILD_PATH: argv.build,
    },
  })

  if (argv.publish) {
    const config = getConfig(argv.root)
    ghPages.publish(
      typeof argv.build === 'string' ? argv.build : path.resolve(argv.root, './dist'),
      config.ghPages || config['gh-pages'],
    )
  }
} else {
  spawnSync('yarn', [
    'serve',
  ], {
    cwd: __dirname,
    stdio: 'inherit',
    env: {
      ...process.env,
      ROOT: argv.root,
    },
  })
}
