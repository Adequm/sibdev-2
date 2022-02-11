<template>
  <div class="card" :class="{ extended }">
    <div class="card__image">
      <a :href="linkToVideo" target="_blank">
        <img :src="lodash.get(data, 'snippet.thumbnails.medium.url')"/>
      </a>
    </div>
    <div class="card__description">
      <a :href="linkToVideo" target="_blank">
        <h5 v-text="slimTitle" :title="lodash.get(this.data, 'snippet.title')"/>
      </a>
      <a :href="linkToChannel" target="_blank">
        <h6 v-text="lodash.get(data, 'snippet.channelTitle')"/>
      </a>
      <h6 v-text="viewCount"/>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'VideoCard',

  props: {
    data: Object,
    extended: Boolean,
  },

  data: () => ({
    lodash: _,
  }),

  computed: {
    linkToVideo() {
      return `https://www.youtube.com/watch?v=${ _.get(this.data, 'id.videoId') }`;
    },
    linkToChannel() {
      return `https://www.youtube.com/c/${ _.get(this.data, 'snippet.channelId') }`;
    },

    slimTitle() {
      let title = _.get(this.data, 'snippet.title', '');
      if(title.length >= 60 && !this.extended) title = title.slice(0, 57) + '...';
      return title;
    },

    viewCount() {
      const viewCount = _.get(this.data, 'statistics.viewCount', 0);
      const period = _.floor((viewCount.toString().length - 1) / 3);
      const typeCount = {
        0: '', // < 1.000
        1: 'тыс.', // < 1.000.000
        2: 'млн.', // < 1.000.000.000
        3: 'млрд.', // < 1.000.000.000.000
      }[period];
      
      let slimViews = viewCount / (1e3 ** period);
      if(slimViews.toFixed(1).length <= 3) slimViews = +slimViews.toFixed(1);
      else slimViews = +slimViews.toFixed(0);
      
      const typeViews = [1, 2, 3, 4].includes(+viewCount) ? 'просмотра' : 'просмотров';
      return `${ slimViews } ${ typeCount } ${ typeViews }`;
    },
  },


};
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
}

.card.extended {
  flex-direction: row;
}

a {
  text-decoration: none;
  color: inherit;
}

.card__image img {
  width: 100%;
  cursor: pointer;
  opacity: .8;
  transition: opacity .2s;
}

.extended .card__image img {
  height: 88px;
  width: 157px;
}

.card__image img:hover {
  opacity: 1;
  box-shadow: 0 0 0 1px #1390E5;
}

a h5:hover, a h6:hover {
  opacity: .8;
}

.extended .card__description {
  padding: 10px;
}

.card__description h5 {
  transition: opacity .2s;
  margin-top: 0;
  margin-bottom: 5px;
}
.card__description h6 {
  transition: opacity .2s;
  margin: 0;
  color: #909399
}
</style>