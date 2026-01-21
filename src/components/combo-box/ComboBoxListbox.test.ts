import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ComboBoxListbox from './ComboBoxListbox.vue'
import type { Item } from './composables/useComboBoxState'

const sampleItems: Item[] = [
  { id: 1, label: 'Apple' },
  { id: 2, label: 'Banana' },
  { id: 3, label: 'Cherry' },
  { id: 4, label: 'Date' },
]

describe('ComboBoxListbox', () => {
  beforeEach(() => {
    // Mock scrollIntoView because JSDOM doesn't implement it
    HTMLElement.prototype.scrollIntoView = vi.fn()
  })

  it('renders a listbox with items', () => {
    const wrapper = mount(ComboBoxListbox, {
      props: { items: sampleItems, activeItemId: null }
    })

    expect(wrapper.find('ul.pr-combo-box__listbox').exists()).toBe(true)
    expect(wrapper.findAll('li.pr-combo-box__option')).toHaveLength(4)
    expect(wrapper.findAll('li')[0]!.text()).toBe('Apple')
  })

  it('applies active class to the active item', async () => {
    const wrapper = mount(ComboBoxListbox, {
      props: { items: sampleItems, activeItemId: 2 }
    })

    const activeOption = wrapper.find('.pr-combo-box__option--active')
    expect(activeOption.exists()).toBe(true)
    expect(activeOption.text()).toBe('Banana')
  })

  it('does not add active class when activeItemId is null', () => {
    const wrapper = mount(ComboBoxListbox, {
      props: { items: sampleItems, activeItemId: null }
    })

    expect(wrapper.find('.pr-combo-box__option--active').exists()).toBe(false)
  })

  it('emits select event when an option is clicked', async () => {
    const wrapper = mount(ComboBoxListbox, {
      props: { items: sampleItems, activeItemId: null }
    })

    await wrapper.findAll('li')[1]!.trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
    expect(wrapper.emitted('select')![0]).toEqual([sampleItems[1]])
  })

  it('emits hover event when mouse enters an option', async () => {
    const wrapper = mount(ComboBoxListbox, {
      props: { items: sampleItems, activeItemId: null }
    })

    await wrapper.findAll('li')[2]!.trigger('mouseenter')
    expect(wrapper.emitted('hover')).toHaveLength(1)
    expect(wrapper.emitted('hover')![0]).toEqual([sampleItems[2]])
  })

  it('sets aria-selected attribute based on selectedItemId', () => {
    const wrapper = mount(ComboBoxListbox, {
      props: { items: sampleItems, activeItemId: null, selectedItemId: 3 }
    })

    const options = wrapper.findAll('li')
    expect(options[2]!.attributes('aria-selected')).toBe('true')
    // other options should have aria-selected false or not present?
    expect(options[0]!.attributes('aria-selected')).toBeUndefined()
  })

  it('sets custom id and aria-label', () => {
    const wrapper = mount(ComboBoxListbox, {
      props: { items: sampleItems, activeItemId: null, id: 'custom-listbox', ariaLabel: 'Fruits' }
    })

    const listbox = wrapper.find('ul')
    expect(listbox.attributes('id')).toBe('custom-listbox')
    expect(listbox.attributes('aria-label')).toBe('Fruits')
  })

  it('uses default props when not provided', () => {
    const wrapper = mount(ComboBoxListbox, {
      props: { items: sampleItems, activeItemId: null }
    })

    const listbox = wrapper.find('ul')
    expect(listbox.attributes('id')).toBe('listbox-id')
    expect(listbox.attributes('aria-label')).toBe('Options')
  })

  it('scrolls active option into view when activeItemId changes', async () => {
    const scrollIntoViewMock = vi.fn()
    HTMLElement.prototype.scrollIntoView = scrollIntoViewMock

    const wrapper = mount(ComboBoxListbox, {
      props: { items: sampleItems, activeItemId: null }
    })

    // Wait for initial render
    await wrapper.vm.$nextTick()
    expect(scrollIntoViewMock).not.toHaveBeenCalled()

    // Change activeItemId
    await wrapper.setProps({ activeItemId: 2 })
    // Wait for nextTick because the watcher uses nextTick
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick() // extra tick for flush

    // Expect scrollIntoView to have been called on the element with id option-2
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1)
    // We cannot easily assert which element was scrolled because JSDOM doesn't have real DOM,
    // but we can verify that the mock was called.
  })
})
