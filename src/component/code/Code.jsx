import React, { useContext, useEffect, useState } from 'react'
import { Toast } from '../commonUnit/Toast'
import { AuthContext } from '../../context/AuthContext'
import { showToast } from '../commonUnit/Toast'
import CodeArea from './CodeArea'
import CodeBar from './CodeBar'
import { getPassrateByResult } from '../../tool/progressUnit'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'
import { addCodeAndUpdateUser } from '../../service/codeService'
import { SessionContext } from '../../context/SessionContext'
import PythonInterpreter from './PythonInterpreter'
import { loadPyodide } from 'pyodide'
import {
  createErr,
  createSubmission,
  updateSubmission,
  getSubmissionById,
} from '../../service/submissionService'
import { ModeContext } from '../../context/ModeContext'
import { ErrorContext } from '../../context/ErrorContext'
import Alert from '@mui/material/Alert'
import { toast } from 'react-toastify'
import '../../css/code.scss'
import { Box, Button } from '@mui/material'
import { getUserById, getUserInSession } from '../../service/userService'
import { extractErrorInfo } from '../../service/errorService'
import Typography from '@mui/material/Typography'
import { TestResultContext } from '../../context/TestResultContext'
import { PresenterListContext } from '../../context/PresenterListContext'
import { SubmissionsContext } from '../../context/SubmissionsContext'
import { SelectedGroupContext } from '../../context/SelectedGroupContext'
import { getCodeById } from '../../service/codeService'
import { Modal } from '@mui/material'
import TextField from '@mui/material/TextField'
import { Textarea } from '@mui/joy'


