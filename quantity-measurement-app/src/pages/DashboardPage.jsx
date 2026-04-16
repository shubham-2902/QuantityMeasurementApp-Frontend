import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/dashboard/Navbar';
import TypeGrid from '../components/dashboard/TypeGrid';
import ActionTabs from '../components/dashboard/ActionTabs';
import InputPanel from '../components/dashboard/InputPanel';
import HistoryPanel from '../components/dashboard/HistoryPanel';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const [measureType, setMeasureType] = useState('length');
  const [action, setAction] = useState('comparison');
  const [showHistory, setShowHistory] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we should show history after login
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('showHistory') === 'true' && session) {
      setShowHistory(true);
      // Remove the parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [location, session]);

  // Reset action to comparison if temperature is selected and current action is arithmetic
  const handleMeasureTypeChange = (type) => {
    setMeasureType(type);
    if (type === 'temperature' && action === 'arithmetic') {
      setAction('comparison');
    }
  };

  function handleViewHistory() {
    if (!session) {
      navigate('/login?requireLogin=true');
    } else {
      setShowHistory(true);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f0f4ff] to-[#e6edff] dark:from-slate-900 dark:to-[#090b14] font-nunito text-[#1a1a2e] dark:text-gray-100 transition-colors duration-300">
      <Navbar />

      <main className="max-w-[880px] mx-auto px-5 py-7 flex flex-col gap-5 max-sm:px-3 max-sm:py-3.5">
        {/* Toggle between Calculator and History */}
        <div className="flex justify-end">
          {!showHistory ? (
            <button
              onClick={handleViewHistory}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-md shadow-sm border border-white/40 dark:border-white/10 hover:shadow-md text-sm font-bold text-[#3bd0db] dark:text-gray-200 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="text-lg">📜</span>
              View History {!session && '(Login Required)'}
            </button>
          ) : (
            <button
              onClick={() => setShowHistory(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-md shadow-sm border border-white/40 dark:border-white/10 hover:shadow-md text-sm font-bold text-[#3b5bdb] dark:text-gray-200 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="text-lg">📐</span>
              Show Calculator
            </button>
          )}
        </div>

        {!showHistory ? (
          <div className="space-y-6">
            {/* Choose Type Section */}
            <section className="bg-white/60 dark:bg-[#111827]/60 backdrop-blur-xl border border-white/50 dark:border-white/5 rounded-2xl px-7 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
              <p className="text-[11px] font-extrabold tracking-[2px] text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-gradient-to-b from-[#3b5bdb] to-[#1a1f6e] rounded-full"></span>
                CHOOSE TYPE
              </p>
              <TypeGrid selected={measureType} onSelect={handleMeasureTypeChange} />
            </section>

            {/* Choose Action Section */}
            <section className="bg-white/60 dark:bg-[#111827]/60 backdrop-blur-xl border border-white/50 dark:border-white/5 rounded-2xl px-7 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
              <p className="text-[11px] font-extrabold tracking-[2px] text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-gradient-to-b from-[#3b5bdb] to-[#1a1f6e] rounded-full"></span>
                CHOOSE ACTION
              </p>
              <ActionTabs selected={action} onSelect={setAction} measureType={measureType} />
            </section>

            {/* Input Panel Section */}
            <section className="bg-white/60 dark:bg-[#111827]/60 backdrop-blur-xl border border-white/50 dark:border-white/5 rounded-2xl px-7 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
              <InputPanel measureType={measureType} action={action} />
            </section>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <HistoryPanel />
          </div>
        )}
      </main>
    </div>
  );
}