<template>
  <ClientOnly>
    <head>
      <link rel="icon" type="image/svg+xml" href="~/assets/renderlabs.svg" />
      <title>{{ $t("renderlabs") }}</title>
    </head>
    <UNotifications />
  </ClientOnly>
  <UApp id="app">
    <Header />
    <main id="main">
      <!--ErrorComponent v-if="error" :error="error" /-->
      <NuxtPage></NuxtPage>
    </main>
    <Footer />
  </UApp>
</template>

<script src="~/assets/ts/attach.ts" lang="ts"></script>
