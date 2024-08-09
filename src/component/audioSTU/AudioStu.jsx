import React, { useState, useContext, useEffect } from 'react'
import { cn } from '../../pages/SampleSplitter'
import { useResizable } from 'react-resizable-layout'
import SampleSplitter from '../../pages/SampleSplitter'
import '../../css/codeIssuePanel.scss'
import { SessionContext } from '../../context/SessionContext'
import Snackbar from '@mui/material/Snackbar'
import { Alert } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Loading from '../commonUnit/Loading'
import AudioChat from '../chat/AudioChat'
import { SelectedGroupContext } from '../../context/SelectedGroupContext'
import GroupInputComponent from './AudioGroupInput'
import AudioTaskCard from './AudioTaskCard'

const AudioStu = () => {
  const { session } = useContext(SessionContext)
  const { selectedGroup } = useContext(SelectedGroupContext)

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
  })

  const [everOpen, setEverOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [quizEnable, setQuizEnable] = useState(false)

  useEffect(() => {
    if (!session) return
    if (session?.grouped && !everOpen) {
      setOpen(true)
      setEverOpen(true)
    }
  }, [session, everOpen])

  useEffect(() => {
    if (!session) return
    const enableQuiz = async () => {
      setQuizEnable(session?.enable_quiz)
    }
    enableQuiz()
  }, [session])

  if (!session) return <Loading />

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
      <div className={'flex grow'}>
        <div
          className={cn('shrink-0 contents', isFileDragging && 'dragging')}
          style={{ width: fileW }}>
          <AudioTaskCard />
        </div>
        <SampleSplitter isDragging={isFileDragging} {...fileDragBarProps} />
        <div className={'flex grow'}>
          <div className={'grow bg-darker contents-chat'}>
            <>{selectedGroup ? <AudioChat /> : <GroupInputComponent />}</>
          </div>
          <SampleSplitter
            isDragging={isPluginDragging}
            {...pluginDragBarProps}
          />
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        onClose={handleClose}>
        <Alert severity="info" style={{ fontSize: '2ß0px' }}>
          You are now in a group. Please discuss with your group members
          regarding issues you have during the Individual Attempt.
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Alert>
      </Snackbar>
    </div>
  )
}
export default AudioStu
