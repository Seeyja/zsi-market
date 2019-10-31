
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");

module.exports = {

  sendEmail: function( req, res ){

    const msg = {
      to: `${req.body.email}`, //req.res.email
      from: 'zsimarket@sellfast.pl',
      subject: 'Your new password - SellFast.pl',
      text: `Witaj ${req.body.login} ! Twoje hasło to: ${req.body.password}`,
      html: `<p style="color: blue">----- ZSI Market -----</p><br/>Witaj ${req.body.login} ! <br/> Twoje hasło to: <strong>${req.body.password}</strong>`,
    };
    
    sgMail.send(msg);
    console.log('afterSGMail');
  }
  
}