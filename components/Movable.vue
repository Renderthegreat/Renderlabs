<template>
    <div ref="el" class="movable" :style="style" @mousedown="startDrag">
        <slot />
    </div>
</template>
<script setup>
import { ref, reactive, watch } from 'vue';

const props = defineProps({
    movable: { type: Boolean, default: true },
});

const el = ref(null);
const position = reactive({ x: 0, y: 0 });
const isDragging = ref(false);
const offset = reactive({ x: 0, y: 0 });

const style = computed(() => ({
    transform: `translate(${position.x}px, ${position.y}px)`,
    cursor: props.movable ? 'move' : 'default',
    userSelect: 'none',
    position: 'absolute',
}));

const startDrag = (e) => {
    if (!props.movable) return;
    isDragging.value = true;
    offset.x = e.clientX - position.x;
    offset.y = e.clientY - position.y;
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
};

const onDrag = (e) => {
    if (!isDragging.value) return;
    position.x = e.clientX - offset.x;
    position.y = e.clientY - offset.y;
};

const stopDrag = () => {
    isDragging.value = false;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
};
</script>
<style scoped>
.movable {
    z-index: 10;
}
</style>