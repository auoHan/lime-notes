import request from '@/utils/request'
import {friendlyDate} from '@/utils/date-util'

const URL = {
  REVERT: '/notes/:noteId/revert',
  DELETE: '/notes/:noteId/confirm',
  GET: '/notes/trash'
}

export default {
  getAll() {
    return new Promise((resolve, reject) => {
      request(URL.GET).then(res => {
        res.data = res.data.map(note => {
          note.createdAtFriendly = friendlyDate(note.createdAt)
          note.updatedAtFriendly = friendlyDate(note.updatedAt)
          return note
        }).sort((note1, note2) => note1.updatedAt < note2.updatedAt ? 1 : -1)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  revertNote(noteId) {
    return request(URL.REVERT.replace(':noteId', noteId), 'PATCH')
  },
  deleteNote(noteId) {
    return request(URL.DELETE.replace(':noteId', noteId), 'DELETE')
  }
}
