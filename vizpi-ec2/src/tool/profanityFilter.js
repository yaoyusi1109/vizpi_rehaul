import Filter from 'bad-words'


export const filterProfanity = (userInput) => {
  if(userInput!=null && userInput.split(/\b/).length!=null){
    return userInput;
  }
  const filter = new Filter()
  let cleanedText = ''
  if (/^\*+$/.test(userInput)) {
    cleanedText = userInput
  } else {
    cleanedText = filter.clean(userInput)
  }
  return cleanedText
}
