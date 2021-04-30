import Vue from 'vue'

// Types
import type { VNode } from 'vue'
import type { PropValidator } from 'vue/types/options'

import { genFormatter } from '@/utils/genFormatter'

const formatter = genFormatter('en-US', {
  year: 'numeric',
  month: 'long',
  timeZone: 'UTC'
})

export default Vue.extend({
  name: 'CalendarHead',
  props: {
    value: {
      type: Date,
      required: true
    } as PropValidator<Date>
  },
  methods: {
    genHeader(): VNode {
      return this.$createElement('span', [formatter(this.value)])
    }
  },  
  render (): VNode {
    return this.$createElement('div', {

    }, [
      this.genHeader()
    ])
  }
})