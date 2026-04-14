# RoverDash Connect

<<<<<<< HEAD
A real-time telemetry dashboard for rover operations, providing live monitoring and control capabilities for autonomous and remotely operated vehicles.

## Overview

RoverDash Connect is a web-based control interface designed for rover competitions and robotics projects. It displays live sensor data, tracks vehicle position, monitors system health, and provides control inputs through an intuitive dashboard interface.

The system handles real-time data streaming with minimal latency, making it suitable for field operations where instant feedback is critical.

## Key Features

- **Real-time Telemetry**: Live sensor data updates via WebSocket connections
- **Data Visualization**: Interactive charts for battery voltage, motor speed, temperature, and GPS tracking
- **System Monitoring**: Health checks for power systems, motors, and communication links
- **User Authentication**: Secure login system with role-based permissions
- **Responsive Design**: Works across desktop, tablet, and mobile devices
- **Offline Support**: Continues displaying cached data during connectivity issues
- **Dark Mode**: Reduced eye strain for outdoor field operations

## Technology Stack

### Frontend
- **React 18** - Component-based UI framework
- **TypeScript** - Static typing for code reliability
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first styling system
- **shadcn/ui** - Accessible component library

### Backend & Data
- **Supabase** - PostgreSQL database with real-time subscriptions
- **TanStack Query** - Data fetching and caching
- **Recharts** - Charting library for telemetry visualization

### Development Tools
- **ESLint** - Code quality checking
- **TypeScript Compiler** - Type checking
- **Git** - Version control

## Getting Started

### Prerequisites

You'll need:
- Node.js 18 or higher
- npm package manager
- A Supabase account (free tier works fine)

### Installation Steps

1. Clone this repository:
```bash
git clone https://github.com/Victor-Von-Ved/roverdash-connect.git
cd roverdash-connect
```

Install dependencies:
```bash
npm install
```
Set up environment variables:

Create a .env file in the project root:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
Get these credentials from your Supabase project settings at supabase.com.

Start the development server:

```bash
npm run dev
```
Open your browser to http://localhost:8080

Available Commands
Command               	Purpose
npm run dev	            Start local development server with hot reload
npm run build	          Create optimized production build
npm run preview	        Test the production build locally
npm run lint	          Check code for potential issues

Project Structure
```text
roverdash-connect/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base components (buttons, cards, inputs)
│   │   └── dashboard/       # Dashboard-specific components
│   ├── pages/               # Main application pages
│   │   ├── Index.tsx        # Landing page
│   │   ├── Auth.tsx         # Login/authentication
│   │   ├── Dashboard.tsx    # Main telemetry dashboard
│   │   └── NotFound.tsx     # 404 error page
│   ├── integrations/        # External service connections
│   │   └── supabase/        # Database client and types
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── App.tsx             # Root component with routing
│   └── main.tsx            # Application entry point
├── public/                  # Static assets
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Build tool configuration
```
Usage
Setting Up the Database
In your Supabase project, create a table for telemetry data:
```bash
sql
create table telemetry (
  id uuid primary key default uuid_generate_v4(),
  timestamp timestamptz default now(),
  sensor_type text not null,
  value numeric not null,
  unit text,
  rover_id uuid
);

-- Enable real-time updates
alter publication supabase_realtime add table telemetry;
```
Connecting Your Rover
Send telemetry data to Supabase using the REST API or client libraries. The dashboard will automatically display new data as it arrives.

Customizing the Dashboard
Components in src/components/dashboard/ can be modified to display different sensor types or adjust visualization styles.

Deployment
This application can be deployed to various hosting platforms:

Vercel (Recommended)
```bash
npm install -g vercel
vercel
```
Netlify
Build the project: npm run build

Deploy the dist folder via Netlify dashboard or CLI

Traditional Hosting
Build the project and serve the dist folder with any static file server.

## Configuration
Environment Variables
The application requires these environment variables:

VITE_SUPABASE_URL - Your Supabase project URL

VITE_SUPABASE_ANON_KEY - Your Supabase anonymous/public key

These are safe to expose in the frontend as they only allow row-level security rules you define.

## Customization
Key files to modify for customization:

tailwind.config.ts - Color themes and styling
src/components/dashboard/ - Dashboard layout and widgets
src/integrations/supabase/types.ts - Data type definitions

## Performance
The dashboard is optimized for:

Fast initial load (< 2 seconds on 3G)
Smooth 60fps animations
Low bandwidth usage (< 100KB/min for telemetry)
Minimal battery drain on mobile devices

## Browser Support
Tested and working on:

Chrome/Edge 90+
Firefox 88+
Safari 14+
Mobile Safari (iOS 14+)
Chrome Android

## Troubleshooting
Connection Issues
Verify Supabase credentials in .env

Check that real-time is enabled on your table

Ensure your database has the correct schema

## Build Errors
Delete node_modules and run npm install again

Check Node.js version (should be 18+)

Clear build cache: rm -rf dist .vite

## Contributing
Contributions are welcome. To contribute:

Fork the repository
Create a feature branch
Make your changes
Test thoroughly
Submit a pull request

License
MIT License - See LICENSE file for details

Author
Vedant Bhanshali
BEng Computer Science (Artificial Intelligence)
University of Leeds

## Acknowledgments
Built for the UKRA Rover Competition with focus on reliability and real-time performance for field operations.
=======
Browser-based mission control system for rover competition operations.

This application provides real-time telemetry monitoring, camera feeds, and command/control capabilities for rover operations. Built for UKSEDS competitions.

---

## Technology Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Supabase Authentication
- WebSocket real-time telemetry

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- npm or bun
- Supabase project account

### Step 1: Clone and install dependencies
```bash
git clone https://github.com/Victor-Von-Ved/roverdash-connect.git
cd roverdash-connect
npm install
```

### Step 2: Configure environment variables
```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and fill in your Supabase credentials:
```env
# Required: Supabase configuration from your project settings
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=

# Optional: Mission gateway WebSocket URL (when backend is available)
VITE_GATEWAY_WS_URL=
```

### Step 3: Start development server
```bash
npm run dev
```

Application will be available at `http://localhost:5173`

---

## Supabase Usage

Supabase is used in this repository for:
✅ User authentication and session management
✅ Role based access control
✅ Persistent storage for mission logs and events
✅ Row level security for operational data

All authentication operations are handled through the Supabase client located at `src/integrations/supabase/client.ts`.

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ | Full project URL from Supabase project settings |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | ✅ | Public anon key from Supabase project settings |
| `VITE_GATEWAY_WS_URL` | ❌ | WebSocket endpoint for mission gateway backend |

---

## Build for Production
```bash
npm run build
```

Production output will be generated in the `dist/` directory.

---

## Local Setup Checklist
- [ ] Repository cloned successfully
- [ ] Dependencies installed with `npm install`
- [ ] `.env` file created from `.env.example`
- [ ] Supabase URL and API key are correctly configured
- [ ] Development server starts without errors
- [ ] Authentication pages load correctly
- [ ] Dashboard telemetry updates successfully
>>>>>>> eb9191c (fix: align Supabase project URL and auth config)
