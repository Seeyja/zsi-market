// insert user
module.exports = function(connectionController) {
  function insertUser(userData) {
    let sql = 'INSERT INTO users SET ?';
    let query = db.query(sql, userData, (err, result)=>{
      if(err) throw err;
      console.log(result);
    });
  }

  function insertOffer(offerData) {
    let sql = 'INSERT INTO offers SET ?';
    let query = db.query(sql, offerData, (err, result)=>{
      if(err) throw err;
      console.log(result);
    });
  }
}
