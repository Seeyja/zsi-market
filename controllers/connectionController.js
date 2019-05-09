const mysql = require('mysql');

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

module.exports = function(app) {

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

        //let type_keys = Object.keys(book_types);
        let offerData = {
          description: req.body.description,
          active: 0,
        };
        let entryCode;
        // Look for user_id for offers table
        let sql3 = `SELECT id, code FROM users WHERE username = "${userData.username}" OR num = "${userData.num}" OR email="${userData.email}"`;
        let query3 = db.query(sql3, (err, results)=>{
            if(err) throw err;
            if (results.length > 0) {
              offerData.user_id = results[0].id;
              entryCode = results[0].code
            }

        });



        for (subject in book_types){
          if(typeof book_types[subject]!=='undefined')
          console.log(subject);
        }


    // Look for existing user
    let sql = `SELECT * FROM users WHERE username = "${userData.username}" OR num = "${userData.num}" OR email="${userData.email}"`;

    let query = db.query(sql, (err, results)=>{
        if(err) throw err;
        // If no user found, add new

        if (results.length < 1) {
            // insert user
            let sql = 'INSERT INTO users SET ?';
            let query = db.query(sql, userData, (err, result)=>{
              if(err) throw err;
              console.log(result);
            });
            //insert offer
            let sql2 = 'INSERT INTO offers SET ?';
            let query2 = db.query(sql2, offerData, (err, result)=>{
              if(err) throw err;
              console.log(result);
            });

            res.render( 'index', {hint: 'User and offer added...'} );

        }
        //Add offer to existing user if he passed correct accessCode
        else if (req.body.accessCode !== 'undefined' ) {
          if(req.body.accessCode === results[0].code){
            console.log('ITS ALIVE :O');
            let sql3 = 'INSERT INTO offers SET ?';
            let query3 = db.query(sql3, offerData, (err, result)=>{
              if(err) throw err;
              console.log(result);
            });
            res.render( 'index', {hint: 'Offer added to existing user'} );
          }
          else {
            res.render( 'login', {hint: 'Wrong access Code!', keepData: userData} );
          }
        }
        //Else head him to passing code
        else{
          res.render( 'login', {hint: 'There is already user like that! Enter your code:', entryCode: entryCode, keepData: userData} );
        }
    });



  });

}
