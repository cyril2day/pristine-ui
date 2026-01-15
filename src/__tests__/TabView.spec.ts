import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TabView from '../components/TabView.vue'

describe('TabView', () => {
  const sampleTabs = [
    { value: 'tab1', label: 'Tab 1', content: 'Content 1' },
    { value: 'tab2', label: 'Tab 2', content: 'Content 2' },
    { value: 'tab3', label: 'Tab 3', content: 'Content 3', disabled: true },
  ]

  it('renders SegmentedControl with tab options', () => {
    const wrapper = mount(TabView, {
      props: { tabs: sampleTabs },
    })

    const segControl = wrapper.findComponent({ name: 'SegmentedControl' })
    expect(segControl.exists()).toBe(true)
    expect(segControl.props('options')).toEqual([
      { value: 'tab1', disabled: undefined },
      { value: 'tab2', disabled: undefined },
      { value: 'tab3', disabled: true },
    ])
  })

  it('renders TabPanels for each tab', () => {
    const wrapper = mount(TabView, {
      props: { tabs: sampleTabs },
    })

    const panels = wrapper.findAllComponents({ name: 'TabPanel' })
    expect(panels).toHaveLength(3)
    expect(panels[0]!.props('value')).toBe('tab1')
    expect(panels[1]!.props('value')).toBe('tab2')
    expect(panels[2]!.props('value')).toBe('tab3')
  })

  it('sets first tab as active by default', () => {
    const wrapper = mount(TabView, {
      props: { tabs: sampleTabs },
    })

    const segControl = wrapper.findComponent({ name: 'SegmentedControl' })
    expect(segControl.props('modelValue')).toBe('tab1')
    const panels = wrapper.findAllComponents({ name: 'TabPanel' })
    expect(panels[0]!.props('active')).toBe(true)
    expect(panels[1]!.props('active')).toBe(false)
    expect(panels[2]!.props('active')).toBe(false)
  })

  it('uses modelValue prop as active tab', () => {
    const wrapper = mount(TabView, {
      props: { tabs: sampleTabs, modelValue: 'tab2' },
    })

    const segControl = wrapper.findComponent({ name: 'SegmentedControl' })
    expect(segControl.props('modelValue')).toBe('tab2')
    const panels = wrapper.findAllComponents({ name: 'TabPanel' })
    expect(panels[0]!.props('active')).toBe(false)
    expect(panels[1]!.props('active')).toBe(true)
    expect(panels[2]!.props('active')).toBe(false)
  })

  it('emits update:modelValue when tab changes', async () => {
    const wrapper = mount(TabView, {
      props: { tabs: sampleTabs },
    })

    const segControl = wrapper.findComponent({ name: 'SegmentedControl' })
    await segControl.vm.$emit('update:modelValue', 'tab2')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['tab2'])
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('change')![0]).toEqual(['tab2'])
  })

  it('updates active tab when modelValue prop changes', async () => {
    const wrapper = mount(TabView, {
      props: { tabs: sampleTabs, modelValue: 'tab1' },
    })

    await wrapper.setProps({ modelValue: 'tab2' })
    const segControl = wrapper.findComponent({ name: 'SegmentedControl' })
    expect(segControl.props('modelValue')).toBe('tab2')
    const panels = wrapper.findAllComponents({ name: 'TabPanel' })
    expect(panels[1]!.props('active')).toBe(true)
  })


  it('renders default slot content for each tab', () => {
    const wrapper = mount(TabView, {
      props: { tabs: sampleTabs },
    })

    const panels = wrapper.findAllComponents({ name: 'TabPanel' })
    // Default content is the tab.content string
    expect(panels[0]!.text()).toBe('Content 1')
    expect(panels[1]!.text()).toBe('Content 2')
    expect(panels[2]!.text()).toBe('Content 3')
  })

  it('renders named slots for custom content', () => {
    const wrapper = mount(TabView, {
      props: { tabs: sampleTabs },
      slots: {
        'tab-tab1': '<div>Custom Tab 1</div>',
        'tab-tab2': '<div>Custom Tab 2</div>',
      },
    })

    const panels = wrapper.findAllComponents({ name: 'TabPanel' })
    expect(panels[0]!.text()).toBe('Custom Tab 1')
    expect(panels[1]!.text()).toBe('Custom Tab 2')
    // tab3 falls back to default content
    expect(panels[2]!.text()).toBe('Content 3')
  })

  it('passes size and disabled props to SegmentedControl', () => {
    const wrapper = mount(TabView, {
      props: {
        tabs: sampleTabs,
        size: 'large',
        disabled: true,
      },
    })

    const segControl = wrapper.findComponent({ name: 'SegmentedControl' })
    expect(segControl.props('size')).toBe('large')
    expect(segControl.props('disabled')).toBe(true)
  })

  it('passes shape prop to SegmentedControl', () => {
    const wrapper = mount(TabView, {
      props: {
        tabs: sampleTabs,
        shape: 'rounded',
      },
    })

    const segControl = wrapper.findComponent({ name: 'SegmentedControl' })
    expect(segControl.props('shape')).toBe('rounded')
  })

  it('passes ariaLabel to SegmentedControl', () => {
    const wrapper = mount(TabView, {
      props: {
        tabs: sampleTabs,
        ariaLabel: 'Tab navigation',
      },
    })

    const segControl = wrapper.findComponent({ name: 'SegmentedControl' })
    expect(segControl.props('ariaLabel')).toBe('Tab navigation')
  })

  it('generates aria-labelledby for each TabPanel', () => {
    const wrapper = mount(TabView, {
      props: { tabs: sampleTabs },
    })

    const panels = wrapper.findAllComponents({ name: 'TabPanel' })
    expect(panels[0]!.props('ariaLabelledby')).toBe('tab-tab1')
    expect(panels[1]!.props('ariaLabelledby')).toBe('tab-tab2')
    expect(panels[2]!.props('ariaLabelledby')).toBe('tab-tab3')
  })
})
