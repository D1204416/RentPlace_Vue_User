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
      qrCodeUrl: null, // 存储 QR Code 的 Blob URL
      intervalId: null, // 定时器 ID
      countdown: 10, // 倒数计时秒数
    };
  },
  mounted() {
    this.startAutoUpdateQRCode();
  },
  beforeDestroy() {
    this.stopAutoUpdateQRCode(); // 组件销毁时停止定时器
  },
  methods: {
    async loadLatestQRCode() {
      try {
        const response = await axios.get(
            `http://localhost:8080/api/orders/latest-qrcode?t=${new Date().getTime()}`, // 加时间戳防止缓存
            {responseType: "arraybuffer"} // 确保返回二进制数据
        );

        // 将二进制数据转换为 Blob URL
        const blob = new Blob([response.data], {type: "image/png"});
        const blobUrl = URL.createObjectURL(blob);

        // 清除旧的 Blob URL 以避免内存泄漏
        if (this.qrCodeUrl) {
          URL.revokeObjectURL(this.qrCodeUrl);
        }

        this.qrCodeUrl = blobUrl;

        console.log("QR Code Blob URL updated:", this.qrCodeUrl); // 调试用日志
      } catch (error) {
        console.error("无法加载 QR Code", error);
        this.qrCodeUrl = null;
      }
    },
    startAutoUpdateQRCode() {
      this.loadLatestQRCode(); // 初次加载
      this.startCountdown(); // 开始倒计时

      // 每 10 秒刷新一次
      this.intervalId = setInterval(() => {
        this.loadLatestQRCode();
      }, 10000);
    },
    stopAutoUpdateQRCode() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
    manualUpdateQRCode() {
      this.stopAutoUpdateQRCode(); // 停止自动刷新
      this.loadLatestQRCode(); // 手动刷新
      this.startAutoUpdateQRCode(); // 重启自动刷新
    },
    startCountdown() {
      this.countdown = 10; // 倒计时从 10 开始
      const countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(countdownInterval); // 倒计时结束时清除计时器
        }
      }, 1000); // 每秒更新一次倒计时
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
