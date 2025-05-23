<template>
  <div class="order-history">
    <h2 class="title">歷史訂單紀錄</h2>

    <!-- 篩選區域 -->
    <div class="filters">
      <!-- 場地篩選 -->
      <!-- <div class="filter-item">
        <label>場地</label>
        <select v-model="filters.venue">
          <option value="">全部場地</option>
          <option v-for="venue in venues" :key="venue.venue?.id" :value="venue.venue?.id">
            {{ venue.venue?.venueName }}
          </option>
        </select>
      </div> -->

      <!-- 日期範圍篩選 -->
      <div class="filter-item">
        <label>預約日期</label>
        <div class="date-range">
          <input type="date" v-model="filters.startDate">
          <span>至</span>
          <input type="date" v-model="filters.endDate">
        </div>
      </div>

      <!-- 搜尋按鈕 -->
      <button @click="searchOrders" class="search-btn" :disabled="!userId">
        {{ isLoading ? '載入中...' : '搜尋' }}
      </button>
    </div>

    <!-- 載入中提示 -->
    <div v-if="isLoading" class="loading-message">
      資料載入中，請稍候...
    </div>

    <!-- 錯誤訊息 -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="retryFetch" class="retry-btn">
        重試
      </button>
    </div>

    <!-- 訂單表格 -->
    <div v-if="!isLoading && !error" class="table-container">
      <table>
        <thead>
          <tr>
            <th>訂單號碼</th>
            <th>場地名稱</th>
            <th>預約日期</th>
            <!-- <th>預約時段</th> -->
            <th>付款方式</th>
            <th>訂單資料</th>
            <th class="amount">金額</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.orderId">
            <td>{{ order.orderId }}</td>
            <td>{{ order.reservation?.venue?.venueName || '無資料' }}</td>
            <td>{{ formatDate(order.reservation?.reservationDate) || '無資料' }}</td>
            <!-- <td>{{ order.reservation?.timePeriodText || '無資料' }}</td> -->
            <td>{{ order.payment?.paymentMethodDisplay || '無資料' }}</td>
            <td style="white-space: nowrap;">
              <button class="btn btn-warning btn-sm btn-xs btn-block" @click="goToOrderDetail(order.orderId)">
                訂單詳情
              </button>
            </td>
            <td class="amount">
              {{ order.totalAmount ? `NT$ ${formatPrice(order.totalAmount)}` : '無資料' }}
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
import axios from 'axios'

export default {
  name: 'OrderHistory',

  data() {
    return {
      orders: [],
      venues: new Set(),
      filters: {
        venue: '',
        startDate: '',
        endDate: ''
      },
      userId: null,
      error: null,
      isLoading: false,
      retryCount: 0,
      maxRetries: 3,

      // 創建 axios 實例
      axiosInstance: axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 從環境變數獲取 API URL
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
    }
  },

  computed: {
    filteredOrders() {
      return this.orders
        .filter(order => {
          const venueId = order?.reservation?.venue?.id
          if (this.filters.venue && venueId !== this.filters.venue) {
            return false
          }

          const reservationDate = order?.reservation?.reservationDate
          if (this.filters.startDate && this.filters.endDate && reservationDate) {
            const orderDate = new Date(reservationDate)
            const startDate = new Date(this.filters.startDate)
            const endDate = new Date(this.filters.endDate)

            if (orderDate < startDate || orderDate > endDate) {
              return false
            }
          }

          return true
        })

        // 排序 - 訂單號碼由大而小
        .sort((a, b) => b.orderId - a.orderId)
    }
  },

  methods: {
    getUserId() {
      try {
        // 從 localStorage 中獲取user資料
        const userString = localStorage.getItem('user')
        if (!userString) {
          this.error = '請先登入系統'
          return null
        }

        // 解析 user 字串為物件
        const user = JSON.parse(userString)

        if (!user || !user.userId) {
          this.error = '無法取得用戶資訊'
          return null
        }

        return user.userId
      } catch (error) {
        console.error('Failed to get user from localStorage:', error)
        this.error = '無法取得用戶資訊'
        return null
      }
    },

    async fetchOrders() {
      this.error = null
      this.isLoading = true
      const userId = this.getUserId()

      if (!userId) {
        this.isLoading = false
        return
      }

      try {
        const response = await this.axiosInstance.get(`/api/orders/user/${userId}`)
        console.log('API response type:', typeof response.data)
        console.log('API response:', response.data)

        if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
          throw new Error('API 回傳格式錯誤，請確認 API 路徑是否正確')
        }

        // 確保 response.data 是陣列
        if (!response.data) {
          throw new Error('回傳資料格式錯誤')
        }

        // 確保數據是陣列並且過濾掉不完整的資料
        const ordersArray = Array.isArray(response.data) ? response.data : [response.data]
        this.orders = ordersArray.filter(order => {
          // 檢查必要的屬性是否存在
          return order &&
            order.orderId &&
            order.reservation &&
            order.reservation.venue &&
            order.reservation.reservationDate
        })

        // 安全地提取場地資訊
        const validVenues = new Set()
        this.orders.forEach(order => {
          if (order?.reservation?.venue) {
            validVenues.add(order.reservation.venue)
          }
        })
        this.venues = Array.from(validVenues)

        this.retryCount = 0

        // 如果過濾後沒有訂單，顯示提示
        if (this.orders.length === 0) {
          this.error = '沒有找到有效的訂單資料'
        }
      } catch (error) {
        console.error('API Error:', error)
        console.error('Error response:', error.response)

        let errorMessage = '無法取得訂單資料，'

        if (error.code === 'ECONNABORTED') {
          errorMessage += '請求超時，請檢查網路連線'
        } else if (error.response) {
          switch (error.response.status) {
            case 401:
              errorMessage += '請重新登入'
              break
            case 403:
              errorMessage += '無權限存取'
              break
            case 404:
              errorMessage += '找不到訂單資料'
              break
            case 500:
              errorMessage += '伺服器錯誤，請稍後再試'
              break
            default:
              errorMessage += `請稍後再試 (${error.response.status})`
          }
        } else if (error.request) {
          errorMessage += '無法連接到伺服器'
        } else {
          errorMessage += error.message || '請稍後再試'
        }

        this.error = errorMessage
      } finally {
        this.isLoading = false
      }
    },

    async retryFetch() {
      if (this.retryCount < this.maxRetries) {
        this.retryCount++
        await this.fetchOrders()
      } else {
        this.error = '多次嘗試失敗，請稍後再試或聯繫客服'
      }
    },

    searchOrders() {
      this.retryCount = 0 // 重設重試次數
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
    },

    goToOrderDetail(orderId) {
      if (!orderId) {
        console.error('訂單ID不存在')
        return
      }

      try {
        this.$router.push(`/userOrderInfo/${orderId}`)
      } catch (error) {
        console.error('跳轉失敗:', error)
        // 可以在這裡添加錯誤處理邏輯
      }
    },
  },

  created() {
    this.initialize()
  }
}
</script>

<style scoped>
.loading-message {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #d32f2f;
  background-color: #ffebee;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.retry-btn {
  background-color: #d32f2f;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: #b71c1c;
}

.search-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

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
  background-color: #3498db;
  color: white;
  padding: 8px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.search-btn:hover:not(:disabled) {
  background-color: #2687c8;
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

th,
td {
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

.btn-warning {
  color: white;
  background-color: #3498db;
  border-color: #3498db;
}

.btn-warning:hover {
  background-color: #2687c8;
  border-color: #2687c8;
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