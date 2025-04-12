<template>
  <footer class="site-footer">
    <p>
      &copy; {{ new Date().getFullYear() }} {{ $t("renderlabs") }}.
      {{ $t("all_rights_reserved") }}.
    </p>
  </footer>
</template>

<script setup>
import { $t } from "~/assets/ts/translate";
</script>

<style scoped>
.site-footer {
  text-align: center;
  padding: 12px;
  background: var(--background-color);
  backdrop-filter: blur(10px);
}
</style>
