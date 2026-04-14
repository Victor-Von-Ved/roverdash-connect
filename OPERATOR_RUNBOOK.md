# RoverDash Connect – Operator Runbook (UKSEDS Use)

This document describes how RoverDash Connect is used to operate the rover safely during UKSEDS rover competitions. It focuses on operator actions and how the dashboard supports the team’s safety case.

---

## 1. Context and assumptions

- The rover complies with competition safety rules, including:
  - an external, easily accessible **hardware kill switch** that isolates battery power from the rover electronics and drive system.[1]
  - protected batteries and wiring (no exposed live conductors, compliant battery chemistry).[1]
- The dashboard is the **primary control interface** for teleoperated runs.
- Hardware kill switch, hardware watchdog and power isolation remain the **ultimate safety mechanisms**; the dashboard does not replace them.[1]

[1]: UKSEDS Lunar Rover / Olympus Rover rules – safety section (hardware kill switch, live voltage, battery protection).

---

## 2. Roles and responsibilities

- **Operator (Driver):**
  - Uses RoverDash Connect for command/control and telemetry.
  - Monitors connection and telemetry state continuously.
  - Requests or actuates emergency stop when required.
- **Safety Officer / Spotter:**
  - Maintains situational awareness of the rover and test area.
  - Has direct access to the hardware kill switch.
  - Can call or trigger E‑stop at any time, overriding the operator.

The team’s risk assessment should reflect these roles and how the software dashboard fits into the overall safety concept.[web:359][web:366]

---

## 3. Pre‑run safety checklist (before entering the test area)

Complete this checklist before any motion in the competition environment:

1. **Hardware safety**
   - Hardware kill switch is installed, clearly labelled and tested (rover power genuinely drops when actuated).[web:359]
   - Any hardware watchdog or failsafe logic is enabled and configured.
   - Drive power can be disconnected (e.g. via contactors, removable links, breakers).

2. **Environment and team**
   - Test area and exclusion zones are understood and respected.
   - Only essential personnel are in the operating area; roles are agreed (operator, safety officer, support).[web:366]
   - Team knows who is authorised to call “STOP” and operate the kill switch.

3. **Backend and network**
   - Competition‑approved comms setup is in place.
   - Mission gateway / backend is running and reachable.

4. **Dashboard**
   - RoverDash Connect loads without errors.
   - Operator can log in (if enabled).
   - Connection state initially shows disconnected, then transitions to connected as the backend comes online.

5. **Telemetry sanity**
   - Telemetry (e.g. supply voltage, currents, temperatures, pose) updates at expected rates.
   - Values are plausible for a stationary rover.
   - No stale telemetry warning before starting motion.

---

## 4. Normal startup sequence

Use this sequence when beginning an official or practice run:

1. **Bring up hardware**
   - Power on rover, confirm no unintended motion.
   - Verify kill switch function once in a safe area.

2. **Start mission gateway**
   - Launch the backend gateway/service.
   - Confirm it can communicate with the rover.

3. **Open dashboard**
   - Open RoverDash Connect on the control laptop.
   - Log in if required.

4. **Verify connection and telemetry**
   - Wait for “connected / healthy” state in the dashboard.
   - Confirm telemetry is updating and not stale.

5. **Safe motion test**
   - With wheels off the ground or in a designated safe configuration, issue a small motion command.
   - Confirm the rover responds and stops as expected.

Only after all steps above are complete should the rover be moved in the competition environment.

---

## 5. Reading dashboard states (operator model)

RoverDash Connect deliberately exposes a **small set of states** that map cleanly to operator actions:

### 5.1 Healthy

- **Dashboard:** Connected and healthy; telemetry updating normally.
- **Controls:** Enabled.
- **Action:** Proceed with normal operation, while continuously monitoring state.

---

### 5.2 Stale telemetry

- **Dashboard:** Warning/amber state; telemetry timestamps no longer advancing.
- **Controls:** Automatically disabled until telemetry becomes fresh again.
- **Action:**
  - Treat this as “unsafe to command”.
  - Investigate link/backend, regain fresh telemetry before issuing motion commands.

