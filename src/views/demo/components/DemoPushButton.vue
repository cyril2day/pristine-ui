<script setup lang="ts">
import { ref } from 'vue'
import PushButton from '@/components/PushButton.vue'

type Role = 'normal' | 'primary' | 'destructive' | 'cancel'
type Size = 'mini' | 'small' | 'regular' | 'large' | 'extra-large'
type Shape = 'rounded-rectangle' | 'capsule' | 'circular'

const role = ref<Role>('normal')
const size = ref<Size>('regular')
const shape = ref<Shape>('rounded-rectangle')
const disabled = ref(false)
const buttonType = ref<'button' | 'submit' | 'reset'>('button')
const buttonText = ref('Sample Button')

function handleClick() {
  console.log('PushButton clicked')
}
</script>

<template>
  <div class="demo-push-button">
    <div class="demo-preview">
      <PushButton
        :role="role"
        :size="size"
        :shape="shape"
        :disabled="disabled"
        :type="buttonType"
        @click="handleClick"
      >
        {{ buttonText }}
      </PushButton>
    </div>

    <div class="demo-controls">
      <h3>Props</h3>
      <div class="control-group">
        <label>Role</label>
        <select v-model="role">
          <option value="normal">Normal</option>
          <option value="primary">Primary</option>
          <option value="destructive">Destructive</option>
          <option value="cancel">Cancel</option>
        </select>
      </div>
      <div class="control-group">
        <label>Size</label>
        <select v-model="size">
          <option value="mini">Mini</option>
          <option value="small">Small</option>
          <option value="regular">Regular</option>
          <option value="large">Large</option>
          <option value="extra-large">Extra Large</option>
        </select>
      </div>
      <div class="control-group">
        <label>Shape</label>
        <select v-model="shape">
          <option value="rounded-rectangle">Rounded Rectangle</option>
          <option value="capsule">Capsule</option>
          <option value="circular">Circular</option>
        </select>
      </div>
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="disabled">
          Disabled
        </label>
      </div>
      <div class="control-group">
        <label>Type</label>
        <select v-model="buttonType">
          <option value="button">Button</option>
          <option value="submit">Submit</option>
          <option value="reset">Reset</option>
        </select>
      </div>
      <div class="control-group">
        <label>Button Text</label>
        <input type="text" v-model="buttonText" placeholder="Button text">
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo-push-button {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 2rem;
}

.demo-preview {
  border: 1px solid var(--pr-color-fill-tertiary);
  background: var(--pr-color-fill-primary);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 1;
}

.demo-controls {
  border: 1px solid var(--pr-color-fill-tertiary);
  background: var(--pr-color-fill-primary);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: var(--pr-font-callout-size);
  color: var(--pr-color-text-secondary);
  font-weight: var(--pr-font-callout-weight);
}

select {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--pr-color-fill-secondary);
  background: var(--pr-color-background);
  color: var(--pr-color-text-primary);
  font-size: var(--pr-font-body-size);
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
}

select:focus {
  border-color: var(--pr-color-system-blue);
}

input[type="text"] {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--pr-color-fill-secondary);
  background: var(--pr-color-background);
  color: var(--pr-color-text-primary);
  font-size: var(--pr-font-body-size);
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
}

input[type="text"]:focus {
  border-color: var(--pr-color-system-blue);
}

input[type="checkbox"] {
  margin-right: 0.5rem;
}
</style>
