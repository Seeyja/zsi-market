const multer = require('multer');
const path = require('path');
const queryController = require('./queryController.js');
const queries = require('./queries2.js');
const mysql = require( 'mysql' );

const connectionController = require('./connectionController');

//Init Upload
const upload = multer().none();

//Create connection
const db = connectionController.db;

module.exports = function( app ){

  class Offer {
    constructor( foundOffer ){
      this.id = foundOffer.id;
      this.username = foundOffer.username;
      this.num = foundOffer.num;
      this.email = foundOffer.email;
      this.description = foundOffer.description;
      this.class = foundOffer.class;
      this.subjects = [];
      this.subjects.push( foundOffer.subject );
      this.links = [];
      this.links.push( foundOffer.link )
      this.titles = [];
      this.titles.push( foundOffer.title)
    }
  }

  app.post('/modify', function( req, res) {

      upload( req, res, ( err )=>{

        //console.log( req.body );

        let offersToShow = []
        let sqlOfferSearch = `SELECT users.username, users.num, users.email, offers.description, book_type.subject, book_type.title, photos.link, offers.id, book_type.class, users.code FROM
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
                                            console.log( foundModifyOffersResult );

                                            let userData = {
                                                username: foundModifyOffersResult[0].username,
                                                num: foundModifyOffersResult[0].num,
                                                email: foundModifyOffersResult[0].email,
                                                code: foundModifyOffersResult[0].code,
                                                offerId: foundModifyOffersResult[0].id
                                            }
                                            let bookTypes = {}


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

                                                  if ( !offersToShow[i].subjects.includes( foundOffer.subject ) ){
                                                    offersToShow[i].subjects.push( foundOffer.subject );
                                                    offersToShow[i].subjects.push( foundOffer.title );

                                                  }

                                                }

                                                else console.log("Sth went wrong");

                                              }

                                              if (alreadyinTable == 0)
                                                offersToShow.push( new Offer( foundOffer ) );
                                    //                console.log(offersToShow);

                                            }//For transformacja end

                                            for (let subject of offersToShow[0].subjects) {
                                              bookTypes[`${subject}`] = "on";
                                            }

                                            console.log(bookTypes);

                                            console.log('22');
                                            console.log(offersToShow[0]);
                                            res.render( 'loginModify', {hint: 'Podaj kod by zmodyfikowac', keepData: userData, keepDescription: offersToShow[0].description, keepBookTypes: bookTypes} );

                                      });//querymodifyresult end
                                    })// upload end




  });// app post end

  app.post('/search', function( req, res ) {

      upload( req, res, ( err )=>{

        console.log( req.body.searchList );


        let subjectListString = req.body.searchList.replace(/ /gi, '" OR book_type.subject = "');
        console.log( subjectListString );

        let sqlOfferSearch = `SELECT users.username, users.num, users.email, offers.description, book_type.subject, photos.link, offers.id, book_type.class, book_type.title, offers.add_date FROM
                              offers  INNER JOIN users ON offers.user_id = users.id
                                      INNER JOIN photos ON photos.offer_id = offers.id
                                      INNER JOIN sets ON sets.offer_id = offers.id

                                      RIGHT JOIN book_type ON book_type.id = sets.book_type_id
                                      WHERE sets.offer_id IN
                                      (SELECT sets.offer_id FROM sets INNER JOIN book_type ON sets.book_type_id = book_type.id
                                        WHERE book_type.subject = "${subjectListString}" )` ;



        queryController.findOffers(sqlOfferSearch, req, res, db);

      });
    });

  //Look for My offers
  app.post('/account', function( req, res ) {

      upload( req, res, ( err )=>{
        console.log(req.body);

        const sqlMyOffers = `SELECT users.username, users.num, users.email, offers.description, book_type.subject, photos.link, offers.id, book_type.class, book_type.title, offers.add_date FROM
                              offers  INNER JOIN users ON offers.user_id = users.id
                                      INNER JOIN photos ON photos.offer_id = offers.id
                                      INNER JOIN sets ON sets.offer_id = offers.id
                                      INNER JOIN book_type ON book_type.id = sets.book_type_id
                                      WHERE sets.offer_id IN
                                      (SELECT sets.offer_id FROM sets INNER JOIN book_type ON sets.book_type_id = book_type.id
                                      WHERE users.username = "${req.body.login}" )` ;
        queryController.findOffers(sqlMyOffers, req, res, db)
      });
    });

}//export end
