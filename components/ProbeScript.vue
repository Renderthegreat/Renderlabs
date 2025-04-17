<template>
  <component :is="'script'" v-html="node.children?.[0]?.value" />
</template>

<script setup>
defineProps({
  node: Object,
});
</script>
