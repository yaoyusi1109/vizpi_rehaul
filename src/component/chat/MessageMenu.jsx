import * as React from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { SelectedUsersContext } from '../../context/SelectedUserContext'

export default function MessageMenu() {
  const [age, setAge] = React.useState('')
  const { selectedUsers } = React.useContext(SelectedUsersContext) || []

  const handleChange = (event) => {
    setAge(event.target.value)
  }

  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Student</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Student"
          onChange={handleChange}>
          //{' '}
          {
            //selectedUsers.map((user, index) => (
            //         <MenuItem key={index} value={user.id}>{user.first_name}</MenuItem>
            //     ))
          }
        </Select>
      </FormControl>
    </Box>
  )
}
