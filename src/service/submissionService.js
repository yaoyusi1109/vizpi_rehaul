import axios from "axios"
import { socket } from "../tool/socketIO"
import { set } from "immutable"

const sessionUrl = process.env.REACT_APP_HOST_API + "/sessions"
const submissionUrl = process.env.REACT_APP_HOST_API + "/submissions"

export const getSubmissionById = async (submissionId) => {
  if (!submissionId || submissionId === "") return null

  axios.get(submissionUrl + "/" + submissionId).then(response => {
    return response.data
  }).catch(error => {
    console.error(error)
    return null
  })
}

//gets the most recent submission for each student in the session.
export const getSubmissionsBySessionId = async (sessionId) => {
  if (!sessionId || sessionId === "") return null

  let submissions = []
  await axios.get(sessionUrl + '/' + sessionId + '/submissions').then(response => {
    submissions = response.data.submissions
  }).catch(error => {
    console.error(error)
    return []
  })
  return submissions
}

export const getUserSubmissions = async (sessionId,userId) => {
  if (!sessionId || sessionId === "") return null

  let submissions = []
  await axios.get(submissionUrl + '/' + sessionId + '/'+userId).then(response => {
    submissions = response.data.submissions
  }).catch(error => {
    console.error(error)
    return []
  })
  return submissions
}

//gets all submissions in a session
export const getSessionSubmissions = async (sessionId) => {
  if (!sessionId || sessionId === "") return null

  let submissions = []
  await axios.get(submissionUrl + '/' + sessionId).then(response => {
    submissions = response.data.submissions
  }).catch(error => {
    console.error(error)
    return []
  })
  return submissions
}

export const updateSubmission = async (submission) => {
  //console.log(submission)
  axios.post(submissionUrl, {
    submission: submission
  }).then(response => {
    return response.data
  }).catch(error => {
    console.error(error)
    return null
  })
}

export const createSubmission = (userId, codeId, sessionId, pass, passrate, error) => {
  return {
    user_id: userId,
    code_id: codeId,
    session_id: sessionId,
    result_list: pass,
    passrate: passrate,
    error: error
  }
}

export const createErr = (error) => {
  if (!error || error === "") return null
  const errorObject = {
    message: error.message,
    name: error.name,
    stack: error.stack,
  }
  return errorObject
}

export const subscribeSubmissions = (sessionId, updateSubmissions) => {
  getSubmissionsBySessionId(sessionId).then(submissions => {
    //console.log(submissions)
    updateSubmissions(submissions)
  })

  socket.emit('subscribe submissions', sessionId)

  const updateSubmissionHandler = (submission) => {
    submission = submission.data
    updateSubmissions((prevSubmissions) => {
      const submissionIndex = prevSubmissions.findIndex(s => s.user_id === submission.user_id)
      if (submissionIndex === -1) {
        return [...prevSubmissions, submission]
      } else {
        const newSubmissions = [...prevSubmissions]
        newSubmissions[submissionIndex] = submission
        //console.log(newSubmissions)
        return newSubmissions
      }
    })
  }

  socket.on('update submission', updateSubmissionHandler)

  return () => {
    socket.off('update session', updateSubmissionHandler)
    socket.emit('unsubscribe submissions', sessionId)
  }
}

const setPassrateInSubmission = (submission) => {
  if (!submission || !submission.result_list || submission.result_list.length === 0) return
  const passrate = submission.result_list.filter(pass => pass).length / submission.result_list.length * 100
  submission.passrate = passrate
}


export const getPassrateOfClass = (stuNum, testNum, submissions) => {
  if (!submissions || submissions.length === 0 || testNum === 0 || stuNum === 0)
    return 0
  const passSubmissions = submissions.map(submission => submission.result_list)
  passSubmissions.filter(pass => pass !== null)
  //console.log(passSubmissions)
  let count = 0
  passSubmissions.forEach(pass => {
    if (!pass) return
    pass.forEach(p => {
      if (p) count++
    })
  })

  return Math.round(count * 100 / (stuNum * testNum))
}

export const getTotalPassrateOfClass = (stuNum, testNum, submissions) => {
  if (!submissions || submissions.length === 0 || testNum === 0 || stuNum === 0)
    return 0
  const passSubmissions = submissions.map(submission => submission.result_list)
  passSubmissions.filter(pass => pass !== null)
  console.log(passSubmissions)
  let count = 0
  passSubmissions.forEach(pass => {
    let pCount = 0
    if (!pass) return
    pass.forEach(p => {
      if (p) pCount++
    })
    console.log(testNum,pCount, pass)
    if (pCount >= testNum) count++
  })

  return Math.round(count * 100 / stuNum)
}

export const getSubmissionInContextById = (submissions, id) => {
  if (!submissions || submissions.length === 0 || !id || id === "") return null
  const submission = submissions.find(submission => submission.user_id === id)
  if (!submission) return null
  setPassrateInSubmission(submission)
  return submission
}

export const getGroupPassrate = (submissions, group) => {
  if (!submissions || submissions.length === 0 || !group || !group.user_ids) return 0

  let sum = 0
  group.user_ids.map(id => {
    const submission = getSubmissionInContextById(submissions, id)

    if (submission && submission.result_list) {
      if (submission.result_list.length === 0) return
      setPassrateInSubmission(submission)
      sum += submission.passrate
    }
  })

  return Math.round(sum / group.user_ids.length)
}






