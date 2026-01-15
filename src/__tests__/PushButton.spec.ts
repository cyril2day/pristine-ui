import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PushButton from '../components/PushButton.vue'

describe('PushButton', () => {
  it('renders with default props', () => {
    const wrapper = mount(PushButton, {
      slots: {
        default: 'Click me'
      }
    })
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('pr-button')
    expect(wrapper.classes()).toContain('pr-button--normal')
    expect(wrapper.classes()).toContain('pr-button--regular')
    expect(wrapper.classes()).toContain('pr-button--rounded-rectangle')
    expect(wrapper.attributes('disabled')).toBeUndefined()
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('applies role class', () => {
    const wrapper = mount(PushButton, {
      props: { role: 'primary' }
    })
    expect(wrapper.classes()).toContain('pr-button--primary')
  })

  it('applies size class', () => {
    const wrapper = mount(PushButton, {
      props: { size: 'large' }
    })
    expect(wrapper.classes()).toContain('pr-button--large')
  })

  it('applies shape class', () => {
    const wrapper = mount(PushButton, {
      props: { shape: 'capsule' }
    })
    expect(wrapper.classes()).toContain('pr-button--capsule')
  })

  it('sets disabled attribute and class', () => {
    const wrapper = mount(PushButton, {
      props: { disabled: true }
    })
    expect(wrapper.attributes('disabled')).toBe('')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.classes()).toContain('pr-button--disabled')
  })

  it('sets type attribute', () => {
    const wrapper = mount(PushButton, {
      props: { type: 'submit' }
    })
    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(PushButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(PushButton, {
      props: { disabled: true }
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('emits keydown event', async () => {
    const wrapper = mount(PushButton)
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('keydown')).toHaveLength(1)
  })

  it('renders slot content', () => {
    const wrapper = mount(PushButton, {
      slots: {
        default: '<span>Custom content</span>'
      }
    })
    expect(wrapper.html()).toContain('<span>Custom content</span>')
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(PushButton, {
      props: { disabled: true }
    })
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('role')).toBeUndefined() // native button already has implicit role
  })
})
