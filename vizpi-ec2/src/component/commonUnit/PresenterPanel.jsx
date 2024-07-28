import React, { useContext, useEffect, useState } from 'react'
import { cn } from '../../pages/SampleSplitter'
import { useResizable } from 'react-resizable-layout'
import SampleSplitter from '../../pages/SampleSplitter'
import { ModeContext } from '../../context/ModeContext'
import { SubmissionsProvider } from "../../context/SubmissionsContext"
import Code from '../code/Code'
import style from '../../css/codeIssuePanel.scss'
import TestList from '../topBar/TestList'
import PresenterList from './PresenterList'
import { Height } from '@mui/icons-material'
import {
  generateUserInSession,
  groupingInSession,
  removeGroupingInSession,
  setSessionEnableChat,
  setSessionEnableChatAndCloseSession,
} from '../../service/sessionService'
import { showToast } from '../commonUnit/Toast'
import { SessionContext } from '../../context/SessionContext'
import { Switch, FormControlLabel,Tooltip,Typography } from '@mui/material'
const PresenterPanel = () => {
  const { setMode } = useContext(ModeContext)
  const [chatEnable, setChatEnable] = useState(false)
  const { session } = useContext(SessionContext)



  useEffect(() => {
    setMode(true)
  }, [])

  useEffect(() => {
    setChatEnable(session.enable_chat)
  }, [session.enable_chat])

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

  const handleChatEnableChange = async () => {
    try {
      let currentChatEnableStatus;
      if (!chatEnable) {
        currentChatEnableStatus = await setSessionEnableChat(
          session?.id,
          !chatEnable
        );
      } else {
        currentChatEnableStatus = await setSessionEnableChatAndCloseSession(
          session?.id,
          !chatEnable,
          "closed with AI chat disabled"
        );
      }
      setChatEnable(!!currentChatEnableStatus);
    } catch (error) {
      console.error('Error changing chat enable status: ', error);
    }
  };
  

  if(!session) return null

  return (
    <div
      className={
        'div-height flex flex-column h-screen bg-dark font-mono color-white max-screen-width'
      }>
      <div className={'flex grow'}>
        <div
          className={cn('shrink-0 contents', isFileDragging && 'dragging')}
          style={{ width: fileW }}>
          <TestList />
        </div>
        <SampleSplitter isDragging={isFileDragging} {...fileDragBarProps} />
        <div className={'flex grow '}>
        <div className={'grow contents-code'} style={{ height: '100vh' }}>
        {session?.type === "Vizmental" && (
          <Tooltip title={<Typography variant="subtitle1">Disabling AI chat will mark the end of the session</Typography>}>
            <FormControlLabel
              value="top"
              label="AI Chat"
              labelPlacement="start"
              control={
                <Switch
                  className="switch"
                  checked={chatEnable}
                  onChange={handleChatEnableChange}
                  color="primary"
                />
              }
            />
          </Tooltip>
        )}
        <SubmissionsProvider>
              <Code />
            </SubmissionsProvider>
          </div>
          <SampleSplitter
            isDragging={isPluginDragging}
            {...pluginDragBarProps}
          />
          <div
            className={cn('shrink-0 contents', isPluginDragging && 'dragging')}
            style={{ width: pluginW }}>
            <PresenterList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PresenterPanel
