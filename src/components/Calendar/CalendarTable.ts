import Vue from 'vue'

// Types
import type { 
  VNode,
  VNodeChildren
} from 'vue'
import type { PropValidator } from 'vue/types/options'

import { fill } from '@/utils/fill'
import { genFormatter } from '@/utils/genFormatter'
import { throttle } from '@/utils/throttle'

const noop = () => {}
const formatter = genFormatter('en-US', { day: 'numeric', timeZone: 'UTC' })

export default Vue.extend({
  name: 'CalendarTable',

  props: {
    current: {
      type: String,
      required: true
    },
    isRange: {
      type: Boolean,
      default: false
    },
    showAdjacentMonths: {
      type: Boolean,
      default: false
    },
    tableDate: {
      type: String,
      required: true
    } as PropValidator<string>,
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
    return {
      wheelThrottle: null as null |  ((e: WheelEvent) => void)
    }
  },

  computed: {
    tableYear() {
      return Number(this.tableDate.split('-')[0])
    },
    tableMonth() {
      return Number(this.tableDate.split('-')[1]) - 1
    },
  },

  created () {
    this.wheelThrottle = throttle(this.onWheel, 250)
  },

  methods: {
    isSelected (value: string) {
      if(Array.isArray(this.value)) {
        if(this.isRange && this.value.length === 2) {
          const [from, to] = this.value.slice().sort()
          return from <= value && to >= value
        }
        return this.value.includes(value)
      }

      return this.value === value
    },
    onWheel (e: WheelEvent) {
      e.stopPropagation()

      let year: number
      let month: number
      if (e.deltaY > 0) {
        year = this.tableMonth === 11
          ? this.tableYear + 1
          : this.tableYear
        
        month = (this.tableMonth + 1) % 12

      } else {
        year = this.tableMonth ? this.tableYear : this.tableYear - 1
        month = (this.tableMonth + 11) % 12
      }
        
      this.$emit('update:table-date', `${year}-${fill(month + 1)}`)
    },
    genButton(date: string): VNode {
      const isCurrent = this.current === date
      return this.$createElement('button', {
        class: {
          // TODO: 制定 Class 命名規則
          'current': isCurrent,
          'selected': this.isSelected(date)
        },
        on: {
          click: () => {
            this.$emit('input', date)
          }
        }
      }, [formatter(date)])
    },
    genHead (): VNode {
      const row = this.genTr(['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => {
        return this.$createElement('th', [day])
      }))
      return this.$createElement('thead', row)
    },
    genBody (): VNode {
      const children: VNodeChildren = []
      let row: VNodeChildren = []

      const daysInMonth = new Date(this.tableYear, this.tableMonth + 1, 0).getDate() 
      let day = new Date(this.tableYear, this.tableMonth, 1).getDay()
  
      // 產生上個月會出現在該月份日曆上的部分
      const prevMonthYear = this.tableMonth ? this.tableYear : this.tableYear - 1
      const prevMonth = (this.tableMonth + 11) % 12

      const lastDateOfPreviousMonth = new Date(
        this.tableYear, 
        this.tableMonth, 0
      ).getDate()

      while(day--) {
        const date = `${prevMonthYear}-${fill(prevMonth + 1)}-${lastDateOfPreviousMonth - day}`
        row.push(this.$createElement('td', this.showAdjacentMonths 
          ? [this.genButton(date)]
          : []
        ))
      }

      // 產生這個月的日期
      for(let i = 1; i <= daysInMonth; i++) {
        const date = `${this.tableYear}-${fill(this.tableMonth + 1)}-${fill(i)}`

        row.push(this.$createElement('td', [this.genButton(date)]))

        if(row.length === 7) {
          children.push(this.genTr(row))
          row = []
        }
      }

      // 產生下個月會出現在該月份日曆上的部分
      const nextMonthYear = this.tableMonth === 11 
        ? this.tableYear + 1 
        : this.tableYear

      const nextMonth = (this.tableMonth + 1) % 12
      let nextMonthDay = 1

      while (row.length < 7) {
        const date = `${nextMonthYear}-${fill(nextMonth + 1)}-${fill(nextMonthDay++)}`
        row.push(this.$createElement('td', this.showAdjacentMonths 
          ? [this.genButton(date)] 
          : []
        ))
      }

      children.push(this.genTr(row))

      return this.$createElement('tbody', children)
    },
    genTr (children: VNodeChildren): VNode[] {
      return [this.$createElement('tr', [children])]
    }
  },

  render (): VNode {
    return this.$createElement('table', {
      on: this.updateByScroll
        ? {
          /**
           * @see https://github.com/vuetifyjs/vuetify/issues/5546 [Bug Report] Datepicker scroll is way too sensitive on mac
           * @see https://github.com/vuetifyjs/vuetify/pull/11372 fix(VDatePicker): throttle scroll with using scrollable prop 
           */
          wheel: this.wheelThrottle || noop
        }
        : undefined
    }, [
      this.genHead(),
      this.genBody()
    ])
  }
})