import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, Settings, Users, Mail, ShieldCheck, Info } from 'lucide-react';

const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const Cookies: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 animate-gradient-slow">
    <motion.div
      className="max-w-3xl mx-auto px-4 py-12"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <motion.div className="flex items-center mb-6" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.6, type: 'spring' }}>
        <Cookie className="h-10 w-10 text-primary-600 mr-3 animate-bounce-slow" />
        <motion.h1
          className="text-3xl font-bold text-gray-900"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
        >
          Cookie Policy
        </motion.h1>
      </motion.div>
      <div className="space-y-6">
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
          <div className="flex items-center mb-2 text-primary-700"><Info className="h-5 w-5 mr-2" /><strong>What Are Cookies?</strong></div>
          <p>Cookies are small text files stored on your device by your browser. They help us provide, protect, and improve DailyLearn.</p>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.3 }}>
          <div className="flex items-center mb-2 text-primary-700"><Settings className="h-5 w-5 mr-2" /><strong>Types of Cookies We Use</strong></div>
          <ul className="list-disc ml-6">
            <li><strong>Essential Cookies:</strong> Necessary for the operation of our website (e.g., authentication, security).</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our site (e.g., Google Analytics).</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences.</li>
            <li><strong>Marketing Cookies:</strong> Used to deliver relevant ads (only if you consent).</li>
          </ul>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.4 }}>
          <div className="flex items-center mb-2 text-primary-700"><ShieldCheck className="h-5 w-5 mr-2" /><strong>Managing Cookies</strong></div>
          <p>You can manage or disable cookies in your browser settings. Some features may not work properly if you disable essential cookies.</p>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.5 }}>
          <div className="flex items-center mb-2 text-primary-700"><Users className="h-5 w-5 mr-2" /><strong>Third-Party Cookies</strong></div>
          <p>We may use third-party services that set their own cookies (e.g., analytics, payment providers). Please refer to their privacy policies for more information.</p>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.6 }}>
          <div className="flex items-center mb-2 text-primary-700"><Cookie className="h-5 w-5 mr-2" /><strong>Consent</strong></div>
          <p>On your first visit, you will be asked to consent to non-essential cookies. You can change your preferences at any time.</p>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.7 }}>
          <div className="flex items-center mb-2 text-primary-700"><Mail className="h-5 w-5 mr-2" /><strong>Contact</strong></div>
          <p>If you have questions about our cookie policy, contact us at info@dailylearn.com.</p>
        </motion.div>
      </div>
    </motion.div>
  </div>
);

export default Cookies;

// Tailwind animation for gradient
// Add to your global CSS if not present:
// @keyframes gradient-slow { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
// .animate-gradient-slow { background-size:200% 200%; animation:gradient-slow 12s ease-in-out infinite; } 