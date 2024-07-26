import React, { useContext, useEffect, useState } from 'react'
import {
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ButtonGroup,
  Grid,
  Chip,
  Box,
  Menu,
  ClickAwayListener
} from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

import { getDateString, getTimeString } from '../../tool/Tools'
import { setSessionInUser, setSessionInStudent } from '../../service/userService'
import { AuthContext } from '../../context/AuthContext'
import { SessionContext } from '../../context/SessionContext'
import {
  addSession,
  deleteSession,
  getSessionsByIds,
  getSessionById,
  duplicateSession,
} from '../../service/sessionService'
import AddSessionDialog from './AddSessionDialog'
import DuplicateSessionDialog from './DuplicateSessionDialog'
import { showToast } from '../commonUnit/Toast'
import { ContentCopy, Delete, Link} from '@mui/icons-material'
import { ToastContainer } from 'react-toastify'
import {
  updateTestCodeInSession,
  updateTestListInSession,
} from '../../service/testService'
import styles from '../../css/sessiontable.scss'


import {FilterButtons} from './FilterButtons'
import { updateUser } from "../../service/userService"

const SessionTable = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext)
  const { setSession } = useContext(SessionContext)
  const [sessions, setSessions] = useState([])
  const [open, setOpen] = useState(false)
  const [openDup, setOpenDup] = useState(false)
  const [currSession, setCurrentSession] = useState({})
  const [sort, setSort] = useState('Time')
  const [ascending, setAscending] = useState(false)
  const [sortChange, setSortChange] = useState(false)
  const [filter, setFilter] = useState('Any')

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.session_list) {
        let sessions = await getSessionsByIds(currentUser.session_list)
        sessions = sessions.filter((session) => session !== null)
        setSessions(sessions)
      }
    }

    fetchData().then(setSortChange(!sortChange))
  }, [currentUser])

  useEffect(() => {
    let newSessions = [...sessions];
    newSessions.sort((a, b) => {
      if (sort === 'Time') {
        return (new Date(a.created_time) - new Date(b.created_time)) * (ascending ? -1 : 1);
      } else if (sort === 'Students') {
        return (
          ((a.stu_num ? a.stu_num : 0) - (b.stu_num ? b.stu_num : 0)) *
          (ascending ? -1 : 1)
        );
      }
      // else if (sort === 'Passrate') {
      //   return (
      //     ((a.avgPass ? a.avgPass : 0) - (b.avgPass ? b.avgPass : 0)) *
      //     (ascending ? -1 : 1)
      //   );
      // }
      else {
        return 0;
      }
    });
    setSessions(newSessions);
  }, [sort, ascending, sortChange]);

  const handleDeleteSession = async (index, session) => {
    if (window.confirm('Are you sure?')) {
      let updatedSessions = [...sessions]
      updatedSessions.splice(index, 1)
      const res = await deleteSession(
        currentUser.id,
        session.id,
        updatedSessions.map((s) => s.id)
      )
      if (res) {
        setSessions(updatedSessions)
        showToast('Delete session successfully!', 'success', 2000)
      } else {
        showToast('Delete session failed!', 'error', 2000)
      }
    }
  }

  const delay = (ms) => new Promise((res) => setTimeout(res, ms))

  const handleDuplicateSession = (newSession, oldSession) => {
    duplicateSession(oldSession.id, newSession.subject).then(async (res) => {
      if (res) {
        let newSess = res
        newSess.highlight = true
        setSessions([...sessions, newSess])
        window.scrollTo(0, 0)
        await delay(2000)
        delete newSess.highlight
        setSessions([...sessions, newSess])
      } else {
        showToast('Add session failed!', 'error', 2000)
      }
    })
    setOpenDup(false)
  }
  
  const handleAddSession = async (newSession) => {
    if (
      !newSession.crn ||
      newSession.crn === '' ||
      !newSession.task ||
      newSession.task === '' ||
      !newSession.subject ||
      newSession.subject === ''
    ) {
      showToast('Please fill in all fields!', 'error', 2000)
      return
    }
    addSession(
      newSession.crn,
      newSession.task,
      newSession.subject,
      newSession.type,
      currentUser.id
    ).then(async (res) => {
      if (res) {
        let newSess = res
        newSess.highlight = true
        setSessions([...sessions, newSess])
        window.scrollTo(0, 0)
        // const currentUrl = window.location.href
        // navigator.clipboard.writeText(currentUrl + 'session/' + res.session.id)
        // window.location.reload()
        await delay(2000)
        delete newSess.highlight
        setSessions([...sessions, newSess])
      } else {
        showToast('Add session failed!', 'error', 2000)
      }
    })
    setOpen(false)
  }

  const handleJoinSession = (session) => {
    if(currentUser.role<3){
      setSessionInUser(currentUser.id, session.id).then((res) => {
        if (res) {
          setSession(session)
          
          window.location.href = '/'
        } else {
          showToast('Join session failed!', 'error', 2000)
        }
      })
    }
    else{
      setSessionInStudent(currentUser.id, session.id).then((res) => {
        if (res) {
          currentUser.group_id = null
          currentUser.code_id = null
          currentUser.session_id = session.id
          
          updateUser(currentUser).then((newUser)=>{
            console.log(newUser)
            setCurrentUser(newUser)
            setSession(session)
            window.location.href = '/session/' + session.id
          })
        } else {
          showToast('Join session failed!', 'error', 2000)
        }
      })
    }
    
  }

  const handleCopyLink = (session) => {
    const currentUrl = window.location.href
    navigator.clipboard.writeText(currentUrl + 'session/' + session.id)
    showToast('Link copied to clipboard!', 'success', 2000)
  }

  const handleSortChange = (e) => {
    setSort(e.target.value)
  }

  const isFilter = (session, filter) => {
    if (
      filter !== 'Any' &&
      ((session.language ? session.language : 'Python') !== filter) &&
      ((session.type ? session.type : 'Not Specified') !== filter)
    ) {
      return false;
    }
    return true;
  }
  

  if (!sessions) return null
  return (
    <>
      <ToastContainer />
      {currentUser.role <= 1 && (
        <div
          className="flex-container"
          style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', marginBottom: '20px'}}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2, borderRadius: '5px'}}
            onClick={() => setOpen(true)}>
            Add Session
          </Button>
          <AddSessionDialog
            open={open}
            setOpen={setOpen}
            handleAddSession={handleAddSession}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <FilterButtons 
              filter={filter} 
              setFilter={setFilter} 
              sort={sort} 
              ascending ={ascending} 
              setAscending ={setAscending} 
              handleSortChange = {handleSortChange}/>
          </div>
        </div>
      )}
      <TableContainer>
        <Table >
          <TableBody >
            {sessions.toReversed().map((session, index) => (
              <>
                {isFilter(session, filter) && (
                  <TableRow
                    key={sessions.length - index - 1}
                    style={
                      session.highlight != null
                        ? { background: '#99d6a3', border: 'none' }
                        : { background: '#FFFFFF', border: 'none' }
                    }>
                    <TableCell sx={{textAlign:'right', width: '120px' ,border:'none'}}>
                      <div style ={{paddingTop:'10px'}}>
                    {session.stu_num ? session.stu_num : 0} students
                    </div>
                    <div class='text-grey'>
                    {Math.round(session.avgPass ? session.avgPass : 0)}% passrate
                    </div>
                    <div style = {{fontWeight:"500"}}>
                    {session.type === 'Vizmental' && (<div style={{color: "#543ecd"}}>{session.type}</div>)}
                    {session.type === 'Auto Grouping' && (<div style={{color: "#2da356"}}>{session.type} </div>)}
                    {session.type === 'Audio' && (<div style={{color: "#e69617"}}>{session.type}</div>)}
                    {session.type === 'Peer Instruction' && (<div style={{color: "#59b1d5"}}>{session.type}</div>)}
                    {session.type === 'Helper/Helpee' && (<div style={{color: "#59b1d5"}}>{session.type}</div>)}
                    {(session.type === 'Blockly' || session.type === 'Blockly Shared' ) && (<div style={{color: "#C35151"}}>{session.type}</div>)}
                    </div>
                    <br />
                    </TableCell>
                    
                    <TableCell className='no-right-border' sx={{ border: 'none', borderRight: 'none' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Grid container spacing={2} direction="row">
                            <Grid item xs={10}>
                              <div className='subject' onClick={() => handleJoinSession(session)}>
                                {session.subject}
                              </div>
                              <br />
                              {session.task.split(" ").length > 30
                                ? session.task.split(" ", 30).join(" ") + "..."
                                : session.task}
                              <br />
                            </Grid>
                            <Grid item xs={2} sx={{ textAlign: 'right'}}>
                              <Tooltip title="Copy Link">
                                <IconButton
                                  color="primary"
                                  onClick={() => handleCopyLink(session)}>
                                  <Link />
                                </IconButton>
                              </Tooltip>
                              
                              {currentUser.role < 2 && (
                                <>
                                  <Tooltip title="Duplicate Session">
                                    <IconButton
                                      color="success"
                                      onClick={() => {
                                        setCurrentSession(session)
                                        setOpenDup(true)
                                      }}>
                                      <ContentCopy />
                                    </IconButton>
                                  </Tooltip>
                                  <DuplicateSessionDialog
                                    open={openDup}
                                    setOpen={setOpenDup}
                                    currSession={currSession}
                                    handleDuplicateSession={handleDuplicateSession}
                                    session={session}
                                  />
                                  <Tooltip title="Delete Session">
                                    <IconButton
                                      color="error"
                                      onClick={() => handleDeleteSession(
                                        sessions.length - index - 1,
                                        session
                                      )}>
                                      <Delete />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                            </Grid>
                          </Grid>
                          <Grid container>
                            <Grid item xs={6}>
                              <div style={{ marginTop: '8px' }}>
                                <Chip
                                  label={session.language || 'Python'}
                                  size="small"
                                  color="info"
                                />
                              </div>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right', mt: 2, color: "#777777" }}>
                              Created on {getTimeString(session.created_time)}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default SessionTable