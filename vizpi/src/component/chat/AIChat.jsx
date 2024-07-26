import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { SessionContext } from '../../context/SessionContext';
import { showToast } from '../commonUnit/Toast';
import { MenuItem, Select, Typography,Box } from '@mui/material';
import { MessageContext } from '../../context/MessageContext';
import '../../css/chat.scss';
import { SelectedCodeContext } from "../../context/SelectedCodeContext";
import { getSubmissionsBySessionId } from '../../service/submissionService';
import { subscribeToAIMessage, sendMessageToAI, sendAIResponseToUser, getMessagesBetweenUserAndAI} from '../../service/chatService';
import Loading from '../commonUnit/Loading';
import axios from 'axios';
import Messages from './Messages';
import { addMessageType} from '../../tool/aiAssistant';



const AIChat = () => {
  const initialPrompt = 
  `You are an upbeat, encouraging teaching assistant who helps students understand and python code and related concepts by answering student's question, explaining ideas and giving step-by-step instructions. 
        You must not directly write any code for them. You should guide students in an open-ended way. Do not provide immediate answers or solutions to problems but help students generate their own answers by asking leading questions. 
        Don't provide actual solution code anyway. And every time a student asks a question, you will be given the student's current code automatically with the student's question. 
        Keep your responses brief. Students will ask you questions while they are completing this task. 
        If they ask a broad question, you should divide it into several related concrete questions and ask them what aspect they want to know about, but if they ask about a specific part of the task, focus on that part of the task and do not extend into the other sections.\n 
        The function name much match what's given in the task description. Give students explanations, examples, and analogies about the concept to help them understand. 
        You should provide personalized feedback based on the student's code and question. 
        `
  const gptHost = process.env.REACT_APP_HOST + "/api/v1/gpt/openAI";

  const [prompt, setPrompt] = useState(initialPrompt);
  const [sortQuestion, setSortQuestion] = useState("For the question that the student ask for assistance regarding their code, sort the student's question into one of the following five categories:Task_clarification, Syntax_error_fix, Implementation_challenge, Failing_test_case_fix, Post_completion_code_refinement. Only include the category name in your response. If the student's question is irrelevant to completing the task, respond with 'irrelevant'.");
  const [chatData, setChatData] = useState([
    { role: "system", content: initialPrompt },
  ]);
  const { chatMessage, setChatMessage } = useContext(MessageContext);
  const { selectedCode, setSelectedCode } = useContext(SelectedCodeContext);
  const { currentUser } = useContext(AuthContext);
  const { session } = useContext(SessionContext);
  const [receiver, setReceiver] = useState('assistant');
  const [keystrokes, setKeystrokes] = useState([]);
  const [solution, setSolution] = useState('');
  const [isLoadingAIResponse, setIsLoadingAIResponse] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const chatHistoryRef = useRef(null);
  const [isChatDisabled, setIsChatDisabled] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatEnable, setChatEnable] = useState(false)

  useEffect(() => {
    if (session?.type) {
      if (session.type !== "Vizmental") {
        return;
      }
    }
  }, [session]);
  
  useEffect(() => {
    setChatEnable(session.enable_chat)
  }, [session.enable_chat])

  useEffect(() => {
    if (selectedCode !== null) {
      getSubmissionsBySessionId(session.id).then((submissions) => {
        const submission = submissions?.find((element) => element.code_id === selectedCode?.id);
      });
    }
  }, [selectedCode]);

  useEffect(() => {
    const updatePromptAndChatData = async () => {
      if (session?.task && session?.test_list) {
        const newPrompt = 
        `You are an upbeat, encouraging teaching assistant who helps students understand and python code and related concepts by answering student's question, explaining ideas and giving step-by-step instructions. 
        You must not directly write any code for them. You should guide students in an open-ended way. Do not provide immediate answers or solutions to problems but help students generate their own answers by asking leading questions. 
        Don't provide actual solution code anyway. And every time a student asks a question, you will be given the student's current code automatically with the student's question. 
        Keep your responses brief. Students will ask you questions while they are completing this task. 
        This is the task description: ${session.task} and the test cases: ${session.test_list}.
        If they ask a broad question, you should divide it into several related concrete questions and ask them what aspect they want to know about, but if they ask about a specific part of the task, focus on that part of the task and do not extend into the other sections.\n 
        The function name much match what's given in the task description. Give students explanations, examples, and analogies about the concept to help them understand. 
        You should provide personalized feedback based on the student's code and question. 
        `;
        setChatData((prevMessages) => {
          const updatedMessages = prevMessages.filter((msg) => msg.role !== "system");
          return [{ role: "system", content: newPrompt }, ...updatedMessages];
        });
        console.log("Updated chat data:", newPrompt);
        setPrompt(newPrompt);
        setIsChatDisabled(false);
        
      }
    };
    updatePromptAndChatData();
  }, [session, session.task, session.test_list]);

  useEffect(() => {
    if(!isChatOpen){
      const sendWelcomeMessage = async () => {
        const messages = await getMessagesBetweenUserAndAI(currentUser.id);
        if( messages.length === 0){
          await sendAIResponseToUser("Hey I am your AI assistant, feel free to ask me questions if you are stuck!", currentUser, []);
          await addChatData("Hey I am your AI assistant, feel free to ask me questions if you are stuck!", "assistant");
          setIsChatOpen(true);
        }
      }
      sendWelcomeMessage();
    }
  }, [isChatOpen]);

  // useEffect(() => {
  //   if(!isLoadingAIResponse){
  //     //console.log("chatData after AI responded", chatData);
  //   }
  // }, [chatData]);
  

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [displayedMessages]);

  useEffect(() => {
    const unsubscribe = subscribeToAIMessage(currentUser.id, setDisplayedMessages);
    //console.log('subscribed to AIMessages', currentUser.id);
    return () => {
      unsubscribe();
    }
  }, [currentUser, chatData, isLoadingAIResponse]);

  if (!session) return null;
  if (!currentUser) return null;
  if (!currentUser.session_id) return <Loading />;

  const handleKeyPress = (e) => {
    if (isLoadingAIResponse) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline character from being added
      sendMessage(e);
    }
  };

  const sendMessage = async (e) => {
    if(!isChatDisabled){
      e.preventDefault();
      const message = document.getElementById("myTextArea").value;
      if (message.trim()) {
        setIsChatDisabled(true);
        document.getElementById("myTextArea").value = '';
        if (receiver === 'assistant') {
          const res = await sendMessageToAI(message, currentUser, keystrokes);
          await addChatData(message, "user");
          const catagory = await axios.post(gptHost, { messages: [{role:"system", content: sortQuestion},{role: "user", content: message}] });
          await addMessageType(res.id, catagory.data.content);
          await askAI(message, selectedCode.content);
          // //console.log("current code", selectedCode)
        }
        setIsChatDisabled(false);
        // //console.log(displayedMessages)
      } else {
        showToast('Chat is disabled', 'warning');
      }
    }
  };

  const addChatData = async (newContent, newSender) => {
    setChatData(prevMessages => {
        const updatedMessages = [...prevMessages, { content: newContent, role: newSender }];
        // //console.log("Updated chat data in addChatData Function:", updatedMessages);
        return updatedMessages;
    });
};


