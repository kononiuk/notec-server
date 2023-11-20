const Category = require('../models/category')

/**
 * Retrieve a list of categories based on the given search criteria.
 *
 * @param {Object} search - Optional search criteria to filter categories.
 * @returns {Promise<Array<Category>>} A promise that resolves to an array of Category documents.
 * @throws {Error} If an error occurs while retrieving categories.
 */
function categoriesList(search = {}) {
  return new Promise(async (resolve, reject) => {
    // Find categories in the database based on the provided search criteria
    const categories = await Category.find(search)
    if (categories) {
      let baseURL = process.env.BASE_URL; // Get the base URL from environment variables

      // Ensure the BASE_URL ends with a forward slash "/"
      if (!baseURL.endsWith('/')) {
        baseURL += '/';
      }

      // Iterate through the categories and update the URLs
      const categoriesWithCompleteURLs = categories.map(category => {
        const completeURL = new URL('category/' + category.url, baseURL)
        return {
          name: category.name,
          url: completeURL,
        };
      });

      resolve(categoriesWithCompleteURLs)
    } else {
      reject(new Error('Failed to retrieve categories'))
    }
  })
}

module.exports = { categoriesList }