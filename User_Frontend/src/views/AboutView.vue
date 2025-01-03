<template>
    <div class="container">
        <div class="about-section">
            <h2>場地租借服務</h2>
            <div class="about-content">
                <div class="about-text">
                    <p>台中市政府場地租借服務是由台中市政府所提供的公共空間管理與租借平台。
                        結合實體市民卡既有市政服務，讓民眾可享有更便利的數位服務。
                    </p>
                    <p>我們期望透過完善的場地租借系統：<br>
                        • 提供便捷的線上租借服務<br>
                        • 確保場地使用的公平性與透明度<br>
                        • 促進社區活動的蓬勃發展<br>
                        • 提升市民的生活品質</p>
                    <p>
                        我們致力於促進公共空間的有效利用，支援各類型活動的舉辦，豐富市民的文化與休閒生活。
                    </p>
                </div>
                <div class="about-image">
                    <img src="/img/mycard.png" alt="台中市政府場地租借服務">
                </div>
            </div>
        </div>

        <!-- <div class="features">
        <div class="feature-card" v-for="feature in features" :key="feature.title">
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div> -->

        <!-- <div class="contact-info">
        <h2>聯絡資訊</h2>
        <p v-for="(info, index) in contactInfo" :key="index">{{ info }}</p>
      </div> -->
    </div>
</template>

<script>
export default {
    name: 'AboutView',
    data() {
        return {
            features: [
                {
                    title: '會議室',
                    description: '包含會議室、簡報室、聯誼室等多功能空間，提供舒適的商務會議環境。'
                },
                {
                    title: '活動中心',
                    description: '提供表演廳、音樂廳、集會空間等場地，適合舉辦各類文化藝術活動。'
                },
                {
                    title: '運動場地',
                    description: '設有健身中心、體育教室、球場等設施，支持市民運動健身需求。'
                },
                {
                    title: '教室',
                    description: '配備多功能教室、電腦教室等學習空間，提供優質的教育環境。'
                }
            ],
            contactInfo: [
                '地址：台中市西屯區台灣大道三段99號',
                '電話：(04) 2228-9111',
                '服務時間：週一至週五 08:00-17:00',
                '電子郵件：service@taichung.gov.tw'
            ]
        }
    }
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Microsoft JhengHei", sans-serif;
}

body {
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
    padding: 2rem 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.about-section {
    background: rgb(249, 249, 249);
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;

}

.about-content {
    display: flex;
    gap: 2rem;
    align-items: start;
    margin-top: 2rem;

}

.about-text {
    flex: 1;
}

.about-image {
    flex: 0 0 450px;
    height: 300px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    /* 添加過渡效果 */
}

.about-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

h2 {
    color: #333;
    font-size: 1.4rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #FFC107;
}

p {
    margin-bottom: 1rem;
    color: #555;
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.feature-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.feature-card h3 {
    color: #2196F3;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
}

.contact-info {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.contact-info p {
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

@media (max-width: 1024px) {
    .about-image {
        flex: 0 0 400px;
        height: 280px;
    }
}

@media (max-width: 900px) {
    .about-image {
        flex: 0 0 350px;
        height: 250px;
    }
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }

    .about-content {
        flex-direction: column;
    }

    .about-image {
        width: 100%;
        max-width: 500px;
        height: 300px;
        margin: 0 auto;
    }

    .features {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 670px) {
    .about-image {
        flex: none;
        width: 100%;
        max-width: 100%;
        height: 250px !important;
        /* 使用 !important 確保覆蓋 */
    }
}
</style>