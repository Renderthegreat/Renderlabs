<template>
    <div class="fun-error">
        <div class="error-card">
            <h1>🦊 What does the error say?</h1>
            <p class="fox-line">💥 Ring-ding-ding-ding-dingeringeding! 💥</p>
            <p class="sub-line">Oops! Something unexpected happened...</p>

            <button @click="copyError" class="copy-button">
                <IconClipboard />
                <span>Copy Error</span>
            </button>

            <details class="error-details">
                <summary>Show technical info</summary>
                <pre>{{ JSON.stringify(error, null, 2) }}</pre>
            </details>
        </div>
    </div>
</template>

<script setup>
import { useError } from '#app'

const error = useError()

function copyError() {
    navigator.clipboard.writeText(JSON.stringify(error.value, null, 2))
}
</script>

<style scoped>
.fun-error {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5vh 2rem;
    min-height: 100vh;
    background: var(--background-color, #f0f0f0);
    color: var(--foreground-color, #1c1c1c);
    text-align: center;
}

.error-card {
    background: white;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
}

h1 {
    font-size: 2rem;
    margin-bottom: 12px;
}

.fox-line {
    font-size: 1.4rem;
    font-weight: bold;
    color: #e44;
    margin-bottom: 8px;
}

.sub-line {
    font-size: 1rem;
    margin-bottom: 24px;
}

.copy-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background-color: #333;
    color: #fff;
    border: none;
    padding: 10px 18px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
}

.copy-button:hover {
    background-color: #000;
}

.error-details {
    margin-top: 20px;
    text-align: left;
    background: #f8f8f8;
    border-radius: 12px;
    padding: 12px;
    font-family: monospace;
    font-size: 0.9rem;
    overflow-x: auto;
}
</style>