import ejs from 'ejs';
import nodemailer from 'nodemailer';
const { google } = require('googleapis'); const { OAuth2 } = google.auth;

import userController from './user.controller';
import mailingController from './mailing.controller';

export { userController, mailingController };


const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';

const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS,
} = process.env; 

const mailing = {};

const oauth2Client = new OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  OAUTH_PLAYGROUND
); 

const TEMPLATES = {
  subscribe: {
    fileName: 'subscribe.ejs',
    subject: 'Hello!',
  },
};

mailing.sendEmail = data => {
  oauth2Client.setCredentials({
    refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
  }); const accessToken = oauth2Client.getAccessToken(); const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: SENDER_EMAIL_ADDRESS,
      clientId: MAILING_SERVICE_CLIENT_ID,
      clientSecret: MAILING_SERVICE_CLIENT_SECRET,
      refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
      accessToken,
    },
  });

  const file = `${__dirname}/templates/${TEMPLATES[data.template].fileName}`; // file 

  ejs.renderFile(file, data, {}, (e, content) => {
    if (e) return e;
    const mailOptions = {
      from: SENDER_EMAIL_ADDRESS,
      to: data.email,
      subject: TEMPLATES[data.template].subject,
      html: content,
    }; 
    // using smtp
    smtpTransport.sendMail(mailOptions, (err, info) => {
      if (err) return err;
      return info;
    });
  });
}; 
export default mailing;
