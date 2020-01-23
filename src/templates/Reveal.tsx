import React, { useEffect } from 'react'
import '@patarapolw/reveal-md-core/umd/index.css'

const Reveal = ({ pageContext }: any) => {
  let isInit = false

  useEffect(() => {
    if (!isInit) {
      (async () => {
        const RevealMd = (await import('@patarapolw/reveal-md-core')).default
  
        new RevealMd(
          (s) => s,
          null,
          pageContext.html,
        )
      })()
      isInit = true
    }
  })

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

export default Reveal
