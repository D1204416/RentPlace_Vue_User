<template>
  <div class="booking-finish-view">
    <h1>完成預訂</h1>
    <h4>謝謝惠顧，您的預約已完成，如欲查看更詳細的資訊可至歷史訂單查看</h4>

    <div v-if="qrCodeUrl && latestOrder" class="content-container">
      <!-- 左側 QR Code 區域 -->
      <div class="qr-code-section">
        <div class="qr-code-container">
          <p>建議您可以使用 QR code 進場</p>
          <img :src="qrCodeUrl" alt="QR Code" />
          <p>QR code有效期限倒數：<strong>{{ countdown }}</strong> 秒</p>
          <button @click="manualUpdateQRCode" class="update-button">立即更新 QR Code</button>
        </div>
      </div>

      <!-- 右側訂單資訊區域 -->
      <div class="order-info-section">
        <div class="info-card">
          <h2>訂單資訊</h2>
          <div class="info-item">
            <label>訂單編號：</label>
            <span>{{ latestOrder.orderId }}</span>
          </div>
          <div class="info-item">
            <label>預約場地：</label>
            <span>{{ bookingData.venueName }}</span>
          </div>
          <div class="info-item">
            <label>預約場地日期：</label>
            <span>{{ bookingData.reservationDate }}</span>
          </div>
        </div>

        <div class="info-card">
          <h2>付款資訊</h2>
          <div class="info-item">
            <label>付款方式：</label>
            <span>{{ paymentMethod }}</span>
          </div>
          <div class="info-item">
            <label>銷帳編號：</label>
            <span>{{ latestOrder.accountingNumber || '- -' }}</span>
          </div>
          <div class="info-item">
            <label>繳款期限：</label>
            <span>{{ latestOrder.paymentDueDate || '- -' }}</span>
          </div>
        </div>
      </div>
    </div>

    <p v-if="qrCodeUrl === null && latestOrder === null" class="error">
      無法載入最新的 QR Code 或訂單資訊，請稍後再試。
    </p>

    <div class="button-group">
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
      bookingData: {
        name: '',
        phone: '',
        applyApartment: '',
        content: '',
        equipmentIds: [],
        venueId: '',
        venueName: '',
        originalQuery: null,
      },
      paymentMethod: '',
    };
  },
  mounted() {
    this.startAutoUpdateQRCode();
  },
  beforeDestroy() {
    this.stopAutoUpdateQRCode();
  },

  created() {
    // 保存進入頁面時的查詢參數
    this.originalQuery = { ...this.$route.query }

    try {
      // 載入使用者資料
      const userData = localStorage.getItem('user')
      if (userData) {
        this.userId = JSON.parse(userData).userId
      }

      // 載入預約資料
      const storedData = localStorage.getItem('bookingData')
      if (storedData) {
        this.bookingData = JSON.parse(storedData)
      }

      // 載入付款方式
      const storedPaymentMethod = localStorage.getItem('paymentMethod')
      if (storedPaymentMethod) {
        this.paymentMethod = storedPaymentMethod
      }
    } catch (error) {
      console.error('Error loading booking data:', error)
    }
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

    goNext() {
      // 導航到場地租借頁面
      this.$router.push({
        name: "home",
      })

      // 清除之前的暫存資料
      localStorage.removeItem('bookingData')
      localStorage.removeItem('paymentMethod')
      localStorage.removeItem('reservationInfo')
    },
  },
};
</script>

<style scoped>
.booking-finish-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1,
h4 {
  text-align: center;
  margin-bottom: 30px;
}

.content-container {
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
}

/* 左側 QR Code 區域 */
.qr-code-section {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.qr-code-container img {
  max-width: 250px;
  height: auto;
  margin: 20px 0;
  border: 2px solid #ccc;
  border-radius: 10px;
}

/* 右側訂單資訊區域 */
.order-info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.info-card {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
}

.info-card h2 {
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.2em;
}

.info-item {
  display: flex;
  margin-bottom: 15px;
  font-size: 16px;
}

.info-item label {
  min-width: 100px;
  color: #666;
}

.info-item span {
  color: #2c3e50;
  font-weight: 500;
}

.update-button {
  padding: 10px 20px;
  font-size: 14px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.update-button:hover {
  background-color: #45a049;
}

.error {
  color: red;
  font-size: 16px;
  text-align: center;
  margin: 20px 0;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.btn {
  padding: 12px 24px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  text-align: center;
}

.btn-book {
  background: #3498db;
  color: white;
  border: none;
}

.btn-book:hover {
  background-color: #2a94db;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .content-container {
    flex-direction: column;
  }

  .info-item {
    flex-direction: column;
  }

  .info-item label {
    margin-bottom: 5px;
  }
}
</style>
