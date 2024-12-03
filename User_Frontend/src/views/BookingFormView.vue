<script setup>
import ProgressSteps from '../components/ProgressSteps.vue'
</script>

<template>
  <div v-if="venueId">
    <progress-steps :current-step="1" />

    <div class="form-container">
      <!-- 左側表單 -->
      <div class="form-section">
        <div class="form-group">
          <label>申請人</label>
          <input v-model="formData.name" type="text" placeholder="帶入會員姓名">
        </div>

        <div class="form-group">
          <label>聯絡電話</label>
          <input v-model="formData.phone" type="tel" placeholder="帶入會員電話">
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
      venueId: null
    }
  },

  async created() {
    // 從 localStorage 獲取會員資訊
    const memberInfo = JSON.parse(localStorage.getItem('memberInfo'))
    if (memberInfo) {
      this.formData.name = memberInfo.name || ''
      this.formData.phone = memberInfo.phone || ''
    }
    
    await this.loadVenueData()
  },

  methods: {
    getVenueId() {
      const routeVenueId = this.$route.params.id || this.$route.query.id
      if (routeVenueId) {
        this.venueId = routeVenueId
        localStorage.setItem('venueId', routeVenueId)
        return routeVenueId
      }

      const storedVenueId = localStorage.getItem('venueId')
      if (storedVenueId) {
        this.venueId = storedVenueId
        return storedVenueId
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
    }
  },

  beforeUnmount() {
    localStorage.setItem('bookingFormData', JSON.stringify({
      formData: this.formData,
      selectedEquipments: this.selectedEquipments
    }))
  }

}
</script>

<style scoped>
.error-message {
  text-align: center;
  padding: 2rem;
  color: #dc2626;
  background-color: #fee2e2;
  border-radius: 0.5rem;
  margin: 2rem;
}

.form-container {
  display: flex;
  width: 100%;
  gap: 2rem;
  padding: 1rem;
}

.form-section {
  flex: 1;
  padding-right: 2rem;
  border-right: 1px solid #eee;
}

.equipment-section {
  width: 320px;
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

.equipment-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.equipment-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
}

.equipment-item:hover {
  background-color: #f0f0f0;
}

h3 {
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 1rem;
}
</style>