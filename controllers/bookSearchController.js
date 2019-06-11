const multer = require('multer');
const path = require('path');
const connectionController = require('./connectionController.js');
const queryController = require('./queryController.js');
const mysql = require( 'mysql' );
//Init Upload
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

module.exports = function( app ){

    app.post('/search', function( req, res ) {

      upload( req, res, ( err )=>{

        console.log( req.body.searchList );
        let sqlString = req.body.searchList.replace(/ /gi, '" OR book_type.subject = "');
        console.log( sqlString );

        let sqlOfferSearch = `SELECT users.username, users.num, users.email, offers.description, book_type.subject, photos.link, offers.id, book_type.class, offers.add_date FROM
                              offers  INNER JOIN users ON offers.user_id = users.id
                                      INNER JOIN photos ON photos.offer_id = offers.id
                                      INNER JOIN sets ON sets.offer_id = offers.id

                                      RIGHT JOIN book_type ON book_type.id = sets.book_type_id
                                      WHERE sets.offer_id IN
                                      (SELECT sets.offer_id FROM sets INNER JOIN book_type ON sets.book_type_id = book_type.id
                                        WHERE book_type.subject = "${sqlString}" )` ;


        queryController.findMyOffers(sqlOfferSearch, req, res, db);
      });
    });

    //Look for My offers
    app.post('/account', function( req, res ) {

      upload( req, res, ( err )=>{
        console.log(req.body);

        const sqlMyOffers = `SELECT users.username, users.num, users.email, offers.description, book_type.subject, photos.link, offers.id, book_type.class, offers.add_date FROM
                              offers  INNER JOIN users ON offers.user_id = users.id
                                      INNER JOIN photos ON photos.offer_id = offers.id
                                      INNER JOIN sets ON sets.offer_id = offers.id
                                      INNER JOIN book_type ON book_type.id = sets.book_type_id
                                      WHERE sets.offer_id IN
                                      (SELECT sets.offer_id FROM sets INNER JOIN book_type ON sets.book_type_id = book_type.id
                                      WHERE users.username = "${req.body.login}" )` ;
        queryController.findMyOffers(sqlMyOffers, req, res, db)
      });
    });

}//export end
