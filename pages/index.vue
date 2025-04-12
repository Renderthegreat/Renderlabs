<template>
  <div class="page">
    <h2>Home</h2>
    <p>Welcome to the Renderlabs site!</p>
    <Movable>
      <FrostedGlass>
        <Captcha></Captcha>
      </FrostedGlass>
    </Movable>
  </div>
</template>

<script setup lang="ts">
import Captcha from "~/components/Captcha.vue";
</script>
