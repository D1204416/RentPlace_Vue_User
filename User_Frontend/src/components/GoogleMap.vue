<template>
    <div class="map-container">
      <!-- <h4>地圖資訊</h4> -->
      <iframe
        v-if="encodedAddress"
        width="100%"
        height="300"
        style="border:0"
        loading="lazy"
        :src="mapUrl"
        allowfullscreen>
      </iframe>
      <div v-else class="error-message">
        無法載入地圖
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GoogleMap',
    props: {
      address: {
        type: String,
        required: true
      }
    },
    computed: {
      encodedAddress() {
        return encodeURIComponent(this.address)
      },
      mapUrl() {
        return `https://www.google.com/maps/embed/v1/place?key=AIzaSyAwutzXnM2pKuQV-j6Y1XHdJ4eXHCKIvGE&q=${this.encodedAddress}&zoom=16&language=zh-TW`
      }
    }
  }
  </script>
  
  <style scoped>
  .map-container {
    width: 100%;
    margin-top: 1rem;
  }
  
  .error-message {
    color: red;
    padding: 1rem;
    text-align: center;
  }
  </style>