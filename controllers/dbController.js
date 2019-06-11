const bookSearchController = require('./bookSearchController.js');
const uploadController = require('./uploadController.js');


const mysql = require( 'mysql' );
//Create connection

module.exports = function(){
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
}
