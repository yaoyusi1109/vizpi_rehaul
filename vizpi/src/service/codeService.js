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

  if (!content || content === "" || !userId) {
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


