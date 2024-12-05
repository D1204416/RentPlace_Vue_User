<!-- src/views/BookingDate.vue -->
<template>
  <progress-steps :current-step="1" />
  
  <div class="selected-date-container">
    
    <div class="calendar-wrapper">
      <Calendar :venue-id="venueId" :reservations="reservations" :close-dates="closeDates"
        @date-selected="handleDateSelect" />
    </div>

    <div class="time-slot-wrapper">
      <h3 class="page-title">{{ placeName }}</h3>
      <TimeSlotSelector :date="selectedDate" @selection-change="handleSelectionChange" />
    </div>

    <!-- 狀態提示訊息 -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>

  <div class="button-group">
    <button class="btn btn-back" @click="goBack">上一步</button>
    <button class="btn btn-book" @click="goNext">下一步</button>
  </div>

</template>

<script>
import Calendar from '@/components/Calendar.vue'
import ProgressSteps from '../components/ProgressSteps_Jo.vue'
import TimeSlotSelector from '../components/TimeSlotSelector.vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'bookingDate',
  components: {
    Calendar,
    ProgressSteps,
    TimeSlotSelector

  },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const venueId = ref(route.params.id)
    const message = ref('')
    const messageType = ref('')
    const reservations = ref([])
    const closeDates = ref([])
    const loading = ref(false)
    const placeName = ref('')
    const selectedDate = ref('尚未選擇租借日期') // 儲存選中的日期

    // 獲取認證 token
    const getAuthToken = () => {
      return localStorage.getItem('authToken')
    }

    const headers = {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }

    // 顯示訊息
    const showMessage = (text, type = 'success') => {
      message.value = text
      messageType.value = type
      setTimeout(() => {
        message.value = ''
        messageType.value = ''
      }, 3000)
    }

    // 新增獲取場地名稱的函數
    const fetchPlaceName = async () => {
      try {
        loading.value = true
        const response = await axios.get(
          `http://localhost:8080/api/venues/${venueId.value}`,
          { headers }
        )
        placeName.value = response.data.venueName // 假設 API 返回的場地數據中有 name 欄位
      } catch (error) {
        console.error('Failed to fetch place name:', error)
        showMessage('無法載入場地資訊，請稍後再試', 'error')
      } finally {
        loading.value = false
      }
    }

    // 獲取預約資料
    const fetchReservations = async () => {
      try {
        loading.value = true
        const response = await axios.get(
          `http://localhost:8080/api/reservations/venue/${venueId.value}`,
          { headers }
        )
        // 轉換資料格式
        reservations.value = response.data.map(reservation => ({
          date: reservation.reservationDate,
          timePeriodId: reservation.timePeriodId,
          status: reservation.timePeriod_statusInfo.status,
          statusId: reservation.timePeriod_statusInfo.statusId
        }))
      } catch (error) {
        console.error('Failed to fetch reservations:', error)
        showMessage('無法載入預約資料，請稍後再試', 'error')
      } finally {
        loading.value = false
      }
    }

    // 獲取休館日資料
    const fetchCloseDates = async () => {
      try {
        loading.value = true
        const response = await axios.get(
          `http://localhost:8080/api/close-dates/venue/${venueId.value}`,
          { headers }
        )
        // 轉換資料格式
        closeDates.value = response.data.map(item => ({
          date: item.closeDate,
          status: item.status.status
        }))
      } catch (error) {
        console.error('Failed to fetch close dates:', error)
        showMessage('無法載入休館日資料，請稍後再試', 'error')
      } finally {
        loading.value = false
      }
    }

    // 處理日期選擇
    const handleDateSelect = (dateInfo) => {
    // 將日期格式轉換為 "MM月DD日" 的格式
    const date = new Date(dateInfo.date)
    const month = date.getMonth() + 1
    const day = date.getDate()
    selectedDate.value = `${month}月${day}日可租借時段`
    
    console.log('bookingDate:', dateInfo)
    router.push({
      name: 'TimeSelection',
      params: {
        id: venueId.value,
        date: dateInfo.date
      },
      query: route.query
    })
  }


    // 監聽路由參數變化
    watch(
      () => route.params.id,
      async (newId) => {
        if (newId) {
          venueId.value = newId
          await Promise.all([fetchReservations(), fetchCloseDates(), fetchPlaceName()])
        }
      }
    )

    // 組件掛載時獲取資料
    onMounted(async () => {
      if (venueId.value) {
        await Promise.all([fetchReservations(), fetchCloseDates(), fetchPlaceName()])
      } else {
        showMessage('找不到場地ID', 'error')
      }
    })

    return {
      venueId,
      reservations,
      closeDates,
      message,
      messageType,
      loading,
      handleDateSelect,
      placeName,
      selectedDate
    }
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "cardInfoView",  // 修改成實際的預約頁名稱
        params: { id: this.venueId }
      })
    },

    goNext() {
      this.$router.push({
        name: "BookingFormView",  // 修改成實際的預約頁名稱
        params: { id: this.venueId }
      })
    },

    handleSelectionChange({ totalHours, selectedSlots }) {
      console.log('總時數:', totalHours)
      console.log('已選時段:', selectedSlots)
    }
  }
}

</script>

<style scoped>
.selected-date-container {
  max-width: 1200px;
  /* 調大容器寬度以容納並排 */
  margin: 0 auto;
  padding: 20px 20px;
  display: flex;
  /* 使用 flex 來並排 */
  gap: 30px;
  /* 設定間距 */
}

.page-title {
  text-align: start;
  margin: 20px 15px;
  color: #333;
  font-size: 24px;
}

.calendar-wrapper {
  flex: 0 0 407px;
  /* 固定日曆寬度 */
}

.time-slot-wrapper {
  flex: 1;
  /* 讓時段選擇器填滿剩餘空間 */
}

.message {
  padding: 12px;
  border-radius: 4px;
  text-align: center;
  margin-top: 20px;
  animation: fadeIn 0.3s ease-in-out;
}

.message.success {
  background-color: #e6f4ea;
  color: #1e7e34;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 響應式設計 */
@media (max-width: 1023px) {
  .selected-date-container {
    flex-direction: column;
    /* 改為垂直排列 */
    align-items: center;
    padding: 10px;
  }

  .page-title {
    font-size: 1.5em;
    text-align: center;
  }

  .calendar-wrapper {
    width: 100%;
    max-width: 407px;
  }

  .time-slot-wrapper {
    width: 100%;
  }
}
</style>