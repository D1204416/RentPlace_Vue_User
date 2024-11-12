<template>
  <div class="login-container">
    <div class="header">
      <!-- <span class="title">台中<span style="color: #019ee7;">市民卡</span></span> -->

      <div>
        <span>還沒申辦？</span>
        <a href="#" class="signup-link">去申辦</a>
      </div>
    </div>

    <!-- google button -->
    <!-- <button class="google-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" @click="handleGoogleLogin">
        <path fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20  s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36  c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
      </svg>
    </button> -->


    <!-- Google 登入按鈕容器 -->
    <div id="googleButtonDiv" class="google-button-container"></div>


    <div class="social-buttons">
      <!-- meta button -->
      <button class="social-button facebook-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
          <path fill="#3F51B5"
            d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z" />
          <path fill="#FFFFFF"
            d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287 C31.104,17,31,17.6,31,18.723V21h4L34.368,25z" />
        </svg>
      </button>

      <!-- tcpass button -->
      <button class="social-button tcpass-button">
        <!-- <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 384 512">
          <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
        </svg> -->
        <img src="/img/logo.svg" alt="Logo" style="height: 20px;" />
      </button>
    </div>

    <!-- 輸入帳號 -->
    <div class="input-group">
      <label class="input-label">帳號</label>
      <input type="text" class="input-field" v-model="loginForm.email" :disabled="isLoading" placeholder="輸入您的Email">
    </div>

    <!-- 輸入密碼 -->
    <div class="input-group">
      <label class="input-label">密碼</label>
      <input type="password" class="input-field" v-model="loginForm.password" :disabled="isLoading" placeholder="請輸入密碼">
    </div>

    <div class="forgot-password">
      <a href="#">忘記密碼</a>
    </div>

    <!-- <button class="login-button">登入</button> -->
    <button class="login-button" @click="handleLogin" :disabled="isLoading">{{ isLoading ? '登入中...' : '登入' }}</button>

    <!-- 錯誤訊息顯示 -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user' // Pinia store
import axios from 'axios' // 假設使用 axios 做 API 請求

const router = useRouter()
const userStore = useUserStore()
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL // 後端 API 基礎網址

// 表單數據
const loginForm = reactive({
  email: '',
  password: ''
})

// 狀態管理
const isLoading = ref(false)
const errorMessage = ref('')

// 建立 axios 實例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 處理Google登入
const handleCredentialResponse = async (response) => {
  console.log('Google 登入成功！')

  try {
    // 1.解碼 Google 回傳的 credential (JWT token)
    const credential = response.credential
    const payload = decodeJwtResponse(credential)

    const userInfo = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    }

    // 2. 準備發送給後端的數據
    const loginData = {
      googleToken: credential, // Google JWT token
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    }

    // 3. 發送登入請求到 Spring Boot 後端
    const { data } = await api.post('/api/auth/google-login', loginData)

    // 4. 處理後端回傳的資料
    const { accessToken, user } = data

    // 5. 儲存 JWT token 到 localStorage
    localStorage.setItem('accessToken', accessToken)

    // 6. 設定 axios 預設 header
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

    // 7. 更新 Pinia store 中的用戶資訊
    userStore.setUser({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.picture,
      roles: user.roles // 如果有角色權限
    })

    // 8. 導航到首頁或儀表板
    router.push('/')

  } catch (err) {
    console.error('登入處理失敗:', err)

    // 錯誤處理
    if (err.response) {
      // 後端回傳的錯誤
      switch (err.response.status) {
        case 401:
          alert('驗證失敗，請重新登入')
          break
        case 404:
          alert('找不到用戶資訊')
          break
        default:
          alert('登入時發生錯誤，請稍後再試')
      }
    } else {
      alert('無法連接到伺服器')
    }

    // 重置狀態
    userStore.resetUser()
    localStorage.removeItem('accessToken')
  }
}

