import { ChatOpenAI } from "langchain/chat_models/openai"
import { HumanMessage, SystemMessage } from "langchain/schema"
import {
  getUserSubmissions,
  getSubmissionsBySessionId,
 } from '../service/submissionService'
import { getAllUsersInSession } from '../service/userService'
import { getUsersSortedByProgress } from "../service/sessionService";

async function identifyConversationProgress (messages) {
  let studentConversation = ""
  for (let i = messages?.length - 1; i >= 0; i--) {
    const item = messages[i]
    if (item.content && item.sender_id) {
      studentConversation = studentConversation + 'Student[' + item.sender_id + ']: ' + item.content
    }
  }

  // require('dotenv').config();
  // //console.log("conversation: " +studentConversation);
  // //console.log('API_Key:'+process.env.REACT_APP_OPENAI_API_KEY)

  try {
    const chat = new ChatOpenAI({
      openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
      model: "gpt-3.5-turbo",
      temperature: 0.0,
    })

    const example_text = `
    Conversation:
    Student 1: Hey guys, I'm having trouble with this code problem. Can anyone help me out?
    Student 2: Sure, what's the problem?
    Student 1: So, the task is to write a function that takes in a list of numbers and returns the sum of all the even numbers in the list.
    Student 3: That sounds simple enough. Have you tried anything so far?
    Student 1: Yeah, I wrote a for loop to iterate through the list and check if each number is even. But I'm not sure how to add up only the even numbers.
    Student 4: You can create a variable to keep track of the sum and add each even number to it inside the loop.
    Student 1: Oh, that makes sense. Let me try that.
    Student 2: While you're at it, make sure to check if the number is even using the modulo operator (%). If the number divided by 2 has a remainder of 0, it's even.
    Student 1: Got it, thanks for the tip!
    Student 3: Also, remember to initialize the sum variable to 0 before the loop starts, so you can add the even numbers to it.
    Student 1: Right, I'll do that. Okay, here's my updated code:
    \`\`\`python
    def sum_even_numbers(numbers):
        even_sum = 0
        for num in numbers:
            if num % 2 == 0:
                even_sum += num
        return even_sum
    \`\`\`
    Student 4: Looks good to me! Have you tested it with some sample inputs?
    Student 1: Not yet, let me try it out.
    Student 2: Make sure to test it with different cases, like an empty list or a list with no even numbers.
    Student 1: Good point. Okay, let me run some tests.
    Student 1: It's working perfectly! Thanks, everyone, for your help!
    Student 3: No problem, glad we could assist you!
    Student 4: Great job, now you can move on to the next problem.
    
    Response:
    Let's analyze the progress of the conversation at each step:
    Student 1: Hey guys, I'm having trouble with this code problem. Can anyone help me out? - 0%
    Student 2: Sure, what's the problem? - 5% (Recognizing the issue and readiness to help)
    Student 1: So, the task is to write a function that takes in a list of numbers and returns the sum of all the even numbers in the list. - 15% (Specific problem identified)
    Student 3: That sounds simple enough. Have you tried anything so far? - 20% (Understanding the problem and asking for existing solutions)
    Student 1: Yeah, I wrote a for loop to iterate through the list and check if each number is even. But I'm not sure how to add up only the even numbers. - 30% (Current progress shared)
    Student 4: You can create a variable to keep track of the sum and add each even number to it inside the loop. - 40% (Suggested solution)
    Student 1: Oh, that makes sense. Let me try that. - 45% (Acknowledgement of solution and readiness to implement)
    Student 2: While you're at it, make sure to check if the number is even using the modulo operator (%). If the number divided by 2 has a remainder of 0, it's even. - 55% (Additional guidance)
    Student 1: Got it, thanks for the tip! - 60% (Acknowledgement of additional guidance)
    Student 3: Also, remember to initialize the sum variable to 0 before the loop starts, so you can add the even numbers to it. - 70% (Additional tips for the solution)
    Student 1: Right, I'll do that. Okay, here's my updated code: - 75% (Implementation of solution)
    Student 4: Looks good to me! Have you tested it with some sample inputs? - 80% (Approval of solution and suggestion for testing)
    Student 1: Not yet, let me try it out. - 85% (Acknowledgement of testing necessity)
    Student 2: Make sure to test it with different cases, like an empty list or a list with no even numbers. - 90% (Additional testing advice)
    Student 1: Good point. Okay, let me run some tests. - 95% (Acknowledgement of advice and readiness to test)
    Student 1: It's working perfectly! Thanks, everyone, for your help! - 98% (Confirmation of problem solved)
    Student 3: No problem, glad we could assist you! - 99% (Acknowledgement of appreciation)
    Student 4: Great job, now you can move on to the next problem. - 100% (Affirmation of success and suggestion for future progress)
    PROGRESS PERCENTAGE = 100%
    `


    const response = await chat.call([
      new SystemMessage(
        `Given the following conversation about solving a problem, please analyze the progress of the conversation, representing it in percentage alongside each message. Here is an example: ` + example_text +
        `In the last line of your response, output the progress percentage as : "PROGRESS PERCENTAGE = ??%" `
      ),
      new HumanMessage(
        'Conversation: ' + studentConversation
      ),
    ])
    // //console.log(response);
    // //console.log(parseInt(response.content.match(/\d+/g).reverse()[0]))
    return parseInt(response.content.match(/\d+/g).reverse()[0])
  } catch (error) {
    console.error("Error Using Langchain:", error)
    return false
  }


}


