import React, { useContext, useEffect, useState, useRef} from 'react'
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
import OutputIcon from '@mui/icons-material/Output';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import axios from 'axios';
import Metacog from './Metacog'


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
  const [shortenedKeystrokes, setShortenedKeystrokes] = useState([])
  // const { submissions } = useContext(SubmissionsContext)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const handleClose = () => setOpen(false)
  const [selectedOutput, setSelectedOutput] = useState("Output")
  const handleOpen = () => {
    setOpen(true)
  }
  const gptHost = process.env.REACT_APP_HOST + "/api/v1/gpt/openAI";
  const [isLoadingAIResponse, setIsLoadingAIResponse] = useState(false);
  const initialPrompt = `
  You are an AI assistant designed to identify the mental processes students are having based on their keystrokes and input while coding.
    Here's the task content: ${session.task}. Based on the keystrokes provided by the user, you will try to guess what mental processes they are going through. Provide a straightforward guess of their thoughts with a brief explanation to justify your decision, considering any changes they have made in their code.
    The key strokes are recorded in the following format: [location, insert, value, length, time].
    Look for patterns such as frequent backspacing, prolonged pauses, and the sequence of coding actions. You can infer cognitive struggles like indecision, lack of planning, or difficulty in recalling syntax.
    Generate the guesses as if you are the student, make sure to speak in first person, and provide a brief explanation to justify your decision.

    There are three certainty levels in your response:

    1. If the student hasn't written enough code for you to identify their mental processes, you should only reply with the following JSON object:
    [{ "level" : "0", "guesses": "", explanation:""}]
    Do not try to categorize the student's activities if they haven't written enough code.

    2. If the student's activities suggest multiple potential mental processes, provide 2-3 possible types of mental processes, each with a brief explanation (within 50 words). 
    Use the same JSON format as the following example, but replace the guesses and explanation with the your own guesses and explanations:
    [
      { "level" : "1",  "guesses": " 'I need to name the function correctly as specified in the task.'", explanation: "The student is considering the function name, indicating they are thinking about the task requirements." },
      { "level" : "1",  "guesses": " 'I need to check if each number in the list falls within the range of 40 to 50.'" explanation: "The student is considering the range of numbers required, but they haven't defined the variable num yet." }
    ]

    3. If you are certain about the mental processes the student is going through, provide a single identified mental process with a brief explanation (within 50 words).
    Use the same JSON format as the following example, but replace the guesses and explanation with the your own guesses and explanations:

    [{ "level" : "2", "guesses": " 'I need to name the function correctly as specified in the task.'", "explanation": "The student is considering the function name, indicating they are thinking about the task requirements." }]

`;
  const [confirmedAnalysis, setConfirmedAnalysis] = useState(false);

  const [chatData, setChatData] = useState([{ role: "system", content: initialPrompt }]);
  const [response, setResponse] = useState("Start writing your code and get real-time meta-cognitive feedback.");
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [startedCoding, setStartCoding] = useState(false);
  const prevKeystrokesLength = useRef(keystrokes.length);
  const [collectingKeystrokes, setCollectingKeystrokes] = useState(false);





  const addChatData = async (newContent, newSender) => {
      setChatData(prevMessages => {
          const updatedMessages = [...prevMessages, { content: newContent, role: newSender }];
          return updatedMessages;
      });
  };

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

  useEffect(() => {
    if (Math.abs(keystrokes.length - prevKeystrokesLength.current) >= 15 && !isLoadingAIResponse) {
      prevKeystrokesLength.current = keystrokes.length; 
      setCollectingKeystrokes(false); 
      askAI("");
    } else if (keystrokes.length !== prevKeystrokesLength.current) {
      setCollectingKeystrokes(true); 
    }
  }, [keystrokes, codeContent]);


  const getStyle = (buttonName) => ({
    backgroundColor: selectedOutput === buttonName ? '#f2f2f2' : 'transparent',
    padding: '7px',
    paddingRight: '13px',
    borderRadius: '10px',
    marginRight: '10px',
  });

  
  if (!session) return null

  const askAI = async (studentText) => {
    setConfirmedAnalysis(false);
    const shortenedKeystrokesString = JSON.stringify(shortenedKeystrokes);
    const maxTokens = 2048;
    const trimmedKeystrokes = shortenedKeystrokesString.slice(-maxTokens);
  
    let newPrompt = `The code content is: ${codeContent}. And his is the key Stroke History: ${trimmedKeystrokes}.`;
  
    if (studentText !== undefined && studentText !== null && studentText !== "") {
      newPrompt = `The code content is: ${codeContent}. And his is the key Stroke History: ${trimmedKeystrokes}. ${studentText}.`;
    }
  
    setIsLoadingAIResponse(true);
    setResponse("Analyzing...");
    setStartCoding(true); // Add this line
  
    try {
      const res = await axios.post(gptHost, { messages: [{ role: "system", content: initialPrompt }, { role: "user", content: newPrompt }] });
      await addChatData(newPrompt, "user");
      const responseMessage = res.data.content;
      if (responseMessage !== null && responseMessage !== "" && responseMessage !== undefined) {
        await addChatData(responseMessage, "assistant");
        setResponse(responseMessage);
      } else {
        setResponse("Analyzing...");
      }
      setIsLoadingAIResponse(false);
      console.log(chatData);
    } catch (error) {
      console.error(error);
      addChatData("Sorry, something went wrong. Please try again.", "assistant");
      setIsLoadingAIResponse(false);
    }
  };
  

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
    const shortenTime = (previousTime) => {
      if (!previousTime) return "0:00";
      const diff = (new Date() - previousTime) / 1000;
      return `${Math.floor(diff / 60)}:${(diff % 60).toFixed(0)}`;
    };
    const previousHistoryTime = keystrokes.length ? keystrokes[keystrokes.length - 1].time : null;


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
        keystrokes.push(history);
        shortenedKeystrokes.push([
          "0",
          "false",
          null,
          `${viewUpdate.changes.sections[0]}`,
          shortenTime(previousHistoryTime)
        ]);
      }
      if(viewUpdate.changes.sections[1]>0){
        let history = {
          location: 0,
          insert: true,
          value: viewUpdate.changes.inserted[0].text,
          length: viewUpdate.changes.sections[1],
          time: new Date(),
        }
        keystrokes.push(history);
        shortenedKeystrokes.push([
          "0",
          "true",
          viewUpdate.changes.inserted[0].text,
          `${viewUpdate.changes.sections[1]}`,
          shortenTime(previousHistoryTime)
        ]);
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
      keystrokes.push(history);
      shortenedKeystrokes.push([
        `${viewUpdate.changes.sections[0]}`,
        "false",
        null,
        `${viewUpdate.changes.sections[2]}`,
        shortenTime(previousHistoryTime)
      ]);
    }
    if(viewUpdate.changes.sections[3]>0){
      let history = {
        location: viewUpdate.changes.sections[0],
        insert: true,
        value: viewUpdate.changes.inserted[1].text,
        length: viewUpdate.changes.sections[3],
        time: new Date(),
      }
      keystrokes.push(history);
      shortenedKeystrokes.push([
        `${viewUpdate.changes.sections[0]}`,
        "true",
        viewUpdate.changes.inserted[1].text,
        `${viewUpdate.changes.sections[3]}`,
        shortenTime(previousHistoryTime)
      ]);
    }
    console.log(shortenedKeystrokes)
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
      const handleSubmitUncertainResponse = () => {
        const actualDifficulty = document.querySelector('#outlined-multiline-static').value;
        setResponse( actualDifficulty);
        setConfirmedAnalysis(true);
      };
      
      const handleConfirmAnalysis = (isCorrect, confimedResponse) => {
        if (isCorrect) {
          setResponse( confimedResponse);
          setConfirmedAnalysis(true);
        } else {
          // Regenerate a new response
          askAI("");
        }
      };
      const handleSelectDifficulty = (item) => {
        // Logic to handle selection of one of the multiple difficulties
        setResponse(item);
        setConfirmedAnalysis(true);
      };
      

  

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

          <div className="container" >

            {/* <TestSelect /> */}
            <div className="codeOutputWrapper">
              <Typography variant="h6" sx={{ fontWeight: 'light', alignItems: 'center', display: 'flex', padding: '3px' }} gutterBottom>
                <div 
                  style={getStyle("Output")} 
                  onClick={() => setSelectedOutput("Output")}
                >
                  <OutputIcon sx={{ marginRight: '8px', color: '#4699D2' }} />
                  Output
                </div>

              </Typography>
              

              {selectedOutput === "Output" && 
                <PythonInterpreter output={output} />
              }   
            </div>
          </div>
          <Toast />
        </div>
      )}
    </div>
  )
}

export default CodeStu
