import axios from "axios"
import { functionNameDetect } from "../tool/functionNameDetect"
import { validateTests } from "../tool/validateTests"
import { changeTests } from "../tool/changeTests"
import { loadPyodide } from "pyodide"
import { toast } from "react-toastify"

const submissionUrl = process.env.REACT_APP_HOST_API + "/submissions"
const sessionUrl = process.env.REACT_APP_HOST_API + "/sessions"

//A function that creates a collection named Test. Inside this collection stores documents which
//is the test cases for the session. Each document has 3 fields. Test case name, starter code and unit test.
// export const addTest = async (sessionId, testName, starterCode, unitTest) => {
//   if (!sessionId) {
//     //console.log("Can't update, sessionId is missing.")
//     return false
//   }

//   try {
//     const newTest = {
//       testName: testName,
//       starterCode: starterCode,
//       unitTest: unitTest,
//     }
//     const newSession = {
//       test_code: newTest,
//     }
//     axios.put(submissionUrl + "/" + sessionId, {
//       session: newSession,
//     })
//     return true
//   } catch (error) {
//     console.error("Error updating test:", error)
//     return false
//   }
// }

/** A function that updates starter code and unit test panel */
// export const updateTest = async (
//   sessionId,
//   testId,
//   testName,
//   starterCode,
//   unitTest
// ) => {
//   if (!sessionId || !testId) {
//     //console.log("Can't update, sessionId or testId is missing.")
//     return false
//   }

//   try {
//     const docRef = doc(db, "session", sessionId, "tests", testId)
//     await updateDoc(docRef, {
//       testName: testName,
//       starterCode: starterCode,
//       unitTest: unitTest,
//     })

//     //console.log("Test updated successfully:", testId)
//     return true
//   } catch (error) {
//     console.error("Error updating test:", error)
//     return false
//   }
// }

/** A function that gets the unit test in that session based on testId */
// export const getTest = async (sessionId, testId) => {
//   if (!sessionId || !testId) {
//     //console.log("Can't get, sessionId or testId is missing.")
//     return false
//   }

//   try {
//     const docRef = doc(db, "session", sessionId, "tests", testId)
//     const test = await getDoc(docRef)
//     if (test.exists()) {
//       return test.data()
//     } else {
//       //console.log("No document found with id: ", testId)
//       return null
//     }
//   } catch (error) {
//     console.error("Error getting test:", error)
//     return false
//   }
// }

/**A Unit Test that deletes the test based on the specified session and testId */
// export const deleteTest = async (sessionId, testId) => {
//   if (!sessionId || !testId) {
//     //console.log("Can't delete, sessionId or testId is missing.")
//     return false
//   }

//   try {
//     const docRef = doc(db, "session", sessionId, "tests", testId)
//     await deleteDoc(docRef)
//     //console.log("Test deleted successfully:", testId)
//     return true
//   } catch (error) {
//     console.error("Error deleting test:", error)
//   }
// }

//A function that stores the test array, used to render the buttons in the UI to database
// export const storeTestArray = async (sessionId, testArray) => {
//   if (!sessionId || !testArray) {
//     //console.log("Can't store, sessionId or index or id is missing.")
//     return false
//   }
//   const newSession = {
//     test_list: testArray,
//   }

//   try {
//     axios.put(submissionUrl + "/" + sessionId, {
//       session: newSession,
//     })

//     return true
//   } catch (error) {
//     console.error("Error updating index:", error)
//     return false
//   }
// }

//A function that gets the test array, used to render the buttons in the UI to database
export const getTestArray = async (sessionId) => {
  if (!sessionId) {
    //console.log("Can't get, sessionId is missing.")
    return false
  }
  let session = null
  try {
    await axios.get(submissionUrl + "/" + sessionId).then((response) => {
      session = response.data
    })
    if (session && session.test_list) {
      return session.testList
    } else {
      //console.log("No document found with id: ", sessionId)
      return []
    }
  } catch (error) {
    console.error("Error getting test:", error)
    return []
  }
}

//A fucntion that saves the test result to the database
// export const setTestResult = async (sessionId, userId, testResult, testId) => {
//   if (!sessionId || !testResult) {
//     //console.log("Can't store, sessionId or testResult is missing.")
//     return false
//   }
//   try {
//     const docRef = doc(db, "session", sessionId, "users", userId)
//     await updateDoc(docRef, {
//       [testId]: testResult,
//     })
//   } catch (error) {
//     console.error("Error updating test result:", error)
//     return false
//   }
// }

// export const getTestResult = async (sessionId, userId, testId) => {
//   if (!sessionId || !testId) {
//     //console.log("Can't get, sessionId or testId is missing.")
//     return false
//   }
//   try {
//     const docRef = doc(db, "session", sessionId, "users", userId)
//     const user = await getDoc(docRef)
//     if (user.exists()) {
//       const testData = user.data()[testId]
//       return testData
//     } else {
//       //console.log("No document found with id: ", userId)
//       return null
//     }
//   } catch (error) {
//     console.error("Error getting test result:", error)
//     return false
//   }
// }


