<!-- src/views/BookingDate.vue -->
<template>
    <div class="selected-date-container">
      <h1 class="page-title">選擇預約日期</h1>
      
      <div class="calendar-wrapper">
        <Calendar 
          :venue-id="venueId"
          :reservations="reservations"
          :close-dates="closeDates"
          @date-selected="handleDateSelect"
        />
      </div>
  
      <!-- 狀態提示訊息 -->
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>
  </template>
  
  <script>
  import Calendar from '@/components/Calendar.vue'
  import { ref, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'
  
  export default {
    name: 'bookingDate',
    components: {
      Calendar
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
            status: reservation.statusInfo.status,
            statusId: reservation.statusInfo.statusId
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
        console.log('bookingDate:', dateInfo)
        // 如果日期已被選擇，導航到時段選擇頁面
        router.push({
          name: 'TimeSelection',
          params: {
            id: venueId.value,
            date: dateInfo.date
          },
          query: route.query // 保留原有的查詢參數
        })
      }
  
      // 監聽路由參數變化
      watch(
        () => route.params.id,
        async (newId) => {
          if (newId) {
            venueId.value = newId
            await Promise.all([fetchReservations(), fetchCloseDates()])
          }
        }
      )
  
      // 組件掛載時獲取資料
      onMounted(async () => {
        if (venueId.value) {
          await Promise.all([fetchReservations(), fetchCloseDates()])
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
        handleDateSelect
      }
    }
  }
  </script>
  
  <style scoped>
  .selected-date-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .page-title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    font-size: 24px;
  }
  
  .calendar-wrapper {
    margin-bottom: 20px;
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
  @media (max-width: 768px) {
    .selected-date-container {
      padding: 10px;
    }
    
    .page-title {
      font-size: 1.5em;
    }
  }
  </style>