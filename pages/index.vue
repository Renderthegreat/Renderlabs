<template>
    <div class="page">
        <h2>Home</h2>
        <p>Welcome to the Renderlabs site!</p>
        <Button @click="kill()"></Button>
    </div>
</template>

<script setup>
import { createError } from 'h3'


function kill() {
    throw createError({ statusCode: 500, statusMessage: 'Fox down!', fatal: true });
};
</script>