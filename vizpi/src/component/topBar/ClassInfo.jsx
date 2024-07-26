import React from 'react'
import CodeIssues from './CodeIssues'
import PassRateWindow from './PassRateWindow'
import GroupPassRate from './GroupPassRate'
import { useContext } from 'react'
import { ModeContext } from '../../context/ModeContext'
import SettingPanel from './SettingPanel'

const ClassInfo = () => {
  const { Mode } = useContext(ModeContext)
  return (
    <div className="class-info">
      <CodeIssues />
      <PassRateWindow />
      {Mode === false && <GroupPassRate />}
      <SettingPanel />
    </div>
  )
}

export default ClassInfo
