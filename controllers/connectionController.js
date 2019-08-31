const mysql = require( 'mysql' );
const queryController = require('./queryController.js');
const fs = require('fs');
const multer = require('multer');

//const tymczasowyController = require('./tymczasowyController');

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



}//module.exports end
