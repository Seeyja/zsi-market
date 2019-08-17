// findOffers () - Wyszukuje i pakuje oferty w jedną tablice i przekazuje do res.render()

class Offer {
  constructor( foundOffer ){
    this.id = foundOffer.id;
    this.username = foundOffer.username;
    this.num = foundOffer.num;
    this.email = foundOffer.email;
    this.description = foundOffer.description;
    this.class = foundOffer.class;
    this.subjects = [];
    this.subjects.push( foundOffer.subject );
    this.links = [];
    this.links.push( foundOffer.link )
    this.titles = [];
    this.titles.push( foundOffer.title )

  }
}

let offersToShow;

module.exports = {

  insertSetAndOffer: function( setData, offerData, bookTypes, keepPhotos, req, db ){

    let photoData = {};
    offersToShow=[];

    let sqlOffersIn = 'INSERT INTO offers SET ?';
    let queryOffersIn = db.query(sqlOffersIn, offerData, (err, sqlOffersInResult)=>{
      if( err ) throw err;

      setData.offer_id = sqlOffersInResult.insertId;



      for ( subject in bookTypes ){
            console.log("JEDNAC");
        console.log(subject);

        if( typeof bookTypes[subject]!=='undefined' ){
          let sqlBookTypeOut = `SELECT id FROM book_type WHERE subject = '${subject}' AND class = '${req.body.class}' `;
          let queryBookTypeOut = db.query( sqlBookTypeOut, (err, sqlBookTypeOutResults )=>{
            if( err ) throw err;

            //console.log( sqlBookTypeOut );
            //console.log("Strange thing:");
            //console.log(subject);

            setData.book_type_id = sqlBookTypeOutResults[0].id;
            //console.log(setData);
            let sqlSetIn = 'INSERT INTO sets SET ?';
            let querySetIn = db.query(sqlSetIn, setData , (err, results)=>{
              if(err) throw err;
            });
          });

        }//ifNotUndefined end
      }//Subject for end
      console.log('3----------');
      console.log(req.files);
      for ( let i = 0; i < req.files.length; i++ ){

        photoData.link = req.files[i].filename;
        photoData.offer_id = sqlOffersInResult.insertId;
        console.log(photoData);

        const sqlPhotoIn = `INSERT INTO photos SET ?`;
        const queryPhotosIn = db.query( sqlPhotoIn, photoData)
      }//Photo for end
    });//Query offersIn end

  },//InsertSetAndOffer end

  findOffers: function(query, req, res, db){
    offersToShow=[]
    let queryExistingUserOut = db.query( query, ( err, foundOffersResult ) => {
        if( err ) throw err;
//            console.log( foundOffersResult );

//Transformacja kilku obiektow w jeden. Zmiana 2 wlasciwosci na tablice
//np 2 foto (osobne wyniki w wyszukiwaniu) polaczone w jedna oferte (set)

        for ( foundOffer of foundOffersResult ) {

          let alreadyinTable = 0;

          for( let i = 0; i < offersToShow.length; i++ ){

            if ( foundOffer.id != offersToShow[i].id )
              continue;

            else if ( foundOffer.id == offersToShow[i].id ){

              alreadyinTable = 1;

              if ( !offersToShow[i].links.includes( foundOffer.link ) )
                offersToShow[i].links.push( foundOffer.link );

              if ( !offersToShow[i].subjects.includes( foundOffer.subject ) )
                offersToShow[i].subjects.push( foundOffer.subject );

              if ( !offersToShow[i].titles.includes( foundOffer.title  ) )
                offersToShow[i].titles.push( foundOffer.title );

            }

            else console.log("Sth went wrong");

          }

          if (alreadyinTable == 0)
            offersToShow.push( new Offer( foundOffer ) );
//                console.log(offersToShow);

        }//For transformacja end

        console.log(offersToShow);
        res.render( 'index', {offersToShow: offersToShow} );

  });},

  addOffer: function( req, res, db ){

    console.log('conectionControler----------');
    console.log(req.files);


        let description = req.body.description;

        let code;
        do{
          code = Math.floor(Math.random()*1000000);
        } while(code < 100000)

        let userData = {
            username: req.body.login,
            num: req.body.num,
            email: req.body.email,
            code: code,
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
        let keepPhotos={
          links: [],
        };
        let offerData = {
            description: req.body.description,
            active: 0,
        };
        let entryCode;
        let setData={}; // Data for set table
        let photoUploadInfo;

        let sqlExistingUser = `SELECT * FROM users WHERE username = "${userData.username}" OR num = "${userData.num}" OR email="${userData.email}"`;
        let queryExistingUserOut = db.query( sqlExistingUser, ( err, foundUsers ) => {
            if( err ) throw err;

            if( foundUsers.length == 0 ) {

                let sqlUserIn = 'INSERT INTO users SET ?';
                let queryUsersIn = db.query( sqlUserIn, userData, ( err, sqlUserInResult )=>{

                  if(err) throw err;
                  offerData.user_id = sqlUserInResult.insertId;
                  queryController.insertSetAndOffer( setData, offerData, bookTypes, keepPhotos, req, db );

                });

                res.render( 'index', {hint: 'User and offer added...'} );

            }
            else {

              offerData.user_id = foundUsers[0].id;
              entryCode = foundUsers[0].code

              if ( typeof req.body.accessCode == 'undefined' ){

                for (unnedenPhoto of req.files) {

                  fs.unlink(`./public/uploads/${unnedenPhoto.filename}`, function (err) {
                    if (err) throw err;
                    // if no error, file has been deleted successfully
                    console.log('File deleted!');
                  });

                }

                res.render( 'login', {hint: 'There is already user like that! Enter your code:', entryCode: entryCode, keepData: userData, keepDescription: offerData.description, keepPhotos: keepPhotos, keepBookTypes: bookTypes} );
              }
              else if( req.body.accessCode === entryCode ){

                queryController.insertSetAndOffer( setData, offerData, bookTypes, keepPhotos, req, db )
                res.render( 'index', {hint: 'Offer added to existing user'} );

              }
              else{
                for (unnedenPhoto of req.files) {

                  fs.unlink(`./public/uploads/${unnedenPhoto.filename}`, function (err) {
                    if (err) throw err;
                    // if no error, file has been deleted successfully
                    console.log('File deleted!');
                  });

                }
                res.render( 'login', {hint: 'Wrong access Code!', keepData: userData, keepDescription: offerData.description, keepBookTypes: bookTypes} );
              }

          }//Foundusers else statement end
      });//Main query end
  },//addOffer end

}//Module.Exports end
