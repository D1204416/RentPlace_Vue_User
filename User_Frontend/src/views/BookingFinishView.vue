<template>
  <div class="booking-finish-view">
    <h1>完成預訂</h1>
    <p>以下是您的 QR Code：</p>
    <div v-if="qrCodeUrl">
      <img :src="qrCodeUrl" alt="QR Code" />
      <div v-if="latestOrder">
        <p>訂單 ID: <strong>{{ latestOrder.orderId }}</strong></p>

      </div>
      <p>下一次更新倒數：<strong>{{ countdown }}</strong> 秒</p>
      <button @click="manualUpdateQRCode" class="update-button">立即更新 QR Code</button>
    </div>
    <p v-if="qrCodeUrl === null && latestOrder === null" class="error">
      無法載入最新的 QR Code 或訂單資訊，請稍後再試。
    </p>
    <p v-else>正在載入 QR Code...</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "BookingFinishView",
  data() {
    return {
      qrCodeUrl: null,
      latestOrder: null,
      intervalId: null,
      countdown: 10,
      refreshInterval: 10000,
    };
  },
  mounted() {
    this.startAutoUpdateQRCode();
  },
  beforeDestroy() {
    this.stopAutoUpdateQRCode();
  },
  methods: {
    async loadLatestQRCode() {
      try {
        const qrCodeResponse = await axios.get(
            `http://localhost:8080/api/orders/latest-qrcode?t=${new Date().getTime()}`,
            {responseType: "arraybuffer"}
        );

        const blob = new Blob([qrCodeResponse.data], {type: "image/png"});
        const blobUrl = URL.createObjectURL(blob);

        if (this.qrCodeUrl) {
          URL.revokeObjectURL(this.qrCodeUrl);
        }

        this.qrCodeUrl = blobUrl;

        const orderResponse = await axios.get("http://localhost:8080/api/orders/latest");
        this.latestOrder = orderResponse.data;

        console.log("QR Code and Order updated:", this.latestOrder);
      } catch (error) {
        console.error("無法載入 QR Code 或訂單消息", error);
        this.qrCodeUrl = null;
        this.latestOrder = null;
      }
    },
    startAutoUpdateQRCode() {
      this.loadLatestQRCode();
      this.startCountdown();

      this.intervalId = setInterval(() => {
        this.loadLatestQRCode();
        this.startCountdown();
      }, this.refreshInterval);
    },
    stopAutoUpdateQRCode() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
    manualUpdateQRCode() {
      this.stopAutoUpdateQRCode();
      this.loadLatestQRCode();
      this.startAutoUpdateQRCode();
    },
    startCountdown() {
      this.countdown = this.refreshInterval / 1000;
      const countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(countdownInterval);
        }
      }, 1000);
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

.error {
  color: red;
  font-size: 16px;
  margin-top: 20px;
}
</style>
