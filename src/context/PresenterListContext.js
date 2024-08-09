import React, { useState, createContext } from 'react';

export const PresenterListContext = createContext();

export const PresenterListProvider = (props) => {
    
    const [codeList, setCodeList] = useState([]);

    return (
        <PresenterListContext.Provider value={{codeList, setCodeList}}>
            {props.children}
        </PresenterListContext.Provider>
    );
};
