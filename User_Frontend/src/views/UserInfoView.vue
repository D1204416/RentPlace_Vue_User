<template>
  <div class="user-profile">
    <div class="profile-card">
      <h2>會員資料</h2>

      <!-- Loading 狀態 -->
      <div v-if="loading" class="loading">
        載入中...
      </div>

      <!-- 錯誤訊息 -->
      <div v-if="error" class="alert error">
        {{ error }}
      </div>

      <!-- 成功訊息 -->
      <div v-if="success" class="alert success">
        {{ success }}
      </div>

      <!-- 表單 -->
      <form @submit.prevent="handleSubmit" v-if="!loading" class="form">
        <!-- 會員ID -->
        <div class="form-group">
          <label>會員 ID</label>
          <input type="text" v-model="user.userId" disabled class="input disabled">
        </div>

        <!-- 姓名 -->
        <div class="form-group">
          <label>姓名</label>
          <input type="text" v-model="user.name" required class="input">
        </div>

        <!-- 密碼 -->
        <div class="form-group">
          <label>密碼</label>
          <input type="password" v-model="user.password" placeholder="輸入新密碼" class="input">
        </div>

        <!-- 電話 -->
        <div class="form-group">
          <label>電話</label>
          <input type="tel" v-model="user.phone" class="input">
        </div>

        <!-- Email -->
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="user.email" required class="input">
        </div>

        <!-- 性別 -->
        <div class="form-group">
          <label>性別</label>
          <select v-model="user.gender" class="input">
            <option value="">選擇性別</option>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </select>
        </div>

        <!-- 生日 -->
        <div class="form-group">
          <label>生日</label>
          <input type="date" v-model="user.birthday" class="input">
        </div>

        <!-- 按鈕區 -->
        <div class="button-group">
          <button type="submit" class="button primary">儲存變更</button>
          <button type="button" @click="handleDelete" class="button danger">
            刪除帳號
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

// 創建 axios 實例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export default {
  name: 'UserInfo',
  data() {
    return {
      user: {
        userId: '',
        name: '',
        password: '',
        phone: '',
        email: '',
        gender: '',
        birthday: ''
      },
      loading: true,
      error: '',
      success: ''
    }
  },

  async created() {
    await this.fetchUserData()
  },

  methods: {
    async fetchUserData() {
      try {
        const userId = localStorage.getItem('user')
        if (!userId) {
          throw new Error('找不到使用者 ID')
        }

        const data = await axios.get(`/user/${userId}`)
        this.user = {
          userId: data.userId || '',
          name: data.name || '',
          password: data.password || '',
          phone: data.phone || '',
          email: data.email || '',
          gender: data.gender || '',
          birthday: data.birthday || ''
        }
      } catch (error) {
        this.error = error.message || '無法取得會員資料'
        console.error('Error fetching user data:', error)
      } finally {
        this.loading = false
      }
    },

    async handleSubmit() {
      this.loading = true
      this.error = ''
      this.success = ''

      try {
        const data = await axios.put(`/user/${this.user.id}`, this.user)
        this.user = { ...this.user, ...data }
        this.success = '資料更新成功！'
      } catch (error) {
        this.error = error.message || '更新失敗'
        console.error('Error updating user data:', error)
      } finally {
        this.loading = false
      }
    },

    async handleDelete() {
      if (!confirm('確定要刪除帳號嗎？此動作無法復原。')) {
        return
      }

      this.loading = true
      try {
        await axios.delete(`/user/${this.user.id}`)
        localStorage.removeItem('user')
        this.$router.push('/') // 導回首頁
      } catch (error) {
        this.error = error.message || '刪除失敗'
        console.error('Error deleting user:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.user-profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

h2 {
  margin: 0 0 24px 0;
  color: #333;
  font-size: 24px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.alert {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.error {
  background-color: #fde8e8;
  color: #c81e1e;
  border: 1px solid #fecaca;
}

.success {
  background-color: #e8f5e9;
  color: #1b5e20;
  border: 1px solid #c8e6c9;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.input.disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button.primary {
  background-color: #4a90e2;
  color: white;
}

.button.primary:hover {
  background-color: #357abd;
}

.button.danger {
  background-color: #dc3545;
  color: white;
}

.button.danger:hover {
  background-color: #c82333;
}

@media (max-width: 600px) {
  .user-profile {
    padding: 10px;
  }

  .profile-card {
    padding: 16px;
  }

  .button-group {
    flex-direction: column;
    gap: 10px;
  }

  .button {
    width: 100%;
  }
}
</style>