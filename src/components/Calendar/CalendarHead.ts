import Vue from 'vue'

// Types
import type { VNode } from 'vue'
import type { PropValidator } from 'vue/types/options'

import { fill } from '@/utils/fill'
import { genFormatter } from '@/utils/genFormatter'

const formatter = genFormatter('en-US', {
  year: 'numeric',
  month: 'long'
})

export default Vue.extend({
  name: 'CalendarHead',
  props: {
    value: {
      type: String,
      required: true
    } as PropValidator<string>
  },

  computed: {
    valueYear() {
      return Number(this.value.split('-')[0])
    },
    valueMonth() {
      return Number(this.value.split('-')[1]) - 1
    },
  },

  methods: {
    genHeader(): VNode {
      return this.$createElement('span', [formatter(this.value)])
    },
    genBtn(change: number): VNode {
      return this.$createElement('button', {
        on: {
          click: (e: Event) => {
            e.stopPropagation()

            let year: number
            let month: number
            
            if(change > 0) {
              year = this.valueMonth === 11
                ? this.valueYear + 1 
                : this.valueYear

              month = (this.valueMonth + 1) % 12
            } else {
              year = this.valueMonth ? this.valueYear : this.valueYear - 1
              month = (this.valueMonth + 11) % 12
            }

            const date = `${year}-${fill(month + 1)}`
            this.$emit('input', date)
          }
        }
      }, [change > 0 ? 'Next' : 'Prev'])
    }
  },  
  render (): VNode {
    return this.$createElement('div', {

    }, [
      this.genBtn(-1),
      this.genHeader(),
      this.genBtn(1)
    ])
  }
})