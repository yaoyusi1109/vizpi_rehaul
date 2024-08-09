import React, { useEffect, useState } from 'react';
import '@fontsource/inter';
import Modal from '@mui/joy/Modal';
import { Button } from '@mui/material';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Sheet';
import ModalClose from '@mui/joy/ModalClose';
import Grid from '@mui/joy/Grid';
import Divider from '@mui/joy/Divider';
import autoGroup from '../../icon/SettingPassRate.png';
import '../../css/landing/aboutTutorial.scss';
import blockly from '../../icon/about/Blockly.png';
import { Link, useNavigate } from 'react-router-dom';


const contentArrays = {
    "Auto Grouping": [
        {
            title: 'Exersice Features',
            content: [
                {
                    text: "lorem ipsum dolor sit amet, consectetur adipisicing elit. In maiores ullam provident odio quidem, quas, voluptates, quos doloremque quia quibusdam                     Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis possimus quos numquam expedita magni, vel, ex aliquam inventore nihil libero voluptatem adipisci at molestias ducimus ipsa sunt? Quidem, rerum! Dolor? lorem ipsum dolor sit amet, consectetur adipisicing elit. In maiores ullam provident odio quidem, quas, voluptates, quos doloremque quia quibusdam                     Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis possimus quos numquam expedita magni, vel, ex aliquam inventore nihil libero voluptatem adipisci at molestias ducimus ipsa sunt? Quidem, rerum! Dolor? ",
                    images: [blockly, blockly]
                },
                {
                    text: "Description for Auto Grouping Step 2...",
                    images: [blockly, blockly]
                }
            ]
        },
        {
            title: 'Instructor\'s View',
            content: [
                {
                    text: "Description for Auto Grouping Step 3...",
                    images: [blockly, blockly]
                }
            ]
        },
        {
            title: 'Student\'s View',
            content: [
                {
                    text: "Description for Auto Grouping Step 4...",
                    images: [blockly, blockly]
                }
            ]
        }
    ],
    "Audio": [
        {
            title: 'Features',
            content: [
                {
                    text: "Description for Auto Grouping Step 1...",
                    images: [blockly, blockly]
                },
                {
                    text: "Description for Auto Grouping Step 2...",
                    images: [blockly, blockly]
                }
            ]
        },
        {
            title: 'Auto Grouping Step 2',
            content: [
                {
                    text: "Description for Auto Grouping Step 3...",
                    images: [blockly, blockly]
                }
            ]
        },
        {
            title: 'Auto Grouping Step 3',
            content: [
                {
                    text: "Description for Auto Grouping Step 4...",
                    images: [blockly, blockly]
                }
            ]
        }
    ],
    "Helper/Helpee": [
        {
            title: 'Features',
            content: [
                {
                    text: "Description for Auto Grouping Step 1...",
                    images: [blockly, blockly]
                },
                {
                    text: "Description for Auto Grouping Step 2...",
                    images: [blockly, blockly]
                }
            ]
        },
        {
            title: 'Auto Grouping Step 2',
            content: [
                {
                    text: "Description for Auto Grouping Step 3...",
                    images: [blockly, blockly]
                }
            ]
        },
        {
            title: 'Auto Grouping Step 3',
            content: [
                {
                    text: "Description for Auto Grouping Step 4...",
                    images: [blockly, blockly]
                }
            ]
        }
    ],
    "Blockly": [
        {
            title: 'Features',
            content: [
                {
                    text: "Description for Auto Grouping Step 1...",
                    images: [blockly, blockly]
                },
                {
                    text: "Description for Auto Grouping Step 2...",
                    images: [blockly, blockly]
                }
            ]
        },
        {
            title: 'Auto Grouping Step 2',
            content: [
                {
                    text: "Description for Auto Grouping Step 3...",
                    images: [blockly, blockly]
                }
            ]
        },
        {
            title: 'Auto Grouping Step 3',
            content: [
                {
                    text: "Description for Auto Grouping Step 4...",
                    images: [blockly, blockly]
                }
            ]
        }
    ],
    "Vizmental": [
        {
            title: 'Features',
            content: [
                {
                    text: "Description for Auto Grouping Step 1...",
                    images: [blockly, blockly]
                },
                {
                    text: "Description for Auto Grouping Step 2...",
                    images: [blockly, blockly]
                }
            ]
        },
        {
            title: 'Auto Grouping Step 2',
            content: [
                {
                    text: "Description for Auto Grouping Step 3...",
                    images: [blockly, blockly]
                }
            ]
        },
        {
            title: 'Auto Grouping Step 3',
            content: [
                {
                    text: "Description for Auto Grouping Step 4...",
                    images: [blockly, blockly]
                }
            ]
        }
    ],
};

