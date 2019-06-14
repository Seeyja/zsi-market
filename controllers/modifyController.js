//////////////////////////////////*
/*
const multer = require('multer');
upload

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
*/
//////////////////////////////////
