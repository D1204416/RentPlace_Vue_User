<template>
    <nav class="breadcrumb" v-if="currentBreadcrumbs.length">
        <ul class="breadcrumb-list">
            <template v-for="(item, index) in currentBreadcrumbs" :key="index">
                <li class="breadcrumb-item">
                    <router-link :to="item.path" class="breadcrumb-link">{{ item.text }}</router-link>
                </li>
                <!-- 在麵包屑項目之間添加分隔符 -->
                <li v-if="index < currentBreadcrumbs.length - 1" class="breadcrumb-separator" aria-hidden="true">
                    >
                </li>
            </template>
        </ul>
    </nav>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// export default {
//     name: 'Breadcrumb',
//     setup() {
//         const route = useRoute()

//         const currentBreadcrumbs = computed(() => {
//             return route.meta.breadcrumb || []
//         })

//         return {
//             currentBreadcrumbs
//         }
//     }
// }

export default {
    name: 'Breadcrumb',
    setup() {
        const route = useRoute()

        const currentBreadcrumbs = computed(() => {
            const breadcrumbs = route.meta.breadcrumb || []
            
            return breadcrumbs.map(item => {
                // 檢查路徑是否包含 :id
                if (item.path.includes(':id')) {
                    return {
                        ...item,
                        // 使用實際的 route.params.id 替換 :id
                        path: item.path.replace(':id', route.params.id)
                    }
                }
                return item
            })
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


.breadcrumb-item, .breadcrumb-separator {
    display: flex;
    align-items: center;
    margin: 0 4px; /* 添加一些間距 */
    white-space: nowrap; /* 防止文字換行 */
}


.breadcrumb-link {
    color: black;
    text-decoration: none;
    font-size: 34px; /* 預設字體大小 */
    transition: font-size 0.3s ease; /* 平滑的字體大小變化 */
}

.breadcrumb-link:hover {
    
    color: #0066cc;
}

.breadcrumb-separator {
    color: #666;
    font-size: 20px;
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