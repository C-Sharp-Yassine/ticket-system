<script setup>
import { ref } from "vue";

const createdTicket = ref(null);

async function createTicket() {
  const response = await fetch("http://localhost:3000/api/tickets", {
    method: "POST",
  });

  createdTicket.value = await response.json();
}
</script>

<template>
  <main>
    <h1>Ticket System</h1>

    <button @click="createTicket">Create Ticket</button>

    <p v-if="createdTicket">
      {{ createdTicket.code }}
    </p>
  </main>
</template>
