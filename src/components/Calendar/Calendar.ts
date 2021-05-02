import Vue from 'vue'

// Types
import type { VNode } from 'vue'
import type { PropValidator } from 'vue/types/options'

// Components
import CalendarHead from './CalendarHead'
import CalendarTable from './CalendarTable'

// utils
import { fill } from '@/utils/fill'

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
  data() {
    const now = new Date()
    return {
      tableDate: (() => {
        const date = `${now.getFullYear()}-${fill(now.getMonth() + 1)}`
        return date
      })()
    }
  },
  methods: {
    genCalendarHead (): VNode {
      return this.$createElement(CalendarHead, {
        props: {
          value: this.tableDate
        },
        on: {
          input: (value: string) => {
            this.tableDate = value
          }
        }
      })
    },
    genCalendarBody (): VNode {
      return this.$createElement(CalendarTable, {
        props: {
          showAdjacentMonths: this.showAdjacentMonths,
          tableDate: this.tableDate,
          value: this.value
        },
        on: {
          input: (value: Date) => {
            this.$emit('input', value)
          }
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