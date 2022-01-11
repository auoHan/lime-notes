<template>
  <span :title="username">{{ slug }}</span>
</template>

<script>
import auth from '@/apis/auth'
import {eventBus} from '@/main'

export default {
  name: 'Avatar',
  data() {
    return {
      username: '未登录'
    }
  },
  created() {
    eventBus.$on('userInfo', username => {
      this.username = username
    })
    eventBus.$on('noLogin', username => {
      this.username = username
    })
    auth.getInfo().then(res => {
      if (res.isLogin) {
        this.username = res.data.username
      }
    })
  },
  computed: {
    slug() {
      return this.username.charAt(0)
    }
  }
}
</script>

<style lang="less" scoped>
span {
  display: inline-block;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 32px;
  border-radius: 50%;
  background: #f2b81c;
  color: #fff;
  text-shadow: 1px 0 1px #795c19;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 18px;
  margin-top: 15px;
}
</style>
