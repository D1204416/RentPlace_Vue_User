<!-- src/views/BookingDate.vue -->
<template>
  <progress-steps :current-step="1" />

  <div class="selected-date-container">

    <!-- 日曆 -->
    <div class="calendar-wrapper">
      <Calendar :venue-id="venueId" :reservations="reservations" :close-dates="closeDates"
        :initial-date="selectedDateValue" @date-selected="handleDateSelect" />
    </div>

    <!-- 時段選擇 -->
    <div class="time-slot-wrapper">
      <h3 class="page-title">{{ placeName }}</h3>
      <TimeSlotSelector :date="selectedDate" :initial-date="$route.query.date"
        :reserved-time-slots="selectedDateReservations" :initial-selected-slots="selectedTimeData?.selectedSlots || []"
        @selection-change="handleSelectionChange" />
    </div>

    <!-- 狀態提示訊息 -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>

  <!-- 按鈕組 -->
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
    const venueType = ref('')
    const selectedDate = ref('尚未選擇租借日期') // 儲存選中的日期
    const selectedDateReservations = ref([])  // 初始為空陣列
    const selectedDateValue = ref('') // 儲存原始日期格式 YYYY-MM-DD
    const selectedTimeData = ref(null)
    const originalQuery = ref({ ...route.query })
    const unitPrice = ref(0)

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

    // 新增一個格式化日期的輔助函數
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
        venueType.value = response.data.venueType
        unitPrice.value = response.data.unitPrice

      } catch (error) {
        console.error('Failed to fetch place name:', error)
        // showMessage('無法載入場地資訊，請稍後再試', 'error')
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

        // 整理預約資料，按日期分組並儲存時段
        const reservationsByDate = response.data.reduce((acc, reservation) => {
          const date = reservation.reservationDate
          if (!acc[date]) {
            acc[date] = []
          }
          acc[date].push(reservation.timePeriodText)
          return acc
        }, {})

        reservations.value = Object.keys(reservationsByDate).map(date => ({
          date: date,
          timeSlots: reservationsByDate[date]
        }))

      } catch (error) {
        console.error('Failed to fetch reservations:', error)
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
        // showMessage('無法載入休館日資料，請稍後再試', 'error')
      } finally {
        loading.value = false
      }
    }

    // 處理日期選擇
    const handleDateSelect = (dateInfo) => {
      // 將日期格式轉換為 "MM月DD日" 的格式
      const date = new Date(dateInfo.date);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  selectedDate.value = `${month}月${day}日可租借時段`;
  selectedDateValue.value = formatDate(dateInfo.date); // 使用 formatDate 函數

  const dateReservations = reservations.value.find(r => r.date === formatDate(dateInfo.date));
  const reservedTimeSlots = dateReservations ? dateReservations.timeSlots : [];

      // console.log('Selected date reserved slots:', reservedTimeSlots)
      // console.log('bookingDate:', dateInfo)

      selectedDateReservations.value = reservedTimeSlots;
    }

    // 處理時段選擇的函數
    const handleSelectionChange = (data) => {
      // console.log('Time slots changed:', data)
      // console.log('總時數:', data.totalHours)
      console.log('已選時段:', data.selectedSlots)
      selectedTimeData.value = data
    }

    // 返回上一頁
    const goBack = () => {
      // 清空 localStorage 中的 bookingData
      localStorage.removeItem('bookingData')
      
      router.push({
        name: "cardInfoView",
        params: { id: venueId.value },
        query: originalQuery.value
      })
    }

    // 前往下一頁
    const goNext = () => {
      // console.log('Checking conditions:', {
      //   selectedDate: selectedDate.value,
      //   selectedTimeData: selectedTimeData.value,
      //   selectedSlots: selectedTimeData.value?.selectedSlots
      // })

      // 檢查是否有選擇日期和時段
      if (selectedDateValue.value === '') {
        showMessage('請選擇預約日期', 'error')
        return
      }

      // 從 TimeSlotSelector 傳來的時段資料
      const selectedTimeSlots = selectedTimeData.value?.selectedSlots || []
      if (selectedTimeSlots.length === 0) {
        showMessage('請選擇預約時段', 'error')
        return
      }

      // 計算總金額
    const totalHours = selectedTimeData.value?.totalHours || 0
    const totalAmount = totalHours * unitPrice.value

      // 準備要儲存的預約資料
      const dateTimeData = {
        venueId: venueId.value,
        venueType: venueType.value,
        reservationDate: selectedDateValue.value, // 原始日期值 (YYYY-MM-DD)
        timeSlots: selectedTimeSlots,
        totalHours: selectedTimeData.value?.totalHours || 0,
        unitPrice: unitPrice.value,
        totalAmount: totalAmount
      }

      // 儲存到 localStorage
      try {
        // 讀取現有的預約資料（如果有的話）
        const existingData = localStorage.getItem('bookingData')
        const bookingData = existingData ? JSON.parse(existingData) : {}

        // 合併新的日期和時段資料
        const updatedBookingData = {
          ...bookingData,           // 保留其他可能已存在的資料
          ...dateTimeData,          // 更新日期和時段資料
          lastUpdated: new Date()   // 可選：記錄最後更新時間
        }

        localStorage.setItem('bookingData', JSON.stringify(updatedBookingData))

        // 導航到指定頁
        router.push({
          name: "BookingFormView",
          params: { id: venueId.value },
          query: originalQuery.value
        })
      } catch (error) {
        console.error('Failed to save booking data:', error)
        showMessage('儲存預約資料失敗', 'error')
      }
    }

    // 從 localStorage 恢復預約數據的函數
    const restoreBookingData = () => {
      try {
        const savedData = localStorage.getItem('bookingData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log('Restored data:', parsedData);

          // 如果有保存的日期，恢復日期顯示
          if (parsedData.reservationDate) {
        const date = new Date(parsedData.reservationDate);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        selectedDate.value = `${month}月${day}日可租借時段`;
        selectedDateValue.value = formatDate(parsedData.reservationDate); // 使用 formatDate 函數

            // 恢復時段選擇
            if (parsedData.timeSlots && Array.isArray(parsedData.timeSlots)) {
          selectedTimeData.value = {
            selectedSlots: parsedData.timeSlots,
            totalHours: parsedData.totalHours || parsedData.timeSlots.length
          };
        }

            // 觸發日期選擇的處理函數來加載該日期的預約情況
            handleDateSelect({
          date: parsedData.reservationDate
        });
          }

          // 恢復場地名稱等其他數據
          if (parsedData.venueName) {
        placeName.value = parsedData.venueName;
      }
      if (parsedData.venueType) {
        venueType.value = parsedData.venueType;
      }
        }
      } catch (error) {
        console.error('Failed to restore booking data:', error)
      }
    }

    // 監聽已選擇日期的預約數據
    watch(selectedDateValue, async (newDate) => {
      if (newDate) {
        const dateReservations = reservations.value.find(r => r.date === newDate)
        selectedDateReservations.value = dateReservations ? dateReservations.timeSlots : []
      }
    })


    // 組件掛載時獲取數據
    onMounted(async () => {
      if (venueId.value) {
        await Promise.all([fetchReservations(), fetchCloseDates(), fetchPlaceName()])

        // 先嘗試從 localStorage 恢復數據
        restoreBookingData()

        // 如果 URL 有日期參數且沒有 localStorage 數據，則使用 URL 日期
        if (route.query.date && !selectedDateValue.value) {
          const date = new Date(route.query.date)
          const month = date.getMonth() + 1
          const day = date.getDate()
          selectedDate.value = `${month}月${day}日可租借時段`
          selectedDateValue.value = route.query.date
        }
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
      showMessage,
      loading,
      handleDateSelect,
      placeName,
      selectedDate,
      selectedDateValue,
      selectedTimeData,
      selectedDateReservations,
      originalQuery,
      handleSelectionChange,
      goBack,
      goNext,
      restoreBookingData,
      unitPrice,
    }
  },

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

/* .message {
  padding: 12px;
  border-radius: 4px;
  text-align: center;
  margin-top: 20px;
  animation: fadeIn 0.3s ease-in-out;
} */
.message {
  position: fixed;
  top: 310px;
  left: 50%;
  transform: translateX(-50%);
  padding: 25px 100px;
  border-radius: 4px;
  z-index: 1000;
  font-size: 18px;
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