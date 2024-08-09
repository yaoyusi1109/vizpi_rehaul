const axios = require('axios')
const codeUrl = process.env.REACT_APP_HOST_API + '/codes'
const sessionUrl = process.env.REACT_APP_HOST_API + '/sessions'

export const getCodeById = async (id) => {
  if (!id)
    return null

  let res = await axios.get(codeUrl + '/' + id)
    .catch(error => {
      console.error(error)
    })
  if(res?.data?.code===undefined){
    return false
  }
  return res.data.code
}

export const addCode = async (content, passrate, userId) => {
  if (!content || content === "" || !userId) {
    return false
  }

  axios.post(codeUrl + '/', {
    code: {
      creater_id: userId,
      content: content,
      passrate: passrate ? passrate : 0,
      created_time: new Date(),
    }
  })
}

//'save' button
export const addCodeAndUpdateUser = async (
  content,
  passrate,
  userId,
  keystrokes
) => {
  console.log(content,userId)
  if (content==null || !userId) {
    return false
  }

  let res = {}
  res.success = false
  let response = await axios.post(codeUrl + '/user/' + userId, {
    code: {
      creater_id: userId,
      content: content,
      passrate: passrate ? passrate : 0,
      created_time: new Date(),
      keystrokes: keystrokes
    },
  })
    .catch(error => {
      console.error(error)
    })
  res.code = response.data.code
  res.success = true
  //console.log(res)
  return res
}

export const searchCodesBySession = async (sessionId, target) => {
  try {
    const res = await axios.post(sessionUrl + '/' + sessionId + '/codes', {
      target: target
    })
    //console.log(res.data)
    return res.data.codes
  } catch (error) {
    console.error(error)
    return []
  }
}

export const runCode = async (code1, code2, type,session_id) => {
  if (code1==null || code2==null|| !type) {
    return -1
  }
  try {
    let res = await axios.post(codeUrl + '/run/'+session_id, {
      code1: code1,
      code2: code2,
      type: type
    })
    console.log(res)
    return res.data.code
    
  } catch (error) {
    console.log(error)
    
  }
  
}

export const getSchemaBySessionId = async (session_id) => {
  if (!session_id) {
    return -1
  }
  try {
    let res = await axios.get(codeUrl + '/schema/'+session_id)
    console.log(res)
    return res.data.code
    
  } catch (error) {
    console.log(error)
    
  }
  
}

