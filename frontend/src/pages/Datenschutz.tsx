import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Mail, Database, Eye, Lock, Users, Cookie, ArrowRightLeft, AlertCircle } from 'lucide-react';

const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const Datenschutz: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 animate-gradient-slow">
    <motion.div
      className="max-w-3xl mx-auto px-4 py-12"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <motion.div className="flex items-center mb-6" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.6, type: 'spring' }}>
        <ShieldCheck className="h-10 w-10 text-primary-600 mr-3 animate-bounce-slow" />
        <motion.h1
          className="text-3xl font-bold text-gray-900"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
        >
          Privacy Policy
        </motion.h1>
      </motion.div>
      <div className="space-y-6">
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
          <div className="flex items-center mb-2 text-primary-700"><User className="h-5 w-5 mr-2" /><strong>Data Controller</strong></div>
          <p>DailyLearn GmbH<br />Example Street 12<br />12345 Berlin, Germany<br />Email: info@dailylearn.com</p>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.3 }}>
          <div className="flex items-center mb-2 text-primary-700"><Database className="h-5 w-5 mr-2" /><strong>Data We Collect</strong></div>
          <ul className="list-disc ml-6">
            <li>Account information (name, email, password)</li>
            <li>Usage data (lessons, quiz results, progress)</li>
            <li>Payment data (if you subscribe to premium features)</li>
            <li>Technical data (IP address, device/browser info, cookies)</li>
          </ul>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.4 }}>
          <div className="flex items-center mb-2 text-primary-700"><Eye className="h-5 w-5 mr-2" /><strong>Purpose of Processing</strong></div>
          <ul className="list-disc ml-6">
            <li>To provide and improve our services</li>
            <li>To manage your account and subscriptions</li>
            <li>To ensure security and prevent fraud</li>
            <li>To comply with legal obligations</li>
          </ul>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.5 }}>
          <div className="flex items-center mb-2 text-primary-700"><Lock className="h-5 w-5 mr-2" /><strong>Legal Basis</strong></div>
          <p>We process your data based on your consent (Art. 6(1)(a) GDPR), for contract performance (Art. 6(1)(b) GDPR), and to fulfill legal obligations (Art. 6(1)(c) GDPR).</p>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.6 }}>
          <div className="flex items-center mb-2 text-primary-700"><Users className="h-5 w-5 mr-2" /><strong>Data Sharing</strong></div>
          <p>We do not share your personal data with third parties except for service providers (e.g., payment, hosting) and only as necessary for service provision or legal compliance.</p>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.7 }}>
          <div className="flex items-center mb-2 text-primary-700"><Cookie className="h-5 w-5 mr-2" /><strong>Cookies & Tracking</strong></div>
          <p>We use cookies to enhance your experience. You can manage your cookie preferences at any time. See our Cookie Policy for details.</p>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.8 }}>
          <div className="flex items-center mb-2 text-primary-700"><ArrowRightLeft className="h-5 w-5 mr-2" /><strong>Your Rights</strong></div>
          <ul className="list-disc ml-6">
            <li>Right to access, rectify, or erase your data</li>
            <li>Right to restrict or object to processing</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent at any time</li>
            <li>Right to lodge a complaint with a supervisory authority</li>
          </ul>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.9 }}>
          <div className="flex items-center mb-2 text-primary-700"><ShieldCheck className="h-5 w-5 mr-2" /><strong>Data Security</strong></div>
          <p>We use technical and organizational measures to protect your data against unauthorized access, loss, or misuse.</p>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 1.0 }}>
          <div className="flex items-center mb-2 text-primary-700"><Mail className="h-5 w-5 mr-2" /><strong>Contact</strong></div>
          <p>If you have questions about this privacy policy or your data, contact us at info@dailylearn.com.</p>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 1.1 }}>
          <div className="flex items-center mb-2 text-primary-700"><AlertCircle className="h-5 w-5 mr-2" /><strong>Disclaimer</strong></div>
          <p>This privacy policy may be updated from time to time. Please check back regularly.</p>
        </motion.div>
      </div>
    </motion.div>
  </div>
);

export default Datenschutz;

// Tailwind animation for gradient
// Add to your global CSS if not present:
// @keyframes gradient-slow { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
// .animate-gradient-slow { background-size:200% 200%; animation:gradient-slow 12s ease-in-out infinite; } 