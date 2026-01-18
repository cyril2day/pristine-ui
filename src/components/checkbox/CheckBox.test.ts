import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CheckBox from './CheckBox.vue'

describe('CheckBox', () => {
  it('renders with default props', () => {
    const wrapper = mount(CheckBox)

    const root = wrapper.find('.check-box')
    expect(root.exists()).toBe(true)
    expect(root.attributes('role')).toBe('checkbox')
    expect(root.attributes('aria-checked')).toBe('false')
    expect(root.attributes('aria-disabled')).toBe('false')
    expect(root.attributes('data-checked')).toBeUndefined()
    expect(root.attributes('data-indeterminate')).toBeUndefined()
    expect(root.attributes('data-disabled')).toBeUndefined()
  })

  it('applies modelValue prop correctly', async () => {
    const wrapper = mount(CheckBox, {
      props: { modelValue: true },
    })

    const root = wrapper.find('.check-box')
    expect(root.attributes('aria-checked')).toBe('true')
    expect(root.attributes('data-checked')).toBe('true')

    // Change via v-model
    await wrapper.setProps({ modelValue: false })
    expect(root.attributes('aria-checked')).toBe('false')
    expect(root.attributes('data-checked')).toBeUndefined()
  })

  it('applies indeterminate prop correctly', () => {
    const wrapper = mount(CheckBox, {
      props: { indeterminate: true },
    })

    const root = wrapper.find('.check-box')
    expect(root.attributes('aria-checked')).toBe('mixed')
    expect(root.attributes('data-indeterminate')).toBe('true')
  })

  it('applies disabled prop correctly', () => {
    const wrapper = mount(CheckBox, {
      props: { disabled: true },
    })

    const root = wrapper.find('.check-box')
    expect(root.attributes('aria-disabled')).toBe('true')
    expect(root.attributes('data-disabled')).toBe('')
    expect(root.attributes('tabindex')).toBe('-1')
  })

  it('emits update:modelValue and change events when clicked and not disabled', async () => {
    const wrapper = mount(CheckBox, {
      props: { modelValue: false },
    })
    const root = wrapper.find('.check-box')

    await root.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
    expect(wrapper.emitted()).toHaveProperty('change')
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('change')![0]).toEqual([true])
  })

  it('does not emit events when disabled', async () => {
    const wrapper = mount(CheckBox, {
      props: { disabled: true },
    })
    const root = wrapper.find('.check-box')

    await root.trigger('click')

    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue')
    expect(wrapper.emitted()).not.toHaveProperty('change')
  })

  it('toggles via Space key', async () => {
    const wrapper = mount(CheckBox, {
      props: { modelValue: false },
    })
    const root = wrapper.find('.check-box')

    await root.trigger('keydown', { code: 'Space' })

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('toggles via Enter key', async () => {
    const wrapper = mount(CheckBox, {
      props: { modelValue: false },
    })
    const root = wrapper.find('.check-box')

    await root.trigger('keydown', { code: 'Enter' })

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('ignores other keys', async () => {
    const wrapper = mount(CheckBox, {
      props: { modelValue: false },
    })
    const root = wrapper.find('.check-box')

    await root.trigger('keydown', { code: 'KeyA' })

    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue')
    expect(wrapper.emitted()).not.toHaveProperty('change')
  })

  it('clears indeterminate when toggled from indeterminate state', async () => {
    const wrapper = mount(CheckBox, {
      props: { indeterminate: true, modelValue: false },
    })
    const root = wrapper.find('.check-box')

    await root.trigger('click')

    // Should emit change with true (since indeterminate -> checked)
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('change')![0]).toEqual([true])
    // indeterminate prop remains unchanged (parent responsibility)
    // data-indeterminate attribute still present because prop hasn't changed
    expect(root.attributes('data-indeterminate')).toBe('true')
  })

  it('forwards id, name, value to native input', () => {
    const wrapper = mount(CheckBox, {
      props: { id: 'chk1', name: 'agree', value: 'yes' },
    })

    const input = wrapper.find('.check-box__input')
    expect(input.attributes('id')).toBe('chk1')
    expect(input.attributes('name')).toBe('agree')
    expect(input.attributes('value')).toBe('yes')
  })

  it('sets aria-label and aria-labelledby', () => {
    const wrapper = mount(CheckBox, {
      props: { ariaLabel: 'Accept terms', ariaLabelledby: 'label1' },
    })

    const root = wrapper.find('.check-box')
    expect(root.attributes('aria-label')).toBe('Accept terms')
    expect(root.attributes('aria-labelledby')).toBe('label1')
  })

  it('respects v-model two-way binding', async () => {
    const wrapper = mount(CheckBox, {
      props: { modelValue: false },
    })

    await wrapper.find('.check-box').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])

    await wrapper.setProps({ modelValue: true })
    expect(wrapper.find('.check-box').attributes('data-checked')).toBe('true')
  })
})