export const getNumTest = async (sessionId) => {
  if (!sessionId) {
    //console.log("Can't get, sessionId is missing.")
    return null
  }

  try {
    let testArr = await getTestArray(sessionId)
    return testArr.length
  } catch (error) {
    console.error("Error getting test array:", error)
    return 0
  }
}

// export const updateTestInSession = async (sessionId, test) => {
//   if (!sessionId || !test) {
//     //console.log("Can't update, sessionId or test is missing.")
//     return false
//   }

//   try {
//     const docRef = doc(db, "session", sessionId)
//     await updateDoc(docRef, {
//       test: test,
//     })

//     //console.log("Test updated successfully:", test.codeId)
//     return true
//   } catch (error) {
//     console.error("Error updating test:", error)
//     return false
//   }
// }

export const updateTestListInSession = async (sessionId, testList) => {
  if (!sessionId || !testList) {
    //console.log("Can't update, sessionId or testList is missing.")
    return false
  }

  const session = {
    test_list: testList,
  }
  try {
    await axios.put(sessionUrl + "/" + sessionId, {
      session: session,
    })

    return true
  } catch (error) {
    console.error("Error updating testList:", error)
    return false
  }
}

export const updateTestCodeInSession = async (sessionId, code) => {
  if (!sessionId || !code) {
    //console.log("Can't update, sessionId or code is missing.")
    return false
  }

  let session = {
    test_code: code,
  }
  try {
    await axios.put(sessionUrl + "/" + sessionId, {
      session: session,
    })
    return true
  } catch (error) {
    console.error("Error updating code:", error)
    return false
  }
}

//Generagte the test code by the testList
export const createTestCode = async (testList, task) => {
  const parameter_value = []
  const return_value = []

  if (testList.length === 0) {
    return {
      starter: "",
      unit_test: "",
      template: "",
    }
  }

  const functionName = await functionNameDetect(task)


  const regex = /(".*?"|'.*?'|[^;]+)/g
  testList.forEach((test) => {
    let match
    const parameters = []

    while ((match = regex.exec(test.parameter)) !== null) {
      parameters.push(match[0].trim())
    }

    parameter_value.push(`[${parameters.join(",")}]`)
    return_value.push(test.return)
  })

  let starter = `# Variable Setup for Unit Tests
global parameter_values
parameter_values = [${parameter_value.join(",")}]
global return_values
return_values = [${return_value.join(",")}]
global result
result = []`

  let unit_test = `for i, input_values in enumerate(parameter_values):
  if ${functionName}(*input_values) == return_values[i]:
    result.append(True)
  else:
    result.append(False)`

  let template = ``

  return { starter, unit_test, template }
}

export const changeUnitTest = async (task, code, test) => {
  let gptResult = await changeTests(task, code, test) + "\n"
  //console.log(gptResult)
  ////console.log(gptResult)
  let regex = /\:(.*?)\n/g
  let result = gptResult.match(regex)
  //console.log(result)
  let newTests = []
  for(let i = 0; i < Math.floor(result.length/3);i++) {
    let newTest = {
      testName: result[i*3].substring(2, result[i*3].length - 1),
      parameter: result[(i*3)+1].substring(2, result[(i*3)+1].length - 1),
      return: result[(i*3)+2].substring(2, result[(i*3)+2].length - 1),
      visable: false,
    }
    //console.log(newTest)
    newTests.push(newTest)
  }
  return newTests
  ////console.log(result)
  let newTest = {
    testName: result[0].substring(2, result[0].length - 1),
    parameter: result[1].substring(2, result[1].length - 1),
    return: result[2].substring(2, result[2].length - 1),
    visable: false,
  }
  return newTest



}

export const validateTestCode = async (task, code) => {
  const gptCode = await validateTests(task)
  //console.log(gptCode)
  const toastId = toast.info("Executing code...", { autoClose: false })
  const starterCode = code.starter
  const unitTest = code.unit_test
  let pythonResult = []

  const pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
  })
  let pythonStdOut = ""
  pyodide.setStdout({
    isatty: false,
    batched: (output) => {
      pythonStdOut += output + "\n"
    },
  })

  let pythonStdErr = ""
  //Run Starter Code and User Code; Output to Python Interpreter
  try {
    await pyodide.runPython(
      starterCode + "\n" + gptCode + "\n" + unitTest
    )
  } catch (err) {
    console.log(err.toString())
    pythonStdErr = err
    let toReturn = { code: gptCode, result: null }
    return toReturn
  } finally {
    toast.dismiss(toastId)
  }
  try {
    pythonResult = pyodide.globals.get("result").toJs()
    let toReturn = { code: gptCode, result: pythonResult }
    return toReturn
  } catch (err) {
    //console.log(err.toString())
    if (pythonStdErr === "") {
      // setOutput(pythonStdOut + '\n' + 'No return value')
    }
  }
}
