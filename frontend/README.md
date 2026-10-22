# Annonify – Frontend (React + Vite)

Client for the Annonify anonymous-messaging API.

## Run
```bash
npm install
cp .env.example .env     # set VITE_API_URL to your backend (default http://localhost:9000)
npm run dev              # http://localhost:5173
npm run build            # production build in /dist
```

## Structure
```
src/
├── api/         client.js (fetch + auto token refresh), services.js (auth / user / message)
├── context/     AuthContext.jsx
├── hooks/       useSubmit.js
├── components/  Navbar, Alert, ProtectedRoute, MessageCard
├── pages/       Login, Signup, Confirm, Inbox, SendMessage, Profile
├── App.jsx      routes
└── main.jsx
```

## Routes (HashRouter, works on any static host)
`/login` `/signup` `/confirm?email=` `/inbox` `/profile` `/u/:userId` (public send page)
