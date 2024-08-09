import ActivityRings from 'react-activity-rings'; 
import React from "react";
 
const ProgressRings = ({passrate, convorate, groupname }) => {
 
const activityData = [ 
      {
        label: "PASS",
        value: passrate/100,
        color: "#57cc99",
      },
      {
        label: "CONVO",
        value: convorate/100,
        color: "#023e8a",
      }
 ];
 
 const activityConfig = { 
    width: 100,
    height: 100,
    radius: 25,
    ringSize: 10,
 };
 
 return (
    <ActivityRings theme={"light"} legend={true} legendTitle={groupname} data={activityData} config={activityConfig} /> 
  );
}

export default ProgressRings;