const AboutTutorial = ({ exercise, onClose }) => {
    const [currentStep, setCurrentStep] = useState("step1");
    const [contentLoaded, setContentLoaded] = useState(false);
    const contentArray = contentArrays[exercise] || [];
    const navigate = useNavigate();


    useEffect(() => {
        if (contentLoaded) {
            const sections = document.querySelectorAll('.tutorial-step');

            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.2,
            };

            const observer = new IntersectionObserver((entries) => {
                const visibleEntries = entries.filter(entry => entry.isIntersecting);
                if (visibleEntries.length === 1) {
                    setCurrentStep(visibleEntries[0].target.id)
                }else if (visibleEntries.length > 0) {
                    visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                    setCurrentStep(visibleEntries[0].target.id);
                }
            }, options);

            sections.forEach(section => {
                observer.observe(section);
            });

            return () => {
                sections.forEach(section => {
                    observer.unobserve(section);
                });
            };
        }
    }, [contentLoaded]);

    useEffect(() => {
        if(!contentLoaded){
            setContentLoaded(true);
        }
    }, []);
    const handleLogin = () => {
        navigate("/login");
    }

    return (
        <Modal
            aria-labelledby="tutorial-modal-title"
            aria-describedby="tutorial-modal-description"
            open={true}
            onClose={onClose}
        >
            <Box className="tutorial-wrapper">
                <ModalClose
                    variant="outlined"
                    className="tutorial-close"
                />
                <Grid container>
                    <Grid item xs={2}>
                        <div className="sidebar">
                            <ul>
                                {contentArray.map((item, index) => (
                                    <li key={index}>
                                        <a
                                            href={`#step${index + 1}`}
                                            onClick = {() => setCurrentStep(`step${index + 1}`)}
                                            className = {currentStep === `step${index + 1}` ? 'active-step' : ''}
                                        >
                                            {item.title}
                                        </a>
                                    </li>
                                ))}
                                <li>
                                    <a className ="stickly-close-button" onClick={() => onClose()}> Close </a>
                                </li>
                            </ul>
                        </div>
                    </Grid>
                    <Grid item xs={10}>
                    <div className="content">
                        {contentArray.map((step, index) => (
                            <div key={index} id={`step${index + 1}`} className="tutorial-step">
                                <Typography className="tutorial-modal-title" >
                                    {step.title}
                                </Typography>
                                {step.content.map((item, itemIndex) => (
                                    <div key={itemIndex}>
                                        <Typography className="tutorial-modal-description">
                                            {item.text}
                                        </Typography>
                                        <div >
                                            {item.images.map((src, imgIndex) => (
                                                <img key={imgIndex} src={src} alt={`${step.title} Image ${imgIndex + 1}`} style={{ width: '100%', borderRadius: '8px' }} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {index < contentArray.length - 1 && <Divider />}
                            </div>
                        ))}
                        <div>
                            <Typography className="tutorial-modal-login" >
                                To try out this exercise, please
                                <Button Button
                                    className='login-button'
                                    onClick={handleLogin}>
                                    Login Here
                                </Button>
                            </Typography>
                            
                        </div>
                    </div>
                    </Grid>
                </Grid>

            </Box>
        </Modal>
    );
};

export default AboutTutorial;
