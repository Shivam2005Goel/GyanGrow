import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, DollarSign, Clock, BarChart3, 
  Activity, ArrowUp, ArrowDown, Play, Pause, RotateCcw,
  Wallet, Target, Zap, Info, ChevronRight, Minus
} from 'lucide-react';
import { AnimatedButton } from '../ui';
import { useTranslation } from '../../i18n';
import confetti from 'canvas-confetti';

// ==================== CANDLESTICK CHART COMPONENT ====================
const CandlestickChart = ({ data, width = 600, height = 300, showVolume = true }) => {
  const svgRef = useRef(null);
  const [hoveredCandle, setHoveredCandle] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  if (!data || data.length === 0) return null;

  const padding = { top: 20, right: 60, bottom: showVolume ? 80 : 40, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom - (showVolume ? 40 : 0);
  const volumeHeight = showVolume ? 40 : 0;

  const prices = data.flatMap(d => [d.high, d.low]);
  const maxPrice = Math.max(...prices) * 1.02;
  const minPrice = Math.min(...prices) * 0.98;
  const priceRange = maxPrice - minPrice;

  const maxVolume = Math.max(...data.map(d => d.volume));

  const scaleX = (index) => padding.left + (index / (data.length - 1)) * chartWidth;
  const scaleY = (price) => padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  const scaleVolume = (volume) => (volume / maxVolume) * volumeHeight;

  const handleMouseMove = (e) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const index = Math.round(((x - padding.left) / chartWidth) * (data.length - 1));
    if (index >= 0 && index < data.length) {
      setHoveredCandle(data[index]);
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  // Calculate moving averages
  const calculateMA = (period) => {
    return data.map((candle, index) => {
      if (index < period - 1) return null;
      const sum = data.slice(index - period + 1, index + 1).reduce((acc, d) => acc + d.close, 0);
      return { x: scaleX(index), y: scaleY(sum / period) };
    }).filter(Boolean);
  };

  const ma20 = calculateMA(20);
  const ma50 = calculateMA(50);

  return (
    <div className="relative">
      <svg 
        ref={svgRef}
        width={width} 
        height={height} 
        className="bg-black/20 rounded-xl"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredCandle(null)}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={padding.top + chartHeight * ratio}
              x2={width - padding.right}
              y2={padding.top + chartHeight * ratio}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="2,2"
            />
          </g>
        ))}

        {/* Volume bars */}
        {showVolume && data.map((candle, i) => {
          const x = scaleX(i);
          const barWidth = (chartWidth / data.length) * 0.6;
          const volHeight = scaleVolume(candle.volume);
          const isGreen = candle.close >= candle.open;
          return (
            <rect
              key={`vol-${i}`}
              x={x - barWidth / 2}
              y={padding.top + chartHeight + 10 + (volumeHeight - volHeight)}
              width={barWidth}
              height={volHeight}
              fill={isGreen ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}
            />
          );
        })}

        {/* MA20 Line */}
        {ma20.length > 1 && (
          <path
            d={`M ${ma20.map(p => `${p.x},${p.y}`).join(' L ')}`}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
            opacity="0.8"
          />
        )}

        {/* MA50 Line */}
        {ma50.length > 1 && (
          <path
            d={`M ${ma50.map(p => `${p.x},${p.y}`).join(' L ')}`}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            opacity="0.8"
          />
        )}

        {/* Candlesticks */}
        {data.map((candle, i) => {
          const x = scaleX(i);
          const barWidth = Math.max(2, (chartWidth / data.length) * 0.7);
          const isGreen = candle.close >= candle.open;
          const color = isGreen ? '#22c55e' : '#ef4444';
          const yOpen = scaleY(candle.open);
          const yClose = scaleY(candle.close);
          const yHigh = scaleY(candle.high);
          const yLow = scaleY(candle.low);
          const bodyHeight = Math.max(1, Math.abs(yClose - yOpen));
          const bodyY = Math.min(yOpen, yClose);

          return (
            <g key={i}>
              {/* Wick */}
              <line
                x1={x}
                y1={yHigh}
                x2={x}
                y2={yLow}
                stroke={color}
                strokeWidth="1"
              />
              {/* Body */}
              <rect
                x={x - barWidth / 2}
                y={bodyY}
                width={barWidth}
                height={bodyHeight}
                fill={color}
                rx={1}
              />
            </g>
          );
        })}

        {/* Price labels on right */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const price = maxPrice - priceRange * ratio;
          return (
            <text
              key={`price-${i}`}
              x={width - padding.right + 5}
              y={padding.top + chartHeight * ratio + 4}
              fill="rgba(255,255,255,0.5)"
              fontSize="10"
              textAnchor="start"
            >
              ₹{price.toFixed(0)}
            </text>
          );
        })}

        {/* Crosshair */}
        {hoveredCandle && (
          <>
            <line
              x1={mousePos.x}
              y1={padding.top}
              x2={mousePos.x}
              y2={padding.top + chartHeight}
              stroke="rgba(255,255,255,0.2)"
              strokeDasharray="4,4"
            />
          </>
        )}
      </svg>

      {/* Tooltip */}
      {hoveredCandle && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute pointer-events-none bg-black/90 backdrop-blur-sm p-3 rounded-lg border border-white/20 text-xs z-10"
          style={{
            left: mousePos.x > width / 2 ? '10px' : 'auto',
            right: mousePos.x <= width / 2 ? '10px' : 'auto',
            top: '10px',
          }}
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span className="text-gray-400">Open:</span>
            <span className="text-right font-mono">₹{hoveredCandle.open.toFixed(2)}</span>
            <span className="text-gray-400">High:</span>
            <span className="text-right font-mono text-green-400">₹{hoveredCandle.high.toFixed(2)}</span>
            <span className="text-gray-400">Low:</span>
            <span className="text-right font-mono text-red-400">₹{hoveredCandle.low.toFixed(2)}</span>
            <span className="text-gray-400">Close:</span>
            <span className={`text-right font-mono ${hoveredCandle.close >= hoveredCandle.open ? 'text-green-400' : 'text-red-400'}`}>
              ₹{hoveredCandle.close.toFixed(2)}
            </span>
            <span className="text-gray-400">Volume:</span>
            <span className="text-right font-mono">{hoveredCandle.volume.toLocaleString()}</span>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-sm" />
          <span className="text-gray-400">Bullish</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-sm" />
          <span className="text-gray-400">Bearish</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-0.5 bg-blue-500" />
          <span className="text-gray-400">MA20</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-0.5 bg-amber-500" />
          <span className="text-gray-400">MA50</span>
        </div>
      </div>
    </div>
  );
};

