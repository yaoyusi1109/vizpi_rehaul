import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/landing/explore.scss';
import { Typography, Button, Tabs, Tab, Box } from '@mui/material';
import ExplorePanel from '../component/landing/ExplorePanel';
import AboutUsPanel from '../component/landing/AboutUsPanel';
import FindingsPanel from '../component/landing/FindingsPanel';
import ResearchersPanel from '../component/landing/ResearchersPanel';
const About = () => {
    const navigate = useNavigate();

    const [selectedPanel, setSelectedPanel] = useState(0); 

    const handleLogin = () => {
        navigate("/login");
    }



    const handleChange = (event, newValue) => {
        setSelectedPanel(newValue);
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
                            className = "navbar-logo">
                            VizPI
                        </Typography>
                    </div>

                    <Tabs  value={selectedPanel} onChange={handleChange}>
                    {tabs.map((tab, index) => (
                        <Tab className = "navbar-tab"
                        label={tab.label} {...a11yProps(index)} key={index} />
                    ))}
                    </Tabs>

                    <div className="navbar-login">
                        <Button
                            className='login-button'
                            onClick={handleLogin}>
                            Login
                        </Button>
                    </div>
                </div>
            </nav>
           
            { selectedPanel === 0 && <ExplorePanel/>}
            { selectedPanel === 1 && <AboutUsPanel/>}
            { selectedPanel === 2 && <FindingsPanel/>}
            { selectedPanel === 3 && <ResearchersPanel/>}
            <div className="padding"></div>

            
        </div>
    );
};

export default About;
