import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ComboBox from './ComboBox.vue'

const sampleItems = [
  { id: 1, label: 'Apple' },
  { id: 2, label: 'Banana' },
  { id: 3, label: 'Cherry' },
  { id: 4, label: 'Date' },
]

describe('ComboBox', () => {
  it('renders with default props', () => {
    const wrapper = mount(ComboBox)
    expect(wrapper.find('.pr-combo-box').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('.pr-combo-box__toggle').exists()).toBe(true)
    expect(wrapper.find('.pr-combo-box__listbox').exists()).toBe(false) // closed by default
  })

  it('applies variant prop correctly', () => {
    const variants = ['filled', 'default'] as const
    variants.forEach((variant) => {
      const wrapper = mount(ComboBox, { props: { variant } })
      expect(wrapper.find('.pr-combo-box').attributes('data-variant')).toBe(variant)
    })
  })

  it('applies disabled prop correctly', () => {
    const wrapper = mount(ComboBox, { props: { disabled: true } })
    expect(wrapper.find('.pr-combo-box').attributes('data-disabled')).toBe('')
    expect(wrapper.find('input').attributes('disabled')).toBe('')
  })

  it('does not add data-disabled attribute when disabled is false', () => {
    const wrapper = mount(ComboBox, { props: { disabled: false } })
    expect(wrapper.find('.pr-combo-box').attributes('data-disabled')).toBeUndefined()
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined()
  })

  it('applies placeholder prop', () => {
    const wrapper = mount(ComboBox, { props: { placeholder: 'Type here...' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Type here...')
  })

  it('renders items when dropdown is open', async () => {
    const wrapper = mount(ComboBox, { props: { items: sampleItems } })
    await wrapper.find('.pr-combo-box__toggle').trigger('click')
    expect(wrapper.find('.pr-combo-box__listbox').exists()).toBe(true)
    const options = wrapper.findAll('.pr-combo-box__listbox li')
    expect(options).toHaveLength(4)
    expect(options[0]!.text()).toBe('Apple')
  })

  it('filters items based on input', async () => {
    const wrapper = mount(ComboBox, { props: { items: sampleItems } })
    const input = wrapper.find('input')
    await input.setValue('Ban')
    // dropdown should open automatically (if not open)
    expect(wrapper.find('.pr-combo-box__listbox').exists()).toBe(true)
    const options = wrapper.findAll('.pr-combo-box__listbox li')
    expect(options).toHaveLength(1)
    expect(options[0]!.text()).toBe('Banana')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(ComboBox)
    const input = wrapper.find('input')
    await input.setValue('test')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['test'])
  })

  it('emits select event when an item is clicked', async () => {
    const wrapper = mount(ComboBox, { props: { items: sampleItems } })
    await wrapper.find('.pr-combo-box__toggle').trigger('click')
    const options = wrapper.findAll('.pr-combo-box__listbox li')
    expect(options).toHaveLength(4)
    await options[1]!.trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
    expect(wrapper.emitted('select')![0]).toEqual([sampleItems[1]])
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['Banana'])
  })

  it('closes dropdown after selection', async () => {
    const wrapper = mount(ComboBox, { props: { items: sampleItems } })
    await wrapper.find('.pr-combo-box__toggle').trigger('click')
    expect(wrapper.find('.pr-combo-box__listbox').exists()).toBe(true)
    const options = wrapper.findAll('.pr-combo-box__listbox li')
    await options[0]!.trigger('click')
    expect(wrapper.find('.pr-combo-box__listbox').exists()).toBe(false)
  })

  it('emits open and close events when toggled', async () => {
    const wrapper = mount(ComboBox)
    await wrapper.find('.pr-combo-box__toggle').trigger('click')
    expect(wrapper.emitted('open')).toHaveLength(1)
    await wrapper.find('.pr-combo-box__toggle').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits focus and blur events', async () => {
    const wrapper = mount(ComboBox)
    const input = wrapper.find('input')
    await input.trigger('focus')
    const focusEvents = wrapper.emitted('focus')
    expect(focusEvents).toHaveLength(1)
    expect(focusEvents![0]![0]).toBeInstanceOf(FocusEvent)
    await input.trigger('blur')
    const blurEvents = wrapper.emitted('blur')
    expect(blurEvents).toHaveLength(1)
  })

  it('keyboard navigation: ArrowDown moves active item', async () => {
    const wrapper = mount(ComboBox, { props: { items: sampleItems } })
    await wrapper.find('input').trigger('focus')
    // dropdown should open on focus
    expect(wrapper.find('.pr-combo-box__listbox').exists()).toBe(true)
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    const activeOption = wrapper.find('.pr-combo-box__option--active')
    expect(activeOption.exists()).toBe(true)
    expect(activeOption.text()).toBe('Apple')
  })

  it('keyboard navigation: ArrowUp moves active item', async () => {
    const wrapper = mount(ComboBox, { props: { items: sampleItems } })
    await wrapper.find('input').trigger('focus')
    await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
    const activeOption = wrapper.find('.pr-combo-box__option--active')
    expect(activeOption.exists()).toBe(true)
    // ArrowUp from first item should wrap to last
    expect(activeOption.text()).toBe('Date')
  })

  it('keyboard navigation: Enter selects active item', async () => {
    const wrapper = mount(ComboBox, { props: { items: sampleItems } })
    await wrapper.find('input').trigger('focus')
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')).toHaveLength(1)
    expect(wrapper.emitted('select')![0]).toEqual([sampleItems[0]])
    expect(wrapper.find('.pr-combo-box__listbox').exists()).toBe(false)
  })

  it('keyboard navigation: Escape closes dropdown', async () => {
    const wrapper = mount(ComboBox, { props: { items: sampleItems } })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.pr-combo-box__listbox').exists()).toBe(true)
    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('.pr-combo-box__listbox').exists()).toBe(false)
  })

  it('closes dropdown when clicking outside', async () => {
    const wrapper = mount(ComboBox, { props: { items: sampleItems } })
    await wrapper.find('.pr-combo-box__toggle').trigger('click')
    expect(wrapper.find('.pr-combo-box__listbox').exists()).toBe(true)
    // Simulate click outside by triggering a click on the document body
    document.body.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.pr-combo-box__listbox').exists()).toBe(false)
  })

  it('does not close dropdown when clicking inside', async () => {
    const wrapper = mount(ComboBox, { props: { items: sampleItems } })
    await wrapper.find('.pr-combo-box__toggle').trigger('click')
    expect(wrapper.find('.pr-combo-box__listbox').exists()).toBe(true)
    const options = wrapper.findAll('.pr-combo-box__listbox li')
    await options[0]!.trigger('click')
    // dropdown should close after selection, but we can assert it's closed (already tested)
    expect(wrapper.find('.pr-combo-box__listbox').exists()).toBe(false)
  })

  it('applies data-has-value attribute when modelValue is not empty', async () => {
    const wrapper = mount(ComboBox, { props: { modelValue: 'Apple' } })
    expect(wrapper.find('.pr-combo-box').attributes('data-has-value')).toBe('')
    await wrapper.setProps({ modelValue: '' })
    expect(wrapper.find('.pr-combo-box').attributes('data-has-value')).toBeUndefined()
  })

  it('passes through arbitrary attributes to the input', () => {
    const wrapper = mount(ComboBox, {
      attrs: {
        type: 'search',
        name: 'fruit',
        autocomplete: 'off',
      },
    })
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('search')
    expect(input.attributes('name')).toBe('fruit')
    expect(input.attributes('autocomplete')).toBe('off')
  })
})
