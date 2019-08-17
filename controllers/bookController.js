const multer = require('multer');
const mysql = require( 'mysql' );
const connectionController = require('./connectionController');
const queryController = require('./queryController.js');
const path = require('path');

const db = connectionController.db;

// Set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname) );
  }
})

//Init Upload
const upload = multer({
  storage: storage,
  limits: {fileSize: 20000000},
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).array('files', 12);

//  Check File Type
function checkFileType( file, cb ) {
    // Allowed extentions
    const filetypes = /jpeg|jpg|png|gif/;
    //Check the extentions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //Check mimetype
    const mimetype = filetypes.test(file.mimetype);

    if(extname && mimetype){
      return cb(null, true);
    }else {
      cb('error: Img only!', false);
    }

  }


module.exports = function( app ){

  app.get( '/books', ( req, res )=>{

    console.log( req.query.searchList );

    let sqlOffersQuery;

    if ( typeof req.query.searchList != "undefined" ) {

      let subjectListString = req.query.searchList.replace(/ /gi, '" OR book_type.subject = "');
      sqlOffersQuery = `SELECT users.username, users.num, users.email, offers.description, book_type.subject, photos.link, offers.id, book_type.class, book_type.title, offers.add_date FROM
                              offers  INNER JOIN users ON offers.user_id = users.id
                                      INNER JOIN photos ON photos.offer_id = offers.id
                                      INNER JOIN sets ON sets.offer_id = offers.id

                                      RIGHT JOIN book_type ON book_type.id = sets.book_type_id
                                      WHERE sets.offer_id IN
                                      (SELECT sets.offer_id FROM sets INNER JOIN book_type ON sets.book_type_id = book_type.id
                                        WHERE book_type.subject = "${subjectListString}" )` ;

    } else if ( typeof req.query.login != "undefined" ) {

      sqlOffersQuery = `SELECT users.username, users.num, users.email, offers.description, book_type.subject, photos.link, offers.id, book_type.class, book_type.title, offers.add_date FROM
                                                              offers  INNER JOIN users ON offers.user_id = users.id
                                                                      INNER JOIN photos ON photos.offer_id = offers.id
                                                                      INNER JOIN sets ON sets.offer_id = offers.id
                                                                      INNER JOIN book_type ON book_type.id = sets.book_type_id
                                                                      WHERE sets.offer_id IN
                                                                      (SELECT sets.offer_id FROM sets INNER JOIN book_type ON sets.book_type_id = book_type.id
                                                                      WHERE users.username = "${req.query.login}" )` ;

    } else res.send('something went wrong');

    queryController.findOffers(sqlOffersQuery, req, res, db);

  } );

  app.post( '/books', ( req, res )=>{

// Pobiera pliki i dane z inputow i przekazuje jako req do addOffer()
    upload( req, res, ( err )=>{

        if(err) throw err;

        if ( req.files == undefined )
          err = "Error: No file selected";

        else
          err = 'File uploaded';

        //console.log( req.body );
        //console.log( req.files );

        queryController.addOffer( req, res, db );

    }) //Upload end
  });//Post end
}//export end
