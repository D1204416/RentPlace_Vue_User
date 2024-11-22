<template>
  <div class="booking-container">
    <!-- Venue Types Section -->
    <h2 class="section-title">場地類型</h2>
    <div class="venue-grid">
      <div v-for="venue in venues" :key="venue.id" class="venue-card">
        <div class="venue-icon">
          <img :src="`/img/${venue.icon}`" :alt="venue.title" />
        </div>
        <h3 class="venue-title">{{ venue.title }} {{ venue.count }}</h3>
        <p class="venue-description">{{ venue.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'card_divide',
  data() {
    return {
      regions: ['中區', '東區', '南區', '西區', '北區', '西屯區', '南屯區', '北屯區', '豐原區', '東勢區',
        '大甲區', '清水區', '沙鹿區', '梧棲區', '后里區', '神岡區', '潭子區', '大雅區', '新社區', '石岡區',
        '外埔區', '大安區', '龍井區', '霧峰區', '太平區', '大里區', '和平區'],
      venueTypes: ['會議室', '活動中心', '運動場所', '教室'],
      capacities: ['10人以下', '11-30人', '31-50人', '50人以上'],
      venues: [
        {
          id: 1,
          title: '會議室',
          count: 158,
          description: '包含中型與小型會議室、簡報室、聯誼室.....',
          icon: 'meeting-room.png'
        },
        {
          id: 2,
          title: '活動中心',
          count: 120,
          description: '包含一般禮堂、音樂廳、集會空間、演藝廳.....',
          icon: 'theater.png'
        },
        {
          id: 3,
          title: '運動場所',
          count: 158,
          description: '包含健身中心、韻律教室、廣場、校園操場.....',
          icon: 'playground.png'
        },
        {
          id: 4,
          title: '教室',
          count: 158,
          description: '包含一般教室、多功能教室、電腦教室.....',
          icon: 'classroom.png'
        }
      ]
    }
  }
}
</script>

<style scoped>
.booking-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}


.section-title {
  text-align: center;
  margin: 10px 0 30px 0;
  font-size: 24px;
}

.venue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.venue-card {
  background: #F3F3F3;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.25);
  text-align: center;
  transition: transform 0.3s;

}

.venue-card:hover {
  transform: translateY(-5px);
  background-color: #cbeeff;
}

.venue-icon {
  /* width: 390px;
    height: 230px;   */
  margin-bottom: 15px;
}

.venue-title {
  font-size: 18px;
  margin-bottom: 10px;
}

.venue-description {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

img {
  width: 200px;
  height: 160px;
}

@media (max-width: 768px) {
  .search-filters {
    flex-direction: column;
  }

  .filter-item {
    width: 100%;
  }

  .venue-grid {
    grid-template-columns: 1fr;
  }
}
</style>