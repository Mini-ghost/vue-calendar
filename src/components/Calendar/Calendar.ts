import Vue from 'vue'

// Types
import type { VNode } from 'vue'
import type { PropValidator } from 'vue/types/options'

// Components
import CalendarHead from './CalendarHead'
import CalendarTable from './CalendarTable'

// utils
import { fill } from '@/utils/fill'

type SelectMode = 'single' | 'multiple'

export default Vue.extend({
  name: 'Calendar',
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    selectMode: {
      type: String,
      default: 'single'
    } as PropValidator<SelectMode>,
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
    } as PropValidator<string | string[]>
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
  computed: {
    multipleValue () {
      return this.value 
        ? Array.isArray(this.value) ? this.value : [this.value]
        : []
    }
  },
  methods: {
    onDateClick (value: string) {

      const output = this.selectMode === 'multiple'
        ? this.multipleValue.indexOf(value) === -1
          ? this.multipleValue.concat(value)
          : this.multipleValue.filter(v => v !== value)
        : value

      this.$emit('input', output)
    },
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
          input: this.onDateClick,
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