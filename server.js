'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

// app.use(cors());
// app.use(cors({
//   origin: '*',
//   'Access-Control-Allow-Headers': '*',
//   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'Access-Control-Allow-Credentials': true,
// }));

// app.use(function(req,res,next){
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'https://maps.googleapis.com');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

app.use(express.static(`${__dirname}/dist`));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

