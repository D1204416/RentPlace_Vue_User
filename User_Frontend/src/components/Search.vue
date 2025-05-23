<template>
  <div class="search-container">
    <div class="search-bar">
      <!-- District Field -->
      <div class="search-field district-field" :class="{ 'hide-border': hoveredIndex === 1 }"
        @mouseenter="hoveredIndex = 0" @mouseleave="hoveredIndex = null">
        <label>行政區域</label>
        <input type="text" :placeholder="districtPlaceholder" readonly @click="toggleDropdown('district')">
        <div class="dropdown" id="district-dropdown" :class="{ active: activeDropdown === 'district' }">
          <div class="checkbox-group">
            <div v-for="district in districts" :key="district.id" class="checkbox-item">
              <input type="checkbox" :id="district.id" v-model="selectedDistricts" :value="district.id">
              <label :for="district.id">{{ district.name }}</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Venue Type Field -->
      <div class="search-field venue-field" :class="{ 'hide-border': hoveredIndex === 2 }"
        @mouseenter="hoveredIndex = 1" @mouseleave="hoveredIndex = null">
        <label>場地類型</label>
        <input type="text" :placeholder="venuePlaceholder" readonly @click="toggleDropdown('venue')">
        <div class="dropdown" id="venue-dropdown" :class="{ active: activeDropdown === 'venue' }">
          <div class="checkbox-group">
            <div v-for="venue in venueTypes" :key="venue.id" class="checkbox-item">
              <input type="checkbox" :id="venue.id" v-model="selectedVenues" :value="venue.id">
              <label :for="venue.id">{{ venue.name }}</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Date Field -->
      <div class="search-field date-field" :class="{ 'hide-border': hoveredIndex === 3 }" @mouseenter="hoveredIndex = 2"
        @mouseleave="hoveredIndex = null">
        <label>預約日期</label>
        <div class="input-with-clear">
          <input type="text" :value="selectedDate" placeholder="請選擇" readonly @click="toggleDropdown('date')">
          <button v-if="selectedDate" class="clear-button" @click.stop="clearDate">×</button>
        </div>
        <div class="dropdown" id="date-dropdown" :class="{ active: activeDropdown === 'date' }">
          <div class="calendar-nav">
            <div class="calendar-nav-arrows">
              <button class="calendar-nav-arrow" :disabled="!canGoToPrevMonth" @click="changeMonth(-1)">‹</button>
            </div>
            <div class="calendar-nav-title">
              <span>{{ currentYearMonth }}</span>
            </div>
            <div class="calendar-nav-arrows">
              <button class="calendar-nav-arrow" @click="changeMonth(1)">›</button>
            </div>
          </div>
          <div class="calendar-header">
            <div v-for="day in weekDays" :key="day">{{ day }}</div>
          </div>
          <div class="calendar">
            <div v-for="day in calendarDays" :key="day.date" class="calendar-day" :class="{
              'selectable': day.selectable,
              'disabled': !day.selectable
            }" @click="day.selectable && selectDate(day.date)">
              {{ day.dayNumber }}
            </div>
          </div>
        </div>
      </div>

      <!-- Capacity Field -->
      <div class="search-field capacity-field" @mouseenter="hoveredIndex = 3" @mouseleave="hoveredIndex = null">
        <label>容納人數</label>
        <div class="input-with-clear">
          <input type="text" :value="selectedCapacity" placeholder="請選擇" readonly @click="toggleDropdown('capacity')">
          <button v-if="selectedCapacity" class="clear-button" @click.stop="clearCapacity">×</button>
        </div>
        <div class="dropdown" id="capacity-dropdown" :class="{ active: activeDropdown === 'capacity' }">
          <div class="capacity-buttons">
            <button v-for="capacity in capacityRanges" :key="capacity" type="button"
              :class="{ selected: selectedCapacity === capacity }" @click="selectCapacity(capacity)">
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
      hoveredIndex: null,
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
        { id: 'qingshui', name: '清水區' },
        { id: 'shalu', name: '沙鹿區' },
        { id: 'wuqi', name: '梧棲區' },
        { id: 'houli', name: '后里區' },
        { id: 'shengang', name: '神岡區' },
        { id: 'tanzi', name: '潭子區' },
        { id: 'daya', name: '大雅區' },
        { id: 'xinshe', name: '新社區' },
        { id: 'shigang', name: '石岡區' },
        { id: 'waipu', name: '外埔區' },
        { id: 'daan', name: '大安區' },
        { id: 'longjing', name: '龍井區' },
        { id: 'wufeng', name: '霧峰區' },
        { id: 'taiping', name: '太平區' },
        { id: 'heping', name: '和平區' }
      ],
      venueTypes: [
        { id: 'meeting', name: '會議室', detailTypes: ['會議室', '簡報室', '聯誼室'] },
        { id: 'activity', name: '活動中心', detailTypes: ['禮堂', '音樂廳', '集會空間', '演藝廳'] },
        { id: 'playground', name: '運動場地', detailTypes: ['運動場地', '健身中心', '韻律教室', '廣場', '校園操場'] },
        { id: 'classroom', name: '教室', detailTypes: ['教室', '多功能教室', '電腦教室'] }
      ],
      capacityRanges: [
        //'全部場地',
        '11人以上',
        '31人以上',
        '51人以上',
        '101人以上',
        '200人以上'
      ],
      weekDays: ['日', '一', '二', '三', '四', '五', '六']
    }
  },

  watch: {
    // 監聽路由變化
    '$route': {
      immediate: true,
      handler(to) {
        this.initializeFromQuery(to.query);
      }
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
      // const prevMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1)
      // return prevMonth.getMonth() === today.getMonth() && prevMonth.getFullYear() === today.getFullYear()

      // 計算當前顯示月份的第一天
      const firstDayOfCurrentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1)

      // 如果當前顯示月份的第一天早於今天，則不能再往前
      return firstDayOfCurrentMonth > today
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
      // 使用 padStart 確保月份和日期是兩位數
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      this.selectedDate = `${year}-${month}-${day}`;
      this.activeDropdown = null;
    },
    selectCapacity(capacity) {
      this.selectedCapacity = capacity
      this.activeDropdown = null
    },

    // 初始化搜尋條件
    initializeFromQuery(query) {
      // 處理區域
      if (query.districts) {
        const districtNames = query.districts.split(',');
        this.selectedDistricts = this.districts
          .filter(d => districtNames.includes(d.name))
          .map(d => d.id);
      } else {
        this.selectedDistricts = [];
      }

      // 處理場地類型
      if (query.venues) {
        const venueDetailTypes = query.venues.split(',');
        this.selectedVenues = this.venueTypes
          .filter(v => v.detailTypes.some(dt => venueDetailTypes.includes(dt)))
          .map(v => v.id);
      } else {
        this.selectedVenues = [];
      }

      // 處理日期
      this.selectedDate = query.date || '';
      if (query.date) {
        const [year, month, day] = query.date.split('-');
        // 確保月份和日期是兩位數
        const formattedMonth = String(parseInt(month)).padStart(2, '0');
        const formattedDay = String(parseInt(day)).padStart(2, '0');
        this.selectedDate = `${year}-${formattedMonth}-${formattedDay}`;
        this.currentDate = new Date(year, parseInt(month) - 1, day);
      }

      // 處理容納人數
      this.selectedCapacity = query.capacity || '';
    },

    search() {
      // 處理區域選擇
      const selectedDistrictNames = this.selectedDistricts.map(id => {
        const district = this.districts.find(d => d.id === id);
        return district ? district.name : '';
      }).filter(name => name);

      // 處理場地類型選擇
      const selectedVenueTypes = this.selectedVenues.map(id => {
        const venue = this.venueTypes.find(v => v.id === id);
        return venue ? venue.detailTypes : [];
      }).flat();

      // 組合搜尋條件
      const searchQuery = {
        districts: selectedDistrictNames.length ? selectedDistrictNames.join(',') : null,
        venues: selectedVenueTypes.length ? selectedVenueTypes.join(',') : null,
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
    },

    clearDate() {
      this.selectedDate = '';
      this.activeDropdown = null;
      this.search(); // 更新 URL
    },

    clearCapacity() {
      this.selectedCapacity = '';
      this.activeDropdown = null;
      this.search(); // 更新 URL
    },


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
  background: rgb(249, 249, 249);
  border-radius: 50px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
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
  height: 100%;
}

