import { useState, useRef, useEffect } from 'react'

export const OP_LABELS = {
  '+': { symbol: '+', label: 'Add' },
  '-': { symbol: '−', label: 'Subtract' },
  '×': { symbol: '×', label: 'Multiply' },
  '÷': { symbol: '÷', label: 'Divide' },
}

export default function OpDropdown({ selected, onSelect }) {
  const [open, setOpen] = useState(false)
  const wrapRef         = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleSelect(op) {
    onSelect(op)
    setOpen(false)
  }

  return (
    <div ref={wrapRef} className="relative flex items-center justify-center w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl border-[1.5px] font-nunito text-xl font-black
          cursor-pointer select-none transition-all duration-300 min-w-[70px] justify-center backdrop-blur-sm
          ${open
            ? 'border-[#3b5bdb] dark:border-[#4f73fd] bg-[#eef2ff] dark:bg-brand-600/20 text-[#3b5bdb] dark:text-[#4f73fd] shadow-[0_4px_14px_rgba(59,91,219,0.18)] dark:shadow-[0_4px_14px_rgba(79,115,253,0.3)]'
            : 'border-[#e0e7ff] dark:border-white/10 bg-white dark:bg-slate-800/80 text-[#3b5bdb] dark:text-gray-300 hover:border-[#3b5bdb] dark:hover:border-white/30 hover:bg-[#eef2ff] dark:hover:bg-slate-700/80 hover:shadow-[0_4px_14px_rgba(59,91,219,0.18)] dark:hover:shadow-[0_4px_14px_rgba(0,0,0,0.3)] hover:-translate-y-0.5'
          } active:scale-95`}
      >
        <span>{OP_LABELS[selected].symbol}</span>
        <span className={`text-[10px] text-gray-400 dark:text-gray-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          ▲
        </span>
      </button>

      {/* Menu — opens UPWARD */}
      <div
        className={`absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200 dark:border-white/10
          rounded-xl shadow-[0_-4px_28px_rgba(59,91,219,0.15),0_2px_8px_rgba(59,91,219,0.08)] dark:shadow-[0_-4px_28px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.2)]
          overflow-hidden z-50 min-w-[150px] transition-all duration-300
          ${open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
      >
        {Object.entries(OP_LABELS).map(([op, meta]) => (
          <button
            key={op}
            type="button"
            onClick={() => handleSelect(op)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-[14px] font-bold text-left
              border-b border-gray-100 dark:border-white/5 last:border-b-0 transition-all duration-200 group
              ${selected === op
                ? 'bg-blue-50/80 dark:bg-white/10 text-[#3b5bdb] dark:text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#3b5bdb] dark:hover:text-white'
              }`}
          >
            <span
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] font-black shrink-0 transition-all duration-200
                ${selected === op
                  ? 'bg-[#3b5bdb] dark:bg-[#4f73fd] text-white'
                  : 'bg-[#eef2ff] dark:bg-white/10 text-[#3b5bdb] dark:text-gray-300 group-hover:bg-[#3b5bdb] dark:group-hover:bg-[#4f73fd] group-hover:text-white'
                }`}
            >
              {meta.symbol}
            </span>
            <span>{meta.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
