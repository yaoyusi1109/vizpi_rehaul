import React, { useContext, useEffect} from "react";
import { cn } from "../../pages/SampleSplitter";
import { useResizable } from "react-resizable-layout";
import SampleSplitter from "../../pages/SampleSplitter";
import "../../css/codeIssuePanel.scss";
import Code from "../../component/code/Code";
import { SubmissionsProvider } from "../../context/SubmissionsContext";
import CodeIssueList from "./CodeIssueList";
import PassRateWindow from "./PassRateWindow";
import PassRateTable from "./PassrateTable";
import { TestPanelContext } from "../../context/TestPanelContext";
import TestResultPanel from "./TestResultPanel";
import SettingPanel from "./SettingPanel";
import { ModeContext } from "../../context/ModeContext";
import { SessionContext } from '../../context/SessionContext'
import InteractionList from "./InteractionList";
import { SelectedCodeContext } from '../../context/SelectedCodeContext'


const CodeIssuePanel = () => {
  const { setMode } = useContext(ModeContext);
  const { session } = useContext(SessionContext);
  const { rerender, setRerender } = useContext(SelectedCodeContext)
  useEffect(() => {
    setMode(false)
  },[]);

  const resizeEnd = () => {
    setRerender({date:Date.now(),width:rerender.width})
  }
  

  const {
    isDragging: isFileDragging,
    position: fileW,
    separatorProps: fileDragBarProps,
  } = useResizable({
    axis: "x",
    initial: 500,
    min: 0,
    onResizeEnd:resizeEnd,
  });
  const {
    isDragging: isPluginDragging,
    position: pluginW,
    separatorProps: pluginDragBarProps,
  } = useResizable({
    axis: "x",
    initial: 500,
    min: 0,
    reverse: true,
    onResizeEnd:resizeEnd,
  });


  const { testPanel } = useContext(TestPanelContext);
  return (
    <div
      className={
        "div-height flex flex-column h-screen bg-dark font-mono color-white overflow-hidden max-screen-width"
      }
    >
      <div className={"flex grow"}>
        <div
          className={cn("shrink-0 contents", isFileDragging && "dragging")}
          style={{ width: fileW }}
        >
          <SubmissionsProvider>
            <CodeIssueList />
          </SubmissionsProvider>
        </div>
        <SampleSplitter isDragging={isFileDragging} {...fileDragBarProps} />
        <div className={"flex grow"}>
          <div className={"grow bg-darker contents"}>
            {session?.type !== "Vizmental" && <SettingPanel /> }
            <SubmissionsProvider>
              <PassRateTable />
            </SubmissionsProvider>
          </div>

          <SampleSplitter
            isDragging={isPluginDragging}
            {...pluginDragBarProps}
          />
          <div
            className={cn("shrink-0 contents", isPluginDragging && "dragging")}
            style={{ width: pluginW }}
          >
            <SubmissionsProvider>
              <Code />
            </SubmissionsProvider>
            
          </div>
        </div>
      </div>
    </div>
  );
};
export default CodeIssuePanel;
