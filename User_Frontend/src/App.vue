<script setup>
import { RouterLink, RouterView } from 'vue-router'
import SideBar from './components/SideBar.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import Search from './components/Search.vue'
import Login from './components/Login.vue'
import Foot from './components/Foot.vue'



</script>

<template>

  <div id="app">
    <div class="main-content">

      <!-- 導覽列 -->
      <SideBar />

      <!-- 新增 Breadcrumb -->
      <Breadcrumb />

      <Search /> 

      <!-- 登入模組 -->
      <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="loginModalLabel"><img src="/img/logo.svg" alt="Logo" style="height: 35px;" />
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <Login @login-success="handleLoginSuccess" />
            </div>
          </div>
        </div>
      </div>

      <!-- RoutrtView 切換分頁 -->
      <RouterView />

    </div>
    <Foot />
  </div>

</template>

<script>
const handleLoginSuccess = (userInfo) => {
  console.log('使用者登入成功:', userInfo)
  // 處理登入成功後的邏輯
}
</script>

<style scoped>
/* 設置 footer 隨內容自適應底部 */

.main-content {
  flex: 1;
  /* 主內容填滿多餘空間 */
}

html,
body {
  height: 100%;
  /* 設定 html 和 body 滿高 */
  margin: 0;
  display: flex;
  flex-direction: column;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* 確保內容至少佔滿視窗高度 */
}
</style>
