<script setup>
import ProgressSteps from '../components/ProgressSteps.vue'
</script>

<template>
  <progress-steps :current-step="1" />

  <!-- 加入 border 和 bg 來測試 Tailwind 是否生效 -->
  <div class="rental-form flex w-full gap-8 border border-gray-200 p-4 bg-white">
    <!-- 左側表單 -->
    <div class="form-section flex-1 border-r border-gray-200 pr-8">
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">申請人</label>
        <input 
          v-model="formData.name"
          type="text"
          class="w-full px-3 py-2 border rounded shadow-sm"
          placeholder="帶入會員姓名"
        >
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">聯絡電話</label>
        <input 
          v-model="formData.phone"
          type="tel"
          class="w-full px-3 py-2 border rounded shadow-sm"
          placeholder="帶入會員電話"
        >
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">申請單位</label>
        <input 
          v-model="formData.department"
          type="text"
          class="w-full px-3 py-2 border rounded shadow-sm"
        >
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">活動內容</label>
        <textarea 
          v-model="formData.content"
          class="w-full px-3 py-2 border rounded shadow-sm"
          rows="4"
        ></textarea>
      </div>
    </div>

    <!-- 右側設備列表 -->
    <div class="equipment-section w-80 bg-gray-50 p-4 rounded">
      <h3 class="text-lg font-medium mb-4">租借設備</h3>
      <div v-if="equipments.length" class="space-y-3">
        <div 
          v-for="item in equipments" 
          :key="item.id" 
          class="flex items-center p-2 hover:bg-gray-100 rounded"
        >
          <input
            type="checkbox"
            :id="item.id"
            v-model="selectedEquipments"
            :value="item.id"
            class="mr-2"
          >
          <label :for="item.id" class="cursor-pointer">{{ item.name }}</label>
        </div>
      </div>
      <div v-else class="text-gray-500 text-center py-4">
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
      // 測試用的假資料
      equipments: [
        { id: 1, name: '麥克風' },
        { id: 2, name: '投影機' },
        { id: 3, name: '音響' },
        { id: 4, name: '遙控器' },
        { id: 5, name: '投影筆' }
      ],
      selectedEquipments: []
    }
  },

  // data() {
  //   return {
  //     formData: {
  //       name: '',
  //       phone: '',
  //       department: '',
  //       content: ''
  //     },
  //     equipments: [],
  //     selectedEquipments: []
  //   }
  // },

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

<style>
.form-container {
  display: flex;
  width: 100%;
}

.form-section {
  flex: 1;
}

.equipment-section {
  width: 320px;
}
</style>

