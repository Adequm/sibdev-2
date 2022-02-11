<template>
  <div>
    <h1>Избранное</h1>

    <el-table
      :data="favoriteSearches"
      style="width: 100%"
      :show-header="false"
    >

      <el-table-column prop="date">
        <template slot-scope="scope">
          <strong v-text="scope.row.query"/>
        </template>
      </el-table-column>

      <el-table-column align="right" width="180">
        <template slot-scope="scope">
          <el-button size="mini">Edit</el-button>
          <el-button size="mini" type="danger">Delete</el-button>
        </template>
      </el-table-column>
      />
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'FavoritesPage',

  middleware: ['isAuth'],

  data: () => ({

  }),

  computed: {
    ...mapState(['favoriteSearches']),
  },

  beforeMount() {
    console.log(this.favoriteSearches)
  }
}
</script>