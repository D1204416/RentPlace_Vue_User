<script setup>
import ProgressSteps from '../components/ProgressSteps.vue'
</script>

<template>
  <progress-steps :current-step="3" />
</template>

<script>
export default {
  name: 'BookingPaymentView',
  components: {
    ProgressSteps
  },

  data() {
    return {
      bookingData: null
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
        this.$router.push('/booking/form')
      }
    } else {
      // 如果沒有資料，導航回表單頁面
      this.$router.push('/booking/form')
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
  }
}
</script>