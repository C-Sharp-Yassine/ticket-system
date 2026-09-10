<script setup>
import { onMounted, ref } from "vue";

const createdTicket = ref(null);
const tickets = ref([]);
const ticketCode = ref("");

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

async function useTicket() {
  const response = await fetch("http://localhost:3000/api/tickets/use", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: ticketCode.value,
    }),
  });
  const updatedTicket = await response.json();

  tickets.value = tickets.value.map((ticket) =>
    ticket.id === updatedTicket.id ? updatedTicket : ticket,
  );
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

    <section>
      <h2>Use Ticket</h2>

      <input v-model="ticketCode" type="text" placeholder="Ticket code" />
      <button data-testid="use-ticket-button" @click="useTicket">
        Use Ticket
      </button>
    </section>

    <h2>Tickets</h2>

    <ul>
      <li v-for="ticket in tickets" :key="ticket.id">
        {{ ticket.code }} - {{ ticket.used ? "Used" : "Unused" }}
      </li>
    </ul>
  </main>
</template>
