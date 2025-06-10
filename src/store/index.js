import { createStore } from 'vuex'
import users from '@/user/store'
import auth from '@/auth/store'
import cart from '@/cart/store'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: 'vuex',
  reducer: (state) => {
    return {
      users: state.users,
      articulos: state.cart
    }
  },
})

export default createStore({
  modules: {
    users,
    auth,
    cart,
  },
  plugins: [vuexLocal.plugin],
})