<template>
  <div class="container">

    <!-- 添加載入中狀態 -->
    <div v-if="loading" class="loading">載入中...</div>

    <!-- 添加錯誤提示 -->
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="content">
      <div class="left-column">
        <!-- <img src="/venueImg/1.svg" alt="會議室照片" class="room-image" /> -->
        <img :src="`/venueImg/${venueId}.svg`" :alt="info['場地名稱：']" class="room-image" />

        <div class="facilities">
          <h3>有提供的設備與服務</h3>
          <div class="facilities-list">
            <div class="facilities-item" v-for="facility in facilities" :key="facility">{{ facility }}</div>
          </div>
        </div>
      </div>

      <div class="right-column">
        <div class="info-grid">
          <h4>{{ info['場地名稱：'] }}</h4>
          <div class="info-item" v-for="(value, label) in info" :key="label">
            <div class="info-label">{{ label }}</div>
            <div class="info-value">{{ value }}</div>
          </div>
        </div>

        <div class="map-container">
          <h4>地圖資訊</h4>
          <!-- <img src="/venueImg/map.svg" alt="地圖" /> -->
          <google-map :address="info['場地位址：']"></google-map>
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
import axios from 'axios'
import GoogleMap from '../components/GoogleMap.vue'

export default {
  name: "cardInfoView",
  components: {
    GoogleMap
  },

  data() {
    return {
      // facilities: ["電梯", "停車場", "無障礙設施", "桌子"],
      // info: {
      //   "場地名稱：": "會議室",
      //   "聯絡電話：": "04-25602710 #11",
      //   "場地位址：": "台中市霧峰區中正路578巷25號",
      //   "容納人數：": "20人",
      //   "營業時間：": "07:00 - 21:00",
      //   "繳費方式：": "2000/次",
      // },

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
  margin-top: 10px;
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
  margin-bottom: 20px;
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