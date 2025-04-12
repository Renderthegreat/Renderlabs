<template>
  <UButton @click="$emit('click')">
    <slot />
  </UButton>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  type: {
    type: String,
    default: "default", // 'primary', 'danger', etc.
  },
  variant: {
    type: String,
    default: "filled", // 'outline' or 'filled'
  },
  fg: String,
  bg: String,
  hover: String,
});

const fgColor = computed(() => props.fg || "var(--foreground-color)");
const bgColor = computed(() => props.bg || "var(--background-color)");
const hoverColor = computed(() => props.hover || "rgba(255,255,255,0.1)");
</script>

<style scoped></style>
