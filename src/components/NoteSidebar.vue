<template>
  <div class="note-sidebar">
    <span class="btn add-note" @click="onAddNote">添加笔记</span>
    <Dropdown trigger="click" class="notebook-title" @on-click="handleCommand" placement="bottom">
      <a href="javascript:void(0)">
        <span>{{ curBook.title }}</span>
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem v-for="notebook in notebooks" :name="notebook.id" :key="notebook.id">
          {{ notebook.title }}
        </DropdownItem>
        <DropdownItem name="trash">回收站</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <div class="menu">
      <div>更新时间</div>
      <div>标题</div>
    </div>
    <ul class="notes">
      <li v-for="note in notes" :key="note.id">
        <router-link :to="`/note?noteId=${note.id}&notebookId=${curBook.id}`">
          <span class="date">{{ note.updatedAtFriendly }}</span>
          <span class="title">{{ note.title }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'
import {Dropdown, DropdownMenu, DropdownItem, Icon} from 'view-design'
import {mapGetters, mapActions, mapMutations} from 'vuex'

Vue.component('Dropdown', Dropdown)
Vue.component('DropdownMenu', DropdownMenu)
Vue.component('DropdownItem', DropdownItem)
Vue.component('Icon', Icon)

export default {

  data() {
    return {}
  },
  computed: {
    ...mapGetters('notebook', ['notebooks', 'curBook']),
    ...mapGetters('note', ['notes', 'curNote'])
  },
  created() {
    this.getNotebooks().then(() => {
      this.setCurBook({curBookId: this.$route.query.notebookId})
      this.getNotes({notebookId: this.curBook.id.toString()})
    })
  },
  methods: {
    ...mapActions('note', ['getNotes', 'addNote', 'updateNote', 'deleteNote']),
    ...mapActions('notebook', ['getNotebooks']),
    ...mapMutations('notebook', ['setCurBook']),
    handleCommand(notebookId) {
      if (notebookId === 'trash') {
        return this.$router.push({path: '/trash'})
      }
      this.setCurBook({curBookId: notebookId.toString()})
      this.getNotes({notebookId: notebookId.toString()})
    },

    onAddNote() {
      this.addNote({notebookId: this.curBook.id.toString()})
    }

  }
}

</script>


<style lang="less" scoped>
.note-sidebar {
  position: relative;
  width: 290px;
  border-right: 1px solid #ccc;
  background-color: #eee;

  .add-note {
    position: absolute;
    right: 5px;
    top: 12px;
    color: #666;
    font-size: 12px;
    padding: 2px 4px;
    box-shadow: 0 0 2px 0 #ccc;
    border: none;
    z-index: 1;
  }

  .notebook-title {
    font-size: 18px;
    font-weight: normal;
    color: #333;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-bottom: 1px solid #ccc;
    background-color: #f7f7f7;
    display: block;
  }

  .ivu-dropdown-item {
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .menu {
    display: flex;

    div {
      font-size: 12px;
      padding: 2px 10px;
      flex: 1;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;

      &:last-child {
        border-right: none;
      }
    }
  }

  .notes {
    li {

      &:nth-child(odd) {
        background-color: #f2f2f2;
      }

      a {
        display: flex;
        padding: 3px 0;
        font-size: 12px;
        border: 2px solid transparent;
      }

      .router-link-exact-active {
        border: 2px solid #3ae374;
        border-radius: 3px;
      }

      span {
        padding: 0 10px;
        flex: 1;
      }

      .title {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}


</style>


