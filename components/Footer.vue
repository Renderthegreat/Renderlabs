<template>
    <footer class="site-footer">
      <p>&copy; {{ new Date().getFullYear() }} Renderlabs. All rights reserved.</p>
    </footer>
  </template>
  
  <style scoped>
  .site-footer {
    text-align: center;
    padding: 12px;
    bottom: 0;
    background: var(--background-color);
    backdrop-filter: blur(10px);
  }
  </style>
  