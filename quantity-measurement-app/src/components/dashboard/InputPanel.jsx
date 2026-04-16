import { useState, useEffect, useCallback } from 'react';
import { quantityAPI } from '../../services/api';
import { toast } from 'react-toastify';
import OpDropdown, { OP_LABELS } from './OpDropdown';

// Unit mapping for display
const UNIT_DISPLAY = {
  METER: 'Meter', KILOMETER: 'Kilometer', CENTIMETER: 'Centimeter', MILLIMETER: 'Millimeter',
  MILE: 'Mile', YARD: 'Yard', FOOT: 'Foot', INCH: 'Inch',
  KILOGRAM: 'Kilogram', GRAM: 'Gram', MILLIGRAM: 'Milligram', POUND: 'Pound', OUNCE: 'Ounce',
  LITER: 'Liter', MILLILITER: 'Milliliter', GALLON: 'Gallon', QUART: 'Quart', PINT: 'Pint',
  CELSIUS: 'Celsius', FAHRENHEIT: 'Fahrenheit', KELVIN: 'Kelvin'
};

const UNITS_BY_TYPE = {
  length: ['METER', 'KILOMETER', 'CENTIMETER', 'MILLIMETER', 'MILE', 'YARD', 'FOOT', 'INCH'],
  weight: ['KILOGRAM', 'GRAM', 'MILLIGRAM', 'POUND', 'OUNCE'],
  volume: ['LITER', 'MILLILITER', 'GALLON', 'QUART', 'PINT'],
  temperature: ['CELSIUS', 'FAHRENHEIT', 'KELVIN']
};

const TYPE_MAP = {
  length: 'LENGTH',
  weight: 'WEIGHT',
  volume: 'VOLUME',
  temperature: 'TEMPERATURE'
};

