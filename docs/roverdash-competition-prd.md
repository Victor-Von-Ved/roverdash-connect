# RoverDash Connect Competition PRD

## Document purpose
This product requirements document defines the work needed to turn RoverDash Connect from a front-end rover dashboard prototype into a reliable, competition-ready rover operations system for UKSEDS use.[1]

The current repository already provides a modern React/TypeScript dashboard foundation with routing, authentication, dashboard widgets, and a Supabase integration, but the present implementation still behaves primarily like a prototype because telemetry is simulated locally and drive commands are not yet connected to a live rover backend.[1]

## Product overview
RoverDash Connect is intended to be a browser-based mission control application for rover competition operations, enabling operators to monitor rover state, view camera feeds, and issue commands from a field laptop or control station.[1]

The existing app uses Vite, React, TypeScript, Tailwind, shadcn/ui, TanStack Query, Recharts, and Supabase, which makes it a strong UI base for an operational control surface as long as the real-time systems, safety logic, and backend integration are added and hardened.[1]

## Problem statement
The repository currently demonstrates the user interface shape of a rover control system, but it is not yet suitable for live competition operation because critical rover state is mocked with timed random updates and operator movement actions only produce UI toasts rather than confirmed hardware commands.[1]

This creates a gap between demo readiness and mission readiness: the team can show the intended experience, but cannot yet trust the application as the primary operational console for driving, monitoring, fault response, and safe field execution.[1]

## Goals
### Primary goals
- Provide a reliable browser-based operator console for rover competition use.[1]
- Show live telemetry from the rover or rover gateway with timestamps, freshness indicators, and alerting.[1]
- Send operator commands through a real command channel with acknowledgement, timeout handling, and safe failure behavior.[1]
- Surface critical mission information first: connection health, heartbeat, battery, mode, camera status, and emergency stop state.[1]
- Support repeatable pre-run checks, live operation, and post-run diagnostics from the same product surface.[1]

### Success goals
- Replace all simulated telemetry in the dashboard with real field data.[1]
- Replace UI-only movement actions with verified command transport to the rover stack.[1]
- Enable sustained operations across a full competition session without browser crashes, silent stale data, or ambiguous rover state.[1]
- Give operators immediate awareness of degraded comms, stale telemetry, command failures, and subsystem faults.[1]

## Non-goals
The first operational release should not aim to solve every future rover workflow at once.[1]

The following are out of scope for the first competition-ready milestone unless already needed by the team architecture:
- Fully autonomous mission planning beyond basic mode switching.[1]
- Extensive spectator-facing UI or public dashboard views.[1]
- Broad cloud-native fleet management across multiple rovers.[1]
- Nice-to-have visual polish work that does not improve reliability, safety, or usability under field conditions.[1]

## Users
### Primary users
| User | Role | Main needs |
|---|---|---|
| Driver/operator | Controls rover motion and immediate actions | Low-latency control, clear command status, camera visibility, safety controls.[1] |
| Systems/science operator | Monitors telemetry and subsystem state | Readable status panels, alerts, location/state awareness, camera and sensor visibility.[1] |
| Team lead/safety operator | Oversees mission health and intervention | Global health view, warnings, logs, emergency controls, session traceability.[1] |

### Secondary users
- Developers preparing the stack before competition need clear schemas, logs, and test harnesses to validate the system.[1]
- Team members troubleshooting failures need audit trails of telemetry, commands, timestamps, and state transitions.[1]

## Current state assessment
### What exists in the repo
The repo contains a structured front-end app with auth pages, route handling, a dashboard screen, and UI components including stats cards, camera feed panels, virtual joystick controls, location display, and connection status elements.[1]

The app is integrated with Supabase for authentication and includes the expected scaffolding for a modern operational dashboard, including notifications and dashboard state management.[1]

### Current blockers
The current `Dashboard` implementation updates telemetry with a local interval that randomizes rover values, which means displayed status is not coming from a rover, base station, or backend service.[1]

The movement handler currently logs actions and shows a toast, with the actual backend command path left as a placeholder, so there is no verified control loop from browser input to rover execution.[1]

The Supabase types shown are largely empty, the landing page is still a placeholder, and the README environment variable naming does not fully match the client code, all of which indicate the project still needs systems-level consolidation before field use.[1]

