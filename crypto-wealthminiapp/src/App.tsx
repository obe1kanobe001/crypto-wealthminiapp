import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, TrendingUp, Wallet, User, Play, Download, Upload, Crown,
  ChevronRight, Shield, Zap, X, CheckCircle2
} from 'lucide-react';
import { useTelegram } from './hooks/useTelegram';
import { loadData, saveData, formatUSD, UserData } from './utils/storage';
import './App.css';

type Tab = 'home' | 'earn' | 'wallet' | 'profile';
type Modal = null | 'deposit' | 'withdraw' | 'play' | 'vip';

const BTC_CHANGE = 2.45;

export default function App() {
  const { user, isReady, haptic, showAlert, showConfirm } = useTelegram();
  const [data, setData] = useState<UserData>(loadData);
  const [tab, setTab] = useState<Tab>('home');
  const [modal, setModal] = useState<Modal>(null);
  const [amount, setAmount] = useState('');
  const [gameResult, setGameResult] = useState<{ win: boolean; profit: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const updateBalance = useCallback((delta: number) => {
    setData(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance + delta),
      totalEarned: delta > 0 ? prev.totalEarned + delta : prev.totalEarned,
      totalPlayed: prev.totalPlayed + (delta !== 0 ? 1 : 0),
    }));
  }, []);

  const handleDeposit = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      showAlert('Enter a valid amount');
      return;
    }
    haptic('success');
    updateBalance(val);
    setAmount('');
    setModal(null);
    showAlert(`Successfully deposited $${formatUSD(val)}`);
  };

  const handleWithdraw = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      showAlert('Enter a valid amount');
      return;
    }
    if (val > data.balance) {
      showAlert('Insufficient balance');
      return;
    }
    const ok = await showConfirm(`Withdraw $${formatUSD(val)} to your wallet?`);
    if (!ok) return;
    haptic('medium');
    updateBalance(-val);
    setAmount('');
    setModal(null);
    showAlert(`Withdrawal of $${formatUSD(val)} initiated`);
  };

  const playGame = () => {
    if (data.balance < 50) {
      showAlert('Minimum bet is $50');
      return;
    }
    setIsPlaying(true);
    setGameResult(null);
    haptic('light');

    setTimeout(() => {
      // Simple 48% win chance (house edge)
      const win = Math.random() < 0.48;
      const bet = 100;
      const profit = win ? bet * 1.9 : -bet;
      updateBalance(profit);
      setGameResult({ win, profit });
      setIsPlaying(false);
      haptic(win ? 'success' : 'error');
    }, 1800);
  };

  if (!isReady) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Loading CryptoWealth...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo-row">
          <div className="logo-icon">C</div>
          <div>
            <h1>CryptoWealth Bot</h1>
            <p className="subtitle">Ultimate Wealth Protocol</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="main">
        <AnimatePresence mode="wait">
          {tab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="page"
            >
              {/* Balance Card */}
              <div className="balance-card">
                <div className="balance-label">TOTAL BALANCE</div>
                <div className="balance-amount">
                  ${formatUSD(data.balance)}
                  <span className="currency">USD</span>
                </div>
                <div className="balance-coins">
                  <div className="coin btc">₿</div>
                  <div className="coin eth">Ξ</div>
                </div>
                <div className="secure-badge">
                  <Shield size={12} />
                  <span>Secure • Private • Verified</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="actions">
                <button className="action-btn play" onClick={() => { haptic('light'); setModal('play'); }}>
                  <div className="action-icon"><Play size={22} fill="currentColor" /></div>
                  <span className="action-title">Играть</span>
                  <span className="action-sub">Start Earning</span>
                </button>
                <button className="action-btn deposit" onClick={() => { haptic('light'); setModal('deposit'); setAmount(''); }}>
                  <div className="action-icon"><Download size={22} /></div>
                  <span className="action-title">Депозит</span>
                  <span className="action-sub">Deposit</span>
                </button>
                <button className="action-btn withdraw" onClick={() => { haptic('light'); setModal('withdraw'); setAmount(''); }}>
                  <div className="action-icon"><Upload size={22} /></div>
                  <span className="action-title">Withdraw</span>
                  <span className="action-sub">Withdraw Funds</span>
                </button>
                <button className="action-btn vip" onClick={() => { haptic('light'); setModal('vip'); }}>
                  <div className="action-icon"><Crown size={22} /></div>
                  <span className="action-title">VIP MODE</span>
                  <span className="action-sub">Elite Access</span>
                </button>
              </div>

              {/* Market Overview */}
              <div className="section-header">
                <span>MARKET OVERVIEW</span>
                <button className="view-all">View All <ChevronRight size={14} /></button>
              </div>
              <div className="market-card">
                <div className="market-left">
                  <div className="btc-icon">₿</div>
                  <div>
                    <div className="market-name">BTC</div>
                    <div className="market-full">Bitcoin</div>
                  </div>
                </div>
                <div className="market-right">
                  <div className="market-change positive">+{BTC_CHANGE}%</div>
                  <div className="market-period">24H CHANGE</div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="stats-row">
                <div className="stat">
                  <Zap size={16} color="#fbbf24" />
                  <span>Earned: ${formatUSD(data.totalEarned)}</span>
                </div>
                <div className="stat">
                  <TrendingUp size={16} color="#00d4ff" />
                  <span>Games: {data.totalPlayed}</span>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'earn' && (
            <motion.div key="earn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page">
              <h2 className="page-title">Earn Center</h2>
              <div className="earn-card">
                <h3>Daily Bonus</h3>
                <p>Claim free $25 every 24 hours</p>
                <button
                  className="primary-btn"
                  onClick={() => {
                    const today = new Date().toDateString();
                    if (data.lastDaily === today) {
                      showAlert('Already claimed today');
                      return;
                    }
                    haptic('success');
                    setData(prev => ({ ...prev, balance: prev.balance + 25, lastDaily: today, totalEarned: prev.totalEarned + 25 }));
                    showAlert('+$25 Daily Bonus claimed!');
                  }}
                >
                  Claim $25
                </button>
              </div>
              <div className="earn-card">
                <h3>Referral Program</h3>
                <p>Invite friends and earn 10% of their deposits</p>
                <button className="primary-btn outline" onClick={() => showAlert('Referral link copied!')}>
                  Copy Invite Link
                </button>
              </div>
            </motion.div>
          )}

          {tab === 'wallet' && (
            <motion.div key="wallet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page">
              <h2 className="page-title">Wallet</h2>
              <div className="wallet-balance">
                <span>Available</span>
                <strong>${formatUSD(data.balance)}</strong>
              </div>
              <div className="wallet-actions">
                <button className="primary-btn" onClick={() => setModal('deposit')}>Deposit</button>
                <button className="primary-btn outline" onClick={() => setModal('withdraw')}>Withdraw</button>
              </div>
              <div className="history-placeholder">
                <p>Transaction history will appear here</p>
              </div>
            </motion.div>
          )}

          {tab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page">
              <h2 className="page-title">Profile</h2>
              <div className="profile-card">
                <div className="avatar">{user?.first_name?.[0] || 'U'}</div>
                <div>
                  <div className="profile-name">{user?.first_name || 'User'} {user?.last_name || ''}</div>
                  <div className="profile-username">@{user?.username || 'guest'}</div>
                </div>
              </div>
              <div className="profile-stats">
                <div><span>VIP Level</span><strong>{data.vipLevel}</strong></div>
                <div><span>Total Earned</span><strong>${formatUSD(data.totalEarned)}</strong></div>
                <div><span>Games Played</span><strong>{data.totalPlayed}</strong></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <button className={tab === 'home' ? 'active' : ''} onClick={() => { haptic('light'); setTab('home'); }}>
          <Home size={22} />
          <span>Home</span>
        </button>
        <button className={tab === 'earn' ? 'active' : ''} onClick={() => { haptic('light'); setTab('earn'); }}>
          <TrendingUp size={22} />
          <span>Earn</span>
        </button>
        <button className="center-btn" onClick={() => { haptic('medium'); setTab('home'); }}>
          <div className="center-logo">C</div>
        </button>
        <button className={tab === 'wallet' ? 'active' : ''} onClick={() => { haptic('light'); setTab('wallet'); }}>
          <Wallet size={22} />
          <span>Wallet</span>
        </button>
        <button className={tab === 'profile' ? 'active' : ''} onClick={() => { haptic('light'); setTab('profile'); }}>
          <User size={22} />
          <span>Profile</span>
        </button>
      </nav>

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
          >
            <motion.div
              className="modal"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setModal(null)}><X size={20} /></button>

              {modal === 'deposit' && (
                <>
                  <h3>Deposit Funds</h3>
                  <p className="modal-desc">Add funds to your balance (demo mode)</p>
                  <input
                    type="number"
                    placeholder="Amount in USD"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="modal-input"
                    autoFocus
                  />
                  <div className="quick-amounts">
                    {[100, 500, 1000, 5000].map(v => (
                      <button key={v} onClick={() => setAmount(String(v))}>${v}</button>
                    ))}
                  </div>
                  <button className="primary-btn full" onClick={handleDeposit}>Confirm Deposit</button>
                </>
              )}

              {modal === 'withdraw' && (
                <>
                  <h3>Withdraw Funds</h3>
                  <p className="modal-desc">Available: ${formatUSD(data.balance)}</p>
                  <input
                    type="number"
                    placeholder="Amount in USD"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="modal-input"
                    autoFocus
                  />
                  <button className="primary-btn full" onClick={handleWithdraw}>Confirm Withdraw</button>
                </>
              )}

              {modal === 'play' && (
                <>
                  <h3>Quick Play</h3>
                  <p className="modal-desc">Bet $100 • 1.9x payout • 48% win chance</p>
                  <div className="game-area">
                    {isPlaying ? (
                      <div className="spinner large" />
                    ) : gameResult ? (
                      <div className={`result ${gameResult.win ? 'win' : 'lose'}`}>
                        {gameResult.win ? <CheckCircle2 size={48} /> : <X size={48} />}
                        <div className="result-text">
                          {gameResult.win ? 'You Won!' : 'You Lost'}
                        </div>
                        <div className="result-profit">
                          {gameResult.profit > 0 ? '+' : ''}${formatUSD(Math.abs(gameResult.profit))}
                        </div>
                      </div>
                    ) : (
                      <div className="game-ready">
                        <Play size={48} />
                        <p>Ready to play</p>
                      </div>
                    )}
                  </div>
                  <button
                    className="primary-btn full"
                    onClick={playGame}
                    disabled={isPlaying || data.balance < 50}
                  >
                    {isPlaying ? 'Playing...' : 'Play for $100'}
                  </button>
                </>
              )}

              {modal === 'vip' && (
                <>
                  <h3>VIP Elite Access</h3>
                  <p className="modal-desc">Current Level: {data.vipLevel}</p>
                  <div className="vip-benefits">
                    <div>✓ Higher daily bonuses</div>
                    <div>✓ Priority withdrawals</div>
                    <div>✓ Exclusive games</div>
                    <div>✓ Personal manager</div>
                  </div>
                  <button className="primary-btn full" onClick={() => showAlert('VIP upgrade coming soon!')}>
                    Upgrade VIP
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
