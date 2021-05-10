import {
  mount,
  MountOptions,
  Wrapper,
} from '@vue/test-utils'

import CalendarHead from '../CalendarHead'

describe('CalendarHead.ts', () => {
  type Instance = InstanceType<typeof CalendarHead>
  let mountFunction: (options?: MountOptions<Instance>) => Wrapper<Instance>
  
  beforeEach(() => {
    mountFunction = (options?: MountOptions<Instance>) => {
      return mount(CalendarHead, options)
    }
  })

  it('should trigger event on arrows click', () => {
    const wrapper = mountFunction({
      propsData: {
        value: '2021-01',
      },
    })

    const input = jest.fn()
    wrapper.vm.$on('input', input)

    wrapper.findAll('button').at(0).trigger('click')
    expect(input).toHaveBeenCalledWith('2020-12')

    wrapper.findAll('button').at(1).trigger('click')
    expect(input).toHaveBeenCalledWith('2021-02')
  })
})
