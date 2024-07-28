import React , { createContext, useState, useContext, useEffect } from 'react'

export const ModeContext = createContext()

export const ModeContextProvider = ({ children }) => {
    const [Mode, setMode] = useState(false)
    
    return (
        <ModeContext.Provider value={{ Mode, setMode }}>
        {children}
        </ModeContext.Provider>
    )
}