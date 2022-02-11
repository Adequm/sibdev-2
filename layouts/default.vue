<template>
  <main>
    <AppHeader ref="header" :pageActive="$route.name"/>
    <el-row type="flex" justify="center">
      <el-col :span="16">
        <Nuxt/>
      </el-col>
    </el-row>
  </main>
</template>

<script>
import AppHeader from '@/components/AppHeader';

export default {
  components: {
    AppHeader,
  },

};
</script>