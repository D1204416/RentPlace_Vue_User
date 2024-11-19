<template>

    
        <nav class="breadcrumb" v-if="currentBreadcrumbs.length">
        <ul class="breadcrumb-list">
            <li v-for="(item, index) in currentBreadcrumbs" :key="index" class="breadcrumb-item">
                <router-link :to="item.path" class="breadcrumb-link">
                    {{ item.text }}
                </router-link>
                <span v-if="index < currentBreadcrumbs.length - 1" class="breadcrumb-separator">
                    &gt;
                </span>
            </li>
        </ul>
    </nav>

    

</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
    name: 'Breadcrumb',
    setup() {
        const route = useRoute()

        const currentBreadcrumbs = computed(() => {
            return route.meta.breadcrumb || []
        })

        return {
            currentBreadcrumbs
        }
    }
}
</script>

<style >
.breadcrumb {
    margin: 0 auto; /* 置中 */
    width: calc(100% - 40px); /* 減去左右邊距總和 */
    max-width: 1370px; /* 設置最大寬度，避免在大螢幕上過於分散 */
    overflow-x: auto; /* 在小螢幕上允許水平滾動 */
    border-bottom: 2px solid #019EE7; /* 添加藍色底線 */
}

.breadcrumb-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    /* 防止在小螢幕上換行 */
    min-width: min-content;
    /* 確保內容不會被壓縮 */
}

.breadcrumb-item {
    display: flex;
    align-items: center;
    white-space: nowrap;
    /* 防止文字換行 */
}

.breadcrumb-link {
    color: black;
    text-decoration: none;
    font-size: 34px; /* 預設字體大小 */
    transition: font-size 0.3s ease; /* 平滑的字體大小變化 */
}

.breadcrumb-link:hover {
    text-decoration: underline;
    color: #0066cc;
}

.breadcrumb-separator {
    color: #666;
    margin: 0 8px;
    font-size: 18px;
    transition: font-size 0.3s ease;
}

/* 響應式設計 */
/* 大螢幕 */
@media (min-width: 1024px) {
    .breadcrumb-link {
        font-size: 20px;
    }

    .breadcrumb-separator {
        font-size: 16px;
    }

    .breadcrumb {
        padding: 12px 0;
    }
}

/* 中等螢幕 */
@media (max-width: 1023px) and (min-width: 768px) {
    .breadcrumb-link {
        font-size: 18px;
    }

    .breadcrumb-separator {
        font-size: 14px;
    }

    .breadcrumb {
        padding: 10px 0;
    }
}

/* 平板 */
@media (max-width: 767px) and (min-width: 480px) {
    .breadcrumb-link {
        font-size: 16px;
    }

    .breadcrumb-separator {
        font-size: 12px;
        margin: 0 6px;
    }

    .breadcrumb {
        padding: 8px 0;
    }
}

/* 手機 */
@media (max-width: 479px) {
    .breadcrumb-link {
        font-size: 14px;
    }

    .breadcrumb-separator {
        font-size: 12px;
        margin: 0 4px;
    }

    .breadcrumb {
        padding: 6px 0;
    }
}


</style>