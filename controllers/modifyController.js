module.exports = function( app ){

    app.post('/account', function( req, res ) {

      upload( req, res, ( err )=>{
        console.log(req.body);
        res.render( 'index', {offersToShow: offersToShow} );
      });
    });
  }
