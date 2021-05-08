import Vue from 'vue'

// Types
import type { VNode } from 'vue'
import type { PropValidator } from 'vue/types/options'

// Components
import CalendarHead from './CalendarHead'
import CalendarTable from './CalendarTable'

// utils
import { fill } from '@/utils/fill'

// CSS
import 'windi.css'
import '@/assets/transition.scss'

declare function parseInt(s: string | number, radix?: number): number;

type SelectMode = 'single' | 'multiple' | 'range'

export default Vue.extend({
  name: 'Calendar',
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    firstDayOfWeek: {
      type: [String, Number],
      default: 0
    },
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
    },
    computedFirstDayOfWeek () {
      return parseInt(Number(this.firstDayOfWeek) % 7, 10)
    }
  },
  methods: {
    onDateClick (value: string) {
      if (this.selectMode === 'range') {
        if(this.multipleValue.length !== 1) {
          this.$emit('input', [value])
        } else {
          const output = [this.multipleValue[0], value]
          this.$emit('input', output)
          this.$emit('change', output)
        }
        return
      }

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
          firstDayOfWeek: this.computedFirstDayOfWeek,
          isRange: this.selectMode === 'range',
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
    return this.$createElement('div', {
      staticClass: 'w-290px px-3 py-2 border border-gray-200 rounded-lg overflow-hidden'
    },[
      this.genCalendarHead(),
      this.genCalendarBody()
    ])
  }
})