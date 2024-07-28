import React from 'react'
import playpause from '../../icon/play-pause.png'
import play from '../../icon/play.png'

const ControlBar = ({ onPlay }) => {
  return (
    <div className="controlBar">
      <img className="play" src={play} alt="" onClick={onPlay} />
      <img className="play_pause" src={playpause} alt="" />
    </div>
  )
}

export default ControlBar
