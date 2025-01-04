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
          <img :src="getImageUrl(venue.imageName)" :alt="info['場地名稱：']" class="room-image" @error="handleImageError" />
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
        <iframe v-if="info['場地位址：']" width="100%" height="400" style="border:0" loading="lazy"
          :src="`https://maps.google.com/maps?q=${encodeURIComponent(info['場地位址：'])}&t=&z=13&ie=UTF8&iwloc=&output=embed`"
          allowfullscreen></iframe>
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
import { inject } from 'vue'

export default {
  name: "cardInfoView",

  data() {
    return {
      venueId: null,
      facilities: [],
      info: {},
      loading: true,
      error: null,
      originalQuery: null, // 添加此字段來保存原始查詢參數
      venue: {}, // 添加存儲完整場地數據
    };
  },

  created() {
    // 保存進入頁面時的查詢參數
    this.originalQuery = { ...this.$route.query }
    this.venueId = this.$route.params.id
    if (this.venueId) {
      this.fetchVenueDetail()
    } else {
      this.error = '找不到場地ID'
    }
  },

  setup() {
    const showLoginModal = inject('showLoginModal')
    return {
      showLoginModal
    }
  },

  methods: {
    getImageUrl(imageName) {
      if (!imageName) {
        return '/img/default.svg'
      }
      return `/img/${imageName}`
    },

    handleImageError(e) {
      // 如果已經是預設圖片就不處理
      if (e.target.src.includes('default.svg')) {
        return
      }

      // 設置預設圖片
      e.target.src = '/img/default.svg'
      // 移除錯誤事件監聽，防止預設圖片載入失敗時再次觸發
      e.target.removeEventListener('error', this.handleImageError)
    },

    async fetchVenueDetail() {
      try {
        this.loading = true
        console.log('Fetching venue detail for ID:', this.venueId)

        // 並行請求場地和設施資料
        const [venueResponse, equipmentResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/venues/${this.venueId}`),
          axios.get(`http://localhost:8080/api/equipment/venue/${this.venueId}`)
        ])

        // 直接將 API 回傳的資料存到 venue
        const venueData = venueResponse.data
        console.log('Venue response:', venueData)  // 檢查資料

        // 確保所有需要的資料都正確存儲
        this.venue = {
          ...venueData,  // 展開所有資料
          imageName: venueData.imageName  // 明確指定 imageName
        }

        console.log('Stored venue data:', this.venue)  // 檢查存儲的資料
        console.log('Image name:', this.venue.imageName)  // 檢查 imageName

        // 從設備資料中只提取 equipmentName
        this.facilities = Array.isArray(equipmentResponse.data)
          ? equipmentResponse.data.map(item => item.equipmentName)
          : [equipmentResponse.data.equipmentName]

        // 設置場地信息
        this.info = {
          "場地名稱：": venueData.venueName,
          "聯絡電話：": venueData.phoneNumber,
          "場地位址：": venueData.address,
          "容納人數：": `${venueData.capacity}人`,
          "營業時間：": venueData.availableTime,
          "繳費方式：": `${venueData.unitPrice} / ${venueData.unit}`,
        }

        this.loading = false
      } catch (error) {
        console.error('Failed to fetch data:', error)
        this.error = '無法載入場地資訊'
        this.loading = false
      }
    },

    goBack() {
      this.$router.push({
        name: 'cardView',
        // 保留原有的查詢參數
        query: this.originalQuery
      })
    },

    goToBooking() {
      // 檢查登入狀態
      const userStr = localStorage.getItem('user')

      if (!userStr) {
        // 未登入狀態
        console.log('需要登入才能預約')

        // 儲存預約資訊
        localStorage.setItem('pendingBooking', JSON.stringify({
          name: 'BookingDateView',
          params: { id: this.venueId },
          query: this.originalQuery // 保存查詢參數
        }))

        // 顯示登入提示
        alert('請先登入後再進行預約')

        // 顯示登入 modal
        const loginModal = document.getElementById('loginModal')
        const modal = new bootstrap.Modal(loginModal)
        modal.show()
        return
      }

      // 已登入狀態，直接前往預約頁面
      this.$router.push({
        name: "BookingDateView",
        params: { id: this.venueId },
        query: this.originalQuery   // 傳遞查詢參數
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
  /* margin-bottom: 10px; */
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
  font-size: 17px;
}

.info-value {
  color: #535353;
  font-size: 17px;
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
  margin-bottom: 18px;
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
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 18px;
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