const Code = () => {
  const { currentUser } = useContext(AuthContext)
  const { selectedCode, setSelectedCode } = useContext(SelectedCodeContext)
  const { selectedGroup, setSelectedGroup} = useContext(SelectedGroupContext)
  const { Mode } = useContext(ModeContext)
  const { error } = useContext(ErrorContext)
  const [codeContent, setCodeContent] = useState('')
  const [blocklyCode, setBlocklyCode] = useState('')
  const [role, setRole] = useState(currentUser.role)
  const [latestCodeId, setLatestCodeId] = useState('')
  const { session } = useContext(SessionContext)
  //usestate to store the output of the python interpreter
  const [output, setOutput] = useState('')
  const [Err, setError] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [user, setUser] = useState('No User Selected')
  const [passRate, setPassRate] = useState(0)
  const { setTestResult } = useContext(TestResultContext)
  const { codeList, setCodeList } = useContext(PresenterListContext)
  const { submissions } = useContext(SubmissionsContext)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const handleClose = () => setOpen(false)

  const handleOpen = () => {
    setOpen(true)
    if (selectedCode === undefined) {
      return
    }
    if (selectedCode?.passrate !== 100) {
      const submission = submissions.find(
        (element) => element.code_id === selectedCode.id
      )
      if (submission === undefined) {
        return
      }
      if (submission?.error != null) {
        let textError = extractErrorInfo(submission.error)
        setName(textError.actualError)
      } else {
        let numFailed = 0
        submission.result_list.forEach((result, index) => {
          if (!result) {
            numFailed += 1
          }
        })
        setName('Failed ' + numFailed + '/' + submission.result_list.length)
      }
    } else {
      setName('Passed')
    }
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  useEffect(() => {
    if (role !== currentUser.role) setRole(currentUser.role)
    if (currentUser.code_id) {
      setLatestCodeId(currentUser.code_id)
    }
  }, [currentUser])

  useEffect(() => {
    const handleSetCode = () => {
      setCodeContent(selectedCode.content)
    }
    async function fetchUser() {
      const selectedUser = await getUserById(selectedCode.creater_id)
      if (!selectedUser) return
      setUser(selectedUser.first_name)
      setPassRate(selectedCode.passrate)
    }
    if (selectedCode) {
      handleSetCode()
      fetchUser()
    }
  }, [selectedCode, session.id])

  useEffect(() => {
    //console.log(selectedGroup)
    if(selectedGroup!=null &&selectedGroup.code_id!=null){
      getCodeById(selectedGroup.code_id).then((code)=>{
        setSelectedCode(code)
        setLatestCodeId(code.id)
      })
    }
  }, [selectedGroup])

  if (!session) return null



  const handleSetCode = (name) => {
    if (!Array.isArray(codeList)) {
      //console.log('codeList is not an array')
      return
    }
    const newCodeList = [...codeList]
    newCodeList.push({
      name: name,
      code: selectedCode,
    })
    setCodeList(newCodeList)
    setOpen(false)
  }

  const handleCodeChange = (value) => {
    setCodeContent(value)
  }

  const handleSaveCode = async (passrate, pythonResult) => {
    if (currentUser.role < 3) {
      showToast("You don't have permission to change the code", 'error', 2000)
    }

    const result = await addCodeAndUpdateUser(
      codeContent,
      passrate,
      currentUser.id
    )
    if (result.success) {
      showToast('Code saved successfully!', 'success', 2000)
      setSelectedCode(result.code)

      setLatestCodeId(result.code.id)
      return result.code
    } else {
      showToast('Code saved failed!', 'error', 2000)
      //console.log('Error:', result.error)
      return null
    }
  }

  const run = async (e) => {
    setIsRunning(true)
    const toastId = toast.info('Executing code...', { autoClose: false })
    const starterCode = session.test_code.starter
    const unitTest = session.test_code.unit_test
    let pythonResult = []

    const pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
    })
    let pythonStdOut = ''
    pyodide.setStdout({
      isatty: false,
      batched: (output) => {
        pythonStdOut += output + '\n'
      },
    })

    let pythonStdErr = ''
    let passrate = 0
    //Run Starter Code and User Code; Output to Python Interpreter
    try {
      await pyodide.runPython(
        starterCode + '\n' + codeContent + '\n' + unitTest
      )
      setOutput(pythonStdOut)
      setError('')
    } catch (err) {
      //console.log(err.toString())
      setOutput(err)
      pythonStdErr = err
      setError(err)
    } finally {
      setIsRunning(false)
      toast.dismiss(toastId)
    }
    try {
      pythonResult = pyodide.globals.get('result').toJs()
      //console.log(pythonResult)
      setTestResult(pythonResult)
      passrate = getPassrateByResult(pythonResult)
    } catch (err) {
      //console.log(err.toString())
      if (pythonStdErr === '') {
        // setOutput(pythonStdOut + '\n' + 'No return value')
      }
    }

    //Save Code
    const code = await handleSaveCode(passrate, pythonResult)
    if (code) {
      const submission = createSubmission(
        currentUser.id,
        code.id,
        session.id,
        pythonResult,
        passrate,
        createErr(pythonStdErr)
      )
      await updateSubmission(submission)
    }
  }
  const handleBlocklyChange = (code,blocksUsed) => {
    setCodeContent(code)
  }

  

  const runPresenterView = async () => {
    setIsRunning(true)
    const toastId = toast.info('Executing code...', { autoClose: false })
    const starterCode = session.test_code?.starter
    const unitTest = session.test_code?.unit_test
    let pythonResult = []

    const pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
    })
    let pythonStdOut = ''
    pyodide.setStdout({
      isatty: false,
      batched: (output) => {
        pythonStdOut += output + '\n'
      },
    })

    let pythonStdErr = ''
    let passrate = 0
    //Run Starter Code and User Code; Output to Python Interpreter
    try {
      await pyodide.runPython(
        starterCode + '\n' + codeContent + '\n' + unitTest
      )
      setOutput(pythonStdOut)
      setError('')
    } catch (err) {
      //console.log(err.toString())
      setOutput(err)
      pythonStdErr = err
      setError(err)
    } finally {
      setIsRunning(false)
      toast.dismiss(toastId)
    }
    try {
      pythonResult = pyodide.globals.get('result').toJs()
      //console.log(pythonResult)
      setTestResult(pythonResult)
      passrate = getPassrateByResult(pythonResult)
    } catch (err) {
      //console.log(err.toString())
      if (pythonStdErr === '') {
        // setOutput(pythonStdOut + '\n' + 'No return value')
      }
    }
  }

  if (currentUser.role === 3) {
    window.addEventListener('beforeunload', function (e) {
      var message =
        'Your code will be lost if you leave this page. Please run your code before leaving.'
      e.returnValue = message
      return message
    })
  }

  return (
    <div className="code-container">
      {currentUser.role < 3 && (
        <div className="code">
          {Mode == false && (
            <Alert severity="info" sx={{ height: 50, fontWeight: 'bold' }}>
              Student Name: {user}
            </Alert>
          )}
          {Mode == false && (
            <Alert severity="info" sx={{ height: 50, fontWeight: 'bold' }}>
              TestPassed: {passRate}%.
            </Alert>
          )}

          <CodeBar
            handleSaveCode={handleSaveCode}
            latestCodeId={latestCodeId}
            runCode={runPresenterView}
          />
          <CodeArea
            onCodeChange={session.type?.startsWith("Blockly")?handleBlocklyChange:handleCodeChange}
            saveCode={handleSaveCode}
            runCode={runPresenterView}
          />
          {Mode == false && (
            <>
              <Button variant="outlined" onClick={handleOpen}>
                Add to Presenter View
              </Button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2">
                    Add Code To Presenter List
                  </Typography>
                  <div style={{ display: 'flex' }}>
                    <Textarea
                      id="outlined-basic"
                      label="Name"
                      variant="outlined"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Button
                      variant="outlined"
                      onClick={() => handleSetCode(name)}>
                      Add
                    </Button>
                  </div>
                </Box>
              </Modal>
            </>
          )}
          <div className="container">
            {Mode == true && (
              <>
                <Typography variant="h6" sx={{ fontWeight: 'light' }}>
                  Output
                </Typography>
                <PythonInterpreter output={output} />
              </>
            )}
          </div>
          
        </div>
        
      )}
      <Toast />
      {currentUser.role === 3 && (
        <div className="code-stud">
          <div className="container">
            <CodeBar
              handleSaveCode={handleSaveCode}
              latestCodeId={latestCodeId}
              runCode={run}
              isRunning={isRunning}
            />

            <CodeArea
              onCodeChange={session.type.startsWith("Blockly")?handleBlocklyChange:handleCodeChange}
              saveCode={handleSaveCode}
            />
          </div>
          {/* <div className="container">
            <TestSelect />
          </div> */}
          <div className="container">
            {/* <TestSelect /> */}
            <Typography variant="h6" sx={{ fontWeight: 'light' }}>
              Output
            </Typography>
            <PythonInterpreter output={output} />
          </div>
          <Toast />
        </div>
      )}
    </div>
  )
}

export default Code
