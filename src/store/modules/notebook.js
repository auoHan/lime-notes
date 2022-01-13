import notebooks from '@/apis/notebooks'
import {Message} from 'view-design'
import Vue from 'vue'

Vue.component('Message', Message)
const state = {
  notebooks: []
}
const getters = {
  notebooks: state => state.notebooks
}
const mutations = {
  setNotebooks(state, payload) {
    state.notebooks = payload.notebooks
  },
  addNotebook(state, payload) {
    state.notebooks.unshift(payload.notebook)
  },
  updateNotebook(state, payload) {
    let notebook = state.notebooks.find(notebook => notebook.id === payload.notebookId) || {}
    notebook.title = payload.title
  },
  deleteNotebook(state, payload) {
    state.notebooks = state.notebooks.filter(notebook => notebook.id !== payload.notebookId)
  }
}
const actions = {
  getNotebooks({commit}) {
    notebooks.getAll().then(res => {
      commit('setNotebooks', {notebooks: res.data})
    })
  },
  addNotebook({commit}, payload) {
    notebooks.addNotebook({title: payload.title}).then(res => {
      commit('addNotebook', {notebook: res.data})
      Message.success(res.msg)
    })
  },
  updateNotebook({commit}, payload) {
    notebooks.updateNotebook(payload.notebookId, {title: payload.title}).then(res => {
      commit('updateNotebook', {notebook: res.data})
      Message.success(res.msg)
    })
  },
  deleteNotebook({commit}, payload) {
    notebooks.deleteNotebook(payload.notebookId).then(res => {
      commit('deleteNotebook', {notebook: res.data})
      Message.success(res.msg)
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