export default function InputPanel({ measureType, action }) {
  const units = UNITS_BY_TYPE[measureType] || UNITS_BY_TYPE.length;
  const [fromVal, setFromVal] = useState('1');
  const [toVal, setToVal] = useState('');
  const [fromUnit, setFromUnit] = useState(units[0]);
  const [toUnit, setToUnit] = useState(units[1] || units[0]);
  const [op, setOp] = useState('+');
  const [result, setResult] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultKey, setResultKey] = useState(0);

  // ✅ Check if arithmetic is allowed for current measurement type
  const isArithmeticAllowed = measureType !== 'temperature';

  useEffect(() => {
    const u = UNITS_BY_TYPE[measureType] || UNITS_BY_TYPE.length;
    setFromUnit(u[0]);
    setToUnit(u[1] || u[0]);
    setFromVal('1');
    setToVal('');
    setResult('');
    
    // ✅ If temperature is selected and action is arithmetic, show warning
    if (measureType === 'temperature' && action === 'arithmetic') {
      setResult('⚠️ Arithmetic operations are not supported for Temperature measurements');
      setIsError(true);
      setResultKey(k => k + 1);
    }
  }, [measureType, action]);

  const calculate = useCallback(async () => {
    const fv = parseFloat(fromVal);
    
    if (isNaN(fv)) {
      setResult('Enter a valid value');
      setIsError(true);
      return;
    }

    // ✅ Check temperature arithmetic restriction
    if (measureType === 'temperature' && action === 'arithmetic') {
      setResult('Arithmetic operations are not supported for Temperature measurements');
      setIsError(true);
      return;
    }

    setLoading(true);
    const type = TYPE_MAP[measureType];

    try {
      if (action === 'comparison') {
        const tv = parseFloat(toVal);
        if (isNaN(tv)) {
          setResult('Enter both values to compare');
          setIsError(true);
          setLoading(false);
          return;
        }
        const response = await quantityAPI.compare({
          value1: fv, unit1: fromUnit,
          value2: tv, unit2: toUnit,
          type: type
        });
        setResult(response.data.message);
        setIsError(false);
        setResultKey(k => k + 1);

      } else if (action === 'conversion') {
        const response = await quantityAPI.convert({
          value: fv, fromUnit: fromUnit, toUnit: toUnit, type: type
        });
        setToVal(response.data.value.toFixed(4));
        setResult(response.data.result);
        setIsError(false);
        setResultKey(k => k + 1);

      } else if (action === 'arithmetic') {
        const tv = parseFloat(toVal);
        if (isNaN(tv)) {
          setResult('Enter both values');
          setIsError(true);
          setLoading(false);
          return;
        }
        
        let response;
        switch (op) {
          case '+': response = await quantityAPI.add({ value1: fv, unit1: fromUnit, value2: tv, unit2: toUnit, type: type }); break;
          case '-': response = await quantityAPI.subtract({ value1: fv, unit1: fromUnit, value2: tv, unit2: toUnit, type: type }); break;
          case '×': response = await quantityAPI.multiply({ value1: fv, unit1: fromUnit, value2: tv, unit2: toUnit, type: type }); break;
          case '÷': response = await quantityAPI.divide({ value1: fv, unit1: fromUnit, value2: tv, unit2: toUnit, type: type }); break;
          default: return;
        }
        setResult(response.data.result);
        setIsError(false);
        setResultKey(k => k + 1);
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Calculation failed';
      setResult(message);
      setIsError(true);
      toast.error(message);
      setResultKey(k => k + 1);
    } finally {
      setLoading(false);
    }
  }, [fromVal, toVal, fromUnit, toUnit, op, action, measureType]);

  // Removed auto-calculation so that it only runs on button click

  const isConversion = action === 'conversion';
  const inputCls = 'font-raleway text-[32px] font-extrabold text-[#1a1a2e] dark:text-gray-100 border-0 border-b-2 border-gray-200 dark:border-white/20 outline-none bg-transparent w-full py-1 transition-all duration-300 focus:border-[#3b5bdb] dark:focus:border-[#4f73fd] max-sm:text-2xl placeholder-gray-300 dark:placeholder-gray-600';
  const selectCls = 'mt-0.5 px-3 py-2 border-[1.5px] border-gray-200 dark:border-white/10 rounded-lg font-nunito text-[14px] font-bold text-[#1a1a2e] dark:text-gray-200 bg-white dark:bg-[#1a2235] cursor-pointer outline-none transition-all duration-300 hover:border-gray-300 dark:hover:border-white/20 focus:border-[#3b5bdb] dark:focus:border-[#4f73fd] focus:shadow-[0_0_0_3px_rgba(59,91,219,0.10)] w-full';

  return (
    <div>
      <div className="flex items-end gap-5 flex-wrap max-sm:gap-2.5">
        <div className="flex-1 min-w-[140px] flex flex-col gap-2 relative">
          <p className="text-[11px] font-extrabold tracking-[2px] text-gray-500 dark:text-gray-400">
            {action === 'arithmetic' ? 'VALUE A' : 'FROM'}
          </p>
          <input type="number" value={fromVal} onChange={(e) => setFromVal(e.target.value)} className={inputCls} />
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className={selectCls}>
            {units.map((u) => <option key={u} value={u}>{UNIT_DISPLAY[u] || u}</option>)}
          </select>
        </div>

        <div className="flex items-center justify-center pb-7 min-w-[70px] relative max-sm:pb-4 text-[#3b5bdb] dark:text-[#4f73fd]">
          {action === 'arithmetic' && isArithmeticAllowed ? (
            <OpDropdown selected={op} onSelect={setOp} />
          ) : (
            <svg viewBox="0 0 40 20" width="40" fill="none" className="drop-shadow-sm">
              <line x1="4" y1="10" x2="28" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <polyline points="22,4 32,10 22,16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-[140px] flex flex-col gap-2 relative">
          <p className="text-[11px] font-extrabold tracking-[2px] text-gray-500 dark:text-gray-400">
            {action === 'arithmetic' ? 'VALUE B' : 'TO'}
          </p>
          <input 
            type="number" 
            value={toVal} 
            readOnly={isConversion} 
            onChange={(e) => !isConversion && setToVal(e.target.value)} 
            className={`${inputCls} ${isConversion ? 'opacity-60 cursor-default' : ''}`} 
            disabled={!isArithmeticAllowed && action === 'arithmetic'}
          />
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className={selectCls}>
            {units.map((u) => <option key={u} value={u}>{UNIT_DISPLAY[u] || u}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-5">
        <button 
          onClick={calculate} 
          disabled={loading || (measureType === 'temperature' && action === 'arithmetic')}
          className="w-full py-3.5 bg-gradient-to-r from-[#3b5bdb] to-[#1a1f6e] dark:from-[#4f73fd] dark:to-[#3b5bdb] text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg dark:hover:shadow-[#4f73fd]/20 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {loading ? 'Executing...' : 'Execute Calculation'}
        </button>

        <div key={resultKey} className="flex items-center gap-3.5 bg-gray-50/80 dark:bg-slate-900/50 rounded-xl px-6 py-4 border-l-[5px] border-[#3b5bdb] dark:border-[#4f73fd] shadow-inner transition-colors duration-300 min-h-[60px] animate-popIn">
          <span className={`text-[17px] font-extrabold tracking-wide max-sm:text-sm ${isError ? 'text-red-500 max-sm:text-xs' : 'text-[#3b5bdb] dark:text-[#4f73fd]'} transition-colors duration-300`}>
            {loading ? 'Calculating...' : (result || 'Awaiting execution...')}
          </span>
        </div>
      </div>
    </div>
  );
}