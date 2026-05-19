// dotenv load করো — সবার আগে এটা করতে হবে
require('dotenv').config();

// express import করো — এটাই আমাদের server framework
const express = require('express');

// cors import করো
// cors ছাড়া React (localhost:5173) থেকে backend (localhost:5000) এ request করলে browser block করে দেবে
const cors = require('cors');

// express app তৈরি করো
const app = express();

// ─── Middleware ───────────────────────────────────────────────
// middleware মানে request আসলে সেটা controller-এ পৌঁছানোর আগে যা যা করতে হবে

// cors চালু করো — React frontend থেকে request আসতে দেবে
app.use(cors());

// JSON parser — request-এর body JSON হলে সেটা পড়তে পারবে
// এটা ছাড়া req.body undefined আসবে
app.use(express.json());

// ─── Test route ───────────────────────────────────────────────
// এই route শুধু দেখার জন্য যে server কাজ করছে কিনা
// পরে এটা সরিয়ে আসল routes লাগাবো
app.get('/', (req, res) => {
  res.json({ message: 'MediBook server চলছে! ✅' });
});

// app export করো — server.js এটা import করবে
module.exports = app;