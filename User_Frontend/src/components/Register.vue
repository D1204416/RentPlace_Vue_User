<template>
  <!-- <div class="container">
    <h1>會員註冊</h1>
    <form>
      <div class="form-group">
        <label for="name">姓名</label>
        <input type="text" id="name" name="name" required>
      </div>
      <div class="form-group">
        <label for="gender">性別</label>
        <select id="gender" name="gender" required>
          <option value="">請選擇</option>
          <option value="male">男</option>
          <option value="female">女</option>
        </select>
      </div>
      <div class="form-group">
        <label for="birthday">生日</label>
        <input type="date" id="birthday" name="birthday" required>
      </div>
      <div class="form-group">
        <label for="phone">聯絡電話</label>
        <input type="tel" id="phone" name="phone" required>
      </div>
      <div class="form-group">
        <label for="email">信箱</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="password">確認密碼</label>
        <input type="password" id="password" name="password" required>
      </div>
      <button type="submit" class="btn">註冊</button>
    </form>
  </div> -->

  <div class="container">
        <h1>會員註冊</h1>
        <a href="#" class="already-registered">已經申辦了？ <i class="icon-user"></i></a>
        
        <form class="registration-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="name">姓名</label>
                    <input type="text" id="name" placeholder="輸入您的名字">
                </div>
                <div class="form-group">
                    <label for="gender">性別</label>
                    <input type="text" id="gender" placeholder="">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="birthdate">生日</label>
                    <input type="date" id="birthdate" placeholder="請選擇生日">
                </div>
                <div class="form-group">
                    <label for="phone">聯絡電話</label>
                    <input type="text" id="phone" placeholder="行動電話">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="email">信箱</label>
                    <input type="email" id="email" placeholder="請輸入電子郵件信箱">
                </div>
                <div class="form-group verification">
                    <label for="verification-code">信箱驗證</label>
                    <button type="button" class="send-code-btn">發送驗證碼</button>
                    <input type="text" id="verification-code" placeholder="請輸入驗證碼">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="password">密碼</label>
                    <input type="password" id="password" placeholder="">
                </div>
                <div class="form-group">
                    <label for="confirm-password">確認密碼</label>
                    <input type="password" id="confirm-password" placeholder="">
                </div>
            </div>

            <div class="form-row agreement">
                <input type="checkbox" id="agreement">
                <label for="agreement">本人已確認 並同意</label>
            </div>

            <button type="submit" class="submit-btn">註冊</button>
        </form>
    </div>
</template>

<script>
export default {
  name: 'MemberRegistration'
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
}

.container {
    background: #ffffff;
    padding: 40px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

h1 {
    font-size: 24px;
    margin-bottom: 20px;
}

.already-registered {
    display: inline-block;
    font-size: 14px;
    color: #007bff;
    text-decoration: none;
    margin-bottom: 30px;
}

.form-row {
    display: flex;
    justify-content: space-between;
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
input[type="date"] {
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
}

.send-code-btn {
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 12px;
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
    background-color: #007bff;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
}

.submit-btn:hover {
    background-color: #0056b3;
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
}

@media (max-width: 480px) {
  .max-w-md {
    max-width: 20rem;
  }
}

/* .container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 16px;
}

.btn {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 16px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
} */
</style>