import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SegmentedControl from './SegmentedControl.vue';

describe('SegmentedControl', () => {
  const sampleItems = [
    { id: 1, label: 'Option A' },
    { id: 2, label: 'Option B' },
    { id: 3, label: 'Option C', disabled: true },
    { id: 4, label: 'Option D' },
  ];

  it('renders with default props', () => {
    const wrapper = mount(SegmentedControl, {
      props: { items: sampleItems },
    });

    const container = wrapper.find('.segmented-control');
    expect(container.exists()).toBe(true);
    expect(container.attributes('data-shape')).toBe('capsule');
    expect(container.attributes('data-disabled')).toBeUndefined();

    const buttons = wrapper.findAll('.segmented-control__segment');
    expect(buttons).toHaveLength(4);
    expect(buttons[0]?.text()).toBe('Option A');
    expect(buttons[1]?.text()).toBe('Option B');
    expect(buttons[2]?.text()).toBe('Option C');
    expect(buttons[3]?.text()).toBe('Option D');
  });

  it('applies shape prop correctly', () => {
    const shapes = ['capsule', 'rounded-rectangle'] as const;

    shapes.forEach((shape) => {
      const wrapper = mount(SegmentedControl, {
        props: { items: sampleItems, shape },
      });
      expect(wrapper.find('.segmented-control').attributes('data-shape')).toBe(shape);
    });
  });

  it('applies disabled prop correctly', () => {
    const wrapper = mount(SegmentedControl, {
      props: { items: sampleItems, disabled: true },
    });

    const container = wrapper.find('.segmented-control');
    expect(container.attributes('data-disabled')).toBe('');

    const buttons = wrapper.findAll('.segmented-control__segment');
    buttons.forEach((button) => {
      expect(button.attributes('disabled')).toBe('');
      expect(button.attributes('data-disabled')).toBe('');
    });
  });

  it('marks individual disabled items', () => {
    const wrapper = mount(SegmentedControl, {
      props: { items: sampleItems },
    });

    const buttons = wrapper.findAll('.segmented-control__segment');
    // third item is disabled
    expect(buttons[2]?.attributes('data-disabled')).toBe('');
    expect(buttons[2]?.attributes('disabled')).toBe('');
    // others should not have data-disabled attribute
    expect(buttons[0]?.attributes('data-disabled')).toBeUndefined();
    expect(buttons[1]?.attributes('data-disabled')).toBeUndefined();
    expect(buttons[3]?.attributes('data-disabled')).toBeUndefined();
  });

  it('selects item via click', async () => {
    const wrapper = mount(SegmentedControl, {
      props: { items: sampleItems },
    });

    const buttons = wrapper.findAll('.segmented-control__segment');
    const button = buttons[1];
    expect(button).toBeDefined();
    await button!.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([2]);

    expect(wrapper.emitted()).toHaveProperty('select');
    expect(wrapper.emitted('select')).toHaveLength(1);
    expect(wrapper.emitted('select')![0]).toEqual([sampleItems[1]]);

    // data-selected attribute should be present
    expect(button!.attributes('data-selected')).toBe('');
    // others not selected
    expect(buttons[0]?.attributes('data-selected')).toBeUndefined();
    expect(buttons[2]?.attributes('data-selected')).toBeUndefined();
    expect(buttons[3]?.attributes('data-selected')).toBeUndefined();
  });

  it('does not select disabled item via click', async () => {
    const wrapper = mount(SegmentedControl, {
      props: { items: sampleItems },
    });

    const buttons = wrapper.findAll('.segmented-control__segment');
    const button = buttons[2]; // disabled item
    expect(button).toBeDefined();
    await button!.trigger('click');

    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');
    expect(wrapper.emitted()).not.toHaveProperty('select');
  });

  it('does not select when whole control is disabled', async () => {
    const wrapper = mount(SegmentedControl, {
      props: { items: sampleItems, disabled: true },
    });

    const buttons = wrapper.findAll('.segmented-control__segment');
    const button = buttons[0];
    expect(button).toBeDefined();
    await button!.trigger('click');

    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');
    expect(wrapper.emitted()).not.toHaveProperty('select');
  });

  it('supports v-model binding', async () => {
    const wrapper = mount(SegmentedControl, {
      props: { items: sampleItems, modelValue: 2 },
    });

    const buttons = wrapper.findAll('.segmented-control__segment');
    expect(buttons[1]?.attributes('data-selected')).toBe('');

    // change selection via click
    const button = buttons[3];
    expect(button).toBeDefined();
    await button!.trigger('click');
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([4]);
  });

  describe('keyboard navigation', () => {
    it('moves selection with arrow keys', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { items: sampleItems, modelValue: 1 },
        attachTo: document.body,
      });

      const container = wrapper.find('.segmented-control');
      await container.trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([2]); // next enabled (skip disabled)
    });

    it('wraps around with arrow keys', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { items: sampleItems, modelValue: 4 },
        attachTo: document.body,
      });

      const container = wrapper.find('.segmented-control');
      await container.trigger('keydown', { key: 'ArrowRight' });

      // should wrap to first enabled (id 1)
      expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([1]);
    });

    it('skips disabled items with arrow keys', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { items: sampleItems, modelValue: 2 },
        attachTo: document.body,
      });

      const container = wrapper.find('.segmented-control');
      await container.trigger('keydown', { key: 'ArrowRight' });

      // should skip id 3 (disabled) and go to id 4
      expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([4]);
    });

    it('moves with ArrowUp/ArrowDown', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { items: sampleItems, modelValue: 1 },
        attachTo: document.body,
      });

      const container = wrapper.find('.segmented-control');
      await container.trigger('keydown', { key: 'ArrowDown' });
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([2]);
    });

    it('selects first item with Home', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { items: sampleItems, modelValue: 4 },
        attachTo: document.body,
      });

      const container = wrapper.find('.segmented-control');
      await container.trigger('keydown', { key: 'Home' });
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([1]);
    });

    it('selects last item with End', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { items: sampleItems, modelValue: 1 },
        attachTo: document.body,
      });

      const container = wrapper.find('.segmented-control');
      await container.trigger('keydown', { key: 'End' });
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([4]);
    });

    it('selects focused item with Enter', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { items: sampleItems, modelValue: 1 },
        attachTo: document.body,
      });

      const container = wrapper.find('.segmented-control');
      // first focus a different segment (simulate focus)
      const buttons = wrapper.findAll('.segmented-control__segment');
      const button = buttons[3];
      expect(button).toBeDefined();
      await button!.trigger('focus');
      await container.trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([4]);
    });

    it('selects focused item with Space', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { items: sampleItems, modelValue: 1 },
        attachTo: document.body,
      });

      const container = wrapper.find('.segmented-control');
      const buttons = wrapper.findAll('.segmented-control__segment');
      const button = buttons[3];
      expect(button).toBeDefined();
      await button!.trigger('focus');
      await container.trigger('keydown', { key: ' ' });

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([4]);
    });
  });

  it('renders scoped slot content', () => {
    const wrapper = mount(SegmentedControl, {
      props: { items: sampleItems },
      slots: {
        default: `<template #default="{ items, selectedId, select, isSelected, isDisabled }">
          <div v-for="item in items" :key="item.id" class="custom-segment" @click="select(item.id)" :data-selected="isSelected(item.id)" :data-disabled="isDisabled(item.id)">
            {{ item.label }}
          </div>
        </template>`,
      },
    });

    const customSegments = wrapper.findAll('.custom-segment');
    expect(customSegments).toHaveLength(4);
    expect(customSegments[0]?.text()).toBe('Option A');
    // slot should have received the scoped props
    expect(customSegments[0]?.attributes('data-selected')).toBe('false');
  });
});
