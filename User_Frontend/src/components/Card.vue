<!-- MeetingRoomCards.vue -->
<template>
  <div class="container mx-auto p-4">
    <h2 class="text-xl mb-4">符合您搜尋的條件：{{ rooms.length }}筆</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="room in rooms" :key="room.id" class="card border rounded-lg overflow-hidden shadow-md">
        <img :src="room.image" :alt="room.name" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="font-bold mb-2">{{ room.name }}</h3>
          <div class="text-sm text-gray-600">
            <p>場地類型：{{ room.type }}</p>
            <p>聯絡電話：{{ room.phone }}</p>
            <p>行政區域：{{ room.area }}</p>
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
export default {
  name: 'MeetingRoomCards',
  data() {
    return {
      currentPage: 1,
      rooms: [
        {
          id: 1,
          name: '台中原住民族文化館',
          type: '會議室',
          phone: '04-22013483#731',
          area: '大墩區',
          capacity: 30,
          image: '/meeting-room-1.jpg'
        },
        {
          id: 2,
          name: '台中原住民族文化館',
          type: '會議室',
          phone: '04-22013483#731',
          area: '大墩區',
          capacity: 30,
          image: '/meeting-room-2.jpg'
        },
        // 可以繼續添加更多會議室數據
      ]
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