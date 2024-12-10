<template>
  <div class="booking-finish-view">
    <h1>完成預訂</h1>
    <p>以下是您的 QR Code：</p>
    <div v-if="qrCodeUrl">
      <img :src="qrCodeUrl" alt="QR Code" />
      <p>下一次更新倒數：<strong>{{ countdown }}</strong> 秒</p>
      <button @click="manualUpdateQRCode" class="update-button">立即更新 QR Code</button>
    </div>
    <p v-else>正在載入 QR Code...</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "BookingFinishView",
  data() {
    return {
      qrCodeUrl: null, // 存儲 QR Code 的 Blob URL
      intervalId: null, // 用於存儲定時器 ID
      countdown: 10, // 倒數計時的秒數
    };
  },
  mounted() {
    this.startAutoUpdateQRCode();
  },
  beforeDestroy() {
    this.stopAutoUpdateQRCode(); // 組件銷毀時停止定時器
  },
  methods: {
    async loadLatestQRCode() {
      try {
        const response = await axios.get("http://localhost:8080/api/orders/latest-qrcode", {
          responseType: "arraybuffer", // 確保返回二進制數據
        });

        // 將二進制數據轉換為 Blob URL
        const blob = new Blob([response.data], { type: "image/png" });
        const blobUrl = URL.createObjectURL(blob);

        // 清除舊的 Blob URL 以避免內存洩漏
        if (this.qrCodeUrl) {
          URL.revokeObjectURL(this.qrCodeUrl);
        }

        this.qrCodeUrl = blobUrl; // 不加時間戳，Blob URL 本身已唯一

        console.log("QR Code Blob URL updated:", this.qrCodeUrl); // 打印 Blob URL 用於調試
      } catch (error) {
        console.error("無法載入 QR Code", error);
        this.qrCodeUrl = null;
      }
    },
    startAutoUpdateQRCode() {
      this.loadLatestQRCode(); // 立即加載一次
      this.startCountdown(); // 開始倒數計時

      // 每 10 秒自動刷新一次
      this.intervalId = setInterval(() => {
        this.loadLatestQRCode();
      }, 10000); // 10,000 毫秒 = 10 秒
    },
    stopAutoUpdateQRCode() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
    manualUpdateQRCode() {
      this.stopAutoUpdateQRCode(); // 停止自動刷新
      this.loadLatestQRCode(); // 手動刷新
      this.startAutoUpdateQRCode(); // 重啟自動刷新
    },
    startCountdown() {
      this.countdown = 10; // 倒數從 10 開始
      const countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(countdownInterval); // 倒數結束時清除計時器
        }
      }, 1000); // 每秒更新一次倒數
    },
    resetCountdown() {
      this.countdown = 10; // 重置倒數時間
    },
  },
};
</script>

<style scoped>
.booking-finish-view {
  text-align: center;
}

.booking-finish-view img {
  max-width: 100%;
  height: auto;
  margin: 20px 0;
  border: 2px solid #ccc;
  border-radius: 10px;
}

.update-button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.update-button:hover {
  background-color: #45a049;
}

.booking-finish-view p {
  font-size: 18px;
  margin-top: 10px;
}
</style>
