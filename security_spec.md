# Security Specification & Payload TDD — TradeVortex Firestore

## 1. Data Invariants
1. **Default Deny**: Unmatched Firestore paths are unconditionally denied (`match /{document=**} { allow read, write: if false; }`).
2. **Global CMS Integrity**: Only verified admin accounts (`request.auth.token.email_verified == true` and bootstrapped admin email or `/admins/{uid}` entry) may create or update `/site_config/global`, and `updatedBy` must equal `request.auth.uid` with `updatedAt == request.time`.
3. **Public Read Scope**: Visitors worldwide may read `/site_config/global` (`get` only, no collection `list`), and `/test/connection` (`get` only) for real-time CMS synchronization without requiring sign-in.
4. **Telemetry Containment & Zero PII**: `/analytics_presence/{sessionId}` and `/analytics_events/{eventId}` contain zero PII (no email, phone, name, or IP). Presence updates are key-whitelisted and server-timestamped (`request.time`). Full analytics event querying (`get`, `list`, `delete`) is restricted to `isAdmin()`.
5. **Strict Path & Payload Bounds**: Every document ID passes `isValidId()` (`^[a-zA-Z0-9_\-]+$`, `<= 128` chars), and every string/list checks bounded `.size()`.

## 2. The Dirty Dozen Adversarial Payloads
1. **Unauthenticated Global Config Overwrite**: `{ settings: {}, updatedAt: now, updatedBy: "attacker" }` on `/site_config/global` -> `PERMISSION_DENIED`.
2. **Unverified Email Spoofing**: Admin email with `email_verified: false` writing `/site_config/global` -> `PERMISSION_DENIED`.
3. **Shadow Field Injection on SiteConfig**: Adding `isSuperAdmin: true` to `/site_config/global` -> `PERMISSION_DENIED` (`hasOnly` rejection).
4. **UID Spoofing on SiteConfig**: Authenticated admin setting `updatedBy: "other-uid"` -> `PERMISSION_DENIED`.
5. **Backdated Timestamp on SiteConfig**: Setting `updatedAt` in the past instead of `request.time` -> `PERMISSION_DENIED`.
6. **Wrong Config Document ID**: Writing `/site_config/rogue_doc` -> `PERMISSION_DENIED` (`configId == 'global'`).
7. **ID Poisoning on Presence**: Creating `/analytics_presence/../../admin` or 1.5KB ID -> `PERMISSION_DENIED` (`isValidId`).
8. **Invalid Device Enum on Presence**: `{ device: "SmartFridge", ... }` -> `PERMISSION_DENIED`.
9. **Oversized Array / Denial-of-Wallet on SiteConfig**: `{ brokers: [/* >100 items */] }` -> `PERMISSION_DENIED`.
10. **Presence Session Hijack / ID Mismatch**: Path `/analytics_presence/sess_a` with `{ sessionId: "sess_b" }` -> `PERMISSION_DENIED`.
11. **Unauthenticated Analytics Scraping**: Anonymous user calling `list` on `/analytics_events` -> `PERMISSION_DENIED`.
12. **Client-Manipulated Event Timestamp**: Submitting `/analytics_events/evt_1` with `createdAt` != `request.time` -> `PERMISSION_DENIED`.
