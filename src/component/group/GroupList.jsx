import React, { useContext, useEffect, useState } from 'react'
import { SelectedGroupContext } from '../../context/SelectedGroupContext'
import GroupView from './GroupView'
import { groupFilter } from '../../tool/groupOrderUnit'
import GroupBar from './GroupBar'
import { GroupsContext } from '../../context/GroupsContext'
import { SessionContext } from '../../context/SessionContext'
import { GroupsFilterContext } from '../../context/GroupsFilterContext'
import { SubmissionsContext } from '../../context/SubmissionsContext'
import { AutoGroupingContext } from '../../context/AutoGroupingContext'
import { groupingInSession } from '../../service/sessionService'

const GroupList = () => {
  const [groups, setGroups] = useState([])
  const { selectedGroup, setSelectedGroup } = useContext(SelectedGroupContext)
  const { groupsInSession } = useContext(GroupsContext)
  const { session } = useContext(SessionContext)
  const { groupsFilter } = useContext(GroupsFilterContext)
  const { submissions } = useContext(SubmissionsContext)
  const {setRegroupingCheck} = useContext(AutoGroupingContext)

  useEffect(() => {
    const fetchGroups = async () => {
      if (groupsInSession) {
        let newGroups = await groupFilter(
          submissions,
          groupsInSession,
          groupsFilter,
          session.id
        )
        setGroups(newGroups)
      } else {
        setGroups([])
      }
    }
    fetchGroups()
  }, [submissions, groupsInSession, groupsFilter])

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
    if (groups) {
      console.log("groups", groups);
      let count = 0;
      groups.forEach((group) => {
        if(group.progress.passrate >= 99 && group.user_ids.length === 3){
          if(new Set(group.messages.map((message) => message.sender_id)).size >= 2){
            count++;
          }
        }
      })
      
      let threshold = 1000
      if (groups.length < 15) {
        threshold = 2;
      }
      else if (groups.length >15 && groups.length < 33) {
        threshold = 4;
      }
      else if (groups.length >= 33) {
        threshold = 6;
      }
      console.log("count", count);
      console.log("threshold", threshold);
      if(count >= threshold){
        setRegroupingCheck(true);
        console.log("regrouping triggered");
      }
      else{
        setRegroupingCheck(false);
      }
    }
  } , [groups, submissions, groupsInSession])

  if (!session || !groups) return <div>Loading...</div>

  return (
    <div className="group">
      <GroupBar />
      <div className="groupList">
        {groups.map((group, index) => (
          <GroupView key={group.id} group={group} />
        ))}
      </div>
    </div>
  )
}

export default GroupList
