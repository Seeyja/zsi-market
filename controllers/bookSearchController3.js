const multer = require('multer');
const path = require('path');
const queryController = require('./queryController.js');
const mysql = require( 'mysql' );
const session = require('express-session');

const connectionController = require('./connectionController');



//Init Upload
const upload = multer().none();

//Create connection
const db = connectionController.db;

module.exports = function( app ){

  // register the session with it's secret ID
  // app.use(session({secret: `${Date.now()}`}));

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
      this.titles.push( foundOffer.title )
      this.priceFrom = foundOffer.price_from;
      this.priceTo = foundOffer.price_to;
      this.addDate = foundOffer.addDate;

    }
  }

  app.post('/modify', function( req, res) {

      upload( req, res, ( err )=>{

        //console.log( req.body );

        let offersToShow = []
        let sqlOfferSearch = `SELECT users.id AS "userId", users.username, users.num, users.email, offers.description, offers.price_from, offers.price_to, book_type.subject, book_type.title, photos.link, offers.id, book_type.class, users.code FROM
                              offers  INNER JOIN users ON offers.user_id = users.id
                                      INNER JOIN photos ON photos.offer_id = offers.id
                                      INNER JOIN sets ON sets.offer_id = offers.id

                                      RIGHT JOIN book_type ON book_type.id = sets.book_type_id
                                      WHERE sets.offer_id IN
                                      (SELECT sets.offer_id FROM sets INNER JOIN book_type ON sets.book_type_id = book_type.id
                                        WHERE offers.id = "${req.body.modifyInfo}" )` ;

        let queryModifyResult = db.query( sqlOfferSearch, ( err, foundModifyOffersResult ) => {
              if( err ) throw err;

              if ( req.body.accessCode === foundModifyOffersResult[0].code ) {

                  let userData = {
                      username: foundModifyOffersResult[0].username,
                      num: foundModifyOffersResult[0].num,
                      email: foundModifyOffersResult[0].email,
                  }

                  req.session.id = foundModifyOffersResult[0].userId;
                  req.session.username = foundModifyOffersResult[0].username;
                  req.session.pass = foundModifyOffersResult[0].code;

                  let offerId = foundModifyOffersResult[0].id;
                  let bookTypes = {};


                  //Transformacja kilku obiektow w jeden. Zmiana 2 wlasciwosci na tablice
                  for ( foundOffer of foundModifyOffersResult ) {

                    let alreadyinTable = 0;

                    for( let i = 0; i < offersToShow.length; i++ ){

                      if ( foundOffer.id != offersToShow[i].id ) continue;
                        
                      else if ( foundOffer.id == offersToShow[i].id ){

                        alreadyinTable = 1;

                        if ( !offersToShow[i].links.includes( foundOffer.link ) )
                          offersToShow[i].links.push( foundOffer.link );

                        if ( !offersToShow[i].subjects.includes( foundOffer.subject ) ){
                          
                          offersToShow[i].subjects.push( foundOffer.subject );
                          offersToShow[i].titles.push( foundOffer.title );

                        }

                      }

                    }

                    if (alreadyinTable == 0)
                      offersToShow.push( new Offer( foundOffer ) );
              //                console.log(offersToShow);

                  }

                  res.render( 'loginModify', {offerId: offerId, keepData: userData, keepDescription: offersToShow[0].description,
                                              keepBookTypes: offersToShow[0].subjects, keepPhotos: offersToShow[0].links,
                                              keepClass: foundModifyOffersResult[0].class, keepMinPrice: offersToShow[0].priceFrom,
                                              keepMaxPrice: offersToShow[0].priceTo, keepCode: foundModifyOffersResult[0].code, keepUserId: foundModifyOffersResult[0].userId} );

              }

              else {
                let sqlOffersQuery = `SELECT users.username, users.num, users.email, offers.description, offers.price_from, offers.price_to, book_type.subject, photos.link, offers.id, book_type.class, book_type.title, offers.add_date, offers.active FROM
                                                                        offers  INNER JOIN users ON offers.user_id = users.id
                                                                                INNER JOIN photos ON photos.offer_id = offers.id
                                                                                INNER JOIN sets ON sets.offer_id = offers.id
                                                                                INNER JOIN book_type ON book_type.id = sets.book_type_id
                                                                                WHERE sets.offer_id IN
                                                                                  (SELECT sets.offer_id FROM sets INNER JOIN book_type ON sets.book_type_id = book_type.id
                                                                                  WHERE users.username = "${foundModifyOffersResult[0].username}" )
                                                                                AND photos.active = 1` ;
                let searchType = 'wrongCode'
                queryController.findOffers(sqlOffersQuery, req, res, db, req.query.searchList, searchType);
                // res.render( 'index', {hint: 'Zły kod!'} )
              }
        });//querymodifyresult end



      })// upload end




  });

}//export end
