import Vue from 'vue'

// Types
import type { 
  VNode,
  VNodeChildren
} from 'vue'
import type { PropValidator } from 'vue/types/options'

import { fill } from '@/utils/fill'
import { genFormatter } from '@/utils/genFormatter'

const formatter = genFormatter('en-US', { day: 'numeric', timeZone: 'UTC' })

export default Vue.extend({
  name: 'CalendarTable',

  props: {
    showAdjacentMonths: {
      type: Boolean,
      default: false
    },
    value: {
      type: Date,
      required: true
    } as PropValidator<Date>
  },

  computed: {
    valueYear() {
      return this.value.getFullYear()
    },
    valueMonth() {
      return this.value.getMonth()
    }
  },

  methods: {
    genHead (): VNode {
      const row = this.genTr(['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => {
        return this.$createElement('th', [day])
      }))
      return this.$createElement('thead', row)
    },
    genBody (): VNode {
      const children: VNodeChildren = []
      let row: VNodeChildren = []

      const daysInMonth = new Date(this.valueYear, this.valueMonth + 1, 0).getDate() 
      let day = new Date(this.valueYear, this.valueMonth, 1).getDay()
  
      // 產生上個月會出現在該月份日曆上的部分
      const prevMonthYear = this.valueMonth ? this.valueYear : this.valueYear - 1
      const prevMonth = (this.valueMonth + 11) % 12

      const lastDateOfPreviousMonth = new Date(
        this.valueYear, 
        this.valueMonth, 0
      ).getDate()

      while(day--) {
        const date = `${prevMonthYear}-${fill(prevMonth + 1)}-${lastDateOfPreviousMonth - day}`
        row.push(this.$createElement('td', this.showAdjacentMonths 
          ? [formatter(date)] 
          : []
        ))
      }

      // 產生這個月的日期
      for(let i = 1; i <= daysInMonth; i++) {
        const date = `${this.valueYear}-${fill(this.valueMonth + 1)}-${fill(i)}`

        row.push(this.$createElement('td', [formatter(date)]))

        if(row.length === 7) {
          children.push(this.genTr(row))
          row = []
        }
      }

      // 產生下個月會出現在該月份日曆上的部分
      const nextMonthYear = this.valueMonth === 11 
        ? this.valueYear + 1 
        : this.valueYear

      const nextMonth = (this.valueMonth + 1) % 12
      let nextMonthDay = 1

      while (row.length < 7) {
        const date = `${nextMonthYear}-${fill(nextMonth + 1)}-${fill(nextMonthDay++)}`
        row.push(this.$createElement('td', this.showAdjacentMonths 
          ? [formatter(date)] 
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

    }, [
      this.genHead(),
      this.genBody()
    ])
  }
})