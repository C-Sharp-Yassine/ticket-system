<script setup>
import { onMounted, ref } from "vue";

const createdTicket = ref(null);
const tickets = ref([]);
const ticketCode = ref("");
const errorMessage = ref("");

async function createTicket() {
  const response = await fetch("http://localhost:3000/api/tickets", {
    method: "POST",
  });

  createdTicket.value = await response.json();
  tickets.value.push(createdTicket.value);
}

async function fetchTickets() {
  const response = await fetch("http://localhost:3000/api/tickets");
  tickets.value = await response.json();
}

async function useTicket() {
  errorMessage.value = "";

  const response = await fetch("http://localhost:3000/api/tickets/use", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: ticketCode.value,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    errorMessage.value = data.message;
    return;
  }

  tickets.value = tickets.value.map((ticket) =>
    ticket.id === data.id ? data : ticket,
  );
}

async function deleteTicket(id) {
  const response = await fetch(`http://localhost:3000/api/tickets/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    tickets.value = tickets.value.filter((ticket) => ticket.id !== id);
  }
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

      <p v-if="errorMessage">{{ errorMessage }}</p>
    </section>

    <h2>Tickets</h2>

    <ul>
      <li v-for="ticket in tickets" :key="ticket.id">
        {{ ticket.code }} - {{ ticket.used ? "Used" : "Unused" }}

        <button
          v-if="!ticket.used"
          data-testid="delete-ticket-button"
          @click="deleteTicket(ticket.id)"
        >
          Delete
        </button>
      </li>
    </ul>
  </main>
</template>
