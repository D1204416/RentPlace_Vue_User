<template>
  <div class="decode-qrcode-view">
    <h1>解碼 QR Code</h1>
    <div>
      <input type="file" @change="onFileChange" accept="image/*" />
    </div>
    <div v-if="decodedContent">
      <h2>解碼結果：</h2>
      <p>{{ decodedContent }}</p>
    </div>
    <div v-else-if="errorMessage">
      <p class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DecodeQRCodeView",
  data() {
    return {
      decodedContent: null, // 存儲解碼後的內容
      errorMessage: null,   // 錯誤訊息
    };
  },
  methods: {
    async onFileChange(event) {
      this.decodedContent = null;
      this.errorMessage = null;

      const file = event.target.files[0];
      if (!file) {
        this.errorMessage = "請選擇一個有效的圖片文件。";
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        // 發送請求到後端解碼接口
        const response = await axios.post("http://localhost:8080/api/orders/qrcode/decode", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.decodedContent = response.data; // 顯示解碼後的內容
      } catch (error) {
        console.error("解碼失敗", error);
        this.errorMessage = error.response?.data || "無法解碼 QR Code，請確保上傳的文件有效。";
      }
    }
  }
};
</script>

<style scoped>
.decode-qrcode-view {
  text-align: center;
  margin-top: 20px;
}

.decode-qrcode-view input[type="file"] {
  margin-top: 10px;
}

.decode-qrcode-view .error {
  color: red;
  margin-top: 20px;
}

.decode-qrcode-view h2 {
  margin-top: 20px;
  color: #333;
}

.decode-qrcode-view p {
  font-size: 16px;
  color: #666;
}
</style>
