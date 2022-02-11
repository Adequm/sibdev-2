require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);

app.use(express.json());

const sqlite3 = require('sqlite3').verbose();
const dbPath = './server/.data/database.db';  
const db = new sqlite3.Database(dbPath);

const api = require('./api/index.js')(db, process.env.API_TOKEN);



// app.get('/createUser', api.createUser);
app.post('/auth', api.auth);

app.get('/db', api.db);
// app.get('/dropDb', api.dropDb);
app.post('/getVideos', api.getVideos);

app.post('/getFavorites', api.getFavorites);
app.post('/addFavorite', api.addFavorite);
app.post('/deleteFavorite', api.deleteFavorite);
app.post('/updateFavorite', api.updateFavorite);


module.exports = { app, server };