import React, { useContext, useEffect, useRef, useState } from 'react'
import { SelectedGroupContext } from '../../../context/SelectedGroupContext'

import { GroupsContext } from '../../../context/GroupsContext'
import { SessionContext } from '../../../context/SessionContext'
import { GroupsFilterContext } from '../../../context/GroupsFilterContext'
import { groupFilter } from '../../../tool/groupOrderUnit'
import AudioGroupView from './AudioGroupView'
import '../../../css/audio/audioGroupList.scss'
import AudioSearchBar from './AudioSearchBar'
import {
  getAllTopicsInSession,
  renewTopics,
} from '../../../service/sessionService'
import { getGroupsBySession } from '../../../service/groupService'

const AudioGroupList = () => {
  const [groups, setGroups] = useState([])
  const { selectedGroup, setSelectedGroup } = useContext(SelectedGroupContext)
  const { groupsInSession, setGroupsInSession } = useContext(GroupsContext)
  const { session } = useContext(SessionContext)
  const { groupsFilter } = useContext(GroupsFilterContext)

  const listRef = useRef(null) // Ref to hold the list element
  const scrollPosition = useRef(0) // Ref to hold the scroll position

  const fetchTopics = async () => {
    return await getAllTopicsInSession(session.id)
  }

  const fetchGroups = async () => {
    let newGroups = await getGroupsBySession(session.id)
    // setGroupsInSession(newGroups)
    if (newGroups) {
      newGroups = await groupFilter([], newGroups, groupsFilter, session.id)
      return newGroups
    } else {
      return []
    }
  }

  const mergeTopicsToGroup = async () => {
    let newGroups = await fetchGroups()
    let topics = await fetchTopics()
    newGroups.map((group) => {
      group.topics = topics[group.id] || []
    })
    setGroups(newGroups)
  }

  useEffect(() => {
    const intervalId1 = setInterval(async () => {
      await renewTopics(session.id)
      // mergeTopicsToGroup()
    }, 60000)
    const intervalId2 = setInterval(async () => {
      mergeTopicsToGroup()
    }, 10000)
    return () => {
      clearInterval(intervalId1)
      clearInterval(intervalId2)
    }
  }, [])

  useEffect(() => {
    mergeTopicsToGroup()
  }, [groupsInSession, groupsFilter])

  useEffect(() => {
    if (groups) {
      if (selectedGroup) {
        const newSelectedGroup = groups.find(
          (group) => group.id === selectedGroup.id
        )
        if (newSelectedGroup) {
          setSelectedGroup(newSelectedGroup)
        }
      } else {
        setSelectedGroup(groups[0])
      }
    }
  }, [groups])

  useEffect(() => {
    const handleScroll = () => {
      scrollPosition.current = listRef.current?.scrollTop || 0
    }
    listRef.current?.addEventListener('scroll', handleScroll)
    return () => {
      listRef.current?.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Restore scroll position after groups update
  useEffect(() => {
    listRef.current?.scrollTo(0, scrollPosition.current)
  }, [groups])

  if (!session || !groups) return <div>Loading...</div>

  return (
    <div className="search-list">
      <AudioSearchBar />
      <div className="audio-groupList" ref={listRef}>
        {groups.map((group, index) => (
          <AudioGroupView
            key={group.id}
            group={group}
            selected={selectedGroup?.id === group.id}
          />
        ))}
      </div>
    </div>
  )
}

export default AudioGroupList
