import axios from "axios"
const gptHost = process.env.REACT_APP_HOST + "/api/v1/gpt/changeTests"

export async function changeTests (taskDescription, gptCode, test) {
    if (!taskDescription || taskDescription.length == 0)
      return 0


    const response = await axios.post(gptHost, {
      task: taskDescription,
      gptCode: gptCode,
      tests: test
    }).catch((error) => {
      //console.log(error)
      throw error
    })
    //console.log(response)
    return response.data
  }