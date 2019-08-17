const express = require( 'express' );
const mysql = require( 'mysql' );
const ejs = require( 'ejs' );
const connectionController = require('./controllers/connectionController.js');
const uploadController = require('./controllers/uploadController.js');
const bookSearchController = require('./controllers/bookSearchController.js');

const bookController = require('./controllers/bookController.js');

const app = express();
const multer = require('multer');
const path = require('path');

// Listen to port 3000
app.listen(3001);
console.log('Server started on port 3001');

// Set up template Engine
app.set('view engine', 'ejs');

// Static file access
app.use( express.static( './public' ) );

//fire controllers
uploadController(app);
bookSearchController(app);
bookController( app );

app.post('/modify', function(req, res, db) {
  connectionController.modifyController(req, res)
})


// Route to index
app.get('/', function(req, res){
      res.render('index');
});
app.get('/main', function(req, res){
      res.render('index');
});
app.get('/login', function(req, res){
      res.render('index');
});
