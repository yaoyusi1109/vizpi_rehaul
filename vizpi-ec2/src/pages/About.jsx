import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/about.scss';
import { Typography, Button, Tabs, Tab, Box } from '@mui/material';
import AboutTutorial from '../component/commonUnit/AboutTutorial'; // Import the modal component

const About = () => {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false); // State for modal
    const [exercise, setExercise] = useState(""); // State for exercise
    const [value, setValue] = useState(0); // State for tabs

    const handleLogin = () => {
        navigate("/login");
    }

    const handleTutorialClick = (selectedExercise) => {
        setModalOpen(true);
        setExercise(selectedExercise);
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const tabs = [
        { label: "Explore" },
        { label: "About Us" },
        { label: "Findings & DataSets" },
        { label: "For Researchers" },
    ];

    return (
        <div className="about-page">
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-brand">
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.1rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}>
                            VizPI
                        </Typography>
                    </div>
                    <div className="navbar-login">
                        <Button
                            onClick={handleLogin}
                            sx={{ my: 2, color: 'white', display: 'block' }}>
                            Login
                        </Button>
                    </div>
                </div>
            </nav>
            <Box sx={{ width: '100%', overflowY: 'hidden' }}>
                <Box
                    sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    }}>
                    <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example">
                    {tabs.map((tab, index) => (
                        <Tab label={tab.label} {...a11yProps(index)} key={index} />
                    ))}
                    </Tabs>
                </Box>
            </Box>
            <div className="intro-container">
                <Typography variant='h2' className="header-text">
                    Welcome to VizPI
                </Typography>
                <Typography variant='body1' className="intro-text">
                    VizPI is an innovative interface designed to facilitate in-class peer programming sessions.
                </Typography>
                <Typography variant='body1' className="intro-text" gutterBottom>
                    Click on any exercise to see a brief tutorial on how to use it.
                </Typography>
            </div>
            <div className="feature-container">
                <div className="grid-container">
                    <div className="grid-item" onClick={() => handleTutorialClick("Auto Grouping")}>
                        <div className="hexagon-background"></div>
                        <div className="grid-item-content">
                            Auto Grouping
                            {/* <img src={AutoGrouping} alt="Auto Grouping" className="grid-item-image" /> */}
                        </div>
                    </div>
                    <div className="grid-item" onClick={() => handleTutorialClick("Audio")}>
                        <div className="hexagon-background"></div>
                        <div className="grid-item-content">
                            Audio
                            {/* <img src={Audio} alt="Audio" className="grid-item-image" /> */}
                        </div>
                    </div>
                    <div className="grid-item" onClick={() => handleTutorialClick("Helper/Helpee")}>
                        <div className="hexagon-background"></div>
                        <div className="grid-item-content">
                            Helper/Helpee
                            {/* <img src={HelperHelpee} alt="Helper/Helpee" className="grid-item-image" /> */}
                        </div>
                    </div>
                    <div className="grid-item" onClick={() => handleTutorialClick("Blockly")}>
                        <div className="hexagon-background"></div>
                        <div className="grid-item-content">
                            Blockly
                            {/* <img src={Blockly} alt="Blockly" className="grid-item-image" /> */}
                        </div>
                    </div>
                    <div className="grid-item" onClick={() => handleTutorialClick("Vizmental")}>
                        <div className="hexagon-background"></div>
                        <div className="grid-item-content">
                            {/* <img src={Vizmental} alt="Vizmental" className="grid-item-image" /> */}
                            Vizmental
                        </div>
                    </div>
                </div>
            </div>

            {modalOpen && <AboutTutorial exercise={exercise} onClose={() => setModalOpen(false)} />}
        </div>
    );
};

export default About;
