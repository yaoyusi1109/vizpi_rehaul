import { subscribeToAIMessage, sendMessageToAI, sendAIResponseToUser, getMessagesBetweenUserAndAI, getMessagesBySession, subscribeToAIMessageInSession } from '../../service/chatService';
import { List, ListItem, ListItemButton, ListItemText, Typography, Button, Paper, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { SessionContext } from '../../context/SessionContext';
import '../../css/codeIssueGrid.scss'
import '../../css/passrate.scss'

const InteractionList = () => { 
  const { currentUser } = useContext(AuthContext);
  const { session } = useContext(SessionContext);
  
  const [questionCategories, setQuestionCategories] = useState({
    Avg_question_per_student: 0,
    Task_clarification: 0,
    Syntax_error_fix: 0,
    Implementation_challenge: 0,
    Failing_test_case_fix: 0,
    Post_completion_code_refinement: 0,
  });
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState({});
  
  const getMessages = async () => {
    if (session.type === "Vizmental") {

      processMessages(messages);
    }
  };
  
  useEffect(() => {
    getMessages();
  }, [session, messages]);

  useEffect(() => {
    const unsubscribe = subscribeToAIMessageInSession(session.id, setMessages);
    return () => {
      unsubscribe();
    }
  }, [session, messages]);
  
  const processMessages = (messages) => {
    let questionCounts = {
      Avg_question_per_student: 0,
      Task_clarification: 0,
      Syntax_error_fix: 0,
      Implementation_challenge: 0,
      Failing_test_case_fix: 0,
      Post_completion_code_refinement: 0,
    };
    let totalQuestions = 0;

    messages.forEach((message) => {
      if (message.recipient_id === -4) {
        totalQuestions++;
        if (message.question_type && questionCounts.hasOwnProperty(message.question_type)) {
          questionCounts[message.question_type]++;
        }
      }
    });
    questionCounts['Avg_question_per_student'] = (totalQuestions / session.stu_num).toFixed(1);
    setQuestionCategories(questionCounts);
  };
  
  const handleToggle = () => {
    setOpen(!open);
    if(open) getMessages();
  };

  const handleCategoryClick = (category) => {
    setOpenCategories((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const filteredMessagesByCategory = (category) => {
    return messages.filter(message => message.question_type === category);
  };

  return (
    <div className="group-info-test"> 
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <Typography variant="h6" fontWeight={'light'}>
          AI-Chat Interaction
        </Typography>
        <Typography variant="h6" fontWeight={'light'}>
        Avg Questions/Student: {questionCategories.Avg_question_per_student}
        </Typography>
      </div>
      <Collapse in={true} timeout="auto" unmountOnExit> {/* Always expanded */}
        <List>
          {Object.entries(questionCategories).map(([category, count]) => (
            <div key={category}>
              {category !== 'Avg_question_per_student' && (
                <>
                  <ListItemButton onClick={() => handleCategoryClick(category)} sx={{ border: '1px solid grey', borderRadius: '8px' }}>
                    <ListItemText primary={`${category} (${count})`} />
                    {openCategories[category] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openCategories[category]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {filteredMessagesByCategory(category).map((message, index) => (
                        <ListItem key={index} sx={{ pl: 4 }}>
                          <ListItemText primary={message.content} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              )}
            </div>
          ))}
        </List>
      </Collapse>
    </div>
  );
}  

export default InteractionList;
