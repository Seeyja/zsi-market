const mysql = require( 'mysql' );
const queryController = require('./queryController.js');
const fs = require('fs');

//Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'bookservice'
});

// Connect
db.connect( ( err ) => {
    if( err ) throw err;
    console.log( 'Connected' );
});

module.exports = {
  connectionControllerFunction: function( req, res ){

    console.log('2----------');
    console.log(req.files);


        let description = req.body.description;

        let code;
        do{
          code = Math.floor(Math.random()*1000000);
        } while(code < 100000)

        let userData = {
            username: req.body.login,
            num: req.body.num,
            email: req.body.email,
            code: code,
        }
        let bookTypes = {
            polish: req.body.polish,
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
        let keepPhotos={
          links: [],
        };
        let offerData = {
            description: req.body.description,
            active: 0,
        };
        let entryCode;
        let setData={}; // Data for set table
        let photoUploadInfo;

        let sqlExistingUser = `SELECT * FROM users WHERE username = "${userData.username}" OR num = "${userData.num}" OR email="${userData.email}"`;
        let queryExistingUserOut = db.query( sqlExistingUser, ( err, foundUsers ) => {
            if( err ) throw err;

            if( foundUsers.length == 0 ) {

                let sqlUserIn = 'INSERT INTO users SET ?';
                let queryUsersIn = db.query( sqlUserIn, userData, ( err, sqlUserInResult )=>{

                  if(err) throw err;
                  offerData.user_id = sqlUserInResult.insertId;
                  queryController.insertSetAndOffer( setData, offerData, bookTypes, keepPhotos, req, db );

                });

                res.render( 'index', {hint: 'User and offer added...'} );

            }
            else {


              offerData.user_id = foundUsers[0].id;
              entryCode = foundUsers[0].code

              if ( typeof req.body.accessCode == 'undefined' ){

                for (unnedenPhoto of req.files) {

                  fs.unlink(`./public/uploads/${unnedenPhoto.filename}`, function (err) {
                    if (err) throw err;
                    // if no error, file has been deleted successfully
                    console.log('File deleted!');
                  });

                }

                res.render( 'login', {hint: 'There is already user like that! Enter your code:', entryCode: entryCode, keepData: userData, keepDescription: offerData.description, keepPhotos: keepPhotos, keepBookTypes: bookTypes} );
              }
              else if( req.body.accessCode === entryCode ){

                queryController.insertSetAndOffer( setData, offerData, bookTypes, keepPhotos, req, db )
                res.render( 'index', {hint: 'Offer added to existing user'} );

              }

              else{
                for (unnedenPhoto of req.files) {

                  fs.unlink(`./public/uploads/${unnedenPhoto.filename}`, function (err) {
                    if (err) throw err;
                    // if no error, file has been deleted successfully
                    console.log('File deleted!');
                  });

                }
                res.render( 'login', {hint: 'Wrong access Code!', keepData: userData, keepDescription: offerData.description, keepBookTypes: bookTypes} );
              }

          }//Foundusers else statement end
      });//Main query end
  }//connectionControllerFunction end
}//module.exports end
