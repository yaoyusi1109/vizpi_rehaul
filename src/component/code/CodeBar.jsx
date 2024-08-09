import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'
import{ Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button}  from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart';
import { getCodeById } from '../../service/codeService'
import { 
  updateIdentityListInSession,
  groupManual,
 } from '../../service/sessionService'
 import { 
  getGroupsBySession,
 } from '../../service/groupService'
 import { 
  getMessagesBySession,
 } from '../../service/chatService'
 import {
  getUserSubmissions,
  getSessionSubmissions
 } from '../../service/submissionService'
 import { extractErrorInfo } from '../../service/errorService'
import {getAvgAttempts, getLeaderboard} from "../../tool/progressUnit"
import { classifyUser } from "../../tool/classifyUser"
import { SessionContext } from '../../context/SessionContext'
import { showToast } from '../commonUnit/Toast'
import { SelectedGroupContext } from '../../context/SelectedGroupContext'
import {getUserById} from '../../service/userService'

//Passing runCode function down to CodeBar component. runCode function is defined in Code.jsx
const CodeBar = ({ latestCodeId, runCode, isRunning }) => {
  const { selectedCode, setSelectedCode } = useContext(SelectedCodeContext)
  const { currentUser } = useContext(AuthContext)
  const { session } = useContext(SessionContext)
  const { waiting, setWaiting } = useContext(SelectedGroupContext)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(false)
  const [attempts, setAttempts] = useState([])
  const [errors, setErrors] = useState([])
  const [avgPass, setAvgPass] = useState(0)
  const [helped, setHelped] = useState(0)
  const [place, setPlace] = useState(-1)
  const [userType, setUserType] = useState("")
  const [myMessages, setMyMessages]=useState([])
  const [avgClassAttempts, setAvgClassAttempts] = useState(0)
  const handleLatestCode = async () => {
    getUserById(currentUser.id).then((updatedSelf) =>{
      console.log(updatedSelf)
      if(updatedSelf.code_id){
        getCodeById(updatedSelf.code_id).then((code) => {
          console.log(code)
          if (code !== null) setSelectedCode(code)
          else
            setSelectedCode({
              content: session?.test_code?.template,
              passrate: 0,
            })
          //console.log(code)
        })
      }
      else{
        getUserSubmissions(session.id,currentUser.id).then((codes) => {
          console.log(codes)
          codes.sort(function(x, y){
            return new Date(x.created_time) - new Date(y.created_time);
          })
          if (codes?.length>0&&codes[0] !== null){
            getCodeById(codes[0].code_id).then((code) => {
              console.log(code)
              if (code !== null) setSelectedCode(code)
              else
                setSelectedCode({
                  content: session?.test_code?.template,
                  passrate: 0,
                })
              //console.log(code)
            })
          }
          else
            setSelectedCode({
              content: session?.test_code?.template,
              passrate: 0,
            })
          //console.log(code)
        })
      }
      
    })
    showToast('Code updated', 'success')
  }

  const resetCode = () => {
    setSelectedCode({
      content: session.test_code.template,
      passrate: 0,
    })
    showToast('Code reset', 'success')
  }

  const clickCode = (event,params) => {
    //console.log(params)
    getCodeById(attempts[params.dataIndex].code_id).then((newCode) => {
      //console.log(newCode)
      setSelectedCode(newCode)
    })
  }
  function compare( a, b ) {
		if ( a.count < b.count ){
		  return 1;
		}
		if ( a.count > b.count ){
		  return -1;
		}
		return 0;
	}
		

  const stats = () => {
    getUserSubmissions(session.id,selectedCode.creater_id).then((submissions) =>{
      getAvgAttempts(session.id,session.test_list.length).then((num)=>{
        setAvgClassAttempts(num)
      })
      getSessionSubmissions(session.id).then((allSubs)=>{
        var obj = {};
        for (var i=0; i < allSubs.length; i++) {
          if(allSubs[i].error!==null){
            let error = extractErrorInfo(allSubs[i].error)
            obj[error.errorType] = (obj[error.errorType] || 0) +1 ;
          }
        }
        setErrors(Array.from(Object.entries(obj)))
      })

      
      //console.log(submissions)
      submissions.sort(function(x, y){
        return new Date(x.created_time) - new Date(y.created_time);
      })
      setAttempts(submissions)

      const passSubmissions = submissions.map(submission => submission.result_list)
      passSubmissions.filter(pass => pass !== null)
      //console.log(passSubmissions)
      let count = 0
      passSubmissions.forEach(pass => {
        if (!pass) return
        pass.forEach(p => {
          if (p) count++
        })
      })

      setAvgPass(Math.round(count * 100 / (submissions.length * session.test_list.length)))



      getGroupsBySession(session.id).then(groups => {
        getLeaderboard(session,groups).then(leaderboardDict => {
          //console.log(leaderboardDict)
          let leaderboard = Object.values(leaderboardDict).sort(compare)
          let rank = leaderboard.findIndex(
            (element) => element.user.id === selectedCode.creater_id
          )
          setPlace(rank+1)
          //console.log(leaderboard)
          setHelped(leaderboard[rank]?.count)
        })
        
      })
      getMessagesBySession(session.id).then(messages =>{
        //console.log(messages)
        let mine = messages.filter((message) => message.sender_id == selectedCode.creater_id);
        mine.sort(function(x, y){
          return new Date(x.created_time) - new Date(y.created_time);
        })
        //console.log(mine)
        setMyMessages(mine)
        classifyUser(mine).then(userClass=>{
          //console.log(userClass)
          if(userClass !="Helpful"&&userClass !="Silent"&&userClass !="Inquisitive"){
            setUserType("Unique")
          }
          else{
            setUserType(userClass)
          }
        })
      })


      setOpen(true)
    })
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseView = () => {
    setView(false)
  }
  const seeMessages = () => {
    
    setOpen(false)
    setView(true)
  }

  const addToHelpers = () => {
    const helpee = session?.identity_list?.findIndex(
      (element) => element.type === "helpee"
    )
    if(helpee === undefined){
      let newIdentityList = [{id:currentUser.id,type:"helper"}]
      updateIdentityListInSession(session.id,newIdentityList)
      return;
    }
    let newIdentityList = [...session.identity_list]
    if(helpee === -1){
      newIdentityList.push({id:currentUser.id,type:"helper"})
      updateIdentityListInSession(session.id,newIdentityList).then(() => setWaiting(true))
    }
    else{
      groupManual(session,[currentUser.id,session.identity_list[helpee].id],"Help "+currentUser.id+" and "+session.identity_list[helpee].id).then(() => {
        setWaiting(true)
        newIdentityList.splice(helpee,1)
        updateIdentityListInSession(session.id,newIdentityList)
      })
      
    }
    
  }
  const addToHelpees = () => {
    const helper = session?.identity_list?.findIndex(
      (element) => element.type === "helper"
    )
    if(helper === undefined){
      let newIdentityList = [{id:currentUser.id,type:"helpee"}]
      updateIdentityListInSession(session.id,newIdentityList)
      return;
    }
    let newIdentityList = [...session?.identity_list]
    if(helper === -1){
      newIdentityList.push({id:currentUser.id,type:"helpee"})
      updateIdentityListInSession(session.id,newIdentityList).then(() => setWaiting(true))
    }
    else{
      groupManual(session,[session.identity_list[helper].id,currentUser.id],"Help "+session.identity_list[helper].id+" and "+currentUser.id).then(() => {
        setWaiting(true)
        newIdentityList.splice(helper,1)
        updateIdentityListInSession(session.id,newIdentityList)
      })
    }
  }
  //console.log(selectedCode)

  return (
    <div className="codeBar">
      <div className="codeBar">
      <div>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{'Your Stats'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <pre>Attempts: {attempts?.length}</pre>
                <pre>Errors: {attempts?.filter((element) => element?.error !== null)?.length}</pre>
                <pre>Avg Passrate: {avgPass}%</pre>
                <LineChart
                xAxis={[
                  {
                    id: 'Time',
                    data: attempts.map((attempt) => new Date(attempt.created_time)),
                    scaleType: 'time',
                    valueFormatter: (date) => date.toLocaleTimeString(),
                  },
                ]}
                series={[
                  {
                    id: 'Passrate',
                    label: 'Passrate',
                    data: attempts.map((attempt) => Math.round(attempt?.result_list?.filter(Boolean).length * 100 / ( session.test_list.length))),
                    stack: 'total',
                    area: false,
                    valueFormatter: (v, { dataIndex }) => {
                      return (

                        <div>
                          <pre>Passrate: {v}</pre>
                          {attempts[dataIndex]?.result_list?.filter((value)=>!value).length>0  && (
                            <pre>Failed Tests:</pre>
                          )}
                          {attempts[dataIndex]?.result_list?.flatMap((bool, index) => !bool ? index : []).map((val) =>(
                            <pre>{session.test_list[val].testName}</pre>
                          ))}
                          {attempts[dataIndex]?.error!==null  && (
                            <pre>Error: {extractErrorInfo(attempts[dataIndex]?.error)?.errorContent}</pre>
                          )}
                          
                        
                        </div>
                      )
                    },

                  }
                ]}
                width={525}
                height={350}
                onMarkClick={clickCode}
                />
                {session.type =="Helper/Helpee" ? (
                  <>
                  
                    <pre>#{place} Helper</pre>
                    <pre>Helped {helped} students</pre>
                    <pre> </pre>
                  </>
                  
                ) : null}

                <pre>You are {userType}</pre>
                <pre>Sent {myMessages.length} Messages</pre>
                <pre> </pre>

                <pre>Class Average Attempts: {avgClassAttempts}</pre>
                {errors.map((error) => (
                  <pre>-{error[0]} {error[1]}</pre>
                ))}
              </DialogContentText>
            
            </DialogContent>
            <div style={{display:"flex", justifyContent:"right"}}>
            {currentUser.role < 3 || currentUser.id == selectedCode?.creater_id ? (
              <>
                <DialogActions>
                  <Button onClick={seeMessages}>Messages</Button>
                </DialogActions>
              </>
            ) : null}
              
              <DialogActions>
                <Button onClick={handleClose}>Close</Button>
              </DialogActions>
            </div>
            
          </Dialog>
          <Dialog
            open={view}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{'Your Stats'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <pre>Messages</pre>
                <pre> </pre>
                {myMessages.map((message, index) => (
                  <pre>{message.content}</pre>
                ))}
                
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseView}>Close</Button>
            </DialogActions>
          </Dialog>
        </div>
        {currentUser.role === 3 ? (
          <>
          
            
            <button className="codeButton" onClick={runCode} disabled={isRunning}>
              Run
            </button>
            <button className="codeButton" onClick={resetCode}>
              Reset Code
            </button>
            {selectedCode?.passrate==100||(selectedCode?.creater_id!=currentUser.id&&selectedCode?.creater_id!=undefined) ? (
              <>
                <button className="codeButton" onClick={stats} disabled={isRunning}>
                  Get Stats
                </button>
              </>
            ) : null}
          </>
        ) : null}

        {currentUser.role === 3 && latestCodeId !== selectedCode?.id ? (
          <>
            <button className="codeButton" onClick={handleLatestCode}>
              Latest code
            </button>
          </>
        ) : null}
        {currentUser.role < 3 && selectedCode?.creater_id!=undefined ? (
          <>
            <button className="codeButton" onClick={stats} disabled={isRunning}>
                  Get Stats
            </button>
          </>
        ) : null}
      </div>
      {currentUser.role === 3 && session.type==="Helper/Helpee" && !waiting  ? (
        <div>
          <button className="codeButton" onClick={selectedCode?.passrate==100?addToHelpers:addToHelpees} disabled={isRunning}>
            {selectedCode?.passrate==100?"Offer Help to Others":"Ask for help"}
          </button>
        </div>
        
      ):null}
      
      
    </div>
    
  )
}

export default CodeBar
