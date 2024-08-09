import React, { useContext } from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { SubmissionsContext } from '../../context/SubmissionsContext'
import { SessionContext } from '../../context/SessionContext'
import { getPassrateOfClass } from '../../service/submissionService'
import { useState } from 'react'
import { useEffect } from 'react'
import { Switch, TextField, Typography } from '@mui/material'
import { groupingInSession } from '../../service/sessionService'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { TestPanelContext } from '../../context/TestPanelContext'
import '../../css/passrate.scss'
import { getUserById, getUserInSession } from '../../service/userService'
import { AuthContext } from '../../context/AuthContext'
import { getCodeById } from '../../service/codeService'
import { Alert } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import Link from '@mui/material/Link'
import { Button } from '@mui/material'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'
import { AutoGroupingContext } from '../../context/AutoGroupingContext'
import CodeIssueListItem from "./CodeIssueListItem";
import InteractionList from './InteractionList'

const PassRateTable = ({}) => {
  const { session } = useContext(SessionContext)
  const { submissions } = useContext(SubmissionsContext)
  const [passRate, setPassRate] = useState(0)
  const { autoGrouping } = useContext(AutoGroupingContext)
  const { autoGroupingRate } = useContext(AutoGroupingContext)
  const [passRateList, setPassRateList] = useState([])
  const [testNameList, setTestNameList] = useState([])

  const {
    studIndex,
    unitTestName,
    testPanel,
    testName,
    setTestLength,
    setTestPanel,
    setTestName,
    studName,
    setStudName,
    setStudPassArray,
    studPassArray,
    setStudIndex,
  } = useContext(TestPanelContext)
  const { currentUser } = useContext(AuthContext)
  const [rerender, setRerender] = useState(false)
  const [correctArray, setCorrectArray] = useState([])
  const [delay, setDelay] = useState(0)
  const { setSelectedCode } = useContext(SelectedCodeContext)
  const [testCases, setTestCases] = useState([])



  useEffect(() => {
    if (!session.test_list || session.test_list.length === 0) return
    const rate = getPassrateOfClass(
      session.stu_num,
      session.test_list.length,
      submissions
    )

    if (autoGrouping && !session.grouped && autoGroupingRate) {
      if (rate >= autoGroupingRate) {
        groupingInSession(session, 'passrate')
      }
    }

    if (session.test_list.length > 0) {
      const passRateList = new Array(session.test_list.length).fill(0)
      submissions.forEach((submission) => {
        //tally individual tests passed
        if (!submission.result_list) return
        submission.result_list.forEach((result, index) => {
          if (result) {
            passRateList[index] += 1
          }
        })
      })
      //set all test pass rate
      let allTestPass = Math.min(...passRateList)
      passRateList.push(allTestPass)
      setPassRateList([...passRateList, allTestPass])
      const testNameList = session.test_list.map((test) => ({
        testname: test.testName,
        passrate: passRateList[session.test_list.indexOf(test)],
      }))
      setTestNameList([
        ...testNameList,
        {
          testname: 'All',
          passrate: passRateList[session.test_list.length],
        },
      ])
    }

    setPassRate(rate)
    fetchNotPassedSubmissions()
  }, [submissions, session])
  
  const fetchNotPassedSubmissions = async () => {
		let notPassedSubmissions = submissions.filter(
			(submission) =>
				submission.result_list &&
				submission.result_list.length !== 0
		);
    let cases=[]
    session.test_list.forEach((test) => {
      cases.push({
        errorType: test.testName,
        errorContents: [],
        count: 0,
        users: [],
        codeids: []
      })
    })
    cases.push({
      errorType: "All",
      errorContents: [],
      count: 0,
      users: [],
      codeids: []
    })
		for (const submission of notPassedSubmissions) {
      let user = await getUserById(submission.user_id)
      let error = false
			for (let [index, val] of submission?.result_list?.entries()) {
        if(!val){
          error = true
          // cases[index].errorContents.push(
          //   user.first_name + " Failed"
          // )
          // cases[index].users.push(submission.id)
          // cases[index].codeids.push(submission.code_id);
        }
        else{
          cases[index]?.errorContents?.unshift(
            user.first_name + " Passed"
          )
          cases[index].count += 1;
          cases[index].users.unshift(submission.id)
          cases[index].codeids.unshift(submission.code_id);
        }
      }
      if(!error){
        cases[session.test_list.length].errorContents.unshift(
          user.first_name + " Passed"
        )
        cases[session.test_list.length].count += 1;
        cases[session.test_list.length].users.unshift(submission.id)
        cases[session.test_list.length].codeids.unshift(submission.code_id);
      }
      else{
        // cases[session.test_list.length].errorContents.push(
        //   user.first_name + " Failed"
        // )
        // cases[session.test_list.length].users.push(submission.id)
        // cases[session.test_list.length].codeids.push(submission.code_id);
      }
        
		}
    // //console.log(submissions)
    // //console.log(notPassedSubmissions)
    // //console.log(cases)
    setTestCases(cases)
    
	};
  useEffect(() => {
    if (autoGrouping && !session.grouped && autoGroupingRate) {
      if (passRate >= autoGroupingRate) {
        groupingInSession(session, 'passrate')
      }
    }
  }, [autoGrouping, autoGroupingRate])

  useEffect(() => {
    const createNameListArray = async (index) => {
      //creates array of name objects that only contains name and code id of students that
      //passed the unit test
      const nameList = []
      submissions?.forEach(async (submission) => {
        if (index === passRateList.length - 1) {
          const code = await getCodeById(submission.code_id)
          const codeUser = await getUserById(code?.creater_id)
          nameList.push({
            name: codeUser.name,
            code_id: submission.code_id,
            pass: true,
          })
        } else {
          const code = await getCodeById(submission.code_id)
          const codeUser = await getUserInSession(session.id, code?.creater_id)
          nameList.unshift({
            name: codeUser?.name,
            code_id: submission.code_id,
            pass: false,
          })
        }
      })
      await sleep(1000)
      setCorrectArray(nameList)
    }

    createNameListArray(studIndex)
  }, [studIndex, submissions, session])

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const handleClick = () => {
    setTestPanel(!testPanel)
  }

  const rowClickHandler = async (unitTestName, index) => {
    setTestName(unitTestName)
    setStudIndex(index)
    ////console.log("submissions",submissions);
    setRerender(!rerender)
    setTestPanel(!testPanel)
  }

  const handleInspectCode = async (index, codeId) => {
    const code = await getCodeById(codeId)
    await setSelectedCode(code)
  }
  ////console.log(testNameList)
  return (
    <>
    <div className="group-info-test">
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <Typography variant="h6" fontWeight={'light'}>
          Class Performance
        </Typography>
        <Typography variant="h6" fontWeight={'light'}>
          Active Students: {session.stu_num}
        </Typography>
      </div>
{/* 
      <Typography variant="h6" fontWeight={'light'}>
          Test Cases Summary
      </Typography> */}
      
      
      {testCases.map((test, index) => (
        <div>
          <CodeIssueListItem
            error={test.errorType}
            message={test.errorType}
            content={test.errorContents}
            total_num={session.stu_num}
            error_num={test.count}
            code_id={test.codeids}
          />
        </div>
      )) }

        

    </div>
    {session?.type === "Vizmental" && <InteractionList/> }
      </>
  )
}

export default PassRateTable
