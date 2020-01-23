/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Link, StaticQuery, graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import Icon from '@mdi/react'
import { mdiGithubCircle, mdiFolderOutline, mdiFolder, mdiFileOutline } from '@mdi/js'
// @ts-ignore
import { Disqus } from 'gatsby-plugin-disqus'
import { createRef, useEffect } from 'react'
import cheerio from 'cheerio'

const Viewer = ({ currentPath, folders, files, isFile, type, html }: {
  currentPath: string
  folders: string[]
  files: string[]
  isFile?: boolean
  type?: string
  html?: string
}) => {
  return (
    <StaticQuery
      query={graphql`
        query ViewerQuery {
          site {
            siteMetadata {
              repoAuthor
              repoName
              disqus
              baseUrl
            }
          }
        }
      `}
      render={($data) => {
        const folderPath = isFile ? currentPath.replace(/\/?[^./]+\.[^.]+$/, '') : currentPath
        const filePath = isFile
          ? currentPath
          : (folderPath ? `${folderPath}/README.md` : 'README.md')

        const { repoAuthor, repoName, disqus, baseUrl } = $data.site.siteMetadata
        const githubUrl = `https://github.com/${repoAuthor}/${repoName}`

        const title = `${currentPath || '.'} - ${repoAuthor}/${repoName}`
        const description = typeof html === 'string' ? (() => {
          const $ = cheerio.load(html)
          return $('main').text().substr(0, 140)
        })() : ''

        const cssMenuWithIcon = css`
          display: flex !important;
          align-self: center;
          width: 100%;

          svg {
            height: 1.5em;
            margin-right: 0.5em;
          }
        `

        const utterancesRef = createRef<HTMLDivElement>()

        useEffect(() => {
          if (utterancesRef.current) {
            const script = document.createElement('script')
            script.src = 'https://utteranc.es/client.js'
            script.setAttribute('repo', `${repoAuthor}/${repoName}`)
            script.setAttribute('issue-term', filePath)
            script.setAttribute('theme', 'github-light')
            script.crossOrigin = 'anonymous'
            script.async = true

            utterancesRef.current.append(script)
          }
        })

        return (
          <div style={{
            padding: '1em'
          }}>
            <Helmet>
              <title>{ title }</title>
              { [
                { property: 'og:title', content: title },
                { property: 'twitter:title', content: title },
                { name: 'description', content: description },
                { name: 'og:description', content: description },
                { name: 'twitter:description', content: description }
              ].map((props: any) => (
                <meta {...props} key={props.content} />
              )) }
            </Helmet>
            <div className="columns">
              <aside className="column is-3">
                <div className="menu">
                  <p className="menu-label">
                    <span>Directory:&nbsp;</span>
                    <span>{ (folderPath ? `./${folderPath}` : '.').split('/').map((el, i) => [
                      <span key={el + '1'}>/</span>,
                      <Link to={`/data/${folderPath.split('/').slice(0, i).join('/')}`} key={el + '2'}>{el}</Link>
                    ]).reduce((a, b) => [...a, ...b]).slice(1) }</span>
                  </p>
                  <ul className="menu-list">
                    { folderPath ? (
                      <li style={{display: 'flex'}}>
                        <Link to={`/data/${folderPath.replace(/\/?[^/]+$/, '')}`} css={cssMenuWithIcon}>
                          <Icon path={mdiFolderOutline} />
                          ..
                        </Link>
                      </li>
                    ) : null }
                    { folders.map((f: string) => (
                      <li style={{display: 'flex'}} key={f}>
                        <Link to={`/data/${f}`} css={cssMenuWithIcon}>
                          <Icon path={mdiFolder} />
                          { f.replace(/^.+\//, '') }
                        </Link>
                      </li>
                    )) }
                    { files.map((f: string) => (
                      <li style={{display: 'flex'}} key={f}>
                        <Link to={`/data/${f}`} className={ filePath === f ? 'is-active' : '' } css={cssMenuWithIcon}>
                          <Icon path={mdiFileOutline} />
                          { f.replace(/^.+\//, '')}
                        </Link>
                      </li>
                    )) }
                  </ul>
      
                  <p className="menu-label">
                    About
                  </p>
                  <ul className="menu-list">
                    <li>
                      <a href={ githubUrl } target="_blank" css={cssMenuWithIcon}>
                        <Icon path={mdiGithubCircle} />
                        GitHub
                      </a>
                    </li>
                  </ul>
                </div>
              </aside>
      
              <main className="column">
                <div className="card">
                  { typeof html === 'string'
                    ? (
                      type === 'reveal' ? (
                        <iframe frameBorder="0" src={`${
                          process.env.NODE_ENV === 'development' ? '/' : `${baseUrl}/`
                        }reveal/${filePath}`} css={css`
                          width: 100%;
                          height: 40vw;
          
                          @media only screen and (max-width: 770px) {
                            height: 70vw;
                          }
                        `} />
                      ) : (
                        <div className="card-content content" dangerouslySetInnerHTML={{ __html: html }}></div>
                      )
                    ) : (
                      <div className="card-content">
                        <main>
                          Please add <code>README.md</code> to the directory as the default content for the folder.
                        </main>
                      </div>
                    ) }
                </div>
      
                { typeof html === 'string' ? (
                  disqus ? (
                    <Disqus config={{
                      url: `${
                        process.env.NODE_ENV === 'development' ? '/' : `${baseUrl}/`
                      }/data/${filePath}`,
                      identifier: currentPath,
                      title,
                    }} />
                  ) : (
                    <div ref={utterancesRef}></div>
                  )
                ) : null }
              </main>
            </div>
          </div>
        )
      }}
    />
  )
}

export default Viewer
