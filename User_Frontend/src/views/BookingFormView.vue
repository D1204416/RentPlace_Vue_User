<script setup>
import ProgressSteps from '../components/ProgressSteps_Jo.vue'
</script>

<template>
  <progress-steps :current-step="2" />
  <div class="container">

    <div v-if="venueId">
      <div class="form-container">
        <!-- 左側表單 -->
        <div class="form-section">
          <div class="form-group">
            <label>申請人</label>
            <input v-model="formData.name" type="text" :placeholder="defaultName || '帶入會員姓名'">
          </div>

          <div class="form-group">
            <label>聯絡電話</label>
            <input v-model="formData.phone" type="tel" :placeholder="defaultPhone || '帶入會員電話'">
          </div>

          <div class="form-group">
            <label>申請單位</label>
            <input v-model="formData.department" type="text">
          </div>

          <div class="form-group">
            <label>活動內容</label>
            <textarea v-model="formData.content" rows="4"></textarea>
          </div>
        </div>

        <!-- 右側設備列表 -->
        <div class="equipment-section">
          <h3>租借設備</h3>
          <div v-if="venueData" class="equipment-list">
            <div v-for="item in venueData.equipment" :key="item.id" class="equipment-item">
              <input type="checkbox" :id="'equipment-' + item.id" v-model="selectedEquipments" :value="item.id">
              <label :for="'equipment-' + item.id">{{ item.equipmentName }}</label>
            </div>
          </div>
          <div v-else class="loading-text">
            載入設備中...
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error-message">
      無法載入場地資訊，請返回上一頁重新選擇場地
    </div>

    <div class="button-group">
      <button class="btn btn-back" @click="goBack">上一步</button>
      <button class="btn btn-book" @click="goNext">下一步</button>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    ProgressSteps
  },
  name: 'bookingForm',

  data() {
    return {
      formData: {
        name: '',
        phone: '',
        department: '',
        content: ''
      },
      venueData: null,
      selectedEquipments: [],
      venueId: null,
      originalQuery: null,
    }
  },

  async created() {
    // 保存進入頁面時的查詢參數
    this.originalQuery = { ...this.$route.query }

    // 獲取會員資料
    const memberDataString = localStorage.getItem('user')
    if (memberDataString) {
      try {
        const memberData = JSON.parse(memberDataString)
        this.formData.name = memberData.name
        this.formData.phone = memberData.phone
      } catch (error) {
        console.error('Error parsing member data:', error)
      }
    }

    // 恢復已選擇的設備
    const savedBookingData = localStorage.getItem('bookingFormData')
    if (savedBookingData) {
      try {
        const parsedBookingData = JSON.parse(savedBookingData)
        this.selectedEquipments = parsedBookingData.selectedEquipments || []

        // 如果有其他表單數據也可以恢復
        if (parsedBookingData.formData) {
          this.formData = {
            ...this.formData,  // 保留會員資料
            department: parsedBookingData.formData.department || '',
            content: parsedBookingData.formData.content || ''
          }
        }
      } catch (error) {
        console.error('Error parsing booking data:', error)
      }
    }

    await this.loadVenueData()
  },

  methods: {
    getVenueId() {
      const routeVenueId = this.$route.params.id || this.$route.query.id
      if (routeVenueId) {
        this.venueId = routeVenueId
        return routeVenueId
      }
      return null
    },

    async loadVenueData() {
      const venueId = this.getVenueId()
      if (!venueId) {
        console.error('No venue ID found')
        return
      }

      try {
        const response = await fetch(`http://localhost:8080/api/venues/${venueId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        this.venueData = data
        console.log('Venue data loaded:', data)
      } catch (error) {
        console.error('Error fetching venue data:', error)
      }
    },

    goBack() {
      this.$router.push({
        name: "BookingDateView",
        params: { id: this.venueId },
        query: this.originalQuery
      })
    },

    goNext() {
      // 保存資料
      this.saveBookingData(),
        // 導航到付款頁面
        this.$router.push({
          name: "BookingPaymentView",
          params: { id: this.venueId },
          query: this.originalQuery
        })
    },

    // 當設備選擇改變時保存
    // updateEquipments() {
    //   localStorage.setItem('bookingFormData', JSON.stringify({
    //     formData: this.formData,
    //     selectedEquipments: this.selectedEquipments
    //   }))
    // },

    // 儲存整個預約表單資料
    saveBookingData() {
      const bookingData = {
        userId: this.formData.name,
        phone: this.formData.phone,
        applyApartment: this.formData.department,
        content: this.formData.content,
        venueId: this.venueId,
        venueName: this.venueData?.venueName,
        equipmentIds: this.selectedEquipments
      }
      localStorage.setItem('bookingData', JSON.stringify(bookingData))
    },
  },

  watch: {
    // 合併監聽，任何相關數據變化都保存
    formData: {
      handler() {
        this.saveBookingData()
      },
      deep: true
    },
    selectedEquipments: {
      handler() {
        this.saveBookingData()
      },
      deep: true
    }
  },

  // 當組件即將被銷毀時也保存數據
  beforeUnmount() {
    this.saveBookingData()
  }

}
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
  /* 增加左右邊距，避免貼齊螢幕 */
}

.form-container {
  display: flex;
  width: 100%;
  gap: 2rem;
  padding: 2rem 0;
}

.form-section {
  flex: 1;
  padding-right: 2rem;
  /* border-right: 1px solid #eee; */
}

.equipment-section {
  width: 400px;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 0.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
}

.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  resize: none;  /* 禁止調整大小 */
}

.equipment-list {
  display: grid;  
  grid-template-columns: repeat(2, 1fr);  /* 設置兩欄 */
  gap: 0.5rem;  /* 保持間距 */
  padding: 0.5rem;
}

.equipment-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  min-width: 0;  /* 防止內容溢出 */
}

.equipment-item label {
  white-space: nowrap;  /* 防止文字換行 */
  overflow: hidden;
  text-overflow: ellipsis;  /* 過長時顯示省略號 */
}

.equipment-item:hover {
  background-color: #f0f0f0;
}

h3 {
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.button-group {
  display: flex;
  gap: 15px;
  padding: 20px 0;
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

.error-message {
  text-align: center;
  padding: 2rem;
  color: #dc2626;
  background-color: #fee2e2;
  border-radius: 0.5rem;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .form-container {
    flex-direction: column; /* 手機版改為垂直排列 */
    gap: 1rem;
  }

  .form-section {
    padding-right: 0;
  }

  .equipment-section {
    width: 100%; /* 設備區塊在手機版占滿寬度 */
  }

  .equipment-list {
    grid-template-columns: repeat(2, 1fr); /* 保持兩欄 */
  }
}

/* 更小螢幕的處理 */
@media (max-width: 480px) {
  .equipment-list {
    grid-template-columns: 1fr; /* 極小螢幕改為單欄 */
  }

  .button-group {
    flex-direction: column; /* 按鈕改為垂直排列 */
    width: 100%;
  }

  .btn {
    width: 100%; /* 按鈕占滿寬度 */
  }
}
</style>