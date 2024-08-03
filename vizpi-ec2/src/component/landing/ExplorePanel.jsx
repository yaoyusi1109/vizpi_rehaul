import React from 'react';
import { useState } from 'react';
import { Typography } from '@mui/material';
import ExersiceTutorial from './ExersiceTutorial';
import '../../css/landing/explore.scss';
import demo from '../../icon/about/demo-video.mp4';

const ExplorePanel = () => {
    const [modalOpen, setModalOpen] = useState(false); 
    const [exercise, setExercise] = useState(""); // State for exercise

    const handleTutorialClick = (selectedExercise) => {
        setModalOpen(true);
        setExercise(selectedExercise);
    }

    return (
        <div>
            <div className="intro-container">
                <Typography variant='h2' className="header-text">
                    Welcome to VizPI
                </Typography>
                <Typography variant='body1' className="intro-text">
                    VizPI is an innovative interface designed to facilitate in-class peer programming sessions.
                </Typography>
                <Typography variant='body1' className="intro-text" >
                    Click on the video to see a brief intro on our platform.
                </Typography>
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
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad quaerat consequatur repellendus voluptas id impedit. Fugiat, quis voluptate, itaque alias enim vel ut qui quaerat harum porro assumenda, voluptatum in?
                </Typography>
                <Typography variant='body1' className="intro-text">
                    Click on any exercise to see a brief tutorial on how to use it.
                </Typography>
                <hr className="division-line" />

            </div>
            
            <div className="grid-container">
                <div className="grid-item" onClick={() => handleTutorialClick("Auto Grouping")}>
                    <div className="grid-item-description">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. In maiores ullam 
                    </div>
                    <div className="hexagon-background"></div>
                    <div className="grid-item-content">
                        Auto Grouping
                    </div>
                </div>
                <div className="grid-item" onClick={() => handleTutorialClick("Audio")}>
                    <div className="grid-item-description">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. In maiores ullam provident 
                    </div>
                    <div className="hexagon-background"></div>
                    <div className="grid-item-content">
                        Audio
                    </div>
                </div>
                <div className="grid-item" onClick={() => handleTutorialClick("Helper/Helpee")}>
                    <div className="grid-item-description">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                    </div>
                    <div className="hexagon-background"></div>
                    <div className="grid-item-content">
                        Helper/Helpee
                    </div>
                </div>
                <div className="grid-item" onClick={() => handleTutorialClick("Blockly")}>
                <div className="grid-item-description">
                        Lorem ipsum dolor, sit amet consectetur maiores ullam provident odio
                    </div>
                    <div className="hexagon-background"></div>
                    <div className="grid-item-content">
                        Blockly
                    </div>
                </div>
                <div className="grid-item" onClick={() => handleTutorialClick("Vizmental")}>
                    <div className="grid-item-description">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. In maiores ullam provident odio
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