// export const getConversationProgress = async (messages) => {
//   if (!messages || messages.length == 0)
//     return 0

//   let progressrate = await identifyConversationProgress(messages);

//   return progressrate;
// }

export const getConversationProgress = (messages) => {
  if (!messages || messages.length == 0)
    return 0

  return 100
}


export const getPassrateProgress = (messages) => {
  if (!Array.isArray(messages) || messages.length === 0) return 0
  return 100
  // const passrateById = new Map(
  //   messages?.map((message) => [message.sender_id, null])
  // )

  // for (let i = messages?.length - 1; i >= 0; i--) {
  //   const item = messages[i]
  //   if (
  //     passrateById.has(item.sender_id) &&
  //     passrateById.get(item.sender_id) === null
  //   ) {
  //     // //console.log(item.progress.passrate)
  //     passrateById.set(item.sender_id, item.progress?.passrate)
  //   }
  // }

  // const values = Array.from(passrateById.values())
  // let sum = 0
  // for (let i = 0; i < values.length; i++) {
  //   sum += values[i]
  // }
  // const averagePassrate = sum / values.length
  // return averagePassrate
}

export const getPassrateByResult = (result) => {
  if (result.length === 0) return 0
  let count = 0
  result.forEach((item) => {
    if (item) count++
  }
  )
  return Math.round(count / result.length * 100)
}

export async function getAvgAttempts(sessionId,testLength){
  let classSubs = await getSubmissionsBySessionId(sessionId)
  let tries = 0;
  let finished = 0
  //console.log(classSubs)
  for(let i = 0;i <classSubs.length;i++){
    if(classSubs[i].result_list.filter(Boolean).length===testLength){
      finished+=1
      let userSubs = await getUserSubmissions(sessionId,classSubs[i].user_id)
      //console.log(userSubs)
      tries +=userSubs.length
    }
  }
  if(finished == 0){
    return 0
  }
  return Math.round(tries / finished)
}

export async function getLeaderboard(session,groupsInSession){
  let leaderboard = {}
  let users = await getUsersSortedByProgress(session)
  //console.log(users)
  for(const user of users){
    leaderboard[user.id]={
      user: user,
      count: 0
    }
  }
  groupsInSession.forEach((group) => {
    if(group.name.includes("Help")){
      let words = group.name.split(" ")
      leaderboard[words[1]].count+=1
    }
  })
  return leaderboard
  
}


export async function getQuizData(sessionId) {
  let students = await getAllUsersInSession(sessionId);
  let stat = {
    passCount: 0,
    mcq: {
      count: 0,
      attempts: 0,
      accuracy: 0
    },
    fib: {
      count: 0,
      attempts: 0,
      accuracy: 0
    }
  };

  for (let i = 0; i < students.length; i++) {
    if (students[i].quiz_stats) {
      stat.passCount += 1;
      if (students[i].quiz_stats.quiz_type === 'fillInTheBlank') {
        stat.fib.attempts += students[i].quiz_stats.attempts;
        stat.fib.accuracy += students[i].quiz_stats.accuracy;
        stat.fib.count += 1;
      } else {
        stat.mcq.attempts += students[i].quiz_stats.attempts;
        stat.mcq.accuracy += students[i].quiz_stats.accuracy;
        stat.mcq.count += 1;
      }
    }
  }

  if (stat.passCount === 0) {
    return null;
  }

  if (stat.fib.count > 0) {
    stat.fib.attempts = +(stat.fib.attempts / stat.fib.count).toFixed(2);
    stat.fib.accuracy = Math.round(stat.fib.accuracy / stat.fib.count);
  } else {
    stat.fib.attempts = 0;
    stat.fib.accuracy = 0;
  }

  if (stat.mcq.count > 0) {
    stat.mcq.attempts = +(stat.mcq.attempts / stat.mcq.count).toFixed(2);
    stat.mcq.accuracy = Math.round(stat.mcq.accuracy / stat.mcq.count);
  } else {
    stat.mcq.attempts = 0;
    stat.mcq.accuracy = 0;
  }

  return stat;
}
