import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  PiggyBank, 
  Target, 
  DollarSign,
  RefreshCcw,
  ChevronDown,
  Info
} from 'lucide-react';
import { GlassCard, AnimatedButton } from '../ui';

const calculators = [
  { id: 'emi', name: 'EMI Calculator', icon: Calculator, color: 'purple' },
  { id: 'sip', name: 'SIP Calculator', icon: TrendingUp, color: 'green' },
  { id: 'savings', name: 'Savings Goal', icon: PiggyBank, color: 'blue' },
  { id: 'compound', name: 'Compound Interest', icon: Target, color: 'yellow' },
];

const EMICalculator = () => {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [time, setTime] = useState(12);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const calculate = useCallback(() => {
    const r = rate / (12 * 100);
    const n = time;
    const p = principal;
    
    const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmt = emiValue * n;
    const interest = totalAmt - p;
    
    setEmi(Math.round(emiValue));
    setTotalInterest(Math.round(interest));
    setTotalAmount(Math.round(totalAmt));
  }, [principal, rate, time]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <label className="text-sm text-gray-300">Loan Amount (₹)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300">Interest Rate (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Tenure (months)</label>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
              className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 text-white"
            />
          </div>
        </div>
      </div>

      <AnimatedButton onClick={calculate} className="w-full">
        Calculate EMI
      </AnimatedButton>

      {emi > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10"
        >
          <div className="text-center">
            <p className="text-xs text-gray-400">Monthly EMI</p>
            <p className="text-xl font-bold text-purple-400">₹{emi.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Total Interest</p>
            <p className="text-xl font-bold text-blue-400">₹{totalInterest.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Total Amount</p>
            <p className="text-xl font-bold text-green-400">₹{totalAmount.toLocaleString()}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [wealthGained, setWealthGained] = useState(0);

  const calculate = useCallback(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const p = monthlyInvestment;
    
    const amount = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = p * n;
    
    setTotalAmount(Math.round(amount));
    setTotalInvestment(Math.round(invested));
    setWealthGained(Math.round(amount - invested));
  }, [monthlyInvestment, rate, years]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <label className="text-sm text-gray-300">Monthly Investment (₹)</label>
          <input
            type="number"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300">Expected Return (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Duration (years)</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 text-white"
            />
          </div>
        </div>
      </div>

      <AnimatedButton variant="success" onClick={calculate} className="w-full">
        Calculate Returns
      </AnimatedButton>

      {totalAmount > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3 pt-4 border-t border-white/10"
        >
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Total Investment</span>
            <span className="font-bold">₹{totalInvestment.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Wealth Gained</span>
            <span className="font-bold text-green-400">₹{wealthGained.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-300">Total Value</span>
            <span className="font-bold text-purple-400">₹{totalAmount.toLocaleString()}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const SavingsGoalCalculator = () => {
  const [targetAmount, setTargetAmount] = useState(1000000);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(10000);
  const [rate, setRate] = useState(8);
  const [months, setMonths] = useState(0);

  const calculate = useCallback(() => {
    const r = rate / 100 / 12;
    let balance = currentSavings;
    let monthsNeeded = 0;
    
    while (balance < targetAmount && monthsNeeded < 600) {
      balance = balance * (1 + r) + monthlyContribution;
      monthsNeeded++;
    }
    
    setMonths(monthsNeeded);
  }, [targetAmount, currentSavings, monthlyContribution, rate]);

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <label className="text-sm text-gray-300">Target Amount (₹)</label>
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(Number(e.target.value))}
            className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 text-white"
          />
        </div>
        <div>
          <label className="text-sm text-gray-300">Current Savings (₹)</label>
          <input
            type="number"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(Number(e.target.value))}
            className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300">Monthly Savings (₹)</label>
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Interest Rate (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 text-white"
            />
          </div>
        </div>
      </div>

      <AnimatedButton variant="secondary" onClick={calculate} className="w-full">
        Calculate Time
      </AnimatedButton>

      {months > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center pt-4 border-t border-white/10"
        >
          <p className="text-gray-300">Time to reach your goal:</p>
          <p className="text-3xl font-bold text-pink-400 mt-2">
            {years > 0 && `${years} year${years > 1 ? 's' : ''} `}
            {remainingMonths > 0 && `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`}
          </p>
        </motion.div>
      )}
    </div>
  );
};

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [compoundFreq, setCompoundFreq] = useState(1);
  const [finalAmount, setFinalAmount] = useState(0);

  const calculate = useCallback(() => {
    const amount = principal * Math.pow(1 + rate / 100 / compoundFreq, compoundFreq * years);
    setFinalAmount(Math.round(amount));
  }, [principal, rate, years, compoundFreq]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <label className="text-sm text-gray-300">Principal Amount (₹)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300">Interest Rate (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Time (years)</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 text-white"
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-300">Compounding Frequency</label>
          <select
            value={compoundFreq}
            onChange={(e) => setCompoundFreq(Number(e.target.value))}
            className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 text-white"
          >
            <option value={1}>Annually</option>
            <option value={2}>Half-Yearly</option>
            <option value={4}>Quarterly</option>
            <option value={12}>Monthly</option>
          </select>
        </div>
      </div>

      <AnimatedButton variant="primary" onClick={calculate} className="w-full">
        Calculate
      </AnimatedButton>

      {finalAmount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10"
        >
          <div className="text-center">
            <p className="text-xs text-gray-400">Final Amount</p>
            <p className="text-xl font-bold text-yellow-400">₹{finalAmount.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Interest Earned</p>
            <p className="text-xl font-bold text-green-400">
              ₹{(finalAmount - principal).toLocaleString()}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const FinancialCalculator = ({ onClose }) => {
  const [activeCalc, setActiveCalc] = useState('emi');

  const renderCalculator = () => {
    switch (activeCalc) {
      case 'emi': return <EMICalculator />;
      case 'sip': return <SIPCalculator />;
      case 'savings': return <SavingsGoalCalculator />;
      case 'compound': return <CompoundInterestCalculator />;
      default: return <EMICalculator />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="w-full max-w-2xl bg-gray-900/90 rounded-2xl p-6 border border-white/10 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="text-purple-400" />
            Financial Calculators
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {calculators.map((calc) => (
            <button
              key={calc.id}
              onClick={() => setActiveCalc(calc.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                activeCalc === calc.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <calc.icon size={18} />
              {calc.name}
            </button>
          ))}
        </div>

        <GlassCard className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCalc}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderCalculator()}
            </motion.div>
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default FinancialCalculator;
