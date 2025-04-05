<template>
  <ClientOnly>
    <head>
      <link rel="icon" type="image/svg+xml" href="/renderlabs.svg" />
      <title>Renderlabs</title>
    </head>
  </ClientOnly>
  <div id="app">
    <Header />
    <main id="main">
      <NuxtPage></NuxtPage>
    </main>
    <Footer />
  </div>
</template>

<script src="assets/js/attach.js"></script>
