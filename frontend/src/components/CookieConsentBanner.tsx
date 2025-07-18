import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, BarChart2, Sliders, Megaphone, CheckCircle, XCircle, Settings2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI, userAPI } from '../services/api';

const defaultConsent = {
  analytics: false,
  preferences: false,
  marketing: false,
};

const getConsentKey = (userId?: string) => `cookieConsent_${userId || 'guest'}`;

const CookieConsentBanner: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const userId = user?._id;
  const [show, setShow] = useState(false);
  const [consent, setConsent] = useState(defaultConsent);
  const [customizing, setCustomizing] = useState(false);

  // Helper to get the correct key
  const consentKey = getConsentKey(userId);

  // Helper to check if consent is complete
  const isConsentComplete = (consentObj: typeof defaultConsent | undefined) => {
    if (!consentObj) return false;
    // Consider consent complete if any value is true or all are explicitly set (user made a choice)
    return (
      typeof consentObj.analytics === 'boolean' &&
      typeof consentObj.preferences === 'boolean' &&
      typeof consentObj.marketing === 'boolean' &&
      (consentObj.analytics || consentObj.preferences || consentObj.marketing ||
        (!consentObj.analytics && !consentObj.preferences && !consentObj.marketing))
    );
  };

  // Show banner if consent is missing/incomplete (DB for logged-in, localStorage for guests)
  useEffect(() => {
    if (loading) return; // Wait until user is loaded
    if (isAuthenticated && user) {
      if (user.hasCompletedCookieConsent) {
        setShow(false);
        setConsent(user.preferences?.cookieConsent || defaultConsent);
        return;
      }
      const dbConsent = user.preferences?.cookieConsent;
      setShow(true);
      setConsent(dbConsent || defaultConsent);
    } else if (!isAuthenticated && !loading) {
      // Guest: use localStorage
      const stored = localStorage.getItem(getConsentKey('guest'));
      if (!stored) {
        setShow(true);
        setConsent(defaultConsent);
      } else {
        setShow(false);
        setConsent(JSON.parse(stored));
      }
    }
  }, [isAuthenticated, user, loading]);

  // Show banner after login/register if consent not set
  useEffect(() => {
    if (isAuthenticated && user) {
      const stored = localStorage.getItem(consentKey);
      if (!stored) {
        setShow(true);
      }
    }
  }, [isAuthenticated, user, consentKey]);

  // Save consent to backend for logged-in, localStorage for guests
  const saveConsent = async (newConsent: typeof defaultConsent) => {
    if (isAuthenticated && user) {
      try {
        await userAPI.updatePreferences({
          ...user.preferences,
          cookieConsent: newConsent,
        });
      } catch (e) {
        // ignore
      }
    } else {
      localStorage.setItem(getConsentKey('guest'), JSON.stringify(newConsent));
    }
  };

  // On logout, clear guest consent from localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem(getConsentKey('guest'));
    }
  }, [isAuthenticated]);

  const handleAcceptAll = () => {
    const all = { analytics: true, preferences: true, marketing: true };
    setConsent(all);
    saveConsent(all);
    setShow(false);
  };

  const handleRejectAll = () => {
    setConsent(defaultConsent);
    saveConsent(defaultConsent);
    setShow(false);
  };

  const handleSaveCustom = () => {
    saveConsent(consent);
    setShow(false);
  };

  if (loading) return null;
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="fixed z-50 bottom-0 left-0 w-full flex justify-center pointer-events-none"
      >
        <div className="pointer-events-auto max-w-xl w-full m-4 p-6 bg-white rounded-2xl shadow-2xl border border-primary-200 flex flex-col md:flex-row items-center gap-4 animate-fade-in">
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <Cookie className="h-10 w-10 text-primary-600 animate-bounce-slow" />
            <span className="text-xs text-primary-700 font-semibold">Cookie Consent</span>
          </div>
          <div className="flex-1 text-gray-700 text-sm md:ml-4">
            <div className="font-semibold mb-1">We use cookies to enhance your experience.</div>
            <div className="mb-2">Select which data we may collect. Essential cookies are always enabled. You can change your choice anytime in your profile.</div>
            {customizing && (
              <div className="space-y-2 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <BarChart2 className="h-5 w-5 text-primary-500" />
                  <span className="flex-1">Analytics</span>
                  <input type="checkbox" checked={consent.analytics} onChange={e => setConsent(c => ({ ...c, analytics: e.target.checked }))} className="form-checkbox h-5 w-5 text-primary-600" />
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Sliders className="h-5 w-5 text-primary-500" />
                  <span className="flex-1">Preferences</span>
                  <input type="checkbox" checked={consent.preferences} onChange={e => setConsent(c => ({ ...c, preferences: e.target.checked }))} className="form-checkbox h-5 w-5 text-primary-600" />
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Megaphone className="h-5 w-5 text-primary-500" />
                  <span className="flex-1">Marketing</span>
                  <input type="checkbox" checked={consent.marketing} onChange={e => setConsent(c => ({ ...c, marketing: e.target.checked }))} className="form-checkbox h-5 w-5 text-primary-600" />
                </label>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 md:ml-4">
            {!customizing ? (
              <>
                <button onClick={handleAcceptAll} className="btn-primary flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> Accept All
                </button>
                <button onClick={handleRejectAll} className="btn-outline flex items-center gap-1">
                  <XCircle className="h-4 w-4" /> Reject All
                </button>
                <button onClick={() => setCustomizing(true)} className="btn-secondary flex items-center gap-1">
                  <Settings2 className="h-4 w-4" /> Customize
                </button>
              </>
            ) : (
              <button onClick={handleSaveCustom} className="btn-primary flex items-center gap-1 mt-2">
                <CheckCircle className="h-4 w-4" /> Save
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsentBanner; 