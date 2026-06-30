# TaskNest

A full-stack task management app with authentication and personal task tracking.

## Tech Stack

- Frontend: React, Vite, Axios, React Router, Bootstrap
- Backend: Node.js, Express
- Database: MongoDB + Mongoose
- Auth: JWT (`jsonwebtoken`), password hashing (`bcryptjs`)

## Features

- Register and login
- Protected dashboard and tasks pages
- Task CRUD (create, edit, complete, delete)
- Search, filter, sort, and pagination
- User-specific task data

## Setup

### 1) Clone

```bash
git clone https://github.com/terana-palihawadana/TaskNest.git
cd TaskNest
```

### 2) Backend

```bash
cd server
npm install
```

Create `.env` from `.env.example` and set:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
CLIENT_URL=http://localhost:5173
```

Start server:

```bash
npm run dev
```

### 3) Frontend

```bash
cd client
npm install
```

Create `.env` from `.env.example` and set:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## API

Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (protected)

### Tasks (protected)
- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

Use header:

`Authorization: Bearer <token>`

## Deployment

- **Frontend (Vercel):** set `VITE_API_URL` to your backend URL with `/api`, then redeploy
- **Backend (Render):** set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` (your frontend URL)

Example:

```env
# Vercel
VITE_API_URL=https://your-api.onrender.com/api

# Render
CLIENT_URL=https://your-app.vercel.app
```

