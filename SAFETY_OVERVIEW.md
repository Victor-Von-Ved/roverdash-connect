# RoverDash Connect – Safety Overview (UKSEDS Use)

This document explains how RoverDash Connect fits into the overall safety concept for UKSEDS rover competitions. It separates software responsibilities from mandatory hardware safety and references typical competition safety expectations.

---

## 1. Safety context and objectives

UKSEDS rover competitions require that all rovers operate safely, including:

- An **external, easily accessible hardware kill switch** that can isolate power from the rover drive system and high‑power electronics.[1]
- Safe battery selection, mounting and wiring with no exposed live conductors.[1]
- Clear operating procedures, risk assessment, and responsible team behaviour.[web:359][web:366]

RoverDash Connect does **not** change these requirements. Its objectives are:

- to make the rover’s operational state visible to operators,
- to gate software controls based on simple, conservative rules,
- to integrate with backend emergency and watchdog signals,
- and to support the team’s safety case with clear, documented behaviour.

[1]: UKSEDS rover rules – safety section (hardware kill switch, batteries, live voltage limits).

---

## 2. Division of responsibilities

### 2.1 Hardware safety (primary layer)

The rover hardware and electrical system are responsible for:

- **Physical emergency stop**
  - A hardwired kill switch that immediately removes power from drive actuators and other defined circuits, independent of software, networking, and the dashboard.[1][web:601]
- **Hardware watchdog / failsafe**
  - Independent supervision of command or heartbeat signals.
  - Transition to a defined safe state if the heartbeat is lost or invalid for a configured interval.[web:601][web:600]
- **Power‑stage isolation**
  - Contactors, breakers or equivalent means to isolate high‑power circuits.
- **Compliance with rules**
  - Battery type and protection, fusing, wiring practices, and voltage limits as specified by UKSEDS.[web:359]

These mechanisms remain the ultimate safety systems, in line with UKSEDS expectations and standard robot safety practice.[web:596][web:598]

### 2.2 Software/dashboard safety (supporting layer)

RoverDash Connect is a **supporting safety layer**, providing:

- Live visibility into connection and telemetry state.
- Control gating based on connection and telemetry freshness.
- Operator alerts for degraded or unsafe conditions.
- Integration with backend emergency‑stop and watchdog events.

It assists operators in making safe decisions but does not replace the need for hardware design and procedural controls.[web:597][web:602]

---

## 3. Software safety functions

RoverDash Connect implements the following safety‑relevant behaviours:

### 3.1 Connection health monitoring

- Tracks the WebSocket connection to the backend gateway.
- Classifies connection as **connected** or **disconnected** and exposes this clearly in the UI.

### 3.2 Telemetry freshness supervision

- Uses telemetry timestamps or update cadence to determine if telemetry is **fresh** or **stale**.
- Treats stale telemetry as unsafe for motion control.

### 3.3 Control gating rules

Controls are enabled only when:

- the rover is **connected**, and
- telemetry is **fresh**.

Notably:

- Command status (pending / acknowledged / success / failure) **does not** disable controls on its own.
- Ordinary command failures are surfaced to the operator but are kept logically separate from connection or safety state to avoid false lockouts.

This design keeps the gating rules simple and explainable in safety documentation and viva questions.

### 3.4 Operator alerts and state separation

The dashboard presents distinct operator states, for example:

- Healthy
- Stale telemetry
- Disconnected
- Command failure
- Emergency stop active
- Watchdog / heartbeat loss

By separating these, the system avoids hiding different failure modes behind a generic “error” indicator, supporting better operator decisions and clearer incident reporting.[web:596][web:600]

### 3.5 Emergency stop and watchdog integration

Software integrates with backend safety signals:

- **E‑stop signalling**
  - Dashboard can issue an E‑stop command to the backend when the link is available.
  - It displays backend‑confirmed emergency state prominently.
- **Watchdog awareness**
  - If the backend indicates watchdog or heartbeat loss, the dashboard shows a dedicated warning and disables motion controls.

In all such cases, the expectation is that hardware mechanisms also act to bring the rover to a safe state; the dashboard ensures operators are immediately aware of that state.

---

## 4. Behaviour in key safety scenarios

The table below summarises how the dashboard behaves in common safety‑relevant scenarios:

| Scenario                                   | Dashboard behaviour                                 | Controls | Expected team response                      |
|--------------------------------------------|-----------------------------------------------------|---------:|---------------------------------------------|
| Normal operation                           | Healthy state; telemetry updating                   | Enabled  | Normal driving within competition rules     |
| Telemetry path degraded or stalled         | Stale telemetry warning                             | Disabled | Diagnose link; do not drive blind           |
| Communication link lost                    | Disconnected warning                                | Disabled | Restore link; use hardware kill if needed   |
| Command rejected / failed                  | Command‑specific error message                      | Enabled  | Investigate; avoid repeated retries         |
| Emergency stop (hardware or backend)       | E‑stop banner/state shown                           | Disabled | Follow E‑stop reset procedure, then retest  |
| Watchdog / heartbeat loss                  | Watchdog / supervision warning; safe‑state indication | Disabled | Verify rover failsafe, restore supervision  |

This clear mapping of state → operator expectation is important for demonstrating safe operating procedures to judges and inspectors.[web:600][web:613]

---

## 5. Alignment with competition safety expectations

RoverDash Connect supports UKSEDS‑style rover safety requirements by:

- treating hardware safety as the primary layer,
- enforcing conservative, visible rules for when software controls are allowed,
- avoiding “clever” but opaque safety logic,
- and providing operators with clear, distinct warnings for each class of issue (link, telemetry, command, E‑stop, watchdog).

In documentation and presentations, the correct framing is:

- “RoverDash Connect is the **mission control and software supervision layer**.  
  It helps operators stay within safe conditions and respond to faults quickly,  
  but the rover’s **hardware kill switch, hardware watchdog and power isolation** remain the final safety mechanisms in line with UKSEDS rules.”

This framing demonstrates that the team understands the hierarchy of controls: hardware interlocks and clear procedures first, with software used to support safe operation rather than to replace mandatory mechanical and electrical safety.[web:359][web:596]
