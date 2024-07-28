import React from 'react';
import '@fontsource/inter';
import Modal from '@mui/joy/Modal';
import { Button } from '@mui/material';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import ModalClose from '@mui/joy/ModalClose';
import ModalOverflow from '@mui/joy/ModalOverflow';
import ModalDialog from '@mui/joy/ModalDialog';
import Divider from '@mui/joy/Divider';
import Chip from '@mui/joy/Chip';
import autoGroup from '../../icon/SettingPassRate.png';

const contentArrays = {
    "Auto Grouping": [
        {
            src: autoGroup,
            title: 'Auto Grouping Step 1',
            content: 'Description for Auto Grouping Step 1...'
        },
        {
            src: autoGroup,
            title: 'Auto Grouping Step 2',
            content: 'Description for Auto Grouping Step 2...'
        }
    ],
    "Audio": [
        {
            src: autoGroup,
            title: 'Audio Step 1',
            content: 'Description for Audio Step 1...'
        },
        {
            src: autoGroup,
            title: 'Audio Step 2',
            content: 'Description for Audio Step 2...'
        }
    ],
    "Helper/Helpee": [
        {
            src: autoGroup,
            title: 'Helper/Helpee Step 1',
            content: 'Description for Helper/Helpee Step 1...'
        },
        {
            src: autoGroup,
            title: 'Helper/Helpee Step 2',
            content: 'Description for Helper/Helpee Step 2...'
        }
    ],
    "Blockly": [
        {
            src: autoGroup,
            title: 'Blockly Step 1',
            content: 'Description for Blockly Step 1...'
        },
        {
            src: autoGroup,
            title: 'Blockly Step 2',
            content: 'Description for Blockly Step 2...'
        }
    ],
    "Vizmental": [
        {
            src: autoGroup,
            title: 'Vizmental Step 1',
            content: 'Description for Vizmental Step 1...'
        },
        {
            src: autoGroup,
            title: 'Vizmental Step 2',
            content: 'Description for Vizmental Step 2...'
        }
    ]
};

const AboutTutorial = ({ exercise, onClose }) => {
    const contentArray = contentArrays[exercise] || [];

    return (
        <Modal
            aria-labelledby="tutorial-modal-title"
            aria-describedby="tutorial-modal-description"
            open={true}
            onClose={onClose}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <ModalOverflow>
                <ModalDialog
                    aria-labelledby="tutorial-modal-title"
                    aria-describedby="tutorial-modal-description"
                    layout="center">
                    <Sheet
                        variant="outlined"
                        sx={{
                            maxWidth: 1000,
                            borderRadius: 'md',
                            p: 3,
                            boxShadow: 'lg',
                        }}>
                        <ModalClose
                            variant="outlined"
                            sx={{
                                top: 'calc(-1/4 * var(--IconButton-size))',
                                right: 'calc(-1/4 * var(--IconButton-size))',
                                boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
                                borderRadius: '50%',
                                bgcolor: 'background.surface',
                            }}
                        />
                        <Divider>
                            <Chip variant="soft" color="neutral" size="lg" sx={{ fontSize: '1rem' }}>
                                {exercise} Tutorial
                            </Chip>
                        </Divider>
                        {contentArray.map((content, index) => (
                            <div key={index}>
                                <Typography
                                    component="h2"
                                    id="tutorial-modal-title"
                                    level="h4"
                                    textColor="inherit"
                                    fontWeight="lg"
                                    mb={1}>
                                    {content.title}
                                </Typography>
                                <Typography
                                    id="tutorial-modal-description"
                                    textColor="text.tertiary"
                                    sx={{ paddingBottom: 20 }}>
                                    {content.content}
                                </Typography>
                                <img
                                    className="tutorialImage"
                                    src={content.src}
                                    alt={content.title}
                                    style={{
                                        maxHeight: 600,
                                        maxWidth: 1000,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingTop: 30,
                                    }}
                                />
                            </div>
                        ))}
                        <Button onClick={onClose} sx={{ mt: 2 }}>
                            Close
                        </Button>
                    </Sheet>
                </ModalDialog>
            </ModalOverflow>
        </Modal>
    );
};

export default AboutTutorial;
