<template>
    <div class="container">
  
      <div class="content">
        <div class="left-column">
          <img src="/venueImg/1.svg" alt="會議室照片" class="room-image" />
          
          <div class="facilities">
            <h3>有提供的設備與服務</h3>
            <div class="facilities-list">
              <div class="facilities-item" v-for="facility in facilities" :key="facility">{{ facility }}</div>
            </div>
          </div>
        </div>
  
        <div class="right-column">
          <div class="info-grid">
            <h4>大墩等四里聯合活動中心</h4>
            <div class="info-item" v-for="(value, label) in info" :key="label">
              <div class="info-label">{{ label }}</div>
              <div class="info-value">{{ value }}</div>
            </div>
          </div>
  
          <div class="map-container">
            <h4>地圖資訊</h4>
            <img src="/venueImg/map.svg" alt="地圖" />
          </div>
        </div>
      </div>
  
      <div class="button-group">
        <button class="btn btn-back" @click="goBack">回上一頁</button>
        <button class="btn btn-book" @click="goToBooking">前往預約</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "VenueDetail",
    data() {
      return {
        facilities: ["電梯", "停車場", "無障礙設施", "桌子"],
        info: {
          "場地名稱：": "會議室",
          "聯絡電話：": "04-25602710 #11",
          "場地位址：": "台中市霧峰區中正路578巷25號",
          "容納人數：": "20人",
          "營業時間：": "07:00 - 21:00",
          "繳費方式：": "2000/次",
        },
      };
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      goToBooking() {
        this.$router.push({ name: "BookingPage" }); // 修改成實際的預約頁名稱
      },
    },
  };
  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  
  body {
    background-color: #f5f5f5;
    padding: 20px;
  }
  
  .container {
    max-width: 1200px;
    margin: 10px auto;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  }
  
  .header {
    padding: 20px;
    border-bottom: 1px solid #eee;
  }
  
  h4 {
    font-size: 20px;
    color: #333;
  }
  
  .content {
    display: flex;
    padding: 20px;
    gap: 40px;
  }
  
  .left-column {
    flex: 1;
  }
  
  .right-column {
    flex: 1;
  }
  
  .room-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 20px;
  }
  
  .info-grid {
    display: grid;
    gap: 15px;
  }
  
  .info-item {
    display: flex;
    gap: 10px;
  }
  
  .info-label {
    color: #333;
    min-width: 100px;
  }
  
  .info-value {
    color: #666;
  }
  
  .facilities {
    margin-top: 30px;
  }
  
  .facilities h3 {
    margin-bottom: 15px;
    font-size: 18px;
  }
  
  .facilities-list {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  
  .facilities-item {
    background: #f8f9fa;
    padding: 8px 16px;
    border-radius: 20px;
    color: #495057;
    font-size: 14px;
    border: 1px solid #e9ecef;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .map-container {
    width: 100%;
    height: 300px;
    margin-top: 20px;
  }
  
  .map-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
    padding: 20px 0;
  }
  
  .button-group {
    display: flex;
    gap: 15px;
    padding: 20px;
    justify-content: center;
  }
  
  .btn {
    padding: 10px 40px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    text-align: center;
    border: 1px solid #ddd;
  }
  
  .btn-back {
    background: white;
    color: #333;
  }
  
  .btn-book {
    background: #3498db;
    color: white;
    border: none;
  }
  
  @media (max-width: 768px) {
    .content {
      flex-direction: column;
    }
  }
  </style>
  