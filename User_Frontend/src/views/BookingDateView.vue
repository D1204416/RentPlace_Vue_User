<!-- src/views/BookingDate.vue -->
<template>
  <progress-steps :current-step="1" />

  <div class="selected-date-container">

    <div class="calendar-wrapper">
      <Calendar :venue-id="venueId" :reservations="reservations" :close-dates="closeDates" :initial-date="$route.query.date"
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

  created() {

    console.log('Route object:', this.$route)
    console.log('Route params:', this.$route.params)
    console.log('Route query:', this.$route.query)

    // 保存進入頁面時的查詢參數
    this.originalQuery = { ...this.$route.query }
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

        // 檢查回傳資料
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid response data format')
        }

        // 依日期分組預約資料
        const reservationsByDate = response.data.reduce((acc, reservation) => {
          const date = reservation.reservationDate
          if (!acc[date]) {
            acc[date] = {
              isCountBased: false, // 預設為非計次預約
              timeSlots: []
            }
          }

          // 檢查是否為計次預約
          if (reservation.timePeriod.timePeriodId === 16) {
            acc[date].isCountBased = true
          } else {
            acc[date].timeSlots.push(reservation.timePeriod.timePeriod)
          }

          return acc
        }, {})

        // 從第一筆資料中取得場地可預約時段
        const availableTime = response.data[0]?.venue?.availableTime
        if (!availableTime) {
          throw new Error('Missing venue available time')
        }

        // 解析可預約時段
        const [startTime, endTime] = availableTime.split('-')
        const startHour = parseInt(startTime.split(':')[0])
        const endHour = parseInt(endTime.split(':')[0])

        // 產生所有可預約的時段
        const availableTimeSlots = []
        for (let hour = startHour; hour < endHour; hour++) {
          availableTimeSlots.push(
            `${String(hour).padStart(2, '0')}:00-${String(hour + 1).padStart(2, '0')}:00`
          )
        }

        // 整理最終資料
        reservations.value = Object.entries(reservationsByDate).map(([date, dateInfo]) => {
          // 如果是計次預約，直接標記為不可預約
          if (dateInfo.isCountBased) {
            return {
              date: date,
              timePeriodId: 16,
              status: '不可預約',
              statusId: 4
            }
          }

          // 非計次預約則檢查時段
          const isFullyBooked = availableTimeSlots.every(timeSlot =>
            dateInfo.timeSlots.includes(timeSlot)
          )

          return {
            date: date,
            timePeriodId: null,
            status: isFullyBooked ? '不可預約' : '可預約',
            statusId: isFullyBooked ? 4 : 1
          }
        })

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
      selectedDate,
      originalQuery: null,
    }
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "cardInfoView",  // 修改成實際的預約頁名稱
        params: { id: this.venueId },
        query: this.originalQuery
      })
    },

    goNext() {
      this.$router.push({
        name: "BookingFormView",  // 修改成實際的預約頁名稱
        params: { id: this.venueId },
        query: this.originalQuery
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