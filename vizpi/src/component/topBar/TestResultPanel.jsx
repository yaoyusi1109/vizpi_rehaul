import React, { useContext, useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import { SessionContext } from "../../context/SessionContext";
import { getCodeById } from "../../service/codeService";
import { filterProfanity } from "../../tool/profanityFilter";
import { getUserInSession } from "../../service/userService";
import { getGroupById } from "../../service/groupService";
import { AuthContext } from "../../context/AuthContext";
import { SelectedCodeContext } from "../../context/SelectedCodeContext";
import { Alert } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Link from '@mui/material/Link';
import  TestResultListItem from "./TestResultListItem"
import { TestPanelContext } from "../../context/TestPanelContext";


const TestResultPanel = () => {
  const [nameList, setNameList] = useState([]);
  const { session } = useContext(SessionContext);
  const { submissions } = useContext(SessionContext);
  const { testPanel, setTestPanel, testName, studPassArray, studIndex } = useContext(TestPanelContext);

  useEffect(() => {
    //console.log("Index", studIndex);
  }, [session, submissions]);

  const handleClick = () => {
    setTestPanel(!testPanel);
  };
  return (
    <div className="group-info-test">
      <Link component="button" onClick={handleClick}> Back to Class Performance </Link>
      <Typography variant="h6" fontWeight={"light"} gutterBottom>TestName: {testName}</Typography>
      <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" sx={{height: 50}}>
        This is a success alert — check it out!
      </Alert>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 400 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Submission</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studPassArray.map((row, index) => (
               <TableRow
               key={index}
               hover={'true'}
             >
               <TableCell>
                 {row.name}
               </TableCell>
               <TableCell>
                 <Button variant='outlined' >
                   <Typography fontSize={10}>Inspect Code</Typography>
                 </Button>
               </TableCell>
             </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
  );
};

export default TestResultPanel;
