import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PushButton from './PushButton.vue';

describe('PushButton', () => {
  it('renders with default props', () => {
    const wrapper = mount(PushButton, {
      slots: { default: 'Click me' },
    });

    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('Click me');
    expect(button.attributes('data-role')).toBe('normal');
    expect(button.attributes('data-shape')).toBe('capsule');
    expect(button.attributes('data-disabled')).toBeUndefined();
    expect(button.attributes('disabled')).toBeUndefined();
  });

  it('applies role prop correctly', () => {
    const roles = ['normal', 'primary', 'destructive', 'cancel'] as const;

    roles.forEach((role) => {
      const wrapper = mount(PushButton, {
        props: { role },
      });
      expect(wrapper.find('button').attributes('data-role')).toBe(role);
    });
  });

  it('applies shape prop correctly', () => {
    const shapes = ['capsule', 'rounded-rectangle'] as const;

    shapes.forEach((shape) => {
      const wrapper = mount(PushButton, {
        props: { shape },
      });
      expect(wrapper.find('button').attributes('data-shape')).toBe(shape);
    });
  });

  it('applies disabled prop correctly', () => {
    const wrapper = mount(PushButton, {
      props: { disabled: true },
    });

    const button = wrapper.find('button');
    expect(button.attributes('data-disabled')).toBe('');
    expect(button.attributes('disabled')).toBe('');
  });

  it('does not add data-disabled attribute when disabled is false', () => {
    const wrapper = mount(PushButton, {
      props: { disabled: false },
    });

    const button = wrapper.find('button');
    expect(button.attributes('data-disabled')).toBeUndefined();
    expect(button.attributes('disabled')).toBeUndefined();
  });

  it('emits click event when button is clicked and not disabled', async () => {
    const wrapper = mount(PushButton);
    const button = wrapper.find('button');

    await button.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('does not emit click event when button is disabled', async () => {
    const wrapper = mount(PushButton, {
      props: { disabled: true },
    });
    const button = wrapper.find('button');

    await button.trigger('click');

    expect(wrapper.emitted()).not.toHaveProperty('click');
  });

  it('renders slot content', () => {
    const slotContent = 'Custom slot content';
    const wrapper = mount(PushButton, {
      slots: { default: slotContent },
    });

    expect(wrapper.find('button').text()).toBe(slotContent);
  });
});
