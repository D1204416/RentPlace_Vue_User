<template>
    <div class="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Generate QR Code</h1>
        <p class="text-gray-600">Enter the Order ID to generate the QR code</p>
      </div>
  
      <!-- Input and Button -->
      <div class="flex justify-center mb-6 space-x-4">
        <input 
          v-model="orderId" 
          placeholder="Enter Order ID" 
          type="number" 
          class="w-48 p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          @click="fetchQRCode" 
          class="px-6 py-3 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition"
        >
          Generate QR Code
        </button>
      </div>
  
      <!-- QR Code and Last Updated -->
      <div v-if="qrCode" class="text-center">
        <img :src="qrCode" :key="qrCodeKey" alt="QR Code" class="w-48 h-48 mx-auto mb-4" />
        <p class="text-gray-500 text-sm">Last Updated: {{ lastUpdated }}</p>
      </div>
  
      <!-- Error Message -->
      <div v-if="error" class="text-center mt-4 text-red-500 font-semibold">
        {{ error }}
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        orderId: "",
        qrCode: null,
        qrCodeKey: 0,
        lastUpdated: null,
        error: null,
        updateInterval: null
      };
    },
    methods: {
      async fetchQRCode() {
        if (!this.orderId) {
          this.error = "Please enter a valid Order ID";
          return;
        }
  
        try {
          const response = await axios.get(
            `http://localhost:8080/api/orders/${this.orderId}/qrcode`, 
            {
              params: { 
                timestamp: new Date().getTime(),
                random: Math.random() // Add random parameter
              }
            }
          );
  
          this.qrCode = `data:image/png;base64,${response.data}`;
          this.qrCodeKey += 1;
          this.lastUpdated = new Date().toLocaleString();
          this.error = null;
  
          this.setupAutoUpdate();
        } catch (error) {
          console.error("QR Code Error:", error);
          this.error = "Failed to generate QR Code";
          this.qrCode = null;
        }
      },
  
      setupAutoUpdate() {
        if (this.updateInterval) {
          clearInterval(this.updateInterval);
        }
  
        this.updateInterval = setInterval(() => {
          this.fetchQRCode();
        }, 30000); // Update every 30 seconds
      },
  
      beforeDestroy() {
        if (this.updateInterval) {
          clearInterval(this.updateInterval);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Custom Tailwind configurations (optional) */
  </style>
  