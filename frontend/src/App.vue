<script setup>
import { onMounted, ref } from "vue";

const createdTicket = ref(null);
const tickets = ref([]);

async function createTicket() {
  const response = await fetch("http://localhost:3000/api/tickets", {
    method: "POST",
  });

  createdTicket.value = await response.json();
}

async function fetchTickets() {
  const response = await fetch("http://localhost:3000/api/tickets");
  tickets.value = await response.json();
}

onMounted(fetchTickets);
</script>

<template>
  <main>
    <h1>Ticket System</h1>

    <button @click="createTicket">Create Ticket</button>

    <p v-if="createdTicket">
      {{ createdTicket.code }}
    </p>

    <h2>Tickets</h2>

    <ul>
      <li v-for="ticket in tickets" :key="ticket.id">
        {{ ticket.code }} - {{ ticket.used ? "Used" : "Unused" }}
      </li>
    </ul>
  </main>
</template>
