<template>
  <div class="captcha-box">
    <Button @click="generateCaptcha">
      <Icon name="i-heroicons-lock-closed-solid"></Icon>
      {{ $t("auth.captcha.generate") }}
    </Button>

    <transition name="fade">
      <div v-if="captchaSvg" class="captcha-container">
        <div class="svg-wrapper" v-html="captchaSvg"></div>
        <UFormField
          :label="$t('auth.captcha.solution')"
          :error="captchaError"
          :success="captchaSuccess"
        >
          <UPinInput v-model="captchaSolution" :length="8" />
        </UFormField>
        <Button
          :disabled="submitting || submitted"
          @click="submitCaptcha"
          :icon="submitted ? 'i-heroicons-check-badge-solid' : null"
        >
          <span v-if="!submitting">{{ $t("auth.captcha.submit") }}</span>
          <span v-else>{{ $t("auth.captcha.submitting") }}</span>
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
const captchaSolution = ref([]);
const captchaKey = ref(null);
const captchaError = ref("");
const captchaSuccess = ref("");
const submitting = ref(false);
const submitted = ref(false);

async function generateCaptcha() {
  const response = await client.$post(
    new ManagerEvent(ManagerEventType.GENERATE_CAPTCHA, {})
  );
  submitted.value = false;
  captchaSuccess.value = "";
  captchaError.value = "";

  if (response?.parameters?.svg && response?.parameters?.id !== undefined) {
    captchaSvg.value = response.parameters.svg;
    captchaId.value = response.parameters.id;
    captchaSolution.value = "";
  }
}

async function submitCaptcha() {
  if (!captchaId.value || !captchaSolution.value) {
    captchaError.value = $t("auth.captcha.empty");
    return;
  }

  submitting.value = true;

  const response = await client.$post(
    new ManagerEvent(ManagerEventType.VALIDATE_CAPTCHA, {
      id: captchaId.value,
      key: btoa(captchaSolution.value.join("")),
    })
  );

  submitting.value = false;

  if (response?.eventType === ManagerEventType.OPERATION_SUCCESS) {
    captchaError.value = null;
    captchaKey.value = response.parameters["captcha"];
    submitted.value = true;
    captchaSuccess.value = $t("auth.captcha.success");
  } else {
    captchaError.value = $t(response.parameters["description"]);
  }
}

defineExpose({
  id: captchaId.value,
  key: captchaKey,
});
</script>

<style scoped>
.captcha-box {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.captcha-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.svg-wrapper {
  animation: fade-in 0.5s ease;
  max-width: 100%;
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
