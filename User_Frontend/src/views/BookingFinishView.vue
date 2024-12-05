<script setup>
import ProgressSteps from '../components/ProgressSteps_Jo.vue'
</script>

<template>
  <progress-steps :current-step="4" />
  <div class="container">

    <div class="reservation-complete">
      <div class="card">
        <h2>預約完成</h2>

        <div class="qr-container">
          <img :src="qrCodeUrl" alt="QR Code" class="qr-code" />
        </div>

        <p class="message">
          恭喜您預約完成，您可依 QR Code 條碼進場。
        </p>
      </div>
    </div>

    <div class="button-group">
      <button class="btn btn-book" @click="goNext">返回場地租借</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookingFinish',
  components: {
    ProgressSteps
  },

  data() {
    return {
      qrCodeUrl: '/img/qrcode.png' // 實際使用時替換為真實的 QR Code 圖片路徑
    }
  },

  methods: {
    goNext() {
      // Clear bookingData from localStorage
      localStorage.removeItem('bookingData');

      // Navigate to home page
      this.$router.push({
        name: "home",
      })
    },
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  min-height: 100vh;
  /* 設定最小高度為視窗高度 */
  display: flex;
  /* 使用 flex 布局 */
  flex-direction: column;
  /* 設定垂直方向排列 */
}

/* 讓中間內容區域自動擴展 */
.reservation-complete {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.card {
  /* background-color: white; */
  border-radius: 8px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
  padding: 24px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
}

.qr-container {
  margin-bottom: 24px;
}

.qr-code {
  max-width: 200px;
  height: auto;
}

.message {
  color: #666;
  line-height: 1.5;
  margin: 0;
}

/* button-group 會自動置底 */
.button-group {
  margin-top: auto;
  /* 可選：如果想要確保按鈕組一定在底部 */
  display: flex;
  gap: 15px;
  padding: 20px 0;
  justify-content: center;
}

.btn {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  text-align: center;
  border: 1px solid #ddd;
}

.btn-back {
  background: white;
  color: #333;
}

.btn-book {
  background: #3498db;
  color: white;
  border: none;
}
</style>