---

### 5.3 Disconnected

- **Dashboard:** Disconnected / no data.
- **Controls:** Disabled.
- **Action:**
  - Assume the rover might still be powered and potentially moving.
  - Attempt to restore the link.
  - If there is any doubt about motion, the safety officer should use the hardware kill switch.

---

### 5.4 Command failure

- **Dashboard:** Command‑specific error feedback (e.g. send failure, backend rejection).
- **Controls:** Remain enabled as long as connection and telemetry are healthy.
- **Action:**
  - Do not spam retries.
  - Read the error, adjust inputs or configuration.
  - If repeated command failures are unexplained, pause motion and diagnose before continuing.

---

### 5.5 Emergency stop active

- **Dashboard:** Clear red E‑stop indication; emergency state banner.
- **Controls:** Motion commands disabled.
- **Action:**
  - Treat this as a safety event.
  - Verify the hardware kill switch / safety chain as per team procedure.
  - Only after the area is safe and the rover hardware is checked should any reset be attempted.

---

### 5.6 Watchdog / heartbeat loss

- **Dashboard:** Watchdog or heartbeat warning; safety state shown.
- **Controls:** Motion commands disabled.
- **Action:**
  - Assume the rover has entered its failsafe state per hardware design.
  - Restore supervised communication and confirm hardware behaviour before re‑authorising motion.

---

## 6. Emergency stop – when and how to use it

The team must be prepared to stop the rover immediately in line with competition safety expectations.[web:359][web:600]

### 6.1 When to stop

Trigger a stop if:

- the rover behaves unexpectedly,
- line‑of‑sight or situational awareness is lost,
- telemetry or controls are obviously wrong or unresponsive,
- a person or object enters the defined safety/perimeter zone.

### 6.2 How to stop

Preferred sequence:

1. **Hardware kill switch**
   - The safety officer or authorised team member presses the physical kill switch.
   - This should isolate rover power and halt motion regardless of software or link state.

2. **Dashboard E‑stop control**
   - If the network link is still available, the operator also uses the dashboard E‑stop.
   - This ensures the backend and software stack agree that the rover is in an emergency state.

### 6.3 Reset after an E‑stop

Only when the area is safe and the rover is physically stable:

1. **Hardware reset**
   - Reset the physical kill switch according to hardware instructions.
   - Confirm that the rover does not move on its own.

2. **Software / backend reset**
   - Restore backend connection and verify the dashboard returns to a healthy state.
   - Clear any software E‑stop indications using the defined UI/backend controls.

3. **Low‑risk test**
   - With wheels off the ground or in a constrained area, perform a short motion test.
   - If behaviour is nominal, resume the mission.

If any part of this reset fails or behaviour is unclear, the rover must remain stopped until resolved.

---

## 7. Troubleshooting quick reference

| Symptom                                | Likely cause                          | Operator response                          |
|----------------------------------------|---------------------------------------|--------------------------------------------|
| Telemetry frozen, stale warning        | Telemetry path degraded / stopped     | Do not command; restore telemetry          |
| Disconnected state                     | Comms or backend failure              | Restore link; consider hardware kill       |
| Commands failing in healthy state      | Validation or backend issue           | Pause, inspect error; avoid repeated spam  |
| Emergency stop active                  | Hardware or software E‑stop asserted  | Follow E‑stop reset procedure              |
| Watchdog/heartbeat warning             | Lost supervised control                | Treat as serious fault; verify failsafe    |

---

## 8. Post‑run review

After each competition run or major test:

- Log any incidents, near‑misses, or confusing UI states.
- Note:
  - what the rover did,
  - what the dashboard showed,
  - which actions operators and safety officer took.
- Update this runbook and the team’s risk assessment if you identify better ways to structure operator steps or make warnings clearer.[web:604][web:609]

This demonstrates to UKSEDS reviewers that the team has an active, documented safety process and that RoverDash Connect supports, rather than replaces, the mandated hardware safety measures.[web:359][web:615]
