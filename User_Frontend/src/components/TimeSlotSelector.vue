<template>
    <div class="time-slot-selector">
        <h1>{{ formattedDate }}</h1>

        <div class="time-slots">
            <div v-for="section in sections" :key="section.title" class="time-section">
                <div class="time-section-header">{{ section.title }}</div>
                <div v-for="slot in section.slots" :key="slot.time" class="time-slot">
                    <input type="checkbox" :id="slot.id" v-model="slot.selected" @change="updateTotalHours">
                    <label :for="slot.id">{{ slot.time }}</label>
                </div>
            </div>
        </div>

        <div class="total-time">
            您選擇的時段總計：{{ totalHours }}小時
        </div>
    </div>
</template>

<script>
export default {
    name: 'TimeSlotSelector',

    props: {
        date: {
            type: String,
            default: '11月26日'
        },
        initialDate: {
            type: String,
            default: null
        }
    },

    data() {
        return {
            sections: [
                {
                    title: '早上',
                    slots: [
                        { id: 't-0700', time: '07:00 - 08:00', selected: false },
                        { id: 't-0800', time: '08:00 - 09:00', selected: false },
                        { id: 't-0900', time: '09:00 - 10:00', selected: false },
                        { id: 't-1000', time: '10:00 - 11:00', selected: false },
                        { id: 't-1100', time: '11:00 - 12:00', selected: false }
                    ]
                },
                {
                    title: '下午',
                    slots: [
                        { id: 't-1200', time: '12:00 - 13:00', selected: false },
                        { id: 't-1300', time: '13:00 - 14:00', selected: false },
                        { id: 't-1400', time: '14:00 - 15:00', selected: false },
                        { id: 't-1500', time: '15:00 - 16:00', selected: false },
                        { id: 't-1600', time: '16:00 - 17:00', selected: false }
                    ]
                },
                {
                    title: '晚上',
                    slots: [
                        { id: 't-1700', time: '17:00 - 18:00', selected: false },
                        { id: 't-1800', time: '18:00 - 19:00', selected: false },
                        { id: 't-1900', time: '19:00 - 20:00', selected: false },
                        { id: 't-2000', time: '20:00 - 21:00', selected: false },
                        { id: 't-2100', time: '21:00 - 22:00', selected: false }
                    ]
                }
            ],
            totalHours: 0
        }
    },

    watch: {
        date: {
            immediate: true,
            handler(newDate) {
                // 當 date 改變時，更新顯示
                if (newDate !== '尚未選擇租借日期') {
                    // 如果有選擇日期，優先使用新的日期
                    this.formattedDate = newDate
                    // 重置時段選擇
                    this.resetTimeSlots()
                }
            }
        }
    },

    methods: {
        updateTotalHours() {
            this.totalHours = this.sections.reduce((total, section) => {
                return total + section.slots.filter(slot => slot.selected).length;
            }, 0);

            // 發出選擇變更事件
            this.$emit('selection-change', {
                totalHours: this.totalHours,
                selectedSlots: this.getSelectedSlots()
            });
        },

        getSelectedSlots() {
            return this.sections.flatMap(section =>
                section.slots
                    .filter(slot => slot.selected)
                    .map(slot => ({
                        time: slot.time,
                        id: slot.id,
                        section: section.title
                    }))
            );
        },
        resetTimeSlots() {
            // 重置所有時段的選擇狀態
            this.sections.forEach(section => {
                section.slots.forEach(slot => {
                    slot.selected = false
                })
            })
            this.totalHours = 0

            // 發出重置事件
            this.$emit('selection-change', {
                totalHours: 0,
                selectedSlots: []
            })
        }
    },
    computed: {
        formattedDate() {
            // 如果有新選擇的日期，優先使用
            if (this.date !== '尚未選擇租借日期') {
                return this.date
            }
            // 否則使用初始日期
            if (this.initialDate) {
                const date = new Date(this.initialDate)
                const month = date.getMonth() + 1
                const day = date.getDate()
                return `${month}月${day}日可租借時段`
            }
            return this.date
        }
    },
}
</script>

<style scoped>
.time-slot-selector {
    font-family: system-ui, -apple-system, sans-serif;
    max-width: 800px;
    margin: 20px auto;
    padding: 0 16px;
    box-sizing: border-box;
}

*,
*:before,
*:after {
    box-sizing: inherit;
}

h1 {
    font-size: 1.2rem;
    margin-bottom: 24px;
}

.time-slots {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 24px;
    width: 100%;
    /* 確保寬度撐滿 */
}

.time-section {
    background: rgb(249, 249, 249);
}

.time-section-header {
    background: #4b4b4b;
    color: white;
    padding: 8px 16px;
    text-align: center;
    border-radius: 4px;
    margin-bottom: 12px;
}

.time-slot {
    display: flex;
    align-items: center;
    padding: 8px 4px;
}

.time-slot input[type="checkbox"] {
    width: 20px;
    height: 20px;
    margin-right: 12px;
    accent-color: #1a73e8;
    flex-shrink: 0;
}

.time-slot label {
    font-size: 0.95rem;
    line-height: 1.4;
}

.total-time {
    font-size: 1.2rem;
    padding: 16px 0;
}

@media screen and (max-width: 768px) {
    .time-slots {
        grid-template-columns: 1fr;
    }

    h1 {
        font-size: 1.1rem;
    }
}

@media screen and (max-width: 480px) {
    .time-slots {
        grid-template-columns: 1fr;
        gap: 24px;
    }

    .time-slot-selector {
        padding: 0 12px;
    }

    h1 {
        font-size: 1rem;
        margin-bottom: 16px;
    }

    .time-slot {
        padding: 10px 0;
    }

    .time-slot label {
        font-size: 0.9rem;
    }

    .time-section-header {
        padding: 10px;
        margin-bottom: 8px;
    }
}

@media screen and (max-width: 320px) {
    .time-slot-selector {
        padding: 0 8px;
    }

    .time-slots {
        gap: 16px;
    }

    .time-slot {
        padding: 8px 0;
    }

    .time-slot input[type="checkbox"] {
        width: 18px;
        height: 18px;
        margin-right: 8px;
    }
}
</style>