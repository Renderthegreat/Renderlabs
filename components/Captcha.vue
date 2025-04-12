<template>
  <div class="captcha-box">
    <Button @click="generateCaptcha">
      <span>{{ $t("captcha_generate") }}</span>
    </Button>

    <transition name="fade">
      <div v-if="captchaSvg" class="captcha-container">
        <div class="svg-wrapper" v-html="captchaSvg"></div>
        <UInput
          v-model="captchaSolution"
          :placeholder="$t(`captcha_placeholder`)"
        />
        <Button :disabled="submitting" @click="submitCaptcha">
          <Icon name="i-heroicons-check-badge"></Icon>
          <span v-if="!submitting">{{ $t("captcha_submit") }}</span>
          <span v-else>{{ $t("captcha_submitting") }}</span>
        </Button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { $t } from "~/assets/ts/translate";
import { useClient } from "~/composable/useClient";
import { ManagerEvent, ManagerEventType } from "assets/ts/manager";

const emit = defineEmits(["captcha-auth"]);

const client = useClient();
const captchaSvg = ref("");
const captchaId = ref(null);
const captchaSolution = ref("");
const submitting = ref(false);

async function generateCaptcha() {
  const response = await client.$post(
    new ManagerEvent(ManagerEventType.GENERATE_CAPTCHA, {})
  );

  if (response?.parameters?.svg && response?.parameters?.id !== undefined) {
    captchaSvg.value = response.parameters.svg;
    captchaId.value = response.parameters.id;
    captchaSolution.value = "";
  }
}

async function submitCaptcha() {
  if (!captchaId.value || !captchaSolution.value) {
    client.toast.add({
      id: "captcha",
      description: $t("captcha_empty"),
      color: "red",
      icon: "i-heroicons-exclamation-triangle",
    });
    return;
  }

  submitting.value = true;

  const response = await client.$post(
    new ManagerEvent(ManagerEventType.VALIDATE_CAPTCHA, {
      id: captchaId.value,
      key: btoa(captchaSolution.value),
    })
  );

  submitting.value = false;

  if (response?.eventType === ManagerEventType.OPERATION_SUCCESS) {
    client.toast.add({
      id: "captcha",
      title: $t("captcha_success"),
      description: $t("captcha_success_description"),
      color: "green",
      icon: "i-heroicons-check-circle-solid",
    });
    emit("captcha-auth", {
      id: captchaId.value,
      key: btoa(captchaSolution.value),
    });
  } else {
    client.toast.add({
      id: "captcha",
      title: $t("captcha_failed"),
      description: $t(response.parameters["description"]),
      color: "red",
      icon: "i-heroicons-exclamation-circle-solid",
    });
  }
}
</script>

<style scoped>
.captcha-box {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: start;
}

.captcha-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.svg-wrapper {
  animation: fade-in 0.5s ease;
  max-width: 250px;
  padding: 0.5rem;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
