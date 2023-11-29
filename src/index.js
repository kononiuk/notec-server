const app = require('./app')
const Product = require('./models/product')
const Category = require('./models/category')
const { currentYear } = require('./utils/common')
const productsHelper = require('./utils/product')
const categoriesHelper = require('./utils/category')
const port = process.env.PORT || 3000

// Define the root route to display home page
app.get('', async (req, res) => {
  const products = await productsHelper.productsList()
  const categories = await categoriesHelper.categoriesList()

  res.render('index', {
    title: 'Notec',
    pageTitle: 'All products',
    products,
    categories,
    currentYear
  })
})

// Define a route to display products of a specific category
app.get('/category/:url', async (req, res) => {
  const categories = await categoriesHelper.categoriesList()
  const category = await Category.findOne({ url: req.params.url })

  if (category) {
    const products = await productsHelper.productsList({ productId: category.products })
    
    res.render('index', {
      title: category.name,
      pageTitle: category.name + ' products',
      products,
      categories,
      currentYear
    })
  } else {
    res.render('not-found', {
      title: '404',
      pageTitle: 'Category not found',
      currentYear
    })
  }
})

// Define a route to display products detail page
app.get('/product/:url', async (req, res) => {
  const categories = await categoriesHelper.categoriesList()
  const product = await Product.findOne({ url: req.params.url })

  if (product) {
    res.render('product-page', {
      title: product.name,
      categories,
      product,
      currentYear,
    })
  } else {
    res.render('not-found', {
      title: '404',
      pageTitle: 'Product not found',
      currentYear
    })
  }
})

// Define a catch-all route for handling 404 errors
app.get('*', async (req, res) => {
  const categories = await categoriesHelper.categoriesList()

  res.render('not-found', {
    title: '404',
    pageTitle: 'Page not found',
    categories,
    currentYear
  })
})

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})