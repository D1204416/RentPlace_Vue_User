<template>
    <div class="container mx-auto px-4">
        <!-- 卡片網格 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <div v-for="room in paginatedRooms" :key="room.id"
                class="card bg-white border rounded-xl overflow-hidden shadow-lg">
                <!-- 卡片內容保持不變 -->
                <div class="relative h-48 sm:h-56 md:h-64">
                    <img :src="room.image" :alt="room.name" class="w-full h-full object-cover">
                </div>
                <div class="p-4 md:p-6">
                    <h3 class="text-lg md:text-xl font-bold mb-2 text-gray-800">{{ room.name }}</h3>
                    <div class="space-y-2 text-sm md:text-base text-gray-600">
                        <p>場地類型：{{ room.type }}</p>
                        <p>聯絡電話：{{ room.phone }}</p>
                        <p>行政區域：{{ room.area }}</p>
                        <p>容納人數：{{ room.capacity }}人</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 分頁按鈕 -->
        <div class="mt-6 flex justify-center gap-2">
            <button @click="currentPage--" :disabled="currentPage === 1"
                class="px-4 py-2 border rounded-lg disabled:opacity-50">
                上一頁
            </button>
            <span class="px-4 py-2">
                第 {{ currentPage }} 頁，共 {{ totalPages }} 頁
            </span>
            <button @click="currentPage++" :disabled="currentPage === totalPages"
                class="px-4 py-2 border rounded-lg disabled:opacity-50">
                下一頁
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
            currentPage: 1,
            itemsPerPage: 12  // 每頁顯示12個卡片
        }
    },
    computed: {
        // 計算總頁數
        totalPages() {
            return Math.ceil(this.rooms.length / this.itemsPerPage)
        },
        // 取得當前頁面應該顯示的卡片
        paginatedRooms() {
            const start = (this.currentPage - 1) * this.itemsPerPage
            const end = start + this.itemsPerPage
            return this.rooms.slice(start, end)
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
    },
    watch: {
        // 監聽頁碼變化，確保不會超出範圍
        currentPage(newPage) {
            if (newPage < 1) {
                this.currentPage = 1
            } else if (newPage > this.totalPages) {
                this.currentPage = this.totalPages
            }
        }
    }
}
</script>

<style>
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