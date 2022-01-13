import Vue from 'vue'
import Vuex from 'vuex'
import note from '@/store/modules/note'
import notebook from '@/store/modules/notebook'
import trash from '@/store/modules/trash'
import user from '@/store/modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    note,
    notebook,
    trash,
    user
  }
})
