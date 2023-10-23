const express = require('express');
const cors = require('cors');
const port = process.env.PORT||4040;
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();

// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello From GreenWay Academic Web!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })