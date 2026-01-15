import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SegmentedControl from '../components/SegmentedControl.vue'

describe('SegmentedControl', () => {
  const sampleOptions = [
    { value: 'tab1', label: 'Tab 1' },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3' },
  ]

  it('renders with default props', () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        options: sampleOptions,
        modelValue: 'tab1',
      },
    })

    expect(wrapper.find('.pr-segmented-control').exists()).toBe(true)
    const buttons = wrapper.findAll('.pr-segmented-control__button')
    expect(buttons).toHaveLength(3)
    expect(buttons[0]!.text()).toBe('tab1')
    expect(buttons[1]!.text()).toBe('tab2')
    expect(buttons[2]!.text()).toBe('tab3')
  })

  it('applies selected class to active segment', () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        options: sampleOptions,
        modelValue: 'tab2',
      },
    })

    const buttons = wrapper.findAll('.pr-segmented-control__button')
    expect(buttons[0]!.classes()).not.toContain('pr-segmented-control__button--selected')
    expect(buttons[1]!.classes()).toContain('pr-segmented-control__button--selected')
    expect(buttons[2]!.classes()).not.toContain('pr-segmented-control__button--selected')
  })

  it('emits update:modelValue on segment click', async () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        options: sampleOptions,
        modelValue: 'tab1',
      },
    })

    await wrapper.findAll('.pr-segmented-control__button')[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['tab3'])
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('change')![0]).toEqual(['tab3'])
  })

  it('does not emit when clicking disabled segment', async () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        options: [
          { value: 'tab1', label: 'Tab 1' },
          { value: 'tab2', label: 'Tab 2', disabled: true },
          { value: 'tab3', label: 'Tab 3' },
        ],
        modelValue: 'tab1',
      },
    })

    await wrapper.findAll('.pr-segmented-control__button')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('applies size classes', () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        options: sampleOptions,
        modelValue: 'tab1',
        size: 'large',
      },
    })

    const button = wrapper.find('.pr-segmented-control__button')
    expect(button.classes()).toContain('pr-segmented-control__button--large')
  })

  it('sets aria-checked and aria-disabled attributes', () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        options: [
          { value: 'tab1', label: 'Tab 1' },
          { value: 'tab2', label: 'Tab 2', disabled: true },
        ],
        modelValue: 'tab1',
      },
    })

    const buttons = wrapper.findAll('.pr-segmented-control__button')
    expect(buttons[0]!.attributes('aria-checked')).toBe('true')
    expect(buttons[0]!.attributes('aria-disabled')).toBe('false')
    expect(buttons[1]!.attributes('aria-checked')).toBe('false')
    expect(buttons[1]!.attributes('aria-disabled')).toBe('true')
  })

  it('sets disabled attribute on button when segment disabled', () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        options: [
          { value: 'tab1', label: 'Tab 1' },
          { value: 'tab2', label: 'Tab 2', disabled: true },
        ],
        modelValue: 'tab1',
      },
    })

    const buttons = wrapper.findAll('.pr-segmented-control__button')
    expect(buttons[0]!.attributes('disabled')).toBeUndefined()
    expect(buttons[1]!.attributes('disabled')).toBe('')
  })

  it('sets disabled attribute on root when component disabled', () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        options: sampleOptions,
        modelValue: 'tab1',
        disabled: true,
      },
    })

    const root = wrapper.find('.pr-segmented-control')
    expect(root.attributes('aria-disabled')).toBe('true')
    const buttons = wrapper.findAll('.pr-segmented-control__button')
    buttons.forEach(button => {
      expect(button.attributes('aria-disabled')).toBe('true')
      expect(button.attributes('disabled')).toBe('')
    })
  })

  it('applies correct role and aria-label', () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        options: sampleOptions,
        modelValue: 'tab1',
        ariaLabel: 'Tab navigation',
      },
    })

    const root = wrapper.find('.pr-segmented-control')
    expect(root.attributes('role')).toBe('radiogroup')
    expect(root.attributes('aria-label')).toBe('Tab navigation')
  })

  it('generates unique name when not provided', () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        options: sampleOptions,
        modelValue: 'tab1',
      },
    })

    const root = wrapper.find('.pr-segmented-control')
    const name = root.attributes('name')
    expect(name).toBeDefined()
    expect(name).toMatch(/^pr-segmented-control-[a-z0-9]+$/)
  })

  it('uses provided name attribute', () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        options: sampleOptions,
        modelValue: 'tab1',
        name: 'custom-name',
      },
    })

    const root = wrapper.find('.pr-segmented-control')
    expect(root.attributes('name')).toBe('custom-name')
  })

  it('handles keyboard navigation (ArrowRight)', async () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        options: sampleOptions,
        modelValue: 'tab1',
      },
    })

    const buttons = wrapper.findAll('.pr-segmented-control__button')
    await buttons[0]!.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['tab2'])
  })

  it('wraps around with ArrowRight on last segment', async () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        options: sampleOptions,
        modelValue: 'tab3',
      },
    })

    const buttons = wrapper.findAll('.pr-segmented-control__button')
    await buttons[2]!.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['tab1'])
  })

  it('handles keyboard navigation (ArrowLeft)', async () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        options: sampleOptions,
        modelValue: 'tab2',
      },
    })

    const buttons = wrapper.findAll('.pr-segmented-control__button')
    await buttons[1]!.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['tab1'])
  })

  it('wraps around with ArrowLeft on first segment', async () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        options: sampleOptions,
        modelValue: 'tab1',
      },
    })

    const buttons = wrapper.findAll('.pr-segmented-control__button')
    await buttons[0]!.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['tab3'])
  })

  it('ignores keyboard navigation on disabled segment', async () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        options: [
          { value: 'tab1', label: 'Tab 1' },
          { value: 'tab2', label: 'Tab 2', disabled: true },
          { value: 'tab3', label: 'Tab 3' },
        ],
        modelValue: 'tab1',
      },
    })

    const buttons = wrapper.findAll('.pr-segmented-control__button')
    await buttons[0]!.trigger('keydown', { key: 'ArrowRight' })
    // Should skip tab2 (disabled) and go to tab3
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['tab3'])
  })

  it('renders custom slot content', () => {
    const wrapper = mount(SegmentedControl, {
      props: {
        options: sampleOptions,
        modelValue: 'tab1',
      },
      slots: {
        default: `<template #default="{ segment, active }">
          <span :class="{ active }">{{ segment.label }}</span>
        </template>`,
      },
    })

    const buttons = wrapper.findAll('.pr-segmented-control__button')
    expect(buttons[0]!.find('span').exists()).toBe(true)
    expect(buttons[0]!.find('span').text()).toBe('Tab 1')
  })
})
