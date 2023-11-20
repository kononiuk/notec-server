const Product = require('../models/product')

/**
 * Retrieve a list of products based on the given search criteria.
 *
 * @param {Object} search - The search criteria to filter products (optional).
 * @returns {Promise<Array>} - A promise that resolves to an array of products.
 * @throws {Error} - If there's an issue retrieving products.
 */
const productsList = async (search = {}) =>  {
  return new Promise(async (resolve, reject) => {
    // Find products in the database that match the provided search criteria
    const products = await Product.find(search)

    // If products are found return them
    if (products) {
      let baseURL = process.env.BASE_URL; // Get the base URL from environment variables

      // Ensure the BASE_URL ends with a forward slash "/"
      if (!baseURL.endsWith('/')) {
        baseURL += '/';
      }

      // Iterate through the products and update the URLs
      const productsWithCompleteURLs = products.map(product => {
        const completeURL = new URL('product/' + product.url, baseURL)

        product.url = completeURL
        return product
      });

      resolve(productsWithCompleteURLs)
    } else {
      reject(new Error('Failed to retrieve products'))
    }
  })
}

module.exports = { productsList }