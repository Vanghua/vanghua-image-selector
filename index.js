import userProfile from './src/components/user-profile'
import _Vue from 'vue'

userProfile.install = Vue => {
  if (!Vue) {
    window.Vue = Vue = _Vue
  }
  Vue.component(userProfile.name, userProfile)
}
export default userProfile;
