<!-- src/components/Calendar.vue -->
<template>
  <div class="calendar-container">
    <!-- 日曆標題和月份導航 -->
    <div class="calendar-header">
      <button @click="previousMonth" class="nav-btn" :disabled="isPreviousMonthDisabled"
        :class="{ 'nav-btn-disabled': isPreviousMonthDisabled }">
        <span>&lt;</span>
      </button>
      <h2 class="month-title">{{ currentYear }}年 {{ currentMonth + 1 }}月</h2>
      <button @click="nextMonth" class="nav-btn">
        <span>&gt;</span>
      </button>
    </div>
    <hr>


    <!-- 載入狀態 -->
    <div v-if="loading" class="loading-state">
      <span class="loading-text">載入中...</span>
    </div>

    <!-- 日曆主體 -->
    <div v-else>
      <!-- 星期標題列 -->
      <div class="calendar-grid">
        <div v-for="day in weekDays" :key="day" class="calendar-cell weekday">
          {{ day }}

        </div>

        <!-- 日期格子 -->
        <div v-for="(day, index) in calendarDays" :key="index" :class="[
          'calendar-cell',
          'day',
          { 'past-day': day.isPast },  // 過去日期class
          { 'next-month': !day.currentMonth && !day.isPast },  // 下個月的日期class
          { 'fully-booked': day.status === 'fully-booked' },
          { 'closed': day.status === 'closed' },
          { 'selected': day.status === 'selected' }
        ]" @click="selectDate(day)">
          {{ day.date.getDate() }}
          <div v-if="day.status" class="status-indicator"></div>
        </div>
      </div>

      <!-- 狀態說明 -->
      <div class="calendar-legend">
        <div class="legend-item">
          <div class="status-dot fully-booked"></div>
          <span>不可預約</span>
        </div>
        <div class="legend-item">
          <div class="status-dot closed"></div>
          <span>休館日</span>
        </div>
        <div class="legend-item">
          <div class="status-dot selected"></div>
          <span>您預約的日期</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'

