import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import mongoose from 'mongoose'; import { config } from './store/config';
import cors from 'cors';

import { applyPassportStrategy } from './store/passport';
import { userController, mailingController } from './controller';

const app = express(); // getting express

applyPassportStrategy(passport); app.use(cors()); // authentication using passportjs

app.use(bodyParser.urlencoded({ extended: true })); // body parser
app.use(bodyParser.json());

app.use('/', userController); // root
app.use('/mailing', mailingController);

const { port, MongoURI, MongoHost } = config.env; // getting attr

// starting server
app.listen(port, () => {
  console.log(`Server at port ${port}`);
  mongoose
    .connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log(`MongoDB at ${MongoHost}`);
    });
});
