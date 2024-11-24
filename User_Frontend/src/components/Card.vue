<!-- MeetingRoomCards.vue -->
<template>
  <div class="container mx-auto p-4">
    <h2 class="text-xl mb-4">符合您搜尋的條件：{{ filteredRooms.length }}筆</h2>

    <!-- 卡片網格 -->
    <div class="grid grid-cols-1 gap-4 
    sm:grid-cols-1 
    md:grid-cols-2 
    lg:grid-cols-3
    xl:grid-cols-3">
      <div v-for="room in filteredRooms" :key="room.id" class="card border rounded-lg overflow-hidden shadow-md">
        <img :src="`/venueImg/${room.imageId}.svg`" :alt="room.name" class="w-full h-48 object-cover"
          @error="handleImageError">
        <div class="p-4">
          <h3 class="font-bold mb-2">{{ room.placeName }}</h3>
          <div class="text-sm text-gray-600">
            <p>場地類型：{{ room.venueType }}</p>
            <p>聯絡電話：{{ room.phone }}</p>
            <p>行政區域：{{ room.regionName }}</p>
            <p>容納人數：{{ room.capacity }}人</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 分頁 -->
    <div class="flex justify-center mt-6 gap-2">
      <button v-for="page in 10" :key="page" class="px-3 py-1 rounded"
        :class="currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'" @click="currentPage = page">
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MeetingRoomCards',

  data() {
    return {
      rooms: [],
      filteredRooms: [],
      currentPage: 1
    }
  },

  methods: {
    handleImageError(e) {
      const currentSrc = e.target.src

      // 已經是預設圖片就不再處理
      if (currentSrc.includes('default.svg')) {
        return
      }

      // 設置預設圖片
      try {
        e.target.src = '/img/'
        // 移除錯誤事件監聽，防止預設圖片載入失敗時再次觸發
        e.target.removeEventListener('error', this.handleImageError)
      } catch (error) {
        console.error('Failed to load default image:', error)
      }
    },

    async fetchVenues() {
      try {
        const response = await axios.get('http://localhost:8080/api/venues')
        this.rooms = response.data
        this.applyFilters()
      } catch (error) {
        console.error('Failed to fetch venues:', error)
      }
    },

    applyFilters() {
      let filtered = [...this.rooms]
      const query = this.$route.query

      // 根據 URL 查詢參數過濾
      if (query['行政區域']) {
        filtered = filtered.filter(room =>
          room.regionName === query['行政區域']
        )
      }

      if (query['場地類型']) {
        filtered = filtered.filter(room =>
          room.venueType === query['場地類型']
        )
      }

      if (query['容納人數']) {
        // 假設容納人數的選項格式是 "10人"，需要處理字串轉數字
        const capacity = parseInt(query['容納人數'])
        filtered = filtered.filter(room =>
          room.capacity >= capacity
        )
      }

      // 如果有預約日期的過濾邏輯，也可以在這裡添加

      this.filteredRooms = filtered
    }
  },

  watch: {
    // 監聽 route 變化，當 URL 參數改變時重新過濾
    '$route.query': {
      handler() {
        this.applyFilters()
      },
      deep: true
    },
  },

  created() {
    this.fetchVenues()
  }


// async created() {
//   try {
//     const response = await axios.get('http://localhost:8080/api/venues')
//     console.log('API Response:', response.data)
//     this.rooms = response.data
//   } catch (error) {
//     console.error('Failed to fetch venues:', error)
//   }
}

</script>

<style scoped>
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-4px);
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>