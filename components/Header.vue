<template>
  <Alert ref="alertRef"></Alert>
  <header class="site-header">
    <FrostedGlass class="site-header-glass">
      <div class="site-header-title">{{ $t("renderlabs") }}</div>
      <nav class="site-header-nav">
        <ULink to="/">{{ $t("home") }}</ULink>
        <ULink to="/about">{{ $t("about") }}</ULink>
      </nav>
    </FrostedGlass>
  </header>
</template>

<script setup>
import { $t } from "~/assets/ts/translate";
import Alert from "~/components/Alert.vue";
import { ref, onMounted } from "vue";

const alertRef = ref();

onMounted(() => {
  window.$alert = alertRef.value.showAlert;
});
</script>

<style scoped>
.site-header {
  position: sticky;
  display: flex;
  width: 100%;
  height: 100px;
}

.site-header-glass {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  gap: 100px;
  border-radius: 0%;
}

.site-header {
  display: block;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.site-header-title {
  font-size: 2rem;
  font-weight: bold;
  color: white;
}

nav a {
  margin-left: 12px;
  text-decoration: none;
  color: var(--link-color);
  align-content: right;
}

.site-header-nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}
</style>
