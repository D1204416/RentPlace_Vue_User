<template>
  <div class="container">
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
  </div>
</template>

<script>
export default {
  name: 'MemberRegistration'
}
</script>

<style scoped>
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

.container {
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
}
</style>