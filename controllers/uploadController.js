const multer = require('multer');
const path = require('path');
const connectionController = require('./connectionController.js');

let returnedObject = { pathTab: [],};

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

  app.post('/sendmodification', function ( req, res ) {

    upload( req, res, ( err )=>{
      console.log('we r in upload');

      connectionController.modifyItControllerFunction( req, res );

    }) //Upload end

  })

  app.post('/main', function ( req, res ) {

    upload( req, res, ( err )=>{

      if(err) throw err;

      if ( req.files == undefined )
        err = "Error: No file selected";

      else
        err = 'File uploaded';
      console.log( req.body );
      console.log( req.files );

      connectionController.connectionControllerFunction( req, res );


    }) //Upload end

  });// app.post end
}//Module Exports end
