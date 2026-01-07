// ARK Config Manager - Sub-components
import { h, computed } from 'vue';

// ConfigSlider Component
export const ConfigSlider = {
  props: ['modelValue', 'label', 'min', 'max', 'step', 'prefix', 'suffix', 'tooltip'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('div', { class: 'config-item' }, [
      h('label', [
        props.label,
        props.tooltip ? h('span', { class: 'tooltip', title: props.tooltip }, ' ℹ️') : null
      ]),
      h('div', { class: 'input-with-value' }, [
        h('input', {
          type: 'range',
          value: props.modelValue,
          min: props.min,
          max: props.max,
          step: props.step || 1,
          onInput: (e) => emit('update:modelValue', parseFloat(e.target.value))
        }),
        h('span', { class: 'value-display' }, 
          `${props.prefix || ''}${props.modelValue}${props.suffix || ''}`
        )
      ])
    ]);
  }
};

// ConfigNumber Component
export const ConfigNumber = {
  props: ['modelValue', 'label', 'min', 'max', 'step', 'tooltip'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('div', { class: 'config-item' }, [
      h('label', [
        props.label,
        props.tooltip ? h('span', { class: 'tooltip', title: props.tooltip }, ' ℹ️') : null
      ]),
      h('div', { class: 'input-with-value' }, [
        h('input', {
          type: 'number',
          value: props.modelValue,
          min: props.min,
          max: props.max,
          step: props.step || 1,
          onInput: (e) => emit('update:modelValue', parseFloat(e.target.value))
        })
      ])
    ]);
  }
};

// ConfigToggle Component
export const ConfigToggle = {
  props: ['modelValue', 'label', 'invert'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('div', { class: 'toggle-item' }, [
      h('label', props.label),
      h('input', {
        type: 'checkbox',
        checked: props.invert ? !props.modelValue : props.modelValue,
        onChange: (e) => emit('update:modelValue', props.invert ? !e.target.checked : e.target.checked)
      })
    ]);
  }
};

// ConfigText Component
export const ConfigText = {
  props: ['modelValue', 'label', 'placeholder', 'tooltip'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('div', { class: 'config-item' }, [
      h('label', [
        props.label,
        props.tooltip ? h('span', { class: 'tooltip', title: props.tooltip }, ' ℹ️') : null
      ]),
      h('div', { class: 'input-with-value' }, [
        h('input', {
          type: 'text',
          value: props.modelValue,
          placeholder: props.placeholder || '',
          onInput: (e) => emit('update:modelValue', e.target.value)
        })
      ])
    ]);
  }
};

// ResourceGathererConfig Component
export const ResourceGathererConfig = {
  props: ['modelValue', 'resource', 'icon'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const enabled = computed({
      get: () => props.modelValue[`${props.resource}Enabled`],
      set: (v) => {
        const updated = { ...props.modelValue };
        updated[`${props.resource}Enabled`] = v;
        emit('update:modelValue', updated);
      }
    });
    
    const multiplier = computed({
      get: () => props.modelValue[`${props.resource}Multiplier`] || 1,
      set: (v) => {
        const updated = { ...props.modelValue };
        updated[`${props.resource}Multiplier`] = v;
        emit('update:modelValue', updated);
      }
    });
    
    const maxItems = computed({
      get: () => props.modelValue[`${props.resource}MaxItems`] || 1000,
      set: (v) => {
        const updated = { ...props.modelValue };
        updated[`${props.resource}MaxItems`] = v;
        emit('update:modelValue', updated);
      }
    });

    return () => h('div', { class: 'resource-config' }, [
      h('div', { class: 'resource-header' }, [
        h('span', { class: 'resource-icon' }, props.icon),
        h('span', { class: 'resource-name' }, props.resource),
        h('input', {
          type: 'checkbox',
          checked: enabled.value,
          onChange: (e) => { enabled.value = e.target.checked; }
        })
      ]),
      enabled.value ? h('div', { class: 'resource-settings' }, [
        h('div', { class: 'mini-input' }, [
          h('label', 'Mult'),
          h('input', {
            type: 'number',
            value: multiplier.value,
            step: 0.5,
            min: 0.1,
            max: 10,
            onInput: (e) => { multiplier.value = parseFloat(e.target.value); }
          })
        ]),
        h('div', { class: 'mini-input' }, [
          h('label', 'Max'),
          h('input', {
            type: 'number',
            value: maxItems.value,
            step: 100,
            min: 100,
            max: 10000,
            onInput: (e) => { maxItems.value = parseInt(e.target.value); }
          })
        ])
      ]) : null
    ]);
  }
};
