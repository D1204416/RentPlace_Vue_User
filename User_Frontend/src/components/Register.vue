<template>
  <div class="container">
    <div class="registration-title">
      <h1>會員註冊</h1>
      <a href="#" class="already-registered">已經申辦了？ <i class="icon-user"></i></a>
    </div>

    <form class="registration-form" @submit.prevent="handleSubmit">
      <div class="form-row">
        <div class="form-group">
          <label for="name">姓名</label>
          <input type="text" id="name" v-model="formData.username" placeholder="輸入您的名字" 
          :class="{ 'error': errors.username }" required>
          <span class="error-message" v-if="errors.username">{{ errors.username }}</span>
        </div>
        <div class="form-group">
          <label for="gender">性別</label>
          <select id="gender" v-model="formData.gender" required>
            <option value="">請選擇性別</option>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="birthdate">生日</label>
          <input type="date" id="birthdate" v-model="formData.birth" placeholder="請選擇生日"
          :class="{ 'error': errors.birth }" required>
          <span class="error-message" v-if="errors.birth">{{ errors.birth }}</span>
        </div>
        <div class="form-group">
          <label for="phone">聯絡電話</label>
          <input type="tel" id="phone" v-model="formData.phone" placeholder="聯絡電話" required
            :class="{ 'error': errors.phone }">
          <span class="error-message" v-if="errors.phone">{{ errors.phone }}</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="email">信箱</label>
          <input type="email" id="email" v-model="formData.email" placeholder="請輸入電子郵件信箱"
            :class="{ 'error': errors.email }" required>
          <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
        </div>
        <div class="form-group ">
          <label for="verification-code">信箱驗證</label>
          <div class="verification">
            <button type="button" class="send-code-btn" @click="sendVerificationCode">發送驗證碼</button>
            <input type="text" id="verification-code" v-model="verificationCode" placeholder="請輸入驗證碼" required>
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="password">密碼</label>
          <input type="password" id="password"  v-model="formData.password" placeholder=""
          :class="{ 'error': errors.password }" required>
          <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
        </div>
        <div class="form-group">
          <label for="confirm-password">確認密碼</label>
          <input type="password" id="confirm-password" v-model="confirmPassword" placeholder="" required>
        </div>
      </div>

      <div class="form-row agreement">
        <input type="checkbox" id="agreement" v-model="agreedToTerms" required>
        <label for="agreement">本人已確認 <span style="color:#007bff">並同意</span></label>
      </div>

      <button type="submit" class="submit-btn" :disabled="!agreedToTerms"> {{ isSubmitting ? '註冊中...' : '註冊' }}</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      formData: {
        username: '',
        password: '',
        email: '',
        phone: '',
        gender: '',
        birth: ''
      },
      verificationCode: '',
      agreedToTerms: false, // 添加同意條款的數據屬性
      errors: {},
      isSubmitting: false
    }
  },
  methods: {
    sendVerificationCode() {
      // 這裡你需要實現發送驗證碼的邏輯
      // 比如透過 API 請求發送驗證碼到用戶的郵箱
      axios.post('/api/send-verification-code', { email: this.formData.email })
        .then(response => {
          // 處理發送驗證碼成功的情況
          console.log('Verification code sent:', response.data.verificationCode)
        })
        .catch(error => {
          // 處理發送驗證碼失敗的情況
          console.error('Failed to send verification code:', error)
        })
    },

    validateForm() {
      this.errors = {}
      let isValid = true

      // 驗證用戶名
      if (this.formData.username.length < 3) {
        this.errors.username = '用戶名稱至少需要3個字符'
        isValid = false
      }

      // 驗證密碼
      if (this.formData.password.length < 6) {
        this.errors.password = '密碼至少需要6個字符'
        isValid = false
      }

      // 驗證電子郵件
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.formData.email)) {
        this.errors.email = '請輸入有效的電子郵件地址'
        isValid = false
      }

      // 驗證手機號碼
      const phoneRegex = /^[0-9]{10}$/
      if (!phoneRegex.test(this.formData.phone)) {
        this.errors.phone = '請輸入有效的10位手機號碼'
        isValid = false
      }

      // 驗證出生日期
      if (!this.formData.birth) {
        this.errors.birth = '請選擇出生日期'
        isValid = false
      }

      // 驗證同意條款
      if (!this.agreedToTerms) {
        this.errors.terms = '請同意服務條款和隱私政策'
        isValid = false
      }

      return isValid
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        return
      }

      this.isSubmitting = true

      try {
        const response = await axios.post('http://localhost:8080/api/register', this.formData)

        // 註冊成功
        this.$emit('register-success', response.data)

        // 可以加入路由導航
        // this.$router.push('/login')

      } catch (error) {
        // 處理錯誤
        if (error.response) {
          // 服務器返回的錯誤信息
          this.errors = error.response.data.errors || {}
        } else {
          // 網絡錯誤或其他錯誤
          console.error('註冊失敗:', error)
        }
      } finally {
        this.isSubmitting = false
      }
    }
    
    // async handleSubmit() {  // 增加驗證碼
    //   if (!this.validateForm()) {
    //     return
    //   }

    //   try {
    //     // 先檢查驗證碼是否正確
    //     const response = await axios.post('/api/verify-code', {
    //       email: this.formData.email,
    //       code: this.verificationCode
    //     })

    //     if (response.data.isValid) {
    //       // 驗證碼正確,提交表單
    //       await axios.post('http://localhost:8080/api/register', this.formData)
    //       this.$emit('register-success', response.data)
    //     } else {
    //       // 驗證碼錯誤
    //       this.errors.verificationCode = '驗證碼不正確'
    //     }
    //   } catch (error) {
    //     // 處理錯誤
    //     if (error.response) {
    //       this.errors = error.response.data.errors || {}
    //     } else {
    //       console.error('註冊失敗:', error)
    //     }
    //   } finally {
    //     this.isSubmitting = false
    //   }
    // }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

