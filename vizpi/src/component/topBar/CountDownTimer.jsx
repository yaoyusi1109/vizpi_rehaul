import {
    Box,
    CircularProgress,
    Typography
  } from "@mui/material";
  import { findIndex, forEach } from "lodash";
  import { useEffect, useState, useMemo } from "react";
  
  //NOTE:
  //In Code Sandbox these methods throw error while clearing the interval,
  //but works fine in a actual project
  // import { clearInterval, setInterval } from "worker-timers";
  

  const CountDownTimer = (props) => {
    const { duration, colors = [], colorValues = [], onComplete } = props;
  
    const [timeDuration, setTimeDuration] = useState(duration);
    const [countdownText, setCountdownText] = useState();
    const [countdownPercentage, setCountdownPercentage] = useState(100);
    const [countdownColor, setCountdownColor] = useState("#004082");
  
    useEffect(() => {
      let intervalId = setInterval(() => {
        setTimeDuration((prev) => {
          const newTimeDuration = prev - 1;
          const percentage = Math.ceil((newTimeDuration / timeDuration) * 100);
          setCountdownPercentage(percentage);
  
          if (newTimeDuration === 0) {
            clearInterval(intervalId);
            intervalId = null;
            onComplete();
          }
  
          return newTimeDuration;
        });
      }, 1000);
  
      return () => {
        clearInterval(intervalId);
        intervalId = null;
      };
    }, []);
  
    useEffect(() => {
      const minutes = Math.floor(timeDuration / 60);
      const seconds = timeDuration % 60;
      setCountdownText(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
    }, [timeDuration]);
  
    useEffect(() => {
      for (let i = 0; i < colorValues.length; i++) {
        const item = colorValues[i];
        if (timeDuration === item) {
          setCountdownColor(colors[i]);
          break;
        }
      }
    }, [timeDuration]);
  
    return (
      <>
        <Box sx={{position: "relative",width: "80px",height: "auto",backgroundColor: "#1976d2",display: "flex",flexDirection: "column",alignItems: "center",justifyContent: "center"}}>
          <Box sx={{position: "relative"}}>
            <CircularProgress
              variant="determinate"
              sx={{color: "#b2b2b2"}}
              size={35}
              thickness={4}
              value={100}
            />
            <CircularProgress
              sx={{
                animationDuration: "100ms",
                position: "absolute",
                left: 0
              }}
              classes={{
                circle: {
                  strokeLinecap: "round"
                }
              }}
              variant="determinate"
              size={35}
              thickness={4}
              value={countdownPercentage}
              style={{
                transform: "scaleX(-1) rotate(-90deg)",
                color: countdownColor
              }}
            />
          </Box>
          <Typography sx={{fontWeight: "bold",fontSize: "1em",}}>{countdownText}</Typography>
        </Box>
      </>
    );
  };
  
  export default CountDownTimer;
  