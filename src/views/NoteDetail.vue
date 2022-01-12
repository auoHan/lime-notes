<template>
  <div id="note-detail">
    <NoteSidebar/>
  </div>
</template>

<script>
import auth from '@/apis/auth'
import NoteSidebar from '@/components/NoteSidebar'

export default {
  name: 'NoteDetail.vue',
  components: {NoteSidebar},
  data() {
    return {
      msg: '笔记详情页'
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
#note-detail {
  display: flex;
  align-items: stretch;
  background-color: #fff;
  flex: 1;
}
</style>
