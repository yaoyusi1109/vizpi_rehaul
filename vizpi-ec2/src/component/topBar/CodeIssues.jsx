import React, { useContext } from 'react'
import CodeCard from './CodeCard'
import { extractErrorInfo } from '../../service/errorService'
import { useState } from 'react'
import { useEffect } from 'react'
import { SubmissionsContext } from '../../context/SubmissionsContext'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Typography } from '@mui/material'

const CodeIssues = () => {
  const [processedErrors, setProcessedErrors] = useState([])
  const { submissions } = useContext(SubmissionsContext)
  const [expanded, setExpanded] = useState(false)
  const [notPassedError, setNotPassedError] = useState(null)

  useEffect(() => {
    if (!submissions) return
    fetchErrors()
    fetchNotPassedSubmissions()
  }, [submissions])

  const fetchNotPassedSubmissions = () => {
    let notPassedSubmissions = submissions.filter(
      (submission) => submission.pass.length !== 0 && submission.passrate != 100
    )
    let notPassedError = {
      errorType: 'Not Passed',
      errorContents: [],
      count: 0,
      users: [],
      codeids: [],
    }
    notPassedSubmissions.forEach((submission) => {
      notPassedError.errorContents.push(
        'Runs successfully but does not pass all tests'
      )
      notPassedError.count += 1
      notPassedError.users.push(submission.id)
      notPassedError.codeids.push(submission.code_id)
    })

    setNotPassedError(notPassedError)
  }

  const fetchErrors = () => {
    let errors = submissions
      .filter((submission) => submission.error !== null)
      .map((submission) => {
        return {
          ...extractErrorInfo(submission.error),
          codeid: submission.code_id,
        }
      })

    const errorMap = {}

    errors.forEach((error) => {
      if (!errorMap[error.errorType]) {
        errorMap[error.errorType] = {
          errorType: error.errorType,
          errorContents: [],
          count: 0,
          users: [],
          codeids: [],
        }
      }

      errorMap[error.errorType].errorContents.push(error.errorContent)
      errorMap[error.errorType].count += 1
      errorMap[error.errorType].users.push(error.id)
      errorMap[error.errorType].codeids.push(error.codeid)
    })

    let result = Object.values(errorMap)
    result = result.sort((a, b) => b.count - a.count)

    setProcessedErrors(result)
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow:
      processedErrors.length > 0 ? Math.min(processedErrors.length, 3) : 1,
    slidesToScroll:
      processedErrors.length > 0 ? Math.min(processedErrors.length, 3) : 1,
    arrows: true,
    padding: '10px',
    centerPadding: '5px',
  }

  return (
    <div className="code-issues hide-scroll-bar">
      <Typography variant="h6" fontWeight={'light'} gutterBottom>
       Code Issues
      </Typography>
      <Slider className="issue-slider" {...settings}>
        {processedErrors.map(
          (issue, index) =>
            issue && (
              <div key={index}>
                <CodeCard
                  error={issue.errorType}
                  message={issue.errorType}
                  content={issue.errorContents}
                  percentage={Math.round(
                    (issue.count * 100) / submissions.length
                  )}
                  code_id={issue.codeids}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  color="red"
                />
              </div>
            )
        )}
        {notPassedError && notPassedError.count !== 0 && (
          <div>
            <CodeCard
              error={notPassedError.errorType}
              message={notPassedError.errorType}
              content={notPassedError.errorContents}
              percentage={Math.round(
                (notPassedError.count * 100) / submissions.length
              )}
              code_id={notPassedError.codeids}
              expanded={expanded}
              setExpanded={setExpanded}
              color="yellow"
            />
          </div>
        )}
      </Slider>
    </div>
  )
}

export default CodeIssues
