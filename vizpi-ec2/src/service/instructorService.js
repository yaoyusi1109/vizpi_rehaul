const axios = require("axios");
const instructorUrl = process.env.REACT_APP_HOST_API + "/instructors"; 

export const getInstructorBySessionId = async (sessionId) => {
	if (!sessionId) return null;

	return axios
		.get(instructorUrl + "/session/" + sessionId)
		.then((response) => {
            return response.data.instructor
		})
		.catch((error) => {
			console.error(error);
		});
};