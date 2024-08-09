import React, { useState, useEffect } from 'react';
import { Typography, Grid } from '@mui/material';
import ExersiceTutorial from './ExersiceTutorial';
import '../../css/landing/explore.scss';
import demo from '../../icon/about/demo-video.mp4';

const ExplorePanel = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [exercise, setExercise] = useState(""); // State for exercise
    const [currentStatIndex, setCurrentStatIndex] = useState(0); // State for current statistic index

    const handleTutorialClick = (selectedExercise) => {
        setModalOpen(true);
        setExercise(selectedExercise);
    }

    const statistics = [{
        title: "Class Sessions Conducted",
        value: 33
    },
    {
        title: "Students Engaged in VizPI-Powered Sessions",
        value: 2586
    },
    {
        title: "Groups Formed in Real-Time Classes",
        value: 765
    }];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStatIndex((prevIndex) => (prevIndex + 1) % statistics.length);
        }, 5000); // Change statistic every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className="intro-container">
                <Grid container spacing={3}>
                    <Grid item xs={8}>
                        <Typography variant='h2' className="header-text">
                            Welcome to VizPI
                        </Typography>
                        <Typography variant='body1' className="intro-text">
                            VizPI leverages AI to enhance real-time collaborative programming learning, providing instructors with tools to monitor and improve student interactions during coding activities. Explore our project, meet our team, and discover our key findings that are revolutionizing collaborative education.
                        </Typography>
                        <br />
                        <Typography variant='body1' className="intro-text">
                            Click on the video below to see a brief intro on our platform.
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <div className="stat-container">
                            
                            <Typography variant='h4'  className="descirption-value">
                                {statistics[currentStatIndex].value}
                            </Typography>
                            <Typography variant='h6' className="descirption-text">
                                {statistics[currentStatIndex].title}
                            </Typography>
                        </div>
                    </Grid>
                </Grid>
                <hr className="division-line" />
            </div>
            <div className="video-container">
                <video width="100%" height="auto" controls>
                    <source src={demo} type="video/mp4" />
                </video>
            </div>
            <div className="intro-container">
                <Typography variant='h2' className="exersice-header-text">
                    Exercise Overview
                </Typography>
                <Typography variant='body1' className="intro-text">
                    VizPI has developed a range of innovative exercise. Click on any exercise to view a brief tutorial on how to use it and to understand the distinctions between the instructor's and the student's perspectives.
                </Typography>
                <hr className="division-line" />
            </div>
            <div className="grid-container">
                <div className="grid-item" onClick={() => handleTutorialClick("Auto Grouping")}>
                    <div className="grid-item-description">
                        Facilitates grouping mechanisms that allow for peer instructions and group discussions
                    </div>
                    <div className="hexagon-background"></div>
                    <div className="grid-item-content">
                        Auto Grouping
                    </div>
                </div>
                <div className="grid-item" onClick={() => handleTutorialClick("Audio")}>
                    <div className="grid-item-description">
                        Generates transcripts of real-time discussions and provides AI-generated insights into the progress of the conversations
                    </div>
                    <div className="hexagon-background"></div>
                    <div className="grid-item-content">
                        Audio Discussion
                    </div>
                </div>
                <div className="grid-item" onClick={() => handleTutorialClick("Helper/Helpee")}>
                    <div className="grid-item-description">
                        Allows students who have mastered the tasks to assist struggling peers through a chat system
                    </div>
                    <div className="hexagon-background"></div>
                    <div className="grid-item-content">
                        Helper/Helpee
                    </div>
                </div>
                <div className="grid-item" onClick={() => handleTutorialClick("Blockly")}>
                    <div className="grid-item-description">
                        Enables coding through a visualized format by building up blocks
                    </div>
                    <div className="hexagon-background"></div>
                    <div className="grid-item-content">
                        Blockly
                    </div>
                </div>
                <div className="grid-item" onClick={() => handleTutorialClick("Vizmental")}>
                    <div className="grid-item-description">
                        Provides a personalized AI assistant that guides and encourages students throughout their coding process
                    </div>
                    <div className="hexagon-background"></div>
                    <div className="grid-item-content">
                        Vizmental
                    </div>
                </div>
            </div>
            {modalOpen && <ExersiceTutorial exercise={exercise} onClose={() => setModalOpen(false)} />}
        </div>
    );
};

export default ExplorePanel;
