const mysql = require( 'mysql' );
const queryController = require('./queryController.js');
const fs = require('fs');
const multer = require('multer');

const tymczasowyController = require('./tymczasowyController');

const upload = multer().none();

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

  db: db,

  modifyOffer: function( req, res, db ){

          let description = req.body.description;
          let code;
          do{
            code = Math.floor(Math.random()*1000000);
          } while(code < 100000)

          let userData = {
              username: req.body.login,
              num: req.body.num,
              email: req.body.email,
            //  code: code,
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

          console.log("username:");
          console.log(userData);
          console.log("req.body:");
          console.log(req.body);

        let sqlForCode = `SELECT code FROM users WHERE username = "${userData.username}"`;

        let queryForCode = db.query( sqlForCode, ( err, foundCode ) => {

          console.log("Kod:");
          console.log(foundCode[0].code);
          if(foundCode[0].code == req.body.accessCode){

                let sqlChangeUserData =   `UPDATE users
                                          SET email = '${userData.email}', num = '${userData.num}'
                                          WHERE username = '${userData.username}'`;

                let queryChangeUserData = db.query( sqlChangeUserData, ( err, changeResult ) => {
                  if( err ) throw err;
                  console.log(changeResult);
                });//Change query end

                let sqlChangeOfferData =  `UPDATE offers
                                          SET description = '${req.body.description}', active = 0
                                          WHERE id = '${req.body.offerId}'`;

                let queryChangeOfferData = db.query( sqlChangeOfferData, ( err, changeResult ) => {
                  if( err ) throw err;
                  console.log(changeResult);
                });//Change query end


                res.render( 'index', {hint: 'Zmienione Ziomo. Ić spać.'});
          }

          else {
            for (unnedenPhoto of req.files) {
              fs.unlink(`./public/uploads/${unnedenPhoto.filename}`, function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                console.log('File deleted!');
              });
            }
              res.render( 'loginModify', {hint: 'Wrong code!', keepData: userData, keepDescription: offerData.description, keepBookTypes: bookTypes} );
          }
      });//queryForCode end
  //  });//upload End
  }// modifyOffer

}//module.exports end
