import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TabPanel from '../components/TabPanel.vue'

describe('TabPanel', () => {
  it('renders slot content when active', () => {
    const wrapper = mount(TabPanel, {
      props: {
        value: 'tab1',
        active: true,
      },
      slots: {
        default: '<span>Panel Content</span>',
      },
    })

    expect(wrapper.find('.pr-tab-panel').exists()).toBe(true)
    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.find('span').text()).toBe('Panel Content')
  })

  it('renders but hidden when inactive', () => {
    const wrapper = mount(TabPanel, {
      props: {
        value: 'tab1',
        active: false,
      },
      slots: {
        default: '<span>Panel Content</span>',
      },
    })

    const panel = wrapper.find('.pr-tab-panel')
    expect(panel.exists()).toBe(true)
    expect(panel.attributes('hidden')).toBe('')
    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.find('span').text()).toBe('Panel Content')
  })

  it('applies disabled class when disabled', () => {
    const wrapper = mount(TabPanel, {
      props: {
        value: 'tab1',
        active: true,
        disabled: true,
      },
    })

    expect(wrapper.find('.pr-tab-panel').classes()).toContain('pr-tab-panel--disabled')
  })

  it('sets role and aria-labelledby attributes', () => {
    const wrapper = mount(TabPanel, {
      props: {
        value: 'tab1',
        active: true,
        ariaLabelledby: 'tab-button-1',
      },
    })

    const panel = wrapper.find('.pr-tab-panel')
    expect(panel.attributes('role')).toBe('tabpanel')
    expect(panel.attributes('aria-labelledby')).toBe('tab-button-1')
  })

  it('sets hidden attribute when inactive', () => {
    const wrapper = mount(TabPanel, {
      props: {
        value: 'tab1',
        active: false,
      },
    })

    const panel = wrapper.find('.pr-tab-panel')
    expect(panel.attributes('hidden')).toBe('')
  })

  it('does not set hidden attribute when active', () => {
    const wrapper = mount(TabPanel, {
      props: {
        value: 'tab1',
        active: true,
      },
    })

    const panel = wrapper.find('.pr-tab-panel')
    expect(panel.attributes('hidden')).toBeUndefined()
  })
})
