import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Checkbox from '../components/Checkbox.vue'

describe('Checkbox', () => {
  it('renders with default props', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false
      }
    })
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    expect(wrapper.find('input').element.checked).toBe(false)
    expect(wrapper.find('.pr-checkbox-visual').exists()).toBe(true)
    expect(wrapper.find('.pr-checkbox-label').exists()).toBe(false)
    expect(wrapper.find('.pr-checkbox-helper').exists()).toBe(false)
  })

  it('applies size class', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false,
        options: { size: 'large' }
      }
    })
    expect(wrapper.find('input').classes()).toContain('pr-checkbox--large')
  })


  it('sets disabled attribute and class', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false,
        options: { disabled: true }
      }
    })
    expect(wrapper.find('input').attributes('disabled')).toBe('')
    expect(wrapper.find('input').classes()).toContain('pr-checkbox--disabled')
  })

  it('sets readonly attribute', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false,
        options: { readonly: true }
      }
    })
    expect(wrapper.find('input').attributes('readonly')).toBe('')
  })

  it('sets required attribute', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false,
        options: { required: true }
      }
    })
    expect(wrapper.find('input').attributes('required')).toBe('')
  })

  it('renders label when provided', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false,
        options: { label: 'Accept terms' }
      }
    })
    const label = wrapper.find('.pr-checkbox-label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Accept terms')
    expect(label.attributes('for')).toBe(wrapper.find('input').attributes('id'))
  })

  it('renders helper text when provided', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false,
        options: { helperText: 'Required field' }
      }
    })
    const helper = wrapper.find('.pr-checkbox-helper')
    expect(helper.exists()).toBe(true)
    expect(helper.text()).toBe('Required field')
  })

  it('emits update:modelValue on change', async () => {
    const wrapper = mount(Checkbox, {
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
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false
      }
    })
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('emits focus and blur events', async () => {
    const wrapper = mount(Checkbox, {
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

  it('handles indeterminate prop', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false,
        indeterminate: true
      }
    })
    expect(wrapper.find('input').attributes('aria-checked')).toBe('mixed')
    expect(wrapper.find('.pr-checkbox-visual--indeterminate').exists()).toBe(true)
  })

  it('handles array modelValue', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: ['a', 'b'],
        value: 'a'
      }
    })
    expect(wrapper.find('input').element.checked).toBe(true)
  })

  it('generates unique id when id prop not provided', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false
      }
    })
    const inputId = wrapper.find('input').attributes('id')
    expect(inputId).toMatch(/^pr-checkbox-[a-z0-9]+$/)
  })

  it('uses provided id', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false,
        id: 'custom-id'
      }
    })
    expect(wrapper.find('input').attributes('id')).toBe('custom-id')
  })
})
