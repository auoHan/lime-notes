import notebooks from '@/apis/notebooks'
import {Message} from 'view-design'
import Vue from 'vue'

Vue.component('Message', Message)
const state = {
  notebooks: null,
  curBookId: null
}
const getters = {
  notebooks: state => state.notebooks,
  curBook: state => {
    if (!Array.isArray(state.notebooks)) return {}
    if (!state.curBookId) return state.notebooks[0] || {}
    return state.notebooks.find(notebook => notebook.id.toString() === state.curBookId.toString()) || {}
  }
}
const mutations = {
  setNotebooks(state, payload) {
    state.notebooks = payload.notebooks
  },
  addNotebook(state, payload) {
    state.notebooks.unshift(payload.notebook)
  },
  updateNotebook(state, payload) {
    let notebook = state.notebooks.find(notebook => notebook.id.toString() === payload.notebookId) || {}
    notebook.title = payload.title
  },
  deleteNotebook(state, payload) {
    state.notebooks = state.notebooks.filter(notebook => notebook.id.toString() !== payload.notebookId)
  },
  setCurBook(state, payload) {
    state.curBookId = payload.curBookId
  }
}
const actions = {
  getNotebooks({commit}) {
    return notebooks.getAll().then(res => {
      commit('setNotebooks', {notebooks: res.data})
    })
  },
  addNotebook({commit}, payload) {
    return notebooks.addNotebook({title: payload.title}).then(res => {
      commit('addNotebook', {notebook: res.data})
      Message.success(res.msg)
    })
  },
  updateNotebook({commit}, payload) {
    return notebooks.updateNotebook(payload.notebookId, {title: payload.title}).then(res => {
      commit('updateNotebook', {notebook: res.data})
      Message.success(res.msg)
    })
  },
  deleteNotebook({commit}, payload) {
    return notebooks.deleteNotebook(payload.notebookId).then(res => {
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
