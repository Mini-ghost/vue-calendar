<template>
  <div class="p-2">
    <!-- Dashboard -->
    <div class="flex border border-gary-300 p-3 rounded-lg">
      <div class="p-2">
        <label class="pr-2">showAdjacentMonths</label>
        <input 
          v-model="showAdjacentMonths"
          type="checkbox"
        >
      </div>

      <div class="p-2">
        <label class="pr-2">updataByScroll</label>
        <input 
          v-model="updataByScroll"
          type="checkbox"
        >
      </div>

      <div class="p-2">
        <label class="pr-2">selectMode</label>
        <select v-model="selectMode">
          <option
            v-for="option in modeOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </div>
    </div>

    <calendar 
      v-model="value"
      :show-adjacent-months="showAdjacentMonths"
      :update-by-scroll="updataByScroll"
      :select-mode="selectMode"
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
      value: '2021-05-01',
      showAdjacentMonths: false,
      updataByScroll: false,
      selectMode: 'single',
      modeOptions: ['single', 'multiple', 'range']
    }
  }
})
</script>
