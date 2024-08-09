import React from 'react'
import { Blocks } from 'react-loader-spinner'

const Loading = () => {
  return (
    <div className="loadingContainer">
      <Blocks
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
      />
    </div>
  )
}

export default Loading