/* 讓 hover 區域跟 search-bar 一致 */
.search-field:hover {
  border-right: 1px solid transparent;
  border-radius: 50px;
  outline: 2px solid #019ee7;
  margin: -10px 0;
  /*抵消 search-bar 的 padding*/
  padding: 20px 20px;
  /*增加 padding 來維持內容位置*/
}

/* 特別調整最左邊的 district-field */
.district-field:hover {
  margin: -10px 0 -10px -10px;
  /* 左邊 margin 設為 -10px，對齊 search-bar */
  padding: 20px 20px 20px 30px;
  /* 左邊 padding 增加 10px 來補償 margin */
}

/* 當下一個欄位被 hover 時隱藏當前欄位的右邊框 */
.search-field.hide-border {
  border-right: 1px solid transparent;
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
  color: #afafaf;
}

.search-field input:hover {
  cursor: pointer;
}

/* 按鈕樣式 */
.search-button {
  background: #ffc107;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 8px;
  margin-left: 4px;
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
  /* 改為相對於 search-field 底部 */
  /* left: 50%;
  transform: translateX(-50%); */
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

/* 當 dropdown 顯示時，固定其位置 */
.dropdown.active {
  display: block;
}

/* 在dropdown active時,保持search-field的hover狀態 */
.search-field:has(.dropdown.active) {
  margin: -10px 0 -10px -10px;
  padding: 20px 20px 20px 30px;
}

/* 各下拉選單寬度 */
#district-dropdown {
  width: 415%;
  /* 設置為100%以配合search-bar寬度 */
  max-width: calc(500% + 20px);
  /* 確保不會超出container */
  left: 0;
  /* 重置left位置 */
  transform: none;
  /* 移除transform */
  height: 380px;
  padding: 20px;
}