body {
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
}

.container {
  background: #ffffff;
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: start;
  margin: 0 auto;
}

.registration-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  margin-right: auto;
  /* 將標題置於左側 */
}

.already-registered {
  display: inline-block;
  font-size: 14px;
  color: #019ee7;
  text-decoration: none;
  margin-bottom: 30px;
  margin-left: auto;
  /*把它移到最右側*/
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
  margin-right: 10px;
}

.form-group:last-child {
  margin-right: 0;
}

label {
  font-size: 14px;
  color: #333;
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="date"],
input[type="tel"],
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}

input[type="text"]::placeholder,
input[type="email"]::placeholder,
input[type="password"]::placeholder {
  color: #bbb;
}

.verification {
  display: flex;
  align-items: center;
  gap: 10px
}

.send-code-btn {
  padding: 8px 12px;
  background-color: #019ee7;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
  margin-right: 5px;
}

.agreement {
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
}

.agreement input[type="checkbox"] {
  margin-right: 5px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #019ee7;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

.submit-btn:hover {
  background-color: #0074a9;
}


@media (max-width: 1920px) {
  .max-w-md {
    max-width: 32rem;
  }
}

@media (max-width: 768px) {
  .max-w-md {
    max-width: 24rem;
  }

  .container {
    padding: 30px;
  }
  
  .form-row {
    /* flex-direction: column; */
    gap: 15px;
  }
  
  .form-group {
    width: 100%;
  }
  
  .verification {
    /* flex-direction: column; */
    align-items: stretch;
  }
  
  .send-code-btn {
    width: 30%;
  }
}

/* 手機響應式設計 */
@media (max-width: 480px) {
  .max-w-md {
    max-width: 20rem;
  }

  .container {
    padding: 20px;
  }

  .form-row {
    flex-direction: column;
    gap: 15px;
  }
  
  h1 {
    font-size: 20px;
  }
  
  .registration-title {
    /* flex-direction: column; */
    align-items: flex-start;
  }
  
  .already-registered {
    align-self: flex-end;
  }

  .verification {
    /* flex-direction: column; */
    align-items: stretch;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="date"],
  input[type="tel"],
  select {
    font-size: 16px; /* 改善手機上的可讀性 */
    padding: 12px;
  }
  
  .agreement {
    flex-direction: row;
    gap: 8px;
  }
}

</style>