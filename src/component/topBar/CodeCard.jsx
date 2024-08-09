import React, { useEffect } from 'react'
import { useContext } from 'react'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red, yellow } from '@mui/material/colors'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Button } from '@mui/material'
import { getCodeById } from '../../service/codeService'
import { SessionContext } from '../../context/SessionContext'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'
import { AuthContext } from '../../context/AuthContext'
import { ErrorContext } from '../../context/ErrorContext'
import { getGroupById } from '../../service/groupService'
import { getUserById, getUserInSession } from '../../service/userService'
import { SelectedGroupContext } from '../../context/SelectedGroupContext'
import { filterProfanity } from '../../tool/profanityFilter'

const ExpandMore = styled((props) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

export default function CodeCard({
  error,
  message,
  percentage,
  content,
  code_id,
  expanded,
  setExpanded,
  color,
}) {
  const { selectedCode, setSelectedCode } = useContext(SelectedCodeContext)
  const { currentUser } = useContext(AuthContext)
  const { setError } = useContext(ErrorContext)
  const { session } = useContext(SessionContext)
  const { setSelectedGroup } = useContext(SelectedGroupContext)

  if (!content) {
    //console.log(code_id)
    return null
  }

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const handleChangeGroup = async (currentGroup) => {
    await setSelectedGroup(currentGroup)
  }

  const handleDisplayCode = async (code) => {
    setSelectedCode(code)
  }

  const handleInspectCode = async (index, item) => {
    const code = await getCodeById(currentUser.session_id, code_id[index])
    code.content = filterProfanity(code.content)
    const codeUser = await getUserInSession(session.id, code.sender_id)

    const currentGroup = await getGroupById(codeUser.group_id)

    await handleChangeGroup(currentGroup)
    await handleDisplayCode(code)

    setError(item)
  }

  return (
    <Card className="code-issue-card">
      <CardHeader
        className="card-header"
        avatar={
          <Avatar
            sx={{ bgcolor: color == 'red' ? red[500] : yellow[500] }}
            aria-label="recipe">
            <Typography fontSize={12} fontWeight="bold">
              {percentage + '%'}
            </Typography>
          </Avatar>
        }
        title={error}
        titleTypographyProps={{ fontSize: 12, fontWeight: 'bold' }}
      />
      {/* <CardContent>
        <Typography fontSize={12}>
          Using undefined variables or uninitialized memory can lead to
          unexpected behavior and crashes in your program.
        </Typography>
      </CardContent> */}
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more">
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {content?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                {' '}
                <Typography paragraph fontSize={15}>
                  {index + 1 + '. ' + item}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => handleInspectCode(index, item)}>
                  <Typography fontSize={10}>Inspect Code</Typography>
                </Button>
              </React.Fragment>
            )
          })}
        </CardContent>
      </Collapse>
    </Card>
  )
}
