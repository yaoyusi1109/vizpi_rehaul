import React, { createContext, useState, useEffect } from "react";

export const SelectedTestContext = createContext();

export const SelectedTestProvider = ({ children }) => {
  const [selectedTest, setSelectedTest] = useState({
    id: "",
    starterCode: "",
    testName: "",
    unitTest: "",
    testResult: "",
  });
  const [testResultByID, setTestResultByID] = useState(new Map());


  //Use Effect that loads testResultyID from local storage when the page is loaded
  useEffect(() => {
    // Retrieve testResultByID from localStorage and convert back to a Map
    const testResultByIDString = localStorage.getItem("testResultByID");
    if (testResultByIDString) {
      const testResultByIDObject = JSON.parse(testResultByIDString);
      setTestResultByID(new Map(Object.entries(testResultByIDObject)));
      // Now, testResultByIDMap contains the Map object
      //console.log("TestMap: "+[...testResultByID.entries()])
    }
  }, []);

  return (
    <SelectedTestContext.Provider
      value={{
        selectedTest,
        setSelectedTest,
        testResultByID,
        setTestResultByID,
      }}
    >
      {children}
    </SelectedTestContext.Provider>
  );
};
