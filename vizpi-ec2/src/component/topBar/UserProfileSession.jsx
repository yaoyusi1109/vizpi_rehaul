import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getAvatar } from '../../tool/Tools';
import { Button, ClickAwayListener, MenuItem, Box } from '@mui/material';
import { quitSession } from '../../service/sessionService';
import { SessionContext } from '../../context/SessionContext';
import { ModeContext } from '../../context/ModeContext';
import { signOut } from '../../service/authService';
import LogoutIcon from '@mui/icons-material/Logout';

const UserProfileSession = () => {
  const { currentUser } = useContext(AuthContext);
  const { setSession } = useContext(SessionContext);
  const { Mode, setMode } = useContext(ModeContext);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  const handleProfileClick = () => {
    setSortMenuOpen((prev) => !prev);
  };

  const handleSortMenuClose = () => {
    setSortMenuOpen(false);
  };

  return (
    <div className="user-profile" style={{ position: 'relative' }}>
      
      <span
        onClick={handleProfileClick}
        style={{ cursor: 'pointer', zIndex: 2 }} // Ensure cursor pointer and z-index
      >
        {currentUser?.first_name}
      </span>
      <img
        src={getAvatar(currentUser?.avatar_url)}
        alt=""
        onClick={handleProfileClick}
        style={{ cursor: 'pointer', zIndex: 2 }} // Ensure cursor pointer and z-index
      />

      {sortMenuOpen && (
        <ClickAwayListener onClickAway={handleSortMenuClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              right: -50,
              mt: 1,
              mb: 2,
              border: '2px solid #e0dcdc',
              padding: '7px',
              paddingLeft: '10px',
              paddingRight: '10px',
              borderRadius: '5px',
              backgroundColor: 'white',
              zIndex: 1,
              color: 'black',
            }}
          >
            <MenuItem key={0} onClick={() => { handleSignOut(); setSortMenuOpen(false); }}>
              <LogoutIcon sx={{marginRight:'5px'}}/>{' Log out'}
            </MenuItem>
          </Box>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default UserProfileSession;