## Product scope
### In scope for competition-ready v1
- Live telemetry ingestion from rover or rover gateway.[1]
- Real command transport with acknowledgement and operator-visible status.[1]
- Dashboard rework around operational priority and safety-critical visibility.[1]
- Camera feed integration with status/error handling.[1]
- Alerting for heartbeat loss, stale data, battery issues, thermal issues, and command failures.[1]
- Authentication and basic role controls for operational access.[1]
- Event logging, telemetry logging, and post-run review support.[1]
- Pre-flight and smoke-test workflow before field deployment.[1]

### Out of scope for v1 unless essential
- Full autonomous task planner.[1]
- Complex multi-rover orchestration.[1]
- Heavy analytics dashboards beyond operational and diagnostic needs.[1]
- Public-facing dashboards for outreach or judging display.[1]

## Functional requirements
### Telemetry
The product must ingest real rover telemetry rather than simulated values and display the latest known state with timestamp metadata and freshness status.[1]

Required telemetry domains for v1:
- Power: battery percentage, voltage, current, power warnings.[1]
- Mobility: current speed, drive state, direction, motor controller health where available.[1]
- Pose: GPS coordinates, heading, and location confidence where available.[1]
- Environment and compute: temperatures, signal quality, and onboard system health if available.[1]
- Safety state: heartbeat age, E-stop state, manual/autonomous mode, subsystem availability.[1]
- Video state: feed status, selected camera, feed latency or degraded status if measurable.[1]

Telemetry requirements:
- Each telemetry message must include a timestamp from source or gateway.[1]
- The UI must mark data as stale if freshness exceeds a defined threshold.[1]
- Critical data loss must trigger visible alerts, not silent panel freezes.[1]
- The system must preserve the last known value while clearly labeling it as stale when the feed drops.[1]

### Command and control
The product must allow an authorized operator to send rover commands through a real command channel rather than local UI-only handlers.[1]

Required v1 command set:
- Drive forward, backward, left, right, stop.[1]
- Variable speed scaling or throttle control.[1]
- Emergency stop or safe stop action.[1]
- Mode changes if the rover supports manual/autonomous switching.[1]
- Camera/feed selection if multiple feeds exist.[1]

Command requirements:
- Every command must show pending, acknowledged, failed, or timed-out state.[1]
- The UI must display the last command and its outcome.[1]
- Movement controls must disable automatically on disconnect or stale heartbeat unless the architecture explicitly supports safe buffered control.[1]
- Command transmission must use rate limiting and deadzone logic for joystick-like control.[1]

### Camera and media
The product must show at least one live camera feed suitable for rover driving, with visible error state if the stream drops or lags beyond usefulness.[1]

Camera requirements:
- Main driving camera visible in the primary operations layout.[1]
- Status label for active stream and connection state.[1]
- Graceful fallback UI on stream failure.[1]
- Support for multiple feeds if rover hardware provides them, even if only one is primary in v1.[1]

### Alerts and operator awareness
The product must provide persistent, obvious alerts for operationally important faults rather than only transient toasts.[1]

Minimum alert conditions:
- Heartbeat timeout.[1]
- Telemetry stale beyond threshold.[1]
- Battery under warning threshold.[1]
- Temperature over threshold.[1]
- Command timeout or command rejection.[1]
- Camera feed disconnected.[1]
- Backend/gateway disconnected.[1]

### Auth and access control
The existing auth implementation shows that the app already supports authenticated entry via Supabase, and this should be retained for operational access control.[1]

Operational auth requirements:
- Only authorized team users may access control screens.[1]
- Operator roles should distinguish between view-only and control-capable users if feasible for v1.[1]
- Sensitive actions such as E-stop reset or mode switching should require stronger confirmation than simple navigation clicks.[1]

### Logging and traceability
The product must persist command events, connection changes, important alerts, and mission session metadata for later debugging and improvement.[1]

Logging requirements:
- Log operator commands with timestamp, user, outcome, and target subsystem.[1]
- Log key state transitions such as disconnects, reconnects, and safety events.[1]
- Support export or review of mission logs after a test or run.[1]

## Non-functional requirements
### Reliability
The product must remain stable for a full competition session and recover gracefully from disconnects or refreshes without ambiguous rover state.[1]

### Latency
The target should be low enough for real driving use, with telemetry and command acknowledgement fast enough to support live operation on the team network architecture.[1]

### Safety
The product must fail safe, disable dangerous control paths under uncertain state, and expose clear status for heartbeat, connectivity, and command acknowledgement.[1]

### Usability
The dashboard must be readable outdoors or in mixed field conditions, prioritize critical information, and support fast scanning under pressure.[1]

