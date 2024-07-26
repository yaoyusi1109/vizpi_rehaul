import React from 'react'

const ProgressBar = ({ rate, name }) => {
  let colorClass
  if (rate >= 0 && rate <= 39) {
    colorClass = 'red'
  } else if (rate >= 40 && rate <= 69) {
    colorClass = 'yellow'
  } else if (rate >= 70 && rate <= 100) {
    colorClass = 'green'
  }
  // //console.log(rate + colorClass)

  return (
    <>
      <div className="progressBar">
        <span> {name}</span>
        <div
          className={`progressBarFill progressBarFill-${colorClass}`}
          style={{ width: `${rate}%` }}></div>
      </div>
    </>
  )
}

export default ProgressBar
