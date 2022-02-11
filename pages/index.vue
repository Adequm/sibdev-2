<template>
  <div>

    <template v-if="!storeSearch">
      <el-row type="flex" justify="center" style="min-height: calc(100vh - 300px);">
        <el-col :span="16" class="center">
          <h1>Поиск видео</h1>

          <form style="width: 100%" @submit.prevent="startSearchVideos">
            <el-input placeholder="Что хотите посмотреть?" v-model="search">
              <i slot="suffix" class="el-input__icon">
                <el-button 
                  slot="append" 
                  type="primary"
                  size="small"
                  @click="startSearchVideos"
                >Найти</el-button>
              </i>
            </el-input>
          </form>

        </el-col>
      </el-row>
    </template>

    <template v-else>
      <el-row type="flex" justify="center">
        <el-col>
          <h1>Поиск видео</h1>

          <form style="width: 100%" @submit.prevent="startSearchVideos">
            <el-input placeholder="Что хотите посмотреть?" v-model="search">
              <i slot="suffix" class="el-input__icon">


                <el-tooltip placement="top" :content="isFavoriteSearch ? 'Добавно в избранное' : 'Добавить в избранное'">
                  <el-button 
                    plain 
                    :icon="`el-icon-star-${ isFavoriteSearch ? 'on' : 'off' }`" 
                    :type="isFavoriteSearch ? 'success' : 'default'"
                    size="mini"
                    @click="!isFavoriteSearch && (modalVisible = true)"
                  />
                </el-tooltip>
              </i>
              <i slot="suffix" class="el-input__icon">
                <el-button 
                  slot="append" 
                  type="primary"
                  size="small"
                  style="margin-left: 5px"
                  @click="startSearchVideos" 
                  :loading="loadingSearch"
                >Найти</el-button>
              </i>
            </el-input>
          </form>
        </el-col>
      </el-row>

      <el-row style="margin: 50px 0">
        <el-col>
          <div class="search__header">
            <span>Видео по запросу «<strong v-text="storeSearch"/>»</span>
            <span style="color: #909399" v-text="totalResults"/>
            <div class="mosaic">
              <i 
                class="el-icon-s-unfold" 
                :class="{ active: mosaic == 'list' }"
                @click="setMosaic('list')"
              />
              <i 
                class="el-icon-menu" 
                :class="{ active: mosaic == 'grid' }"
                @click="setMosaic('grid')"
              />
            </div>
          </div>
          <div 
            class="search__content" 
            v-if="videos.length"
            :class="{ list: mosaic == 'list' }"
          >
            <VideoCard
              v-for="(video, videoIndex) of videos"
              :extended="mosaic == 'list'"
              :key="videoIndex"
              :data="video"
            />
          </div>  
          <el-empty v-else-if="!loadingSearch" description="Данных нет"/>
          <div v-else v-loading="true"/>
        </el-col>
      </el-row>

      <EditFavoriteModal
        :userId="userId"
        :visible="modalVisible"
        :favorite="localFavorite"
        @close="modalVisible = false"
        isFirstAddition
      />
    </template>
  
  </div>
</template>

<script>
import _ from 'lodash';
import { mapState, mapGetters, mapActions, mapMutations  } from 'vuex';

import VideoCard from '@/components/VideoCard';
import EditFavoriteModal from '@/components/EditFavoriteModal';

export default {
  name: 'IndexPage',

  middleware: ['isAuth'],

  components: {
    VideoCard,
    EditFavoriteModal,
  },

  props: {
    heightContent: Number,
  },

  data: () => ({
    search: null,
    loadingSearch: false,
    token: 'tokentest',
    message: null,
    modalVisible: false,
  }),

  watch: {
    storeSearch() {
      this.search = _.clone(this.storeSearch);
    },
  },

  computed: {
    ...mapState([
      'storeSearch', 
      'totalResults', 
      'videos', 
      'mosaic',
      'userId'
    ]),
    ...mapGetters(['isFavoriteSearch']),
    localFavorite() {
      return {
        filter: 'relevance',
        maxLimit: '12',
        query: this.storeSearch,
        name: '',
      }
    },
  },

  methods: {
    ...mapActions(['startSearch']),
    ...mapMutations(['setMosaic']),
    async startSearchVideos() {
      if(!this.search || this.loadingSearch) return;
      this.loadingSearch = true;
      if(!this.isFavoriteSearch) {
        await this.startSearch({ query: this.search })
      } else {
        await this.startSearch({ 
          ...this.isFavoriteSearch,
          query: this.search
        });
      }
      this.loadingSearch = false;
    },
  },

  beforeMount() {
    if(!this.storeSearch) return;
    this.search = _.clone(this.storeSearch);
  },
};
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.search__content {
  display: grid;
  grid-template-columns: repeat(auto-fill, 230px);
  gap: 20px;
  justify-content: space-between;
  margin-top: 20px;
}
.search__content.list {
  grid-template-columns: 1fr;
}


.mosaic {
  font-size: 24px;
  float: right;
}
.mosaic i {
  cursor: pointer;
}
.mosaic i:not(.active) {
  opacity: .2;
}
.mosaic i:hover {
  color: #409EFF;
  opacity: 1;
}
</style>
