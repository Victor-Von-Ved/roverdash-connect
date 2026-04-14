/**
 * System configuration constants
 * All thresholds and timing values for operational use
 */

// Telemetry and connection timing
export const HEARTBEAT_INTERVAL_MS = 1000;
export const STALE_THRESHOLD_MS = 3000;
export const CRITICAL_THRESHOLD_MS = 10000;
export const RECONNECT_DELAY_MS = 2000;
export const RECONNECT_MAX_ATTEMPTS = 10;

// UI thresholds
export const BATTERY_WARNING_THRESHOLD = 20;
export const BATTERY_CRITICAL_THRESHOLD = 10;
export const TEMPERATURE_WARNING_THRESHOLD = 45;
export const TEMPERATURE_CRITICAL_THRESHOLD = 55;

// Operational constants
export const DEFAULT_MAX_SPEED = 1.5;
export const TELEMETRY_SCHEMA_VERSION = 1;