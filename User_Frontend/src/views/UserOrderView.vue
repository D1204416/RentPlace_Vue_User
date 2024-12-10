<template>
  <div class="order-history">
    <h2 class="title">訂單歷史</h2>
    
    <!-- 篩選區域 -->
    <div class="filters">
      <!-- 場地篩選 -->
      <div class="filter-item">
        <label>場地</label>
        <select v-model="filters.venue">
          <option value="">全部場地</option>
          <option 
            v-for="venue in venues" 
            :key="venue.venue?.id" 
            :value="venue.venue?.id"
          >
            {{ venue.venue?.venueName }}
          </option>
        </select>
      </div>
      
      <!-- 日期範圍篩選 -->
      <div class="filter-item">
        <label>預約日期</label>
        <div class="date-range">
          <input 
            type="date" 
            v-model="filters.startDate"
          >
          <span>至</span>
          <input 
            type="date" 
            v-model="filters.endDate"
          >
        </div>
      </div>
      
      <!-- 搜尋按鈕 -->
      <button 
        @click="searchOrders"
        class="search-btn"
        :disabled="!userId"
      >
        搜尋
      </button>
    </div>

    <!-- 錯誤訊息 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- 訂單表格 -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>訂單號碼</th>
            <th>場地名稱</th>
            <th>預約日期</th>
            <th>預約時段</th>
            <th>付款方式</th>
            <th>訂單狀態</th>
            <th class="amount">金額</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="order in filteredOrders" 
            :key="order.orderId"
          >
            <td>{{ order.orderId }}</td>
            <td>{{ order.reservation.venue.venueName }}</td>
            <td>{{ formatDate(order.reservation.reservationDate) }}</td>
            <td>{{ order.reservation.timePeriodText }}</td>
            <td>{{ order.payment.paymentMethodDisplay }}</td>
            <td>{{ order.status.status }}</td>
            <td class="amount">
              NT$ {{ formatPrice(order.reservation.venue.unitPrice) }}
            </td>
          </tr>
          <tr v-if="filteredOrders.length === 0">
            <td colspan="7" class="empty-message">
              無訂單紀錄
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderHistory',
  
  data() {
    return {
      orders: [],
      venues: new Set(), // 用來儲存不重複的場地
      filters: {
        venue: '',
        startDate: '',
        endDate: ''
      },
      userId: null,
      error: null
    }
  },

  computed: {
    filteredOrders() {
      return this.orders.filter(order => {
        if (this.filters.venue && order.reservation.venue.id !== this.filters.venue) {
          return false
        }
        
        if (this.filters.startDate && this.filters.endDate) {
          const orderDate = new Date(order.reservation.reservationDate)
          const startDate = new Date(this.filters.startDate)
          const endDate = new Date(this.filters.endDate)
          
          if (orderDate < startDate || orderDate > endDate) {
            return false
          }
        }
        
        return true
      })
    }
  },

  methods: {
    getUserId() {
      try {
        // 從 localStorage 中的 user key 獲取 name
        const userString = localStorage.getItem('user')
        if (!userString) {
          this.error = '請先登入系統'
          return null
        }

        // 直接返回用戶名稱作為 userId
        return userString
      } catch (error) {
        console.error('Failed to get user from localStorage:', error)
        this.error = '無法取得用戶資訊'
        return null
      }
    },

    async fetchOrders() {
      this.error = null
      const userId = this.getUserId()
      
      if (!userId) {
        return
      }

      try {
        const response = await this.axios.get(`http://localhost:8080/api/orders/user/${userId}`)
        this.orders = response.data
        // 從訂單中提取不重複的場地資訊
        this.venues = Array.from(new Set(this.orders.map(order => order.reservation.venue)))
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        this.error = '無法取得訂單資料，請稍後再試'
      }
    },

    searchOrders() {
      this.fetchOrders()
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('zh-TW')
    },

    formatPrice(price) {
      return price.toLocaleString()
    },

    initialize() {
      this.userId = this.getUserId()
      if (this.userId) {
        this.fetchOrders()
      }
    }
  },

  created() {
    this.initialize()
  }
}
</script>

<style scoped>
/* 原有的 CSS 樣式保持不變 */
.order-history {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  align-items: flex-end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  color: #666;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

select,
input[type="date"] {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 200px;
}

.search-btn {
  background-color: #1976d2;
  color: white;
  padding: 8px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.search-btn:hover:not(:disabled) {
  background-color: #1565c0;
}

.search-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
  color: #333;
}

td {
  color: #666;
}

tr:hover td {
  background-color: #f8f8f8;
}

.amount {
  text-align: right;
}

.empty-message {
  text-align: center;
  color: #999;
  padding: 32px;
}

@media screen and (max-width: 768px) {
  .filters {
    flex-direction: column;
    gap: 16px;
  }
  
  .filter-item {
    width: 100%;
  }
  
  select,
  input[type="date"] {
    width: 100%;
  }
  
  .search-btn {
    width: 100%;
  }
}
</style>