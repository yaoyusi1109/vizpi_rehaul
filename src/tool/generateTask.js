const axios = require('axios')
const gptHost = process.env.REACT_APP_HOST + "/api/v1/gpt"

export async function generateTask (taskDescription) {
  if (!taskDescription || taskDescription.length === 0) {
    return [] // Return an empty array if no task description is provided
  }

  try {
    let response = await axios.post(gptHost + "/generateTask", {
      taskDescription: taskDescription
    })
    //console.log(response.data)

    // if (response.data && response.data.length > 0) {
    //     //console.log("response.data[0].quizQuestions:", response.data[0].quizQuestions)
    //     return response.data;
    // }
    return response.data
  } catch (error) {
    console.error('Error generating descriptions:', error)
    throw error
  }
}

export async function generateAudioTask (taskDescription) {
  if (!taskDescription || taskDescription.length === 0) {
    return []
  }

  try {
    let response = await axios.post(gptHost + "/generateAudioTask", {
      taskDescription: taskDescription
    })
    return response.data
  } catch (error) {
    console.error('Error generating descriptions:', error)
    throw error
  }
}