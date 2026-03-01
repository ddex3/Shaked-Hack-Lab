# Shaked Hack Lab

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docs.docker.com/compose/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)

A hands-on cybersecurity training platform featuring interactive CTF challenges, structured courses, and Docker-based sandbox environments. Learn offensive and defensive security through real terminal sessions, SQL injection labs, forensics investigations, and more.

## Why Shaked Hack Lab?

- **Learn by doing** - Solve real security challenges inside isolated Docker sandboxes, not just read about them.
- **Structured learning paths** - Follow guided courses with lessons, quizzes, and hands-on labs that build skills progressively.
- **Safe environment** - Every challenge runs in a disposable container with resource limits, network isolation, and read-only filesystems.
- **Gamified progress** - Earn points, climb the leaderboard, unlock hints, and track your XP across challenges and courses.
- **Full-stack platform** - A production-ready monorepo with modern tooling (React 19, Express, Prisma, Vite, Tailwind CSS).

## Screenshots

<table>
  <tr>
    <td><img src="assets/image.png" alt="Challenge Interface" width="100%"><br><strong>Challenge Interface</strong> - Instructions, scoring, timer, and progressive hint system</td>
    <td><img src="assets/image1.png" alt="Sandbox Terminal" width="100%"><br><strong>Sandbox Terminal</strong> - Live Docker-based terminal with flag submission</td>
  </tr>
  <tr>
    <td><img src="assets/image2.png" alt="Training Course Lesson" width="100%"><br><strong>Training Courses</strong> - Structured lessons with interactive content and quizzes</td>
    <td><img src="assets/image3.png" alt="Windows Command Simulation" width="100%"><br><strong>Simulations</strong> - Windows command lab with real output emulation</td>
  </tr>
</table>

## Features

### Challenge System

- Built-in categories: Web Exploitation, Cryptography, Forensics, Network Security (with support for Reverse Engineering, Binary Exploitation, OSINT, and more)
- 4 difficulty levels (Beginner to Expert) with scaling point values
- Multiple validation strategies: flag matching, SQL result checks, file content verification, command output validation
- Progressive hint system with point-cost tradeoffs
- Real-time terminal access via WebSocket and XTerm.js

### Training Courses

- Modular structure: Courses > Modules > Lessons > Quizzes/Labs
- XP-based progression with course completion certificates
- Interactive lab types: Linux terminal, Windows command simulation, brute force password analysis
- Multi-objective labs (command execution, file discovery, log analysis, permission checks)

### Sandbox Infrastructure

- Docker-based isolated environments per user session
- Pre-built images: terminal base (Alpine), SQL injection lab (SQLite), Linux forensics lab
- Configurable resource limits (memory, CPU, process count)
- Automatic cleanup of expired sessions
- Sandbox reset without restarting the container

### Security

- JWT authentication with access/refresh token rotation
- CSRF protection (double-submit cookie pattern)
- Rate limiting (global, per-route, and sandbox-specific)
- Account lockout after failed login attempts
- Helmet.js security headers with CSP
- Prisma ORM (parameterized queries throughout)

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite 6, Tailwind CSS 4, Framer Motion, XTerm.js |
| Backend | Node.js 20+, Express 4, TypeScript, Zod, Pino |
| Database | PostgreSQL 16, Prisma 6 ORM |
| Containers | Docker, Docker Compose, Dockerode |
| Auth | JWT, bcrypt, CSRF tokens |
| Real-time | WebSocket (ws) for terminal I/O |

## Project Structure

```
shaked-hack-lab/
├── apps/
│   ├── backend/          # Express API server
│   │   ├── src/
│   │   │   ├── controllers/   # Request handlers
│   │   │   ├── middleware/    # Auth, CSRF, rate limiting, validation
│   │   │   ├── routes/        # API route definitions
│   │   │   ├── services/      # Business logic
│   │   │   ├── websocket/     # Terminal WebSocket gateway
│   │   │   └── server.ts      # Entry point
│   │   └── package.json
│   └── frontend/         # React SPA
│       ├── src/
│       │   ├── components/    # UI components
│       │   ├── pages/         # Route pages
│       │   ├── context/       # Auth, Sandbox, Progress providers
│       │   ├── hooks/         # Custom React hooks
│       │   └── services/      # API client layer
│       └── package.json
├── packages/
│   └── shared-types/     # Shared TypeScript type definitions
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Challenge and course seed data
├── docker/
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   ├── nginx.conf
│   └── sandbox/          # Sandbox container images
│       ├── terminal-base.Dockerfile
│       ├── sql-injection.Dockerfile
│       └── linux-lab.Dockerfile
├── docker-compose.yml
└── package.json          # Workspace root
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.0.0 or higher
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Git](https://git-scm.com/)

### Quick Start (Docker Compose)

The fastest way to run the full platform:

```bash
# Clone the repository
git clone https://github.com/ddex3/shaked-hack-lab.git
cd shaked-hack-lab

# Copy and configure environment variables
cp .env.example .env
# Edit .env and set strong secrets (see Environment Variables below)

# Build and start all services
docker-compose up --build
```

Once running:

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:4000 |
| PostgreSQL | localhost:5432 |

### Local Development

For development with hot reload:

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with challenges and courses
npm run db:seed

# Start backend (Terminal 1)
npm run dev:backend

# Start frontend (Terminal 2)
npm run dev:frontend
```

The frontend dev server runs on `http://localhost:5173` and proxies API requests to the backend on port 4000.

### Environment Variables

Copy [`.env.example`](.env.example) and fill in the values:

```env
# Database
DATABASE_URL=postgresql://shaked_user:YOUR_PASSWORD@localhost:5432/shaked_hack_lab?schema=public
POSTGRES_USER=shaked_user
POSTGRES_PASSWORD=YOUR_PASSWORD
POSTGRES_DB=shaked_hack_lab

# Secrets (generate with: openssl rand -hex 32)
ACCESS_TOKEN_SECRET=<64-char-hex>
REFRESH_TOKEN_SECRET=<64-char-hex>
CSRF_SECRET=<32-char-hex>

# Server
NODE_ENV=development
BACKEND_PORT=4000
FRONTEND_URL=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:4000/api
VITE_WS_URL=ws://localhost:4000

# Sandbox limits
SANDBOX_MAX_CONTAINERS=20
SANDBOX_DEFAULT_TIMEOUT=300
SANDBOX_CLEANUP_INTERVAL=60000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:frontend` | Start frontend dev server (Vite) |
| `npm run dev:backend` | Start backend dev server (tsx watch) |
| `npm run build:frontend` | Build frontend for production |
| `npm run build:backend` | Compile backend TypeScript |
| `npm run build:shared` | Build shared type definitions |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema changes to database |
| `npm run db:seed` | Seed database with challenges and courses |

## Help and Support

- **Issues** - Report bugs or request features via [GitHub Issues](https://github.com/ddex3/shaked-hack-lab/issues)
- **Discussions** - Ask questions or share ideas in [GitHub Discussions](https://github.com/ddex3/shaked-hack-lab/discussions)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by **[@ddex3](https://github.com/ddex3)**
