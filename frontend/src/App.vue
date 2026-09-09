<script setup>
async function createTicket() {
  await fetch("http://localhost:3000/api/tickets", {
    method: "POST",
  });
}
</script>

<template>
  <main>
    <h1>Ticket System</h1>

    <button @click="createTicket">Create Ticket</button>
  </main>
</template>
