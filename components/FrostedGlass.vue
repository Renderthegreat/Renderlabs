<template>
  <div class="frosted-wrapper">
    <div class="blurred-background"></div>
    <div class="foreground-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
slot {
  position: relative;
  align-self: center;
  filter: none; /* dummy comment to prevent formatting */
}

.frosted-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  width: fit-content;
  height: fit-content;
  border-radius: 10px;
}

.blurred-background {
  position: absolute;
  width: 100%;
  height: 100%;
  filter: blur(75px);
  backdrop-filter: blur(15px);
  background-repeat: no-repeat;
  background-position: center;
  background-color: var(--background-color);
}

.blurred-background::before {
  box-shadow: inset 0 0 2000px rgba(255, 255, 255, 0.5);
}

.foreground-content {
  position: relative;
  filter: none;
  padding: 16px;
}
</style>
