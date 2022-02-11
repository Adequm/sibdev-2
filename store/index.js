import Vue from 'vue';
import _ from 'lodash';

export const state = () => ({
  storeSearch: null,
  totalResults: null,
  videos: [],
  mosaic: 'grid',

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
  async startSearch({ commit }, { query, limit = 12 }) {
    try {
      commit('setVideos', []);
      const { items, pageInfo, err } = await this.$axios.$post('/getVideos', { query, limit });

      commit('setSearch', query);
      if(err) return;
      commit('setVideos', items);
      commit('setTotalResults', pageInfo.totalResults);
    } catch(err) {
      console.log(err);
    }
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
        const {data} = await this.$axios.$post('/getFavorites', { id });
        commit('addFavoriteToList', data);
        resolve(data);
      } catch(err) {
        resolve(err);
      }
    });
  },

  addFavoriteToDB({ commit }, { userId, name, query, limit: maxLimit = 12 }) {
    // if(!userId || !name || !query) return { err: '' };
    return new Promise(async resolve => {
      try {
        const data = await this.$axios.$post('/addFavorite', { userId, name, query, maxLimit });
        console.log({ addFavoriteToDB: data })
        commit('addFavoriteToList', { userId, name, query, maxLimit });
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

  addFavoriteToList(state, favorites) {
    _.castArray(favorites).forEach(favorite => {
      state.favoriteSearches.push(favorite)
    })
  }
};