### Maintainability
The codebase must move from prototype patterns toward explicit typed schemas, separated data and control layers, reusable hooks/services, and documented configuration.[1]

## Proposed architecture
### High-level architecture
A three-layer design is recommended for operational readiness because the current repository is strongest as a front-end UI and should not be the only real-time integration point.[1]

| Layer | Responsibility | Recommendation |
|---|---|---|
| Browser dashboard | Operator interface | Keep React/TypeScript/Tailwind UI foundation and refactor around real operational state.[1] |
| Mission gateway/backend | Real-time telemetry and command broker | Add a dedicated service that interfaces with rover systems and exposes WebSocket/API channels to the dashboard.[1] |
| Persistence layer | Auth, logs, session history, diagnostics | Use Supabase for auth, logs, operator events, and historical telemetry where appropriate.[1] |

### Front-end responsibilities
The front-end should focus on rendering state, validating operator intent, showing command outcomes, and providing human-safe workflows rather than directly owning rover logic.[1]

Recommended front-end modules:
- `useTelemetry()` hook for live state ingestion.[1]
- `useCommandChannel()` hook for control transmission and acknowledgements.[1]
- `useAlerts()` for fault generation and operator presentation.[1]
- `useMissionSession()` for logs, session start/end, and operator metadata.[1]
- Distinct components for top bar health, control pad, map/location, camera stack, alerts, and event log.[1]

### Backend/gateway responsibilities
The gateway should bridge the rover-side software stack and the browser, normalize telemetry, enforce safety checks, timestamp messages, and manage command acknowledgement paths.[1]

Recommended gateway capabilities:
- WebSocket stream for real-time telemetry.[1]
- Command endpoint or duplex channel with ack/nack response.[1]
- Heartbeat/watchdog service.[1]
- Message validation and schema normalization.[1]
- Optional buffering and replay for debugging.[1]

### Data model requirements
The current generated Supabase types indicate that the repository does not yet have a mature public schema modeled in code, so schema design should be treated as a first-class deliverable.[1]

Recommended core tables or equivalents:
- `users` or profile metadata linked to auth.[1]
- `mission_sessions`.[1]
- `telemetry_events` or summarized telemetry storage if volume is manageable.[1]
- `command_events`.[1]
- `alerts`.[1]
- `system_health_events`.[1]

## UX requirements
### Layout priorities
The current dashboard concept should be revised so the first row contains only competition-critical status, not secondary metrics.[1]

Recommended layout:
- Top bar: connection, heartbeat age, battery, mode, E-stop, operator identity.[1]
- Main panel: primary drive camera.[1]
- Control column: joystick, direction pad, throttle, stop, mode controls.[1]
- Secondary panels: map/GPS, telemetry cards, alerts, event log.[1]

### Interaction principles
- Every critical control must produce immediate visible state feedback.[1]
- Dangerous actions must require confirmation or protected interaction.[1]
- Toasts may supplement but must not replace persistent operational warnings.[1]
- The UI must distinguish clearly between “connected,” “receiving stale data,” and “fully disconnected.”[1]

## Backlog
### P0: operational blockers
- Remove simulated telemetry from the dashboard and replace with live telemetry source.[1]
- Replace placeholder movement handler with real command transport and acknowledgement.[1]
- Add heartbeat and stale-data detection.[1]
- Add emergency stop / safe stop workflow.[1]
- Integrate camera feed status and degraded-state handling.[1]
- Fix environment variable mismatch between README and client implementation.[1]
- Define typed schemas for telemetry, commands, alerts, and sessions.[1]
- Add persistent critical alerts for battery, comms, thermal, and command failures.[1]

### P1: strongly recommended before competition
- Add command and telemetry event logging.[1]
- Add reconnect strategy and operator-visible reconnect state.[1]
- Add pre-flight checklist and connection smoke test screen.[1]
- Add role separation for view-only versus control users if team workflow requires it.[1]
- Improve dashboard information hierarchy for field use.[1]
- Replace placeholder landing/index route with proper app entry flow.[1]

### P2: post-core enhancements
- Multi-camera switching and layout presets.[1]
- Telemetry history charts and replay.[1]
- Science subsystem views.[1]
- Autonomy control enhancements.[1]
- Judge/demo presentation mode separate from operator mode.[1]

## Milestones
### Milestone 1: codebase stabilization
Deliver a coherent repo with fixed configuration, cleaned routes, typed message contracts, and a clear architectural direction.[1]

