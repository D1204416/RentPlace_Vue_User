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
            <h5 class="venue-name">{{ room.venueName }}</h5>
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

    // 解析營業時間範圍並獲取可用的時段ID
    getAvailableTimePeriods(availableTime) {
      // 時段對照表 (依照您系統的時段設定)
      const TIME_PERIODS = {
        "07:00-08:00": 1,
        "08:00-09:00": 2,
        "09:00-10:00": 3,
        "10:00-11:00": 4,
        "11:00-12:00": 5,
        "12:00-13:00": 6,
        "13:00-14:00": 7,
        "14:00-15:00": 8,
        "15:00-16:00": 9,
        "16:00-17:00": 10,
        "17:00-18:00": 11,
        "18:00-19:00": 12,
        "19:00-20:00": 13,
        "20:00-21:00": 14,
        "21:00-22:00": 15,
        "07:00-22:00": 16  // 整天預約時段
      }

      // 解析營業時間
      const [startTime, endTime] = availableTime.split('-')

      // 將所有時段轉換為數字以便比較
      const convertTimeToNumber = (time) => {
        const [hours] = time.split(':')
        return parseInt(hours)
      }

      const startHour = convertTimeToNumber(startTime)
      const endHour = convertTimeToNumber(endTime)

      // 找出在營業時間內的時段ID
      const availablePeriods = Object.entries(TIME_PERIODS)
        .filter(([period]) => {
          if (period === "07:00-22:00") return true  // 總是包含整天時段
          const [periodStart] = period.split('-')
          const periodHour = convertTimeToNumber(periodStart)
          return periodHour >= startHour && periodHour < endHour
        })
        .map(([, id]) => id)

      return availablePeriods
    },

    isVenueAvailable(venueId, selectedDate, selectedTimePeriod) {
      if (!selectedDate) return true

      const venueReservations = this.reservations[venueId] || []
      const venueInfo = venueReservations.find(r => r.venue)
      if (!venueInfo) return true

      // 1. 檢查是否為休館日
      const isCloseDate = venueInfo.venue.closeDates?.some(
        closeDate => closeDate.closeDate === selectedDate
      )
      if (isCloseDate) return false

      // 2. 獲取場地營業時間內的可用時段
      const availableTimePeriods = this.getAvailableTimePeriods(venueInfo.venue.availableTime)

      // 3. 獲取該日期的所有預約記錄
      const dateReservations = venueReservations.filter(
        reservation => reservation.reservationDate === selectedDate
      )

      // 4. 檢查是否有整天預約
      const hasFullDayBooking = dateReservations.some(
        r => r.timePeriodId === 16 && r.statusText === "不可預約"
      )
      if (hasFullDayBooking) return false

      // 5. 如果選擇了整天預約時段
      if (selectedTimePeriod && parseInt(selectedTimePeriod) === 16) {
        // 檢查所有時段是否都可預約
        const hasAnyBooking = dateReservations.some(
          r => r.statusText === "不可預約"
        )
        return !hasAnyBooking
      }

      // 6. 檢查一般時段的預約狀態
      const unavailablePeriods = new Set(
        dateReservations
          .filter(r => r.statusText === "不可預約")
          .map(r => r.timePeriodId)
      )

      // 如果指定了時段
      if (selectedTimePeriod) {
        const timePeriodId = parseInt(selectedTimePeriod)
        // 檢查是否在營業時間內
        if (!availableTimePeriods.includes(timePeriodId)) {
          return false
        }
        // 檢查是否可預約
        return !unavailablePeriods.has(timePeriodId)
      }

      // 7. 檢查是否還有可用時段
      const allPeriodsBooked = availableTimePeriods
        .filter(id => id !== 16)  // 排除整天時段的檢查
        .every(periodId => unavailablePeriods.has(periodId))

      return !allPeriodsBooked
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

      // // 處理容納人數
      // if (query.capacity) {
      //   const capacityRange = query.capacity.split('~')
      //   const minCapacity = parseInt(capacityRange[0])
      //   const maxCapacity = capacityRange[1] ?
      //     (capacityRange[1].includes('以上') ? Infinity : parseInt(capacityRange[1])) :
      //     minCapacity

      //   filtered = filtered.filter(room =>
      //     room.capacity >= minCapacity &&
      //     (maxCapacity === Infinity ? true : room.capacity <= maxCapacity)
      //   )

       // 處理容納人數
       if (query.capacity) {
        let minCapacity = 1;
        
        if (query.capacity.includes('以上')) {
          // 處理 "200人以上" 的情況
          minCapacity = parseInt(query.capacity);
        } else {
          // 處理 "1~10人" 這種範圍的情況
          const capacityRange = query.capacity.split('~');
          minCapacity = parseInt(capacityRange[0]);
        }

        filtered = filtered.filter(room => room.capacity >= minCapacity)
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