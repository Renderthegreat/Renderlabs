<template>
    <transition name="alert-fade">
        <div v-show="visible" class="alert-overlay">
            <div class="alert-blur"></div>
            <div class="alert-box">
                <p class="alert-message">{{ message }}</p>
                <div class="alert-buttons">
                    <Button v-for="(button, index) in buttons" :key="index" @click="handleButton(button)"
                        class="alert-button" :style="{ background: `var(--alert-button-${button.type}-color)` }">
                        {{ button.label }}
                    </Button>
                </div>
            </div>
        </div>
    </transition>
</template>



<script setup>
import { ref, defineExpose } from 'vue';
import Button from '/components/Button.vue';

const visible = ref(false);
const message = ref('');
const buttons = ref([]);

function showAlert(msg, btns = []) {
    message.value = msg;
    buttons.value = btns;
    visible.value = true;
};

function hideAlert() {
    visible.value = false;
};

function handleButton(button) {
    if (typeof button.onClick === 'function') {
        button.onClick();
    }
    hideAlert();
};

defineExpose({ showAlert });
</script>

<style scoped>
.alert-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.alert-blur {
    position: absolute;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.3);
    z-index: 1;
}

.alert-box {
    position: relative;
    z-index: 1;
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    max-width: 90%;
    text-align: center;
}

.alert-message {
    margin-bottom: 16px;
    font-size: 1.2rem;
    color: #333;
}

.alert-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
}

.alert-button {
    padding: 8px 16px;
    font-size: 1rem;
    background-color: var(--alert-button-default-color);
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    transition: background 1s ease;
}

/* Fade transition for entire alert */
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: opacity 500ms ease;
  backdrop-filter: blur(10px);
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transition: backdrop-filter blur(0px);
}

</style>