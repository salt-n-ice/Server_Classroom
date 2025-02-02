// require('dotenv').config
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import home from './routes/routes.js';
import dotenv from 'dotenv'
// import session from 'express-session';
// import passport from 'passport';
// import paaportLocalMongoose from 'passport-local-mongoose'

const app = express();
dotenv.config();
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('/home', home)

app.get("/", (req, res) => {
  res.send("Hello to E-Kaksha");
})

// const CONNECTION_URL = "mongodb+srv://admin-prakhar:cowardlycourage@cluster0.0c4sc.mongodb.net/Eclass";
const PORT = process.env.PORT|| 5000;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));
  // mongoose.set('useCreateIndex', true);
// mongoose.set('useFindAndModify', false);