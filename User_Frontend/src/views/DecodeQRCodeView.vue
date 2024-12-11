<template>
  <div class="decode-qrcode-view">
    <h1>解碼 QR Code</h1>
    <div>
      <input type="file" @change="onFileChange" accept="image/*" />
    </div>
    <div v-if="decodedContent">
      <h2>解碼結果：</h2>
      <p>{{ decodedContent }}</p>
      <button @click="decryptContent">進一步解密</button>
    </div>
    <div v-if="decryptedContent">
      <h2>解密結果：</h2>
      <p>{{ decryptedContent }}</p>
    </div>
    <div v-if="errorMessage">
      <p class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import CryptoJS from "crypto-js"; // 安裝: npm install crypto-js

export default {
  name: "DecodeQRCodeView",
  data() {
    return {
      decodedContent: null,    // 存儲解碼後的內容
      decryptedContent: null, // 存儲解密後的內容
      errorMessage: null,      // 錯誤訊息
      secretKey: "1234567890123456", // AES 解密密鑰，需與加密密鑰一致
    };
  },
  
  methods: {
    async onFileChange(event) {
      this.decodedContent = null;
      this.decryptedContent = null;
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
    },

    decryptContent() {
      if (!this.decodedContent) {
        this.errorMessage = "沒有可解密的內容，請先解碼 QR Code。";
        return;
      }

      try {
        // 使用 CryptoJS 進行 AES 解密
        const bytes = CryptoJS.AES.decrypt(this.decodedContent, CryptoJS.enc.Utf8.parse(this.secretKey), {
          mode: CryptoJS.mode.ECB, // 確保與後端加密模式一致
          padding: CryptoJS.pad.Pkcs7, // 確保與後端填充方式一致
        });

        // 解密後轉為 UTF-8 字符串
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (!decrypted) {
          throw new Error("解密失敗，結果為空");
        }

        this.decryptedContent = decrypted; // 顯示解密後的內容
        console.log("解密結果:", decrypted);
      } catch (error) {
        console.error("解密失敗:", error.message);
        this.errorMessage = "解密失敗，請確認密鑰或內容是否正確。";
      }
    },
  },
};

</script>
<style>.decode-qrcode-view button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.decode-qrcode-view h2 {
  color: #333;
  margin-top: 20px;
}

.decode-qrcode-view p {
  font-size: 16px;
  color: #666;
}


</style>