import React from 'react'
import RevealMd from '@patarapolw/reveal-md-core'
import '@patarapolw/reveal-md-core/umd/index.css'

export default class File extends React.Component<{ pageContext: any }> {
  render () {
    return (
      <main style={{
        width: '100vw',
        height: '100vh'
      }}>
        <div id="global" style={{
          display: 'none'
        }}></div>

        <div className="reveal">
          <div className="slides"></div>
        </div>
      </main>
    )
  }

  componentDidMount () {
    new RevealMd(
      (s) => s,
      null,
      this.props.pageContext.html,
    )
  }
}
