<script setup>
import ProgressSteps from '../components/ProgressSteps.vue'
</script>

<template>
  <progress-steps :current-step="3" />

  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-bold mb-6 text-blue-600">申請人資料</h2>
    
    <div class="grid grid-cols-1 gap-4 mb-8">
      <div class="flex">
        <div class="w-24 font-medium">申請人：</div>
        <div>{{ bookingData.name }}</div>
      </div>
      <div class="flex">
        <div class="w-24 font-medium">聯絡電話：</div>
        <div>{{ bookingData.phone }}</div>
      </div>
      <div class="flex">
        <div class="w-24 font-medium">申請單位：</div>
        <div>{{ bookingData.department }}</div>
      </div>
      <div class="flex">
        <div class="w-24 font-medium">活動內容：</div>
        <div>{{ bookingData.content }}</div>
      </div>
    </div>

    <h2 class="text-xl font-bold mb-6 text-blue-600">租借資訊</h2>
    
    <div class="grid grid-cols-1 gap-4 mb-8">
      <div class="flex">
        <div class="w-24 font-medium">預約日期：</div>
        <div>{{ bookingData.date }}</div>
      </div>
      <div class="flex">
        <div class="w-24 font-medium">租借場地：</div>
        <div>{{ bookingData.venueName }}</div>
      </div>
      <div class="flex">
        <div class="w-24 font-medium">租借類型：</div>
        <div>{{ bookingData.type }}</div>
      </div>
      <div class="flex">
        <div class="w-24 font-medium">租借時段：</div>
        <div>{{ bookingData.timeSlots.join('、') }}</div>
      </div>
      <div class="flex">
        <div class="w-24 font-medium">租借設備：</div>
        <div>{{ bookingData.equipment.join('、') }}</div>
      </div>
      <div class="flex">
        <div class="w-24 font-medium">租借費用計：</div>
        <div>{{ bookingData.fee }}元</div>
      </div>
    </div>

    <h2 class="text-xl font-bold mb-6 text-blue-600">繳費方式</h2>
    
    <div class="space-y-2">
      <div class="flex items-center">
        <input type="radio" id="online" name="payment" class="mr-2" v-model="paymentMethod" value="online">
        <label for="online">線上繳費</label>
      </div>
      <div class="flex items-center">
        <input type="radio" id="atm" name="payment" class="mr-2" v-model="paymentMethod" value="atm">
        <label for="atm">ATM/銀行臨櫃 轉帳繳費</label>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'BookingPaymentView',
  components: {
    ProgressSteps
  },

  data() {
    return {
      bookingData: {
        name: '',
        phone: '',
        department: '',
        content: '',
        date: '',
        venueName: '',
        type: '',
        timeSlots: [],
        equipment: [],
        fee: 0
      },
      paymentMethod: ''
    }
  },

  created() {
    // 讀取預約資料
    const savedData = localStorage.getItem('bookingData')
    if (savedData) {
      try {
        this.bookingData = JSON.parse(savedData)
      } catch (error) {
        console.error('Error parsing booking data:', error)
        // 可以導航回表單頁面
        this.$router.push('/')
      }
    } else {
      // 如果沒有資料，導航回表單頁面
      this.$router.push('/')
    }
  },

  methods: {
    async submitBooking() {
      try {
        const response = await fetch('http://localhost:8080/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.bookingData)
        })

        if (response.ok) {
          // 成功後清除暫存資料
          localStorage.removeItem('bookingData')
          // 導航到成功頁面
          this.$router.push('/booking/success')
        }
      } catch (error) {
        console.error('Error submitting booking:', error)
      }
    }
  },

  data() {
    return {
      bookingData: {
        name: '',
        phone: '',
        department: '',
        content: '',
        date: '',
        venueName: '',
        type: '',
        timeSlots: [],
        equipment: [],
        fee: 0
      },
      paymentMethod: ''
    }
  },
}
</script>