<script setup>
import Search from '../components/Search.vue'

</script>

<template>

  <Search />
  <div class="container">
    <!-- 添加載入中狀態 -->
    <div v-if="loading" class="loading">載入中...</div>
    <!-- 添加錯誤提示 -->
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else>
      <div class="content">
        <div class="left-column">
          <img :src="`/venueImg/${venueId}.svg`" :alt="info['場地名稱：']" class="room-image" />
        </div>
        
        <div class="right-column">
          <div class="info-grid">
            <h4>{{ info['場地名稱：'] }}</h4>
            <div class="info-item" v-for="(value, label) in info" :key="label">
              <div class="info-label">{{ label }}</div>
              <div class="info-value">{{ value }}</div>
            </div>
          </div>

          <div class="facilities">
            <h4>有提供的設備與服務</h4>
            <div class="facilities-list">
              <div v-if="facilities.length === 0" class="facilities-item">無</div>
              <div v-else class="facilities-item" v-for="facility in facilities" :key="facility">{{ facility }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 地圖區塊 -->
      <div class="map-section">
        <h4>地圖資訊</h4>
        <iframe
          v-if="info['場地位址：']"
          width="100%"
          height="400"
          style="border:0"
          loading="lazy"
          :src="`https://maps.google.com/maps?q=${encodeURIComponent(info['場地位址：'])}&t=&z=13&ie=UTF8&iwloc=&output=embed`"
          allowfullscreen
        ></iframe>
      </div>

      <div class="button-group">
        <button class="btn btn-back" @click="goBack">回上一頁</button>
        <button class="btn btn-book" @click="goToBooking">前往預約</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'


export default {
  name: "cardInfoView",

  data() {
    return {
      venueId: null,
      facilities: [],
      info: {},
      loading: true,
      error: null
    };
  },

  methods: {
    async fetchVenueDetail() {
      try {
        this.loading = true

        console.log('Fetching venue detail for ID:', this.venueId)
        // 並行請求場地和設施資料
        const [venueResponse, equipmentResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/venues/${this.venueId}`),
          axios.get(`http://localhost:8080/api/equipment/venue/${this.venueId}`)
        ])

        const venue = venueResponse.data

        // 從設備資料中只提取 equipmentName
        this.facilities = Array.isArray(equipmentResponse.data) 
          ? equipmentResponse.data.map(item => item.equipmentName)
          : [equipmentResponse.data.equipmentName]

        // 設置場地信息
        this.info = {
          "場地名稱：": venue.placeName,
          "聯絡電話：": venue.phoneNumber,
          "場地位址：": venue.address,
          "容納人數：": `${venue.capacity}人`,
          "營業時間：": venue.availableTime,
          "繳費方式：": `${venue.unitPrice} / ${venue.unit}`,
        }

        this.loading = false
      } catch (error) {
        console.error('Failed to fetch data:', error)
        this.error = '無法載入場地資訊'
        this.loading = false
      }
    },

    goBack() {
      this.$router.go(-1);
    },

    goToBooking() {
      this.$router.push({
        name: "BookingPage",  // 修改成實際的預約頁名稱
        params: { venueId: this.venueId }
      })
    },

    async created() {
      // 從路由參數獲取 id
      this.venueId = this.$route.params.id
      console.log('Route params:', this.$route.params)  // 檢查路由參數

      if (this.venueId) {
        await this.fetchVenueDetail()
      } else {
        this.error = '找不到場地ID'
      }
    }
  },

  // 可選：監聽路由變化，處理用戶直接通過 URL 訪問的情況
  watch: {
    '$route.params.id': {
      handler(newId) {
        if (newId && newId !== this.venueId) {
          this.venueId = newId
          this.fetchVenueDetail()
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

body {
  background-color: rgb(249, 249, 249);
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 10px auto;
  /* background: rgb(249, 249, 249); */
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
  height: 500px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  gap: 10px;
}

.info-item {
  display: flex;
  gap: 10px;
}

.info-label {
  color: #333;
  min-width: 100px;
  font-size: 16px;
}

.info-value {
  color: #535353;
}

.facilities {
  margin-top: 80px;
}

.facilities h4 {
  margin-bottom: 15px;
  /* font-size: 18px; */
}

.facilities-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.facilities-item {
  background: #ebebeb;
  padding: 8px 16px;
  border-radius: 20px;
  color: #41474e;
  font-size: 16px;
  border: 1px solid #dddddd;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* .map-container {
  width: 100%;
  height: 300px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.map-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  padding: 20px 0;
} */

.map-section {
  width: 100%;
  padding: 0 20px 20px 20px;
}

/* 新增樣式確保地圖容器正確顯示 */
.map-section iframe {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.map-section h4 {
  margin-bottom: 15px;
  /* padding: 0 20px; */
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }
  
  .map-section {
    padding: 0 10px 10px 10px;
    margin-top: 50PX;
  }

  .map-section h4 {
    padding: 0 10px;
  }
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