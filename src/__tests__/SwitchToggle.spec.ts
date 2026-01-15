import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SwitchToggle from '../components/SwitchToggle.vue'

describe('SwitchToggle', () => {
  it('renders with default props', () => {
    const wrapper = mount(SwitchToggle, {
      props: {
        modelValue: false
      }
    })
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    expect(wrapper.find('input').element.checked).toBe(false)
    expect(wrapper.find('.pr-switch-visual').exists()).toBe(true)
    expect(wrapper.find('.pr-switch-label').exists()).toBe(false)
    expect(wrapper.find('.pr-switch-helper').exists()).toBe(false)
  })

  it('applies size class', () => {
    const wrapper = mount(SwitchToggle, {
      props: {
        modelValue: false,
        options: { size: 'large' }
      }
    })
    expect(wrapper.find('input').classes()).toContain('pr-switch--large')
  })


  it('sets disabled attribute and class', () => {
    const wrapper = mount(SwitchToggle, {
      props: {
        modelValue: false,
        options: { disabled: true }
      }
    })
    expect(wrapper.find('input').attributes('disabled')).toBe('')
    expect(wrapper.find('input').classes()).toContain('pr-switch--disabled')
  })

  it('sets readonly attribute', () => {
    const wrapper = mount(SwitchToggle, {
      props: {
        modelValue: false,
        options: { readonly: true }
      }
    })
    expect(wrapper.find('input').attributes('readonly')).toBe('')
  })


  it('renders label when provided', () => {
    const wrapper = mount(SwitchToggle, {
      props: {
        modelValue: false,
        options: { label: 'Enable feature' }
      }
    })
    const label = wrapper.find('.pr-switch-label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Enable feature')
    expect(label.attributes('for')).toBe(wrapper.find('input').attributes('id'))
  })

  it('renders helper text when provided', () => {
    const wrapper = mount(SwitchToggle, {
      props: {
        modelValue: false,
        options: { helperText: 'Turn on to activate' }
      }
    })
    const helper = wrapper.find('.pr-switch-helper')
    expect(helper.exists()).toBe(true)
    expect(helper.text()).toBe('Turn on to activate')
  })

  it('emits update:modelValue on change', async () => {
    const wrapper = mount(SwitchToggle, {
      props: {
        modelValue: false
      }
    })
    const input = wrapper.find('input')
    await input.setValue(true)
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
  })

  it('emits change event', async () => {
    const wrapper = mount(SwitchToggle, {
      props: {
        modelValue: false
      }
    })
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('emits focus and blur events', async () => {
    const wrapper = mount(SwitchToggle, {
      props: {
        modelValue: false
      }
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    await input.trigger('blur')
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })

  it('is checked when modelValue is true', () => {
    const wrapper = mount(SwitchToggle, {
      props: {
        modelValue: true
      }
    })
    expect(wrapper.find('input').element.checked).toBe(true)
  })

  it('is not checked when modelValue is false', () => {
    const wrapper = mount(SwitchToggle, {
      props: {
        modelValue: false
      }
    })
    expect(wrapper.find('input').element.checked).toBe(false)
  })

  it('generates unique id when id prop not provided', () => {
    const wrapper = mount(SwitchToggle, {
      props: {
        modelValue: false
      }
    })
    const inputId = wrapper.find('input').attributes('id')
    expect(inputId).toMatch(/^pr-switch-[a-z0-9]+$/)
  })

  it('uses provided id', () => {
    const wrapper = mount(SwitchToggle, {
      props: {
        modelValue: false,
        id: 'custom-id'
      }
    })
    expect(wrapper.find('input').attributes('id')).toBe('custom-id')
  })


})
