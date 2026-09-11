# Ticket System

Ett fullstack biljettsystem byggt med Vue, Node.js, Express och SQLite.

## Funktioner

- Skapa en biljett med en unik kod
- Lista alla biljetter
- Visa om en biljett är använd eller oanvänd
- Använda en biljett genom att ange biljettkoden 
- Förhindra ett samma biljett används flera gånger
- Radera oanvända biljetter
- Förhindra att använda biljetter raderas
- CORS mellan frontend och backend
- Tester för både frontend och backend

## Tekniker

### Frontend

- Vue 
- Vite
- Vitest
- Vue Test Utils

### Backend

- Node.js
- Express
- Better-sqlite3
- Supertest

## Databasdesign

Projektet använder en lokal SQLite databas.

### Tabellen 'Tickets'

| Kolumn | Typ | Beskrivning |
|---|---|---|
| `id` | INTEGER | Primärnyckel med automatisk ökning |
| `code` | TEXT | Unik biljettkod |
| `created_at` | TEXT | Tidpunkt då biljetten skapades |
| `used` | INTEGER | `0` = oanvänd, `1` = använd |
| `used_at` | TEXT | Tidpunkt då biljetten användes, annars `NULL` |

Databasens struktur: 

```text
tickets
├── id INTEGER PRIMARY KEY AUTOINCREMENT
├── code TEXT UNIQUE NOT NULL
├── created_at TEXT NOT NULL
├── used INTEGER NOT NULL DEFAULT 0
└── used_at TEXT NULL
```


## API-endpoints

| Metod | Endpoint | Beskrivning |
|---|---|---|
| POST | `/api/tickets` | Skapar en ny biljett |
| GET | `/api/tickets` | Hämtar alla biljetter |
| PATCH | `/api/tickets/use` | Använder en biljett via biljettkod |
| DELETE | `/api/tickets/:id` | Raderar en oanvänd biljett |

## Installation

Klona projektet

- git clone https://github.com/C-Sharp-Yassine/ticket-system.git
- cd ticket-system

### Backend

- Gå till backend-mappen: cd backend
- Installera beroenden: pnpm install
- Skapa och initiera databasen: pnpm db:init
- Starta backend: pnpm start
- Backend körs på: http://localhost:3000

### Frontend

- Öppna en ny terminal från projektets rotmapp och gå till frontend mappen: cd frontend
- Installera beroenden: pnpm install
- Starta frontend: pnpm dev
- Frontend körs på: http://localhost:5173

## CORS

- Backend är konfigurerad för att tillåta anrop från frontend på: http://localhost:5173 det gör att frontend kan kommunicera trots att de körs på olika portar.

## Tester

Projektet innehåller tester för både backend och frontend.

### Backendtester

- Kör från backend: pnpm test

### Frontendtester

- Kör från frontend: pnpm test

## Projektstruktur

```text
ticket-system/
├── backend/
│   └── src/
│       ├── db/
│       ├── routes/
│       ├── tests/
│       ├── app.js
│       └── server.js
├── frontend/
│   └── src/
│       ├── App.vue
│       ├── App.test.js
│       ├── main.js
│       └── style.css
├── .gitignore
└── README.md
```


  



