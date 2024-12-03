<script setup>
import ProgressSteps from '../components/ProgressSteps.vue'
</script>

<template>
  <progress-steps :current-step="1" />

  <div class="rental-form flex justify-between p-4">
    <!-- Left side - Form inputs -->
    <div class="form-section w-1/2">
      <div class="mb-4">
        <label class="block text-sm mb-2">申請人</label>
        <input 
          v-model="formData.name"
          type="text"
          class="w-full px-3 py-2 border rounded"
          placeholder="帶入會員姓名"
        >
      </div>

      <div class="mb-4">
        <label class="block text-sm mb-2">聯絡電話</label>
        <input 
          v-model="formData.phone"
          type="tel"
          class="w-full px-3 py-2 border rounded"
          placeholder="帶入會員電話"
        >
      </div>

      <div class="mb-4">
        <label class="block text-sm mb-2">申請單位</label>
        <input 
          v-model="formData.department"
          type="text"
          class="w-full px-3 py-2 border rounded"
        >
      </div>

      <div class="mb-4">
        <label class="block text-sm mb-2">活動內容</label>
        <textarea 
          v-model="formData.content"
          class="w-full px-3 py-2 border rounded"
          rows="4"
        ></textarea>
      </div>
    </div>

    <!-- Right side - Equipment checkboxes -->
    <div class="equipment-section w-1/3">
      <h3 class="text-lg mb-4">租借設備</h3>
      <div v-if="equipments.length" class="space-y-3">
        <div 
          v-for="item in equipments" 
          :key="item.id" 
          class="flex items-center"
        >
          <input
            type="checkbox"
            :id="item.id"
            v-model="selectedEquipments"
            :value="item.id"
            class="mr-2"
          >
          <label :for="item.id">{{ item.name }}</label>
        </div>
      </div>
      <div v-else class="text-gray-500">
        載入設備中...
      </div>
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
      equipments: [],
      selectedEquipments: []
    }
  },
  
  async created() {
    try {
      // 從 API 獲取設備列表
      const response = await fetch('/api/equipments')
      const data = await response.json()
      this.equipments = data
    } catch (error) {
      console.error('Error fetching equipment data:', error)
    }
  },

  methods: {
    async submitForm() {
      try {
        const formSubmission = {
          ...this.formData,
          equipments: this.selectedEquipments
        }
        
        const response = await fetch('/api/rental', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formSubmission)
        })
        
        if (response.ok) {
          // 處理成功提交
          this.$emit('submit-success')
        }
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    }
  }
}
</script>