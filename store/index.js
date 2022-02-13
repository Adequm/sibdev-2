import Vue from 'vue';
import _ from 'lodash';

export const state = () => ({
  storeSearch: null,
  totalResults: null,
  videos: [],
  mosaic: 'list',

  favoriteSearches: [],
  token: null,
  userId: null,
  isCheckAuth: false,
});

export const getters = {
  isFavoriteSearch({ storeSearch, favoriteSearches }) {
    return _.find(favoriteSearches, { query: storeSearch });
  },
};

export const actions = {
  async startSearch({ commit }, { query, maxLimit = 12, filter = 'relevance' }) {
    return new Promise(async resolve => {
      try {
        commit('setVideos', []);
        commit('setSearch', query);
        const { items, pageInfo, err } = await this.$axios.$post('/getVideos', { query, maxLimit, filter });

        if(err) throw err;
        commit('setVideos', items);
        commit('setTotalResults', pageInfo.totalResults);
        resolve({ items });
      } catch(err) {
        resolve({ err });
      }
    })
  },

  login({}, { token, login, password }) {
    if(!token && !login && !password) return { auth: false };
    return new Promise(async resolve => {
      try {
        const data = await this.$axios.$post('/auth', { token, login, password });
        resolve(data);
      } catch(err) {
        resolve(err);
      }
    })
  },

  getFavorites({ commit }, { id }) {
    if(!id) return { err: 'No id' };
    return new Promise(async resolve => {
      try {
        commit('clearFavoritesList');
        const {data} = await this.$axios.$post('/getFavorites', { id });
        commit('addFavoriteToList', data);
        resolve(data);
      } catch(err) {
        resolve(err);
      }
    });
  },

  addFavoriteToDB({ commit }, { userId, name, query, maxLimit = 12, filter = 'relevance' }) {
    // if(!userId || !name || !query) return { err: '' };
    return new Promise(async resolve => {
      try {
        const keys = { userId, name, query, maxLimit, filter, id: Date.now().toString() };
        const data = await this.$axios.$post('/addFavorite', keys);

        commit('addFavoriteToList', keys);
        resolve(data);
      } catch(err) {
        resolve({ err });
      }
    });
  },

  deleteFavorite({ commit }, query) {
    const where = _.pick(query, ['id']);

    return new Promise(async resolve => {
      try {
        const data = await this.$axios.$post('/deleteFavorite', where);
        commit('deleteFavoriteFromList', where);
        resolve(data);
      } catch(err) {
        resolve({ err });
      }
    });
  },

  updateFavorite({ commit }, farorite) {
    const where = _.pick(farorite.old, ['id']);

    return new Promise(async resolve => {
      try {
        const data = await this.$axios.$post('/updateFavorite', { where, new: farorite.new });
        console.log(data)
        if(data.err) return;
        commit('updateFavoriteFromList', { where, new: farorite.new });
        resolve(data);
      } catch(err) {
        resolve({ err });
      }
    });
  },
};

export const mutations = {
  setMosaic: (state, mosaic) => Vue.set(state, 'mosaic', mosaic),
  setSearch: (state, search) => Vue.set(state, 'storeSearch', search),
  setVideos: (state, videos) => Vue.set(state, 'videos', videos),
  setTotalResults: (state, totalResults) => Vue.set(state, 'totalResults', totalResults),

  logout(state) {
    Vue.set(state, 'token', null);
    Vue.set(state, 'userId', null);
    
    // Vue.set(state, 'isCheckAuth', false);
  },
  authSuccess(state) {
    Vue.set(state, 'isCheckAuth', true);
  },
  setToken(state, token) {
    Vue.set(state, 'token', token);
  },
  setUserId(state, userId) {
    Vue.set(state, 'userId', userId);
  },

  clearFavoritesList(state) {
    Vue.set(state, 'favoriteSearches', []);
  },

  addFavoriteToList(state, favorites) {
    _.castArray(favorites).forEach(favorite => {
      if(favorite) state.favoriteSearches.push(favorite)
    })
  },

  deleteFavoriteFromList(state, where) {
    const index = _.findIndex(state.favoriteSearches, where);
    if(index < 0) return;
    state.favoriteSearches.splice(index, 1);
  },

  updateFavoriteFromList(state, where) {
    const index = _.findIndex(state.favoriteSearches, where);
    if(index < 0) return;
    state.favoriteSearches[index] = {
      ...state.favoriteSearches[index],
      ...where
    }
  },
};