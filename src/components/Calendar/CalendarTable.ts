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

const createRange = (length: number) => Array.from(({ length }), (_, id) => id)

export default Vue.extend({
  name: 'CalendarTable',

  props: {
    current: {
      type: String,
      required: true
    },
    firstDayOfWeek: {
      type: Number,
      default: 0
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

  data () {
    return {
      isReversing: false,
      wheelThrottle: null as null |  ((e: WheelEvent) => void)
    }
  },

  computed: {
    // Annotating Return Types
    // https://vuejs.org/v2/guide/typescript.html#Annotating-Return-Types
    computedTransition (): string {
      return this.isReversing ? 'transition-reversing-slide' : 'transition-slide'
    },
    tableYear() {
      return Number(this.tableDate.split('-')[0])
    },
    tableMonth() {
      return Number(this.tableDate.split('-')[1]) - 1
    },
    daysInMonth(): number {
      return new Date(this.tableYear, this.tableMonth + 1, 0).getDate()
    },
    weekDays () {
      const first = this.firstDayOfWeek
      return createRange(7)
        .map(id => (['S', 'M', 'T', 'W', 'T', 'F', 'S'])[(id + first) % 7])
    }
  },

  watch: {
    tableDate (value: string, oldValue: string) {
      this.isReversing = value < oldValue
    }
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
    genButton(date: string, isThisMonth: boolean = false): VNode {
      const isCurrent = this.current === date
      const isSelected = this.isSelected(date)

      return this.$createElement('button', {
        staticClass: 'w-8 h-8 rounded-full border select-none',
        class: {
          'bg-transparent text-gray-300': !isThisMonth,
          'cursor-pointer': isThisMonth,
          'border-transparent': !isCurrent,
          'border-blue-500': isCurrent,
          'bg-transparent hover:bg-blue-500 hover:bg-opacity-25': !isSelected && isThisMonth,
          'bg-blue-500 text-white hover:bg-opacity-100': isSelected
        },
        domProps: {
          type: 'button',
          disabled: !isThisMonth
        },
        on: {
          click: () => {
            this.$emit('input', date)
          }
        }
      }, [formatter(date)])
    },
    genTable () {
      return this.$createElement('table', {
        key: this.tableDate,
        staticClass: 'w-full table-fixed duration-300'
      }, [
        this.genHead(),
        this.genBody()
      ])
    },
    genHead (): VNode {
      const row = this.genTr(this.weekDays.map(day => {
        return this.$createElement('th', [day])
      }))
      return this.$createElement('thead', row)
    },
    genBody (): VNode {
      const children: VNodeChildren = []
      let row: VNodeChildren = []

      let day = new Date(this.tableYear, this.tableMonth, 1).getDay()
      day = (day - this.firstDayOfWeek + 7) % 7

      if(day < 0) { Math.abs(day) } 
  
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
      for(let i = 1; i <= this.daysInMonth; i++) {
        const date = `${this.tableYear}-${fill(this.tableMonth + 1)}-${fill(i)}`

        row.push(this.$createElement('td', [this.genButton(date, true)]))

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
    const transition = this.$createElement('transition', {
      props: {
        name: this.computedTransition
      }
    }, [this.genTable()])

    return this.$createElement('div', {
      staticClass: 'relative h-246px',
      on: this.updateByScroll
        ? {
          /**
           * @see https://github.com/vuetifyjs/vuetify/issues/5546 [Bug Report] Datepicker scroll is way too sensitive on mac
           * @see https://github.com/vuetifyjs/vuetify/pull/11372 fix(VDatePicker): throttle scroll with using scrollable prop 
           */
          wheel: this.wheelThrottle || noop
        }
        : undefined
    }, [transition])
  }
})