<template>
  <div class="page">
    <section class="hero">
      <div class="container">
        <h1>ConseilAgents</h1>
        <p>Page en construction...</p>
        <router-link to="/" class="cta">← Retour</router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; padding-top: 100px; }
.hero {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.cta {
  display: inline-block;
  margin-top: var(--space-md);
  padding: 1rem 2rem;
  border: 2px solid var(--matrix-green);
  border-radius: 8px;
}
</style>
