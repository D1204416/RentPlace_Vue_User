<template>
  <div class="pagination">
    <button 
      class="pagination-button"
      @click="handlePrevious" 
      :disabled="currentPage === 1"
    >
      &lt;
    </button>

    <div class="pagination-numbers">
      <button
        v-for="page in displayedPages"
        :key="page"
        @click="handlePageChange(page)"
        :class="[
          'page-number',
          currentPage === page && 'page-number-active'
        ]"
      >
        {{ page }}
      </button>

      <span v-if="showEllipsis" class="ellipsis">...</span>

      <button
        v-if="showLastPage"
        @click="handlePageChange(totalPages)"
        :class="[
          'page-number',
          currentPage === totalPages && 'page-number-active'
        ]"
      >
        {{ totalPages }}
      </button>
    </div>

    <button 
      class="pagination-button"
      @click="handleNext"
      :disabled="currentPage === totalPages"
    >
      &gt;
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  totalPages: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:page'])

// 監聽外部currentPage的變化
watch(() => props.currentPage, (newPage) => {
  if (newPage !== currentPage.value) {
    currentPage.value = newPage
  }
})

const currentPage = ref(props.currentPage)

const displayedPages = computed(() => {
  const pages = []
  const maxVisiblePages = 4 // 顯示4個數字 + 最後一頁

  if (props.totalPages <= maxVisiblePages) {
    // 如果總頁數小於等於4，顯示所有頁數
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    // 永遠顯示前4頁
    for (let i = 1; i <= maxVisiblePages; i++) {
      pages.push(i)
    }
  }

  return pages
})

const showEllipsis = computed(() => {
  return props.totalPages > 4
})

const showLastPage = computed(() => {
  return props.totalPages > 4 && !displayedPages.value.includes(props.totalPages)
})

const handlePageChange = (page) => {
  currentPage.value = page
  emit('update:page', page)
}

const handlePrevious = () => {
  if (currentPage.value > 1) {
    handlePageChange(currentPage.value - 1)
  }
}

const handleNext = () => {
  if (currentPage.value < props.totalPages) {
    handlePageChange(currentPage.value + 1)
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-numbers {
  display: flex;
  gap: 8px;
  align-items: center;
}

.pagination-button {
  padding: 8px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-button:hover:not(:disabled) {
  background: #f3f4f6;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
}

.page-number:hover:not(.page-number-active) {
  background: #f3f4f6;
}

.page-number-active {
  background: #fbbf24;
  color: black;
}

.ellipsis {
  padding: 0 8px;
}
</style>