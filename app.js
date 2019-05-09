const express = require( 'express' );
const mysql = require( 'mysql' );
const ejs = require( 'ejs' );
const bodyParser = require( 'body-parser' );
const connectionController = require('./controllers/connectionController.js');
const app = express();

// Listen to port 3000
app.listen(3000);
console.log('Server started on port 3000');

// Set up template Engine
app.set('view engine', 'ejs');

// Static file access
app.use( express.static( './public/assets' ) );
app.use( bodyParser.urlencoded( {extended: true} ) );

//fire controllers
connectionController(app);

// Route to index
app.get('/', function(req, res){
      res.render('index');
});
