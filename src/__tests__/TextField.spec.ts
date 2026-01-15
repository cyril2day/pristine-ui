import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextField from '../components/TextField.vue'

describe('TextField', () => {
  it('renders with default props', () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: ''
      }
    })
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('type')).toBe('text')
    expect(wrapper.find('input').element.value).toBe('')
    expect(wrapper.find('input').classes()).toContain('pr-text-field')
    expect(wrapper.find('input').classes()).toContain('pr-text-field--regular')
    expect(wrapper.find('input').classes()).toContain('pr-text-field--default')
    expect(wrapper.find('.pr-text-field-label').exists()).toBe(false)
    expect(wrapper.find('.pr-text-field-helper').exists()).toBe(false)
    expect(wrapper.find('.pr-text-field-clear').exists()).toBe(false)
  })

  it('applies size class', () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: '',
        options: { size: 'large' }
      }
    })
    expect(wrapper.find('input').classes()).toContain('pr-text-field--large')
  })

  it('applies variant class', () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: '',
        options: { variant: 'filled' }
      }
    })
    expect(wrapper.find('input').classes()).toContain('pr-text-field--filled')
  })

  it('sets disabled attribute and class', () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: '',
        options: { disabled: true }
      }
    })
    expect(wrapper.find('input').attributes('disabled')).toBe('')
    expect(wrapper.find('input').classes()).toContain('pr-text-field--disabled')
  })

  it('sets readonly attribute', () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: '',
        options: { readonly: true }
      }
    })
    expect(wrapper.find('input').attributes('readonly')).toBe('')
  })

  it('sets placeholder attribute', () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: '',
        options: { placeholder: 'Enter text' }
      }
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text')
  })

  it('sets type attribute', () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: '',
        options: { type: 'email' }
      }
    })
    expect(wrapper.find('input').attributes('type')).toBe('email')
  })

  it('renders label when provided', () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: '',
        options: { label: 'Email address' }
      }
    })
    const label = wrapper.find('.pr-text-field-label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Email address')
    expect(label.attributes('for')).toBe(wrapper.find('input').attributes('id'))
  })

  it('renders helper text when provided', () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: '',
        options: { helperText: 'Required field' }
      }
    })
    const helper = wrapper.find('.pr-text-field-helper')
    expect(helper.exists()).toBe(true)
    expect(helper.text()).toBe('Required field')
  })

  it('shows clear button when clearable is true and modelValue is not empty', async () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: 'Hello',
        options: { clearable: true }
      }
    })
    const clearBtn = wrapper.find('.pr-text-field-clear')
    expect(clearBtn.exists()).toBe(true)
    expect(clearBtn.attributes('aria-label')).toBe('Clear input')

    await clearBtn.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('does not show clear button when modelValue is empty', () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: '',
        options: { clearable: true }
      }
    })
    expect(wrapper.find('.pr-text-field-clear').exists()).toBe(false)
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: ''
      }
    })
    const input = wrapper.find('input')
    await input.setValue('new value')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new value'])
  })

  it('emits focus and blur events', async () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: ''
      }
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    await input.trigger('blur')
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })

  it('emits keydown event', async () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: ''
      }
    })
    const input = wrapper.find('input')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('keydown')).toHaveLength(1)
  })

  it('generates unique id when id prop not provided', () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: ''
      }
    })
    const inputId = wrapper.find('input').attributes('id')
    expect(inputId).toMatch(/^pr-text-field-[a-z0-9]+$/)
  })

  it('uses provided id', () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: '',
        id: 'custom-id'
      }
    })
    expect(wrapper.find('input').attributes('id')).toBe('custom-id')
  })

  it('applies autocomplete and required attributes', () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: '',
        options: { autocomplete: 'email', required: true }
      }
    })
    expect(wrapper.find('input').attributes('autocomplete')).toBe('email')
    expect(wrapper.find('input').attributes('required')).toBe('')
  })
})
