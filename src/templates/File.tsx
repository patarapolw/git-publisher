import React from 'react'

import Viewer from '../components/Viewer'

const File = ({ pageContext }: any) => {
  return (
    <Viewer
      currentPath={pageContext.relativePath}
      folders={pageContext.folders}
      files={pageContext.files}
      isFile
      type={pageContext.type}
      html={pageContext.html}
    />
  )
}

export default File
