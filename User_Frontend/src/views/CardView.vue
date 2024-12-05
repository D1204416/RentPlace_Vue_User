<script setup>
import Search from '../components/Search.vue'
import Pagination from '../components/Pagination.vue';
</script>

<template>

  <Search />

  <div class="container">
    <!-- 添加載入中狀態 -->
    <div v-if="loading" class="loading">載入中...</div>

    <template v-else>
      <h4 class="search-result">符合您搜尋條件的場地：{{ filteredRooms.length }}筆</h4>

      <!-- 如果沒有搜尋結果 -->
      <div v-if="filteredRooms.length === 0" class="no-results">
        沒有符合搜尋條件的場地
      </div>

      <!-- 卡片網格 -->
      <div class="room-grid">
        <div v-for="room in paginatedRooms" :key="room.id" class="room-card" @click="goToDetail(room)">
          <img :src="`/venueImg/${room.imageId}.svg`" :alt="room.name" class="card-image" @error="handleImageError">
          <div class="card-content">
            <h5 class="venue-name">{{ room.placeName }}</h5>
            <div class="venue-info">
              <p>場地類型：{{ room.venueType }}</p>
              <p>聯絡電話：{{ room.phoneNumber }}</p>
              <p>行政區域：{{ room.regionName }}</p>
              <p>容納人數：{{ room.capacity }}人</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 分頁 -->
      <div class="pagination" v-if="totalPages > 1">
        <Pagination :total-pages="totalPages" :current-page="currentPage" @update:page="handlePageChange" />
      </div>
    </template>
  </div>

</template>

<script>
import axios from 'axios'

// const onPageChange = (page) => {
//   console.log('Current page:', page)
//   // 處理頁碼變化
// }

