/**
 * Get the current year.
 *
 * This function returns the current year as a four-digit number, such as 2023.
 *
 * @returns {number} The current year.
 */
const currentYear = () => {
  return new Date().getFullYear()
}

module.exports = {
  currentYear
}