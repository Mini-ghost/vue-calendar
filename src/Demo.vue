<template>
  <div>
    <Calendar 
      :value="new Date(year, month)"
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
      year: 2021,
      month: 3,
      showAdjacentMonths: false
    }
  }
})
</script>