export default {
  name: 'Calendar',

  props: {
    venueId: {
      type: [String, Number],
      required: true
    },
    reservations: {
      type: Array,
      default: () => []
    },
    closeDates: {
      type: Array,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const currentDate = ref(new Date())
    const currentMonth = ref(currentDate.value.getMonth())
    const currentYear = ref(currentDate.value.getFullYear())
    const weekDays = ref(['日', '一', '二', '三', '四', '五', '六'])
    const loading = ref(false)

    // 新增: 檢查是否禁用上個月按鈕
    const isPreviousMonthDisabled = computed(() => {
      const today = new Date()
      const currentNavigationDate = new Date(currentYear.value, currentMonth.value - 1)
      const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      return currentNavigationDate < firstDayOfCurrentMonth
    })

    // 新增: 格式化日期函數
    const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    // 修改: 檢查日期狀態
    const getDateStatus = (date) => {
      const dateString = formatDate(date)

      // 如果是用戶選中的日期，返回 'selected'
      if (dateString === selectedDate.value) {
        return 'selected'
      }

      // 檢查是否為休館日
      const isClosedDate = props.closeDates.some(
        closeDate => closeDate.date === dateString
      )
      if (isClosedDate) return 'closed'

      // 檢查預約狀態
      const dayReservations = props.reservations.filter(
        reservation => reservation.date === dateString
      )

      if (dayReservations.length > 0) {
        // 檢查是否所有時段都不可預約
        if (dayReservations.every(res => res.status === '不可預約')) {
          return 'fully-booked'
        }

      }

      return null
    }
    // 計算日曆天數
    const calendarDays = computed(() => {
      const days = []
      const firstDay = new Date(currentYear.value, currentMonth.value, 1)
      const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // 添加上個月的天數
      const firstDayOfWeek = firstDay.getDay()
      for (let i = firstDayOfWeek; i > 0; i--) {
        const date = new Date(currentYear.value, currentMonth.value, 1 - i)
        days.push({
          date,
          currentMonth: false,
          status: getDateStatus(date),
          isPast: date < today // 過去日期標記
        })
      }

      // 添加當月的天數
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(currentYear.value, currentMonth.value, i)
        days.push({
          date,
          currentMonth: true,
          status: getDateStatus(date),
          isPast: date < today
        })
      }



      // 添加下個月的天數
      const remainingDays = 35 - days.length  // 改為 35 (5 x 7)
      if (remainingDays > 0) {  // 只在需要時添加
        for (let i = 1; i <= remainingDays; i++) {
          const date = new Date(currentYear.value, currentMonth.value + 1, i)
          days.push({
            date,
            currentMonth: false,
            status: getDateStatus(date),
            isPast: date < today
          })
        }
      }

      return days
    })

    // 新增選中日期的 ref
    const selectedDate = ref(null)

    // 選擇日期
    const selectDate = (day) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // 檢查是否為過去日期或非當月日期
      if (day.isPast || !day.currentMonth ||
        day.status === 'fully-booked' ||
        day.status === 'closed') {
        return
      }

      const dateString = formatDate(day.date)
      selectedDate.value = dateString
      emit('date-selected', {
        date: dateString,
        status: day.status
      })
    }

    // 上個月
    const previousMonth = () => {
      // 獲取當前日期的年月
      const today = new Date()
      const currentNavigationDate = new Date(currentYear.value, currentMonth.value - 1)
      const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1)

      // 如果上個月會早於當前月份，則不允許切換
      if (currentNavigationDate < firstDayOfCurrentMonth) {
        return
      }

      if (currentMonth.value === 0) {
        currentMonth.value = 11
        currentYear.value--
      } else {
        currentMonth.value--
      }
    }

    // 下個月
    const nextMonth = () => {
      if (currentMonth.value === 11) {
        currentMonth.value = 0
        currentYear.value++
      } else {
        currentMonth.value++
      }
    }

    // 監聽資料變化
    watch([() => props.reservations, () => props.closeDates], () => {
      loading.value = false
    })

    const initializeCalendar = () => {
      const today = new Date()
      currentDate.value = today
      currentMonth.value = today.getMonth()
      currentYear.value = today.getFullYear()
    }

    // 組件掛載
    onMounted(() => {
      initializeCalendar()
      loading.value = true
    })

    return {
      currentDate,
      currentMonth,
      currentYear,
      weekDays,
      calendarDays,
      loading,
      selectDate,
      previousMonth,
      nextMonth,
      isPreviousMonthDisabled
    }
  }
}
</script>

<style scoped>
.calendar-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 407px;
  margin: 0 auto;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.month-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
}

.nav-btn {
  background: #ffffff;
  font-size: 20px;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-btn:hover {
  background: #ECF2FF;
  color: #2F80ED;
}

.nav-btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #ccc;
}

.nav-btn-disabled:hover {
  background: #ffffff;
  color: #ccc;
  cursor: not-allowed;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 20px;
}

.calendar-cell {
  text-align: center;
  padding: 8px;
  border-radius: 100%;
  position: relative;
  width: 40px;
  height: 40px;
}

.weekday {
  font-weight: 600;
  color: #666;
}

.day {
  cursor: pointer;
  transition: background-color 0.2s;
}

.day:hover:not(.past-day):not(.next-month):not(.fully-booked):not(.closed):not(.selected) {
  background: #ECF2FF;
  color: #2F80ED;
}

.past-day {
  color: #ccc;  /* 過去日期用灰色 */
  cursor: default;
}

.next-month {
  color: #fff;  /* 下個月日期用白色 */
  cursor: default;
}

.fully-booked {
  background-color: #ff9999;
  color: white;
  cursor: not-allowed;
}

.closed {
  background-color: #666666;
  color: white;
  cursor: not-allowed;
}

.selected {
  background-color: #66b3ff;
  color: white;
}

.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

.status-dot.fully-booked {
  background-color: #ff9999;
}

.status-dot.closed {
  background-color: #666666;
}

.status-dot.selected {
  background-color: #66b3ff;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.loading-text {
  display: inline-block;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.6;
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .calendar-container {
    padding: 10px;
  }

  .month-title {
    font-size: 1.2rem;
  }

  .calendar-cell {
    padding: 8px 4px;
    font-size: 0.9rem;
  }

  .calendar-legend {
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>