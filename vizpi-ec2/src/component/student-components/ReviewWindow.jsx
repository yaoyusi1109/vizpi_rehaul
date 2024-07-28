import * as React from 'react'
import { Box, Button, Typography, Modal, Stack, TextField, FormControl, RadioGroup, FormControlLabel, Radio,} from '@mui/material';
import { AuthContext } from '../../context/AuthContext'
import { SessionContext } from '../../context/SessionContext'
import { addReview, createReview } from '../../service/reviewService'
import { SelectedGroupContext } from '../../context/SelectedGroupContext'
import ReviewQuestions from './data/ReviewQuestions'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  maxHeight: '50vh',
  overflowY: 'auto',
  padding: '30px',
}

export default function ReviewWindow() {
  const [open, setOpen] = React.useState(true)
  const [everSubmit, setEverSubmit] = React.useState(false)
  const [commentText, setCommentText] = React.useState('')
  const [rating, setRating] = React.useState(null)
  const { currentUser } = React.useContext(AuthContext)
  const { session } = React.useContext(SessionContext)
  const { selectedGroup } = React.useContext(SelectedGroupContext)
  const [responses, setResponses] = React.useState({});
  
  const handleModalOpen = () => setOpen(true)

  const handleInputChange = (description, value) => {
    setResponses({
      ...responses,
      [description]: value,
    });
  };
  const handleSubmit = async () => {
    setOpen(false)
    try {
      let review = createReview(
        commentText,
        responses,
        selectedGroup?.id,
        rating,
        session.id,
        currentUser.id
      )
      await addReview(review)
      setEverSubmit(true)
    } catch (error) {
      console.error('Error updating rating: ', error)
    }
  }
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <>
      {!everSubmit && (
        <Box sx={{ width: '100%' }}>
          <Button
            onClick={handleModalOpen}
            variant="outlined"
            sx={{ height: '20px' }}>
            Rating Discussion
          </Button>
          <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                We need your feedback!
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2, mb:2}}>
                Please answers the following survey questions:
              </Typography>
              <form>
                {ReviewQuestions.map((question, index) => {
                  if (question.inputType === "radio") {
                    return (
                      <Box key={index}>
                        <Typography sx={{mt: 2}}>{question.label}</Typography>
                        <FormControl>
                          <RadioGroup
                            aria-label={question.label}
                            value={responses[question.description] || ''}
                            onChange={(event) => handleInputChange(question.description, event.target.value)}>
                            {question.options.map((option, optionIndex) => (
                              <FormControlLabel key={optionIndex} value={option.value} control={<Radio />}
                                label={option.label}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    );
                  } else if (question.inputType === "textfield") {
                    return (
                      <Box key={index}>
                        <Typography sx={{mt:2}}>{question.label}</Typography>
                        <TextField
                          label="Additional Feedbacks"
                          multiline
                          rows={4}
                          fullWidth
                          margin="normal"
                          value={responses[question.description] || ''}
                          onChange={(event) => handleInputChange(question.description, event.target.value)}
                          placeholder="Details/Feedback/Suggestions/anything else you want to say"
                          />
                      </Box>
                    );
                  }
                })}
              </form>
              <Stack direction="row" spacing={2} sx ={{mt:2}}>
                  <Button variant="contained" onClick={handleSubmit}> Submit </Button>
                <Button onClick={handleClose} variant="outlined"> later </Button>
              </Stack>
            </Box>
          </Modal>
        </Box>
      )}
    </>
  )
}