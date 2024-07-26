import * as React from 'react'
import PropTypes from 'prop-types'
import { Tabs, Button, Tab, Typography, Box } from '@mui/material'
import TaskPanel from '../topBar/Task-UnitTest-Panel'
import GroupPanel from '../group/GroupPanel'
import { SessionContext } from '../../context/SessionContext'
import { useContext } from 'react'
import { showToast } from '../commonUnit/Toast'
import { ContentCopy } from '@mui/icons-material'
import {
  groupingInSession,
  setSessionRegrouping,
  setSessionGroupRound,
  setSessionEnableChat,
} from '../../service/sessionService'
import AudioTask from './AudioTask'
import AudioGroupPanel from './group/AudioGroupPanel'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function AudioSessionPanel() {
  const [value, setValue] = React.useState(0)
  const { session, setLink } = useContext(SessionContext)

  const Grouping = async () => {
    if (!session.stu_num || session.stu_num <= 2) {
      showToast('Please wait for more students', 'warning')
      return
    }
    await setSessionRegrouping(session.id, true)
    await groupingInSession(session, 'passrate').then((res) => {
      if (res) {
        showToast('Grouping successfully.', 'success')

        setSessionRegrouping(session.id, false)
        setSessionGroupRound(session.id, 1)
      } else {
        showToast('Grouping failed.', 'error')
        setSessionRegrouping(session.id, false)
        return
      }
    })
    await setSessionEnableChat(session.id, true)
  }

  const handleCopyLink = () => {
    const currentUrl = window.location.href
    const longURL = currentUrl + 'session/' + session.id
    const headers = {
      Authorization:
        'Bearer xVtTD1mVA4CnM5sqCReF7w8GtxjItg2FcdEiiwS4cMl0C5FYQ9vYh9ULMO7E',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    let body = {
      long_url: longURL,
    }
    navigator.clipboard.writeText(currentUrl + 'session/' + session.id)
    showToast('Link copied to clipboard!', 'success', 2000)
    setLink(currentUrl + 'session/' + session.id)
    fetch('https://t.ly/api/v1/link/shorten', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }).then(function (response) {
      if (response.ok) {
        response.json().then(function (resp) {
          navigator.clipboard.writeText(resp['short_url'])
          setLink(resp['short_url'])

          showToast('Link copied to clipboard!', 'success', 2000)
        })
      } else {
        console.log('resp: ', response)
        navigator.clipboard.writeText(currentUrl + 'session/' + session.id)
        showToast('Link copied to clipboard!', 'success', 2000)
        setLink(currentUrl + 'session/' + session.id)
      }
    })
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', overflowY: 'hidden' }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example">
          <Tab label="Task and Unit Test" {...a11yProps(0)} />
          {/* <Tab label="Class Performance" {...a11yProps(1)} /> */}
          <Tab label="Groups" {...a11yProps(1)} />
          {/* <Tab label="Presenter View" {...a11yProps(3)} /> */}
        </Tabs>
        <Button
          sx={{ marginRight: '20px' }}
          variant="outlined"
          startIcon={<ContentCopy />}
          onClick={() => {
            handleCopyLink()
          }}>
          Distribute
        </Button>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <AudioTask />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <AudioGroupPanel />
      </CustomTabPanel>
    </Box>
  )
}
