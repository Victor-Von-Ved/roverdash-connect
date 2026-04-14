# Implementation Plan: RoverDash Competition Readiness

## Overview
This plan defines the complete implementation required to convert the RoverDash Connect prototype into a competition-ready rover operations system, following the requirements specified in the PRD.

The current repository provides a solid React/TypeScript UI foundation but contains only simulated telemetry and placeholder command handlers. This implementation will add real-time systems, safety logic, backend integration, and operational hardening required for reliable field use.

---

## Current State Summary

✅ **Working Components**:
- React + TypeScript + Vite + Tailwind UI foundation
- Supabase authentication integration
- Dashboard layout structure
- Virtual joystick UI component
- Stats cards, camera feed placeholder, location display
- Routing with authenticated pages

⚠️ **Mocked / Placeholder Components**:
- Dashboard telemetry is locally simulated with random values (2s interval)
- Movement commands only produce console logs and toasts - no backend transport
- Connection status is static placeholder
- Camera feed is static placeholder image
- No heartbeat / stale data detection
- No command acknowledgement / failure handling
- No persistent alerting system
- No event logging or audit trails

---

## Architecture Recommendation

### 3-Layer Architecture:
| Layer | Responsibility | Implementation |
|---|---|---|
| **Frontend Dashboard** | Operator interface, state rendering, command validation, safety UI | Existing React application with refactored state management |
| **Mission Gateway** | Real-time telemetry broker, command validation, heartbeat, safety logic | Separate backend service (not implemented in this repo) |
| **Persistence Layer** | Auth, logs, session history, diagnostics | Supabase PostgreSQL with Row Level Security |

### Frontend vs Backend vs Supabase Responsibilities:
| Component | Frontend | Backend Gateway | Supabase |
|---|---|---|---|
| Telemetry ingestion | ✅ Rendering, freshness detection, stale marking | ✅ Normalization, timestamping, routing | ✅ Historical storage |
| Command handling | ✅ Operator input validation, rate limiting, status display | ✅ Transport, acknowledgement, safety enforcement | ✅ Audit logging |
| Authentication | ✅ Session management, UI gating | ❌ | ✅ User management, OAuth, RLS |
| Alerting | ✅ Visual presentation, operator notification | ✅ Threshold detection, fault classification | ✅ Persistence |
| Heartbeat | ✅ Stale state UI, control disabling | ✅ Watchdog monitoring | ❌ |

---

## Phased Backlog

### P0: Operational Blockers (Must Have)
- [ ] Define typed schemas for Telemetry, Command, Alert, and Session objects
- [ ] Replace simulated telemetry interval with real WebSocket connection
- [ ] Implement `useTelemetry()` hook with freshness detection and stale state marking
- [ ] Implement `useCommandChannel()` hook with pending/ack/failed/timeout states
- [ ] Replace placeholder `handleMovement()` function with real command transport
- [ ] Add heartbeat monitoring system with configurable threshold
- [ ] Implement emergency stop workflow with global access
- [ ] Add critical alert banner system for heartbeat loss, battery, comms faults
- [ ] Fix environment variable mismatch between README and application code
- [ ] Disable movement controls automatically on disconnect / stale state

### P1: Strongly Recommended Before Competition
- [ ] Implement command and telemetry event logging to Supabase
- [ ] Add automatic reconnection logic with operator visible status
- [ ] Create pre-flight checklist and connection smoke test screen
- [ ] Implement role-based access control (view-only / operator)
- [ ] Rework dashboard layout with operational priority hierarchy
- [ ] Replace placeholder landing page with proper mission entry flow
- [ ] Add camera feed status monitoring and degraded state handling

### P2: Post-Core Enhancements
- [ ] Multi-camera switching support
- [ ] Telemetry history charts and replay functionality
- [ ] Science subsystem views
- [ ] Autonomy mode controls
- [ ] Judge / demo presentation mode
- [ ] Mission log export functionality

---

## Files To Change

### New Files To Create:
```
src/
├── types/
│   └── rover.ts              # Core type definitions
├── hooks/
│   ├── useTelemetry.ts       # Telemetry ingestion hook
│   ├── useCommandChannel.ts  # Command transport hook
│   ├── useAlerts.ts          # Alert management hook
│   └── useMissionSession.ts  # Session management
├── lib/
│   └── constants.ts          # Configuration thresholds
└── components/
    └── dashboard/
        ├── AlertBanner.tsx   # Persistent alert display
        ├── HealthBar.tsx     # Top bar status indicators
        └── EmergencyStop.tsx # E-Stop control
```

### Existing Files To Modify:
```
src/
├── pages/Dashboard.tsx               # Remove simulation, integrate hooks
├── components/dashboard/VirtualJoystick.tsx # Add disable state
├── components/dashboard/StatsGrid.tsx # Add freshness indicators
├── components/dashboard/CameraFeed.tsx # Add error state handling
├── components/dashboard/ConnectionStatus.tsx # Real connection state
├── integrations/supabase/client.ts   # Add database types
└── App.tsx                           # Add alert context provider
```

### Configuration Files:
- `.env.example` - Fix environment variable names
- `README.md` - Update setup and configuration documentation
- `supabase/config.toml` - Add database schema definitions

---

## Risks and Assumptions

### Assumptions:
1. A backend gateway service will be available providing WebSocket telemetry and command endpoints
2. Rover hardware provides the telemetry fields specified in the PRD
3. Supabase will be used for authentication and persistent logging
4. Network latency will be < 200ms for operational use
5. Operator devices are 1080p laptop screens

### Risks:
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Network disconnections during operation | High | Critical | Implement graceful stale state, automatic reconnection, control disabling |
| Stale telemetry appearing valid | Medium | High | Explicit freshness indicators, timestamp display |
| Command loss without acknowledgement | Medium | High | Command timeout detection, visible failure state |
| Browser memory leaks over long sessions | Low | Medium | Proper cleanup of intervals/event listeners, session testing |
| UI unreadable in outdoor conditions | Medium | Medium | High contrast theme, configurable brightness, large text |

---

## Manual Verification Checklist

### ✅ Configuration
- [ ] Fresh repository clone builds successfully
- [ ] Environment variables in documentation match code exactly
- [ ] Authentication works for valid users
- [ ] Unauthenticated users are redirected correctly

### ✅ Telemetry
- [ ] No simulated values are present in production mode
- [ ] Telemetry updates in real time
- [ ] Timestamp and freshness indicators are visible
- [ ] Stale telemetry is clearly marked after threshold
- [ ] Reconnecting clears stale state correctly

### ✅ Command Path
- [ ] Movement controls send actual backend commands
- [ ] Stop command works reliably under all conditions
- [ ] Command states (pending/ack/failed) are visible to operator
- [ ] Command failures show persistent error state
- [ ] Controls automatically disable on disconnect

### ✅ Safety
- [ ] Heartbeat loss triggers full screen critical alert
- [ ] Emergency stop button is always accessible
- [ ] No commands can be sent when rover state is unknown
- [ ] Battery low / over temperature alerts work correctly

### ✅ Reliability
- [ ] Dashboard runs for 2+ hours without crashes or memory leaks
- [ ] Browser refresh maintains correct state
- [ ] Partial backend failures show degraded UI not total failure
- [ ] Camera feed failure does not break telemetry or controls

### ✅ Operations
- [ ] All critical status is visible without scrolling
- [ ] Operator can determine system health within 3 seconds
- [ ] All commands are logged with user, timestamp and outcome
- [ ] Mission session data is available for post run review