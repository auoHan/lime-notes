import trash from '@/apis/trash'

const state = {
  trashNotes: null,
  curTrashNoteId: null
}
const getters = {
  trashNotes: state => state.trashNotes || [],
  curTrashNote: state => {
    if (!Array.isArray(state.trashNotes)) return {}
    if (!state.curTrashNoteId) return state.trashNotes[0] || {}
    return state.trashNotes.find(note => note.id.toString() === state.curTrashNoteId.toString()) || {}
  },
  belongTo: (state, getters, rootState, rootGetters) => {
    let notebook = rootGetters['notebook/notebooks'].find(notebook => notebook.id === getters.curTrashNote.notebookId) || {}
    return notebook.title || ''
  }
}
const mutations = {
  setTrashNotes(state, payload) {
    state.trashNotes = payload
  },
  addTrashNote(state, payload) {
    state.trashNotes.unshift(payload.note)
  },
  updateTrashNote(state, payload) {
    console.log(payload)
    state.trashNotes = state.trashNotes.filter(note => note.id.toString() !== payload.toString())
  },
  setCurTrashNoteId(state, payload) {
    state.curTrashNoteId = payload
  }
}
const actions = {
  getTrashNotes({commit}) {
    return trash.getAll().then(res => {
      commit('setTrashNotes', res.data)
    })
  },
  revertTrashNote({commit}, {noteId}) {
    return trash.revertNote(noteId).then(() => {
      commit('updateTrashNote', noteId)
    })
  },
  deleteTrashNote({commit}, {noteId}) {
    return trash.deleteNote(noteId).then(() => {
      commit('updateTrashNote', noteId)
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
