const axios = require("axios")
const reviewUrl = process.env.REACT_APP_HOST_API + "/reviews"

export const createReview = (comment, responses, group_id, rating, session_id, user_id) => {
  return {
    comment: comment,
    questions: responses,
    group_id: group_id,
    rating: rating,
    session_id: session_id,
    user_id: user_id,
    time: new Date(),
  }
}

export const addReview = async (review) => {
  try {
    const response = await axios.post(reviewUrl, { review: review })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}