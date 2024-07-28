const gptHost = process.env.REACT_APP_HOST + "/api/v1/gpt/functionName"
const axios = require('axios')

export async function functionNameDetect (taskDescription) {
  if (!taskDescription || taskDescription.length == 0)
    return 0
  let response = await axios.post(gptHost, {
    taskDescription: taskDescription
  }).catch((error) => {
    //console.log(error)
    throw error
  })
  return response.data.functionName
}