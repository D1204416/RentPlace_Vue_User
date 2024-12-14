<template>
  <div class="time-slot-selector">
    <h1>{{ formattedDate }}</h1>

    <!-- <div class="time-slot">
      <input type="checkbox" :id="slot.id" v-model="slot.selected" :disabled="slot.disabled" @change="updateTotalHours">
      <label :for="slot.id" :class="{ 'disabled': slot.disabled }">
        {{ slot.time }}
      </label>
    </div> -->
    <div class="time-slots">
      <div v-for="section in sections" :key="section.title" class="time-section">
        <div class="time-section-header">{{ section.title }}</div>
        <!-- 修改這裡的 v-for -->
        <template v-for="(slot, index) in section.slots" :key="index">
          <div class="time-slot">
            <input type="checkbox" :id="`slot-${section.title}-${index}`" v-model="slot.selected"
              :disabled="slot.disabled" @change="updateTotalHours">
            <label :for="`slot-${section.title}-${index}`" :class="{ 'disabled': slot.disabled }">
              {{ slot.time }}
            </label>
          </div>
        </template>
      </div>
    </div>

    <div class="total-time">
      您選擇的時段總計：{{ totalHours }}小時
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeSlotSelector',

  props: {
    date: {
      type: String,
      default: '尚未選擇租借日期'
    },
    initialDate: {
      type: String,
      default: null
    },
    reservedTimeSlots: {
      type: Array,
      default: () => []
    },
    initialSelectedSlots: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      sections: [
        {
          title: '早上',
          slots: [
            { id: '1', time: '07:00-08:00', selected: false, disabled: false },
            { id: '2', time: '08:00-09:00', selected: false, disabled: false },
            { id: '3', time: '09:00-10:00', selected: false, disabled: false },
            { id: '4', time: '10:00-11:00', selected: false, disabled: false },
            { id: '5', time: '11:00-12:00', selected: false, disabled: false }
          ]
        },
        {
          title: '下午',
          slots: [
            { id: '6', time: '12:00-13:00', selected: false, disabled: false },
            { id: '7', time: '13:00-14:00', selected: false, disabled: false },
            { id: '8', time: '14:00-15:00', selected: false, disabled: false },
            { id: '9', time: '15:00-16:00', selected: false, disabled: false },
            { id: '10', time: '16:00-17:00', selected: false, disabled: false }
          ]
        },
        {
          title: '晚上',
          slots: [
            { id: '11', time: '17:00-18:00', selected: false, disabled: false },
            { id: '12', time: '18:00-19:00', selected: false, disabled: false },
            { id: '13', time: '19:00-20:00', selected: false, disabled: false },
            { id: '14', time: '20:00-21:00', selected: false, disabled: false },
            { id: '15', time: '21:00-22:00', selected: false, disabled: false }
          ]
        }
      ],
      totalHours: 0
    }
  },

  watch: {
    date: {
      immediate: true,
      handler(newDate) {
        // 當 date 改變時，更新顯示
        if (newDate && newDate !== '尚未選擇租借日期') {
          this.initializeTimeSlots()
        }
      }
    },

    // 監聽預約時段變化
    reservedTimeSlots: {
      immediate: true,
      handler() {
        this.initializeTimeSlots()
      }
    },

    initialSelectedSlots: {
      immediate: true,
      deep: true,
      handler(newValue) {
        console.log('Initial slots changed:', newValue)
        if (newValue && newValue.length > 0) {
          this.initializeTimeSlots()
        }
      }
    },

    // 監聽日期變化
    date(newDate) {
      if (newDate !== '尚未選擇租借日期') {
        this.resetTimeSlots()
      }
    }
  },

  methods: {
    // 檢查時段是否已被預約
    isSlotReserved(slotTime) {
      return this.reservedTimeSlots.includes(slotTime)
    },

    // 初始化時段狀態，包括恢復已選擇的時段
    initializeTimeSlots() {
      console.log('Initializing time slots with:', {
        initialSelectedSlots: this.initialSelectedSlots,
        date: this.date
      })

      this.sections.forEach(section => {
        section.slots.forEach(slot => {
          // 檢查是否被預約
          slot.disabled = this.isSlotReserved(slot.time)
          // 檢查是否在初始選中的時段中
          if (this.initialSelectedSlots && this.initialSelectedSlots.length > 0) {
            slot.selected = !slot.disabled && this.initialSelectedSlots.some(
              selectedSlot => selectedSlot.time === slot.time
            )
          }
        })
      })
      this.updateTotalHours()
    },

    updateTotalHours() {
      this.totalHours = this.sections.reduce((total, section) => {
        return total + section.slots.filter(slot => slot.selected).length
      }, 0)

      const selectedSlots = this.getSelectedSlots()
      this.$emit('selection-change', {
        totalHours: this.totalHours,
        selectedSlots: selectedSlots
      })
    },

    getSelectedSlots() {
      return this.sections.flatMap(section =>
        section.slots
          .filter(slot => slot.selected)
          .map(slot => ({
            time: slot.time,
            id: slot.id,
            section: section.title
          }))
      )
    },

    // 重置時段選擇，但保留初始選擇
    resetTimeSlots() {
      // 確保 initialSelectedSlots 是數組
      const selectedSlots = Array.isArray(this.initialSelectedSlots) ? this.initialSelectedSlots : []

      this.sections.forEach(section => {
        section.slots.forEach(slot => {
          slot.disabled = this.isSlotReserved(slot.time)
          // 在重置時也檢查初始選中狀態
          slot.selected = !slot.disabled && selectedSlots.some(
            selectedSlot => selectedSlot.time === slot.time
          )
        })
      })
      this.updateTotalHours()
    }
  },

  computed: {
    formattedDate() {
      if (this.date !== '尚未選擇租借日期') {
        return this.date
      }
      if (this.initialDate) {
        const date = new Date(this.initialDate)
        const month = date.getMonth() + 1
        const day = date.getDate()
        return `${month}月${day}日可租借時段`
      }
      return this.date
    }
  },

  created() {
    // 組件創建時初始化時段
    this.initializeTimeSlots()
  },

  mounted() {
    // 組件掛載時也初始化一次
    this.initializeTimeSlots()
  }

}
</script>

