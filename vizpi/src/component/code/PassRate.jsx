import React, { useContext } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'
import { getDateString, getTimeString } from '../../tool/Tools'

const PassRate = () => {
  const { selectedCode } = useContext(SelectedCodeContext)

  if (!selectedCode) {
    return null
  }

  return (
    <>
      {selectedCode && selectedCode.time && (
        <span>
          {getDateString(selectedCode.time) +
            '  ' +
            getTimeString(selectedCode.time)}
        </span>
      )}
      <CircularProgressbar
        className="pass_rate"
        value={selectedCode?.passrate ? selectedCode?.passrate : 0}
        text={`${selectedCode ? selectedCode.passrate : 0}%`}
        background
        backgroundPadding={6}
        styles={buildStyles({
          backgroundColor: '#B2FFB2',
          textColor: '#000',
          pathColor: `rgba(62, 152, 199, ${selectedCode?.passrate / 100})`,
          trailColor: 'transparent',
          textSize: '20px',
          fontWeight: '1000',
        })}
      />
    </>
  )
}

export default PassRate
