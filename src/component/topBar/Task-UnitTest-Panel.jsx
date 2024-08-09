import React, { useEffect, useContext } from 'react'
import { cn } from '../../pages/SampleSplitter'
import { useResizable } from 'react-resizable-layout'
import SampleSplitter from '../../pages/SampleSplitter'
import '../../css/codeIssuePanel.scss'
import TaskCard from './TaskCard'
import TestList from './TestList'
import StarterCode from './StarterCode'
import { ModeContext } from '../../context/ModeContext'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'

const TaskPanel = () => {
  const { setMode } = useContext(ModeContext)
  const { rerender,setRerender } = useContext(SelectedCodeContext)
  useEffect(() => {
    setMode(false)
  }, [])

  const resizeEnd = () => {
    setRerender({date:Date.now(),width:rerender.width})
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

  return (
    <div
      className={
        'flex flex-column h-screen bg-dark font-mono color-white overflow-hidden max-screen-width'
      }>
      <div className={'flex grow'}>
        <div
          className={cn('shrink-0 contents', isFileDragging && 'dragging')}
          style={{ width: fileW }}>
          <TaskCard />
        </div>
        <SampleSplitter isDragging={isFileDragging} {...fileDragBarProps} />
        <div className={'flex grow'}>
          <div className={'grow bg-darker contents'}>
            <TestList />
          </div>
          <SampleSplitter
            isDragging={isPluginDragging}
            {...pluginDragBarProps}
          />
          <div
            className={cn('shrink-0 contents', isPluginDragging && 'dragging')}
            style={{ width: pluginW }}>
            <StarterCode />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskPanel
