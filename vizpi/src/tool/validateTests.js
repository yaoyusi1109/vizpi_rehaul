import axios from "axios"
const gptHost = process.env.REACT_APP_HOST + "/api/v1/gpt/validate"

export async function validateTests (taskDescription) {
  if (!taskDescription || taskDescription.length === 0)
    return 0

  const response = await axios.post(gptHost, {
    task: taskDescription
  }).catch((error) => {
    //console.log(error)
    throw error
  })
  return response.data
}