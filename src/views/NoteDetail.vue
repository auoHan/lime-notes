<template>
  <div id="note">
    <NoteSidebar @update:notes="notes = $event"/>
    <div class="note-detail">
      <div class="note-empty" v-show="!curNote.id">请选择笔记</div>
      <div class="note-detail-ct" v-show="curNote.id">
        <div class="note-bar">
          <span> 创建日期: {{ curNote.createdAtFriendly }}</span>
          <span> 更新日期: {{ curNote.updatedAtFriendly }}</span>
          <span> {{ statusText }}</span>
          <span class="iconfont icon-delete" @click="deleteNote"></span>
          <span class="iconfont icon-fullscreen" @click="isShowPreview = !isShowPreview"></span>
          <Tooltip content="Bottom" placement="left-end">
          </Tooltip>
        </div>
        <div class="note-title">
          <input type="text" v-model="curNote.title" @input="updateNote" @keydown="statusText='正在输入...'"
                 placeholder="输入标题">
        </div>
        <div class="editor">
          <textarea v-show="isShowPreview" v-model="curNote.content" @input="updateNote" @keydown="statusText='正在输入...'"
                    placeholder="输入内容, 支持 markdown 语法"></textarea>
          <div class="preview markdown-body" v-html="previewContent" v-show="!isShowPreview">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '@/apis/auth'
import NoteSidebar from '@/components/NoteSidebar'
import Vue from 'vue'
import {Message, Tooltip} from 'view-design'
import {eventBus} from '@/main'
import _ from 'lodash'
import notes from '@/apis/notes'
import MarkdownIt from 'markdown-it'

let md = new MarkdownIt()
Vue.component('Message', Message)
Vue.component('Tooltip', Tooltip)
export default {
  name: 'NoteDetail.vue',
  components: {NoteSidebar},
  data() {
    return {
      curNote: {},
      notes: [],
      statusText: '笔记未改动',
      isShowPreview: false
    }
  },
  created() {
    auth.getInfo().then(res => {
      if (!res.isLogin) {
        this.$router.push('/login')
      }
    })
    eventBus.$once('update:notes', val => {
      this.curNote = val.find(note => note.id.toString() === this.$route.query.noteId) || {}
    })
  },
  computed: {
    previewContent() {
      return md.render(this.curNote.content || '')
    }
  },

  methods: {
    updateNote: _.debounce(function () {
      notes.updateNote({noteId: this.curNote.id},
        {title: this.curNote.title, content: this.curNote.content})
        .then(() => {
          this.statusText = '已保存'
        }).catch(() => {
        this.statusText = '保存出错'
      })

    }, 300),

    deleteNote() {
      notes.deleteNote({noteId: this.curNote.id})
        .then(data => {
          Message.success(data.msg)
          this.notes.splice(this.notes.indexOf(this.curNote), 1)
          this.$router.replace({path: '/note'})
        })
    }

  },

  beforeRouteUpdate(to, from, next) {
    this.curNote = this.notes.find(note => note.id.toString() === to.query.noteId) || {}
    next()
  }
}
</script>

<style lang="less" scoped>
#note {
  display: flex;
  align-items: stretch;
  background-color: #fff;
  flex: 1;
}

.note-detail {
  flex: 1;
  display: flex;
  flex-direction: column;

  .note-detail-ct {
    height: 100%;
  }

  .note-empty {
    font-size: 50px;
    color: #ccc;
    text-align: center;
    margin-top: 100px;
  }

  .note-bar {
    padding: 4px 20px;
    border-bottom: 1px solid #eee;

    &:after {
      content: '';
      display: block;
      clear: both;
    }

    span {
      font-size: 12px;
      color: #999;
      margin-right: 4px;
    }

    .iconfont {
      float: right;
      margin-left: 4px;
      font-size: 18px;
      cursor: pointer;
    }

  }

  .note-title {
    input, span {
      display: inline-block;
      width: 100%;
      border: none;
      outline: none;
      font-size: 18px;
      padding: 10px 20px;
    }
  }

  .editor {
    height: ~"calc(100% - 70px)";
    position: relative;
  }

  textarea, .preview {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 20px;
  }

  textarea {
    border: none;
    resize: none;
    outline: none;
    font-size: 14px;
    font-family: 'Monaco', courier, monospace;
  }

  code {
    color: #f66;
  }
}
</style>
