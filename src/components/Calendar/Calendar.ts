import Vue from 'vue'

// Types
import type { VNode } from 'vue'
import type { PropValidator } from 'vue/types/options'

// Components
import CalendarHead from './CalendarHead'
import CalendarTable from './CalendarTable'

export default Vue.extend({
  name: 'Calendar',
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    showAdjacentMonths: {
      type: Boolean,
      default: false
    },
    value: {
      type: Date,
      default: () => new Date()
    } as PropValidator<Date>
  },
  methods: {
    genCalendarHead (): VNode {
      return this.$createElement(CalendarHead, {
        props: {
          value: this.value
        },
        on: {
          input: (value: Date) => {
            this.$emit('input', value)
          }
        }
      })
    },
    genCalendarBody (): VNode {
      return this.$createElement(CalendarTable, {
        props: {
          showAdjacentMonths: this.showAdjacentMonths,
          value: this.value
        }
      })
    }
  },
  render (): VNode {
    return this.$createElement('div', [
      this.genCalendarHead(),
      this.genCalendarBody()
    ])
  }
})