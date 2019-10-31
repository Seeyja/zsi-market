const multer = require('multer');
//const mysql = require( 'mysql' );
const connectionController = require('./connectionController');
const queryController = require('./queryController.js');
const userController = require('./userController');
const path = require('path');
const session = require('express-session');

const db = connectionController.db;

//  Set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + Math.floor( ( Math.random() * 100 ) + 1 ) + path.extname(file.originalname) );
  }
})

//  Init Upload
const upload = multer({
  storage: storage,
  limits: {fileSize: 30000000},
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).array('files', 15);

//  Check File Type
function checkFileType( file, cb ) {
    // Allowed extentions
    const filetypes = /jpeg|jpg|png|gif/;
    //Check the extentions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //Check mimetype
    const mimetype = filetypes.test(file.mimetype);

    if( extname && mimetype ){
      return cb( null, true );
    }else {
      cb('error: Img only!', false);
    }
}


module.exports = function( app ){

  app.get( '/', ( req, res )=>{
    /*
    res.render('index')
    */
    
    

    let sqlOffersQuery;
    let searchType;

    searchType="all";
    sqlOffersQuery = `SELECT users.username, users.num, users.email, offers.description, offers.price_from, offers.price_to, book_type.subject, photos.link, offers.id, book_type.class, book_type.title, offers.add_date FROM
                                offers  INNER JOIN users ON offers.user_id = users.id
                                        INNER JOIN photos ON photos.offer_id = offers.id
                                        INNER JOIN sets ON sets.offer_id = offers.id
                                        RIGHT JOIN book_type ON book_type.id = sets.book_type_id
                                        WHERE offers.active = 1
                                        AND photos.active = 1
                                        ORDER BY offers.id DESC LIMIT 105`
    
    queryController.findOffers(sqlOffersQuery, req, res, db, req.query.searchList, searchType);
    
  })

  app.get( '/books', ( req, res )=>{

    let sqlOffersQuery;
    let searchType;

      // Send Query and SearchType to queryController.findOffers()
      if ( typeof req.query.searchList != "undefined" ) {

        if( req.query.searchList == "" ){

          searchType="byClass";
          sqlOffersQuery = `SELECT users.username, users.num, users.email, offers.description, offers.price_from, offers.price_to, book_type.subject, photos.link, offers.id, book_type.class, book_type.title, offers.add_date FROM
                                  offers  INNER JOIN users ON offers.user_id = users.id
                                          INNER JOIN photos ON photos.offer_id = offers.id
                                          INNER JOIN sets ON sets.offer_id = offers.id
                                          RIGHT JOIN book_type ON book_type.id = sets.book_type_id
                                          WHERE offers.active = 1
                                          AND photos.active = 1
                                          AND book_type.class = ${ req.query.class }` ;

        }

        else {

          searchType="bySubject";
          let subjectListString = req.query.searchList.replace(/ /gi, '" OR book_type.subject = "');
          sqlOffersQuery = `SELECT users.username, users.num, users.email, offers.description, offers.price_from, offers.price_to, book_type.subject, photos.link, offers.id, book_type.class, book_type.title, offers.add_date FROM
                                  offers  INNER JOIN users ON offers.user_id = users.id
                                          INNER JOIN photos ON photos.offer_id = offers.id
                                          INNER JOIN sets ON sets.offer_id = offers.id
                                          RIGHT JOIN book_type ON book_type.id = sets.book_type_id
                                          WHERE sets.offer_id IN
                                            (SELECT sets.offer_id FROM sets INNER JOIN book_type ON sets.book_type_id = book_type.id
                                            WHERE book_type.subject = "${subjectListString}" )
                                          AND offers.active = 1
                                          AND photos.active = 1
                                          AND book_type.class = ${ req.query.class }` ;

        }


      } else if( typeof req.query.login != "undefined" ) {

        searchType="byLogin";
        req.query.searchList = undefined;

        sqlOffersQuery = `SELECT users.username, users.num, users.email, offers.description, offers.price_from, offers.price_to, book_type.subject, photos.link, offers.id, book_type.class, book_type.title, offers.add_date, offers.active FROM
                                                                offers  INNER JOIN users ON offers.user_id = users.id
                                                                        INNER JOIN photos ON photos.offer_id = offers.id
                                                                        INNER JOIN sets ON sets.offer_id = offers.id
                                                                        INNER JOIN book_type ON book_type.id = sets.book_type_id
                                                                        WHERE sets.offer_id IN
                                                                          (SELECT sets.offer_id FROM sets INNER JOIN book_type ON sets.book_type_id = book_type.id
                                                                          WHERE users.username = "${req.query.login}" )
                                                                        AND photos.active = 1` ;

      } else res.render('index');

      queryController.findOffers(sqlOffersQuery, req, res, db, req.query.searchList, searchType);
    
  } );

  app.post( '/books', ( req, res )=>{

    // Pobiera pliki i dane z inputow i przekazuje jako req do addOffer()
    upload( req, res, ( err )=>{

        if(err) throw err;
        userController.addOffer( req, res, db );

    });

  } );

  app.post( '/sendmodification',  ( req, res )=>{

    upload( req, res, ( err )=>{

      queryController.modifyOffer( req, res, db );

    }) //Upload end
  });

  app.post( '/deletePhoto',  ( req, res )=>{

    upload( req, res, ( err )=>{
      queryController.deletePhoto( req, res, db );
    }) //Upload end

  });

  app.post( '/deleteOffer',  ( req, res )=>{

    upload( req, res, ( err )=>{
      queryController.deleteOffer( req, res, db );
    }) //Upload end

  });

  app.post( '/logout', ( req, res )=>{
    req.session.destroy( (err)=>{
      if ( err ) throw err

      searchType="logout";
      sqlOffersQuery = `SELECT users.username, users.num, users.email, offers.description, offers.price_from, offers.price_to, book_type.subject, photos.link, offers.id, book_type.class, book_type.title, offers.add_date FROM
                                  offers  INNER JOIN users ON offers.user_id = users.id
                                          INNER JOIN photos ON photos.offer_id = offers.id
                                          INNER JOIN sets ON sets.offer_id = offers.id
                                          RIGHT JOIN book_type ON book_type.id = sets.book_type_id
                                          WHERE offers.active = 1
                                          AND photos.active = 1
                                          ORDER BY offers.id DESC LIMIT 105`
      
      queryController.findOffers(sqlOffersQuery, req, res, db, req.query.searchList, searchType);

    })
  })

  /*app.post( '/modifySet',  ( req, res )=>{

    upload( req, res, ( err )=>{

      queryController.modifySet( req, res, db );

    }) //Upload end
  });*/
}//export end
