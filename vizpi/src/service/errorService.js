export const extractErrorInfo = (error) => {
  if (!error || !error.message) return null

  try {
    // Split the error message by lines
    const lines = error.message.split('\n')
    // Extract the actual error message (usually the last line)
    const actualError = lines[lines.length - 2]
    const errorType = actualError.split(': ')[0]
    const errorContent = actualError.split(': ')[1]
    // Filter and extract lines starting with "File" for context
    const fileLines = lines.filter(line => line.trim().startsWith("File"))

    // Filter and extract lines with caret (^) indicators
    const caretLines = lines.filter(line => line.trim().startsWith("^"))

    return {
      id: error.id,
      actualError,
      errorType,
      errorContent,
      fileLines,
      caretLines
    }
  } catch (err) {
    console.error(err)
    return null
  }

}

