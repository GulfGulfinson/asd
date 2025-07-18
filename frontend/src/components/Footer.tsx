import React from 'react';
import { BookOpen } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BookOpen className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-semibold text-gray-900">DailyLearn</span>
          </div>
          
          <div className="text-sm text-gray-600 text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} DailyLearn. All rights reserved.</p>
            <p className="mt-1">Learn something new every day.</p>
            <div className="mt-2 flex flex-col md:flex-row md:justify-end md:space-x-4 items-center">
              <a href="/impressum" className="transition transform hover:-translate-y-1 hover:scale-105 focus:scale-105 focus:outline-none bg-primary-50 text-primary-700 border border-primary-200 rounded-lg px-4 py-2 mb-2 md:mb-0 shadow-sm hover:bg-primary-100 hover:shadow-md font-medium">Legal Notice (Impressum)</a>
              <a href="/datenschutz" className="transition transform hover:-translate-y-1 hover:scale-105 focus:scale-105 focus:outline-none bg-primary-50 text-primary-700 border border-primary-200 rounded-lg px-4 py-2 mb-2 md:mb-0 shadow-sm hover:bg-primary-100 hover:shadow-md font-medium">Privacy Policy</a>
              <a href="/cookies" className="transition transform hover:-translate-y-1 hover:scale-105 focus:scale-105 focus:outline-none bg-primary-50 text-primary-700 border border-primary-200 rounded-lg px-4 py-2 shadow-sm hover:bg-primary-100 hover:shadow-md font-medium">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 