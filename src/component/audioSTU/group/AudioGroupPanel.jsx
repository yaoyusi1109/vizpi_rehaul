import React, { useContext, useEffect } from 'react'
import { cn } from '../../../pages/SampleSplitter'
import { useResizable } from 'react-resizable-layout'
import SampleSplitter from '../../../pages/SampleSplitter'
import Chat from '../../chat/Chat'
import '../../../css/codeIssuePanel.scss'
import { ModeContext } from '../../../context/ModeContext'
import AudioGroupList from './AudioGroupList'
import DiscussionTopics from './AudioTopicList'
import AudioChat from '../../chat/AudioChat'

const AudioGroupPanel = () => {
  const { setMode } = useContext(ModeContext)
  useEffect(() => {
    setMode(false)
  }, [])

  const initialFileW = window.innerWidth / 3
  const initialPluginW = window.innerWidth / 3

  const {
    isDragging: isFileDragging,
    position: fileW,
    separatorProps: fileDragBarProps,
  } = useResizable({
    axis: 'x',
    initial: initialFileW,
    min: 200,
  })

  const {
    isDragging: isPluginDragging,
    position: pluginW,
    separatorProps: pluginDragBarProps,
  } = useResizable({
    axis: 'x',
    initial: initialPluginW,
    min: 200,
    reverse: true,
  })

  return (
    <div className="audio-group-panel flex flex-column h-screen bg-light font-sans text-dark overflow-hidden">
      <div className="flex grow no-scroll">
        <div
          className={cn('', isFileDragging && 'dragging')}
          style={{ width: fileW }}>
          <AudioGroupList />
        </div>
        <SampleSplitter isDragging={isFileDragging} {...fileDragBarProps} />
        <div className="grow bg-lighter contents-chat no-scroll">
          <Chat />
        </div>
        <SampleSplitter isDragging={isPluginDragging} {...pluginDragBarProps} />
        <div
          className={cn('shrink-0 contents', isPluginDragging && 'dragging')}
          style={{ width: pluginW }}>
          <DiscussionTopics />
        </div>
      </div>
    </div>
  )
}

export default AudioGroupPanel
