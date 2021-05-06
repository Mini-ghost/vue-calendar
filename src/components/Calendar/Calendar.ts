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
    updateByScroll: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Array],
      required: true
    }
  },
  data() {
    const now = new Date()
    return {
      now,
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
      const { now } = this
      const current = 
        `${now.getFullYear()}-${fill(now.getMonth() + 1)}-${fill(now.getDate())}`

      return this.$createElement(CalendarTable, {
        props: {
          current,
          showAdjacentMonths: this.showAdjacentMonths,
          tableDate: this.tableDate,
          updateByScroll: this.updateByScroll,
          value: this.value
        },
        on: {
          input: (value: Date) => {
            this.$emit('input', value)
          },
          'update:table-date': (value: string) => this.tableDate = value 
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