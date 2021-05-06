<template>
  <div class="p-2">
    <!-- Dashboard -->
    <div class="flex border border-gary-300 p-3 rounded-lg">
      <div class="p-2">
        <label>
          <span class="pr-2">showAdjacentMonths</span>
          <input 
            v-model="showAdjacentMonths"
            type="checkbox"
          >
        </label>
      </div>

      <div class="p-2">
        <label>
          <span class="pr-2">updataByScroll</span>
          <input 
            v-model="updataByScroll"
            type="checkbox"
          >
        </label>
      </div>

      <div class="p-2">
        <label>
          <span class="pr-2">selectMode</span>
          <select v-model="selectMode">
            <option
              v-for="option in modeOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </label>
      </div>
    </div>

    <calendar
      v-model="value"
      class="my-4"
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
      value: '2021-05-01' as string | string[],
      showAdjacentMonths: false,
      updataByScroll: false,
      selectMode: 'single',
      modeOptions: ['single', 'multiple', 'range']
    }
  },
  watch: {
    selectMode(mode: 'single' | 'multiple' | 'range') {
      this.value = mode === 'range'
        ? [] as string[]
        : '2021-05-01'
    }
  }
})
</script>
