<template>
    <div>
      <input type="file" accept="image/*" @change="handleFileUpload" />
      <button @click="decodeQRCode" :disabled="!file">Decode QR Code</button>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div v-if="decodedData">
        <h3>Decoded Data:</h3>
        <pre>{{ decodedData }}</pre>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        file: null,
        decodedData: null,
        error: null,
      };
    },
    methods: {
      handleFileUpload(event) {
        const selectedFile = event.target.files[0];
        
        // Validate file type
        if (selectedFile && selectedFile.type.startsWith('image/')) {
          this.file = selectedFile;
          this.error = null;
        } else {
          this.file = null;
          this.error = "Please select a valid image file.";
        }
      },
      async decodeQRCode() {
        if (!this.file) {
          this.error = "Please upload a QR Code image.";
          return;
        }
  
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Image = e.target.result;
          
          try {
            // Validate base64 string
            if (!base64Image || !base64Image.includes('base64')) {
              throw new Error("Invalid image data");
            }
  
            const response = await axios.post(
              "http://localhost:8080/api/orders/qrcode/decode", 
              { image: base64Image }, // Send as object with 'image' key
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );
  
            this.decodedData = response.data;
            this.error = null;
          } catch (error) {
            console.error("Error decoding QR Code:", error);
            this.error = error.response?.data?.message || 
                         error.message || 
                         "Failed to decode QR Code";
            this.decodedData = null;
          }
        };
  
        reader.onerror = (error) => {
          console.error("File reading error:", error);
          this.error = "Error reading file";
        };
  
        reader.readAsDataURL(this.file);
      },
    },
  };
  </script>
  
  <style scoped>
  .error-message {
    color: red;
    margin-top: 10px;
  }
  </style>