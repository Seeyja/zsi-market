// findOffers () - Wyszukuje i pakuje oferty w jedną tablice i przekazuje do res.render()
const fs = require('fs');
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

function insertDefaultPhoto(offerId, db) {

  photoInfo = { offer_id: offerId, link: 'default.jpg' };

  let sqlPhotoIn = 'INSERT INTO photos SET ?';
  let queryPhotoIn = db.query( sqlPhotoIn, photoInfo, (err, sqlPhotoInResult)=>{
    if( err ) throw err;
  })

}
function deleteDefaultPhoto(offerId, db) {

  let sqlPhotoOut = `DELETE FROM photos WHERE offer_id = ${offerId} AND link = "default.jpg"`;
  let queryPhotoOut = db.query( sqlPhotoOut, (err, sqlPhotoOutResult)=>{
    if( err ) throw err;
    console.log(sqlPhotoOutResult);
  })

}

let offersToShow;
let confirmedOffersToShow;

module.exports = {

  insertSetAndOffer: function( setData, offerData, bookTypes, keepPhotos, req, db ){

    let photoData = {};
    offersToShow=[];

    let sqlOffersIn = 'INSERT INTO offers SET ?';
    let queryOffersIn = db.query(sqlOffersIn, offerData, (err, sqlOffersInResult)=>{
      if( err ) throw err;

      setData.offer_id = sqlOffersInResult.insertId;

      console.log("WOOOOOOOOOOOOOOOOHOOO");
      console.log(keepPhotos);
      //insertDefaultPhoto(setData.offer_id);

      for ( subject in bookTypes ){

        if( typeof bookTypes[subject] !== 'undefined' ){

          let sqlBookTypeOut = `SELECT id FROM book_type WHERE subject = '${subject}' AND class = '${req.body.class}' `;
          let queryBookTypeOut = db.query( sqlBookTypeOut, (err, sqlBookTypeOutResults )=>{
            if( err ) throw err;

/*          console.log( sqlBookTypeOut );
            //console.log("Strange thing:");
            console.log(subject);
            console.log(req.body.class); */

            setData.book_type_id = sqlBookTypeOutResults[0].id;

            let sqlSetIn = 'INSERT INTO sets SET ?';
            let querySetIn = db.query(sqlSetIn, setData, ( err, results )=>{
              if(err) throw err;
            });

          });

        }//ifNotUndefined end
      }//Subject for end
//      console.log('3----------');
//      console.log(req.files);

      if (req.files.length == 0) {
        insertDefaultPhoto(setData.offer_id, db);
      }

//------------------------------
      for ( let i = 0; i < req.files.length; i++ ){

        photoData.link = req.files[i].filename;
        photoData.offer_id = sqlOffersInResult.insertId;
        console.log(photoData);

        const sqlPhotoIn = `INSERT INTO photos SET ?`;
        const queryPhotosIn = db.query( sqlPhotoIn, photoData)
      }//Photo for end
//------------------------------

    });//Query offersIn end

  },

  findOffers: function(query, req, res, db, requiredSubjectsString){

    if ( typeof requiredSubjectsString != "undefined")
        requiredSubjects = requiredSubjectsString.split(' ');

    offersToShow=[];
    confirmedOffersToShow=[];
    let queryExistingUserOut = db.query( query, ( err, foundOffersResult ) => {
        if( err ) throw err;

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

        //Show if offer includes all checked subjects

        if ( typeof requiredSubjectsString != "undefined" ){
          for ( offer of offersToShow ) {

//            console.log( offer );

              let toAddFlag = 0;
              let confirmationArray = [];

              for ( subject of requiredSubjects ) {

                  if ( offer.subjects.includes( subject ) )
                    confirmationArray.push( 1 );
                  else
                    confirmationArray.push( 0 );

              }

              if ( !confirmationArray.includes( 0 ) )
                confirmedOffersToShow.push( offer );

          }
          confirmedOffersToShow.reverse();
          res.render( 'index', {offersToShow: confirmedOffersToShow} );
        }

        else{
          offersToShow.reverse();
          res.render( 'index', {offersToShow: offersToShow} );
        }



//        console.log(offersToShow);



});},


  modifyOffer: function( req, res, db ){

          let description = req.body.description;
          let code;
          let userData = {
              username: req.body.login,
              num: req.body.num,
              email: req.body.email,
            //  code: code,
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
          let offerData = {
              description: req.body.description,
              active: 0,
          };
          let entryCode;
          let setData={}; // Data for set table
          let photoData={};

                  let sqlChangeUserData =   `UPDATE users
                                            SET email = '${userData.email}', num = '${userData.num}'
                                            WHERE username = '${userData.username}'`;

                  let queryChangeUserData = db.query( sqlChangeUserData, ( err, changeResult ) => {
                    if( err ) throw err;
                    console.log(changeResult);
                  });//Change query end

                  let sqlChangeOfferData =  `UPDATE offers
                                            SET description = '${req.body.description}', active = 0
                                            WHERE id = '${req.body.offerId}'`;

                  let queryChangeOfferData = db.query( sqlChangeOfferData, ( err, changeResult ) => {
                    if( err ) throw err;
                  });//Change query end

                  let sqlFindEverySubjectInOffer = `SELECT book_type.subject, book_type.id FROM book_type, sets WHERE sets.offer_id = '${req.body.offerId}' AND sets.book_type_id = book_type.id`;
                  let queryFindEverySubjectInOffer = db.query( sqlFindEverySubjectInOffer, ( err, selectSubjectsResult ) => {
                    if( err ) throw err;
                    let subjectsFromQuery = [];
                    let subjectsFromRequest = [];
                    let finalSubjects = [];

                    for ( simpleResult of selectSubjectsResult )
                        subjectsFromQuery.push( simpleResult.subject );

                    for ( subject in bookTypes )
                      if( typeof bookTypes[subject] !== 'undefined' ) //Cuz "subject" is always defined
                        subjectsFromRequest.push( subject );

                    //Adding difference
                    for ( subject in bookTypes ){
                      if( typeof bookTypes[subject] !== 'undefined' && !subjectsFromQuery.includes( bookTypes[subject] ) ){
                        let sqlBookTypeOut = `SELECT id FROM book_type WHERE subject = '${subject}' AND class = '${req.body.class}' `;
                        let queryBookTypeOut = db.query( sqlBookTypeOut, (err, sqlBookTypeOutResults )=>{
                          if( err ) throw err;

              /*          console.log( sqlBookTypeOut );
                          //console.log("Strange thing:"); ? bookTypes[subject]??
                          console.log(subject);
                          console.log(req.body.class); */

                          setData.book_type_id = sqlBookTypeOutResults[0].id;
                          setData.offer_id = req.body.offerId;

                          let sqlSetIn = 'INSERT INTO sets SET ?';
                          let querySetIn = db.query(sqlSetIn, setData, ( err, results )=>{
                            if(err) throw err;
                          });

                        });

                      }//ifNotUndefined end

                    }//Subject for end

                    //Deleting difference
                    for ( subject of selectSubjectsResult ) {
                      if( !subjectsFromRequest.includes( subject.subject ) ){

                        let sqlDeleteSetPart = `DELETE FROM sets WHERE book_type_id = '${subject.id}' AND offer_id = '${req.body.offerId}'`;
                        let queryDeleteSetPart = db.query( sqlDeleteSetPart, ( err, deleteSubjectsResult ) => {
                          if( err ) throw err;
                        });

                      }
                    }

                  });//Select Subject end

                  //Adding photos
                  for ( let i = 0; i < req.files.length; i++ ){

                    photoData.link = req.files[i].filename;
                    photoData.offer_id = req.body.offerId;
                    console.log(photoData);

                    const sqlPhotoIn = `INSERT INTO photos SET ?`;
                    const queryPhotosIn = db.query( sqlPhotoIn, photoData)
                  }//Photo for end

                  console.log("ATTENTIONE"+req.body.firstPhoto);

                  let sqlPhotosLength = `SELECT * FROM photos WHERE offer_id = '${req.body.offerId}' `;
                  let queryPhotosLength = db.query( sqlPhotosLength, ( err, photosLengthResult )=>{
                  if (err)  throw err;

                    if ( photosLengthResult.length > 1 && photosLengthResult[0].link == "default.jpg" ) {
                      console.log("USUWAM ZDJECIE DOMYSLNE");
                      deleteDefaultPhoto( req.body.offerId, db);
                    }

                  });


                  res.render( 'index', {hint: 'Udało się zmienić ofertę'});
  //  });//upload End
  },

  deletePhoto: function( req, res, db ){

/*    let userData = {
        username: offersToShow[0].username,
        num: offersToShow[0].num,
        email: offersToShow[0].email,
        offerId: offersToShow[0].id
    }*/
    let offerId = req.body.offerId
    console.log("JAAADA "+offerId);
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
    let bookTypesArray =[];

    console.log("req.body:");
    console.log(req.body);

    for ( subject in bookTypes ){

      if( typeof bookTypes[subject] !== 'undefined' ){

        bookTypesArray.push(subject);

      }//ifNotUndefined end
    }//Subject for end

    /*Dont show deleted photo
    for (let i = 0; i < offersToShow[0].links.length; i++)
      if ( offersToShow[0].links[i] == req.body.unlink)
        offersToShow[0].links.splice( i, 1 )
    */

      let sqlDeletePhoto = `DELETE FROM photos WHERE link = '${req.body.unlink}'`;
      let queryDeletePhoto = db.query( sqlDeletePhoto, ( err, deletePhotoResult ) => {
        if( err ) throw err;
        console.log(deletePhotoResult);
      });
//----------------------------ADD DEFAULT IF LAST
      let sqlPhotosLength = `SELECT * FROM photos WHERE offer_id = '${req.body.offerId}' `;
      let queryPhotosLength = db.query( sqlPhotosLength, ( err, photosLengthResult )=>{

        if (err)  throw err;

        if ( photosLengthResult.length == 0 ) {
          insertDefaultPhoto( req.body.offerId, db);
        }



        console.log("WER HERE ZIOMOOOO");
        console.log(photosLengthResult);

        let photoArray=[];
        for (photo of photosLengthResult) {
          photoArray.push( photo.link )
        }

        res.render( 'loginModify', {offerId: offerId, keepData: userData, keepDescription: req.body.description, keepBookTypes: req.body.searchList, keepPhotos: photoArray} );//photosLengthResult

      })
    //console.log(photosLengthResult[0]);




//------------------------
  }

}//Module.Exports end
