const axios = require('axios');
const gptHost = process.env.REACT_APP_HOST + "/api/v1/gpt/getQuiz";
const gptHost2 = process.env.REACT_APP_HOST + "/api/v1/gpt/getFeedback";

export async function getQuizQuestions(taskDescription) {
  if (!taskDescription || taskDescription.length === 0) {
    return []; // Return an empty array if no task description is provided
  }

  try {
    let response = await axios.post(gptHost, {
      taskDescription: taskDescription
    });

    // if (response.data && response.data.length > 0) {
    //     //console.log("response.data[0].quizQuestions:", response.data[0].quizQuestions)
    //     return response.data;
    // }
    return response.data; 
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw error; 
  }
}
export async function getAnswerFeedBack(taskDescription, functionName, wrongAnswers) {
  if (!taskDescription || taskDescription.length === 0 || !functionName || functionName.length === 0 || !wrongAnswers || wrongAnswers.length === 0) {
    return ""; 
  }

  try {
    let response = await axios.post(gptHost2, {
      taskDescription: taskDescription,
      functionName: functionName,
      wrongAnswers: wrongAnswers
    });

    // if (response.data && response.data.length > 0) {
    //     //console.log("response.data[0].quizQuestions:", response.data[0].quizQuestions)
    //     return response.data;
    // }
    //console.log(response.data)
    return response.data; 
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw error; 
  }
}

