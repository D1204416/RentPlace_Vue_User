<template>
  <div class="booking-container">
    <!-- Venue Types Section -->
    <h2 class="section-title">場地類型</h2>
    <div class="venue-grid">
      <div v-for="venue in venues" :key="venue.id" class="venue-card" @click="handleVenueClick(venue)">
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
import axios from 'axios'

export default {
  name: 'card_divide',
  data() {
    return {
      // venueTypes: ['會議室', '活動中心', '運動場所', '教室'],
      // capacities: ['10人以下', '11-30人', '31-50人', '50人以上'],
      venues: [
        {
          id: 1,
          title: '會議室',
          count: 0, // 初始化為 0
          description: '包含中型與小型會議室、簡報室、聯誼室.....',
          icon: 'meeting-room.png'
        },
        {
          id: 2,
          title: '活動中心',
          count: 0, // 初始化為 0
          description: '包含一般禮堂、音樂廳、集會空間、演藝廳.....',
          icon: 'theater.png'
        },
        {
          id: 3,
          title: '運動場所',
          count: 0, // 初始化為 0
          description: '包含健身中心、韻律教室、廣場、校園操場.....',
          icon: 'playground.png'
        },
        {
          id: 4,
          title: '教室',
          count: 0, // 初始化為 0
          description: '包含一般教室、多功能教室、電腦教室.....',
          icon: 'classroom.png'
        }
      ],
      allVenues: [] // 儲存 API 返回的所有場地數據
    }
  },

  methods: {
    async fetchVenues() {
      try {
        const response = await axios.get('http://localhost:8080/api/venues')
        this.allVenues = response.data
        this.updateVenueCounts()
      } catch (error) {
        console.error('Failed to fetch venues:', error)
      }
    },

    updateVenueCounts() {
      // 計算每種場地類型的數量
      this.venues = this.venues.map(venue => {
        const count = this.allVenues.filter(v => v.venueType === venue.title).length
        return {
          ...venue,
          count: count
        }
      })
    },

    // 帶query參數跳轉頁面
    handleVenueClick(venue) {
      this.$router.push({
        name: 'cardView',
        query: {
          '場地類型': venue.title
        }
      });
    }
  },

  // 在組件創建時獲取數據
  created() {
    this.fetchVenues()
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
  margin: 0 0 30px 0;
  font-size: 24px;
}

.venue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.venue-card {
  /* background: #F3F3F3; */
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.3s;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.15);

}

.venue-card:hover {
  transform: translateY(-5px);
  background-color: #cbeeff;
  /* box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.25); */
  
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
  /* width: 200px;
  height: 160px; */
  width: 150px;
  height: 140px;
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