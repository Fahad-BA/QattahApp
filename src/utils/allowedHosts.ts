/**
 * Allowed hosts configuration for Qattah App
 * This utility validates if a host is allowed for security
 */
export const ALLOWED_HOSTS = [
  'localhost',
  '127.0.0.1',
  '192.168.1.9',
  'qattah.fhidan.com',
  'q.fhidan.com',
  '*.fhidan.com',
  '.fhidan.com',
  'fhidan.com',
] as const;

export type AllowedHost = typeof ALLOWED_HOSTS[number];

/**
 * Check if a host is allowed
 */
export function isAllowedHost(host: string): host is AllowedHost {
  return ALLOWED_HOSTS.some(allowed => {
    if (allowed.startsWith('*.')) {
      const domain = allowed.slice(2);
      return host === domain || host.endsWith('.' + domain);
    }
    if (allowed.startsWith('.')) {
      const domain = allowed.slice(1);
      return host === domain || host.endsWith('.' + domain);
    }
    return host === allowed;
  });
}

/**
 * Validate current window host
 */
export function validateCurrentHost(): boolean {
  if (typeof window === 'undefined') return true;
  
  const host = window.location.hostname;
  return isAllowedHost(host);
}

/**
 * Get allowed hosts for environment
 */
export function getAllowedHosts(): readonly string[] {
  return ALLOWED_HOSTS;
}