import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { SelectedCodeContext } from '../../context/SelectedCodeContext';
import { SessionContext } from '../../context/SessionContext';
import axios from 'axios';
import style from '../../css/metacog.scss';

const Metacog = ({ keystrokes, taskContent }) => {
    
    const [keystrokesHistory, setKeystrokesHistory] = useState(keystrokes);

    const { selectedCode, setSelectedCode } = useContext(SelectedCodeContext);
    const { currentUser } = useContext(AuthContext);

    const { session } = useContext(SessionContext);
    const gptHost = process.env.REACT_APP_HOST + "/api/v1/gpt/openAI";
    const [isLoadingAIResponse, setIsLoadingAIResponse] = useState(false);
    const initialPrompt = `
    You are an AI assistant designed to help students identify the type of metacognitive difficulties they are facing based on their keystrokes and input while coding. There are five types of metacognitive difficulties:
    
    1. Forming: Forming the wrong conceptual model about the right problem.
    2. Dislodging: Dislodging an incorrect conceptual model of the problem may not be solved.
    3. Assumption: Forming the correct conceptual model for the wrong problem.
    4. Location: Moving too quickly through one or more stages incorrectly leads to a false sense of accomplishment and poor conception of location in the problem-solving process.
    5. Achievement: Unwillingness to abandon a wrong solution due to a false sense of being nearly done.
    
    Here's the task content: ${taskContent}. Based on the keystrokes provided, you will identify which of the metacognitive difficulties they might be facing. Provide a straightforward identification with a brief evidence to help the student understand and address the issues.
    Respond as if you are talking to the student directly. For example, "Based on your return statement "(Quoting the return statement that the student wrote)", it seems like you are facing a Forming difficulty. You might want to consider revisiting the problem statement and your approach to solving it."
    `;
    

    const [chatData, setChatData] = useState([{ role: "system", content: initialPrompt }]);
    const [response, setResponse] = useState("");

    const addChatData = async (newContent, newSender) => {
        setChatData(prevMessages => {
            const updatedMessages = [...prevMessages, { content: newContent, role: newSender }];
            return updatedMessages;
        });
    };

    useEffect(() => {
        const checkChanges = async () => {
            if( keystrokes.length === 0 ){
                setResponse("Start writing your code and get real-time meta-cognitive feedback.");
            } else if (keystrokes.length > 0 && !isLoadingAIResponse) {
                await askAI();
            }
        }
        checkChanges();
    }, [keystrokes]);

    if (!session) return null;

    const askAI = async () => {
        const newPrompt = `This is the key Stroke History: ${JSON.stringify(keystrokes)}`;
        setIsLoadingAIResponse(true);
        setResponse("Analyzing...");

        try {
            const res = await axios.post(gptHost, { messages: [...chatData, { role: "user", content: newPrompt }] });
            await addChatData(newPrompt, "user");
            const responseMessage = res.data.content;
            setResponse(responseMessage);
            await addChatData(responseMessage, "assistant");
            console.log(chatData)
        } catch (error) {
            console.error(error);
            addChatData("Sorry, something went wrong. Please try again.", "assistant");
        } finally {
            setIsLoadingAIResponse(false);
        }
    };

    return (
        <textarea className="analyzation" value={response} readOnly />
    );
};

export default Metacog;
