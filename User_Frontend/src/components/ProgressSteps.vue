<template>
  <div class="progress-steps">
    <div v-for="(step, index) in steps" :key="step.number" class="step-container">
      <!-- Step Circle and Label -->
      <div class="step-content">
        <div class="step-circle" :class="{ 'active': currentStep >= step.number }">
          {{ step.number }}
        </div>
        <div class="step-label" :class="{ 'active': currentStep >= step.number }">
          {{ step.label }}
        </div>
      </div>

      <!-- Connector Line -->
      <div v-if="index < steps.length - 1" class="step-connector" :class="{ 'active': currentStep > step.number }">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressSteps',
  props: {
    currentStep: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      steps: [
        { number: 1, label: '日期時段' },
        { number: 2, label: '填寫表單' },
        { number: 3, label: '繳費方式' },
        { number: 4, label: '預約完成' }
      ]
    }
  }
}
</script>

<style scoped>
.progress-steps {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 48rem;
  margin: 20px auto;
}

.step-container {
  display: flex;
  align-items: center;
  flex: 1;
}

.step-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-circle {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #E5E7EB;
  color: #6B7280;
  font-size: 1.5rem;
}

.step-circle.active {
  background-color: #FCD34D;
  color: #000000;
}

.step-label {
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #9CA3AF;
}

.step-label.active {
  color: #000000;
}

.step-connector {
  flex: 1;
  height: 1px;
  margin: 0 0.5rem;
  background-color: #E5E7EB;
}

.step-connector.active {
  background-color: #FCD34D;
}

/* RWD 響應式設計 */
@media screen and (max-width: 768px) {
  .progress-steps {
    left: 50%;
    padding: 0 0.5rem;
  }

  .step-circle {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.25rem;
  }

  .step-label {
    font-size: 0.875rem;
  }

  .step-connector {
    margin: 0 0.25rem;
  }
}

@media screen and (max-width: 480px) {
  .progress-steps {
    width: calc(100% - 20px);
    margin: 10px auto;
  }

  .step-circle {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
  }

  .step-label {
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }

  .step-connector {
    margin: 0 0.125rem;
  }
}

@media screen and (max-width: 360px) {
  .step-circle {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.875rem;
  }

  .step-label {
    font-size: 0.675rem;
  }

  .step-connector {
    margin: 0;
  }
}
</style>