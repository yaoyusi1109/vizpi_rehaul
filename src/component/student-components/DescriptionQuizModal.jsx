import React, { useState, useEffect, useContext } from "react";
import { Divider, Box, Button, Typography, Modal, TextField, FormControl, FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material';
import { SessionContext } from '../../context/SessionContext';
import { AuthContext } from '../../context/AuthContext';
import Loading from '../commonUnit/Loading';
import { functionNameDetect } from '../../tool/functionNameDetect';
import { addQuizStatsInUser } from '../../service/userService';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    maxHeight: '50vh',
    overflowY: 'auto',
    padding: '30px',
};

const DescriptionQuizModal = () => {
    const [open, setOpen] = useState(false);
    const [everCorrect, setEverCorrect] = useState(false);
    const { session } = useContext(SessionContext);
    const { currentUser } = useContext(AuthContext);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [everSubmit, setEverSubmit] = useState(false);
    const [hint, setHint] = useState('');
    const [functionName, setFunctionName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ correct_count: 0, attempts: 0 });
    const [correctCount, setCorrectCount] = useState(0);
    const [correctness, setCorrectness] = useState({});

    useEffect(() => {
        const hasSeenModal = localStorage.getItem('hasSeenModal');
        if (hasSeenModal === 'true') {
            setOpen(false);
            setIsLoading(false);
            return; 
        } else {
            setOpen(true);
        }

        const loadQuizQuestions = async () => {
            if (session.quiz) {
                try {
                    setIsLoading(true);
                    // const detectedFunctionName = await functionNameDetect(session.task);
                    const questions = currentUser.id % 2 === 0 ? session.quiz.multipleChoice : session.quiz.unitTests;
                    setFunctionName(session.quiz.functionName);
                    setQuizQuestions(questions);
                    setAnswers(questions.reduce((acc, question, index) => ({ ...acc, [index]: '' }), {}));
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error getting quiz questions:', error);
                    setIsLoading(false);
                }
            }
        };
        loadQuizQuestions();
    }, [session, currentUser.id, functionName]);

    if (isLoading) return <Loading />;

    const handleInputChange = (index, value) => {
        setAnswers(prev => ({ ...prev, [index]: value }));
    };

    const checkAnswers = async () => {
        let correct_count = 0;
        const newCorrectness = {};

        quizQuestions.forEach((question, index) => {
            const correctAnswer = question.return;
            if (answers[index].trim() === correctAnswer) {
                correct_count++;
                newCorrectness[index] = true;
            } else {
                newCorrectness[index] = false;
            }
        });

        setCorrectCount(prev => prev + correct_count);
        setCorrectness(newCorrectness);

        if (!everCorrect) {
            let updatedStats;
            const newCorrectCount = correctCount + correct_count;

            if (stats === null || !stats) {
                updatedStats = {
                    attempts: 1,
                    accuracy: (newCorrectCount / 2) * 100,
                    quiz_type: currentUser.id % 2 === 0 ? "multipleChoice" : "fillInTheBlank"
                };
            } else {
                const total_attempts = stats.attempts + 1;
                const accuracy = (newCorrectCount / (total_attempts * 2)) * 100;

                updatedStats = {
                    attempts: total_attempts,
                    accuracy: accuracy,
                    quiz_type: currentUser.id % 2 === 0 ? "multipleChoice" : "fillInTheBlank"
                };
            }
            setStats(updatedStats);
        } else {
            //console.log("already answered correctly");
        }

        if (!everSubmit) setEverSubmit(true);

        if (correct_count === quizQuestions.length) {
            setEverCorrect(true);
            setHint('All answers are correct! You may proceed to coding.');
            localStorage.setItem('hasSeenModal', 'true');
        } else {
            setHint("Hint: " + session.quiz.hint);
        }
    };

    const handleClose = async () => {
        await addQuizStatsInUser(currentUser.id, stats);
        setOpen(false);
        localStorage.setItem('hasSeenModal', 'true');
    };

    const renderQuestionInput = (question, index) => {
        return (
            <div key={index}>
                {currentUser.id % 2 === 0 ? (
                    <FormControl component="fieldset">
                        <Typography>
                            {index + 1}. The return value of {functionName}({question.parameter.replace(/;\s/g, ', ')}) should be:
                        </Typography>
                        <RadioGroup
                            aria-label="quiz"
                            name={`quiz_${index}`}
                            value={answers[index]}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                        >
                            {question.choices.map((choice, idx) => (
                                <FormControlLabel key={idx} value={choice} control={<Radio />} label={choice} />
                            ))}
                        </RadioGroup>
                    </FormControl>
                ) : (
                    <TextField
                        label={`Return value of ${functionName}(${question.parameter.replace(/;\s/g, ', ')})`}
                        variant="outlined"
                        value={answers[index]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        fullWidth
                    />
                )}
            </div>
        );
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Modal
                open={open}
                onClose={(_, reason) => reason === 'backdropClick' && setOpen(true)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                slotProps={{
                    backdrop: {
                        onClick: (e) => e.stopPropagation()
                    }
                }}
            >
                <Box sx={style}>
                    <Typography variant="h5">
                        Quiz: Testing your understanding of the Task
                    </Typography>
                    <Divider style={{ backgroundColor: 'black' }} sx={{ mb: 2, mt: 2 }} />
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        These questions ensure you understand the task before coding.
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.main' }}>
                        Task Description: {session?.task}
                    </Typography>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        {quizQuestions.map((question, index) => (
                            <div key={index}>
                                {renderQuestionInput(question, index)}
                                {everSubmit && (
                                    <>
                                        {correctness[index] === true && <Typography color="success.main">✔ Correct</Typography>}
                                        {correctness[index] === false && <Typography color="error.main">✘ Incorrect</Typography>}
                                    </>
                                )}
                            </div>
                        ))}
                    </Stack>
                    {everSubmit && !everCorrect && (
                        <Typography variant="body1" sx={{ mt: 2, color: 'error.main' }}>
                            {hint}
                        </Typography>
                    )}
                    {everCorrect && (
                        <Typography variant="body1" sx={{ mt: 2, color: 'success.main' }}>
                            {hint}
                        </Typography>
                    )}
                    <br />
                    <Stack direction="row" spacing={2}>
                        <Button onClick={checkAnswers} sx={{ mt: 2 }} variant="contained">Submit Answers</Button>
                        {everCorrect && <Button onClick={handleClose} sx={{ mt: 1 }} variant="outlined">Close</Button>}
                    </Stack>
                </Box>
            </Modal>
        </Box>
    );
};

export default DescriptionQuizModal;
