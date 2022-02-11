const _ = require('lodash');
const fetch = require('node-fetch');
const { v4: uuid } = require('uuid');

module.exports = (db, TOKEN) => {
  const api = {};
  const dbUtils = require('./dbUtils')({ db });
  const dbScheme = require('./dbScheme');

  const apiSearch = ({ query, limit = 1 }) => `https://www.googleapis.com/youtube/v3/search?key=${ TOKEN }&type=video&q=${ query }&maxResults=${ limit }`;
  const apiVideo = ({ id }) => `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&key=${ TOKEN }&id=${ id }`;

  api.db = async (req, res) => {
    const data = await new Promise(async resolve => {
      try {
        await dbUtils.serialize();
        dbUtils.select(req.query.db).then(resolve);
      } catch(err) {
        resolve({ err });
      }
    })
    res.json(data);
  };

  api.dropDb = async (req, res) => {
    const data = await new Promise(async resolve => {
      try {
        db.all(`DROP TABLE ${ req.query.db }`, () => resolve({ drop: req.query.db }));
      } catch(err) {
        resolve({ err });
      }
    })
    res.json(data);
  }


  api.createUser = async (req, res) => {
    const { login, password } = req.query;
    const id = uuid();
    const token = uuid();
    const user = await new Promise(async (resolve, reject) => {
      try {
        await dbUtils.serialize();
        const { rows, err } = await dbUtils.select('users', { where: { login } });
        if(!err && rows.length) resolve({ err: 'Пользователь существует' }); 
        await dbUtils.createTable('users', dbScheme.dbUsers);
        await dbUtils.putToTable('users', { login, password, id, token });
        resolve({ auth: true, id, token }); 
      } catch(err) {
        resolve({ err });
      }
    })
    res.json(user)
  };

  api.auth = async (req, res) => {
    const { login, password, token } = req.body;
    const user = await new Promise(async resolve => {
      try {
        await dbUtils.serialize();
        const where = token ? { token } : { login, password };
        const { err, rows: users } = await dbUtils.select('users', { where });
        if(err || !users.length) throw err;
        resolve({ auth: true, ..._.omit(users[0], ['login', 'password']) });
      } catch(err) {
        resolve({ auth: false, err });
      }
    });
    res.json(user);
  };


  api.getVideos = async (req, res) => {
    try {
      const linkSearch = apiSearch(req.body) // query, limit
      const dataSearch = await (await fetch(linkSearch)).json();
      const dataVideos = _.map(dataSearch.items, search => {
        return new Promise(async resolve => {
          const linkVideo = apiVideo({ id: search.id.videoId });
          const dataVideo = await (await fetch(linkVideo)).json();
          search.contentDetails = dataVideo.items[0].contentDetails;
          search.statistics = dataVideo.items[0].statistics;
          search.snippet = dataVideo.items[0].snippet;
          resolve(search);
        })
      });
      dataSearch.items = await Promise.all(dataVideos);
      res.json(dataSearch);
    } catch(err) {
      res.json({ err });
    }
  }

  api.getFavorites = async (req, res) => {
    try {
      await dbUtils.serialize();
      const where = { userId: req.body.id };
      const { err, rows: favorites } = await dbUtils.select('favorites', { where });
      if(err || !favorites.length) throw err;
      res.json({ data: favorites });
    } catch(err) {
      res.json({ err });
    };
  };

  api.addFavorite = async (req, res) => {
    try {
      const dbName = 'favorites';
      const where = _.pick(req.body, ['userId', 'name', 'query', 'maxLimit', 'filter']);
      
      await dbUtils.serialize();
      const { rows, err } = await dbUtils.select(dbName, { where });
      if(!err && rows.length) throw 'Уже в избранном'; 
      await dbUtils.createTable(dbName, dbScheme.dbFavorites);
      await dbUtils.putToTable(dbName, where);

      res.json({ success: true });
    } catch(err) {
      res.json({ err });
    }
  };

  return api;
};