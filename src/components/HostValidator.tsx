import { useEffect } from 'react';
import { validateCurrentHost, getAllowedHosts } from '../utils/allowedHosts';

interface HostValidatorProps {
  children: React.ReactNode;
}

/**
 * Component to validate the current host against allowed hosts
 * Shows a warning if the host is not allowed
 */
export const HostValidator = ({ children }: HostValidatorProps) => {
  useEffect(() => {
    if (!validateCurrentHost()) {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
      console.warn(
        `⚠️ Security Warning: Host "${currentHost}" is not in the allowed hosts list.`,
        `\nAllowed hosts: ${getAllowedHosts().join(', ')}`,
        `\nPlease add the host to vite.config.js or contact the administrator.`
      );
    }
  }, []);

  return <>{children}</>;
};