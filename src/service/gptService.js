const axios = require('axios')
const gptUrl = process.env.REACT_APP_HOST_API + '/gpt'

export const analyzeTopicsInGroup = async (sessionId, groupId) => {
  try {
    const res = await axios.post(gptUrl + '/topics/' + groupId, { sessionId })
    console.log('topics:', res.data)
    return res.data
  } catch (e) {
    console.error(e)
    // throw e
  }
}