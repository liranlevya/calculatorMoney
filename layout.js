
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { TrendingUp, Calculator, BarChart3, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');

  const isHebrew = lang === 'he';

  const toggleLang = () => {
    const newLang = isHebrew ? 'en' : 'he';
    setLang(newLang);

    const currentPath = location.pathname.replace(/\/$/, "");
    let newPath;

    if (newLang === 'he') {
      newPath = currentPath.includes('_he') ? currentPath : `${currentPath}_he`;
      if (currentPath === '/Calculator') newPath = '/Calculator_he';
      if (currentPath === '/Analysis') newPath = '/Analysis_he';
    } else {
      newPath = currentPath.replace('_he', '');
    }

    navigate(newPath || '/Calculator');
  };

  useEffect(() => {
    const currentLang = location.pathname.includes('_he') ? 'he' : 'en';
    setLang(currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'he' ? 'rtl' : 'ltr';
  }, [location.pathname]);

  const navItems = isHebrew
    ? [
        { name: 'מחשבון', path: 'Calculator_he', icon: Calculator },
        { name: 'ניתוח', path: 'Analysis_he', icon: BarChart3 }
      ]
    : [
        { name: 'Calculator', path: 'Calculator', icon: Calculator },
        { name: 'Analysis', path: 'Analysis', icon: BarChart3 }
      ];

  const mainTitle = isHebrew ? 'מחשבון השקעות S&P 500' : 'S&P 500 Investment Calculator';
  const footerText = isHebrew
    ? 'חישובי השקעות מבוססים על נתונים היסטוריים של מדד S&P 500. ביצועי העבר אינם מבטיחים תוצאות עתידיות.'
    : 'Investment calculations based on historical S&P 500 data. Past performance does not guarantee future results.';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>{`
        :root {
          --primary-navy: #1e293b;
          --accent-gold: #f59e0b;
          --soft-blue: #3b82f6;
          --text-primary: #0f172a;
          --text-secondary: #64748b;
          --surface: rgba(255, 255, 255, 0.95);
          --border: rgba(148, 163, 184, 0.2);
        }
      `}</style>

      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">InvestCalc</h1>
                <p className="text-xs text-slate-500 font-medium">{mainTitle}</p>
              </div>
            </div>

            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <nav className="hidden md:flex items-center space-x-1 rtl:space-x-reverse">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse ${
                      location.pathname.includes(item.path)
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              <Button variant="ghost" size="icon" onClick={toggleLang} className="ml-2 rtl:mr-2 rtl:ml-0">
                <Languages className="w-5 h-5 text-slate-600" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="md:hidden bg-white/90 backdrop-blur-xl border-b border-slate-200/50 px-4 py-2">
        <div className="flex space-x-1 rtl:space-x-reverse">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={createPageUrl(item.path)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium text-center transition-all duration-200 ${
                location.pathname.includes(item.path)
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <item.icon className="w-4 h-4 mx-auto mb-1" />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      <main className="relative">
        {children}
      </main>

      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-4">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span className="font-semibold">InvestCalc</span>
          </div>
          <p className="text-slate-400 text-sm">
            {footerText}
          </p>
        </div>
      </footer>
    </div>
  );
}
