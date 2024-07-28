import React from 'react'
import { Button } from '@mui/material'
import { useContext } from 'react'
import { GroupsFilterContext } from '../../context/GroupsFilterContext'

const Keywords = ({ keywords }) => {
  const { groupsFilter, setGroupsFilter } = useContext(GroupsFilterContext)
  keywords = ['array', 'index', 'range', 'return']

  const setKeyWordInFilter = (keyword) => {
    setGroupsFilter({
      ...groupsFilter,
      searchContent: keyword,
      searchType: 'code',
    })
  }

  return (
    <div className="group-info-keyword">
      <h3 className="header">Keywords</h3>
      <div className="keyword-buttons">
        {keywords.map((keyword, index) => (
          <Button
            key={index}
            variant="contained"
            color="primary"
            onClick={() => setKeyWordInFilter(keyword)}>
            {keyword}
          </Button>
        ))}
      </div>
    </div>
  )
}
export default Keywords
