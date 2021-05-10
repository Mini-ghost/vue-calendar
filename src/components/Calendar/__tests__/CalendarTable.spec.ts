import {
  mount,
  MountOptions,
  Wrapper
} from '@vue/test-utils'

import CalendarTable from './../CalendarTable'

describe('CalendarTable.ts', () => {
  type Instance = InstanceType<typeof CalendarTable>
  let mountFunction: (options?: MountOptions<Instance>) => Wrapper<Instance>

  beforeEach(() => {
    mountFunction = (options?: MountOptions<Instance>) => {
      return mount(CalendarTable, options)
    }
  })

  it('should emit event when date button is clicked', () => {
    const wrapper = mountFunction({
      propsData: {
        value: '2021-05-02',
        tableDate: '2021-05',
        current: '2021-05-10'
      }
    })

    const input = jest.fn()
    wrapper.vm.$on('input', input)

    wrapper.findAll('button').at(0).trigger('click')
    expect(input).toHaveBeenCalledWith('2021-05-01')

    wrapper.findAll('button').at(2).trigger('click')
    expect(input).toHaveBeenCalledWith('2021-05-03')
  })

  it('should emit update:table-date event when scrolled and scrollable', async () => {
    const wrapper = mountFunction({
      propsData: {
        value: '2021-05-02',
        tableDate: '2021-05',
        current: '2021-05-10',
        updateByScroll: true,
      }
    })

    const wheel = jest.fn()
    wrapper.vm.$on('update:table-date', wheel)

    wrapper.trigger('wheel', { deltaY: 50 })
    expect(wheel).toHaveBeenCalledWith('2021-06')

    await new Promise((resolve) => setTimeout(resolve, 300))

    wrapper.trigger('wheel', { deltaY: -50 })
    expect(wheel).toHaveBeenCalledWith('2021-04')
  })

  it('should not emit update:table-date event when scrollable but updateByScroll is false', () => {
    const wrapper = mountFunction({
      propsData: {
        value: '2021-05-02',
        tableDate: '2021-05',
        current: '2021-05-10',
      },
    })

    const wheel = jest.fn()
    wrapper.vm.$on('update:table-date', wheel)

    wrapper.trigger('wheel', { deltaY: -50 })
    expect(wheel).not.toHaveBeenCalled()
  })
})