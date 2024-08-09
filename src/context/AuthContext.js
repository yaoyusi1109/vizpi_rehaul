import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext()

//Context for authentication
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [currentUserLoading, setCurrentUserLoading] = useState(true)

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, currentUserLoading, setCurrentUserLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
