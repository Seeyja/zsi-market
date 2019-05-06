const express = require( 'express' );
const mysql = require( 'mysql' );
const ejs = require( 'ejs' );
const app = express();
const bodyParser = require( 'body-parser' );

//Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'bookservice'
});

// Connect
db.connect((err) => {

    if(err) throw err;
    console.log('Connected');

});

// Listen to port 3000
app.listen(3000);
console.log('Server started on port 3000');

// Set up template Engine
app.set('view engine', 'ejs');

// Static file access
app.use( express.static( './public/assets' ) );
app.use( bodyParser.urlencoded( {extended: true} ) );

// Getting data from POST method
app.post('/', function (req, res) {
    const data = {
        user: req.body.login,
        num: req.body.num,
        email: req.body.email,
        description: req.body.description,
        class: req.body.class,
        
    };
    res.send(data);
});

// Route to index
app.get('/', function(req, res){
      res.render('index');
});
