
import React, { useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { Typography } from '@mui/material';
import "../../css/taskcard.scss";

const StudentID = () => {
    const { currentUser } = useContext(AuthContext);

    return (
        <div className="taskCard">
            <Typography variant="h6">Student ID: {currentUser.id}</Typography>
        </div>
    );
};

export default StudentID;
