<template>
    <div class="search-container">
      <div class="search-bar">
        <!-- District Field -->
        <div class="search-field">
          <label>行政區域</label>
          <input type="text" :placeholder="districtPlaceholder" readonly @click="toggleDropdown('district')">
          <div class="dropdown" id="district-dropdown" :class="{ active: activeDropdown === 'district' }">
            <div class="checkbox-group">
              <div v-for="district in districts" :key="district.id" class="checkbox-item">
                <input 
                  type="checkbox" 
                  :id="district.id" 
                  v-model="selectedDistricts"
                  :value="district.id"
                >
                <label :for="district.id">{{ district.name }}</label>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Venue Type Field -->
        <div class="search-field">
          <label>場地類型</label>
          <input type="text" :placeholder="venuePlaceholder" readonly @click="toggleDropdown('venue')">
          <div class="dropdown" id="venue-dropdown" :class="{ active: activeDropdown === 'venue' }">
            <div class="checkbox-group">
              <div v-for="venue in venueTypes" :key="venue.id" class="checkbox-item">
                <input 
                  type="checkbox" 
                  :id="venue.id" 
                  v-model="selectedVenues"
                  :value="venue.id"
                >
                <label :for="venue.id">{{ venue.name }}</label>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Date Field -->
        <div class="search-field">
          <label>預約日期</label>
          <input 
            type="text" 
            :value="selectedDate" 
            placeholder="請選擇" 
            readonly 
            @click="toggleDropdown('date')"
          >
          <div class="dropdown" id="date-dropdown" :class="{ active: activeDropdown === 'date' }">
            <div class="calendar-nav">
              <div class="calendar-nav-arrows">
                <button 
                  class="calendar-nav-arrow" 
                  :disabled="!canGoToPrevMonth" 
                  @click="changeMonth(-1)"
                >‹</button>
              </div>
              <div class="calendar-nav-title">
                <span>{{ currentYearMonth }}</span>
              </div>
              <div class="calendar-nav-arrows">
                <button 
                  class="calendar-nav-arrow" 
                  @click="changeMonth(1)"
                >›</button>
              </div>
            </div>
            <div class="calendar-header">
              <div v-for="day in weekDays" :key="day">{{ day }}</div>
            </div>
            <div class="calendar">
              <div 
                v-for="day in calendarDays" 
                :key="day.date"
                class="calendar-day"
                :class="{
                  'selectable': day.selectable,
                  'disabled': !day.selectable
                }"
                @click="day.selectable && selectDate(day.date)"
              >
                {{ day.dayNumber }}
              </div>
            </div>
          </div>
        </div>
  
        <!-- Capacity Field -->
        <div class="search-field">
          <label>容納人數</label>
          <input 
            type="text" 
            :value="selectedCapacity" 
            placeholder="請選擇" 
            readonly 
            @click="toggleDropdown('capacity')"
          >
          <div class="dropdown" id="capacity-dropdown" :class="{ active: activeDropdown === 'capacity' }">
            <div class="capacity-buttons">
              <button 
                v-for="capacity in capacityRanges" 
                :key="capacity"
                type="button"
                :class="{ selected: selectedCapacity === capacity }"
                @click="selectCapacity(capacity)"
              >
                {{ capacity }}
              </button>
            </div>
          </div>
        </div>
  
        <!-- Search Button -->
        <button class="search-button" @click="search">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Search',
    data() {
      return {
        activeDropdown: null,
        selectedDistricts: [],
        selectedVenues: [],
        selectedDate: '',
        selectedCapacity: '',
        currentDate: new Date(),
        districts: [
          { id: 'central', name: '中區' },
          { id: 'east', name: '東區' },
          { id: 'south', name: '南區' },
          { id: 'west', name: '西區' },
          { id: 'north', name: '北區' },
          { id: 'xitun', name: '西屯區' },
          { id: 'nantun', name: '南屯區' },
          { id: 'beitun', name: '北屯區' },
          { id: 'fengyuan', name: '豐原區' },
          { id: 'dongshi', name: '東勢區' },
          { id: 'dali', name: '大里區' },
          { id: 'qingshui', name: '清水區' }
        ],
        venueTypes: [
          { id: 'meeting', name: '會議室' },
          { id: 'activity', name: '活動中心' },
          { id: 'playground', name: '運動場地' },
          { id: 'classroom', name: '教室' }
        ],
        capacityRanges: [
          '1~10人',
          '11~30人',
          '31~50人',
          '51~100人',
          '101~200人',
          '200人以上'
        ],
        weekDays: ['日', '一', '二', '三', '四', '五', '六']
      }
    },
    computed: {
      districtPlaceholder() {
        return this.selectedDistricts.length ? `(${this.selectedDistricts.length})` : '請選擇'
      },
      venuePlaceholder() {
        return this.selectedVenues.length ? `(${this.selectedVenues.length})` : '請選擇'
      },
      currentYearMonth() {
        return `${this.currentDate.getFullYear()}年 ${this.currentDate.getMonth() + 1}月`
      },
      canGoToPrevMonth() {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const prevMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1)
        return prevMonth.getMonth() === today.getMonth() && prevMonth.getFullYear() === today.getFullYear()
      },
      calendarDays() {
        const days = []
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1)
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
  
        // Add empty slots for days before the first day of the month
        for (let i = 0; i < firstDay.getDay(); i++) {
          days.push({ date: null, dayNumber: '', selectable: false })
        }
  
        // Add the days of the month
        for (let i = 1; i <= lastDay.getDate(); i++) {
          const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i)
          days.push({
            date: date,
            dayNumber: i,
            selectable: date >= today
          })
        }
  
        return days
      }
    },
    methods: {
      toggleDropdown(type) {
        this.activeDropdown = this.activeDropdown === type ? null : type
      },
      changeMonth(delta) {
        const newDate = new Date(this.currentDate)
        newDate.setMonth(newDate.getMonth() + delta)
        this.currentDate = newDate
      },
      selectDate(date) {
        if (!date) return
        this.selectedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        this.activeDropdown = null
      },
      selectCapacity(capacity) {
        this.selectedCapacity = capacity
        this.activeDropdown = null
      },
      // search() {
      //   // Emit search event with all selected values
      //   this.$emit('search', {
      //     districts: this.selectedDistricts,
      //     venues: this.selectedVenues,
      //     date: this.selectedDate,
      //     capacity: this.selectedCapacity
      //   })
      // }
      search() {
      // 處理區域選擇
      const selectedDistrictNames = this.selectedDistricts.map(id => {
        const district = this.districts.find(d => d.id === id);
        return district ? district.name : '';
      }).filter(name => name);

      // 處理場地類型選擇
      const selectedVenueNames = this.selectedVenues.map(id => {
        const venue = this.venueTypes.find(v => v.id === id);
        return venue ? venue.name : '';
      }).filter(name => name);

      // 組合搜尋條件
      const searchQuery = {
        districts: selectedDistrictNames.length ? selectedDistrictNames.join(',') : null,
        venues: selectedVenueNames.length ? selectedVenueNames.join(',') : null,
        date: this.selectedDate || null,
        capacity: this.selectedCapacity || null
      };

      // 移除空值
      const cleanQuery = Object.fromEntries(
        Object.entries(searchQuery).filter(([_, value]) => value != null)
      );

      // 使用 Vue Router 導航
      this.$router.push({
        name: 'cardView',
        query: cleanQuery
      }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    }
    },
    mounted() {
      // Close dropdowns when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.$el.contains(e.target)) {
          this.activeDropdown = null
        }
      })
    },
    beforeDestroy() {
      document.removeEventListener('click', this.closeDropdowns)
    }
  }
  </script>

