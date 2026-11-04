// =====================================================================
// CIVICDUTY SOVEREIGN MASTER ACCESS & PERIMETER RESTRICTION CONTROLLER
// =====================================================================

/**
 * Official unified master key codes for platform entry, documentation access,
 * and CD-Ops Command Studio administration.
 */
export const PRIMARY_MASTER_KEY = 'CD-SOV-2026-MASTER';

export const VALID_MASTER_KEYS = [
  'CD-SOV-2026-MASTER', // Primary Sovereign Master Key (Homepage, Docs & CD-Ops)
  'CD-OPS-2026-MASTER', // Secondary Operations Master Key
  'CD-CORP-9999',       // Founder Executive Direct Bypass
  'CIVICDUTY-UG-2026',  // Statutory Deployment Key
] as const;

/**
 * Validates whether an input key matches any authorized master keys.
 */
export const validateMasterKey = (input: string): boolean => {
  if (!input) return false;
  const clean = input.trim().toUpperCase();
  return (VALID_MASTER_KEYS as readonly string[]).includes(clean);
};

/**
 * Checks whether the platform has been unlocked in the current browser session.
 */
export const isPlatformUnlocked = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem('civicduty_platform_unlocked') === 'true';
  } catch {
    return false;
  }
};

/**
 * Sets the platform to unlocked state in sessionStorage.
 */
export const unlockPlatform = (): void => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem('civicduty_platform_unlocked', 'true');
  } catch (err) {
    console.error('Failed to set platform unlocked state', err);
  }
};

/**
 * Revokes platform unlock state (locks down platform to splash preview).
 */
export const lockPlatform = (): void => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem('civicduty_platform_unlocked');
  } catch (err) {
    console.error('Failed to revoke platform unlocked state', err);
  }
};
