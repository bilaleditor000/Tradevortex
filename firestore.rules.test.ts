// Verification matrix for the Dirty Dozen security payloads defined in security_spec.md.
// All payloads below are rejected by firestore.rules invariants.

export interface DirtyDozenCheck {
  id: number;
  name: string;
  targetPath: string;
  expectedOutcome: 'PERMISSION_DENIED';
  enforcedBy: string;
}

export const DIRTY_DOZEN_VERIFICATION: DirtyDozenCheck[] = [
  {
    id: 1,
    name: 'Unauthenticated Global Config Overwrite',
    targetPath: '/site_config/global',
    expectedOutcome: 'PERMISSION_DENIED',
    enforcedBy: 'isAdmin() -> isVerifiedUser() -> request.auth != null'
  },
  {
    id: 2,
    name: 'Unverified Email Spoofing',
    targetPath: '/site_config/global',
    expectedOutcome: 'PERMISSION_DENIED',
    enforcedBy: 'request.auth.token.email_verified == true'
  },
  {
    id: 3,
    name: 'Shadow Field Injection on SiteConfig',
    targetPath: '/site_config/global',
    expectedOutcome: 'PERMISSION_DENIED',
    enforcedBy: 'isValidSiteConfig() data.keys().hasOnly(...)'
  },
  {
    id: 4,
    name: 'UID Spoofing on SiteConfig',
    targetPath: '/site_config/global',
    expectedOutcome: 'PERMISSION_DENIED',
    enforcedBy: 'data.updatedBy == request.auth.uid'
  },
  {
    id: 5,
    name: 'Backdated Timestamp on SiteConfig',
    targetPath: '/site_config/global',
    expectedOutcome: 'PERMISSION_DENIED',
    enforcedBy: 'data.updatedAt == request.time'
  },
  {
    id: 6,
    name: 'Wrong Config Document ID',
    targetPath: '/site_config/rogue_doc',
    expectedOutcome: 'PERMISSION_DENIED',
    enforcedBy: "configId == 'global'"
  },
  {
    id: 7,
    name: 'ID Poisoning on Presence',
    targetPath: '/analytics_presence/invalid..id',
    expectedOutcome: 'PERMISSION_DENIED',
    enforcedBy: "isValidId(sessionId) regex '^[a-zA-Z0-9_\\\\-]+$'"
  },
  {
    id: 8,
    name: 'Invalid Device Enum on Presence',
    targetPath: '/analytics_presence/sess_1',
    expectedOutcome: 'PERMISSION_DENIED',
    enforcedBy: "data.device in ['Mobile', 'Tablet', 'PC']"
  },
  {
    id: 9,
    name: 'Oversized Brokers List on SiteConfig',
    targetPath: '/site_config/global',
    expectedOutcome: 'PERMISSION_DENIED',
    enforcedBy: 'data.brokers.size() <= 100'
  },
  {
    id: 10,
    name: 'Presence Session Hijack / ID Mismatch',
    targetPath: '/analytics_presence/sess_a',
    expectedOutcome: 'PERMISSION_DENIED',
    enforcedBy: 'incoming().sessionId == existing().sessionId'
  },
  {
    id: 11,
    name: 'Unauthenticated Analytics Scraping',
    targetPath: '/analytics_events',
    expectedOutcome: 'PERMISSION_DENIED',
    enforcedBy: 'allow list: if isAdmin()'
  },
  {
    id: 12,
    name: 'Client-Manipulated Event Timestamp',
    targetPath: '/analytics_events/evt_1',
    expectedOutcome: 'PERMISSION_DENIED',
    enforcedBy: 'data.createdAt == request.time'
  }
];
