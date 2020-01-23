const path = require('path')

const fs = require('fs-extra')
const matter = require('gray-matter')
const pug = require('pug')
const showdown = require('showdown')
const { createIndentedFilter } = require('indent-utils')
const dotenv = require('dotenv')
const rimraf = require('rimraf')
const { scan: dreeScan } = require('dree')
const h = require('hyperscript')
const yaml = require('js-yaml')

const { getConfig } = require('./config')
dotenv.config()

process.env.ROOT = path.resolve(process.env.ROOT)
const config = getConfig(process.env.ROOT)

const mdConverter = new showdown.Converter()
const pugConverter = (s) => {
  return pug.render(s, {
    filters: {
      markdown: (s0) => mdConverter.makeHtml(s0),
      ...config.plugins.pug,
    },
  })
}

mdConverter.addExtension({
  type: 'lang',
  filter: createIndentedFilter('pug', (s) => {
    return pugConverter(s)
  }),
}, 'pug')

Object.entries(config.plugins.markdown).map(([k, v]) => mdConverter.addExtension(v, k))

exports.createSchemaCustomization = ({ actions, schema }) => {
  actions.createTypes([
    schema.buildObjectType({
      name: 'File',
      interfaces: ['Node'],
      fields: {
        html: {
          type: 'String',
          resolve: (s) => {
            if (['md', 'pug'].includes(s.extension)) {
              const { data, content } = matter(fs.readFileSync(s.absolutePath, 'utf8'))
              let html = content

              if (s.extension === 'pug') {
                html = pugConverter(html)
              } else {
                html = mdConverter.makeHtml(html)
              }

              return h('div', [
                ...(Object.keys(data).length > 0 ? [
                  h('details', {
                    style: 'margin-bottom: 2em',
                  }, [
                    h('summary', [
                      h('strong', data.title),
                    ]),
                    h('pre', [
                      h('code.language-yaml', yaml.safeDump(data)),
                    ]),
                  ]),
                ] : []),
                h('main', { innerHTML: html }),
              ]).outerHTML
            }

            return null
          },
        },
        type: {
          type: 'String',
          resolve: (s) => {
            if (['md', 'pug'].includes(s.extension)) {
              const { data } = matter(fs.readFileSync(s.absolutePath, 'utf8'))
              return data.type
            }

            return null
          },
        },
      },
    }),
  ])
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions
  const result = await graphql(`
    {
      allFile (
        filter: {extension: {in: ["md", "pug"]}}
      ) {
        nodes {
          relativePath
          absolutePath
          relativeDirectory
          type
          html
        }
      }
    }
  `)
  if (result.errors) {
    reporter.panicOnBuild('Error while running GraphQL query.')
    return
  }

  const d = dreeScan(path.resolve(process.env.ROOT, 'data'), {
    exclude: [
      /\.git/,
      /node_modules/,
      /\.cache/,
    ],
    extensions: ['md', 'pug'],
    excludeEmptyDirectories: true,
  })

  result.data.allFile.nodes.map((f) => {
    const currentDree = deepfind(d, {
      relativePath: f.relativeDirectory || '.',
    })[0]

    const files = []
    const folders = []

    currentDree.children.map((d0) => d0.type === 'directory' ? folders.push(d0.relativePath) : files.push(d0.relativePath))

    createPage({
      path: `/data/${f.relativePath}`,
      component: path.resolve('./src/templates/File.tsx'),
      context: {
        relativePath: f.relativePath,
        type: f.type,
        html: f.html,
        files,
        folders,
      },
    })

    if (f.type === 'reveal') {
      createPage({
        path: `/reveal/${f.relativePath}`,
        component: path.resolve('./src/templates/Reveal.tsx'),
        context: {
          html: (() => {
            const { data, content } = matter(fs.readFileSync(f.absolutePath, 'utf8'))
            return matter.stringify(content.split(/\n===\n/g).map((ss) => {
              return ss.split(/\n--\n/g).map((s) => mdConverter.makeHtml(s)).join('\n--\n')
            }).join('\n===\n'), data)
          })(),
        },
      })
    }
  })

  deepfind(d, {
    type: 'directory',
  }).map((d0) => {
    const files = []
    const folders = []

    if (d0.children) {
      d0.children.map((d0) => d0.type === 'directory' ? folders.push(d0.relativePath) : files.push(d0.relativePath))
    }

    const readme = result.data.allFile.nodes.filter((f1) => {
      return /(^|\/)README\.md$/.test(f1.relativePath)
    })[0] || {}

    if (d0.relativePath === '.') {
      d0.relativePath = ''
    }

    createPage({
      path: `/data/${d0.relativePath}`,
      component: path.resolve('./src/templates/Folder.tsx'),
      context: {
        relativePath: d0.relativePath,
        type: readme.type,
        html: readme.html,
        files,
        folders,
      },
    })

    if (!d0.relativePath) {
      createPage({
        path: '/',
        component: path.resolve('./src/templates/Folder.tsx'),
        context: {
          relativePath: '',
          type: readme.type,
          html: readme.html,
          files,
          folders,
        },
      })
    }
  })
}

exports.onPostBuild = () => {
  const pkgPath = process.env.ROOT

  rimraf.sync(
    path.join(pkgPath, 'dist'),
  )
  fs.copySync(
    path.join(__dirname, 'public'),
    path.join(pkgPath, 'dist'),
  )

  if (fs.existsSync(path.join(process.env.ROOT, 'media'))) {
    fs.copySync(
      path.join(process.env.ROOT, 'media'),
      path.join(pkgPath, 'dist/media'),
    )
  }
}

exports.onCreateDevServer = ({ app }) => {
  app.use('/media', require('express').static(path.join(process.env.ROOT, 'media')))
}

function deepfind (o, cond) {
  const result = []

  if (Array.isArray(o)) {
    for (const a of o) {
      if (a && typeof a === 'object') {
        result.push(...deepfind(a, cond))
      }
    }
  } else {
    const o1 = makePlainObject(o)
    const cond1 = makePlainObject(cond)

    if (o1) {
      if (cond1 && Object.entries(cond1).every(([k, v]) => o1[k] === v)) {
        result.push(o1)
      }

      for (const a of Object.values(o1)) {
        result.push(...deepfind(a, cond))
      }
    }
  }

  return result
}

function makePlainObject (a) {
  return (a && typeof a === 'object' && !Array.isArray(a)) ? a : null
}
