import React, { useContext } from 'react'
import '../../../css/audio/audioGroupView.scss'
import { SelectedGroupContext } from '../../../context/SelectedGroupContext'

const AudioGroupView = ({ group, selected }) => {
  const { setSelectedGroup } = useContext(SelectedGroupContext)

  const handleClick = () => {
    setSelectedGroup(group)
  }

  return (
    <div
      className={selected ? 'group-card selected' : 'group-card'}
      onClick={handleClick}>
      <h3 className="group-title">{group.name}</h3>
      <div className="topics-container">
        {group.topics?.map((topic, index) => (
          <div key={index} className="topic-tag">
            {topic}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AudioGroupView
