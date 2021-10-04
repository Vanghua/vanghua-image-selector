<template>
  <div id="app">
    <user-profile></user-profile>
  </div>
</template>

<script>
import UserProfile from "./components/user-profile"
export default {
  name: 'app',
  components: {
    "user-profile": UserProfile
  },
  data() {
    return {

    }
  }
}
</script>
<style>
  #app {
    height: 812px;
    width: 375px;
    background: cornflowerblue;
    position: relative;
  }
</style>
