// dotenv load 
require('dotenv').config();

// express import 
const express = require('express');

// cors import
const cors = require('cors');

// express app 
const app = express();

app.use(cors());

app.use(express.json());

//testing
app.get('/', (req, res) => {
  res.json({ message: 'MediBook server চলছে! ✅' });
});

// app export 
module.exports = app;