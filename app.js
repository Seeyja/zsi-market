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

    let grade = req.body.class;
    let description = req.body.description;
    let code;
    do{
      code = Math.floor(Math.random()*1000000);
    }while(code < 100000)

    let userData = {
        username: req.body.login,
        num: req.body.num,
        email: req.body.email,
        code: code,
    }
    let book_types = {
        polish: req.body.polish+String(req.body.class),
        english: req.body.english,
        german: req.body.german,
        history: req.body.history,
        entrepreneurship: req.body.entrepreneurship,
        geography: req.body.geography,
        biology: req.body.biology,
        chemistry: req.body.chemistry,
        physics: req.body.physics,
        math: req.body.math,
        safety: req.body.safety,
        religion: req.body.religion,
        professionalCourses: req.body.professionalCourses,
        society: req.body.society,
        culture: req.body.culture,
      }

      // Look for existing user
      let sql = `SELECT * FROM users WHERE username = "${userData.username}" OR num = "${userData.num}" OR email="${userData.email}"`;
      let query = db.query(sql, (err, results)=>{
        if(err) throw err;
        console.log(results);
      // If no user found, add new
        if (results.length < 1) {
            let sql = 'INSERT INTO users SET ?';
            let query = db.query(sql, userData, (err, result)=>{
              if(err) throw err;
              console.log(result);
              res.render( 'index', {hint: 'User added...'} );
            });
        }
        else res.render( 'index', {hint: 'There is already user like that!'} );
      });

});

// Route to index
app.get('/', function(req, res){
      res.render('index');
});
