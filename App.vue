<template>
  <ClientOnly>
    <head>
      <link rel="icon" type="image/svg+xml" href="/renderlabs.svg" />
      <title>Renderlabs</title>
    </head>
    <UNotifications />
  </ClientOnly>
  <div id="app">
    <Header />
    <main id="main">
      <!--ErrorComponent v-if="error" :error="error" /-->
      <NuxtPage></NuxtPage>
    </main>
    <Footer />
  </div>
</template>

<script src="assets/ts/attach.ts" lang="ts"></script>
