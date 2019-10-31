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

    let sqlExistingUser = `SELECT * FROM users WHERE
                                  username = "${userData.username}" OR
                                  (num = "${userData.num}" AND num != "") OR
                                  (email="${userData.email}" AND email !="")`;
    let queryExistingUserOut = db.query(sqlExistingUser, (err, foundUsers) => {
      if (err) throw err;

      if (foundUsers.length == 0) {

        let sqlUserIn = 'INSERT INTO users SET ?';
        let queryUsersIn = db.query(sqlUserIn, userData, (err, sqlUserInResult) => {

          if (err) throw err;
          offerData.user_id = sqlUserInResult.insertId;
          queryController.insertSetAndOffer(setData, offerData, bookTypes, keepPhotos, req, db);
          emailController.sendEmail(req, res)
        });

        res.render('index', { hint: `<p>Witaj <span class=userInfo>${userData.username}<span> !</p> Twoje hasło do zmian w ogłoszeniu: <p class = modalClass>${userData.code}</p><p class=emailInfo>Jeżeli podałeś Email, zostało także wysłane na Twoją skrzynkę</p>`, type: 'newUser' });

      }
      else {

        offerData.user_id = foundUsers[0].id;
        entryCode = foundUsers[0].code

        if (userData.code === entryCode) {

          queryController.insertSetAndOffer(setData, offerData, bookTypes, keepPhotos, req, db)
          res.render('index', { hint: `<p>Witaj <span class=userInfo>${userData.username}<span> !</p> Pomyślnie dodałeś ofertę.`, type: "correctCode" });

        }
        else {

          for (unnedenPhoto of req.files) {

            fs.unlink(`./public/uploads/${unnedenPhoto.filename}`, function (err) {
              if (err) throw err;
              // if no error, file has been deleted successfully
              console.log('File deleted!');
            });

          }
          res.render('login', { hint: 'Taki użytkownik już istnieje. Podałeś złe hasło!', keepData: userData, keepDescription: offerData.description, keepBookTypes: bookTypes, keepClass: req.body.class, type: "wrongCode", keepPriceFrom: offerData.price_from, keepPriceTo: offerData.price_to });

        }

      }//Foundusers else statement end
    });//Main query end
  },//addOffer end

}
