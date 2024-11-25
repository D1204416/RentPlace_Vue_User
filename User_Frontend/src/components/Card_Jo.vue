<!-- MeetingRoomCards.vue -->
<template>
    <div class="container">
        <h4 class="search-result">符合您搜尋的條件：{{ filteredRooms.length }}筆</h4>

        <!-- 卡片網格 -->
        <div class="room-grid">
            <div v-for="room in filteredRooms" :key="room.id" class="room-card">
                <img :src="`/venueImg/${room.imageId}.svg`" :alt="room.name" class="card-image"
                    @error="handleImageError">
                <div class="card-content">
                    <h5 class="venue-name">{{ room.placeName }}</h5>
                    <div class="venue-info">
                        <p>場地類型：{{ room.venueType }}</p>
                        <p>聯絡電話：{{ room.phoneNumber }}</p>
                        <p>行政區域：{{ room.regionName }}</p>
                        <p>容納人數：{{ room.capacity }}人</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 分頁 -->
        <div class="pagination">
            <button v-for="page in 10" :key="page" class="page-button" :class="{ active: currentPage === page }"
                @click="currentPage = page">
                {{ page }}
            </button>
        </div>
    </div>
</template>

<script>
// 保持原本的 script 部分不變

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
            const query = this.$route.query   // 從 URL 取得參數

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
/* 新的樣式 */
.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

.search-result {
    font-size: 22px;
    color: #333;
    margin-bottom: 20px;
    font-weight: bold;
}

.room-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    
  }

.room-card {
    background: #fff;
    border: none;
}

.card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
}

.card-content {
    padding: 15px 0;
}

.venue-name {
    font-size: 18px;
    font-weight: bold;
    color: #000;
    margin-bottom: 10px;
}

.venue-info {
    font-size: 16px;
    color: #000;
}

.venue-info p {
    margin: 5px 0;
    line-height: 1.4;
    font-size: 16px;
}

/* 分頁按鈕樣式 */
.pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 30px;
}

.page-button {
    padding: 8px 12px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
}

.page-button.active {
    background: #333;
    color: #fff;
    border-color: #333;
}

/* 響應式設計 */
@media (min-width: 640px) {
    .room-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .room-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1280px) {
    .room-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>