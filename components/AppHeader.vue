<template>
  <el-header style="padding: 0" :style="styles.header">

    <el-row type="flex" justify="center">
      <el-col :span="16">
        <el-menu 
          :default-active="pageActive" 
          mode="horizontal"
          text-color="#409EFF"
          active-text-color="#409EFF"
          :style="styles.ul"
        >

          <el-image style="width: 48px; height: 48px" src="./logo.png" fit="contain"/>
          <el-menu-item 
            v-for="(pageName, pageId) of pages"
            :key="pageId"
            :index="pageId" 
            :style="styles.li + (pageId == 'logout' ? styles.logout : '')"
            @click="$router.push(`/${ pageId == 'index' ? '' : pageId }`)"
            v-text="pageName"
          />
        </el-menu>
      </el-col>
    </el-row>

  </el-header>
</template>

<script>
import _ from 'lodash';

const jsStyles = {
  header: {
    'height': '80px',
    'background': '#fff',
    'border-bottom': 'solid 1px #e6e6e6',
    'margin-bottom': '20px',
  },
  ul: {
    'height': '80px',
    'border-bottom': '0',
    'background': 'transparent',
    'display': 'flex',
    'align-items': 'center',
  },
  li: {
    'font-size': '18px',
    'line-height': '28px',
    'display': 'flex',
    'align-items': 'center',
    'height': '80px',
    'background': 'transparent',
  },
  logout: {
    'position': 'absolute',
    'right': '0',
  }
}

export default {
  name: 'AppHeader',

  props: {
    pageActive: {
      type: String,
      default: 'index'
    },
  },

  data: () => ({
    pages: {
      index: 'Поиск',
      favorites: 'Избранное',
      logout: 'Выход'
    }
  }),

  computed: {
    styles() {
      return this.convertStyle(jsStyles);
    }
  },

  methods: {
    convertStyle(styles) {
      return _.mapValues(styles, style => {
        return _.reduce(style, (acc, value, key) => {
          return acc + `${ key }: ${ value };`
        }, '');
      })
    }
  },
};
</script>