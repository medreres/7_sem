const express = require('express');
const app = express();
const port = 3000;

// Define the GET /products/{productId} route
app.get('/products/:productId', (req, res) => {
    const productId = req.params.productId;
    const product = {
        id: productId,
        name: `${productId} name`
    };
    res.json(product);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
