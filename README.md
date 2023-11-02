# Notec (Nodejs Tiny e-Commerce) NodeJS + MongoDB server side

Server side for [Notec project](https://github.com/kononiuk/notec). It provides an HTML version and HTTP endpoints for getting and managing categories and products. There is a possibility for adding and removing admin users via the terminal. The application implements basic authentication using an admin email and password for securing requests, except for getting categories and products.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [License](#license)

## Features

- Get categories list

- Get products list

- Manage Categories:
  - Add new categories
  - Edit existing categories
  - Delete categories

- Manage Products:
  - Add new products
  - Edit existing products
  - Delete products

- Admin User Management:
  - Add admin users via terminal
  - Delete admin users via terminal

- Basic Authentication:
  - Secures requests with admin email and password
 
## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) installed on your machine.
- [MongoDB](https://www.mongodb.com/) installed and running.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/notec.git

2. Navigate to the project directory:

    ```bash
    cd notec

3. Install the required dependencies:

     ```bash
     npm install

## Configuration

There is currently a configuration for developer mode. It passes only three parameters PORT, BASE_URL, MONGODB_URL.

    ```
    PORT=your_instance_port
    BASE_URL=your_env_base_url
    MONGODB_URL=your_mongodb_url

## Usage

- To start the application in production mode, run:

    ```bash
    npm start

**Note that in production mode, PORT, BASE_URL, MONGODB_URL are not configured. They must be provided through the environment settings.**

- To start the application in production mode, run:

    ```bash
    npm run dev

- To start Tailwind watcher, run:

    ```bash
    npm run tailwind

- For adding admin user:

    ```bash
    npm run dmin:user:create

- For deleting admin user:

    ```bash
    npm run admin:user:delete

## Endpoints

### Categories

- GET /categories: Retrieve a list of categories. Public.
- POST /categories: Create a new category. Receive category object. Possible keys - 'name', 'products', 'stock', 'url'. Private (requires authentication).
- PATCH /categories/:id Update an existing category. Receive object with category keys. Possible keys - 'name', 'products', 'stock', 'url'. Private (requires authentication).
- DELETE /categories/:id Delete a category. Receive **categoryId**. Private (requires authentication).

### Products

- GET /products: Retrieve a list of products. Public.
- POST /products: Create a new product. Receive product object. Possible keys - 'name', 'price', 'stock', 'sku', 'url'. Private (requires authentication).
- PUT /products/:id Update an existing product. Receive object with category keys. Possible keys - 'name', 'price', 'stock', 'sku', 'url'. Private (requires authentication).
- DELETE /products/:id Delete a product. Receive **productId**. Private (requires authentication).

## License

This project is licensed under the GNU General Public License Version 3 - see the [LICENSE](LICENSE) file for details.
