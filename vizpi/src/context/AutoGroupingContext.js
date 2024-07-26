import { createContext, useState } from "react";

export const AutoGroupingContext = createContext();

export const AutoGroupingContextProvider = ({ children }) => {
    const [autoGrouping, setAutoGrouping] = useState(false);
    const [autoGroupingRate, setAutoGroupingRate] = useState(null)
    const [regroupingCheck, setRegroupingCheck] = useState(false)

    return (
        <AutoGroupingContext.Provider value={{ autoGrouping, autoGroupingRate, regroupingCheck, setAutoGrouping, setAutoGroupingRate, setRegroupingCheck }}>
        {children}
        </AutoGroupingContext.Provider>
    );
}