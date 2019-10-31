const queryController = require('./queryController');
const fs = require('fs');
const emailController = require('./emailController')

module.exports = {

  addOffer: function (req, res, db) {

    //    console.log('conectionControler----------2');
    //    console.log(req.files);


    let description = req.body.description;
    /*
            let code;
            do{
              code = Math.floor(Math.random()*1000000);
            } while(code < 100000)
    */
    //        let class = req.body.class;
    let userData = {
      username: req.body.login,
      num: req.body.num,
      email: req.body.email,
      code: req.body.password,
      //class: req.body.class,   !
    }
    let bookTypes = {
      polish: req.body.polish,
      english: req.body.english,
      german: req.body.german,
      history: req.body.history,
      entrepreneurship: req.body.entrepreneurship,
      geography: req.body.geography,
      biology: req.body.biology,
      chemistry: req.body.chemistry,
      physics: req.body.physics,
      math: req.body.math,
      safety: req.body.safety,
      religion: req.body.religion,
      professionalCourses: req.body.professionalCourses,
      society: req.body.society,
      culture: req.body.culture,
    }
    let keepPhotos = {
      links: [],
    };
    let offerData = {
      description: req.body.description,
      active: 1,
      price_from: req.body.price_from,
      price_to: req.body.price_to
    };
    console.log(offerData);
    let entryCode;
    let setData = {}; // Data for set table
    let photoUploadInfo;
    const alreadyUser = req.body.existingUser;

    let sqlExistingUser;

    console.log('ALREADY USER------------------------------');
    console.log(alreadyUser);
    

    if( typeof alreadyUser != "undefined" ){

      sqlExistingUser = `SELECT * FROM users WHERE
                            username = "${userData.username}"`;

      let queryExistingUserOut = db.query(sqlExistingUser, (err, foundUsers) => {
        if (err) throw err;

        if (foundUsers.length == 0) {

          res.status(401).send('No user like that');

        }
        else {

          offerData.user_id = foundUsers[0].id;

          if (userData.code === foundUsers[0].code) {

            queryController.insertSetAndOffer(setData, offerData, bookTypes, keepPhotos, req, db)
            res.status(201).send(`<p>Witaj <span class=userInfo>${userData.username}<span> !</p> Pomyślnie dodałeś ofertę. <p class = modalClass>Udanej sprzedaży!</p><p class=emailInfo>Możesz zobaczyć swoje oferty, wyszukując je w prawym górnym rogu</p>`)

          }
          else {

            for (unnedenPhoto of req.files) {

              fs.unlink(`./public/uploads/${unnedenPhoto.filename}`, function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                console.log('File deleted!');
              });

            }
            res.status(401).send("Wrong Password");
            // res.redirect("/pizda");
            //res.render('login', { hint: 'Taki użytkownik już istnieje. Podałeś złe hasło!', keepData: userData, keepDescription: offerData.description, keepBookTypes: bookTypes, keepClass: req.body.class, type: "wrongCode", keepPriceFrom: offerData.price_from, keepPriceTo: offerData.price_to });
            
          }

        }//Foundusers else statement end
      });//Main query end

    }
    else{
//-------------------------Check username -------------------------
      sqlExistingUser1 = `SELECT * FROM users WHERE
                          username = "${userData.username}"`
      let queryExistingUserOut1 = db.query(sqlExistingUser1, (err, foundUsers1) => {
        if (err) throw err;
        if (foundUsers1.length > 0) res.status(401).send("Username already used").end()
        else{

          //-------------------------Check email ----------------------------
          sqlExistingUser2 = `SELECT * FROM users WHERE
                              email = "${userData.email}"`
          let queryExistingUserOut2 = db.query(sqlExistingUser2, (err, foundUsers2) => {
            if (err) throw err;
            if (foundUsers2.length > 0 && foundUsers2[0].email != "") res.status(401).send("Email already used").end()
            else{

              //-------------------------Check number ---------------------------
              sqlExistingUser3 = `SELECT * FROM users WHERE
                                  num = "${userData.num}"`
              let queryExistingUserOut3 = db.query(sqlExistingUser3, (err, foundUsers3) => {
                if (err) throw err;
                if (foundUsers3.length > 0 && foundUsers3[0].num != "" ) res.status(401).send("Phone number already used").end();                
                else{

                  //-------------------------Insert user and Offer-----------------
                  let sqlUserIn = 'INSERT INTO users SET ?';
                  let queryUsersIn = db.query(sqlUserIn, userData, (err, sqlUserInResult) => {
                    if (err) throw err;

                    offerData.user_id = sqlUserInResult.insertId;
                    queryController.insertSetAndOffer(setData, offerData, bookTypes, keepPhotos, req, db);
                    emailController.sendEmail(req, res)

                    res.status(201).send(`<p>Witaj <span class=userInfo>${userData.username}<span> !</p> Pomyślnie dodałeś użytkownika oraz ofertę. <p class = modalClass>Udanej sprzedaży!</p><p class=emailInfo>Jeżeli podałeś Email, zostało także wysłane na Twoją skrzynkę</p>`);
                  });// Set in end

                }// else end

              });// 3 end

            }// else end

          });// 2 end

        }// else end


      });// 1 end

    }

    //sqlExistingUser = `SELECT * FROM users WHERE
      //                            username = "${userData.username}" AND`
     //                            (num = "${userData.num}" OR email="${userData.email}" )`
                                  
//undef == new user

  },//addOffer end

}
