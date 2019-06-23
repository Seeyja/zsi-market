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

  findMyOffers: function(query, req, res, db){
    offersToShow=[]
    let queryExistingUserOut = db.query( query, ( err, foundOffersResult ) => {
        if( err ) throw err;
//            console.log( foundOffersResult );

        //Transformacja kilku obiektow w jeden. Zmiana 2 wlasciwosci na tablice
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

  });}

}//Module.Exports end
