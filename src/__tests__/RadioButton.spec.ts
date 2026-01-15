import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RadioButton from '../components/RadioButton.vue'

describe('RadioButton', () => {
  it('renders with default props', () => {
    const wrapper = mount(RadioButton, {
      props: {
        modelValue: 'option1',
        value: 'option1'
      }
    })
    expect(wrapper.find('input[type="radio"]').exists()).toBe(true)
    expect(wrapper.find('input').element.checked).toBe(true)
    expect(wrapper.find('.pr-radio-visual').exists()).toBe(true)
    expect(wrapper.find('.pr-radio-label').exists()).toBe(false)
    expect(wrapper.find('.pr-radio-helper').exists()).toBe(false)
  })

  it('applies size class', () => {
    const wrapper = mount(RadioButton, {
      props: {
        modelValue: '',
        value: 'option1',
        options: { size: 'large' }
      }
    })
    expect(wrapper.find('input').classes()).toContain('pr-radio--large')
  })


  it('sets disabled attribute and class', () => {
    const wrapper = mount(RadioButton, {
      props: {
        modelValue: '',
        value: 'option1',
        options: { disabled: true }
      }
    })
    expect(wrapper.find('input').attributes('disabled')).toBe('')
    expect(wrapper.find('input').classes()).toContain('pr-radio--disabled')
  })

  it('sets readonly attribute', () => {
    const wrapper = mount(RadioButton, {
      props: {
        modelValue: '',
        value: 'option1',
        options: { readonly: true }
      }
    })
    expect(wrapper.find('input').attributes('readonly')).toBe('')
  })

  it('sets required attribute', () => {
    const wrapper = mount(RadioButton, {
      props: {
        modelValue: '',
        value: 'option1',
        options: { required: true }
      }
    })
    expect(wrapper.find('input').attributes('required')).toBe('')
  })

  it('renders label when provided', () => {
    const wrapper = mount(RadioButton, {
      props: {
        modelValue: '',
        value: 'option1',
        options: { label: 'Option 1' }
      }
    })
    const label = wrapper.find('.pr-radio-label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Option 1')
    expect(label.attributes('for')).toBe(wrapper.find('input').attributes('id'))
  })

  it('renders helper text when provided', () => {
    const wrapper = mount(RadioButton, {
      props: {
        modelValue: '',
        value: 'option1',
        options: { helperText: 'Select this option' }
      }
    })
    const helper = wrapper.find('.pr-radio-helper')
    expect(helper.exists()).toBe(true)
    expect(helper.text()).toBe('Select this option')
  })

  it('emits update:modelValue on change', async () => {
    const wrapper = mount(RadioButton, {
      props: {
        modelValue: '',
        value: 'option1'
      }
    })
    const input = wrapper.find('input')
    await input.setValue(true)
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['option1'])
  })

  it('emits change event', async () => {
    const wrapper = mount(RadioButton, {
      props: {
        modelValue: '',
        value: 'option1'
      }
    })
    const input = wrapper.find('input')
    await input.setValue(true)
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('change')![0]).toEqual(['option1'])
  })

  it('emits focus and blur events', async () => {
    const wrapper = mount(RadioButton, {
      props: {
        modelValue: '',
        value: 'option1'
      }
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    await input.trigger('blur')
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })

  it('is checked when modelValue matches value', () => {
    const wrapper = mount(RadioButton, {
      props: {
        modelValue: 'option2',
        value: 'option2'
      }
    })
    expect(wrapper.find('input').element.checked).toBe(true)
  })

  it('is not checked when modelValue differs', () => {
    const wrapper = mount(RadioButton, {
      props: {
        modelValue: 'option1',
        value: 'option2'
      }
    })
    expect(wrapper.find('input').element.checked).toBe(false)
  })

  it('generates unique id when id prop not provided', () => {
    const wrapper = mount(RadioButton, {
      props: {
        modelValue: '',
        value: 'option1'
      }
    })
    const inputId = wrapper.find('input').attributes('id')
    expect(inputId).toMatch(/^pr-radio-[a-z0-9]+$/)
  })

  it('uses provided id', () => {
    const wrapper = mount(RadioButton, {
      props: {
        modelValue: '',
        value: 'option1',
        id: 'custom-id'
      }
    })
    expect(wrapper.find('input').attributes('id')).toBe('custom-id')
  })
})
