import {sendAIResponseToUser} from '../service/chatService';
const axios = require('axios');
const gptHost = process.env.REACT_APP_HOST + "/api/v1/gpt/openAI";
const solutionHost = process.env.REACT_APP_HOST + "/api/v1/gpt/solution";
const chatUrl = process.env.REACT_APP_HOST_API + "/chat"


export async function getSolution(taskDescription) {
    if (!taskDescription || taskDescription.length === 0) {
        return null; 
      }
      try {
        let response = await axios.post(solutionHost, {
          taskDescription: taskDescription
        });
        //console.log(response.data)
        return response.data; 
      } catch (error) {
        console.error('Error generating descriptions:', error);
        throw error; 
      }
};

export const addMessageType = async (messageId, question_type) => {
	if (!messageId || !question_type) return null
	try {
		let res = await axios
			.put(chatUrl + "/" + messageId + "/type", { question_type: question_type })
		//console.log(res.data)
		return res.data
	} catch (e) {
		console.error(e)
	}
}
