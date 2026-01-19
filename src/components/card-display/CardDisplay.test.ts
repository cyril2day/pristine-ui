import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CardDisplay from './CardDisplay.vue';

describe('CardDisplay', () => {
  it('renders with default props', () => {
    const wrapper = mount(CardDisplay, {
      slots: { default: 'Card content' },
    });

    const card = wrapper.find('.pr-card-display');
    expect(card.exists()).toBe(true);
    expect(card.text()).toBe('Card content');
    expect(card.attributes('data-variant')).toBe('outlined');
    expect(card.attributes('data-card')).toBe('');
  });

  it('applies variant prop correctly', () => {
    const variants = ['outlined', 'elevated'] as const;

    variants.forEach((variant) => {
      const wrapper = mount(CardDisplay, {
        props: { variant },
      });
      expect(wrapper.find('.pr-card-display').attributes('data-variant')).toBe(variant);
    });
  });

  it('renders slot content', () => {
    const slotContent = '<h3>Title</h3><p>Description</p>';
    const wrapper = mount(CardDisplay, {
      slots: { default: slotContent },
    });

    expect(wrapper.find('h3').exists()).toBe(true);
    expect(wrapper.find('h3').text()).toBe('Title');
    expect(wrapper.find('p').exists()).toBe(true);
    expect(wrapper.find('p').text()).toBe('Description');
  });

  it('has correct default styling classes', () => {
    const wrapper = mount(CardDisplay);
    const card = wrapper.find('.pr-card-display');
    expect(card.classes()).toContain('pr-card-display');
    // Should not have any other unexpected classes
    expect(card.classes().length).toBe(1);
  });
});
