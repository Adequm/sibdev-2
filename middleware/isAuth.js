export default async function ({ route, store, redirect, $axios }) {
  const token = store.state.token;
  const isPageLogin = route.name === 'login';

  if(!isPageLogin && !token) return redirect(`/login?from=${ route.name }`);
  if(isPageLogin && token && store.state.isCheckAuth) return redirect('/');

  if(!store.state.isCheckAuth) {
    const { data: user } = await store.dispatch('/login', { token });
    if(!user.auth) {
      store.commit('logout');
      redirect(`/login?from=${ route.name }`);
    } else {
      // const { data: favorites } = await store.dispatch('/getFavorites', { id: user.id });
      // console.log(favorites)


      this.getFavorites({ id: user.id });
      store.commit('setToken', user.token);
      store.commit('authSuccess');
      store.commit('setUserId', user.id);
      if(isPageLogin) redirect('/');
    }
  }
}