<style scoped>
.time-slot-selector {
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 800px;
  margin: 20px auto;
  padding: 0 16px;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

h1 {
  font-size: 1.2rem;
  margin-bottom: 24px;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
  width: 100%;
  /* 確保寬度撐滿 */
}

.time-section {
  background: rgb(249, 249, 249);
}

.time-section-header {
  background: #4b4b4b;
  color: white;
  padding: 8px 16px;
  text-align: center;
  border-radius: 4px;
  margin-bottom: 12px;
}

.time-slot {
  display: flex;
  align-items: center;
  padding: 8px 4px;
}

.time-slot input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  accent-color: #1a73e8;
  flex-shrink: 0;
}

.time-slot label {
  font-size: 0.95rem;
  line-height: 1.4;
}

.time-slot input[type="checkbox"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.time-slot input[type="checkbox"]:disabled+label {
  color: #999;
  cursor: not-allowed;
}

.time-slot label.disabled {
  color: #999;
  text-decoration: line-through;
}

.total-time {
  font-size: 1.2rem;
  padding: 16px 0;
}

@media screen and (max-width: 768px) {
  .time-slots {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 1.1rem;
  }
}

@media screen and (max-width: 480px) {
  .time-slots {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .time-slot-selector {
    padding: 0 12px;
  }

  h1 {
    font-size: 1rem;
    margin-bottom: 16px;
  }

  .time-slot {
    padding: 10px 0;
  }

  .time-slot label {
    font-size: 0.9rem;
  }

  .time-section-header {
    padding: 10px;
    margin-bottom: 8px;
  }
}

@media screen and (max-width: 320px) {
  .time-slot-selector {
    padding: 0 8px;
  }

  .time-slots {
    gap: 16px;
  }

  .time-slot {
    padding: 8px 0;
  }

  .time-slot input[type="checkbox"] {
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }
}
</style>