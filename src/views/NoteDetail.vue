<template>
  <div id="note">
    <NoteSidebar/>
    <div class="note-detail">
      <div class="note-empty" v-show="!curBook.id">请创建笔记本后</div>
      <div class="note-empty" v-show="!curNote.id">选择或创建笔记</div>
      <div class="note-detail-ct" v-show="curNote.id">
        <div class="note-bar">
          <span> 创建日期: {{ curNote.createdAtFriendly }}</span>
          <span> 更新日期: {{ curNote.updatedAtFriendly }}</span>
          <span> {{ statusText }}</span>
          <span class="iconfont icon-delete" @click="onDeleteNote"></span>
          <span class="iconfont icon-fullscreen"
                @click="isShowPreview = !isShowPreview"></span>
          <Tooltip content="Bottom" placement="left-end">
          </Tooltip>
        </div>
        <div class="note-title">
          <input type="text" v-model="curNote.title" @input="onUpdateNote" @keydown="statusText='正在输入...'"
                 placeholder="输入标题">
        </div>
        <div class="editor">
          <codemirror v-model="curNote.content" :options="cmOptions" v-show="!isShowPreview" @input="onUpdateNote"
                      @inputRead="statusText='正在输入...'"/>
          <!--<textarea v-show="isShowPreview" v-model="curNote.content" @input="onUpdateNote"
                    @keydown="statusText='正在输入...'"
                    placeholder="输入内容, 支持 markdown 语法"></textarea>-->
          <div class="preview markdown-body" v-html="previewContent" v-show="!isShowPreview">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoteSidebar from '@/components/NoteSidebar'
import Vue from 'vue'
import {Message, Tooltip} from 'view-design'
import _ from 'lodash'
import MarkdownIt from 'markdown-it'
import {codemirror} from 'vue-codemirror'
import {mapActions, mapMutations, mapGetters} from 'vuex'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/theme/neat.css'


let md = new MarkdownIt()
Vue.component('Message', Message)
Vue.component('Tooltip', Tooltip)
export default {
  name: 'NoteDetail.vue',
  components: {NoteSidebar, codemirror},
  data() {
    return {
      statusText: '笔记未改动',
      isShowPreview: false,
      cmOptions: {
        tabSize: 4,
        mode: 'text/x-markdown',
        theme: 'neat',
        lineNumbers: false,
        line: true,
        // more codemirror options, 更多 codemirror 的高级配置...
      }
    }
  },
  created() {
    this.checkLogin({path: '/login'})
  },
  computed: {
    ...mapGetters('note', ['curNote', 'notes']),
    ...mapGetters('notebook', ['curBook']),
    previewContent() {
      return md.render(this.curNote.content || '')
    },
  },

  methods: {
    ...mapActions('user', ['checkLogin']),
    ...mapMutations('note', ['setCurNote']),
    ...mapActions('note', ['updateNote', 'deleteNote']),
    ...mapMutations('trash', ['addTrashNote']),
    onUpdateNote: _.debounce(function () {
      if (!this.curNote.id) return
      this.updateNote({noteId: this.curNote.id.toString(), title: this.curNote.title, content: this.curNote.content})
        .then(() => {
          this.statusText = '已保存'
        }).catch(() => {
        this.statusText = '保存出错'
      })

    }, 300),

    onDeleteNote() {
      this.deleteNote({noteId: this.curNote.id.toString()})
        .then(() => {
          this.$router.replace({path: '/note'})
        }).then(() => {
        this.addTrashNote({note: this.curNote})
      })
    }

  },

  beforeRouteUpdate(to, from, next) {
    this.setCurNote({curNoteId: to.query.noteId})
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

    .vue-codemirror {
      height: ~"calc(100% - 25px)";

      .CodeMirror {
        height: 100%;
        padding: 10px;
      }
    }

  }

  textarea, .preview {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: auto;
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
