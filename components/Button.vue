<template>
    <button :class="['rl-button', variant, type]" :style="{
        '--btn-fg': fgColor,
        '--btn-bg': bgColor,
        '--btn-hover': hoverColor
    }" @click="$emit('click')">
        <slot />
    </button>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
    type: {
        type: String,
        default: 'default', // 'primary', 'danger', etc.
    },
    variant: {
        type: String,
        default: 'filled', // 'outline' or 'filled'
    },
    fg: String,
    bg: String,
    hover: String
});

const fgColor = computed(() => props.fg || 'var(--foreground-color)');
const bgColor = computed(() => props.bg || 'var(--background-color)');
const hoverColor = computed(() => props.hover || 'rgba(255,255,255,0.1)');
</script>

<style scoped>
.rl-button {
    all: unset;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 500;
    transition: background 0.2s ease, color 0.2s ease;
    text-align: center;
    user-select: none;
    display: inline-block;
    backdrop-filter: blur(8px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.filled {
    background-color: var(--btn-bg);
    color: var(--btn-fg);
}

.filled:hover {
    background-color: var(--btn-hover);
}

.outline {
    border: 2px solid var(--btn-bg);
    color: var(--btn-bg);
    background: transparent;
}

.outline:hover {
    background-color: var(--btn-hover);
}
</style>