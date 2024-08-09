import { useEffect, useRef } from 'react'

const AudioUnit = ({ key, stream }) => {
  const audioRef = useRef()
  useEffect(() => {
    if (stream) {
      audioRef.current.srcObject = stream
    }
    console.log('audioUnit:', stream)
  }, [stream])
  return (
    <div>
      <audio ref={audioRef} autoPlay controls />
    </div>
  )
}

export default AudioUnit
