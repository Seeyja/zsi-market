const mysql = require( 'mysql' );
const queryController = require('./queryController.js');
const fs = require('fs');
const multer = require('multer');

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

//////////////////////////////////
/*
  app.post('/modify', function( req, res) {

    upload( req, res, ( err )=>{

      console.log( req.body );


      let sqlOfferSearch = `SELECT users.username, users.num, users.email, offers.description, book_type.subject, photos.link FROM
                            offers  INNER JOIN users ON offers.user_id = users.id
                                    INNER JOIN photos ON photos.offer_id = offers.id
                                    INNER JOIN sets ON sets.offer_id = offers.id

                                    RIGHT JOIN book_type ON book_type.id = sets.book_type_id
                                    WHERE sets.offer_id IN
                                    (SELECT sets.offer_id FROM sets INNER JOIN book_type ON sets.book_type_id = book_type.id
                                      WHERE offers.id = "${req.body.modifyInfo}" )` ;

                                      let queryModifyResult = db.query( sqlOfferSearch, ( err, foundModifyOffersResult ) => {
                                          if( err ) throw err;
                                          console.log( '11' );

                                          //Transformacja kilku obiektow w jeden. Zmiana 2 wlasciwosci na tablice
                                          for ( foundOffer of foundModifyOffersResult ) {

                                            let alreadyinTable = 0;

                                            for( let i = 0; i < offersToShow.length; i++ ){

                                              if ( foundOffer.id != offersToShow[i].id )
                                                continue;

                                              else if ( foundOffer.id == offersToShow[i].id ){

                                                alreadyinTable = 1;

                                                if ( !offersToShow[i].links.includes( foundOffer.link ) )
                                                  offersToShow[i].links.push( foundOffer.link );

                                                if ( !offersToShow[i].subjects.includes( foundOffer.subject ) )
                                                  offersToShow[i].subjects.push( foundOffer.subject );

                                              }

                                              else console.log("Sth went wrong");

                                            }

                                            if (alreadyinTable == 0)
                                              offersToShow.push( new Offer( foundOffer ) );
                                  //                console.log(offersToShow);

                                          }//For transformacja end

                                          console.log('22');
                                          res.render( 'login', {offersToShow: offersToShow} );

                                    });
                                  })



      res.render( 'index', {keepData: req.body} );

    });
    */
//////////////////////////////////

module.exports = {
  connectionControllerFunction: function( req, res ){

    console.log('conectionCOntroler----------');
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
  },//connectionControllerFunction end
/*
  modifyControllerFunction: function( req, res ){

      upload( req, res, ( err )=>{

        console.log( req.body );


        let sqlOfferSearch = `SELECT users.username, users.num, users.email, offers.description, book_type.subject, photos.link FROM
                              offers  INNER JOIN users ON offers.user_id = users.id
                                      INNER JOIN photos ON photos.offer_id = offers.id
                                      INNER JOIN sets ON sets.offer_id = offers.id

                                      RIGHT JOIN book_type ON book_type.id = sets.book_type_id
                                      WHERE sets.offer_id IN
                                      (SELECT sets.offer_id FROM sets INNER JOIN book_type ON sets.book_type_id = book_type.id
                                        WHERE offers.id = "${req.body.modifyInfo}" )` ;

        let queryModifyResult = db.query( sqlOfferSearch, ( err, foundModifyOffersResult ) => {
                                            if( err ) throw err;
                                            console.log( '11' );

                                            //Transformacja kilku obiektow w jeden. Zmiana 2 wlasciwosci na tablice
                                            for ( foundOffer of foundModifyOffersResult ) {

                                              let alreadyinTable = 0;

                                              for( let i = 0; i < offersToShow.length; i++ ){

                                                if ( foundOffer.id != offersToShow[i].id )
                                                  continue;

                                                else if ( foundOffer.id == offersToShow[i].id ){

                                                  alreadyinTable = 1;

                                                  if ( !offersToShow[i].links.includes( foundOffer.link ) )
                                                    offersToShow[i].links.push( foundOffer.link );

                                                  if ( !offersToShow[i].subjects.includes( foundOffer.subject ) )
                                                    offersToShow[i].subjects.push( foundOffer.subject );

                                                }

                                                else console.log("Sth went wrong");

                                              }

                                              if (alreadyinTable == 0)
                                                offersToShow.push( new Offer( foundOffer ) );
                                    //                console.log(offersToShow);

                                            }//For transformacja end

                                            console.log('22');
                                            res.render( 'login', {hint: offersToShow} );

                                      });
                                    })



        res.render( 'index', {keepData: req.body} );

    },//modify End
*/
    modifyItControllerFunction: function( req, res ){


      console.log('2----------');
      console.log(req.body);


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
          console.log(userData.username);
          console.log("req.body:");
          console.log(req.body);

        let sqlForCode = `SELECT code FROM users WHERE username = "${userData.username}"`;

        let queryForCode = db.query( sqlForCode, ( err, foundCode ) => {


          let sqlChangeUserData = `UPDATE users
                                  SET email = '${userData.email}', num = '${userData.num}'
                                  WHERE username = '${userData.username}'`;
          console.log("Kod:");
          console.log(foundCode[0].code);
          if(foundCode[0].code == req.body.accessCode){


                let queryChangeUserData = db.query( sqlChangeUserData, ( err, changeResult ) => {
                  if( err ) throw err;
                  console.log(changeResult);
                });//Change query end
                console.log('Nie mam co robic');
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
    }// methodFunction

  }//module.exports end
