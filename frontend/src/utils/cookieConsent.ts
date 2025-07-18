export type CookieConsent = {
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
};

export function getCookieConsent(): CookieConsent {
  if (typeof window === 'undefined') return { analytics: false, preferences: false, marketing: false };
  const stored = localStorage.getItem('cookieConsent');
  if (stored) return JSON.parse(stored);
  return { analytics: false, preferences: false, marketing: false };
} 