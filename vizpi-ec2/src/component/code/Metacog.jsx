import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Box, Typography, Button, TextField, Radio,RadioGroup,FormControlLabel } from '@mui/material';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import '../../css/code.scss';

const Metacog = ({
  response,
  collectingKeystrokes,
  confirmedAnalysis,
  handleSubmitUncertainResponse,
  handleSelectDifficulty,
  handleConfirmAnalysis,
  askAI,
  selectedOutput
}) => {
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedValue, setSelectedValue] = React.useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  
  const handleDragStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };


  useEffect(() => {
    if (confirmedAnalysis) {
      setShowModal(true);
      setTimeLeft(3); // Reset the countdown timer
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setShowModal(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [confirmedAnalysis]);

  return (
    <>
      {confirmedAnalysis || response === "Start writing your code and get real-time meta-cognitive feedback." || response === "Analyzing..." ? (
        <div className="codeOutputArea">
          {confirmedAnalysis && (
            selectedOutput !== "Metacog" ? (
              showModal && (
                <Draggable position={position} onStop={handleDragStop}>
                <Box 
                  sx={{ 
                    alignContent: "flex-start", 
                    display: "flex", 
                    flexDirection: "column", 
                    position: 'fixed',
                    top: '50%',
                    right: '30%',
                    width: '20%', 
                    bgcolor: 'background.paper', 
                    boxShadow: 24, 
                    p: 4, 
                    overflow: 'auto', 
                    maxHeight: '30%',
                    overflowY: 'auto', 
                    borderRadius: '8px',
                    zIndex: 1300,
                    cursor: 'move'

                  }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'move', marginBottom:2}}>
                      <BubbleChartIcon sx={{ marginRight: '8px', color: '#25BE28' }} />
                      Metacog
                    </Box>
                    <div className='speechbubble'>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                        Thank you for confirming. Your response has been recorded.
                      </Typography>
                    </div>
                    <div className="speechbubble" style={{ width: "80%" }}>
                      {response}
                    </div>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', padding: '10px 0',color:"red"}}>
                      Closing in {timeLeft}...
                    </Typography>
                  </Box>
                </Draggable>
              )
            ) : (
            <div className='speechbubble'>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                Thank you for confirming. Your response has been recorded.
              </Typography>
            </div>)

          )}
          <div className="speechbubble" style={{ width: "80%" }}>
            {response}
          </div>
          {/* {collectingKeystrokes && (
            <div className="speechbubble">
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                Collecting keystrokes...
              </Typography>
            </div>
          )} */}
        </div>
      ) : (
        (() => {
          if (!response || response === "" || response === undefined || response.length === 0) {
            askAI("");
            return;
          }
          let parsedResponse;
          try {
            parsedResponse = JSON.parse(response);
          } catch (e) {
            console.error(e);
            askAI("");
            return;
          }

          if (parsedResponse[0]?.level === "0") {
            return selectedOutput !== "Metacog" ? (
              <Draggable position={position} onStop={handleDragStop}>
                <Box 
                  sx={{ 
                    alignContent: "flex-start", 
                    display: "flex", 
                    flexDirection: "column", 
                    position: 'fixed',
                    top: '50%',
                    right: '30%',
                    width: '20%', 
                    bgcolor: 'background.paper', 
                    boxShadow: 24, 
                    p: 4, 
                    overflow: 'auto', 
                    maxHeight: '30%',
                    overflowY: 'auto', 
                    borderRadius: '8px',
                    zIndex: 1300,
                    cursor: 'move'

                  }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'move', marginBottom:2}}>
                    <BubbleChartIcon sx={{ marginRight: '8px', color: '#25BE28' }} />
                    Metacog
                  </Box>
                  <div className='speechbubble'>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                  I am not able to identify your mental processes yet. Tell me more!
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                      e.g. "I am thinking about a good name for the parameters."
                    </Typography>
                  </div>
                  <TextField
                    id="outlined-multiline-static"
                    label="Describe the mental process you are having"
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{ width: '90%', backgroundColor: 'white' }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
                    <Button onClick={handleSubmitUncertainResponse} sx={{ width: "20%" }}>Submit</Button>
                  </Box>
                  {/* {collectingKeystrokes && (
                  <div className="speechbubble">
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                      Collecting keystrokes...
                    </Typography>
                  </div>
                )} */}
                </Box>
              </Draggable>
            ) : (
              <Box className="codeOutputArea" sx={{ alignContent: "flex-start", display: "flex", flexDirection: "column" }}>
                <div className='speechbubble'>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                I am not able to identify your mental processes yet. Tell me more!
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                  e.g. "I am thinking about a good name for the parameters."
                  </Typography>
                </div>
                <TextField
                  id="outlined-multiline-static"
                  label="Describe the mental process you are having"
                  multiline
                  rows={4}
                  variant="outlined"
                  sx={{ width: '90%', backgroundColor: 'white' }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
                  <Button onClick={handleSubmitUncertainResponse} sx={{ width: "20%" }}>Submit</Button>
                </Box>
                {collectingKeystrokes && (
                  <div className="speechbubble">
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                      Collecting keystrokes...
                    </Typography>
                  </div>
                )}
              </Box>
            );
          } else if (parsedResponse.length > 1) {
            return selectedOutput !== "Metacog" ? (
              <Draggable position={position} onStop={handleDragStop}>
                <Box 
                  sx={{ 
                    alignContent: "flex-start", 
                    display: "flex", 
                    flexDirection: "column", 
                    position: 'fixed',
                    top: '50%',
                    right: '30%',
                    width: '20%', 
                    bgcolor: 'background.paper', 
                    boxShadow: 24, 
                    p: 4, 
                    overflow: 'auto', 
                    maxHeight: '30%',
                    overflowY: 'auto', 
                    borderRadius: '8px',
                    zIndex: 1300,
                    cursor: 'move'

                  }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'move', marginBottom:2}}>
                    <BubbleChartIcon sx={{ marginRight: '8px', color: '#25BE28' }} />
                    Metacog
                  </Box>
                  <div className="speechbubble">
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                      Select the mental process you are currently going through:
                    </Typography>
                  </div>
                  <div className="speechbubble">
                    <RadioGroup value={selectedValue} onChange={handleChange}>
                      {parsedResponse.map((item, index) => (
                        <FormControlLabel
                          key={index}
                          value={item.guesses}
                          control={<Radio />}
                          label={item.guesses}
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: '13px' } }}
                          />
                      ))}
                    </RadioGroup>
                    <Button
                      onClick={() => {
                        if (selectedValue) {
                          handleSelectDifficulty(selectedValue);
                        }
                      }}
                      variant = "outlined"
                      color = "success"
                      sx={{marginTop: '10px'}}
                    >
                      Submit
                    </Button>
                  </div>
                  {/* 
                  {collectingKeystrokes && (
                  <div className="speechbubble">
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                      Collecting keystrokes...
                    </Typography>
                  </div>
                )} */}
                </Box>
              </Draggable>
            ) : (
              <Box className="codeOutputArea">
                <div className="speechbubble">
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                Select the mental process you are currently going through:
                  </Typography>
                </div>
                {/* <div className="speechbubble">
                  {parsedResponse.map((item, index) => (
                    <Typography
                      key={index}
                      variant="subtitle2"
                      sx={{
                        padding: '10px 0',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.1)'
                        }
                      }}
                      onClick={() => handleSelectDifficulty(item.guesses)}
                    >
                      {index} - {item.guesses}
                    </Typography>
                  ))}
                </div> */}
                  <div className="speechbubble">
                    <RadioGroup value={selectedValue} onChange={handleChange}>
                      {parsedResponse.map((item, index) => (
                        <FormControlLabel
                          key={index}
                          value={item.guesses}
                          control={<Radio />}
                          label={item.guesses}
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: '13px' } }}
                          />
                      ))}
                    </RadioGroup>
                    <Button
                      onClick={() => {
                        if (selectedValue) {
                          handleSelectDifficulty(selectedValue);
                        }
                      }}
                      variant = "outlined"
                      color = "success" 
                      sx={{marginTop: '10px'}}
                    >
                      Submit
                    </Button>
                  </div>
                {collectingKeystrokes && (
                  <div className="speechbubble">
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                      Collecting keystrokes...
                    </Typography>
                  </div>
                )}
              </Box>
            );
          } else if (parsedResponse.length === 1) {
            return selectedOutput !== "Metacog" ? (
              <Draggable position={position} onStop={handleDragStop}>
                <Box 
                  sx={{ 
                    alignContent: "flex-start", 
                    display: "flex", 
                    flexDirection: "column", 
                    position: 'fixed',
                    top: '50%',
                    right: '30%',
                    width: '20%', 
                    bgcolor: 'background.paper', 
                    boxShadow: 24, 
                    p: 4, 
                    overflow: 'auto', 
                    maxHeight: '30%',
                    overflowY: 'auto', 
                    borderRadius: '8px',
                    zIndex: 1300,
                    cursor: 'move'
                  }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'move', marginBottom:2}}>
                    <BubbleChartIcon sx={{ marginRight: '8px', color: '#25BE28' }} />
                    Metacog
                  </Box>
                  <div className="speechbubble">
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                  You are likely thinking about:
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                    {parsedResponse[0].guesses}
                    </Typography>
                  </div>
                  <div className="speechbubble">
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                  Is the AI generating a correct analysis of your activity?
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '10px', justifyContent: "space-evenly" }}>
                      <Button variant="outlined" color="success" onClick={() => handleConfirmAnalysis(true, parsedResponse[0].guesses)}>Yes</Button>
                      <Button variant="outlined" color="error" onClick={() => handleConfirmAnalysis(false)}>No</Button>
                    </Box>
                  </div>
                  {/* {collectingKeystrokes && (
                  <div className="speechbubble">
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                      Collecting keystrokes...
                    </Typography>
                  </div>
                )} */}
                </Box>
              </Draggable>
            ) : (
              <Box className="codeOutputArea">
                <div className="speechbubble">
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                You are likely thinking about:
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                  {parsedResponse[0].guesses}
                  </Typography>
                </div>
                <div className="speechbubble">
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                Is the AI generating a correct analysis of your activity?
                  </Typography>
                  <Box sx={{ display: 'flex', gap: '10px', justifyContent: "space-evenly" }}>
                    <Button variant="outlined" color="success" onClick={() => handleConfirmAnalysis(true, parsedResponse[0].guesses)}>Yes</Button>
                    <Button variant="outlined" color="error" onClick={() => handleConfirmAnalysis(false)}>No</Button>
                  </Box>
                </div>
                {collectingKeystrokes && (
                  <div className="speechbubble">
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                    Collecting keystrokes...
                    </Typography>
                  </div>
                )}
              </Box>
            );
          } else {
            askAI("");
          }
        })()
      )}
    </>
  );
};

export default Metacog;
