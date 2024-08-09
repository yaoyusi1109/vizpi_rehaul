import React, { useState } from 'react'
import SearchBar from './SearchBar'
import { IconButton, Tooltip } from '@mui/material'
import SortIcon from '@mui/icons-material/Sort'
import {
  orderByConversationAsc,
  orderByPassrateAsc,
} from '../../tool/groupOrderUnit'
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha'
import { GroupsFilterContext } from '../../context/GroupsFilterContext'
import { useContext } from 'react'

const GroupBar = () => {
  const { groupsFilter, setGroupsFilter } = useContext(GroupsFilterContext)
  const sortColor = (type) =>
    groupsFilter.sortType === type ? 'primary' : 'default'

  const setSort = (type) => {
    if (type === groupsFilter.sortType)
      setGroupsFilter({ ...groupsFilter, sortType: '' })
    else setGroupsFilter({ ...groupsFilter, sortType: type })
  }

  return (
    <div className="groupBar">
      <SearchBar />
      <Tooltip title="Sort by Direct Message">
        <IconButton
          className="icon"
          color={sortColor('directmessage')}
          onClick={() => setSort('directmessage')}>
          <SortIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Sort by Passrate">
        <IconButton
          className="icon"
          color={sortColor('passrateAsc')}
          onClick={() => setSort('passrateAsc')}>
          <SortIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Sort by Conversation Progress">
        <IconButton
          className="icon"
          color={sortColor('conversationAsc')}
          onClick={() => setSort('conversationAsc')}>
          <SortIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Sort by Name">
        <IconButton
          className="icon"
          color={sortColor('nameAsc')}
          onClick={() => setSort('nameAsc')}>
          <SortByAlphaIcon />
        </IconButton>
      </Tooltip>
    </div>
  )
}
export default GroupBar
