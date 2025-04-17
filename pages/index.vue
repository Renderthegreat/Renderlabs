<template>
  <div class="page">
    <Document path="/content/index/welcome.md" />
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
