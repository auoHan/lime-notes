import notes from '@/apis/notes'
import {Message} from 'view-design'
import Vue from 'vue'

Vue.component('Message', Message)
const state = {
  notes: null,
  curNoteId: null
}

const getters = {
  notes: state => state.notes || [],

  curNote: state => {
    if (!Array.isArray(state.notes)) return {title: '', content: ''}
    if (!state.curNoteId) return state.notes[0] || {title: '', content: ''}
    return state.notes.find(note => note.id.toString() === state.curNoteId.toString()) || {title: '', content: ''}
  }
}

const mutations = {
  setNote(state, payload) {
    state.notes = payload.notes
  },

  addNote(state, payload) {
    state.notes.unshift(payload.note)
  },

  updateNote(state, payload) {
    let note = state.notes.find(note => note.id.toString() === payload.noteId.toString()) || {}
    note.title = payload.title
    note.content = payload.content
  },

  deleteNote(state, payload) {
    state.notes = state.notes.filter(note => note.id.toString() !== payload.noteId.toString())
  },

  setCurNote(state, {curNoteId}) {
    state.curNoteId = curNoteId
  }

}

const actions = {
  getNotes({commit}, {notebookId}) {
    return notes.getAll({notebookId})
      .then(res => {
        commit('setNote', {notes: res.data})
      })
  },

  addNote({commit}, {notebookId, title, content}) {
    return notes.addNote({notebookId}, {title, content})
      .then(res => {
        console.log('add success...', res)
        commit('addNote', {note: res.data})
      })
  },

  updateNote({commit}, {noteId, title, content}) {
    return notes.updateNote({noteId}, {title, content})
      .then(() => {
        commit('updateNote', {noteId, title, content})
      })
  },

  deleteNote({commit}, {noteId}) {
    return notes.deleteNote({noteId})
      .then(res => {
        commit('deleteNote', {noteId})
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
