<template>
  <header class="site-header">
    <FrostedGlass>
      <h1 class="site-header-title">Renderlabs</h1>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
      </nav>
    </FrostedGlass>
  </header>
</template>

<style scoped>
FrostedGlass {
  width: 100vw;
  height: 100px;
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.site-header-title {
  align-self: left;
}

nav a {
  margin-left: 12px;
  text-decoration: none;
  color: var(--link-color);
}
</style>