<style scoped>
/* 通用樣式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 搜尋容器樣式 */
.search-container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 0 20px;
    position: relative;
}

.search-bar {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 50px;
    padding: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 搜尋欄位樣式 */
.search-field {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    border-right: 1px solid #eee;
    position: relative;
    align-items: center;
}

.search-field:last-of-type {
    border-right: none;
}

.search-field label {
    font-size: 15px;
    color: #333;
    margin-bottom: 8px;
    text-align: center;
    white-space: nowrap;
}

.search-field input {
    border: none;
    outline: none;
    font-size: 19px;
    color: #666;
    width: 100%;
    cursor: pointer;
    background: transparent;
    text-align: center;
    white-space: nowrap;
}

.search-field input::placeholder {
    color: #ccc;
}

.search-field input:hover {
    cursor: pointer;
}

/* 按鈕樣式 */
.search-button {
    background: #ffc107;
    border: none;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-left: 10px;
}

.search-icon {
    width: 20px;
    height: 20px;
    color: white;
}

/* 下拉選單樣式 */
.dropdown {
    position: absolute;
    top: 105%;
    left: 0%;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
    padding: 15px;
    display: none;
    z-index: 1000;
    min-width: max-content;
    white-space: nowrap;
}

.dropdown.active {
    display: block;
}

/* 各下拉選單寬度 */
#district-dropdown {
    width: 500px;
}

#venue-dropdown {
    width: 170px;
}

#date-dropdown {
    width: 280px;
}

#capacity-dropdown {
    width: 200px;
}

/* 多選選單樣式 */
.checkbox-group {
    display: grid;
    gap: 12px;
}

#district-dropdown .checkbox-group {
    grid-template-columns: repeat(5, 1fr);
}

#venue-dropdown .checkbox-group {
    grid-template-columns: 1fr;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
}

.checkbox-item input[type="checkbox"] {
    width: 16px;
    height: 16px;
}

.checkbox-item label {
    font-size: 15px;
    margin: 0;
    cursor: pointer;
}

/* 容納人數按鈕樣式 */
.capacity-buttons {
    display: grid;
    gap: 8px;
    padding: 8px;
}

.capacity-buttons button {
    font-size: 15px;
    width: 100%;
    padding: 2px 14px;
    border: 1px solid #ffffff;
    border-radius: 4px;
    background: white;
    color: #374151;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
}

.capacity-buttons button:hover {
    background: #ecf2ff;
}

.capacity-buttons button.selected {
    background: #ecf2ff;
    border-color: #3b82f6;
    color: #3b82f6;
}

/* 日曆樣式 */
.calendar-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.calendar-nav-title {
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 5px;
}

.calendar-nav-arrows {
    display: flex;
    gap: 15px;
}

.calendar-nav-arrow {
    cursor: pointer;
    padding: 5px;
    border: none;
    background: none;
    font-size: 18px;
    color: #666;
}

.calendar-nav-arrow:hover {
    color: #333;
}

.calendar-nav-arrow:disabled {
    cursor: not-allowed;
    opacity: 0.3;
}

.calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 40px);
    gap: 8px;
    padding: 0 10px;
    font-size: 14px;
}

.calendar-header>div {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.calendar {
    display: grid;
    grid-template-columns: repeat(7, 40px);
    gap: 8px;
    padding: 10px;
}

.calendar-day {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
}

.calendar-day:hover {
    background: #ecf2ff;
    border-radius: 100%;
}

.calendar-day.selectable:hover {
    background-color: #ecf2ff;
    border-radius: 50%;
    cursor: pointer;
}

.calendar-day.disabled {
    opacity: 0.3;
    cursor: not-allowed;
}
</style>