import React, { useContext, useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import MessageIcon from '@mui/icons-material/Message'
import { IconButton, Tooltip } from '@mui/material'
import { GroupsFilterContext } from '../../../context/GroupsFilterContext'
import '../../../css/audio/audioSearchBar.scss'

const AudioSearchBar = () => {
  const { groupsFilter, setGroupsFilter } = useContext(GroupsFilterContext)
  const [searchContent, setSearchContent] = useState('')

  useEffect(() => {
    setSearchContent(groupsFilter.searchContent)
  }, [groupsFilter.searchContent])

  const handleChange = (value) => {
    setSearchContent(value.target.value)
  }
  const handleKey = (value) => {
    if (value.code === 'Enter') {
      setGroupsFilter({ ...groupsFilter, searchContent: value.target.value })
    }
  }

  const search = (type) => {
    if (groupsFilter.searchType === type)
      setGroupsFilter({
        ...groupsFilter,
        searchType: '',
        searchContent: searchContent,
      })
    else
      setGroupsFilter({
        ...groupsFilter,
        searchType: type,
        searchContent: searchContent,
      })
  }

  const iconColor = (type) =>
    groupsFilter.searchType === type ? 'primary' : 'default'

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Type to Search"
        value={searchContent}
        onChange={(e) => handleChange(e)}
        onKeyUp={(e) => handleKey(e)}
      />
      <Tooltip title="Search by Message">
        <IconButton
          className="icon"
          color={iconColor('msg')}
          onClick={() => search('msg')}>
          <MessageIcon />
        </IconButton>
      </Tooltip>
    </div>
  )
}

export default AudioSearchBar
