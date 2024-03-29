import Vue from 'vue'

// Icon
import IconRight from './../Icon/IconRight.svg'
import IconLeft from './../Icon/IconLeft.svg'

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

  data () {
    return {
      isReversing: false,
    }
  },

  computed: {
    // Annotating Return Types
    // https://vuejs.org/v2/guide/typescript.html#Annotating-Return-Types
    computedTransition (): string {
      return this.isReversing ? 'transition-reversing-slide' : 'transition-slide'
    },
    valueYear() {
      return Number(this.value.split('-')[0])
    },
    valueMonth() {
      return Number(this.value.split('-')[1]) - 1
    },
  },

  watch: {
    value (value: string, oldValue: string) {
      this.isReversing = value < oldValue
    }
  },

  methods: {
    genHeader(): VNode {
      const title = this.$createElement('div', {
        key: this.value,
        staticClass: 'text-center w-full duration-300'
      }, [formatter(this.value)])

      const transition = this.$createElement('transition', {
        props: {
          name: this.computedTransition
        }
      }, [title])
      
      return this.$createElement('div', {
        staticClass: 'flex-1 flex relative overflow-hidden'
      }, [transition])
    },
    genBtn(change: number): VNode {
      const icon = change > 0 ? IconRight : IconLeft

      return this.$createElement('button', {
        staticClass: 'flex justify-center items-center w-8 h-8 bg-transparent hover:bg-gray-200 rounded-full border-transparent hover:border-blue-100 cursor-pointer',
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
      }, [this.$createElement(icon)])
    }
  },  
  render (): VNode {
    return this.$createElement('div', {
      staticClass: 'flex relative items-center py-2'
    }, [
      this.genBtn(-1),
      this.genHeader(),
      this.genBtn(1)
    ])
  }
})