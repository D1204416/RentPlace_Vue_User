<template>
    <div class="container mx-auto px-4">
      <!-- 響應式網格系統 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <div v-for="room in rooms" 
             :key="room.id" 
             class="card bg-white border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <!-- 圖片容器 -->
          <div class="relative h-48 sm:h-56 md:h-64">
            <img :src="room.image" 
                 :alt="room.name" 
                 class="w-full h-full object-cover">
          </div>
          
          <!-- 內容區塊 -->
          <div class="p-4 md:p-6">
            <h3 class="text-lg md:text-xl font-bold mb-2 text-gray-800">{{ room.name }}</h3>
            <div class="space-y-2 text-sm md:text-base text-gray-600">
              <p class="flex items-center gap-2">
                <span class="bi bi-building"></span>
                <span>場地類型：{{ room.type }}</span>
              </p>
              <p class="flex items-center gap-2">
                <span class="bi bi-telephone"></span>
                <span>聯絡電話：{{ room.phone }}</span>
              </p>
              <p class="flex items-center gap-2">
                <span class="bi bi-geo-alt"></span>
                <span>行政區域：{{ room.area }}</span>
              </p>
              <p class="flex items-center gap-2">
                <span class="bi bi-people"></span>
                <span>容納人數：{{ room.capacity }}人</span>
              </p>
            </div>
            
            <!-- 按鈕區域 -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                查看詳情
              </button>
            </div>
          </div>
        </div>
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
        console.error('Error:', error)
      }
    }
  }
  </script>