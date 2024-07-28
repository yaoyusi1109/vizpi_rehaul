import axios from "axios"
const gptHost = process.env.REACT_APP_HOST + "/api/v1/gpt/messages"

export async function classifyUser (messages) {
    if (!messages || messages.length == 0)
      return "Silent"


    const response = await axios.post(gptHost, {
      messages:messages,
    }).catch((error) => {
      //console.log(error)
      throw error
    })
    //console.log(response)
    return response.data
  }