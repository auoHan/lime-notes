<template>
  <div id="trash-detail">
    <h1>{{ msg }} : {{ $route.params.noteId }}</h1>
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  name: 'TashDetail',
  data() {
    return {
      msg: '回收站笔记详情页'
    }
  },
  created() {
    this.checkLogin({path: '/login'})
  },
  methods: {
    ...mapActions('user', ['checkLogin'])
  }
}
</script>

<style lang="less" scoped>
h1 {
  color: blue;
}
</style>
