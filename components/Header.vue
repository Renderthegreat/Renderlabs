<template>
    <header class="site-header">
        <FrostedGlass>
            <h1>Renderlabs</h1>
            <nav>
                <router-link to="/">Home</router-link>
                <router-link to="/about">About</router-link>
            </nav>
        </FrostedGlass>
    </header>
</template>

<style scoped>
.site-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
}

nav a {
    margin-left: 12px;
    text-decoration: none;
    color: var(--link-color);
}
</style>