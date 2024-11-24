<template>
  <div class="search-container">
    <div class="search-field" v-for="(field, index) in searchFields" :key="index">
      <label class="search-label">{{ field.label }}</label>
      <select class="search-select" v-model="field.value">
        <option value="">{{ field.placeholder }}</option>
        <option v-for="option in field.options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
    <button class="search-button" @click="handleSearch">
      <svg class="search-icon" viewBox="0 0 20 20">
        <path
          d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: "SearchComponent",
  data() {
    return {
      searchFields: [
        {
          label: "行政區域",
          placeholder: "請選擇",
          value: "",
          options: ["北區", "南區", "東區", "西區"], // 根據需求添加選項
        },
        {
          label: "場地類型",
          placeholder: "請選擇",
          value: "",
          options: ["室內", "戶外", "會議室"], // 根據需求添加選項
        },
        {
          label: "預約日期",
          placeholder: "請選擇",
          value: "",
          options: ["今天", "明天", "後天"], // 根據需求添加選項
        },
        {
          label: "容納人數",
          placeholder: "請選擇",
          value: "",
          options: ["10人", "50人", "100人", "200人"], // 根據需求添加選項
        },
      ],
    };
  },
  methods: {
    handleSearch() {
      const searchQuery = this.searchFields.reduce((acc, field) => {
        // 只加入有值的欄位
        if (field.value) {
          acc[field.label] = field.value;
        }
        return acc;
      }, {});
      console.log("Search Query:", searchQuery);

      // 使用 router 導航到 CardView 並帶上查詢參數
      this.$router.push({
        name: 'cardView',
        query: searchQuery   // 這裡的 searchQuery 會變成 URL 的參數
      });
    },
  },
};
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 30px auto 10px auto;
  background: white;
  border-radius: 50px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-field {
  flex: 1;
  position: relative;
  padding: 0 20px;
  border-right: 1px solid #eee;
}

.search-field:last-of-type {
  border-right: none;
}

.search-label {
  display: block;
  font-size: 15px;
  color: #333;
  margin-top: 10px;
  text-align: center;
  /* 文字水平置中 */
  width: 100%;
  /* 確保標籤占據整個欄位的寬度 */
}

.search-select {
  width: 100%;
  padding: 8px 0;
  border: none;
  background: transparent;
  color: #999;
  font-size: 20px;
  cursor: pointer;
  outline: none;
  text-align: center;
  /* 文字水平置中 */
  appearance: none;
  /* 移除瀏覽器預設樣式 */
  -moz-appearance: none;
  /* Firefox 的樣式清除 */
  -webkit-appearance: none;
  /* Webkit 瀏覽器的樣式清除 */
}


.search-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #ffb800;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  transition: background-color 0.3s;
}

.search-button:hover {
  background: #ffa500;
}

.search-icon {
  width: 24px;
  height: 24px;
  fill: white;
}
</style>