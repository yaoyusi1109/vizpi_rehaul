import React, { useContext } from 'react'
import PassRate from '../code/PassRate'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { SubmissionsContext } from '../../context/SubmissionsContext'
import { SessionContext } from '../../context/SessionContext'
import { getPassrateOfClass } from '../../service/submissionService'
import { useState } from 'react'
import { useEffect } from 'react'
import { Switch, TextField } from '@mui/material'
import { groupingInSession } from '../../service/sessionService'
import { AutoGroupingContext } from '../../context/AutoGroupingContext'


const PassRateWindow = ({}) => {
  const { session } = useContext(SessionContext)
  const { submissions } = useContext(SubmissionsContext)
  const [passRate, setPassRate] = useState(0)
  const [autoGrouping, setAutoGrouping] = useState(false)
  const [autoGroupingRate, setAutoGroupingRate] = useState(null)
  const [passRateList, setPassRateList] = useState([])
  const [testNameList, setTestNameList] = useState([])

  useEffect(() => {
    if (!session.test) return
    const rate = getPassrateOfClass(
      session.stu_num,
      session.test.test_list.length,
      submissions
    )
    if (autoGrouping && !session.grouped && autoGroupingRate) {
      if (rate >= autoGroupingRate) {
        groupingInSession(session, 'passrate')
      }
    }

    if (session.test.test_list.length > 0) {
      const passRateList = new Array(session.test.test_list.length).fill(0)
      submissions.forEach((submission) => {
        submission.pass.forEach((result, index) => {
          if (result) {
            passRateList[index] += 1
          }
        })
      })
      passRateList.forEach((rate, index) => {
        passRateList[index] = Math.round((rate / session.stu_num) * 100)
      })
      setPassRateList(passRateList)
    }

    setPassRate(rate)

    if (session.test.test_list.length > 0) {
      const testNameList = []
      session.test.test_list.forEach((test) => {
        testNameList.push(test.testName)
      })
      setTestNameList(testNameList)
    }
  }, [submissions, session])

  useEffect(() => {
    if (autoGrouping && !session.grouped && autoGroupingRate) {
      if (passRate >= autoGroupingRate) {
        groupingInSession(session, 'passrate')
      }
    }
  }, [autoGrouping, autoGroupingRate])

  return (
    <div className="group-info-test">
      <h4 className="header">Class Pass Rate</h4>
      <div className="group-info-test-content">

        <div className="test-big-div">
          <div className="unit-test-container">
            {testNameList.map((testName, index) => {
              return (
                <div className="unit-test" key={index}>
                  {testName}
                </div>
              )
            })}
          </div>

          <div className="unit-test-container">
            {passRateList.map((rate, index) => {
              return (
                <div className="pass" key={index}>
                  {rate + '%'}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {!session.grouped && (
        <div className="auto_grouping">
          <span>Group when pass rate reach: </span>
          <TextField
            className="testfield"
            onChange={(e) => {
              setAutoGroupingRate(e.target.value);
            }}
          />
          <span>%</span>
          <Switch
            onChange={(e) => {
              setAutoGrouping(e.target.checked);
              //console.log(autoGrouping);
            }}
          />
        </div>
      )}

      <span className="activeStu">{'Active students: ' + session.stu_num}</span>
    </div>
  )
}

export default PassRateWindow
