<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { $t } from "~/assets/ts/translate";
import { parseMarkdown } from "@nuxtjs/mdc/runtime";

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
});

const ast = ref<any>(null);

if (globalThis?.window)
  watchEffect(async () => {
    try {
      const response = await fetch(props.path);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${props.path}: ${response.statusText}`
        );
      }
      const md = await response.text();
      const parsed = await parseMarkdown(
        md
          .replace(/<!--\s*\$t\s*<([^>]+)>\s*-->/g, (_, key) => $t(key.trim()))
          .replace(/<script>/g, "<ProbeScript>")
          .replace(/<\/script>/g, "</ProbeScript>")
      );
      ast.value = parsed;
    } catch (error) {
      console.error(error);
    }
  });
</script>

<template>
  <div v-if="ast">
    <MDCRenderer :body="ast.body" :data="ast.data" />
  </div>
</template>
