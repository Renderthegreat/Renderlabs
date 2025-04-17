<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div id="auth-type" class="auth-buttons">
        <Button @click="mode = 'login'">
          {{ $t("auth.login.label") }}
        </Button>
        <Button @click="mode = 'signup'">
          {{ $t("auth.signup.label") }}
        </Button>
      </div>

      <UForm
        @submit="onSubmit"
        :schema="schema"
        :state="state"
        id="auth"
        class="auth-form"
      >
        <UFormField :label="$t('auth.email')" name="email">
          <UInput
            type="email"
            :placeholder="$t('auth.email')"
            v-model="state.email"
            class="auth-input"
          />
        </UFormField>
        <UFormField
          v-if="mode === 'signup'"
          :label="$t('auth.username')"
          name="username"
        >
          <UInput
            id="auth-username"
            :placeholder="$t('auth.username')"
            v-model="state.username"
            class="auth-input"
          />
        </UFormField>
        <UFormField :label="$t('auth.password')" name="password">
          <UInput
            type="password"
            id="auth-password"
            :placeholder="$t('auth.password')"
            v-model="state.password"
            class="auth-input"
          />
        </UFormField>

        <UFormField
          v-if="mode === 'signup'"
          :label="$t('auth.confirm_password')"
          name="password"
        >
          <UInput
            id="auth-password-confirm"
            type="password"
            :placeholder="$t('auth.confirm_password')"
            v-model="state.confirmPassword"
            class="auth-input"
          />
        </UFormField>
        <Captcha v-if="mode === 'signup'" class="auth-input" ref="captcha" />

        <Button type="submit" id="submit">
          {{
            mode === "login" ? $t("auth.login.label") : $t("auth.signup.label")
          }}
        </Button>
      </UForm>

      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        :title="$t('auth.error')"
        :description="error"
      />
      <UAlert
        v-if="success"
        color="success"
        variant="subtle"
        :title="$t('auth.success')"
        :description="success"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as bcrypt from "bcryptjs";
import type { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";
import Button from "~/components/Button.vue";
import Captcha from "~/components/Captcha.vue";
import { $t } from "~/assets/ts/translate";
import { useClient } from "~/composable/useClient";
import { ManagerEvent, ManagerEventType } from "~/assets/ts/manager";

const mode = ref<"login" | "signup">("login");
const captcha = ref();
const error = ref("");
const success = ref("");
const state = reactive({
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
});
const client = useClient();

const loginSchema = v.object({
  email: v.pipe(v.string(), v.email(`${$t("input.invalid_email")}`)),
  password: v.pipe(
    v.string(),
    v.minLength(
      12,
      `${$t("auth.password")} ${$t("input.at_least")} 12 ${$t(
        "input.characters"
      )}`
    )
  ),
});

const signupSchema = v.object({
  email: v.pipe(v.string(), v.email(`${$t("input.invalid_email")}`)),
  username: v.pipe(
    v.string(),
    v.minLength(
      3,
      `${$t("auth.username")} ${$t("input.at_least")} 3 ${$t(
        "input.characters"
      )}`
    ),
    v.maxLength(
      20,
      `${$t("auth.username")} ${$t("input.at_most")} 20 ${$t(
        "input.characters"
      )}`
    ),
    v.regex(/^[a-zA-Z0-9_]+$/, $t("auth.invalid_username"))
  ),
  password: v.pipe(
    v.string(),
    v.minLength(
      12,
      `${$t("auth.password")} ${$t("input.at_least")} 12 ${$t(
        "input.characters"
      )}`
    )
  ),
  confirmPassword: v.any(),
});

const schema: any = computed(() => {
  return mode.value === "login" ? loginSchema : signupSchema;
});

type Schema = v.InferOutput<typeof schema>;

async function onSubmit(event: FormSubmitEvent<Schema>) {
  error.value = "" as any;
  if (!(captcha.value as any)?.key && mode.value == "signup") {
    error.value = $t("auth.captcha.empy");
    return;
  }

  if (
    mode.value === "signup" &&
    event.data.password !== event.data.confirmPassword
  ) {
    error.value = $t("auth.passwords_not_match");
    return;
  }
  if (mode.value == "login") {
    const response = await client?.$post(
      new ManagerEvent(ManagerEventType.ACCOUNT_LOGIN, {
        email: event.data.email,
        password: event.data.password,
      })
    );
    console.log(response);
    if (response?.eventType === ManagerEventType.OPERATION_SUCCESS) {
      client?.setToken(response.parameters["token"]);
      success.value = $t("auth.login.success");
    } else {
      error.value = response?.parameters["description"];
    }
  } else if (mode.value == "signup") {
    const response = await client?.$post(
      new ManagerEvent(ManagerEventType.ACCOUNT_CREATE, {
        email: event.data.email,
        username: event.data.username,
        password: event.data.password,
        validator: {
          data: captcha.value.key.data,
          iv: captcha.value.key.iv,
        },
      })
    );
    console.log(response);
    if (response?.eventType === ManagerEventType.OPERATION_SUCCESS) {
      client?.setToken(response.parameters["token"]);
      success.value = $t("auth.signup.success");
    } else {
      error.value = response?.parameters["description"];
    }
  } else return;
}
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.auth-input {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