### Milestone 2: live data and control
Deliver real telemetry ingestion, real command path, heartbeat handling, and critical operator status panels.[1]

### Milestone 3: safety and field readiness
Deliver alerts, E-stop workflow, reconnect behavior, camera failure handling, and pre-flight validation tools.[1]

### Milestone 4: competition hardening
Deliver test evidence from sustained sessions, fault injection, outdoor usability validation, and mission log review.[1]

## Acceptance criteria
### System acceptance
- The dashboard shows real rover telemetry instead of simulated values in all production views.[1]
- Operator movement and stop commands reach the rover system through a real transport path and receive visible acknowledgement or failure feedback.[1]
- Heartbeat loss triggers an obvious critical alert and disables unsafe movement controls according to defined safety rules.[1]
- Camera feed failure presents a clear degraded state without crashing the rest of the dashboard.[1]
- Authorized users can sign in and access only the functions appropriate to their role.[1]
- Mission events and operator commands are logged for post-run review.[1]

### Quality acceptance
- No environment/setup ambiguity remains between documentation and code configuration.[1]
- No silent stale-data state exists; all stale telemetry is visibly marked.[1]
- No placeholder routes remain in the main operational flow.[1]
- No critical control depends on transient UI feedback alone.[1]

## Testing checklist
### Configuration and setup
- [ ] Fresh clone succeeds with documented setup steps.[1]
- [ ] Environment variable names in docs match application code exactly.[1]
- [ ] Authentication works for valid users and blocks invalid access.[1]

### Telemetry
- [ ] Live telemetry appears without simulated fallback in production mode.[1]
- [ ] Timestamp and freshness indicators update correctly.[1]
- [ ] Stale telemetry is visibly marked after threshold breach.[1]
- [ ] Telemetry recovery clears stale state after reconnect.[1]

### Command path
- [ ] Directional controls send real commands.[1]
- [ ] Stop command works reliably under normal conditions.[1]
- [ ] Command ack success is shown to the operator.[1]
- [ ] Command timeout or failure is shown persistently, not only as a transient toast.[1]
- [ ] Controls disable correctly on disconnect or stale heartbeat.[1]

### Safety
- [ ] Heartbeat loss triggers visible critical alert.[1]
- [ ] E-stop or safe stop action is always accessible.[1]
- [ ] Unsafe commands cannot be issued when rover state is unknown.[1]
- [ ] Alert thresholds for power, comms, and thermal states work as intended.[1]

### Camera and media
- [ ] Primary camera feed loads in operational layout.[1]
- [ ] Stream disconnect shows graceful fallback state.[1]
- [ ] Camera failure does not block telemetry or control panels.[1]

### UX and operations
- [ ] Critical status is visible without scrolling on the main operator screen.[1]
- [ ] UI remains readable in likely field conditions on target laptop/tablet hardware.[1]
- [ ] Operator can understand system state within a few seconds of opening the dashboard.[1]

### Logging and diagnostics
- [ ] Commands are logged with user, timestamp, and outcome.[1]
- [ ] Connection drops and recovery events are logged.[1]
- [ ] Mission session data can be reviewed after a test run.[1]

### Reliability and hardening
- [ ] Dashboard survives long-duration session testing without memory leaks or crashes.[1]
- [ ] Browser refresh or reconnect behavior is defined and tested.[1]
- [ ] Partial backend outages show degraded-state UI rather than total app failure.[1]

## Repo-directed implementation notes
The first implementation pass should focus on the repository areas already implied by the current structure: the `Dashboard` page, the control components, the connection/telemetry widgets, the auth gate, and the Supabase integration layer.[1]

Suggested implementation order:
1. Define telemetry and command schemas.[1]
2. Introduce backend/gateway contracts.[1]
3. Replace mock dashboard state with `useTelemetry()`.[1]
4. Replace `handleMovement` placeholder flow with `useCommandChannel()`.[1]
5. Add alert/watchdog logic and persistent critical banners.[1]
6. Add mission session and event logging.[1]
7. Run field simulation tests and refine the UI hierarchy.[1]

## Prompt handoff for coding agents
Use this document as the source PRD for implementation planning.[1]

When giving tasks to coding agents such as Cline, request work in small vertical slices with explicit outputs:
- schema definition first,
- backend contract second,
- front-end hook integration third,
- safety and alert logic fourth,
- logging and test harness fifth.[1]

Each task should require the agent to list changed files, explain assumptions, update docs, and include a manual verification checklist before moving to the next slice.[1]