import auth from '@/apis/auth'
import router from '@/router'
import {Message} from 'view-design'
import Vue from 'vue'

Vue.component('Message', Message)
const state = {
  user: null
}

const getters = {
  username: state => state.user === null ? '未登录' : state.user.username,

  slug: state => state.user === null ? '未' : state.user.username.charAt(0)
}

const mutations = {
  setUser(state, payload) {
    state.user = payload.user
  }
}

const actions = {
  login({commit}, {username, password}) {
    return auth.login({username, password})
      .then(res => {
        commit('setUser', {user: res.data})
      })
  },

  register({commit}, {username, password}) {
    return auth.register({username, password})
      .then(res => {
        commit('setUser', {user: res.data})
      })
  },

  checkLogin({commit}, payload) {
    return auth.getInfo()
      .then(res => {
        if (!res.isLogin) {
          console.log('jump')
          router.push(payload)
        } else {
          commit('setUser', {user: res.data})
        }
      })
  },
  logout({commit}, payload) {
    return auth.logout().then(() => {
      commit('setUser', {user: null})
      Message.success('注销成功')
      router.push(payload)
    })
  }

}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
