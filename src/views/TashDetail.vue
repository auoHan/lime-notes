<template>
  <div id="trash-detail">
    <h1>{{ msg }} : {{ $route.params.noteId }}</h1>
  </div>
</template>

<script>
import auth from '@/apis/auth'

export default {
  name: 'TashDetail',
  data() {
    return {
      msg: '回收站笔记详情页'
    }
  },
  created() {
    auth.getInfo().then(res => {
      if (!res.isLogin) {
        this.$router.push('/login')
      }
    })
  }
}
</script>

<style lang="less" scoped>
h1 {
  color: blue;
}
</style>
