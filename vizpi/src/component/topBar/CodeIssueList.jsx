import * as React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import CodeIssueListItem from "./CodeIssueListItem";
import { useContext } from "react";
import { extractErrorInfo } from "../../service/errorService";
import { useState } from "react";
import { useEffect } from "react";
import { SubmissionsContext } from "../../context/SubmissionsContext";
import { Button, Typography, List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import { GroupsContext } from '../../context/GroupsContext'
import { getUsersSortedByProgress } from "../../service/sessionService";
import { SessionContext } from '../../context/SessionContext'
import {getCodeById} from '../../service/codeService'
import {getUserById} from '../../service/userService'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'
import { getQuizData } from "../../tool/progressUnit";
import "../../css/codeissue.scss";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";

export default function CodeIssueList() {
	const [processedErrors, setProcessedErrors] = useState([]);
	const { submissions } = useContext(SubmissionsContext);
	const [notPassedError, setNotPassedError] = useState(null);
	const [swap, setSwap] = useState(true);
	const { groupsInSession } = useContext(GroupsContext)
	const { session } = useContext(SessionContext)
	const [helpBoard, setHelpBoard] = useState({})
	const { selectedCode, setSelectedCode } = useContext(SelectedCodeContext)
	const [quizStats, setQuizStats] = useState({});
	const [quizEnable, setQuizEnable] = useState(false);
	const [open, setOpen] = React.useState(true);

	let checker = arr => arr.every(v => v === true);

	useEffect(() => {
		if (!submissions) return;
		fetchErrors();
		fetchNotPassedSubmissions();
	}, [submissions]);

	useEffect(() => {
		fetchLeaderboard()
	}, [groupsInSession, session]);

	useEffect(() => {
		if (!session) return;
	
		const updateQuizStats = async () => {
			const quizStat = await getQuizData(session.id);
			setQuizStats(quizStat);
		};
	
		const enableQuiz = async () => { 
			setQuizEnable(session?.enable_quiz);
		};
		updateQuizStats();
		enableQuiz();
			const delayUpdate = setTimeout(() => {
			updateQuizStats();
			enableQuiz();
		}, 20000); 
	
		return () => clearTimeout(delayUpdate);
	}, [session.stu_num, session.enable_quiz, session.id, session]);
	
	const fetchLeaderboard = async () => {
		let leaderboard = {}
		let users = await getUsersSortedByProgress(session)
		//console.log(users)
		for(const user of users){
			leaderboard[user.id]={
				user: user,
				count: 0
			}
		}
		groupsInSession.forEach((group) => {
			if(group.name.includes("Help")){
				let words = group.name.split(" ")
				leaderboard[words[1]].count+=1
			}
		})
		setHelpBoard(leaderboard)
		
	};
	const fetchNotPassedSubmissions = () => {
		let notPassedSubmissions = submissions.filter(
			(submission) =>
				submission.result_list &&
				submission.result_list.length !== 0
		);
		let notPassedError = {
			errorType: "Not Passed",
			errorContents: [],
			count: 0,
			users: [],
			codeids: [],
		};
		notPassedSubmissions.forEach((submission) => {
			if(!checker(submission.result_list)){
				notPassedError.errorContents.push(
					"Runs successfully but does not pass all tests"
				);
				notPassedError.count += 1;
				notPassedError.users.push(submission.id);
				notPassedError.codeids.push(submission.code_id);
			}
		});

		setNotPassedError(notPassedError);
	};
	const fetchErrors = () => {
		let errors = submissions
			.filter((submission) => submission.error !== null)
			.map((submission) => {
				return {
					...extractErrorInfo(submission.error),
					codeid: submission.code_id, // Add the codeid to the error object
				};
			});

		const errorMap = {};

		errors.forEach((error) => {
			// If the errorType doesn't exist in errorMap, initialize it
			if (!errorMap[error.errorType]) {
				errorMap[error.errorType] = {
					errorType: error.errorType,
					errorContents: [],
					count: 0,
					users: [],
					codeids: [], // Add an array to store codeids
				};
			}

			errorMap[error.errorType].errorContents.push(error.errorContent);
			errorMap[error.errorType].count += 1;
			errorMap[error.errorType].users.push(error.id);
			errorMap[error.errorType].codeids.push(error.codeid); // Push the codeid
		});

		// Convert the errorMap object to an array of its values
		let result = Object.values(errorMap);
		result = result.sort((a, b) => b.count - a.count);
		setProcessedErrors(result);
	};

	const handleClick = () => {
		setOpen(!open);
	};

	function compare( a, b ) {
		if ( a.count < b.count ){
		  return 1;
		}
		if ( a.count > b.count ){
		  return -1;
		}
		return 0;
	}
	//console.log(Object.values(helpBoard).sort(compare))
	const handleImageClick = async (user) => {
		// //console.log("clicked icon", user, user?.code_id)
		let updatedUser = await getUserById(user.id)
		const code = await getCodeById(updatedUser?.code_id)
		// //console.log("clicked icon", user,code, user?.code_id)
		setSelectedCode(code)
		
	}
	const isQuizStatsValid = quizStats && quizStats.mcq && quizStats.fib;

	return (
		<>
		<div className="outter-box">
			<div className="group-info-test upper-box" >
				{ session.type=="Helper/Helpee"? (
					<Button
					onClick={() =>setSwap(!swap)}
					>
						Swap to {swap?"Leaderboard":"Code Issues"}
					</Button>
				):null}
				{swap ? (
					<List
					sx={{
						width: "100%",
						maxWidth: "100%",
						bgcolor: "background.paper",
						paddingRight: "16px",
						marginLeft: "-16px",
					}}
					component="nav"
					aria-labelledby="nested-list-subheader"
					subheader={
						<ListSubheader component="div" id="nested-list-subheader">
							<center>
								<Typography variant="h4" fontWeight={"light"} gutterBottom>
									Code Issues
								</Typography>
							</center>
						</ListSubheader>
					}
					>
						{processedErrors.map(
							(issue, index) =>
								issue && (
									<div key={index}>
										<CodeIssueListItem
											error={issue.errorType}
											message={issue.errorType}
											content={issue.errorContents}
											total_num={submissions.length}
											error_num={issue.count}
											code_id={issue.codeids}
										/>
									</div>
								)
						)}
						{notPassedError && notPassedError.count !== 0 && (
							<div>
								<CodeIssueListItem
									error={notPassedError.errorType}
									message={notPassedError.errorType}
									content={notPassedError.errorContents}
									total_num={submissions.length}
									error_num={notPassedError.count}
									code_id={notPassedError.codeids}
								/>
							</div>
						)}
					</List>
				):(
					<div style={{alignContent:"center"}}>
						<center>
							<Typography>
								Helper Leaderboard
							</Typography>

							<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
								{Object.values(helpBoard).sort(compare).map((value) => (
								<ListItem
									key={value}
									disableGutters
									dense
									secondaryAction={
										<ListItemText primary={`${value.count} students`} />
									}
									sx={{maxHeight:"2em"}}
								>
									<ListItemButton
									onClick={() => handleImageClick(value.user)}
									>
										<ListItemText primary={`${value.user.first_name.replace("_", " ")} `} />
									</ListItemButton>
									
								</ListItem>
								))}
							</List>
						</center>
						
						
					</div>
				)}
			</div>
			{ quizEnable && ( <div className="group-info-test lower-box">
				<center>
				<ListSubheader component="div" >
						<Typography variant="h5" fontWeight={"light"} gutterBottom>
						Pre-Coding Quiz Performances
						</Typography>
				</ListSubheader>
				{isQuizStatsValid && (
					<Typography variant="subtitle1" fontWeight={380}>
						<>
							Class Passrate: {session.stu_num !== 0 ? `${quizStats.passCount}/${session.stu_num}` : 'N/A'}
							<br />
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<Box>
											Multiple Choice:
										<Typography variant="body2" fontWeight={300}>
											Average attempts: {quizStats.mcq.attempts ? quizStats.mcq.attempts : 'N/A'}
											<br />
											Average accuracy: {quizStats.mcq.accuracy ? quizStats.mcq.accuracy + "%" : 'N/A'}
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={6}>
									<Box>
											Fill-in-the-Blank:
										<Typography variant="body2" fontWeight={300}>
											Average attempts: {quizStats.fib.attempts ? quizStats.fib.attempts : 'N/A'}
											<br />
											Average accuracy: {quizStats.fib.accuracy ? quizStats.fib.accuracy + "%" : 'N/A'}
										</Typography>
									</Box>
								</Grid>
							</Grid>
						</>
					</Typography>
				)}


				</center>
			</div> )}
		</div>
		</>
		
	);
}
