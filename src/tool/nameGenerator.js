const { uniqueNamesGenerator, colors, animals } = require('unique-names-generator')

const namePattern = { dictionaries: [colors, animals] }
export const generateName = () => {
  return uniqueNamesGenerator(namePattern)
}