// 一般登入處理
const handleLogin = async () => {
  // 清除之前的錯誤訊息
  errorMessage.value = ''

  // 表單驗證
  if (!loginForm.email || !loginForm.password) {
    errorMessage.value = '請填寫帳號和密碼'
    return
  }

  try {
    isLoading.value = true

    console.log('Sending login request:', {
      email: loginForm.email,
      // 不要記錄密碼
    })

    const response = await api.post('/api/auth/login', {
      email: loginForm.email,
      password: loginForm.password
    })

    console.log('Login response:', {
      status: response.status,
      hasToken: !!response.data.token
    })

    if (response.data.token) {
      // 儲存 token
      localStorage.setItem('token', response.data.token)

      // 更新 user store
      userStore.setUser({
        username: response.data.username,
        email: response.data.email  // 確保從回應中獲取 email
      })

      // 設置 axios 默認 header
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

      // 登入成功後跳轉首頁
      console.log("登入成功")
      router.push('/')
    } else {
      errorMessage.value = '登入失敗：伺服器回應格式錯誤'
      console.error('Invalid response format:', response.data)
      throw new Error('無效的回應格式')
    }

  } catch (error) {
    console.error('Login error:', {
      status: error.response?.status,
      message: error.message,
      error: error
    })

    // if (error.response) {
    //   // 伺服器回傳錯誤
    //   errorMessage.value = error.response.data.message || '登入失敗'
    // } else if (error.request) {
    //   // 請求發送失敗
    //   errorMessage.value = '無法連接到伺服器，請檢查網路連接'
    // } else {
    //   // 其他錯誤
    //   errorMessage.value = '登入過程發生錯誤'
    // }
    errorMessage.value = error.response?.data?.message || '登入失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

// 解碼 JWT token
const decodeJwtResponse = (token) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
  return JSON.parse(jsonPayload)
}

// 初始化 Google Identity Services
const initializeGoogleIdentity = () => {
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true

  script.onload = () => {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true
    })

    // 在組件掛載後渲染 Google 按鈕
    window.google.accounts.id.renderButton(
      document.getElementById('googleButtonDiv'),
      {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'center',
        locale: 'zh_TW',
        width: '100%'   // 設置為 100% 以符合容器寬度
      }
    )
  }

  document.head.appendChild(script)
}

// 登出功能
const handleSignOut = () => {
  window.google?.accounts.id.disableAutoSelect()
  user.value = null
}

// 組件掛載時初始化
onMounted(() => {
  if (GOOGLE_CLIENT_ID) {
    initializeGoogleIdentity()
  }
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

body {
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.login-container {
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 100%;
  max-width: 466px;
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.signup-link {
  color: #019ee7;
  text-decoration: none;
  font-size: 16px;
}

.close-button {
  color: #666;
  text-decoration: none;
  font-size: 20px;
}

/* .google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  cursor: pointer;
} */

.google-button {
  /* 保持原有樣式 */
  display: flex;
  align-items: center;
  gap: 10px;
  /* 替代 margin-right */
}

/* Google 按鈕容器樣式 */
.google-button-container {
  margin-bottom: 12px;
  width: 100%;
}

/* 覆蓋 Google 按鈕容器樣式 */
#googleButtonDiv {
  margin: 1rem 0;
  width: 100% !important;
}

#googleButtonDiv iframe {
  width: 100% !important;
}

.social-buttons {
  display: flex;
  gap: 10px;
  height: 40px;
  margin-bottom: 30px;
}
/* .social-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
} */

.social-button {
  flex: 1;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #fff;
  cursor: pointer;
}

.social-button:hover {
  border-color: #d2e3fc;
  background-color:#d2e3fc2c;
  transition: background-color .218s, border-color .218s;
}


.input-group {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  /* border-radius: 4px; */
  margin-bottom: 5px;
}

.forgot-password {
  text-align: right;
  margin-bottom: 20px;
}

.forgot-password a {
  color: #019ee7;
  text-decoration: none;
  font-size: 16px;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #019ee7;
  border-color: #019ee7;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #0074a9;
}

</style>
