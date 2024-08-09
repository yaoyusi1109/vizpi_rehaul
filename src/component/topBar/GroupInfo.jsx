import React, { useContext } from 'react'
import CodeIssues from './CodeIssues'
import GroupPassRate from './GroupPassRate'

const GroupInfo = () => {
  // const { selectedGroup, setSelectedGroup } = useContext(SelectedGroupContext)

  return (
    <div>
      {/* <h3 className="header">{selectedGroup.name}</h3> */}
      <div className="group-info">
        {/* <Keywords /> */}
        <CodeIssues />
        <GroupPassRate />
      </div>
    </div>
  )
}

export default GroupInfo
