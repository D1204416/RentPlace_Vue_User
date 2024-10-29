<template>
  <div class="booking-container">
    <!-- Search Bar -->
    <div class="search-bar">
      <div class="search-filters">
        <select class="filter-item" v-model="selectedRegion">
          <option value="" disabled selected>行政區域</option>
          <option v-for="region in regions" :key="region" :value="region">
            {{ region }}
          </option>
        </select>

        <select class="filter-item" v-model="selectedVenueType">
          <option value="" disabled selected>場地類型</option>
          <option v-for="type in venueTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>

        <input type="date" class="filter-item" v-model="selectedDate" />

        <select class="filter-item" v-model="selectedCapacity">
          <option value="" disabled selected>容納人數</option>
          <option v-for="cap in capacities" :key="cap" :value="cap">
            {{ cap }}
          </option>
        </select>

        <button class="search-button">
          <span class="search-icon">🔍</span>
        </button>
      </div>
    </div>

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
  name: 'VenueBooking',
  data() {
    return {
      selectedRegion: '',  // 行政區域
      selectedVenueType: '',  // 場地類型
      selectedDate: '',  // 日期
      selectedCapacity: '', //容納人數
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

.search-bar {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.search-filters {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  min-width: 150px;
  font-size: 14px;
}

.search-button {
  background: #FFD700;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background: #FFC700;
}

.section-title {
  text-align: center;
  margin: 30px 0;
  font-size: 24px;
}

.venue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.venue-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s;
}

.venue-card:hover {
  transform: translateY(-5px);
}

.venue-icon {
  /* width: 48px;
  height: 48px; */
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
  height: 200px;
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