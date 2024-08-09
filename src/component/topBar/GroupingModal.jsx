import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useEffect } from "react";
import {
	groupingInSession,
	removeGroupingInSession,
	setSessionEnableChat,
} from "../../service/sessionService";
import { SessionContext } from "../../context/SessionContext";
import { useContext } from "react";
import { Switch, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { showToast } from "../commonUnit/Toast";
import { Divider } from "@mui/material";
import { AutoGroupingContext } from "../../context/AutoGroupingContext";
import { CurrentStepContext } from "../../context/CurrentStepContext";

const GroupingModal = ({ show, setShow }) => {
	const { session } = useContext(SessionContext);
	const { autoGrouping, setAutoGrouping } = useContext(AutoGroupingContext);
	const { setAutoGroupingRate } = useContext(AutoGroupingContext);
	const [chatEnable, setChatEnable] = useState(false);
	const { setActiveStep } = useContext(CurrentStepContext);

	useEffect(() => {
		setChatEnable(session.enable_chat);
	}, [session]);

	const handleNext = async () => {
		if (!session.stu_num || session.stu_num <= 1) {
			showToast("Please wait for more students", "warning");
			return;
		}
		try {
			const res = await groupingInSession(session, "passrate", 2);
			if (res) {
				showToast("Grouping successfully.", "success");
				setChatEnable(true);
				setActiveStep(1);
			} else {
				showToast("Grouping failed.", "error");
			}
		} catch (error) {
			showToast("An error occurred while removing the group.", "error");
			console.error("Error removing group:", error);
		}

		await setSessionEnableChat(session.id, !chatEnable);
	};

	const handleGroupByPassRate = () => {
		groupingInSession(session, "passrate");
		setShow(false);
	};

	const handleRemoveGrouping = () => {
		removeGroupingInSession(session);
		setShow(false);
	};

	const handleClose = () => {
		setShow(false);
	};

	if (!show) return null;

	return (
		<div className="grouping-modal">
			{/**{session.grouped ? (
          <>
            <p>
              If you want to group again, you need to remove the previous
              grouping
            </p>
            <Button className="grouping-btn red" onClick={handleRemoveGrouping}>
              Remove Grouping
            </Button>
          </>
        ) : (
          <Button className="grouping-btn" onClick={handleGroupByPassRate}>
            Group by pass rate
          </Button>
        )}*/}
			{!session.grouped && (
				<>
					<Typography variant="h6" component="h6" fontWeight={"light"}>
						Grouping Setting
					</Typography>
					<div className="auto_grouping">
						<Typography variant="body1" gutterBottom>
							Autogroup at Passrate Threshold:
						</Typography>
						<TextField
							label="Threshold (%)"
							variant="outlined"
							onChange={(e) => {
								setAutoGroupingRate(e.target.value);
							}}
						/>
						<Button
							variant="contained"
							onClick={(e) => {
								setAutoGrouping(true);
								//console.log(autoGrouping);
							}}
						>
							Set Group
						</Button>
					</div>
					<Divider> Or </Divider>
					<div className="grouping-btn-container">
						<Typography variant="body1" gutterBottom>
							Manual Grouping:
						</Typography>
						<Button
							className="action-btn"
							variant="contained"
							color="primary"
							onClick={handleNext}
						>
							Group Now
						</Button>
					</div>
				</>
			)}
		</div>
	);
};

export default GroupingModal;
