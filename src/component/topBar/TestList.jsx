import React, { useContext, useEffect, useState } from 'react'
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Collapse,
  Divider
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import AssistantIcon from '@mui/icons-material/Assistant'
import IconButton from '@mui/material/IconButton'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { LoadingButton } from '@mui/lab'
import Alert from '@mui/material/Alert'
import { SessionContext } from '../../context/SessionContext'
import {
  changeUnitTest,
  createTestCode,
  updateTestCodeInSession,
  updateTestListInSession,
  validateTestCode,
} from '../../service/testService'
import { toast } from 'react-toastify'
import { showToast } from '../commonUnit/Toast'
import { functionNameDetect } from '../../tool/functionNameDetect'
import { generateUnitTests } from '../../tool/unitTestGenerator'
import '../../css/UnitTestList.scss'
import { AuthContext } from '../../context/AuthContext'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import BlockIcon from '@mui/icons-material/Block'
import { TestResultContext } from '../../context/TestResultContext'
import { ModeContext } from '../../context/ModeContext'
import { validateTests } from '../../tool/validateTests'
const TestList = () => {
  const { session } = useContext(SessionContext)
  const { currentUser } = useContext(AuthContext)
  const { testResult } = useContext(TestResultContext)

  const [testList, setTestList] = useState([])
  const [parameter, setParameter] = useState('')
  const [returnValue, setReturnValue] = useState('')
  const [testName, setTestName] = useState('New Test')
  const [isGenerating, setIsGenerating] = useState(false)
  const [num, setNum] = useState(3)
  const [type, setType] = useState('Normal')
  const [updatedTestResult, setUpdatedTestResult] = useState([])
  const { Mode } = useContext(ModeContext)

  const [alert, setAlert] = useState(false)
  const [alertContent, setAlertContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [color, setColor] = useState('primary')

  useEffect(() => {
    if (!session || !session.test_list) return
    setTestList(session.test_list)
  }, [session])

  // useEffect(() => {
  //   //console.log(testList)
  // }, [testList])

  useEffect(() => {
    setUpdatedTestResult(testResult)
  }, [testResult])

  useEffect(() => {
    let warning = 'Test '
    let ready = false
    for (let i = 0; i < testList.length; i++) {
      if (testList[i].newTest != null) {
        warning += i + 1 + ' and '
        ready = true
      }
    }
    if (!ready) {
      if (alert) {
        setColor('success')
      }
      setAlert(false)
    } else if (testList.length != 0) {
      setColor('error')
      setAlert(true)
    }
    warning = warning.substring(0, warning.length - 4) + 'may be incorrect '
    setAlertContent(warning)
  }, [testList])

  if (!session) return null

  const handleGenerateCode = async () => {
    setLoading(true)
    if (testList.length === 0) {
      showToast('Please add at least one test case', 'warning')
    }
    const code = await createTestCode(testList, session.task)
    const validate = await validateTestCode(session.task, code)
    
    const result = validate.result
    const gptCode = validate.code
    console.log(gptCode)
    console.log(result)
    let idx = []
    let failTests = []
    for (let i = 0; i < testList.length; i++) {
      let newTestList = [...testList]
      if (result == null || !result[i]) {
        setAlert(true)
        setColor('error')
        failTests.push(testList[i])
        idx.push(i)
      } else {
        delete newTestList[i].newTest
      }
      setTestList(newTestList)
    }
    let newTestList = [...testList]
    if (failTests.length !== 0) {
      let newTests = await changeUnitTest(session.task, gptCode, failTests)
      for (let i = 0; i < idx.length; i++) {
        newTestList[idx[i]].newTest = newTests[i]
      }
    }

    newTestList.sort(function (a, b) {
      if (a.newTest == null) {
        if (b.newTest == null) {
          return 0
        } else {
          return 1
        }
      } else if (b.newTest == null) {
        return -1
      }
      return 0
    })
    setTestList(newTestList)

    updateTestListInSession(session.id, testList)
    updateTestCodeInSession(session.id, code)
    if (result!=null && checker(result)) {
      setAlert(false)
      setColor('primary')
    }
    setLoading(false)
  }

  let checker = (arr) => arr.every((v) => v === true)

  const checkString = (type,index,newTestList) =>{
    newTestList = newTestList|| [...testList];
    
    let value;
    if(type == 'parameter'){
      value = newTestList[index].parameter
    }
    else{
      value = newTestList[index].return
    }
    
    console.log(value)
    console.log(newTestList[index])
    let inQuote=-1
    for(let i = 0; i < value.length; i++){
      if(value[i]=='\'' || value[i]=='\"' ){
        if(inQuote !=-1){
          if(value[inQuote]!='\'' &&value[inQuote]!='\"' ){
            console.log(value.substring(0,inQuote)+'\"'+value.substring(inQuote))
            newTestList[index].newTest = type == 'parameter' ?{
              testName: newTestList[index].testName,
              parameter: value.substring(0,inQuote)+'\"'+value.substring(inQuote),
              return: newTestList[index].return,
              visable: false,
            } : {
              testName: newTestList[index].testName,
              parameter: newTestList[index].parameter,
              return: value.substring(0,inQuote)+'\"'+value.substring(inQuote),
              visable: false,
            }
            setTestList(newTestList)
            inQuote=-1
            return newTestList;
          }
          inQuote = -1
        }
        else{
          inQuote=i
        }
      }
      else if(value[i]=='[' || value[i]==']' || value[i]==',' ||value[i]==';'){
        if(inQuote!=-1){
          console.log(value[inQuote]=='\'' ||value[inQuote]=='\"' ? value.substring(0,i)+'\"'+value.substring(i) : value.substring(0,inQuote)+'\"'+value.substring(inQuote,i)+'\"'+value.substring(i))
          //have text with no quote
          newTestList[index].newTest = type == 'parameter' ?{
            testName: newTestList[index].testName,
            parameter: value[inQuote]=='\'' ||value[inQuote]=='\"' ? value.substring(0,i)+'\"'+value.substring(i) : value.substring(0,inQuote)+'\"'+value.substring(inQuote,i)+'\"'+value.substring(i),
            return: newTestList[index].return,
            visable: false,
          } : {
            testName: newTestList[index].testName,
            parameter: newTestList[index].parameter,
            return: value[inQuote]=='\'' ||value[inQuote]=='\"' ? value.substring(0,i)+'\"'+value.substring(i) : value.substring(0,inQuote)+'\"'+value.substring(inQuote,i)+'\"'+value.substring(i),
            visable: false,
          }
          setTestList(newTestList)
          inQuote=-1
          return newTestList;
        }
      }
      else if(inQuote==-1 && !((value[i] >= '0' && value[i] <= '9')||value[i]==' '||value[i]==='-')){
        inQuote = i
      }
    }
    if(inQuote!=-1){
      console.log(value[inQuote]=='\'' ||value[inQuote]=='\"' ? value+'\"' : value.substring(0,inQuote)+'\"'+value.substring(inQuote)+'\"')
      //ends with no quote
      newTestList[index].newTest = type == 'parameter' ?{
        testName: newTestList[index].testName,
        parameter: value[inQuote]=='\'' ||value[inQuote]=='\"' ? value+'\"' : value.substring(0,inQuote)+'\"'+value.substring(inQuote)+'\"',
        return: newTestList[index].return,
        visable: false,
      } : {
        testName: newTestList[index].testName,
        parameter: newTestList[index].parameter,
        return: value[inQuote]=='\'' ||value[inQuote]=='\"' ? value+'\"' : value.substring(0,inQuote)+'\"'+value.substring(inQuote)+'\"',
        visable: false,
      }
      setTestList(newTestList)
      
    }
    return newTestList;
  }
  const handleGenerateTest = async () => {
    if (num < 1 || num % 1 !== 0) {
      showToast('Please enter a positive integer.', 'warning')
      return
    }
    setIsGenerating(true)
    let generateTests = []
    const toastId = toast.info('Generating unit tests...', {
      autoClose: false,
    })
    try {
      generateTests = await generateUnitTests(session.task, num, type)
    } catch (e) {
      showToast('Unit tests generation failed', 'error')
      console.error(e)
      return
    } finally {
      toast.dismiss(toastId)
      setIsGenerating(false)
    }
    let newTestList = [...testList, ...generateTests.unitTests]
    updateTestListInSession(session.id, newTestList)
    showToast('Unit tests generated successfully', 'success')
    if (!alert) {
      setColor('success')
    }
  }

  const handleDeleteTest = (index) => {
    const newTestList = [...testList]
    newTestList.splice(index, 1)
    updateTestListInSession(session.id, newTestList)
    if (!alert) {
      setColor('success')
    }
  }

  const handleEditTest = (index) => {
    const newTestList = [...testList]
    newTestList[index] = newTestList[index].newTest
    setTestList(newTestList)
    updateTestListInSession(session.id, newTestList)
  }

  const handleRemoveSuggestedTest = (index) => {
    let newTestList = [...testList]
    delete newTestList[index].newTest
    newTestList.sort(function (a, b) {
      if (a.newTest == null) {
        if (b.newTest == null) {
          return 0
        } else {
          return 1
        }
      } else if (b.newTest == null) {
        return -1
      }
      return 0
    })
    setTestList(newTestList)
    updateTestListInSession(session.id, newTestList)
  }

  const handleAddTest = (e) => {
    const newTestList = [...testList]
    newTestList.push({
      testName: testName,
      parameter: parameter,
      return: returnValue,
      visable: false,
    })
    updateTestListInSession(session.id, newTestList)
    setTestName('New Test')
    setParameter('')
    setReturnValue('')
    if (!alert) {
      setColor('success')
    }
  }

  function PassIcon({ testResult }) {
    if (testResult == null) {
      return <BlockIcon sx={{ color: '#808080' }} />
    }
    if (testResult) {
      return <DoneIcon sx={{ color: '#4caf50' }} />
    } else {
      return <CloseIcon sx={{ color: '#f44336' }} />
    }
  }

  return (
    <>
      {alert && (
        <Alert severity="error" onClose={() => setAlert(false)}>
          {' '}
          {alertContent}{' '}
        </Alert>
      )}
      {currentUser.role < 3 && Mode == false && (
        <div className="scafold">
          <Typography variant="h6" fontWeight={'light'} gutterBottom>
            Test Cases
          </Typography>
          <div className="test-bar">
            <Typography variant="body1" fontWeight={'light'} gutterBottom>
              Setting
            </Typography>
            <Button
              className="btn"
              variant="outlined"
              onClick={handleGenerateTest}
              disabled={isGenerating}>
              <Typography variant="button">AI Generated Unit Tests</Typography>
            </Button>
            <FormControl variant="outlined" className="form-control">
              <TextField
                className="num-input"
                // id="outlined-number"
                label="Number"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={num}
                onChange={(e) => setNum(e.target.value)}
              />
            </FormControl>

            <FormControl variant="outlined" className="form-control">
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                className="type-select"
                labelId="type-label"
                value={type}
                onChange={(e) => setType(e.target.value)}
                label="Type">
                <MenuItem value={'Edge'}>Edge case</MenuItem>
                <MenuItem value={'Equivalence'}>Equivalence case</MenuItem>
                <MenuItem value={'Both'}>Both</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="add-div" style={{marginTop:".5em"}}>
            <>
              {testList.map((test, index) => (
                <>
                  <div style={{display: 'flex', justifyContent:"space-between",marginBottom:".2em"}}>
                    <div>
                      <div style={{display: 'flex',}}>
                        <Typography fontSize={"+2"} fontWeight={"bold"} sx={{marginRight:".5em",paddingTop:".3em"}}>
                          Test {index}: 
                        </Typography>
                        <TextField
                          className="textField"
                          variant="standard"
                          value={test.testName}
                          size="medium"
                          inputProps={{ style: { fontSize: "14px" } }}
                          onChange={(e) => {
                            const newTestList = [...testList];
                            newTestList[index].testName = e.target.value
                            setTestList(newTestList)
                          }}
                          onBlur={(e) => {
                            updateTestListInSession(session.id, testList);
                          }}
                        ></TextField>
                      </div>
                      <div style={{display: 'flex',}}>
                        <Typography fontSize={"+2"} sx={{marginRight:".5em",paddingTop:".3em"}}>
                          Input:
                        </Typography>
                        <TextField
                          className="textField"
                          variant="standard"
                          value={test.parameter}
                          size="medium"
                          inputProps={{ style: { fontSize: "14px" } }}
                          onChange={(e) => {
                            const newTestList = [...testList];
                            newTestList[index].parameter = e.target.value
                            setTestList(newTestList)
                            if(!alert){
                              setColor("success")
                            }
                          }}
                          onBlur={(e) => {
                            checkString('parameter',index)
                            updateTestListInSession(session.id, testList);
                          }}
                        ></TextField>
                      </div>
                      <div style={{display: 'flex',}}>
                        <Typography fontSize={"+2"} sx={{marginRight:".5em",paddingTop:".3em"}}>
                          Output:
                        </Typography>
                        <TextField
                          className="textField"
                          variant="standard"
                          value={test.return}
                          size="medium"
                          inputProps={{ style: { fontSize: "14px" } }}
                          onChange={(e) => {
                            const newTestList = [...testList];
                            newTestList[index].return = e.target.value
                            setTestList(newTestList)
                            if(!alert){
                              setColor("success")
                            }
                          }}
                          onBlur={(e) => {
                            console.log("hey")
                            checkString('return',index)
                            updateTestListInSession(session.id, testList);
                          }}
                        ></TextField>
                      </div>
                    </div>
                    {testList[index].newTest!=null ? (
                      <div style={{marginLeft:".7em"}}>
                        <div style={{display: 'flex'}}>
                          <Button
                            variant="outlined"
                            startIcon={<ArrowCircleLeftIcon />}
                            style= {{align: "left"}}
                            size="small"
                            onClick={(e) => {
                              handleEditTest(index);
                            }}
                          >
                            Replace
                          </Button>
                          <IconButton
                            variant="outlined"
                            style= {{align: "right"}}
                            color="error"
                            size="small"
                            onClick={(e) => {
                              handleRemoveSuggestedTest(index);
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                          
                        </div>
                        <div style={{display: 'flex',}}>
                          <Typography fontSize={"+2"} sx={{marginRight:".5em",paddingTop:".3em"}}>
                            Input: {test.newTest.parameter}
                          </Typography>
                          
                        </div>
                        <div style={{display: 'flex',}}>
                          <Typography fontSize={"+2"} sx={{marginRight:".5em",paddingTop:".3em"}}>
                            Output: {test.newTest.return}
                          </Typography>
                          
                        </div>
                      </div>
                    ) : null}
                    
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={(e) => {
                        handleDeleteTest(index);
                      }}
                    >
                      Delete
                    </Button>
                    
                  </div>
                  <Divider flexItem sx={{ bgcolor: "Light gray",marginBottom:".2em" }} />
                </>
              ))}
              <div style={{display: 'flex', justifyContent:"space-between"}}>
                <div>
                  <div style={{display: 'flex',}}>
                    <Typography fontSize={"+2"} fontWeight={"bold"} sx={{marginRight:".5em",paddingTop:".3em"}}>
                      Test {testList.length+1}: 
                    </Typography>
                    <TextField
                      className="textField"
                      variant="standard"
                      value={testName}
                      size="medium"
                      inputProps={{ style: { fontSize: "14px" } }}
                      onChange={(e) => {
                        setTestName(e.target.value);
                      }}
                    ></TextField>
                  </div>
                  <div style={{display: 'flex',}}>
                    <Typography fontSize={"+2"} sx={{marginRight:".5em",paddingTop:".3em"}}>
                      Input:
                    </Typography>
                    <TextField
                      className="textField"
                      variant="standard"
                      size="medium"
                      inputProps={{ style: { fontSize: "14px" } }}
                      value={parameter}
                      onChange={(e) => {
                        setParameter(e.target.value);
                      }}
                    ></TextField>
                  </div>
                  <div style={{display: 'flex',}}>
                    <Typography fontSize={"+2"} sx={{marginRight:".5em",paddingTop:".3em"}}>
                      Output:
                    </Typography>
                    <TextField
                      className="textField"
                      variant="standard"
                      size="medium"
                      inputProps={{ style: { fontSize: "14px" } }}
                      value={returnValue}
                      onChange={(e) => {
                        setReturnValue(e.target.value);
                      }}
                    ></TextField>
                  </div>
                </div>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    handleAddTest();
                  }}
                ></Button>
                
              </div>
              
            </>
          </div>
          <div className="test-bar">
            <LoadingButton
              loadingPosition="start"
              className="btn"
              variant="outlined"
              color={color}
              onClick={handleGenerateCode}
              startIcon={<AssistantIcon />}
              loading={loading}>
              <Typography variant="button">Create Unit Tests</Typography>
            </LoadingButton>
          </div>
        </div>
      )}
      {currentUser.role == 3 ||
        (currentUser.role < 3 && Mode == true && (
          <div className="scafold">
            <Typography variant="h6" fontWeight={'light'} gutterBottom>
              Test Cases
            </Typography>
            <div className="add-div">
              <>
                <TableContainer>
                  <Table className="testTable">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography fontSize={'+2'} fontWeight={'bold'}>
                            Name
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontSize={'+2'} fontWeight={'bold'}>
                            Result
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {testList.map((test, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography fontSize={'+1'}>
                              {test.testName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <PassIcon testResult={updatedTestResult[index]} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            </div>
          </div>
        ))}
      {currentUser.role == 3 && (
        <div className="scafold">
          <Typography variant="h6" fontWeight={'light'} gutterBottom>
            Test Cases
          </Typography>
          <div className="add-div">
            <>
              <TableContainer>
                <Table className="testTable">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography fontSize={'+2'} fontWeight={'bold'}>
                          Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={'+2'} fontWeight={'bold'}>
                          Result
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {testList.map((test, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography fontSize={'+1'}>
                            {test.testName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <PassIcon testResult={updatedTestResult[index]} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          </div>
        </div>
      )}
    </>
  )
}

export default TestList