#venue-dropdown {
  width: 280px;
  height: 380px;
}

#date-dropdown {
  width: 280px;
  height: 380px;
}

#capacity-dropdown {
  width: 280px;
  height: 380px;
}

/* 多選選單樣式 */
.checkbox-group {
  display: grid;
  gap: 20px;
}

#district-dropdown .checkbox-group {
  grid-template-columns: repeat(5, 1fr);

  padding: 0 20px;
  /* 增加左右內距 */
  width: 90%;
  /* 設置寬度比例 */
  margin: 0 auto;
  /* 水平置中 */
}

#venue-dropdown .checkbox-group {
  grid-template-columns: 1fr;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  padding: 0 20px;
  justify-content: flex-start;
  /* 確保內容左對齊 */
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
}

.checkbox-item label {
  font-size: 17px;
  margin: 0;
  cursor: pointer;
}

/* 容納人數按鈕樣式 */
.capacity-buttons {
  display: grid;
  gap: 20px;
  padding: 8px;
}

.capacity-buttons button {
  font-size: 17px;
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

/* 取消選擇 */
.input-with-clear {
  position: relative;
  display: flex;
  align-items: center;
}

.clear-button {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
}

.clear-button:hover {
  color: #666;
}

@media (max-width: 750px) {
  .search-container {
    padding: 0 10px;
    overflow: visible;
    /* 允許 dropdown 顯示 */
  }

  .search-bar {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    /* 三欄等寬 */
    padding: 15px;
    gap: 3px;
    position: relative;
    /* 添加相對定位 */
    overflow: visible;
    /* 允許 dropdown 顯示 */
  }

  /* 當有 dropdown active 時，調整 search-bar 的布局 */
  .search-bar:has(.dropdown.active) {
    display: flex;
    flex-direction: column;
  }

  /* 當 dropdown active 時，調整 search-field 的布局 */
  .search-bar:has(.dropdown.active) .search-field {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    margin-bottom: 8px;
  }

  /* 當有 dropdown active 時，input 和 label 的位置調整 */
  .search-bar:has(.dropdown.active) .search-field label {
    grid-column: 1;
  }

  .search-bar:has(.dropdown.active) .search-field input {
    grid-column: 2;
  }

  /* active 的 search-field 樣式 */
  .search-field:has(.dropdown.active) {
    background-color: #f9f9f9;
    border-radius: 50px;
    padding: 8px;
  }

  /* 搜尋按鈕固定在最後一個 */
  .search-bar:has(.dropdown.active) .search-button {
    position: static;
    align-self: center;
    transform: none;
    margin-top: 8px;
  }

  /* 為右欄添加左邊框 */
  .search-field input {
    grid-column: 2;
    text-align: left;
    font-size: 14px;
    padding: 8px 0 8px 12px;
    /* 增加左側padding */
    border-left: 1px solid #ddd;
    /* 添加左側分隔線 */
    position: relative;
  }

  .search-field input::before {
    content: '';
    position: absolute;
    left: 0;
    top: 20%;
    /* 開始位置 */
    height: 60%;
    /* 線的長度 */
    width: 1px;
    background-color: #eee;
  }

  /* 清除每個 search-field 原本的樣式 */
  .search-field {
    display: contents;
    border: none;
    padding: 0;
  }

  /* 左欄 labels */
  .search-field label {
    grid-column: 1;
    text-align: center;
    margin: 0;
    padding: 8px;
    font-size: 14px;
    white-space: nowrap;
    /* 確保文字不換行 */
  }

  /* 右欄 inputs */
  .search-field input {
    grid-column: 2;
    text-align: center;
    font-size: 14px;
    padding: 8px;
  }

  /* 搜尋按鈕置中 */
  .search-button {
    position: absolute;
    /* 絕對定位 */
    right: 20px;
    /* 距離右側 15px */
    top: 50%;
    /* 上方 50% */
    transform: translateY(-50%);
    /* 往上移動自身高度的 50% 以達到垂直置中 */
    width: 50px;
    height: 50px;
    background: #FFC107;
  }

  /* 當有 dropdown active 時的調整 */
  .search-field.active {
    display: block;
    grid-column: 1 / -1;
    /* 橫跨所有列 */
  }

  .search-field.active+.search-field {
    margin-top: 200px;
    /* 為 dropdown 預留空間 */
  }

  /* dropdown 樣式調整 */
  .dropdown {
    position: absolute;
    /* width: 106% !important; */
    max-height: 320px;
    /* 限制最大高度 */
    overflow-y: auto;
    /* 內容過多時可滾動 */
    left: -10px;
    width: calc(103.5% + 20px) !important;
    /* 寬度設為容器寬度 + 左右間距 */
    margin-top: 8px;
    z-index: 1000;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    transform: none;
  }

  #date-dropdown {
    overflow-y: auto;
  }

  /* 調整日曆內部佈局 */
  .calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    /* 減少間距 */
    padding: 0 5px;
    /* 減少側邊padding */
  }

  .calendar-header>div {
    width: auto;
    /* 移除固定寬度 */
    height: 30px;
    /* 減少高度 */
    font-size: 13px;
  }

  .calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    /* 減少間距 */
    padding: 5px;
  }

  .calendar-day {
    width: auto;
    /* 移除固定寬度 */
    height: 30px;
    /* 減少高度 */
    font-size: 13px;
  }

  #capacity-dropdown,
  #district-dropdown {
    width: calc(100% + 30px) !important;
    /* 30px = search-bar的左右padding (15px * 2) */
    left: -10px;
    /* 對應 search-bar 的 padding-left */
  }

  /* 調整 checkbox-group 在 dropdown 中的排列 */
  #district-dropdown .checkbox-group {
    grid-template-columns: repeat(2, 1fr);
    /* 改為兩列 */
    padding: 10px;
  }
}

@media (max-width: 360px) {
  .search-field input {
    font-size: 12px;
  }
}
</style>