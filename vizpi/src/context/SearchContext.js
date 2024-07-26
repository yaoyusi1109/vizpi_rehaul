import React, { createContext, useState } from 'react'

export const SearchContext = createContext()

export function SearchContextProvider ({ children }) {
    const [search, setSearch] = useState("array")
    const value = {
        search,
        setSearch,
    }

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    )
}
