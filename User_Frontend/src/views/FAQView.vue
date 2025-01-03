<!-- QAViews.vue -->
<template>
    <div class="qa-container">
      <div class="header">
        <h4>常見問答</h4>
        <div class="search-container">
          <input 
            type="text" 
            class="search-input" 
            placeholder="請輸入關鍵字搜尋..." 
            v-model="searchQuery"
          >
        </div>
      </div>
  
      <div class="faq-container">
        <div 
          v-for="(item, index) in filteredQuestions" 
          :key="index"
          class="faq-item"
          :class="{ active: activeIndex === index }"
        >
          <div 
            class="faq-question"
            @click="toggleQuestion(index)"
          >
            {{ item.question }}
          </div>
          <div class="faq-answer">
            <div class="faq-answer-content" v-html="item.answer"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'QAViews',
    data() {
      return {
        searchQuery: '',
        activeIndex: null,
        questions: [
          {
            question: '如何申請場地租借？',
            answer: `
              <p><strong>場地租借申請流程</strong>如下：</p>
              <ul>
                <li>先至官網查詢場地空檔時段</li>
                <li>線上預約申請</li>
                <li>依時限內完成場地費用繳納</li>
                <li>繳費完成後，當天憑QR Code入場</li>
              </ul>
              <div class="highlight-box">
                提醒：建議提前規劃並預留充足的申請時間，以確保順利租借到理想場地。
              </div>
            `
          },
          {
            question: '我要如何知道租借場地的基本資料？',
            answer: `
              <p><strong></strong>您可以在場地租借查詢到：</p>
              <ul>
                <li>場地名稱</li>
                <li>聯絡資訊</li>
                <li>停車場、電梯、無障礙設施</li>
                <li>租借費用資訊</li>
              </ul>
              <div class="highlight-box">
                如有特殊需求，請與管理單位聯繫。
              </div>
            `
          },
          {
            question: '可以提前多久預約場地？',
            answer: `
              <p><strong>場地預約開放時間</strong>如下：</p>
              <ul>
                <li>一般活動：最早可提前3個月預約</li>
                <li>大型活動（100人以上）：最早可提前6個月預約</li>
                <li>特殊活動（如畢業典禮）：最早可提前12個月預約</li>
              </ul>
              <div class="highlight-box">
                建議提早預約，以確保場地可用性。如有特殊需求，請事先聯繫。
              </div>
            `
          },
          {
            question: '如何取消預約？會有退費嗎？',
            answer: `
              <p><strong>取消預約規定</strong>如下：</p>
              <ul>
                <li>活動前14天取消：全額退費</li>
                <li>活動前7-13天取消：退費80%</li>
                <li>活動前4-6天取消：退費50%</li>
                <li>活動前3天內取消：不予退費</li>
              </ul>
              <div class="highlight-box">
                請填寫取消申請表，將有專人協助辦理人工退費。
              </div>
            `
          },
          {
            question: '完成預約後如何查詢我的QR Code？',
            answer: `
              <p>從「會員頭像」點擊選單，點選「租借紀錄」
                於訂單詳情中可查詢到改筆預約QR Code，出示即可入場。
                </p>
              <div class="highlight-box">
                若未依時限內繳費，QR Code 將顯示尚未付款資訊。
              </div>
            `
          }
        ]
      }
    },
    computed: {
      filteredQuestions() {
        const query = this.searchQuery.toLowerCase()
        return this.questions.filter(item => 
          item.question.toLowerCase().includes(query) || 
          item.answer.toLowerCase().includes(query)
        )
      }
    },
    methods: {
      toggleQuestion(index) {
        this.activeIndex = this.activeIndex === index ? null : index
      }
    }
  }
  </script>
  
  <style scoped>
  .qa-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .header {
    text-align: center;
    margin-bottom: 0px;
    padding: 20px;
    background-color: rgb(249, 249, 249);
    border-radius: 8px;
    /* box-shadow: 0 2px 4px rgba(0,0,0,0.05); */
  }
  
  .header h4 {
    color: #333;
    margin-bottom: 20px;
  }
  
  .search-container {
    margin-bottom: 30px;
    position: relative;
  }
  
  .search-input {
    width: 100%;
    padding: 12px 20px;
    font-size: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 25px;
    transition: all 0.3s ease;
    background-color: #fff;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #2196F3;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(33,150,243,0.1);
  }
  
  .faq-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    overflow: hidden;
  }
  
  .faq-item {
    border-bottom: 1px solid #f0f0f0;
  }
  
  .faq-item:last-child {
    border-bottom: none;
  }
  
  .faq-question {
    background-color: #fff;
    padding: 10px 25px;
    cursor: pointer;
    position: relative;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333;
    transition: all 0.3s ease;
  }
  
  .faq-question:hover {
    background-color: #f8f8f8;
    color: #2196F3;
  }
  
  .faq-question::after {
    content: '+';
    font-size: 30px;
    color: #FFC107;
    transition: all 0.3s ease;
  }
  
  .faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    background-color: #fafafa;
  }
  
  .faq-item.active .faq-answer {
    max-height: 1000px;
  }
  
  .faq-item.active .faq-question {
    color: #2196F3;
  }
  
  .faq-item.active .faq-question::after {
    content: '-';
    color: #2196F3;
  }
  
  .faq-answer-content {
    padding: 25px;
    color: #555;
    line-height: 1.8;
    font-size: 15px;
  }
  
  :deep(.faq-answer-content ul) {
    list-style: none;
    padding-left: 0;
    margin: 15px 0;
  }
  
  :deep(.faq-answer-content li) {
    position: relative;
    padding-left: 20px;
    margin-bottom: 12px;
    line-height: 1.6;
  }
  
  :deep(.faq-answer-content li:before) {
    content: "•";
    color: #2196F3;
    position: absolute;
    left: 0;
    font-weight: bold;
  }
  
  :deep(.faq-answer-content p) {
    margin-bottom: 15px;
  }
  
  :deep(.faq-answer-content strong) {
    color: #333;
    font-weight: 600;
  }
  
  :deep(.highlight-box) {
    background-color: #E3F2FD;
    border-left: 4px solid #2196F3;
    padding: 15px;
    margin: 15px 0;
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    .qa-container {
      padding: 10px;
    }
    
    .header {
      padding: 15px;
    }
    
    .search-input {
      padding: 10px 15px;
    }
    
    .faq-question,
    .faq-answer-content {
      padding: 15px;
    }
  }
  </style>