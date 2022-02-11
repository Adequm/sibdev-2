<template>
  <div>
    <h1>Избранное</h1>

    <el-table
      id="favorite-table"
      style="width: 100%"
      :data="favoriteSearches"
      :show-header="false"
      @cell-mouse-enter="favoriteVisible = $event.id"
      @cell-mouse-leave="favoriteVisible = null"
    >

      <el-table-column prop="date">
        <template slot-scope="scope">
          <span>Запрос: </span>
          <strong v-text="scope.row.query"/>
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template slot-scope="scope" v-if="favoriteVisible == scope.row.id">
          <el-button 
            size="mini" 
            type="primary"
            plain
            @click="changeFavorite(scope.row)"
          >Перейти</el-button>
          <el-button 
            size="mini" 
            type="warning" 
            plain
            @click="openEditModal(scope.row)"
          >Редактировать</el-button>
          <el-button 
            size="mini" 
            type="danger" 
            plain
            slot="reference"
            @click="deleteFavorite(scope.row)"
          >Удалить</el-button>
        </template>
      </el-table-column>
    </el-table>

    <EditFavoriteModal
      :visible="modalVisible"
      :favorite="favoriteSearches[editFavoriteIndex]"
      @close="modalVisible = false"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import EditFavoriteModal from '@/components/EditFavoriteModal';

export default {
  name: 'FavoritesPage',

  middleware: ['isAuth'],

  components: {
    EditFavoriteModal,
  },

  data: () => ({
    console,
    modalVisible: false,
    editFavoriteIndex: null,
    favoriteVisible: null
  }),

  computed: {
    ...mapState(['favoriteSearches']),
  },

  methods: {
    ...mapActions(['startSearch', 'deleteFavorite']),
    changeFavorite({ query, maxLimit, filter }) {
      console.log(this.favoriteSearches)
      console.log({ query, maxLimit, filter })
      this.startSearch({ query, maxLimit, filter })
      this.$router.push('/');
    },
    openEditModal(where) {
      const index = _.findIndex(this.favoriteSearches, where);
      if(index < 0) return;
      this.editFavoriteIndex = index;
      this.modalVisible = true;
    }
  },
}
</script>

<style>
#favorite-table .el-table__row {
  height: 60px !important;
}
</style>