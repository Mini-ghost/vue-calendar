<template>
  <div>
    <p>{{ value }}</p>
    <Calendar 
      v-model="value"
      :show-adjacent-months="showAdjacentMonths"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

// Components
import Calendar from '@/components/Calendar/Calendar'

export default Vue.extend({
  name: 'App',
  components: {
    Calendar
  },
  data() {
    return {
      value: new Date(),
      showAdjacentMonths: false,
    }
  }
})
</script>
