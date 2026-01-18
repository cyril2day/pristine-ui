import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextField from './TextField.vue'

describe('TextField', () => {
  it('renders with default props', () => {
    const wrapper = mount(TextField)

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBeUndefined()
    expect(wrapper.find('.text-field').attributes('data-variant')).toBe('default')
    expect(wrapper.find('.text-field').attributes('data-clearable')).toBeUndefined()
    expect(wrapper.find('.text-field').attributes('data-disabled')).toBeUndefined()
    expect(wrapper.find('.text-field').attributes('data-has-value')).toBeUndefined()
    expect(wrapper.find('.text-field__clear').exists()).toBe(false)
  })

  it('applies variant prop correctly', () => {
    const variants = ['filled', 'default'] as const

    variants.forEach((variant) => {
      const wrapper = mount(TextField, {
        props: { variant },
      })
      expect(wrapper.find('.text-field').attributes('data-variant')).toBe(variant)
    })
  })

  it('applies clearable prop correctly', () => {
    const wrapper = mount(TextField, {
      props: { clearable: true },
    })
    expect(wrapper.find('.text-field').attributes('data-clearable')).toBe('')
  })

  it('does not add data-clearable attribute when clearable is false', () => {
    const wrapper = mount(TextField, {
      props: { clearable: false },
    })
    expect(wrapper.find('.text-field').attributes('data-clearable')).toBeUndefined()
  })

  it('applies disabled prop correctly', () => {
    const wrapper = mount(TextField, {
      props: { disabled: true },
    })
    expect(wrapper.find('.text-field').attributes('data-disabled')).toBe('')
    expect(wrapper.find('input').attributes('disabled')).toBe('')
  })

  it('does not add data-disabled attribute when disabled is false', () => {
    const wrapper = mount(TextField, {
      props: { disabled: false },
    })
    expect(wrapper.find('.text-field').attributes('data-disabled')).toBeUndefined()
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined()
  })

  it('adds data-has-value attribute when modelValue is not empty', async () => {
    const wrapper = mount(TextField, {
      props: { modelValue: 'Hello' },
    })
    expect(wrapper.find('.text-field').attributes('data-has-value')).toBe('')

    await wrapper.setProps({ modelValue: '' })
    expect(wrapper.find('.text-field').attributes('data-has-value')).toBeUndefined()
  })

  it('renders clear button when clearable is true and has value', () => {
    const wrapper = mount(TextField, {
      props: { clearable: true, modelValue: 'test' },
    })
    expect(wrapper.find('.text-field__clear').exists()).toBe(true)
  })

  it('does not render clear button when clearable is false', () => {
    const wrapper = mount(TextField, {
      props: { clearable: false, modelValue: 'test' },
    })
    expect(wrapper.find('.text-field__clear').exists()).toBe(false)
  })

  it('does not render clear button when value is empty', () => {
    const wrapper = mount(TextField, {
      props: { clearable: true, modelValue: '' },
    })
    expect(wrapper.find('.text-field__clear').exists()).toBe(false)
  })

  it('does not render clear button when disabled', () => {
    const wrapper = mount(TextField, {
      props: { clearable: true, modelValue: 'test', disabled: true },
    })
    expect(wrapper.find('.text-field__clear').exists()).toBe(false)
  })

  it('does not render clear button when readonly attribute is present', () => {
    const wrapper = mount(TextField, {
      props: { clearable: true, modelValue: 'test' },
      attrs: { readonly: true },
    })
    expect(wrapper.find('.text-field__clear').exists()).toBe(false)
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(TextField)
    const input = wrapper.find('input')
    await input.setValue('new value')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new value'])
  })

  it('emits clear event when clear button is clicked', async () => {
    const wrapper = mount(TextField, {
      props: { clearable: true, modelValue: 'test' },
    })
    const clearButton = wrapper.find('.text-field__clear')
    await clearButton.trigger('click')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([''])
  })

  it('emits focus event', async () => {
    const wrapper = mount(TextField)
    const input = wrapper.find('input')
    await input.trigger('focus')
    const emitted = wrapper.emitted('focus')
    expect(emitted).toBeDefined()
    expect(emitted!).toHaveLength(1)
    expect(emitted![0]![0] instanceof FocusEvent).toBe(true)
  })

  it('emits blur event', async () => {
    const wrapper = mount(TextField)
    const input = wrapper.find('input')
    await input.trigger('blur')
    const emitted = wrapper.emitted('blur')
    expect(emitted).toBeDefined()
    expect(emitted!).toHaveLength(1)
    expect(emitted![0]![0] instanceof FocusEvent).toBe(true)
  })

  it('passes through arbitrary attributes to the input', () => {
    const wrapper = mount(TextField, {
      attrs: {
        placeholder: 'Enter text',
        type: 'email',
        name: 'email',
        autocomplete: 'off',
      },
    })
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('Enter text')
    expect(input.attributes('type')).toBe('email')
    expect(input.attributes('name')).toBe('email')
    expect(input.attributes('autocomplete')).toBe('off')
  })

  it('respects readonly attribute', () => {
    const wrapper = mount(TextField, {
      attrs: { readonly: true },
    })
    expect(wrapper.find('input').attributes('readonly')).toBe('')
  })
})
