import React, { useEffect, useContext } from 'react'
import SampleSplitter, { cn } from '../../pages/SampleSplitter'
import { useResizable } from 'react-resizable-layout'
import '../../css/codeIssuePanel.scss'
import { ModeContext } from '../../context/ModeContext'
import AudioSettingPanel from './AudioSettingPanel'
import AudioTaskCard from './AudioTaskCard'

const AudioTask = () => {
  const { setMode } = useContext(ModeContext)
  useEffect(() => {
    setMode(false)
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
        'flex flex-column h-screen bg-dark font-mono color-white overflow-hidden max-screen-width'
      }>
      <div className={'flex grow'}>
        <div
          className={cn('shrink-0 contents', isFileDragging && 'dragging')}
          style={{ width: fileW }}>
          <AudioTaskCard />
        </div>
        <SampleSplitter isDragging={isFileDragging} {...fileDragBarProps} />
        <AudioSettingPanel />
      </div>
    </div>
  )
}

export default AudioTask
