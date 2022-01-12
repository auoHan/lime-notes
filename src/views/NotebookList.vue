<template>
  <div class="detail" id="notebook-list">
    <header>
      <a href="#" class="btn" @click.prevent="showCreateModal=true"><i class="iconfont icon-plus"></i> 新建笔记本</a>
    </header>
    <main>
      <div class="layout">
        <h3>笔记本列表({{ notebooks.length }})</h3>
        <div class="book-list">
          <router-link v-for="notebook in notebooks" :to="`/note?notebookId=${notebook.id}`" class="notebook"
                       :key="notebook.id">
            <div>
              <span class="iconfont icon-notebook"></span> {{ notebook.title }}
              <span>{{ notebook.noteCounts }}</span>
              <span class="action" @click.stop.prevent="onEdit(notebook)">编辑</span>
              <span class="action" @click.stop.prevent="onDelete(notebook)">删除</span>
              <span class="date">{{ notebook.friendlyCreatedAt }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </main>
    <Modal
      v-model="showCreateModal"
      title='创建笔记本'
      @on-ok="createNote"
      @on-cancel="title=''">
      <Input type="text" v-model="title"/>
    </Modal>
  </div>
</template>

<script>
import Vue from 'vue'
import auth from '@/apis/auth'
import notebooks from '@/apis/notebooks'
import {friendlyDate} from '@/utils/date-util'
import {Modal, Message, Input} from 'view-design'

Vue.component('Modal', Modal)
Vue.component('Message', Message)
Vue.component('Input', Input)
export default {
  name: 'NotebookList.vue',
  data() {
    return {
      notebooks: [],
      title: '',
      notebook: {},
      showCreateModal: false
    }
  },
  created() {
    auth.getInfo().then(res => {
      if (!res.isLogin) {
        this.$router.push('/login')
      }
    })
    notebooks.getAll().then(res => {
      this.notebooks = res.data
    })
  },
  methods: {
    createNote() {
      if (this.title.trim() === '') {
        Message.error('添加失败，笔记本标题不能为空')
        return
      }
      notebooks.addNotebook({title: this.title}).then(res => {
        res.data.friendlyCreatedAt = friendlyDate(res.data.createdAt)
        this.notebooks.unshift(res.data)
        Message.success(res.msg)
      })
    },
    onEdit(notebook) {
      let title = ''
      Modal.confirm({
        title: '修改笔记标题',
        render: (h) => {
          return h('Input', {
            props: {
              value: this.value,
              autofocus: true,
              placeholder: notebook.title
            },
            on: {
              input: (val) => {
                title = val
              },
            },
          })
        },
        onOk() {
          if (title.trim() === '') {
            Message.error('修改失败,笔记本标题不能为空')
            return
          }
          notebooks.updateNotebook(notebook.id, {title}).then(res => {
            notebook.title = title
            Message.success(res.msg)
          })
        }
      })
    },
    onDelete(notebook) {
      const _this = this
      Modal.confirm({
        title: '确定要删除吗',
        onOk() {
          notebooks.deleteNotebook(notebook.id).then(res => {
            _this.notebooks.splice(_this.notebooks.indexOf(notebook), 1)
            Message.success(res.msg)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
#notebook-list {
  flex: 1;

  .btn {
    font-size: 12px;
    color: #666;
    cursor: pointer;
    margin-left: 10px;
  }

  .btn .iconfont {
    font-size: 12px;
  }

  input {
    width: 300px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 3px 5px;
    outline: none;
  }

  header {
    padding: 12px;
    border-bottom: 1px solid #ccc;
  }

  main {
    padding: 30px 40px;
  }

  .layout {
    max-width: 966px;
    margin: 0 auto;
  }


  main h3 {
    font-size: 12px;
    color: #000;
  }

  main .book-list {
    margin-top: 10px;
    font-size: 14px;
    color: #666;
    background-color: #fff;
    border-radius: 4px;
    font-weight: bold;
  }

  main .book-list span {
    font-size: 12px;
    font-weight: bold;
    color: #b3c0c8;
  }

  main .date,
  main .action {
    float: right;
    margin-left: 10px;
  }

  main .iconfont {
    color: #1687ea;
    margin-right: 4px;
  }

  main .notebook {
    display: block;
    cursor: pointer;
  }

  main a.notebook:hover {
    background-color: #f7fafd;
  }

  main a.notebook div {
    border-bottom: 1px solid #ebebeb;
    padding: 12px 14px;
  }

  main .error-msg {
    font-size: 12px;
    color: red;
  }

}
</style>
