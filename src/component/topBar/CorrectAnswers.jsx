import { Box, Typography } from '@mui/material'
const CorrectAnswers = (props) => {
  const { enable, isUpdating, correctAnswers } = props || {}
  return (
    enable ? (
      <>
        <Typography variant="subtitle1" fontWeight="light" gutterBottom>
          Here’s the AI-generated answer. I’ve included useful comments and explained the knowledge components covered in the question.
        </Typography>
        {!isUpdating ? (
          <>
            <Box
              sx={{
                padding: 1,
                backgroundColor: '#FAFAFA',
                mb: 2,
                borderRadius: '3%',
                marginBottom: 0,
                overflowY: 'auto'
              }}>
              <div style={{ overflowY: 'auto' }}>
                <pre>{correctAnswers}</pre>
              </div>
            </Box>

          </>
        ) : (
          <Box
            sx={{
              padding: 1,
              backgroundColor: '#FAFAFA',
              mb: 2,
              borderRadius: '3%',
              height: window.innerHeight / 3,
              marginBottom: 0,
            }}>
            <Typography
              variant="subtitle1"
              fontWeight="light"
              gutterBottom>
              Updating pre-coding questions...
            </Typography>
          </Box>
        )}
      </>
    ) : (
      <Box
        sx={{
          padding: 1,
          backgroundColor: '#FAFAFA',
          mb: 2,
          borderRadius: '3%',
        }}>
        {/* Pre-coding questions are currently disabled. */}
      </Box>
    )
  )
}

export default CorrectAnswers
