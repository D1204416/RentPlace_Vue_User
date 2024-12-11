<template>
  <div class="booking-finish-view">
    <h1>完成預訂</h1>

    <div v-if="qrCodeUrl && latestOrder">
      <p>謝謝惠顧，您的預約已完成，如欲查看更詳細的資訊可至歷史訂單查看</p>
      <p>您的訂單編號: <strong>{{ latestOrder.orderId }}</strong></p>
      <p>建議您可以使用 QR code 進場</p>

      <img :src="qrCodeUrl" alt="QR Code" />
      <p>QR code有效期限倒數：<strong>{{ countdown }}</strong> 秒</p>

    </div>
    <p v-if="qrCodeUrl === null && latestOrder === null" class="error">
      無法載入最新的 QR Code 或訂單資訊，請稍後再試。
    </p>
    <!-- <p v-else>正在載入 QR Code...</p> -->

    <div class="button-group">
      <button @click="manualUpdateQRCode" class="update-button">立即更新 QR Code</button>
      <button class="btn btn-book" @click="goNext">返回場地租借</button>
    </div>
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
          { responseType: "arraybuffer" }
        );

        const blob = new Blob([qrCodeResponse.data], { type: "image/png" });
        const blobUrl = URL.createObjectURL(blob);

        if (this.qrCodeUrl) {
          URL.revokeObjectURL(this.qrCodeUrl);
        }

        this.qrCodeUrl = blobUrl;

        const orderResponse = await axios.get("http://localhost:8080/api/orders/latest");
        this.latestOrder = orderResponse.data;

        // console.log("QR Code and Order updated:", this.latestOrder);
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

    oNext() {
      // 導航到場地租借頁面
      this.$router.push({
        name: "home",
      })

      localStorage.removeItem('reservationInfo')
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

h1 {
  margin-top: 20px;
}

.update-button {
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

.button-group {
  display: flex;
  gap: 15px;
  padding: 20px 0;
  justify-content: center;
}

.btn {
  padding: 10px 20px;
  border-radius: 5px;
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
  padding: 10px 40px;
  background: #3498db;
  color: white;
  border: none;
}

.btn-book:hover {
  background-color: #2a94db;
}
</style>
