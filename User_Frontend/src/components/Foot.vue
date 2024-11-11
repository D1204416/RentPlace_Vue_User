<template>


  <footer class="foot">
    <div class="foot-container">
      <nav class="foot-nav">
        <a href="#" class="foot-link">政府網站資料開放宣告</a>
        <span class="divider">|</span>
        <a href="#" class="foot-link">資訊安全政策</a>
        <span class="divider">|</span>
        <a href="#" class="foot-link">隱私權政策</a>
        <span class="divider">|</span>
        <a href="#" class="foot-link">市民卡客服信箱</a>
        <span class="divider">|</span>
        <a href="#" class="foot-link">市政信箱</a>
      </nav>

      <div class="foot-address">
        407610 台中市西屯區台灣大道三段99號
      </div>

      <div class="foot-browser">
        請使用Chrome、FireFox、Edge、Safari 瀏覽器
      </div>
    </div>

    <img src="/img/tree.svg" class="trees" alt="decorative trees">

  </footer>
  
</template>

<script>
export default {
  name: 'Foot'
}
</script>

<style scoped>
.foot {
  background-color: rgb(224, 242, 254);
  padding: 20px 16px;
  width: 100%;
  position: relative;
  overflow: hidden;
  margin-top: 30px;
}

.foot-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.foot-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.foot-link {
  color: #4b5563;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.foot-link:hover {
  color: #1f2937;
}

.divider {
  color: #9ca3af;
}

.foot-address,
.foot-browser {
  text-align: center;
  color: #4b5563;
  font-size: 14px;
  margin-bottom: 8px;
}

.trees {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 180px;
  height: auto;
  z-index: 1;
  pointer-events: none;
  object-fit: contain;
}


@media screen and (max-width: 768px) {
  .divider {
    display: none;
  }

  .foot-nav {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .foot-link {
    font-size: 16px;
  }

  .foot-address,
  .foot-browser {
    font-size: 16px;
  }

  .trees {
    width: 90px;
    height: auto;
  }

}

@media screen and (max-width: 480px) {
  .trees {
    width: 60px;
    height: auto;
  }
}
</style>