const askAI = async (studentPrompt, currentCode) => {
    const newPrompt = `${studentPrompt} This is the current code: ${currentCode}`;

    setIsLoadingAIResponse(true);

    try {
      const res = await axios.post(gptHost, { messages: [...chatData,{role: "user", content: newPrompt}] });
      // //console.log("AIrespoonse:", res)
      // //console.log(res.data)
      const responseMessage = res.data.content;


      await sendAIResponseToUser(responseMessage, currentUser, []);
      
      await addChatData(responseMessage, "assistant");
      
    } catch (error) {
      console.error(error);
      addChatData("Sorry, something went wrong. Please try again.", "assistant");
    } finally {
      setIsLoadingAIResponse(false);
    }
};
  if(!session) return null


  return (
    chatEnable ? 
    (<div className="chat-container" style={{ height: '100%' }}>
        {/* <Box sx={{ background: '#FFFFFF', padding: '15px', marginLeft: '10px', marginRight: '10px', borderRadius: '10px', border: '1px solid #E0E0E0', marginBottom: '10px', display: 'flex',  flexDirection: 'column' }}>
        <Typography variant="h6" fontWeight="light">
            AI Chat
          </Typography>
          <Typography variant="subtitle1" fontWeight="light" gutterBottom>
          Chat with the AI for help with the task. It guides you using your latest submitted code for personalized feedback.
          </Typography>
        </Box> */}
      <div className="chat" style={{ height: '100%' }}>
        <div className="chat-history" ref={chatHistoryRef}>
          <Messages messages={displayedMessages} />
        </div>
        <form className="message-form">
          <textarea
            className="message-input"
            id="myTextArea"
            placeholder= {isChatDisabled ? 'Generating...' :'Use Shift + Enter for new line'}
            onKeyDown={handleKeyPress}
          />
          <button
            type="submit"
            className="send-button"
            onClick={sendMessage}
            disabled={isChatDisabled}
            style={{
              backgroundColor: isChatDisabled ? 'initial' : '#1976d2',
              cursor: isChatDisabled ? 'not-allowed' : 'pointer'
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>):
    <Typography variant="body1" margin={2}>The AI Assistant is currently disabled by your instructor. Please stay focused on the current topics being discussed by the instructor.</Typography>
  );
}

export default AIChat;
