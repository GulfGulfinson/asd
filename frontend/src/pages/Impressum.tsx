import React from 'react';
import { motion } from 'framer-motion';
import { FileText, User, Mail, Phone, Building2, BadgeEuro, ShieldAlert } from 'lucide-react';

const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const Impressum: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 animate-gradient-slow">
    <motion.div
      className="max-w-3xl mx-auto px-4 py-12"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <motion.div className="flex items-center mb-6" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.6, type: 'spring' }}>
        <FileText className="h-10 w-10 text-primary-600 mr-3 animate-bounce-slow" />
        <motion.h1
          className="text-3xl font-bold text-gray-900"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
        >
          Legal Notice (Impressum)
        </motion.h1>
      </motion.div>
      <div className="space-y-6">
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
          <div className="flex items-center mb-2 text-primary-700"><FileText className="h-5 w-5 mr-2" /><strong>Information according to § 5 TMG</strong></div>
          <p>DailyLearn GmbH<br />Example Street 12<br />12345 Berlin<br />Germany</p>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.3 }}>
          <div className="flex items-center mb-2 text-primary-700"><User className="h-5 w-5 mr-2" /><strong>Represented by</strong></div>
          <p>Paul Schneid</p>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.4 }}>
          <div className="flex items-center mb-2 text-primary-700"><Phone className="h-5 w-5 mr-2" /><Mail className="h-5 w-5 mr-2" /><strong>Contact</strong></div>
          <p>Phone: +49 30 12345678<br />Email: info@dailylearn.com</p>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.5 }}>
          <div className="flex items-center mb-2 text-primary-700"><Building2 className="h-5 w-5 mr-2" /><strong>Register entry</strong></div>
          <p>Entry in the commercial register.<br />Register Court: Berlin Charlottenburg<br />Registration Number: HRB 123456</p>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.6 }}>
          <div className="flex items-center mb-2 text-primary-700"><BadgeEuro className="h-5 w-5 mr-2" /><strong>VAT ID</strong></div>
          <p>VAT identification number according to §27 a Umsatzsteuergesetz:<br />DE123456789</p>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.7 }}>
          <div className="flex items-center mb-2 text-primary-700"><User className="h-5 w-5 mr-2" /><strong>Responsible for content according to § 55 Abs. 2 RStV</strong></div>
          <p>Paul Schneid<br />Example Street 12<br />12345 Berlin</p>
        </motion.div>
        <motion.div className="bg-white rounded-xl shadow p-6 border border-primary-100" variants={sectionVariants} initial="initial" animate="animate" transition={{ delay: 0.8 }}>
          <div className="flex items-center mb-2 text-primary-700"><ShieldAlert className="h-5 w-5 mr-2" /><strong>Disclaimer</strong></div>
          <p>Despite careful content control, we assume no liability for the content of external links. The operators of the linked pages are solely responsible for their content.</p>
        </motion.div>
      </div>
    </motion.div>
  </div>
);

export default Impressum;

// Tailwind animation for gradient
// Add to your global CSS if not present:
// @keyframes gradient-slow { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
// .animate-gradient-slow { background-size:200% 200%; animation:gradient-slow 12s ease-in-out infinite; } 