<script setup>
import ProgressSteps from '../components/ProgressSteps_Jo.vue'
</script>

<template>
  <progress-steps :current-step="3" />
  <div class="container">

    <div class="rental-form">
      <!-- 申請人資料區塊 -->
      <div class="form-section">
        <h2 class="section-title">申請人資料</h2>
        <div class="section-content">
          <div class="info-row">
            <span>申請人：<span class="info-value">{{ bookingData.name }}</span></span>
            <span>聯絡電話：<span class="info-value">{{ bookingData.phone }}</span></span>
            <span>申請單位：<span class="info-value">{{ bookingData.applyApartment }}</span></span>
          </div>
          <div class="info-item">
            <span>活動內容：<span class="info-value">{{ bookingData.content }}</span></span>
          </div>
        </div>
      </div>

      <!-- 租借資訊區塊 -->
      <div class="form-section">
        <h2 class="section-title">租借資訊</h2>
        <div class="section-content">
          <div class="info-row">
            <span>預約日期：<span class="info-value">{{ bookingData.reservationDate }}</span></span>
            <span>租借場地：<span class="info-value">{{ bookingData.venueName }}</span></span>
            <span>租借類型：<span class="info-value">{{ bookingData.venueType }}</span></span>
          </div>
          <div class="info-item">
            <span>租借時段：<span class="info-value">{{ formatTimeSlots }}</span></span>
          </div>
          <div class="info-item">
            <span>租借設備：<span class="info-value">{{ formatEquipments }}</span></span>
          </div>
          <div class="info-item">
            <span>租借費用計：<span class="info-value">{{ bookingData.totalAmount }}元</span></span>
          </div>
        </div>
      </div>

      <!-- 繳費方式區塊 -->
      <div class="form-section">
        <h2 class="section-title">繳費方式</h2>
        <div class="section-content">
          <label class="radio-label">
            <input type="radio" name="payment" v-model="paymentMethod" value="ONLINE_PAYMENT">
            <span class="radio-text">線上繳費</span>
          </label>
          <label class="radio-label">
            <input type="radio" name="payment" v-model="paymentMethod" value="BANK_TRANSFER">
            <span class="radio-text">ATM/銀行臨櫃 轉帳繳費</span>
          </label>
        </div>
      </div>
    </div>

    <div class="button-group">
      <button class="btn btn-back" @click="goBack">上一步</button>
      <button class="btn btn-book" @click="goNext">下一步</button>
    </div>

    <div class="modal" v-if="showVirtualAccountModal">
      <div class="modal-content">
        <h2>轉帳虛擬帳號</h2>
        <p>請於 24 小時內完成轉帳，逾時將取消預約</p>
        <p>請將款項轉至以下虛擬帳號：</p>
        <p>轉帳銀行 : 台灣銀行 銀行代碼 : 004</p>
        <p class="virtual-account">{{ formattedVirtualAccount }}</p>
        <button @click="closeVirtualAccountModal">確定</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bookingPayment',
  components: {
    ProgressSteps
  },

  data() {
    return {
      bookingData: {
        name: '',
        phone: '',
        applyApartment: '',
        content: '',
        equipmentIds: [],
        selectedEquipments: [],
        venueId: '',
        venueName: '',
        venueType: '',
        paymentMethod: '',
        timeSlots: [],
        reservationDate: '',
        totalAmount: '',
        totalHours: 0,
        unitPrice: 0,
      },
      originalQuery: null,
      userId: '',
      paymentMethod: '',
      showVirtualAccountModal: false,
      virtualAccount: ''
    }
  },

  computed: {
    formatTimeSlots() {
      return this.bookingData.timeSlots
        .map(slot => slot.time)
        .join('、')
    },
    formatEquipments() {
      return this.bookingData.selectedEquipments
        .map(equipment => equipment.equipmentName)
        .join('、')
    },
    formattedVirtualAccount() {
      if (!this.virtualAccount) return '';
      return this.virtualAccount.replace(/(\d{4})(?=\d)/g, '$1-').replace(/-$/, '');
    }
  },

  created() {
    // 保存進入頁面時的查詢參數
    this.originalQuery = { ...this.$route.query }

    try {
      // 載入使用者資料
      const userData = localStorage.getItem('user')
      if (userData) {
        this.userId = JSON.parse(userData).userId
      }

      // 載入預約資料
      const storedData = localStorage.getItem('bookingData')
      if (storedData) {
        this.bookingData = {
          ...this.bookingData,
          ...JSON.parse(storedData)
        }
      }
    } catch (error) {
      console.error('Error loading booking data:', error)
    }
  },

  methods: {
    async submitBooking() {
      try {
        // 準備要發送的資料格式
        const reservationData = {
          venueId: this.bookingData.venueId,
          userId: this.userId,
          timePeriodIds: this.bookingData.timeSlots.map(slot => slot.id),
          equipmentIds: this.bookingData.selectedEquipments.map(eq => eq.id),
          reservationDate: this.bookingData.reservationDate,
          remark: "",
          applyApartment: this.bookingData.applyApartment,
          content: this.bookingData.content,
          paymentMethod: this.bookingData.paymentMethod,
          totalAmount: this.bookingData.totalAmount,
          virtualAccount: this.virtualAccount,
        }

        const response = await fetch('http://rentplacespring-production.up.railway.app/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reservationData)
        })

        if (response.ok) {
          const result = await response.json()

          // 可以同時儲存更多相關資訊
          const reservationInfo = {
            reservationId: result.reservationId,
            message: result.message,
            // 可以加入其他需要的資訊
          }
          localStorage.setItem('reservationInfo', JSON.stringify(reservationInfo))

          // 導航到指定頁面
          // this.$router.push('/bookingFinish/:id')
        } else {
          throw new Error('預訂失敗')
        }
      } catch (error) {
        console.error('Error submitting booking:', error)
        // 這裡可以加入錯誤處理，例如顯示錯誤訊息給用戶
      }
    },

    goBack() {
      this.$router.push({
        name: "BookingFormView",
        params: { id: this.venueId },
        query: this.originalQuery
      })
    },

    async goNext() {
      if (this.paymentMethod === 'BANK_TRANSFER') {
        try {
          // 呼叫後端 API 獲取虛擬帳號
          const response = await fetch('http://rentplacespring-production.up.railway.app/api/payments/virtual-account');
          if (response.ok) {
            const account = await response.text();
            console.log('Received Virtual Account:', account); // 確認數字是否正確
            this.virtualAccount = account; // 賦值
            localStorage.setItem('virtualAccount', account); // 儲存到 localStorage
            this.showVirtualAccountModal = true;
          } else {
            console.error('獲取虛擬帳號失敗');
          }
        } catch (error) {
          console.error('Error fetching virtual account:', error);
          console.log('Response Text:', account);
          console.log('Virtual Account:', this.virtualAccount);

        }
      } else {
        // 繼續到下一步
        await this.submitBooking();
        this.$router.push({
          name: 'BookingFinishView',
          params: { id: this.venueId },
          query: this.originalQuery
        });
      }
    },

    closeVirtualAccountModal() {
      this.showVirtualAccountModal = false;
      // 繼續到下一步
      this.submitBooking().then(() => {
        this.$router.push({
          name: 'BookingFinishView',
          params: { id: this.venueId },
          query: this.originalQuery
        });
      });
    }
  },

  watch: {
    paymentMethod(newValue) {
      try {
        this.bookingData.paymentMethod = newValue;
        localStorage.setItem('bookingData', JSON.stringify(this.bookingData));
      } catch (error) {
        console.error('Error saving booking data:', error);
      }
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  /* 增加左右邊距，避免貼齊螢幕 */
}

.rental-form {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  /* background-color: #ffffff; */
  /* border: 1px solid #e5e7eb; */
  border-radius: 8px;
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); */
}

