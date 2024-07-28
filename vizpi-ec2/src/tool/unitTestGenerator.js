const gptHost = process.env.REACT_APP_HOST_API + "/gpt/"
const axios = require('axios')

export async function generateUnitTests (taskDescription, numOfTest = 3, type) {
  if (!taskDescription || taskDescription.length == 0)
    return 0

  let response = await axios.post(gptHost + "test", {
    task: {
      description: taskDescription,
      num: numOfTest,
      type: type
    }
  }).catch((error) => {
    throw error
  })

  return response.data
}