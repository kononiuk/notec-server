const customerError = (error) => {
  let errorMessages = ['Something went wrong.']

  if (error.code === 11000) {
    const duplicates = Object.keys(error.keyPattern)
    errorMessages = []

    duplicates.forEach(duplicate => {
      errorMessages.push(`Customer with ${error.keyValue[duplicate]} ${duplicate} has already been registered.`)
    })
  } else if (error.errors) {
    const errorsKeys = Object.keys(error.errors)
    errorMessages = []

    errorsKeys.forEach(errorKey => {
      errorMessages.push(error.errors[errorKey].properties.message)
    })
  }

  return {
    "errorMessages": errorMessages
  }
}

module.exports = { customerError }