const mysql = require( 'mysql' );
const queryController = require('./queryController.js');
const fs = require('fs');
const multer = require('multer');

//const tymczasowyController = require('./tymczasowyController');

const upload = multer().none();

//Create connection
const db = mysql.createConnection({
    host     : 'mysql31.mydevil.net',
    user     : 'm1416_szpakusik',
    password : 'Norbi1909',
    database : 'm1416_bookservice'
});

// Connect
db.connect( ( err ) => {
    if( err ) throw err;
    console.log( 'Connected' );
});

module.exports = {

  db: db,



}//module.exports end
