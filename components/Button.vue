<template>
  <UButton class="button" v-bind="$attrs" @click="$emit('click')">
    <slot />
  </UButton>
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
});
</script>

<style>
.button {
}
</style>
