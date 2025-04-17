<template>
  <footer class="site-footer">
    <FrostedGlass class="site-footer-glass">
      <p>
        &copy; {{ new Date().getFullYear() }} {{ $t("renderlabs") }}.
        {{ $t("all_rights_reserved") }}.
      </p>
    </FrostedGlass>
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
  z-index: 100;
}

.site-footer-glass {
}
</style>
