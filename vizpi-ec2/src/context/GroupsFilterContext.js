import { useState } from "react"
import { createContext } from "react"

export const GroupsFilterContext = createContext()

//Context for authentication
export const GroupsFilterProvider = ({ children }) => {
  const [groupsFilter, setGroupsFilter] = useState(
    {
      sortType: '',
      searchContent: '',
      searchType: '',
    }
  )

  return (
    <GroupsFilterContext.Provider value={{ groupsFilter, setGroupsFilter }}>
      {children}
    </GroupsFilterContext.Provider>
  )
}