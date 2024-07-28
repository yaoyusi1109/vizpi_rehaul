import React, { useContext, useEffect, useState } from 'react'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import {
  addTest,
  getTest,
  deleteTest,
  getTestArray,
  storeTestArray,
} from '../../service/testService'
import { AuthContext } from '../../context/AuthContext'
import { showToast } from '../commonUnit/Toast'
import { SelectedTestContext } from '../../context/SelectedTest'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import AvTimerIcon from '@mui/icons-material/AvTimer'

const TestButton = ({ index, codeId, testList, setTestList, result }) => {
  const testid = codeId
  const { currentUser } = useContext(AuthContext)
  const { selectedTest, setSelectedTest } = useContext(SelectedTestContext)
  const [testResult, setTestResult] = useState(result)

  useEffect(() => {
    setTestResult(result)
  }, [result])

  const handleFetchTest = async (id) => {
    const unitTest = await getTest(currentUser.session_id, id)
    if (unitTest) {
      setSelectedTest(unitTest)
    } else {
      showToast('Failed to update unit test.', 'error')
    }
  }

  const handleDeleteTest = async (id) => {
    const success = await deleteTest(currentUser.session_id, id)

    setTestList((prevTests) => prevTests.filter((test) => test.codeId !== id))
    const testListJSON = JSON.stringify(
      testList.filter((testData) => testData.codeId !== id)
    )
    await storeTestArray(currentUser.session_id, testListJSON)

    if (success) {
      showToast('Unit Test deleted successfully.', 'success')
    } else {
      showToast('Failed to delete unit test.', 'error')
    }
  }

  const testResultIcon = (r) => {
    switch (r) {
      case 'pass':
        return <CheckIcon color="success" />
      case 'fail':
        return <CloseIcon color="error" />
      default:
        return <AvTimerIcon color="warning" />
    }
  }

  const resultIcon = testResultIcon(testResult)

  return (
    <div className="button-div">
      {currentUser?.role < 3 && (
        <Button variant="contained" onClick={() => handleFetchTest(testid)}>
          Test {index + 1}
        </Button>
      )}

      {currentUser?.role >= 3 && (
        <Button
          variant="contained"
          onClick={() => handleFetchTest(testid)}
          startIcon={resultIcon}>
          Test {index + 1}
        </Button>
      )}

      {currentUser?.role < 3 && (
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => handleDeleteTest(testid)}>
          Delete
        </Button>
      )}
    </div>
  )
}

const TestSelect = () => {
  const [testList, setTestList] = useState([])
  const { currentUser } = useContext(AuthContext)
  const { testResultByID } = useContext(SelectedTestContext)

  useEffect(() => {
    // Load testList from local storage when the component mounts
    const handleGetTestArray = async () => {
      const testArray = await getTestArray(currentUser.session_id)
      if (!testArray) {
        return
      }
      const storedTestList = JSON.parse(testArray)
      if (storedTestList && Array.isArray(storedTestList)) {
        setTestList(storedTestList)
      }
    }

    handleGetTestArray()
  }, [])

  const handleAddTest = async (e) => {
    const test_id = await addTest(
      currentUser.session_id,
      'New Test',
      '#Starter Code',
      '#Unit Test'
    )

    const newTestButton = { index: testList.length, codeId: test_id }

    // Update the testList state and store it in local storage
    setTestList((prevTests) => [...prevTests, newTestButton])
    await storeTestArray(
      currentUser.session_id,
      JSON.stringify([...testList, newTestButton])
    )

    if (test_id) {
      showToast('Unit Test updated successfully.', 'success')
    } else {
      showToast('Failed to update unit test.', 'error')
    }
  }

  return (
    <div className="scafold">
      <h3>Unit Tests</h3>
      {testList.map((testData, index) => (
        <TestButton
          key={index}
          index={testData.index}
          codeId={testData.codeId}
          testList={testList}
          setTestList={setTestList}
          result={testResultByID.get(testData.codeId)}
        />
      ))}
      {currentUser?.role < 3 && (
        <div className="add-div">
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddTest}>
            Add Unit Test
          </Button>
        </div>
      )}
    </div>
  )
}

export default TestSelect
