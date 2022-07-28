import VuexPersist from 'vuex-persist';
import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.sessionStorage,
})

export default new Vuex.Store({
  state: {
    userOnline: [], 
    userId:'',
    admin:'',
    token:'',
    isLoggedIn: false,
  },
  mutations: {
    
    INSERT_USER(state, userId){
      state.userId = userId
    },
    INSERT_ADMIN(state, admin){
      state.admin = admin
    },
    
    INSERT_TOKEN(state, token){
      state.token = token;
      if(token) {
        state.isLoggedIn = true
        
      }
      else{
        state.isLoggedIn = false
        
      }
    }

  
  },
  
  actions: {
    //insertion de l'id de l'user a la connection
    setUserId(context , responseUser) {
      context.commit('INSERT_USER', responseUser)
    },
    //insertion de l'etat admin 
    setAdmin(context, responseAdmin) {
      context.commit('INSERT_ADMIN', responseAdmin)
    },
    //insertion du token a la connection
    setToken(context, responseToken) {
      context.commit('INSERT_TOKEN', responseToken)
    }
  },
  
  
  guetters:{

  },
  plugins :[vuexLocalStorage.plugin]
  
})