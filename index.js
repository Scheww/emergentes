var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


// default route
app.get('/', function (req, res) {
  return res.send({ error: true, message: 'hello' })
});
// connection configurations
var dbConn = mysql.createConnection({
  host: 'localhost',
  product: 'root',
  password: '',
  database: 'node_js_api'
});

// connect to database
dbConn.connect();


// Retrieve all products
app.get('/products', function (req, res) {
  dbConn.query('SELECT * FROM products', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'products list.' });
  });
});


// Retrieve product with id
app.get('/product/:id', function (req, res) {

  let product_id = req.params.id;

  if (!product_id) {
    return res.status(400).send({ error: true, message: 'Please provide product_id' });
  }

  dbConn.query('SELECT * FROM products where id=?', product_id, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results[0], message: 'products list.' });
  });

});


// Add a new product
app.post('/product', function (req, res) {

  let product = req.body.product;

  if (!product) {
    return res.status(400).send({ error:true, message: 'Please provide product' });
  }

  dbConn.query("INSERT INTO products SET ? ", { product: product }, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'New product has been created successfully.' });
  });
});


//  Update product with id
app.put('/product', function (req, res) {

  let product_id = req.body.product_id;
  let product = req.body.product;

  if (!product_id || !product) {
    return res.status(400).send({ error: product, message: 'Please provide product and product_id' });
  }

  dbConn.query("UPDATE products SET product = ? WHERE id = ?", [product, product_id], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'product has been updated successfully.' });
  });
});


//  Delete product
app.delete('/product', function (req, res) {

  let product_id = req.body.product_id;

  if (!product_id) {
    return res.status(400).send({ error: true, message: 'Please provide product_id' });
  }
  dbConn.query('DELETE FROM products WHERE id = ?', [product_id], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'User has been updated successfully.' });
  });
});

// set port
app.listen(3000, function () {
  console.log('Node app is running on port 3000');
});

module.exports = app;