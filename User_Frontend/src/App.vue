<script setup>
import { RouterLink, RouterView } from 'vue-router'
import SideBar from './components/SideBar.vue'
import Login from './components/Login.vue'

</script>

<template>
  <SideBar />

  <!-- 登入模態框 -->
  <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="loginModalLabel"><img src="/img/logo.svg" alt="Logo" style="height: 35px;" /></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <Login />
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped></style>
