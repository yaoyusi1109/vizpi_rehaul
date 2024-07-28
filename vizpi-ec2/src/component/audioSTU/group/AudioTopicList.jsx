import React, { useContext, useEffect, useState } from 'react'
import { analyzeTopicsInGroup } from '../../../service/gptService'
import { SelectedGroupContext } from '../../../context/SelectedGroupContext'
import Loading from '../../commonUnit/Loading'
import { getTopicsByGroupId } from '../../../service/groupService'
import { SessionContext } from '../../../context/SessionContext'
import '../../../css/audio/discussionTopics.scss'

const DiscussionTopics = () => {
  const [expandedIndices, setExpandedIndices] = useState([])
  const [topics, setTopics] = useState([])
  const { selectedGroup } = useContext(SelectedGroupContext)
  const [fetching, setFetching] = useState(false)
  const { session } = useContext(SessionContext)

  useEffect(() => {
    const fetchTopics = async () => {
      getTopicsByGroupId(selectedGroup?.id).then((topicsData) => {
        if (!topicsData || !Array.isArray(topicsData)) setTopics([])
        setTopics(topicsData)
      })
    }
    fetchTopics()
  }, [selectedGroup])

  const handleTopicClick = (index) => {
    setExpandedIndices((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index)
        : [...prevIndices, index]
    )
  }

  const fetchLatestTopics = () => {
    setFetching(true)
    analyzeTopicsInGroup(session.id, selectedGroup.id).then((topicsData) => {
      if (topicsData) {
        setTopics(topicsData)
        let topics = topicsData.map((topic) => {
          return topic.topic
        })
        selectedGroup.topics = topics
      }
      setFetching(false)
    })
  }

  return (
    <div className="topic-list-container">
      <h2 className="title">Current Discussion Topics</h2>
      {fetching ? (
        <Loading />
      ) : (
        <>
          <ul className="topic-list">
            {Array.isArray(topics) &&
              topics?.map((topic, index) => (
                <div key={index}>
                  <li
                    className="topic-item"
                    onClick={() => handleTopicClick(index)}>
                    {topic.topic}
                  </li>
                  <ul
                    className={`dialog-list ${
                      expandedIndices.includes(index) ? 'expanded' : ''
                    }`}>
                    {topic?.dialogs?.map((dialog, dialogIndex) => (
                      <li key={dialogIndex} className="dialog-item">
                        <div className="dialog-content">{dialog.message}</div>
                        <div className="dialog-sender">— {dialog.sender}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </ul>
          <div className="button-container">
            <button
              className="button"
              onClick={fetchLatestTopics}
              disabled={fetching}>
              Fetch Latest Topics
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default DiscussionTopics
