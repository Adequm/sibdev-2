const express = require('express');
const app = express();
const server = require('http').createServer(app);

app.use(express.json());

const sqlite3 = require('sqlite3').verbose();
const dbPath = './server/.data/database.db';  
const db = new sqlite3.Database(dbPath);

const API_TOKEN = process.env.API_TOKEN || require('./api/token.js');
const api = require('./api/index.js')(db, API_TOKEN);



app.get('/createUser', api.createUser);
app.post('/auth', api.auth);

app.get('/db', api.db);
app.get('/dropDb', api.dropDb);
app.post('/getVideos', api.getVideos);

app.post('/getFavorites', api.getFavorites);
app.post('/addFavorite', api.addFavorite);


module.exports = { app, server };