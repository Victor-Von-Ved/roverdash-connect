# RoverDash Connect

Real-time rover operations dashboard for telemetry, command/control, operator alerts, and competition-ready safety supervision.

## Overview

RoverDash Connect is a browser-based mission control interface for rover competition and field-test operations. It provides live telemetry visibility, operator control inputs, connection-state awareness, and backend-integrated emergency/watchdog handling in a single dashboard.

The current system is designed around a simple and robust control model:
- controls are enabled only when the rover is connected and telemetry is fresh,
- command failures are shown to the operator but do not cause false lockouts,
- emergency-stop and watchdog-loss states are treated as explicit safety states.

## Current status

The dashboard now includes:
- live telemetry hooks and UI integration,
- WebSocket-based backend transport for telemetry and commands,
- operator alerts for healthy, stale, disconnected, command-failure, emergency, and watchdog-loss states,
- backend-integrated emergency-stop state handling,
- competition readiness and operator checklist documentation.

## Tech stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

### Services and transport
- Supabase for authentication and supporting app services
- WebSocket gateway for real-time telemetry and command transport

## Architecture

At a high level, the app is structured as:
- **UI components** for dashboard state, joystick control, alerts, and emergency-stop display
- **React hooks** for telemetry, commands, and connection-health logic
- **transport clients** for backend communication
- **typed rover safety/state models** for operator-facing control logic

The dashboard keeps connection health intentionally simple and avoids command-status-based false lockouts.

## Local setup

### Prerequisites
- Node.js 18+
- npm
- Supabase project credentials

### Install

```bash
git clone https://github.com/Victor-Von-Ved/roverdash-connect.git
cd roverdash-connect
npm install
```

### Configure environment variables

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Fill in:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_GATEWAY_WS_URL=
```

### Start development server

```bash
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

## Available commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |
| `npm run lint` | Run lint checks |

## Safety model

Software currently provides:
- telemetry freshness monitoring,
- connection-state monitoring,
- operator alerts,
- backend-integrated emergency-stop state handling,
- watchdog-aware control disable behavior.

Important:
- This software is an operator-facing supervision layer.
- It does **not** replace independent rover hardware safety such as a physical E-stop circuit, hardware watchdog path, or motor power isolation.

## Documentation

Additional documentation is available in:
- `COMPETITION_READINESS_CHECKLIST.md`
- `docs/roverdash-competition-prd.md`
- `implementation_plan.md`

## Project structure

```text
src/
├── components/
│   └── dashboard/
├── hooks/
├── lib/
├── pages/
├── integrations/
└── types/
```

## Competition use

Before competition or field deployment:
- verify telemetry freshness,
- verify command path connectivity,
- verify stale/disconnect recovery behaviour,
- verify independent hardware safety systems separately from the UI.

## Author

Vedant Bhanshali  
BEng Computer Science (Artificial Intelligence), University of Leeds
