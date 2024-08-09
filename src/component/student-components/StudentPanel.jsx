import React, { useState, useContext, useEffect } from 'react'
import CodeStu from '../code/CodeStu'
import { cn } from '../../pages/SampleSplitter'
import { useResizable } from 'react-resizable-layout'
import SampleSplitter from '../../pages/SampleSplitter'
import '../../css/codeIssuePanel.scss'
import TaskCard from '../topBar/TaskCard'
import Chat from '../chat/Chat'
import { SessionContext } from '../../context/SessionContext'
import TestList from '../topBar/TestList'
import PeerInstruction from './PeerInstruction'
import GroupPassRate from '../topBar/GroupPassRate'
import { SubmissionsProvider } from '../../context/SubmissionsContext'
import DescriptionQuizModal from './DescriptionQuizModal'
import Snackbar from '@mui/material/Snackbar'
import { Alert } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import ReviewWindow from './ReviewWindow'
import Loading from '../commonUnit/Loading'
import { SelectedGroupContext } from '../../context/SelectedGroupContext'
import { addToGroup } from '../../service/sessionService'
import { AuthContext } from '../../context/AuthContext'
import { getGroupById } from '../../service/groupService'
import AIChat from '../chat/AIChat'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'
import {
  getGroupByUser,
} from '../../service/groupService'


const StudentPanel = () => {
  const { session } = useContext(SessionContext)
  const { selectedGroup, setSelectedGroup} = useContext(SelectedGroupContext)
  const { rerender, setRerender } = useContext(SelectedCodeContext)
  const { currentUser } = useContext(AuthContext)

  const resizeEnd = () => {
    setRerender(Date.now())
  }

  const {
    isDragging: isFileDragging,
    position: fileW,
    separatorProps: fileDragBarProps,
  } = useResizable({
    axis: 'x',
    initial: 500,
    min: 0,
  })
  const {
    isDragging: isPluginDragging,
    position: pluginW,
    separatorProps: pluginDragBarProps,
  } = useResizable({
    axis: 'x',
    initial: 500,
    min: 0,
    reverse: true,
    onResizeEnd:resizeEnd,
  })
  
  

  const [everOpen, setEverOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [quizEnable, setQuizEnable] = useState(false);

  useEffect(() => {
    console.log(selectedGroup)
    console.log(session)
    if (!session) return
    if (session?.grouped && !everOpen) {
      setOpen(true)
      setEverOpen(true)
      if(selectedGroup==null&&currentUser.group_id==null){
        getGroupByUser(currentUser.id,session.id).then((group)=>{
          console.log(group)
          if(group){
            setSelectedGroup(group)
          }
          else{
            addToGroup(session,currentUser.id).then((res)=>{
              getGroupById(res).then((group)=>{
                console.log(group)
                setSelectedGroup(group)
              })
            })
          }
        })
        
      }
    }
  }, [session, everOpen])

  useEffect(() => {
    if (!session) return
    const enableQuiz = async() => { 
      setQuizEnable(session?.enable_quiz)
    }
    enableQuiz()
  }, [session])
  
 
  if (!session ) return <Loading />


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  return (
    <div
      className={
        'div-height flex flex-column h-screen bg-dark font-mono color-white max-screen-width'
      }>
      {session?.grouped && !session.enable_chat && <ReviewWindow />}
      {quizEnable && <DescriptionQuizModal/>}
      <PeerInstruction />
      <div className={'flex grow'}>
        <div
          className={cn('shrink-0 contents', isFileDragging && 'dragging')}
          style={{ width: fileW }}>
          <TaskCard />
          <TestList />
        </div>
        <SampleSplitter isDragging={isFileDragging} {...fileDragBarProps} />
        {session.type === 'Vizmental' ? (<div className = {'flex grow'}>
        <div className={'grow contents'}>
          <CodeStu />
          </div>
          <SampleSplitter
            isDragging={isPluginDragging}
            {...pluginDragBarProps}
          />
          <div
            className={cn('shrink-0 bg-darker contents-chat', isPluginDragging && 'dragging')}
            style={{ width: pluginW }}>            
            <>
              <SubmissionsProvider>
                {session.grouped && <GroupPassRate />}
              </SubmissionsProvider>
              <AIChat />
            </>
          </div>
        </div>) : (
        <div className={'flex grow'}>
          <div className={'grow bg-darker contents-chat'}>
            <>
              <SubmissionsProvider>
                {session.grouped && <GroupPassRate />}
              </SubmissionsProvider>
              <Chat />
            </>
          </div>
          <SampleSplitter
            isDragging={isPluginDragging}
            {...pluginDragBarProps}
          />
          <div
            className={cn('shrink-0 contents', isPluginDragging && 'dragging')}
            style={{ width: pluginW }}>
            <CodeStu />
          </div>
        </div>)
        }
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        onClose={handleClose}>
        <Alert severity="info" style={{ fontSize: '2ß0px' }}>
          You are now in a group. Please discuss with your group members
          regarding issues you have during the Individual Attempt.
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        </Alert>
      </Snackbar>
    </div>
  )
}
export default StudentPanel
