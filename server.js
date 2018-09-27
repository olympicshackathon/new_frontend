'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.static(`${__dirname}/dist`));

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});