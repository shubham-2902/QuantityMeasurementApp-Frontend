const ACTIONS = [
  { id: 'comparison', label: 'Comparison' },
  { id: 'conversion', label: 'Conversion' },
  { id: 'arithmetic', label: 'Arithmetic' },
]

export default function ActionTabs({ selected, onSelect }) {
  return (
    <div className="flex bg-gray-100/80 dark:bg-slate-900/50 p-1.5 rounded-xl border border-gray-200/60 dark:border-white/5 w-fit shadow-inner transition-colors duration-300">
      {ACTIONS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`
            px-6 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-300 relative
            ${selected === id 
              ? 'bg-gradient-to-r from-[#3b5bdb] to-[#1a1f6e] text-white shadow-md scale-100' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200/50 dark:hover:bg-white/5 scale-95 hover:scale-100'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
