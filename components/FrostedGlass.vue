<template>
  <div class="frosted-wrapper" ref="frostedWrapper">
    <div class="blurred-background" ref="blurredBackground"></div>
    <div class="foreground-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
slot {
  position: relative;
  align-self: center;
  filter: none;
};

.frosted-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  border-radius: 10px;
}

.blurred-background {
  position: absolute;
  width: 100%;
  height: 100%;
  filter: blur(15px);
  backdrop-filter: blur(15px);
  background-repeat: no-repeat;
  background-position: center;
}

.blurred-background::before {
  box-shadow: inset 0 0 2000px rgba(255, 255, 255, 0.5);
}

.foreground-content {
  position: relative;
  filter: none;
}
</style>