// ==================== TECHNICAL INDICATORS ====================
const TechnicalIndicators = ({ data }) => {
  const calculateRSI = (period = 14) => {
    if (data.length < period + 1) return null;
    const changes = data.slice(-period - 1).map((d, i, arr) => 
      i === 0 ? 0 : d.close - arr[i - 1].close
    ).slice(1);
    
    const gains = changes.filter(c => c > 0).reduce((a, b) => a + b, 0) / period;
    const losses = Math.abs(changes.filter(c => c < 0).reduce((a, b) => a + b, 0)) / period;
    
    if (losses === 0) return 100;
    const rs = gains / losses;
    return 100 - (100 / (1 + rs));
  };

  const calculateMACD = () => {
    if (data.length < 26) return null;
    const ema12 = data.slice(-12).reduce((a, b) => a + b.close, 0) / 12;
    const ema26 = data.slice(-26).reduce((a, b) => a + b.close, 0) / 26;
    return ema12 - ema26;
  };

  const rsi = calculateRSI();
  const macd = calculateMACD();
  const lastCandle = data[data.length - 1];
  const prevCandle = data[data.length - 2];
  const priceChange = prevCandle ? ((lastCandle.close - prevCandle.close) / prevCandle.close) * 100 : 0;

  return (
    <div className="grid grid-cols-4 gap-2 mt-4">
      <div className="bg-white/5 rounded-lg p-2 text-center">
        <p className="text-xs text-gray-400">RSI (14)</p>
        <p className={`text-lg font-bold ${rsi > 70 ? 'text-red-400' : rsi < 30 ? 'text-green-400' : 'text-blue-400'}`}>
          {rsi ? rsi.toFixed(1) : '-'}
        </p>
      </div>
      <div className="bg-white/5 rounded-lg p-2 text-center">
        <p className="text-xs text-gray-400">MACD</p>
        <p className={`text-lg font-bold ${macd > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {macd ? macd.toFixed(2) : '-'}
        </p>
      </div>
      <div className="bg-white/5 rounded-lg p-2 text-center">
        <p className="text-xs text-gray-400">Change</p>
        <p className={`text-lg font-bold flex items-center justify-center gap-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {priceChange >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          {Math.abs(priceChange).toFixed(2)}%
        </p>
      </div>
      <div className="bg-white/5 rounded-lg p-2 text-center">
        <p className="text-xs text-gray-400">Vol</p>
        <p className="text-lg font-bold text-purple-400">
          {(lastCandle.volume / 1000).toFixed(1)}K
        </p>
      </div>
    </div>
  );
};

// ==================== ORDER PANEL ====================
const OrderPanel = ({ currentPrice, onBuy, onSell, balance, holdings, isPlaying }) => {
  const [quantity, setQuantity] = useState(1);
  const { t } = useTranslation();

  const totalCost = currentPrice * quantity;
  const canBuy = balance >= totalCost;
  const canSell = holdings >= quantity;

  return (
    <div className="bg-white/5 rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-xs text-gray-400">Current Price</p>
          <p className="text-2xl font-bold font-mono">₹{currentPrice.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Holdings</p>
          <p className="text-xl font-bold text-blue-400">{holdings} shares</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-400 mb-1 block">Quantity</label>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
            disabled={!isPlaying}
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-center font-bold"
            disabled={!isPlaying}
          />
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
            disabled={!isPlaying}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onBuy(quantity)}
          disabled={!canBuy || !isPlaying}
          className="flex-1 py-3 bg-green-500/30 hover:bg-green-500/50 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-bold text-green-300 transition-colors flex items-center justify-center gap-2"
        >
          <TrendingUp size={18} />
          BUY ₹{totalCost.toFixed(0)}
        </button>
        <button
          onClick={() => onSell(quantity)}
          disabled={!canSell || !isPlaying}
          className="flex-1 py-3 bg-red-500/30 hover:bg-red-500/50 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-bold text-red-300 transition-colors flex items-center justify-center gap-2"
        >
          <TrendingDown size={18} />
          SELL
        </button>
      </div>
    </div>
  );
};

// ==================== MAIN REALTIME STOCK MARKET GAME ====================
const RealtimeStockMarket = ({ onWin, onClose }) => {
  const { t } = useTranslation();
  const [candles, setCandles] = useState([]);
  const [balance, setBalance] = useState(10000);
  const [holdings, setHoldings] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [gameDuration] = useState(180); // 3 minutes
  const [trades, setTrades] = useState([]);
  const [pnl, setPnl] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(100);
  const [stockName] = useState('TECHM');
  const [news, setNews] = useState('Market opening...');
  const [showTutorial, setShowTutorial] = useState(true);
  
  const intervalRef = useRef(null);
  const priceRef = useRef(100);

  // Generate initial candles
  useEffect(() => {
    const initialCandles = [];
    let price = 100;
    for (let i = 0; i < 50; i++) {
      const volatility = 0.02;
      const trend = Math.sin(i / 10) * 0.01;
      const change = (Math.random() - 0.5) * volatility + trend;
      const open = price;
      const close = price * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.floor(Math.random() * 10000) + 5000;
      
      initialCandles.push({
        time: i,
        open,
        high,
        low,
        close,
        volume
      });
      price = close;
    }
    setCandles(initialCandles);
    priceRef.current = price;
    setCurrentPrice(price);
  }, []);

  // Game loop
  useEffect(() => {
    if (isPlaying && gameTime < gameDuration) {
      intervalRef.current = setInterval(() => {
        setGameTime(prev => {
          if (prev >= gameDuration - 1) {
            setIsPlaying(false);
            endGame();
            return gameDuration;
          }
          return prev + 1;
        });

        // Generate new candle every 3 seconds
        if (gameTime % 3 === 0) {
          generateNewCandle();
        }
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, gameTime]);

  const generateNewCandle = () => {
    const lastClose = priceRef.current;
    const volatility = 0.015;
    const trend = Math.sin(gameTime / 20) * 0.005;
    const newsImpact = Math.random() > 0.9 ? (Math.random() - 0.5) * 0.05 : 0;
    
    const change = (Math.random() - 0.5) * volatility + trend + newsImpact;
    const open = lastClose;
    const close = lastClose * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.008);
    const low = Math.min(open, close) * (1 - Math.random() * 0.008);
    const volume = Math.floor(Math.random() * 15000) + 8000;

    const newCandle = {
      time: candles.length,
      open,
      high,
      low,
      close,
      volume
    };

    setCandles(prev => [...prev.slice(-99), newCandle]);
    priceRef.current = close;
    setCurrentPrice(close);

    // Update P&L
    const unrealizedPnl = holdings * (close - (trades.find(t => t.type === 'buy')?.price || close));
    setPnl(unrealizedPnl);

    // Random news
    if (Math.random() > 0.95) {
      const newsItems = [
        'Q3 earnings beat expectations!',
        'New product launch announced',
        'Market volatility increasing',
        'Analyst upgrades rating to Buy',
        'Sector rotation detected',
        'Institutional buying detected',
      ];
      setNews(newsItems[Math.floor(Math.random() * newsItems.length)]);
    }
  };

  const handleBuy = (quantity) => {
    const cost = currentPrice * quantity;
    if (balance >= cost) {
      setBalance(prev => prev - cost);
      setHoldings(prev => prev + quantity);
      setTrades(prev => [...prev, { type: 'buy', quantity, price: currentPrice, time: gameTime }]);
    }
  };

  const handleSell = (quantity) => {
    if (holdings >= quantity) {
      const proceeds = currentPrice * quantity;
      setBalance(prev => prev + proceeds);
      setHoldings(prev => prev - quantity);
      setTrades(prev => [...prev, { type: 'sell', quantity, price: currentPrice, time: gameTime }]);
    }
  };

  const endGame = () => {
    const finalValue = balance + holdings * currentPrice;
    const totalPnl = finalValue - 10000;
    const reward = { 
      coins: Math.max(100, Math.floor(totalPnl / 10) + 500), 
      xp: Math.floor(totalPnl > 0 ? 200 : 100),
      profit: totalPnl
    };
    onWin?.(reward);
    confetti({ particleCount: totalPnl > 0 ? 200 : 50 });
  };

  const reset = () => {
    setIsPlaying(false);
    setGameTime(0);
    setBalance(10000);
    setHoldings(0);
    setTrades([]);
    setPnl(0);
    // Regenerate candles
    const initialCandles = [];
    let price = 100;
    for (let i = 0; i < 50; i++) {
      const change = (Math.random() - 0.5) * 0.02;
      const open = price;
      const close = price * (1 + change);
      initialCandles.push({
        time: i,
        open,
        high: Math.max(open, close) * 1.005,
        low: Math.min(open, close) * 0.995,
        close,
        volume: Math.floor(Math.random() * 10000) + 5000
      });
      price = close;
    }
    setCandles(initialCandles);
    priceRef.current = price;
    setCurrentPrice(price);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalValue = balance + holdings * currentPrice;
  const totalPnl = totalValue - 10000;
  const pnlPercent = (totalPnl / 10000) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="text-purple-400" />
                Stock Market Simulator
              </h3>
              <div className="space-y-3 text-sm text-gray-300 mb-6">
                <p>📈 <strong>Goal:</strong> Maximize your profits in 3 minutes</p>
                <p>💰 <strong>Start:</strong> ₹10,000 cash</p>
                <p>🕯️ <strong>Candlesticks:</strong> Green = Up, Red = Down</p>
                <p>📊 <strong>Indicators:</strong> MA20 (blue), MA50 (orange)</p>
                <p>⚡ <strong>Strategy:</strong> Buy low, sell high!</p>
              </div>
              <AnimatedButton variant="primary" onClick={() => setShowTutorial(false)} className="w-full">
                Start Trading
              </AnimatedButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={12} /> Time
          </p>
          <p className={`text-xl font-bold font-mono ${gameTime > gameDuration - 30 ? 'text-red-400' : ''}`}>
            {formatTime(gameDuration - gameTime)}
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Wallet size={12} /> Balance
          </p>
          <p className="text-xl font-bold font-mono text-green-400">₹{balance.toFixed(0)}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Target size={12} /> Holdings
          </p>
          <p className="text-xl font-bold font-mono text-blue-400">{holdings}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Activity size={12} /> P&L
          </p>
          <p className={`text-xl font-bold font-mono ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalPnl >= 0 ? '+' : ''}₹{totalPnl.toFixed(0)}
            <span className="text-xs ml-1">({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(1)}%)</span>
          </p>
        </div>
      </div>

      {/* Stock Header */}
      <div className="flex justify-between items-center mb-4 p-3 bg-white/5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center">
            <TrendingUp size={20} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold">{stockName}</h3>
            <p className="text-xs text-gray-400">Tech Mahindra Ltd</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold font-mono">₹{currentPrice.toFixed(2)}</p>
          <p className={`text-xs flex items-center justify-end gap-1 ${candles.length > 1 && candles[candles.length - 1].close >= candles[candles.length - 1].open ? 'text-green-400' : 'text-red-400'}`}>
            {candles.length > 1 && candles[candles.length - 1].close >= candles[candles.length - 1].open ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {candles.length > 1 ? Math.abs(((candles[candles.length - 1].close - candles[candles.length - 1].open) / candles[candles.length - 1].open) * 100).toFixed(2) : 0}%
          </p>
        </div>
      </div>

      {/* News Ticker */}
      <div className="mb-4 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-sm text-center">
          <span className="text-yellow-400 font-bold">📰 NEWS:</span> {news}
        </p>
      </div>

      {/* Chart */}
      <div className="mb-4 overflow-x-auto">
        <CandlestickChart data={candles} width={580} height={280} />
      </div>

      {/* Technical Indicators */}
      <TechnicalIndicators data={candles} />

      {/* Order Panel */}
      <div className="mt-4">
        <OrderPanel 
          currentPrice={currentPrice}
          onBuy={handleBuy}
          onSell={handleSell}
          balance={balance}
          holdings={holdings}
          isPlaying={isPlaying}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2 mt-4">
        {!isPlaying && gameTime === 0 && (
          <AnimatedButton variant="primary" onClick={() => setIsPlaying(true)} className="flex-1">
            <Play size={18} /> Start Trading
          </AnimatedButton>
        )}
        {isPlaying && (
          <AnimatedButton variant="outline" onClick={() => setIsPlaying(false)} className="flex-1">
            <Pause size={18} /> Pause
          </AnimatedButton>
        )}
        {!isPlaying && gameTime > 0 && gameTime < gameDuration && (
          <AnimatedButton variant="primary" onClick={() => setIsPlaying(true)} className="flex-1">
            <Play size={18} /> Resume
          </AnimatedButton>
        )}
        <AnimatedButton variant="outline" onClick={reset}>
          <RotateCcw size={18} />
        </AnimatedButton>
        <AnimatedButton variant="outline" onClick={onClose}>
          Exit
        </AnimatedButton>
      </div>

      {/* Trade History */}
      {trades.length > 0 && (
        <div className="mt-4 max-h-32 overflow-y-auto">
          <h4 className="text-sm font-bold mb-2 text-gray-400">Recent Trades</h4>
          <div className="space-y-1">
            {trades.slice(-5).reverse().map((trade, i) => (
              <div key={i} className="flex justify-between items-center p-2 bg-white/5 rounded text-xs">
                <span className={trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                  {trade.type.toUpperCase()} {trade.quantity} @ ₹{trade.price.toFixed(2)}
                </span>
                <span className="text-gray-500">{formatTime(trade.time)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RealtimeStockMarket;
