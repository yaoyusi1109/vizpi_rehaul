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
import { updateIdentityListInSession} from '../../service/sessionService'
import { updateGroupCode} from '../../service/groupService'
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
import { SelectedGroupContext } from '../../context/SelectedGroupContext'
import { getCodeById } from '../../service/codeService'
import { SubmissionsContext } from '../../context/SubmissionsContext'
import { Modal } from '@mui/material'
import TextField from '@mui/material/TextField'
import { Textarea } from '@mui/joy'

const CodeStu = () => {
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
  const [keystrokes, setKeystrokes] = useState([])
  // const { submissions } = useContext(SubmissionsContext)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const handleClose = () => setOpen(false)
  const handleOpen = () => {
    setOpen(true)
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
    if(selectedGroup!=null &&selectedGroup.code_id!=null){
      getCodeById(selectedGroup.code_id).then((code)=>{
        if(code?.content!=selectedCode?.content &&code.creater_id!=currentUser.id){
          console.log(code)
          setSelectedCode(code)
          setLatestCodeId(code.id)
        }
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
  const handleBlocklyChange = (code,blocksUsed) => {
    //console.log(xml)
    console.log(code)
    console.log(blocksUsed)
    setCodeContent(code)
    setKeystrokes(blocksUsed)
    if(code!=selectedCode.content){
      
      addCodeAndUpdateUser(
        code,
        selectedCode.passrate,
        currentUser.id,
        blocksUsed
      ).then((result)=>{
        if (result.success) {
          if(session.type == "Blockly"){
            showToast('Code saved successfully!', 'success', 2000)
          }
          
          //setSelectedCode(result.code)
          //setKeystrokes([])
          setLatestCodeId(result.code.id)
          ////console.log(selectedGroup)
          //console.log(selectedGroup)
          console.log(selectedGroup)
          if(selectedGroup!=null&&session.type === "Blockly Shared"){
            updateGroupCode(selectedGroup.id,result.code.id)
          }
        } else {
          showToast('Code saved failed!', 'error', 2000)
          //console.log('Error:', result.error)
          return null
        }
        
      })
    }

  }

  

  const handleCodeChange = (value, viewUpdate) => {
    console.log(viewUpdate)
    setCodeContent(value);
    //inserted infront
    if(viewUpdate.changes.sections.length == 2 || (viewUpdate.changes.sections.length == 4 && viewUpdate.changes.sections[3]==-1)){
      if(viewUpdate.changes.sections[0]>0){
        let history = {
          location: 0,
          insert: false,
          value: null,
          length: viewUpdate.changes.sections[0],
          time: new Date(),
        }
        keystrokes.push(history)
      }
      if(viewUpdate.changes.sections[1]>0){
        let history = {
          location: 0,
          insert: true,
          value: viewUpdate.changes.inserted[0].text,
          length: viewUpdate.changes.sections[1],
          time: new Date(),
        }
        keystrokes.push(history)
      }
    }
    else if(viewUpdate.changes.sections[2]>0){
      let history = {
        location: viewUpdate.changes.sections[0],
        insert: false,
        value: null,
        length: viewUpdate.changes.sections[2],
        time: new Date(),
      }
      keystrokes.push(history)
    }
    if(viewUpdate.changes.sections[3]>0){
      let history = {
        location: viewUpdate.changes.sections[0],
        insert: true,
        value: viewUpdate.changes.inserted[1].text,
        length: viewUpdate.changes.sections[3],
        time: new Date(),
      }
      keystrokes.push(history)
    }
  }

  const handleSaveCode = async (passrate, pythonResult) => {
    if (currentUser.role < 3) {
      showToast("You don't have permission to change the code", 'error', 2000)
    }
    if(passRate!==100 && passrate===100&&session?.identity_list!=null){
      const me = session?.identity_list?.findIndex(
        (element) => element.id === currentUser.id
      )
      if(me!==-1){
        let newIdentityList = [...session.identity_list]
        newIdentityList.splice(me,1)
        updateIdentityListInSession(session.id,newIdentityList)
      }
    }
    //console.log(codeContent)
    const result = await addCodeAndUpdateUser(
      codeContent,
      passrate,
      currentUser.id,
      keystrokes
    )
    if (result.success) {
      showToast('Code saved successfully!', 'success', 2000)
      setSelectedCode(result.code)
      setKeystrokes([])
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
              onCodeChange={session.type?.startsWith("Blockly")?handleBlocklyChange:handleCodeChange}
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

export default CodeStu
