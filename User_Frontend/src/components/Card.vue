<!-- MeetingRoomCards.vue -->
<template>

  <div class="container mx-auto p-4">
    <h2 class="text-xl mb-4">符合您搜尋的條件：{{ rooms.length }}筆</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="room in rooms" :key="room.id" class="card border rounded-lg overflow-hidden shadow-md">
        <img :src="room.imageId" :alt="room.name" class="w-full h-48 object-cover">
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
      currentPage: 1
    }
  },

  async created() {
    try {
      const response = await axios.get('http://localhost:8080/api/venues')
      console.log('API Response:', response.data)
      this.rooms = response.data
    } catch (error) {
      console.error('Failed to fetch venues:', error)
    }
  }
}
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-4px);
}
</style>