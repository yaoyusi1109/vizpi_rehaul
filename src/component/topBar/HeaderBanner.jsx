import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { quitSession, quitSessionStudent } from '../../service/sessionService'
import { SessionContext } from '../../context/SessionContext'
import TutorialModal from '../commonUnit/TutorialModal'
import { ModeContext } from '../../context/ModeContext'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { signOut } from '../../service/authService'
import CountDownTimer from './CountDownTimer'
import { AutoGroupingContext } from '../../context/AutoGroupingContext'
import {
  regrouping,
  setSessionRegrouping,
  setSessionGroupRound,
} from '../../service/sessionService'
import { SubmissionsContext } from '../../context/SubmissionsContext'
import { showToast } from '../commonUnit/Toast'

const pages = ['Products', 'Pricing', 'Blog']
const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

function HeaderBanner() {
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const { currentUser } = useContext(AuthContext)
  const { session, setSession, link } = useContext(SessionContext)
  const { Mode, setMode } = useContext(ModeContext)
  const { regroupingCheck } = useContext(AutoGroupingContext)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleOnComplete = async () => {
    if (currentUser.role < 3) {
      if (!session.stu_num || session.stu_num <= 2) {
        showToast('Please wait for more students', 'warning')
        return
      }
      await setSessionRegrouping(session.id, true)
      await regrouping(session, 3).then((res) => {
        if (res) {
          showToast('Grouping successfully.', 'success')
        } else {
          showToast('Grouping failed.', 'error')
          return
        }
      })
    }
    if (currentUser.role === 3) {
      //Find out if added to new group or not
      // //console.log(currentUser)
    }
  }
  // //console.log(currentUser)
  const handleSignOut = async () => {
    try {
      await signOut()
      // redirect to login page
      window.location.href = '/login'
    } catch (err) {
      console.error('Failed to sign out:', err)
    }
  }

  const handleQuitSession = () => {
    if (currentUser.role === 3) {
      quitSessionStudent(currentUser.id).then(() => {
        setSession(null)
        window.location.href = '/'
      })
    } else {
      quitSession(currentUser.id).then(() => {
        setSession(null)
        window.location.reload()
      })
    }
  }

  return (
    <AppBar position="static">
      <Container
        maxWidth="m"
        sx={{
          height: 1,
        }}>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>
            VizPI
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}>
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center">Presenter View</Typography>
              </MenuItem>
              <MenuItem onClick={handleQuitSession}>
                <Typography textAlign="center">Session List</Typography>
              </MenuItem>
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {currentUser.email != null ? (
              <>
                <Button
                  onClick={handleQuitSession}
                  sx={{ my: 2, color: 'white', display: 'block' }}>
                  Session List
                </Button>
              </>
            ) : null}

            {currentUser.role < 3 ? (
              <>
                <TutorialModal />
              </>
            ) : null}
          </Box>
          {currentUser.role < 3 ? (
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                flexGrow: 1,
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}>
              {link}
            </Typography>
          ) : null}
          {currentUser.role === 3 && session?.regrouping ? (
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                flexGrow: 1,
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}>
              Entering New group in 5 Seconds
            </Typography>
          ) : null}
          {session?.type == 'Auto Grouping' &&
          session?.group_round === 1 &&
          regroupingCheck ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CountDownTimer
                duration={20}
                colors={['#ff9248', '#a20000']}
                colorValues={[40, 10]}
                onComplete={handleOnComplete}
              />
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  flexGrow: 1,
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}>
                Until new Group
              </Typography>
            </div>
          ) : null}
          {currentUser.role === 3 && session?.group_round === 2 ? (
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                flexGrow: 1,
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}>
              Welcome to your new group, please use the chat to help and get
              help
            </Typography>
          ) : null}

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={currentUser?.first_name}
                  src="/static/images/avatar/2.jpg"
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}>
              <List>
                <ListItem>
                  <Typography textAlign="center">
                    UserID: {currentUser.id}
                  </Typography>
                </ListItem>
              </List>

              <MenuItem onClick={handleSignOut}>
                <Typography textAlign="center">Sign Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default HeaderBanner
