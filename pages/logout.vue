<template>
  <div>123</div>
</template>

<script>
export default {
  name: 'PageLogout',

  asyncData({ store, redirect }) {
    store.commit('logout');
    redirect('/login')
  },
};
</script>