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
const PresenterPanel = () => {
  const { setMode } = useContext(ModeContext)
  useEffect(() => {
    setMode(true)
  }, [])

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