.form-section {
  margin-bottom: 32px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  color: #2563eb;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.section-content {
  padding-left: 12px;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin-bottom: 8px;
}

.info-item {
  margin-bottom: 8px;
}

.info-value {
  font-weight: 500;
  color: #1f2937;
  margin-left: 4px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 12px;
}

.radio-label:last-child {
  margin-bottom: 0;
}

.radio-label input[type="radio"] {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.radio-text {
  color: #374151;
}

.radio-label:hover .radio-text {
  color: #2563eb;
}

/* 響應式設計 */
@media screen and (max-width: 768px) {
  .rental-form {
    padding: 16px;
  }

  .info-row {
    flex-direction: column;
    gap: 8px;
  }

  .section-content {
    padding-left: 8px;
  }
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  /* 更深的背景遮罩 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  animation: fadeIn 0.3s ease-in-out;
  /* 添加淡入動畫 */
}

.modal-content {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  /* 添加陰影 */
  transform: translateY(-20px);
  animation: slideIn 0.3s ease-in-out;
  /* 添加彈出動畫 */
}

.virtual-account {
  font-size: 2rem;
  font-weight: 700;
  color: #111111;
  /* 使用亮藍色 */
  letter-spacing: 0.15em;
  /* 增加字母間距 */
  margin: 20px 0;
}

.modal-content h2 {
  font-size: 1.8rem;
  color: #333333;
  margin-bottom: 15px;
}

.modal-content button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  background: #0095ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
  /* 按鈕背景過渡效果 */
}

.modal-content button:hover {
  background: #0056b3;
  /* 更深的藍色 */
}

/* 動畫效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-40px);
  }

  to {
    transform: translateY(0);
  }
}
</style>