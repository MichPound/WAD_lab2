import './db';
import dotenv from 'dotenv';
import express from 'express';
import moviesRouter from './api/movies';
import genresRouter from './api/genres';
import bodyParser from 'body-parser';
// import {loadUsers} from './seedData';
import usersRouter from './api/users';
import session from 'express-session';
import {loadUsers, loadMovies} from './seedData';
// import authenticate from './authenticate';

// replace existing import with passport strategy
import passport from './authenticate';

dotenv.config();

if (process.env.SEED_DB) {
  loadUsers();
  loadMovies();
}

const errHandler = (err, req, res, next) => {
  /* if the error in development then send stack trace to display whole error,
  if it's in production then just send error message  */
  if(process.env.NODE_ENV === 'production') {
    return res.status(500).send(`Something went wrong!`);
  }
  res.status(500).send(`Hey!! You caught the error 👍👍, ${err.stack} `);
};

const app = express();

const port = process.env.PORT;

//configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// initialise passport
app.use(passport.initialize());

app.use(session({
  secret: 'ilikecake',
  resave: true,
  saveUninitialized: true
}));

app.use(express.static('public'));

app.use('/api/users', usersRouter);
app.use('/api/genres', genresRouter);
// Add passport.authenticate(..)  to middleware stack for protected routes
app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesRouter);
// app.use('/api/movies', authenticate, moviesRouter);
app.use(errHandler);


app.listen(port, () => {
  console.info(`Server running at ${port}`);
});