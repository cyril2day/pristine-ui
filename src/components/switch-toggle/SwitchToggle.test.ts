import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SwitchToggle from './SwitchToggle.vue'

describe('SwitchToggle', () => {
  it('renders with default props', () => {
    const wrapper = mount(SwitchToggle)

    const root = wrapper.find('.pr-switch-toggle')
    expect(root.exists()).toBe(true)
    expect(root.attributes('data-checked')).toBeUndefined()
    expect(root.attributes('data-disabled')).toBeUndefined()
    expect(root.attributes('aria-checked')).toBe('false')
    expect(root.attributes('aria-disabled')).toBe('false')
    expect(root.attributes('tabindex')).toBe('0')
  })

  it('reflects modelValue prop correctly', async () => {
    const wrapper = mount(SwitchToggle, {
      props: { modelValue: true },
    })

    expect(wrapper.find('.pr-switch-toggle').attributes('data-checked')).toBe('true')
    expect(wrapper.find('.pr-switch-toggle').attributes('aria-checked')).toBe('true')

    await wrapper.setProps({ modelValue: false })
    expect(wrapper.find('.pr-switch-toggle').attributes('data-checked')).toBeUndefined()
    expect(wrapper.find('.pr-switch-toggle').attributes('aria-checked')).toBe('false')
  })

  it('applies disabled prop correctly', () => {
    const wrapper = mount(SwitchToggle, {
      props: { disabled: true },
    })

    const root = wrapper.find('.pr-switch-toggle')
    expect(root.attributes('data-disabled')).toBe('')
    expect(root.attributes('aria-disabled')).toBe('true')
    expect(root.attributes('tabindex')).toBe('0') // still focusable but aria-disabled indicates disabled
  })

  it('does not add data-disabled attribute when disabled is false', () => {
    const wrapper = mount(SwitchToggle, {
      props: { disabled: false },
    })

    expect(wrapper.find('.pr-switch-toggle').attributes('data-disabled')).toBeUndefined()
    expect(wrapper.find('.pr-switch-toggle').attributes('aria-disabled')).toBe('false')
  })

  it('emits update:modelValue when clicked and not disabled', async () => {
    const wrapper = mount(SwitchToggle, {
      props: { modelValue: false },
    })

    await wrapper.find('.pr-switch-toggle').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
  })

  it('emits change event when toggled', async () => {
    const wrapper = mount(SwitchToggle, {
      props: { modelValue: false },
    })

    await wrapper.find('.pr-switch-toggle').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('change')
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('change')![0]).toEqual([true])
  })

  it('does not emit events when disabled', async () => {
    const wrapper = mount(SwitchToggle, {
      props: { modelValue: false, disabled: true },
    })

    await wrapper.find('.pr-switch-toggle').trigger('click')

    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue')
    expect(wrapper.emitted()).not.toHaveProperty('change')
  })

  it('toggles via Space key', async () => {
    const wrapper = mount(SwitchToggle, {
      props: { modelValue: false },
    })

    await wrapper.find('.pr-switch-toggle').trigger('keydown', { code: 'Space' })

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('toggles via Enter key', async () => {
    const wrapper = mount(SwitchToggle, {
      props: { modelValue: false },
    })

    await wrapper.find('.pr-switch-toggle').trigger('keydown', { code: 'Enter' })

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('does not toggle via other keys', async () => {
    const wrapper = mount(SwitchToggle, {
      props: { modelValue: false },
    })

    await wrapper.find('.pr-switch-toggle').trigger('keydown', { code: 'Tab' })

    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue')
    expect(wrapper.emitted()).not.toHaveProperty('change')
  })


  it('respects v-model two-way binding', async () => {
    const wrapper = mount(SwitchToggle, {
      props: { modelValue: false },
    })

    await wrapper.find('.pr-switch-toggle').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])

    await wrapper.setProps({ modelValue: true })
    expect(wrapper.find('.pr-switch-toggle').attributes('data-checked')).toBe('true')
  })
})
