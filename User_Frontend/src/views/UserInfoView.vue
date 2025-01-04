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
          <input type="text" v-model="user.id" disabled class="input disabled">
        </div>

        <!-- 姓名 -->
        <div class="form-group">
          <label>姓名</label>
          <span class="required-mark" title="此欄位為必填">*</span>
          <small v-if="isFieldRequired('username')" class="field-hint">(必填)</small>
          <input type="text" v-model="user.username" @input="validateField('username')" required class="input">
          <span class="error-message" v-if="errors.username">{{ errors.username }}</span>
        </div>

        <!-- 密碼 -->
        <div class="form-group">
          <label>密碼</label>
          <input type="password" v-model="user.password" @input="validateField('password')" placeholder="輸入新密碼"
            class="input">
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <!-- 電話 -->
        <div class="form-group">
          <label>電話</label>
          <span class="required-mark">*</span>
          <input type="tel" v-model="user.phone" @input="validateField('phone')" required class="input">
          <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label>Email</label>
          <span class="required-mark">*</span>
          <input type="email" v-model="user.email" @input="validateField('email')" required class="input">
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <!-- 性別 -->
        <div class="form-group">
          <label>性別</label>
          <span class="required-mark">*</span>
          <select v-model="user.gender" @input="validateField('gender')" required class="input">
            <option value="">選擇性別</option>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </select>
          <span v-if="errors.gender" class="error-message">{{ errors.gender }}</span>
        </div>

        <!-- 生日 -->
        <div class="form-group">
          <label>生日</label>
          <span class="required-mark">*</span>
          <input type="date" v-model="user.birth" @input="validateField('birth')" required class="input">
          <span v-if="errors.birth" class="error-message">{{ errors.birth }}</span>
        </div>

        <!-- 按鈕區 -->
        <div class="button-group">
          <button type="submit" class="button primary">儲存變更</button>
          <button type="button" @click="handleDelete" class="button danger">刪除帳號</button>
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
        id: '',
        username: '',
        password: '',
        phone: '',
        email: '',
        gender: '',
        birth: ''
      },
      loading: true,
      error: '',
      success: '',
      errors: {},
      confirmPassword: ''
    }
  },

  async created() {
    await this.fetchUserData()
  },

  methods: {
    // 必填欄位
    isFieldRequired(fieldName) {
      // 可以集中管理必填欄位
      const requiredFields = ['username', 'gender', 'birth', 'email', 'phone', 'password', 'confirmPassword', 'verificationCode'];
      return requiredFields.includes(fieldName);
    },

    formatDate(dateString) {
      if (!dateString) return ''

      const date = new Date(dateString)
      if (isNaN(date.getTime())) return '' // 如果日期無效則返回空字串

      // 格式化為 YYYY-MM-DD
      return date.toISOString().split('T')[0]
    },

    // 驗證欄位輸入
    validateField(field) {
      switch (field) {
        case 'username':
          const usernameRegex = /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,20}$/;
          if (!this.user.username) {
            this.errors.username = '請輸入用戶名稱';
          } else if (!usernameRegex.test(this.user.username)) {
            this.errors.username = '用戶名稱只能包含中文、英文、數字和底線，長度2-20字元';
          } else {
            delete this.errors.username;
          }
          break;

        case 'email':
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!this.user.email) {
            this.errors.email = '請輸入電子郵件地址';
          } else if (!emailRegex.test(this.user.email)) {
            this.errors.email = '請輸入有效的電子郵件地址';
          } else {
            delete this.errors.email;
          }
          break;

        case 'phone':
          const phoneRegex = /^09\d{8}$/;
          if (!this.user.phone) {
            this.errors.phone = '請輸入手機號碼';
          } else if (!phoneRegex.test(this.user.phone)) {
            this.errors.phone = '請輸入有效的手機號碼（格式：09xxxxxxxx）';
          } else {
            delete this.errors.phone;
          }
          break;

        case 'password':
          if (this.user.password) {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
            if (!passwordRegex.test(this.user.password)) {
              this.errors.password = '密碼必須至少6個字符，包含至少一個字母和一個數字';
            } else {
              delete this.errors.password;
            }
          } else {
            delete this.errors.password;
          }
          break;

        case 'gender':
          if (!this.user.gender) {
            this.errors.gender = '請選擇性別';
          } else {
            delete this.errors.gender;
          }
          break;

        case 'birth':
          if (!this.user.birth) {
            this.errors.birth = '請選擇出生日期';
          } else {
            const birthDate = new Date(this.user.birth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (birthDate > today) {
              this.errors.birth = '出生日期不能晚於今天';
            } else if (age > 120 || (age === 120 && monthDiff > 0)) {
              this.errors.birth = '請輸入有效的出生日期';
            } else if (age < 13 || (age === 13 && monthDiff < 0)) {
              this.errors.birth = '需年滿13歲才能註冊';
            } else {
              delete this.errors.birth;
            }
          }
          break;
      }
    },

    // 驗證表格
    validateForm() {
      this.errors = {};
      let isValid = true;

      // Username validation
      const usernameRegex = /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,20}$/;
      if (!this.user.username) {
        this.errors.username = '請輸入用戶名稱';
        isValid = false;
      } else if (!usernameRegex.test(this.user.username)) {
        this.errors.username = '用戶名稱只能包含中文、英文、數字和底線，長度2-20字元';
        isValid = false;
      }

      // Email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!this.user.email) {
        this.errors.email = '請輸入電子郵件地址';
        isValid = false;
      } else if (!emailRegex.test(this.user.email)) {
        this.errors.email = '請輸入有效的電子郵件地址';
        isValid = false;
      }

      // Phone validation
      const phoneRegex = /^09\d{8}$/;
      if (!this.user.phone) {
        this.errors.phone = '請輸入手機號碼';
        isValid = false;
      } else if (!phoneRegex.test(this.user.phone)) {
        this.errors.phone = '請輸入有效的手機號碼（格式：09xxxxxxxx）';
        isValid = false;
      }

      // Password validation (only if password is provided for update)
      if (this.user.password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(this.user.password)) {
          this.errors.password = '密碼必須至少6個字符，包含至少一個字母和一個數字';
          isValid = false;
        }
      }

      // Gender validation
      if (!this.user.gender) {
        this.errors.gender = '請選擇性別';
        isValid = false;
      }

      // Birth validation
      if (!this.user.birth) {
        this.errors.birth = '請選擇出生日期';
        isValid = false;
      } else {
        const birthDate = new Date(this.user.birth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (birthDate > today) {
          this.errors.birth = '出生日期不能晚於今天';
          isValid = false;
        } else if (age > 120 || (age === 120 && monthDiff > 0)) {
          this.errors.birth = '請輸入有效的出生日期';
          isValid = false;
        } else if (age < 13 || (age === 13 && monthDiff < 0)) {
          this.errors.birth = '需年滿13歲才能註冊';
          isValid = false;
        }
      }

      return isValid;
    },

    async fetchUserData() {
      try {
        this.loading = true
        this.error = ''

        // 從 localStorage 獲取用戶 ID
        const userData = JSON.parse(localStorage.getItem('user'))
        if (!userData || !userData.userId) {
          throw new Error('未找到用戶資訊')
        }

        const response = await axiosInstance.get(`/api/user/${userData.userId}`)
        const { data } = response

        // 更新用戶資料
        this.user = {
          id: data.userId,
          username: data.username,
          phone: data.phone,
          email: data.email,
          gender: data.gender,
          birth: this.formatDate(data.birth)
        }
        // 不載入密碼欄位
        this.user.password = ''
      } catch (err) {
        this.error = err.response?.data?.message || err.message || '載入用戶資料失敗'
      } finally {
        this.loading = false
      }
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      try {
        this.loading = true
        this.error = ''
        this.success = ''

        const userData = JSON.parse(localStorage.getItem('user'))
        if (!userData || !userData.userId) {
          throw new Error('未找到用戶資訊')
        }

        // 準備更新的數據
        const updateData = {
          username: this.user.username,
          phone: this.user.phone,
          email: this.user.email,
          gender: this.user.gender,
          birth: this.user.birth
        }

        // 如果有輸入新密碼，則加入密碼欄位
        if (this.user.password) {
          updateData.password = this.user.password
        }

        // 發送更新請求到後端
        await axiosInstance.put(`/api/user/${userData.userId}`, updateData)
        this.success = '資料更新成功'

        // 更新 localStorage 中的用戶資料
        const updatedUserData = {
          ...userData,
          email: this.user.email,
          username: this.user.username,
          phone: this.user.phone
        }
        localStorage.setItem('user', JSON.stringify(updatedUserData))

        this.success = '資料更新成功'

        // 清空密碼欄位
        this.user.password = ''
      } catch (err) {
        this.error = err.response?.data?.message || err.message || '更新用戶資料失敗'
      } finally {
        this.loading = false
      }
    },

    async handleDelete() {
      if (!confirm('確定要刪除帳號嗎？此操作無法復原。')) {
        return
      }

      try {
        this.loading = true
        this.error = ''

        const userData = JSON.parse(localStorage.getItem('user'))
        if (!userData || !userData.userId) {
          throw new Error('未找到用戶資訊')
        }

        await axiosInstance.delete(`/api/user/${userData.userId}/soft`)

        // 清除本地存儲的用戶信息
        localStorage.removeItem('user')

        // 導向登入頁面
        this.$router.push('/')
      } catch (err) {
        this.error = err.response?.data?.message || err.message || '刪除帳號失敗'
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
  /* display: flex; */
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
  gap: 15px;
  padding: 20px;
  justify-content: center;
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
  background-color: #3498db;
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

/* 必填＊提醒 */
.form-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.required-legend {
  color: #666;
  font-size: 0.875rem;
}

.required-mark {
  color: #ffc107;
  margin-left: 4px;
  font-size: 1.2em;
  vertical-align: middle;
}

.field-hint {
  color: #6c757d;
  font-size: 0.75em;
  margin-left: 8px;
}

.field-description {
  color: #666;
  font-size: 0.875em;
  margin-top: 4px;
  display: block;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
}
</style>