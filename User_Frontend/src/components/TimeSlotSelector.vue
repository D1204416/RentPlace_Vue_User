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
    // 新增已預約時段的 prop
    reservedTimeSlots: {
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
            { id: 'morning-1', time: '07:00-08:00', selected: false, disabled: false },
            { id: 'morning-2', time: '08:00-09:00', selected: false, disabled: false },
            { id: 'morning-3', time: '09:00-10:00', selected: false, disabled: false },
            { id: 'morning-4', time: '10:00-11:00', selected: false, disabled: false },
            { id: 'morning-5', time: '11:00-12:00', selected: false, disabled: false }
          ]
        },
        {
          title: '下午',
          slots: [
            { id: 'afternoon-1', time: '12:00-13:00', selected: false, disabled: false },
            { id: 'afternoon-2', time: '13:00-14:00', selected: false, disabled: false },
            { id: 'afternoon-3', time: '14:00-15:00', selected: false, disabled: false },
            { id: 'afternoon-4', time: '15:00-16:00', selected: false, disabled: false },
            { id: 'afternoon-5', time: '16:00-17:00', selected: false, disabled: false }
          ]
        },
        {
          title: '晚上',
          slots: [
            { id: 'evening-1', time: '17:00-18:00', selected: false, disabled: false },
            { id: 'evening-2', time: '18:00-19:00', selected: false, disabled: false },
            { id: 'evening-3', time: '19:00-20:00', selected: false, disabled: false },
            { id: 'evening-4', time: '20:00-21:00', selected: false, disabled: false },
            { id: 'evening-5', time: '21:00-22:00', selected: false, disabled: false }
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
        if (newDate !== '尚未選擇租借日期') {
          // 如果有選擇日期，優先使用新的日期
          this.formattedDate = newDate
          // 重置時段選擇
          this.resetTimeSlots()
        }
      }
    }
  },

  methods: {
    // 檢查時段是否已被預約
    isSlotReserved(slotTime) {
      return this.reservedTimeSlots.includes(slotTime)
    },

    // 初始化時段狀態
    initializeTimeSlots() {
      console.log('Reserved slots:', this.reservedTimeSlots) // 調試用
      this.sections.forEach(section => {
        section.slots.forEach(slot => {
          // 檢查該時段是否被預約
          slot.disabled = this.isSlotReserved(slot.time)
          if (slot.disabled) {
            slot.selected = false
          }
        })
      })
    },

    updateTotalHours() {
      this.totalHours = this.sections.reduce((total, section) => {
        return total + section.slots.filter(slot => slot.selected).length
      }, 0)

      this.$emit('selection-change', {
        totalHours: this.totalHours,
        selectedSlots: this.getSelectedSlots()
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

    resetTimeSlots() {
      this.sections.forEach(section => {
        section.slots.forEach(slot => {
          slot.selected = false
          slot.disabled = this.isSlotReserved(slot.time)
        })
      })
      this.totalHours = 0
      this.$emit('selection-change', {
        totalHours: 0,
        selectedSlots: []
      })
    }
  },

  watch: {
    // 監聽預約時段變化
    reservedTimeSlots: {
      immediate: true,
      handler() {
        this.initializeTimeSlots()
      }
    },

    // 監聽日期變化
    date(newDate) {
      if (newDate !== '尚未選擇租借日期') {
        this.resetTimeSlots()
      }
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