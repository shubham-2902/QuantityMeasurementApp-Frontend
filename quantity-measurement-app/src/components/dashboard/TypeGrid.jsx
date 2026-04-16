const TYPES = [
  {
    type: 'length',
    label: 'Length',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="4"  y="17" width="32" height="6"  rx="3"   fill="#6b8cff"/>
        <rect x="4"  y="14" width="3"  height="12" rx="1.5" fill="#3b5bdb"/>
        <rect x="33" y="14" width="3"  height="12" rx="1.5" fill="#3b5bdb"/>
      </svg>
    ),
  },
  {
    type: 'weight',
    label: 'Weight',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="20" cy="30" rx="14" ry="7" fill="#6b8cff" opacity="0.3"/>
        <path d="M10 28 Q20 12 30 28" stroke="#3b5bdb" strokeWidth="2.5" fill="#a5b4fc" fillOpacity="0.4"/>
        <line x1="20" y1="8" x2="20" y2="13" stroke="#3b5bdb" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="20" cy="7" r="3" fill="#3b5bdb"/>
      </svg>
    ),
  },
  {
    type: 'temperature',
    label: 'Temperature',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="17"   y="5"  width="6" height="20" rx="3"   fill="#ff6b6b" opacity="0.4"/>
        <rect x="18.5" y="5"  width="3" height="18" rx="1.5" fill="#ff6b6b"/>
        <circle cx="20" cy="28" r="5" fill="#ff6b6b"/>
        <line x1="24" y1="11" x2="27" y2="11" stroke="#ff6b6b" strokeWidth="1.5"/>
        <line x1="24" y1="15" x2="26" y2="15" stroke="#ff6b6b" strokeWidth="1.5"/>
        <line x1="24" y1="19" x2="27" y2="19" stroke="#ff6b6b" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    type: 'volume',
    label: 'Volume',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M12 8 L9 32 Q9 34 12 34 L28 34 Q31 34 31 32 L28 8 Z" fill="#a78bfa" opacity="0.3"/>
        <path d="M12 8 L9 32 Q9 34 12 34 L28 34 Q31 34 31 32 L28 8 Z" stroke="#7c3aed" strokeWidth="2" fill="none"/>
        <path d="M9 22 Q12 20 15 22 Q18 24 21 22 Q24 20 27 22 Q29 23 31 22" stroke="#7c3aed" strokeWidth="1.5" fill="none"/>
        <rect x="10" y="6" width="20" height="4" rx="2" fill="#7c3aed"/>
      </svg>
    ),
  },
]

export default function TypeGrid({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-4 gap-4 max-sm:grid-cols-2">
      {TYPES.map(({ type, icon, label }) => {
        const isSelected = selected === type;
        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`
              relative flex flex-col items-center justify-center p-5 rounded-xl border-[1.5px] transition-all duration-300
              ${isSelected 
                ? 'bg-blue-50/80 dark:bg-brand-600/10 border-brand-600 dark:border-brand-500 shadow-[0_4px_12px_rgba(59,91,219,0.15)] dark:shadow-[0_4px_12px_rgba(59,91,219,0.25)] scale-[1.02]' 
                : 'bg-white dark:bg-slate-800/80 border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-white/30 hover:bg-gray-50 dark:hover:bg-slate-700/80 hover:-translate-y-0.5'
              }
            `}
          >
            <div className={`mb-3 transition-colors duration-300 ${isSelected ? 'text-[#3b5bdb] dark:text-[#4f73fd]' : 'text-gray-400 dark:text-gray-400'}`}>
              <div className="w-10 h-10">
                {icon}
              </div>
            </div>
            <span className={`text-[13px] font-bold tracking-wide transition-colors duration-300 ${
              isSelected ? 'text-[#1a1f6e] dark:text-white' : 'text-[#6b7280] dark:text-gray-300'
            }`}>
              {label}
            </span>
            
            {isSelected && (
              <div className="absolute -bottom-1.5 w-8 h-1 decoration-clone bg-brand-600 dark:bg-brand-500 rounded-full animate-fadeIn shadow-sm"></div>
            )}
          </button>
        );
      })}
    </div>
  );
}
