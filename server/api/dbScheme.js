const dbScheme = {};


dbScheme.dbUsers = {
  id: String,
  token: String, 
  login: String, 
  password: String,
};

dbScheme.dbFavorites = {
  id: String,
  userId: String,
  maxLimit: String,
  name: String,
  query: String,
  filter: String,
};


module.exports = dbScheme;