export default {
  name: 'Card',

  data() {
    return {
      rooms: [],
      filteredRooms: [],
      currentPage: 1,
      itemsPerPage: 12,
      reservations: {}, // 用來存儲每個場地的預約資訊
      loading: false, // 添加 loading 狀態
    }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.filteredRooms.length / this.itemsPerPage)
    },

    paginatedRooms() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredRooms.slice(start, end)
    }
  },

  methods: {
    handleImageError(e) {
      const currentSrc = e.target.src

      // 已經是預設圖片就不再處理
      if (currentSrc.includes('default.svg')) {
        return
      }

      // 設置預設圖片
      try {
        e.target.src = '/img/'
        // 移除錯誤事件監聽，防止預設圖片載入失敗時再次觸發
        e.target.removeEventListener('error', this.handleImageError)
      } catch (error) {
        console.error('Failed to load default image:', error)
      }
    },

    async fetchVenues() {
      try {
        this.loading = true
        const response = await axios.get('http://localhost:8080/api/venues')
        this.rooms = response.data
        await this.fetchReservations()
        this.applyFilters() // 確保在獲取數據後立即應用過濾
        this.loading = false
      } catch (error) {
        console.error('Failed to fetch venues:', error)
        this.loading = false
      }
    },

    async fetchReservations() {
      try {
        const response = await axios.get('http://localhost:8080/api/reservations')
        // 將預約資訊按場地ID分組
        this.reservations = response.data.reduce((acc, reservation) => {
          if (!acc[reservation.venueId]) {
            acc[reservation.venueId] = []
          }
          acc[reservation.venueId].push(reservation)
          return acc
        }, {})
      } catch (error) {
        console.error('Failed to fetch reservations:', error)
      }
    },

    isVenueAvailable(venueId, selectedDate, selectedTimePeriod) {
      // 如果沒有選擇日期，返回true
      if (!selectedDate) return true

      // 獲取該場地的所有預約
      const venueReservations = this.reservations[venueId] || []

      // 檢查是否有任何預約在選定的日期和時段是"不可預約"狀態
      return !venueReservations.some(reservation => {
        const isSelectedDate = reservation.reservationDate === selectedDate
        const isSelectedTimePeriod = selectedTimePeriod ?
          reservation.timePeriodId === parseInt(selectedTimePeriod) : true
        const isUnavailable = reservation.statusInfo.status === "不可預約"

        return isSelectedDate && isSelectedTimePeriod && isUnavailable
      })
    },

    applyFilters() {
      // 確保 this.rooms 有數據
      if (!this.rooms || this.rooms.length === 0) {
        console.log('No rooms data available')
        return
      }

      let filtered = [...this.rooms]
      const query = this.$route.query   // 從 URL 取得參數

      // 根據 URL 查詢參數過濾

      // 處理區域
      if (query.districts) {
        const selectedDistricts = query.districts.split(',')
        filtered = filtered.filter(room =>
          selectedDistricts.includes(room.regionName)
        )
      }

      // 處理場地類型
      if (query.venues) {
        const selectedVenues = query.venues.split(',')
        filtered = filtered.filter(room =>
          // 只要場地類型包含任何一個關鍵字就符合條件
          selectedVenues.some(keyword =>
            room.venueType.includes(keyword)
          )
        )
      }

      // 處理容納人數
      if (query.capacity) {
        const capacityRange = query.capacity.split('~')
        const minCapacity = parseInt(capacityRange[0])
        const maxCapacity = capacityRange[1] ?
          (capacityRange[1].includes('以上') ? Infinity : parseInt(capacityRange[1])) :
          minCapacity

        filtered = filtered.filter(room =>
          room.capacity >= minCapacity &&
          (maxCapacity === Infinity ? true : room.capacity <= maxCapacity)
        )
      }

      // 日期和時段過濾
      if (query.date) {
        filtered = filtered.filter(room =>
          this.isVenueAvailable(room.id, query.date)
        )
      }

      this.filteredRooms = filtered
    },

    goToDetail(room) {
      // 確保 room.id 存在
      if (room && room.id) {
        console.log('Navigating to room:', room.id); // 用於調試
        this.$router.push({
          name: 'cardInfoView',
          params: { id: room.id },
          query: this.$route.query   // 如果需要保留搜尋條件，可以加上現有的 query 參數
        })
      } else {
        console.error('Room ID is missing:', room);
      }
    },

    handlePageChange(page) {
      this.currentPage = page
      // 可以添加滾動到頂部的邏輯
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
  },

  watch: {
    // 監聽路由變化
    '$route.query': {
      handler(newQuery, oldQuery) {
        console.log('Route query changed:', newQuery) // 用於調試
        // 只有在查詢參數真正改變時才重置頁碼和重新過濾
        if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
          this.currentPage = 1
          this.applyFilters()
        }
      },
      deep: true,
      immediate: true
    }
  },

  // 確保組件創建時獲取數據
  async created() {
    await this.fetchVenues()
  }

}

</script>

<style scoped>
/* 新的樣式 */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.search-result {
  font-size: 22px;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
}

.room-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.room-card {
  background: rgb(249, 249, 249);
  border: none;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
}

.card-content {
  padding: 15px 0;
}

.venue-name {
  font-size: 18px;
  font-weight: bold;
  color: #000;
  margin-bottom: 10px;
}

.venue-info {
  font-size: 16px;
  color: #000;
}

.venue-info p {
  margin: 5px 0;
  line-height: 1.4;
  font-size: 16px;
}

/* 分頁按鈕樣式 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 30px;
}


/* 響應式設計 */

@media (min-width: 320px) and (max-width: 639px) {

  .search-result {
    font-size: 17px;
  }

  .venue-name {
    font-size: 16px;
  }

}

@media (min-width: 640px) and (max-width: 768px) {
  .search-result {
    font-size: 20px;
  }

  .venue-name {
    font-size: 18px;
  }

}


@media (min-width: 640px) and (max-width: 1023px) {
  .room-grid {
    grid-template-columns: repeat(2, 1fr);
  }


}

@media (min-width: 1024px) {
  .room-grid {
    grid-template-columns: repeat(3, 1fr);
  }

}

@media (min-width: 1280px) {
  .room-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>