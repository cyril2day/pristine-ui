import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextArea from './TextArea.vue'

describe('TextArea', () => {
  it('renders with default props', () => {
    const wrapper = mount(TextArea)

    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
    expect(textarea.attributes('placeholder')).toBeUndefined()
    expect(wrapper.find('.text-area').attributes('data-variant')).toBe('default')
    expect(wrapper.find('.text-area').attributes('data-resizable')).toBe('')
    expect(wrapper.find('.text-area').attributes('data-disabled')).toBeUndefined()
    expect(wrapper.find('.text-area').attributes('data-has-value')).toBeUndefined()
    expect(wrapper.find('.text-area').attributes('data-counter-visible')).toBeUndefined()
    expect(wrapper.find('.text-area').attributes('data-counter-exceeded')).toBeUndefined()
    expect(wrapper.find('.text-area__counter').exists()).toBe(false)
  })

  it('applies variant prop correctly', () => {
    const variants = ['filled', 'default'] as const

    variants.forEach((variant) => {
      const wrapper = mount(TextArea, {
        props: { variant },
      })
      expect(wrapper.find('.text-area').attributes('data-variant')).toBe(variant)
    })
  })

  it('applies resizable prop correctly', () => {
    const wrapper = mount(TextArea, {
      props: { resizable: true },
    })
    expect(wrapper.find('.text-area').attributes('data-resizable')).toBe('')

    const wrapperNotResizable = mount(TextArea, {
      props: { resizable: false },
    })
    expect(wrapperNotResizable.find('.text-area').attributes('data-resizable')).toBeUndefined()
  })

  it('applies disabled prop correctly', () => {
    const wrapper = mount(TextArea, {
      props: { disabled: true },
    })
    expect(wrapper.find('.text-area').attributes('data-disabled')).toBe('')
    expect(wrapper.find('textarea').attributes('disabled')).toBe('')
  })

  it('does not add data-disabled attribute when disabled is false', () => {
    const wrapper = mount(TextArea, {
      props: { disabled: false },
    })
    expect(wrapper.find('.text-area').attributes('data-disabled')).toBeUndefined()
    expect(wrapper.find('textarea').attributes('disabled')).toBeUndefined()
  })

  it('adds data-has-value attribute when modelValue is not empty', async () => {
    const wrapper = mount(TextArea, {
      props: { modelValue: 'Hello' },
    })
    expect(wrapper.find('.text-area').attributes('data-has-value')).toBe('')

    await wrapper.setProps({ modelValue: '' })
    expect(wrapper.find('.text-area').attributes('data-has-value')).toBeUndefined()
  })

  it('applies showCounter prop correctly', () => {
    const wrapper = mount(TextArea, {
      props: { showCounter: true },
    })
    expect(wrapper.find('.text-area').attributes('data-counter-visible')).toBe('')
    expect(wrapper.find('.text-area__counter').exists()).toBe(true)
  })

  it('does not add data-counter-visible attribute when showCounter is false', () => {
    const wrapper = mount(TextArea, {
      props: { showCounter: false },
    })
    expect(wrapper.find('.text-area').attributes('data-counter-visible')).toBeUndefined()
    expect(wrapper.find('.text-area__counter').exists()).toBe(false)
  })

  it('adds data-counter-exceeded attribute when length exceeds maxLength', async () => {
    const wrapper = mount(TextArea, {
      props: { maxLength: 5, modelValue: 'abcdef' },
    })
    expect(wrapper.find('.text-area').attributes('data-counter-exceeded')).toBe('')

    await wrapper.setProps({ modelValue: 'abc' })
    expect(wrapper.find('.text-area').attributes('data-counter-exceeded')).toBeUndefined()
  })

  it('does not add data-counter-exceeded attribute when maxLength is undefined', () => {
    const wrapper = mount(TextArea, {
      props: { maxLength: undefined, modelValue: 'abcdef' },
    })
    expect(wrapper.find('.text-area').attributes('data-counter-exceeded')).toBeUndefined()
  })

  it('renders character counter with maxLength', () => {
    const wrapper = mount(TextArea, {
      props: { showCounter: true, maxLength: 10, modelValue: 'Hello' },
    })
    const counter = wrapper.find('.text-area__counter')
    expect(counter.exists()).toBe(true)
    expect(counter.text()).toContain('5')
    expect(counter.text()).toContain('/ 10')
  })

  it('renders character counter without maxLength', () => {
    const wrapper = mount(TextArea, {
      props: { showCounter: true, modelValue: 'Hello World' },
    })
    const counter = wrapper.find('.text-area__counter')
    expect(counter.exists()).toBe(true)
    expect(counter.text()).toBe('11')
    expect(counter.text()).not.toContain('/')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(TextArea)
    const textarea = wrapper.find('textarea')
    await textarea.setValue('new value')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new value'])
  })

  it('emits focus event', async () => {
    const wrapper = mount(TextArea)
    const textarea = wrapper.find('textarea')
    await textarea.trigger('focus')
    const emitted = wrapper.emitted('focus')
    expect(emitted).toBeDefined()
    expect(emitted!).toHaveLength(1)
    expect(emitted![0]![0] instanceof FocusEvent).toBe(true)
  })

  it('emits blur event', async () => {
    const wrapper = mount(TextArea)
    const textarea = wrapper.find('textarea')
    await textarea.trigger('blur')
    const emitted = wrapper.emitted('blur')
    expect(emitted).toBeDefined()
    expect(emitted!).toHaveLength(1)
    expect(emitted![0]![0] instanceof FocusEvent).toBe(true)
  })

  it('passes through arbitrary attributes to the textarea', () => {
    const wrapper = mount(TextArea, {
      attrs: {
        placeholder: 'Enter text',
        name: 'description',
        autocomplete: 'off',
        readonly: true,
      },
    })
    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('placeholder')).toBe('Enter text')
    expect(textarea.attributes('name')).toBe('description')
    expect(textarea.attributes('autocomplete')).toBe('off')
    expect(textarea.attributes('readonly')).toBe('')
  })

  it('respects rows and cols props', () => {
    const wrapper = mount(TextArea, {
      props: { rows: 5, cols: 40 },
    })
    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('rows')).toBe('5')
    expect(textarea.attributes('cols')).toBe('40')
  })

  it('applies aria-invalid when exceeding maxLength', async () => {
    const wrapper = mount(TextArea, {
      props: { maxLength: 5, modelValue: 'abcdef' },
    })
    expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true')

    await wrapper.setProps({ modelValue: 'abc' })
    expect(wrapper.find('textarea').attributes('aria-invalid')).toBeUndefined()
  })
})
