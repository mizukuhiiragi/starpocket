import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Coins, 
  Wallet, 
  Play, 
  CheckCircle2, 
  ExternalLink, 
  Share2, 
  RefreshCw, 
  Copy, 
  ShieldCheck, 
  Sparkles, 
  Smartphone,
  Info,
  Clock,
  Layers,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  Star,
  QrCode,
  X,
  Landmark,
  TrendingUp,
  Lock,
  Unlock,
  ChevronRight,
  DollarSign,
  ArrowRightLeft,
  ArrowDownUp,
  Repeat,
  Globe,
  Gift,
  Palette
} from 'lucide-react';
import { Keypair, StrKey, Horizon, Networks, TransactionBuilder, Operation, Asset, Memo } from '@stellar/stellar-sdk';
import { translations } from './i18n.js';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const stellarServer = new Horizon.Server(HORIZON_URL);

// StarPocket Custom Brand Logo
function StarPocketLogo({ size = 44 }) {
  return (
    <div 
      className="relative flex items-center justify-center rounded-2xl bg-gradient-to-b from-[#1b223c] to-[#0d1222] border border-amber-400/40 shadow-lg shadow-amber-500/20 overflow-hidden shrink-0"
      style={{ width: size, height: size }}
    >
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-7 h-7 bg-amber-400/25 rounded-full blur-md pointer-events-none" />
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-1">
        <defs>
          <linearGradient id="starGrad" x1="24" y1="3" x2="24" y2="21" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="35%" stopColor="#fde047" />
            <stop offset="80%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="pocketBodyGrad" x1="24" y1="18" x2="24" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e2746" />
            <stop offset="100%" stopColor="#0c1020" />
          </linearGradient>
          <linearGradient id="rimGrad" x1="11" y1="20" x2="37" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <filter id="starBloom" x="10" y="0" width="28" height="26" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="1.2" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        <path d="M19 4L21 11" stroke="#fde047" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1 2" opacity="0.6" />
        <path d="M29 5L27 12" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1 2" opacity="0.5" />
        <circle cx="34" cy="9" r="1" fill="#fde047" opacity="0.8" />
        <circle cx="14" cy="14" r="0.8" fill="#38bdf8" opacity="0.8" />

        <g filter="url(#starBloom)">
          <path
            d="M24 3.5 L26.4 10.2 L33.5 10.6 L27.9 14.8 L29.9 21.5 L24 17.5 L18.1 21.5 L20.1 14.8 L14.5 10.6 L21.6 10.2 Z"
            fill="url(#starGrad)"
            stroke="#ffffff"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
        </g>

        <path
          d="M12 20 C12 20 17 21.5 24 21.5 C31 21.5 36 20 36 20 V30 C36 37 30.5 42 24 42 C17.5 42 12 37 12 30 Z"
          fill="url(#pocketBodyGrad)"
          stroke="#38bdf8"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M11.5 20 C17 22 31 22 36.5 20" stroke="url(#rimGrad)" strokeWidth="2.2" strokeLinecap="round" />
        <path
          d="M15 24.5 C18 25.5 30 25.5 33 24.5 V29.5 C33 34.5 29 38.5 24 38.5 C19 38.5 15 34.5 15 29.5 Z"
          stroke="#38bdf8"
          strokeWidth="1"
          strokeDasharray="2 1.5"
          strokeOpacity="0.45"
          fill="none"
        />
        <path
          d="M24 28L25 30.5L27.5 31L25.5 32.5L26 35L24 33.7L22 35L22.5 32.5L20.5 31L23 30.5Z"
          fill="#fbbf24"
          fillOpacity="0.75"
        />
      </svg>
    </div>
  );
}

// 4 Distinct Themed Skins
const SKINS = {
  cosmos: {
    id: 'cosmos',
    name: '深宇宙ネイビー',
    nameEn: 'Deep Cosmos',
    icon: '🌌',
    previewGradient: 'from-[#1b223c] to-[#0d1222]',
    previewBorder: 'border-amber-400',
    bgClass: 'bg-[#080b14]',
    glow1: 'bg-amber-500/15',
    glow2: 'bg-cyan-500/15',
    headerText: 'from-amber-300 via-yellow-200 to-white',
    pillActive: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-md shadow-amber-400/20',
    accentBorder: 'border-amber-400/40',
    accentBadge: 'bg-amber-400/15 border-amber-400/40 text-amber-300'
  },
  cyber: {
    id: 'cyber',
    name: 'サイバー天文台',
    nameEn: 'Cyber Observatory',
    icon: '⚡',
    previewGradient: 'from-[#070914] via-[#141228] to-[#080718]',
    previewBorder: 'border-cyan-400',
    bgClass: 'bg-[#050711]',
    glow1: 'bg-cyan-500/25',
    glow2: 'bg-fuchsia-500/25',
    headerText: 'from-cyan-300 via-fuchsia-300 to-pink-400',
    pillActive: 'bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-slate-950 shadow-md shadow-cyan-500/30',
    accentBorder: 'border-cyan-400/50',
    accentBadge: 'bg-cyan-400/15 border-cyan-400/40 text-cyan-300'
  },
  sakura: {
    id: 'sakura',
    name: '夜桜星雲',
    nameEn: 'Sakura Nebula',
    icon: '🌸',
    previewGradient: 'from-[#241032] via-[#1a0c24] to-[#12081c]',
    previewBorder: 'border-pink-400',
    bgClass: 'bg-[#12081c]',
    glow1: 'bg-pink-500/20',
    glow2: 'bg-purple-500/20',
    headerText: 'from-pink-300 via-rose-200 to-amber-200',
    pillActive: 'bg-gradient-to-r from-pink-400 to-rose-300 text-slate-950 shadow-md shadow-pink-500/30',
    accentBorder: 'border-pink-400/50',
    accentBadge: 'bg-pink-400/15 border-pink-400/40 text-pink-300'
  },
  retro: {
    id: 'retro',
    name: 'レトロ8ビット',
    nameEn: '8-Bit Dot Game',
    icon: '👾',
    previewGradient: 'from-[#1a281c] via-[#132015] to-[#0f1710]',
    previewBorder: 'border-emerald-400',
    bgClass: 'bg-[#0f1710]',
    glow1: 'bg-emerald-500/20',
    glow2: 'bg-lime-500/20',
    headerText: 'from-emerald-300 via-green-200 to-lime-300',
    pillActive: 'bg-gradient-to-r from-emerald-400 to-lime-300 text-slate-950 shadow-md shadow-emerald-500/30 font-mono',
    accentBorder: 'border-emerald-400/50',
    accentBadge: 'bg-emerald-400/15 border-emerald-400/40 text-emerald-300 font-mono'
  }
};

export default function App() {
  const [tgUser, setTgUser] = useState(null);
  const [activeTab, setActiveTab] = useState('wallet'); // 'wallet' | 'swap' | 'vault' | 'reward'
  
  // Active Skin Theme
  const [currentSkin, setCurrentSkin] = useState(() => {
    return localStorage.getItem('starpocket_skin') || 'cosmos';
  });
  const [showSkinModal, setShowSkinModal] = useState(false);

  const skin = SKINS[currentSkin] || SKINS.cosmos;

  const handleSelectSkin = (skinId) => {
    setCurrentSkin(skinId);
    localStorage.setItem('starpocket_skin', skinId);
    setShowSkinModal(false);
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
  };
  
  // Default is strictly English (en) for global compliance.
  // Only switches if the user manually toggles and saves it in localStorage.
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('starpocket_lang') || 'en';
  });

  const t = (key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'ja' ? 'en' : 'ja';
    setLang(nextLang);
    localStorage.setItem('starpocket_lang', nextLang);
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  const [walletAddress, setWalletAddress] = useState('');
  const [walletSecret, setWalletSecret] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  
  // Balances & Multi-asset
  const [balance, setBalance] = useState('0.0000');
  const [assetList, setAssetList] = useState([]);
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);
  
  // Star Swap State
  const [swapFrom, setSwapFrom] = useState('XLM');
  const [swapTo, setSwapTo] = useState('USDC');
  const [swapAmount, setSwapAmount] = useState('');
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapResult, setSwapResult] = useState(null);
  const [swapError, setSwapError] = useState('');
  const [swapBonusInfo, setSwapBonusInfo] = useState({
    monthlyPoolTotalXlm: '125.4000',
    monthlyPoolTotalUsd: '16.93',
    totalMonthlyVolumeUsd: '12540.00',
    userVolumeUsd: '0.00',
    userSharePercent: '0.00',
    userEstBonusXlm: '0.0000',
    daysRemaining: 5
  });

  // Star Vault State
  const [vaultInfo, setVaultInfo] = useState({
    yXLM: '0.0000',
    yUSDC: '0.0000',
    totalEarnedXLM: '0.000000',
    totalEarnedUSDC: '0.000000',
    apyXLM: '5.0%',
    apyUSDC: '5.0%',
    dailyEstXLM: '0.00000',
    dailyEstUSDC: '0.00000'
  });
  const [showVaultDepositModal, setShowVaultDepositModal] = useState(false);
  const [showVaultWithdrawModal, setShowVaultWithdrawModal] = useState(false);
  const [vaultActionAsset, setVaultActionAsset] = useState('XLM');
  const [vaultAmount, setVaultAmount] = useState('');
  const [vaultLoading, setVaultLoading] = useState(false);
  const [vaultMsg, setVaultMsg] = useState('');

  // Daily Quota & Cooldown State (DECISIONS.md)
  const [userStatus, setUserStatus] = useState({
    maxDaily: 5,
    claimsToday: 0,
    remainingToday: 5,
    cooldownRemainingSec: 0,
    canClaim: true
  });
  const [cooldownSec, setCooldownSec] = useState(0);

  const [faucetInfo, setFaucetInfo] = useState(null);
  const [claimHistory, setClaimHistory] = useState([]);
  
  // Modals
  const [showAdModal, setShowAdModal] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const [adCompleted, setAdCompleted] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  
  // Send Form
  const [sendDest, setSendDest] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState('');
  
  // Claiming State
  const [claiming, setClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(null);
  const [claimError, setClaimError] = useState('');
  const [copied, setCopied] = useState(false);

  // Gamification: Star Points & 31-Day Login Calendar
  const [gamification, setGamification] = useState({
    starPoints: 50,
    streak: 1,
    checkedInToday: false,
    checkinDays: [new Date().getUTCDate()],
    currentDayOfMonth: new Date().getUTCDate(),
    perks: [],
    hasCompleted31: false
  });
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [redeemLoading, setRedeemLoading] = useState(null);
  const [gamificationNotice, setGamificationNotice] = useState(null);

  // Initialize Telegram WebApp & Wallet
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe?.user) {
        setTgUser(tg.initDataUnsafe.user);
      }
    }

    const storedSecret = localStorage.getItem('starpocket_stellar_secret') || localStorage.getItem('lumendrop_stellar_secret');
    const storedPub = localStorage.getItem('starpocket_stellar_pub') || localStorage.getItem('lumendrop_stellar_pub');

    if (storedSecret && storedPub) {
      setWalletAddress(storedPub);
      setWalletSecret(storedSecret);
    } else {
      const pair = Keypair.random();
      const pub = pair.publicKey();
      const sec = pair.secret();
      localStorage.setItem('starpocket_stellar_pub', pub);
      localStorage.setItem('starpocket_stellar_secret', sec);
      setWalletAddress(pub);
      setWalletSecret(sec);
    }

    fetchFaucetInfo();
  }, []);

  const activeAddress = useCustom && customAddress ? customAddress : walletAddress;

  useEffect(() => {
    if (activeAddress && StrKey.isValidEd25519PublicKey(activeAddress)) {
      fetchAll(activeAddress);
    }
  }, [activeAddress]);

  const fetchAll = (addr) => {
    fetchBalance(addr);
    fetchUserStatus(addr);
    fetchVaultInfo(addr);
    fetchSwapBonus(addr);
    fetchGamification(addr);
  };

  const fetchGamification = async (addr) => {
    if (!addr) return;
    try {
      const res = await fetch(`/api/gamification/${addr}`);
      if (res.ok) {
        const data = await res.json();
        setGamification(data);
      }
    } catch (err) {
      console.log('Gamification fetch fallback:', err);
    }
  };

  // Daily Streak Check-in
  const handleCheckin = async () => {
    if (!activeAddress || gamification.checkedInToday || checkinLoading) return;
    setCheckinLoading(true);
    try {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
      const res = await fetch('/api/gamification/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: activeAddress })
      });
      const data = await res.json();
      if (data.success) {
        setGamification(data);
        setGamificationNotice(data.message || '+10 SP ⭐');
        setTimeout(() => setGamificationNotice(null), 4000);
      }
    } catch (err) {
      console.error('Checkin error:', err);
    } finally {
      setCheckinLoading(false);
    }
  };

  // Redeem Perk
  const handleRedeemPerk = async (perkId) => {
    if (!activeAddress || redeemLoading) return;
    setRedeemLoading(perkId);
    try {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
      }
      const res = await fetch('/api/gamification/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: activeAddress, perkId })
      });
      const data = await res.json();
      if (data.success) {
        setGamification(data);
        if (perkId === 'cyber_skin') {
          handleSelectSkin('cyber');
        }
        setGamificationNotice(data.message);
        setTimeout(() => setGamificationNotice(null), 4000);
      } else {
        alert(data.error || '交換に失敗しました');
      }
    } catch (err) {
      console.error('Redeem error:', err);
    } finally {
      setRedeemLoading(null);
    }
  };

  // Cooldown local tick
  useEffect(() => {
    let interval = null;
    if (cooldownSec > 0) {
      interval = setInterval(() => {
        setCooldownSec(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownSec]);

  const fetchFaucetInfo = async () => {
    try {
      const res = await fetch('/api/faucet');
      if (res.ok) {
        const data = await res.json();
        setFaucetInfo(data);
      }
    } catch (e) {
      console.error('Faucet fetch failed:', e);
    }
  };

  const fetchUserStatus = async (addr) => {
    try {
      const res = await fetch(`/api/user-status/${addr}`);
      if (res.ok) {
        const data = await res.json();
        setUserStatus(data);
        setCooldownSec(data.cooldownRemainingSec || 0);
      }
    } catch (e) {
      console.error('User status fetch failed:', e);
    }
  };

  const fetchVaultInfo = async (addr) => {
    try {
      const res = await fetch(`/api/vault/${addr}`);
      if (res.ok) {
        const data = await res.json();
        setVaultInfo(data);
      }
    } catch (e) {
      console.error('Vault fetch failed:', e);
    }
  };

  const fetchSwapBonus = async (addr) => {
    try {
      const url = addr ? `/api/swap/bonus/${addr}` : '/api/swap/bonus';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSwapBonusInfo(data);
      }
    } catch (e) {
      console.error('Swap bonus fetch failed:', e);
    }
  };

  const fetchBalance = async (addr) => {
    setLoadingBalance(true);
    try {
      const res = await fetch(`/api/balance/${addr}`);
      if (res.ok) {
        const data = await res.json();
        setBalance(parseFloat(data.balance).toFixed(4));
        setAssetList(data.assets || []);
        setIsNewAccount(!data.exists);
      }
    } catch (e) {
      console.error('Balance fetch failed:', e);
    } finally {
      setLoadingBalance(false);
    }
  };

  // Swap calculation helper
  const getEstimatedSwapOutput = (from, to, inAmt) => {
    const num = parseFloat(inAmt);
    if (isNaN(num) || num <= 0) return '0.0000';
    let rate = 1.0;
    if (from === 'XLM' && to === 'USDC') rate = 0.135;
    else if (from === 'USDC' && to === 'XLM') rate = 1 / 0.135;
    else if (from === 'XLM' && to === 'yXLM') rate = 0.98;
    else if (from === 'yXLM' && to === 'XLM') rate = 1 / 0.98;
    else if (from === 'USDC' && to === 'yUSDC') rate = 0.98;
    else if (from === 'yUSDC' && to === 'USDC') rate = 1 / 0.98;
    const net = num * (1 - 0.003); // 0.3% protocol fee
    return (net * rate).toFixed(4);
  };

  // Execute Swap
  const handleExecuteSwap = async (e) => {
    e.preventDefault();
    const amt = parseFloat(swapAmount);
    if (isNaN(amt) || amt <= 0) {
      setSwapError(lang === 'ja' ? '交換数量を入力してください' : 'Please enter a valid swap amount');
      return;
    }
    setSwapLoading(true);
    setSwapError('');
    setSwapResult(null);

    try {
      const res = await fetch('/api/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: activeAddress,
          fromAsset: swapFrom,
          toAsset: swapTo,
          amount: amt
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Swap failed');

      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }

      setSwapResult(data);
      setSwapAmount('');
      if (data.starPoints) {
        setGamification(prev => ({ ...prev, starPoints: data.starPoints }));
      }
      fetchAll(activeAddress);
    } catch (err) {
      setSwapError(err.message);
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
      }
    } finally {
      setSwapLoading(false);
    }
  };

  const handleFlipSwap = () => {
    const temp = swapFrom;
    setSwapFrom(swapTo);
    setSwapTo(temp);
  };

  // Star Vault Deposit
  const handleVaultDeposit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(vaultAmount);
    if (isNaN(amt) || amt <= 0) {
      setVaultMsg(lang === 'ja' ? '数量を入力してください' : 'Please enter an amount');
      return;
    }
    setVaultLoading(true);
    setVaultMsg('');
    try {
      const res = await fetch('/api/vault/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: activeAddress,
          asset: vaultActionAsset,
          amount: amt
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Deposit failed');

      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }

      setVaultMsg('✨ ' + data.message);
      setVaultAmount('');
      fetchAll(activeAddress);
      setTimeout(() => {
        setShowVaultDepositModal(false);
        setVaultMsg('');
      }, 1800);
    } catch (err) {
      setVaultMsg('❌ ' + err.message);
    } finally {
      setVaultLoading(false);
    }
  };

  // Star Vault Withdraw
  const handleVaultWithdraw = async (e) => {
    e.preventDefault();
    const amt = parseFloat(vaultAmount);
    if (isNaN(amt) || amt <= 0) {
      setVaultMsg(lang === 'ja' ? '数量を入力してください' : 'Please enter an amount');
      return;
    }
    setVaultLoading(true);
    setVaultMsg('');
    try {
      const res = await fetch('/api/vault/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: activeAddress,
          asset: vaultActionAsset === 'XLM' ? 'yXLM' : 'yUSDC',
          amount: amt
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Withdrawal failed');

      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }

      setVaultMsg('✨ ' + data.message);
      setVaultAmount('');
      fetchAll(activeAddress);
      setTimeout(() => {
        setShowVaultWithdrawModal(false);
        setVaultMsg('');
      }, 1800);
    } catch (err) {
      setVaultMsg('❌ ' + err.message);
    } finally {
      setVaultLoading(false);
    }
  };

  // Trigger Ad Modal / AdsGram
  const handleStartDailyBonus = () => {
    if (userStatus.remainingToday <= 0) {
      setClaimError(t('allClaimedToday'));
      return;
    }
    if (cooldownSec > 0) {
      setClaimError(lang === 'ja' ? 'クールダウン中です。次の星までお待ちください。' : 'Cooldown active. Please wait until the next drop.');
      return;
    }

    setClaimError('');
    setClaimSuccess(null);

    if (window.Adsgram && window.Adsgram.init) {
      try {
        const AdController = window.Adsgram.init({ blockId: "int-0000" });
        AdController.show().then((result) => {
          if (result.done) executeClaim();
        }).catch((err) => {
          openSimulatedModal();
        });
        return;
      } catch (e) {
        openSimulatedModal();
      }
    }

    openSimulatedModal();
  };

  const openSimulatedModal = () => {
    setAdTimer(5);
    setAdCompleted(false);
    setShowAdModal(true);

    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
  };

  useEffect(() => {
    let timer = null;
    if (showAdModal && adTimer > 0) {
      timer = setTimeout(() => setAdTimer(adTimer - 1), 1000);
    } else if (showAdModal && adTimer === 0) {
      setAdCompleted(true);
    }
    return () => clearTimeout(timer);
  }, [showAdModal, adTimer]);

  const executeClaim = async () => {
    setClaiming(true);
    setClaimError('');

    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: activeAddress,
          adWatched: true
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Claim failed');

      setClaimSuccess(data);
      setShowAdModal(false);

      if (data.status) {
        setUserStatus(data.status);
        setCooldownSec(data.status.cooldownRemainingSec || 0);
      }
      if (data.starPoints) {
        setGamification(prev => ({ ...prev, starPoints: data.starPoints }));
      }

      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }

      setClaimHistory(prev => [
        {
          id: Date.now(),
          amount: data.amount,
          txHash: data.txHash,
          time: new Date().toLocaleTimeString(),
          url: data.explorerUrl
        },
        ...prev
      ]);

      setTimeout(() => {
        fetchAll(activeAddress);
      }, 1200);

    } catch (err) {
      setClaimError(err.message);
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
      }
    } finally {
      setClaiming(false);
    }
  };

  // Direct On-Chain Send (Non-custodial Wallet feature)
  const handleSendXLM = async (e) => {
    e.preventDefault();
    if (!walletSecret) {
      alert(lang === 'ja' ? '秘密鍵がありません' : 'Secret key missing');
      return;
    }
    if (!StrKey.isValidEd25519PublicKey(sendDest)) {
      alert(lang === 'ja' ? '宛先アドレスが正しくありません' : 'Invalid destination Stellar address');
      return;
    }
    const amt = parseFloat(sendAmount);
    if (isNaN(amt) || amt <= 0) {
      alert(lang === 'ja' ? '送金額を入力してください' : 'Please enter an amount to send');
      return;
    }

    setSending(true);
    setSendMsg('');

    try {
      const senderKeypair = Keypair.fromSecret(walletSecret);
      const senderAcc = await stellarServer.loadAccount(senderKeypair.publicKey());
      
      const tx = new TransactionBuilder(senderAcc, {
        fee: '100',
        networkPassphrase: Networks.TESTNET
      })
      .addOperation(Operation.payment({
        destination: sendDest,
        asset: Asset.native(),
        amount: amt.toFixed(7)
      }))
      .addMemo(Memo.text('StarPocket Transfer'))
      .setTimeout(30)
      .build();

      tx.sign(senderKeypair);
      const res = await stellarServer.submitTransaction(tx);

      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }

      setSendMsg(lang === 'ja' ? `✅ 送金成功！TX: ${res.hash.slice(0, 8)}...` : `✅ Sent successfully! TX: ${res.hash.slice(0, 8)}...`);
      setSendDest('');
      setSendAmount('');
      fetchBalance(activeAddress);

      setTimeout(() => {
        setShowSendModal(false);
        setSendMsg('');
      }, 2000);
    } catch (err) {
      setSendMsg(`❌ ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  const copyAddress = () => {
    if (!activeAddress) return;
    navigator.clipboard.writeText(activeAddress);
    setCopied(true);
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareInvite = () => {
    const text = encodeURIComponent(
      lang === 'ja' 
        ? '⭐【StarPocket】自分専用の星のスマートウォレット＆星の金庫！年利5%で星を増やしてスワップもできる！'
        : '⭐ Check out StarPocket! The cute smart wallet & 5% APY yield vault on Telegram. Claim free daily XLM and swap with zero hassle!'
    );
    const url = encodeURIComponent('https://t.me/share/url?url=https://t.me/starpocket_bot&text=' + text);
    window.open(url, '_blank');
  };

  const formatCooldown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen ${skin.bgClass} text-slate-100 flex flex-col justify-between max-w-md mx-auto relative px-4 py-4 font-sans select-none transition-colors duration-500`}>
      
      {/* Background ambient light */}
      <div className={`fixed top-[-80px] left-[-80px] w-72 h-72 ${skin.glow1} rounded-full blur-3xl pointer-events-none transition-all duration-700`} />
      <div className={`fixed bottom-[-80px] right-[-80px] w-72 h-72 ${skin.glow2} rounded-full blur-3xl pointer-events-none transition-all duration-700`} />

      {/* TOP HEADER */}
      <header className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <StarPocketLogo size={38} />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className={`font-extrabold text-lg tracking-tight bg-gradient-to-r ${skin.headerText} bg-clip-text text-transparent`}>
                {t('appName')}
              </h1>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {t('testnetBadge')}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">{t('appSubtitle')}</p>
          </div>
        </div>

        {/* Right Header items: Star Points, Theme Palette, Language Toggle & Telegram User Badge */}
        <div className="flex items-center gap-1.5">
          {/* Star Points Badge (Click to open Rewards / Calendar) */}
          <button
            onClick={() => {
              setActiveTab('reward');
              if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
              }
            }}
            className="flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 hover:from-amber-500/30 hover:to-yellow-500/20 border border-amber-400/40 px-2 py-1 rounded-full text-[10px] font-mono font-black text-amber-300 shadow-sm shadow-amber-400/20 transition cursor-pointer active:scale-95"
            title="Star Points (SP) / 星ポイント"
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 animate-pulse" />
            <span>{gamification.starPoints} SP</span>
          </button>

          {/* Theme Palette Switcher */}
          <button
            onClick={() => {
              setShowSkinModal(true);
              if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
              }
            }}
            className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 hover:border-amber-400 px-2 py-1 rounded-full text-[10px] font-bold text-slate-300 hover:text-white transition cursor-pointer"
            title="Theme Skins / テーマ着せ替え"
          >
            <Palette className="w-3 h-3 text-amber-400" />
            <span>{skin.icon}</span>
          </button>

          {/* Quick Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 hover:border-cyan-400 px-2 py-1 rounded-full text-[10px] font-bold text-slate-300 hover:text-white transition cursor-pointer"
            title="Switch Language / 言語切替"
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>{lang === 'ja' ? 'JA' : 'EN'}</span>
          </button>

          {/* Telegram User Badge */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-full text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium truncate max-w-[80px]">
              {tgUser ? `@${tgUser.username || tgUser.first_name}` : t('guestUser')}
            </span>
          </div>
        </div>
      </header>

      {/* NAVIGATION PILL TABS (4 TABS) */}
      <div className="grid grid-cols-4 gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 my-2.5">
        <button
          onClick={() => setActiveTab('wallet')}
          className={`py-2 rounded-lg text-[11px] font-bold transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'wallet' 
              ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-md shadow-amber-400/20' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>{t('tabPocket')}</span>
        </button>

        <button
          onClick={() => setActiveTab('swap')}
          className={`py-2 rounded-lg text-[11px] font-bold transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'swap' 
              ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-md shadow-emerald-400/20' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>{t('tabSwap')}</span>
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={`py-2 rounded-lg text-[11px] font-bold transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'vault' 
              ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-950 shadow-md shadow-cyan-400/20' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>{t('tabVault')}</span>
        </button>

        <button
          onClick={() => setActiveTab('reward')}
          className={`py-2 rounded-lg text-[11px] font-bold transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'reward' 
              ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-slate-950 shadow-md shadow-purple-400/20' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>{t('tabDailyDrop')}</span>
        </button>
      </div>

      {/* MAIN BODY CONTENT */}
      <main className="space-y-3.5 my-auto pb-3">
        
        {/* ========================================================= */}
        {/* 👛 TAB 1: WALLET & MULTI-ASSET PORTFOLIO */}
        {/* ========================================================= */}
        {activeTab === 'wallet' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* MAIN BALANCE CARD */}
            <div className="glass-panel rounded-2xl p-5 border border-amber-400/25 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <Coins className="w-4 h-4 text-amber-400" />
                  {t('totalBalance')}
                </span>
                <button 
                  onClick={() => fetchAll(activeAddress)} 
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingBalance ? 'animate-spin text-cyan-400' : ''}`} />
                  {loadingBalance ? t('updating') : t('refresh')}
                </button>
              </div>

              <div className="flex items-baseline gap-2 my-2">
                <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
                  {balance}
                </span>
                <span className="text-xl font-black bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
                  XLM
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>≈ ${(parseFloat(balance) * 0.135).toFixed(2)} USD</span>
                <span>•</span>
                <span className="text-emerald-400">{t('nearZeroFee')}</span>
              </div>

              {/* ACTION BUTTONS (Send / Receive / Swap) */}
              <div className="grid grid-cols-3 gap-1.5 mt-4 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => setShowReceiveModal(true)}
                  className="py-2 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-1 text-[11px] font-bold text-slate-200 transition cursor-pointer"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5 text-cyan-400" />
                  {t('btnReceive')}
                </button>
                <button
                  onClick={() => setShowSendModal(true)}
                  className="py-2 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-1 text-[11px] font-bold text-slate-200 transition cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  {t('btnSend')}
                </button>
                <button
                  onClick={() => setActiveTab('swap')}
                  className="py-2 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-300 transition cursor-pointer"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
                  {t('btnSwap')}
                </button>
              </div>
            </div>

            {/* MULTI-ASSET PORTFOLIO LIST */}
            <div className="glass-panel rounded-2xl p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2.5 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  {t('portfolioAssets')}
                </span>
                <span className="text-[10px] text-slate-400">{t('stellarDex')}</span>
              </div>

              <div className="space-y-2">
                {/* 1. XLM (Native) */}
                <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-xs">
                      XLM
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white">Stellar Lumens</p>
                      <p className="text-[9px] text-slate-400">{t('nativeAssetDesc')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-xs text-white">{balance}</p>
                    <p className="text-[9px] text-slate-500">≈ ${(parseFloat(balance) * 0.135).toFixed(2)}</p>
                  </div>
                </div>

                {/* 2. USDC (Circle) */}
                <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-xs">
                      $
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white">USD Coin (USDC)</p>
                      <p className="text-[9px] text-slate-400">{t('usdcDesc')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-xs text-white">0.0000</p>
                    <p className="text-[9px] text-slate-500">≈ $0.00</p>
                  </div>
                </div>

                {/* 3. yXLM (UltraStellar Yield XLM) */}
                <div className="bg-gradient-to-r from-amber-950/20 to-slate-900/80 border border-amber-500/30 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-sm">
                      y★
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-xs text-amber-200">yXLM (Yield Lumens)</p>
                        <span className="text-[8px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">5.0% APY</span>
                      </div>
                      <p className="text-[9px] text-slate-400">{t('yXlmDesc')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-xs text-amber-300">{vaultInfo.yXLM}</p>
                    <p className="text-[9px] text-emerald-400 font-mono">{t('compoundingDaily')}</p>
                  </div>
                </div>

                {/* 4. yUSDC (UltraStellar Yield USDC) */}
                <div className="bg-gradient-to-r from-cyan-950/20 to-slate-900/80 border border-cyan-500/30 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-sm">
                      y$
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-xs text-cyan-200">yUSDC (Yield Dollar)</p>
                        <span className="text-[8px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.2 rounded font-bold">5.0% APY</span>
                      </div>
                      <p className="text-[9px] text-slate-400">{t('yUsdcDesc')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-xs text-cyan-300">{vaultInfo.yUSDC}</p>
                    <p className="text-[9px] text-emerald-400 font-mono">{t('compoundingDaily')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WALLET ADDRESS & SETTINGS */}
            <div className="glass-panel rounded-xl p-3 border border-slate-800/90 text-xs flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <p className="text-[9px] text-slate-400">{t('connectedAddress')}</p>
                <p className="font-mono text-[11px] text-slate-300 truncate">
                  {activeAddress ? `${activeAddress.slice(0, 10)}...${activeAddress.slice(-8)}` : 'Generating...'}
                </p>
              </div>
              <button
                onClick={copyAddress}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                {copied ? t('btnCopied') : t('btnCopy')}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 🔄 TAB 2: STAR SWAP (星の交換所) */}
        {/* ========================================================= */}
        {activeTab === 'swap' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="bg-gradient-to-br from-[#11192e] via-[#0d1424] to-[#080d18] rounded-2xl p-5 border border-emerald-400/30 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-black text-sm text-white">{t('swapTitle')}</h2>
                    <p className="text-[10px] text-emerald-300">{t('swapSubtitle')}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                  {t('swapFeeBadge')}
                </span>
              </div>

              {/* 🎁 MONTHLY TRADER DIVIDEND POOL (三方よし 1:1:1) */}
              <div className="bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-900 border border-amber-500/30 rounded-xl p-3 mb-3 shadow-lg">
                <div className="flex items-center justify-between pb-2 border-b border-amber-500/20 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-xs text-amber-200">{t('monthlyBonusTitle')}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    ⏳ {swapBonusInfo.daysRemaining} {t('daysLeftLabel')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-950/60 rounded-lg p-1.5 border border-slate-800">
                    <p className="text-[9px] text-slate-400 uppercase font-semibold">{t('poolTotalLabel')}</p>
                    <p className="font-extrabold text-[12px] text-amber-300 font-mono mt-0.5">
                      {swapBonusInfo.monthlyPoolTotalXlm} <span className="text-[9px] text-slate-400">XLM</span>
                    </p>
                    <p className="text-[9px] text-slate-500">~${swapBonusInfo.monthlyPoolTotalUsd}</p>
                  </div>
                  <div className="bg-slate-950/60 rounded-lg p-1.5 border border-slate-800">
                    <p className="text-[9px] text-slate-400 uppercase font-semibold">{t('yourVolumeLabel')}</p>
                    <p className="font-extrabold text-[12px] text-white font-mono mt-0.5">
                      ${swapBonusInfo.userVolumeUsd}
                    </p>
                    <p className="text-[9px] text-emerald-400">{swapBonusInfo.userSharePercent}% share</p>
                  </div>
                  <div className="bg-slate-950/60 rounded-lg p-1.5 border border-amber-500/30 bg-amber-500/5">
                    <p className="text-[9px] text-amber-300 uppercase font-semibold">{t('yourEstBonusLabel')}</p>
                    <p className="font-extrabold text-[12px] text-amber-400 font-mono mt-0.5">
                      ~{swapBonusInfo.userEstBonusXlm} <span className="text-[9px]">XLM</span>
                    </p>
                    <p className="text-[9px] text-amber-300/70">auto-claim</p>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 text-[9px] text-purple-300 font-semibold">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    {t('feeSplitBadge')}: 0.10% 💰 | 0.10% 🎁 | 0.10% 🌟
                  </span>
                  <span className="text-[9px] text-slate-400 text-right truncate ml-2">
                    {t('flywheelBanner')}
                  </span>
                </div>
              </div>

              <form onSubmit={handleExecuteSwap} className="space-y-3">
                {/* FROM BOX */}
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>{t('youPay')}</span>
                    <span>{t('balPrefix')}: {swapFrom === 'XLM' ? balance : '0.00'} {swapFrom}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={swapAmount}
                      onChange={(e) => setSwapAmount(e.target.value)}
                      required
                      className="w-full bg-transparent text-xl font-bold font-mono text-white outline-none"
                    />
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSwapAmount(swapFrom === 'XLM' ? Math.max(0, parseFloat(balance) - 0.05).toFixed(2) : '10')}
                        className="text-[10px] px-2 py-1 rounded bg-slate-800 text-amber-400 font-bold cursor-pointer"
                      >
                        {t('btnMax')}
                      </button>
                      <select
                        value={swapFrom}
                        onChange={(e) => setSwapFrom(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                      >
                        <option value="XLM">XLM</option>
                        <option value="USDC">USDC</option>
                        <option value="yXLM">yXLM</option>
                        <option value="yUSDC">yUSDC</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* FLIP BUTTON */}
                <div className="flex justify-center -my-1.5 relative z-10">
                  <button
                    type="button"
                    onClick={handleFlipSwap}
                    className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 hover:border-emerald-400 text-slate-300 hover:text-white flex items-center justify-center transition shadow-md cursor-pointer"
                  >
                    <ArrowDownUp className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* TO BOX */}
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>{t('youReceive')}</span>
                    <span className="text-emerald-400">{t('gasDesc')}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      {getEstimatedSwapOutput(swapFrom, swapTo, swapAmount)}
                    </span>
                    <select
                      value={swapTo}
                      onChange={(e) => setSwapTo(e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-lg px-2.5 py-1.5 outline-none shrink-0 cursor-pointer"
                    >
                      <option value="USDC">USDC</option>
                      <option value="XLM">XLM</option>
                      <option value="yXLM">yXLM</option>
                      <option value="yUSDC">yUSDC</option>
                    </select>
                  </div>
                </div>

                {/* SWAP RATE INFO */}
                <div className="text-[11px] text-slate-400 px-1 flex items-center justify-between font-mono">
                  <span>{t('rateLabel')}:</span>
                  <span>1 {swapFrom} ≈ {(parseFloat(getEstimatedSwapOutput(swapFrom, swapTo, '1')) / 0.997).toFixed(4)} {swapTo}</span>
                </div>

                {swapResult && (
                  <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 text-xs text-emerald-300">
                    <p className="font-bold">{t('swapSuccessTitle')}</p>
                    <p className="text-[11px] text-slate-300 mt-0.5">{swapResult.message}</p>
                  </div>
                )}

                {swapError && (
                  <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-2.5 text-xs text-rose-300">
                    {swapError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={swapLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  {swapLoading ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <ArrowRightLeft className="w-4 h-4 text-slate-950" />}
                  {swapLoading ? t('btnRoutingSwap') : `${t('btnExecuteSwap')} ${swapFrom} → ${swapTo}`}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 🏦 TAB 3: STAR VAULT */}
        {/* ========================================================= */}
        {activeTab === 'vault' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* VAULT HERO CARD */}
            <div className="bg-gradient-to-br from-[#121c38] via-[#0d162a] to-[#080d1a] rounded-2xl p-5 border border-cyan-400/30 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-black text-sm text-white">{t('vaultTitle')}</h2>
                    <p className="text-[10px] text-cyan-300">{t('vaultSubtitle')}</p>
                  </div>
                </div>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {t('apyBadge')}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 my-2.5 leading-relaxed">
                {t('vaultHeroDesc')}
              </p>

              {/* VAULT STATS GRID */}
              <div className="grid grid-cols-2 gap-2 my-3">
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" />
                    {t('inVaultYxlm')}
                  </p>
                  <p className="text-xl font-extrabold text-amber-300 font-mono mt-1">
                    {vaultInfo.yXLM}
                  </p>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                    {t('estDailyYield')}: +{vaultInfo.dailyEstXLM} XLM/d
                  </p>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-cyan-400" />
                    {t('inVaultYusdc')}
                  </p>
                  <p className="text-xl font-extrabold text-cyan-300 font-mono mt-1">
                    {vaultInfo.yUSDC}
                  </p>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                    {t('estDailyYield')}: +{vaultInfo.dailyEstUSDC} USDC/d
                  </p>
                </div>
              </div>

              {/* TOTAL EARNED BANNER */}
              <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-2.5 flex items-center justify-between text-xs mb-3">
                <span className="text-slate-300 text-[11px] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  {t('totalAccruedYield')}
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  +{vaultInfo.totalEarnedXLM} XLM
                </span>
              </div>

              {/* DEPOSIT / WITHDRAW ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setVaultActionAsset('XLM');
                    setShowVaultDepositModal(true);
                  }}
                  className="py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  {t('btnDepositVault')}
                </button>

                <button
                  onClick={() => {
                    setVaultActionAsset('XLM');
                    setShowVaultWithdrawModal(true);
                  }}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5 text-amber-400" />
                  {t('btnWithdrawPocket')}
                </button>
              </div>
            </div>

            {/* HOW STAR VAULT WORKS EXPLANATION */}
            <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-xs space-y-2">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {t('howVaultWorksTitle')}
              </h3>
              <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>{t('howVaultPoint1')}</li>
                <li>{t('howVaultPoint2')}</li>
                <li>{t('howVaultPoint3')}</li>
              </ul>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ⭐ TAB 4: DAILY STAR DROP, LOGIN CALENDAR & STAR POINTS */}
        {/* ========================================================= */}
        {activeTab === 'reward' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Gamification Notification Toast */}
            {gamificationNotice && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-amber-500/25 border border-amber-400/50 shadow-lg shadow-amber-400/20 text-center text-xs font-black text-amber-200 animate-in fade-in slide-in-from-top-2">
                ✨ {gamificationNotice}
              </div>
            )}

            {/* ⭐ 1. 31-DAY STAR STREAK CALENDAR */}
            <div className="bg-gradient-to-b from-[#1b223c] to-[#0d1222] rounded-2xl p-4 border border-amber-400/40 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <h2 className="font-extrabold text-sm text-white">{t('loginCalendarTitle')}</h2>
                </div>
                <div className="flex items-center gap-1 bg-amber-400/15 border border-amber-400/40 px-2.5 py-0.5 rounded-full text-[11px] font-black text-amber-300 font-mono shadow-sm shadow-amber-400/15">
                  <span>🔥 {gamification.streak} {t('streakDaysLabel')}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
                {t('loginCalendarSubtitle')}
              </p>

              {/* Check-in CTA Button */}
              <div className="mb-3.5">
                {gamification.checkedInToday ? (
                  <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{t('checkedInBadge')}</span>
                  </div>
                ) : (
                  <button
                    onClick={handleCheckin}
                    disabled={checkinLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-[0.98] transition cursor-pointer"
                  >
                    <Star className="w-4 h-4 fill-slate-950" />
                    <span>{checkinLoading ? '...' : t('checkInBtn')}</span>
                  </button>
                )}
              </div>

              {/* 31-Day Constellation Calendar Grid */}
              <div className="bg-slate-950/70 rounded-xl p-2.5 border border-slate-800/80 mb-3">
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isChecked = gamification.checkinDays?.includes(day);
                    const isToday = day === gamification.currentDayOfMonth;
                    const isMilestone = day === 7 || day === 14 || day === 21 || day === 31;
                    return (
                      <div
                        key={day}
                        className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-mono transition-all duration-200 ${
                          isChecked 
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/60 shadow-sm shadow-amber-400/25 font-bold'
                            : isToday
                              ? 'bg-cyan-500/20 text-cyan-200 border-2 border-cyan-400 animate-pulse font-extrabold'
                              : 'bg-slate-900/60 text-slate-500 border border-slate-800/60 hover:border-slate-700'
                        }`}
                      >
                        {isChecked ? (
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ) : (
                          <span>{day}</span>
                        )}
                        {isMilestone && (
                          <span className="absolute -top-1 -right-1 text-[8px] leading-none">
                            {day === 31 ? '🎫' : day === 14 ? '🍭' : '⭐'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 31-Day Select Ticket Highlight Banner */}
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-cyan-500/15 border border-amber-400/30 flex items-start gap-2.5">
                <Gift className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div className="text-[10px] leading-relaxed">
                  <div className="font-extrabold text-amber-200">{t('ticket31Banner')}</div>
                  <div className="text-slate-400 mt-0.5">{t('ticket31Desc')}</div>
                </div>
              </div>
            </div>

            {/* ⭐ 2. STAR POINTS PERKS EXCHANGE (特典交換所) */}
            <div className="bg-gradient-to-b from-[#181c30] to-[#0f1220] rounded-2xl p-4 border border-cyan-500/30 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-extrabold text-xs text-white">{t('perksTitle')}</h3>
                </div>
                <span className="text-[11px] font-black text-amber-300 font-mono bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                  {gamification.starPoints} SP
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mb-3">{t('perksSubtitle')}</p>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'vault_boost', name: t('perkVaultBoost'), desc: t('perkVaultBoostDesc'), cost: 200, icon: '🏦' },
                  { id: 'pet_candy', name: t('perkPetCandy'), desc: t('perkPetCandyDesc'), cost: 80, icon: '🍭' },
                  { id: 'swap_discount', name: t('perkSwapDiscount'), desc: t('perkSwapDiscountDesc'), cost: 150, icon: '🔄' },
                  { id: 'cyber_skin', name: t('perkCyberSkin'), desc: t('perkCyberSkinDesc'), cost: 300, icon: '🎨' },
                ].map((item) => {
                  const unlocked = gamification.perks?.includes(item.id);
                  const canAfford = (gamification.starPoints || 0) >= item.cost;
                  return (
                    <div key={item.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-sm">{item.icon}</span>
                          <span className="text-[11px] font-extrabold text-white truncate">{item.name}</span>
                        </div>
                        <p className="text-[9px] text-slate-400 leading-tight mb-2 line-clamp-2">{item.desc}</p>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                        <span className="text-[10px] font-black font-mono text-amber-300">{item.cost} SP</span>
                        {unlocked ? (
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            {t('redeemedBadge')}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRedeemPerk(item.id)}
                            disabled={!canAfford || redeemLoading === item.id}
                            className={`text-[9px] font-bold px-2 py-0.5 rounded transition ${
                              canAfford 
                                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 active:scale-95 cursor-pointer' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {redeemLoading === item.id ? '...' : canAfford ? t('btnRedeem') : t('insufficientSp')}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ⭐ 3. DAILY DROP SECTION */}
            <div className="bg-gradient-to-b from-[#181c30] to-[#0f1220] rounded-2xl p-5 border border-amber-500/30 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <h2 className="font-extrabold text-sm text-white">{t('dailyDropTitle')}</h2>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono">
                  {userStatus.remainingToday} / {userStatus.maxDaily} {t('dropsLeft')}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                {t('dailyDropDesc')}
              </p>

              {/* 5-STAR STAMINA GAUGE */}
              <div className="flex items-center justify-center gap-2.5 py-2 mb-4 bg-slate-950/40 rounded-xl border border-slate-800/60">
                {[1, 2, 3, 4, 5].map((starIdx) => {
                  const isAvailable = starIdx <= userStatus.remainingToday;
                  return (
                    <div 
                      key={starIdx} 
                      className={`flex flex-col items-center transition-all duration-300 ${isAvailable ? 'scale-100 opacity-100' : 'scale-90 opacity-30'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isAvailable 
                          ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40 shadow-sm shadow-amber-400/30' 
                          : 'bg-slate-800 text-slate-600 border border-slate-700'
                      }`}>
                        <Star className={`w-4 h-4 ${isAvailable ? 'fill-amber-400' : ''}`} />
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 font-mono">#{starIdx}</span>
                    </div>
                  );
                })}
              </div>

              {/* REWARD ACTION OR COOLDOWN */}
              {userStatus.remainingToday <= 0 ? (
                <div className="py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-amber-300 font-medium">
                  {t('allClaimedToday')}
                </div>
              ) : cooldownSec > 0 ? (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 flex items-center justify-center gap-2 text-xs font-mono font-bold cursor-not-allowed"
                  >
                    <Clock className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span>{t('nextDropIn')} {formatCooldown(cooldownSec)}</span>
                  </button>
                  <p className="text-[10px] text-center text-slate-500">
                    {t('cooldownNote')}
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleStartDailyBonus}
                  disabled={claiming}
                  className="w-full py-3.5 px-4 rounded-xl cta-button flex items-center justify-center gap-2 text-sm shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
                  <span>{t('btnClaimDrop')}</span>
                </button>
              )}
            </div>

            {/* VIRAL SHARE BUTTON */}
            <div className="flex gap-2">
              <button
                onClick={handleShareInvite}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-center gap-2 text-xs font-bold text-slate-200 transition cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                {t('btnInviteFriends')}
              </button>
              <a
                href="https://t.me/starpocket_bot"
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 transition"
              >
                <Smartphone className="w-4 h-4 text-purple-400" />
              </a>
            </div>

            {/* RECENT CLAIM TRANSACTIONS LIST */}
            {claimHistory.length > 0 && (
              <div className="pt-1">
                <h3 className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {t('recentDropHistory')}
                </h3>
                <div className="space-y-1.5">
                  {claimHistory.map(item => (
                    <div key={item.id} className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-400 font-mono">+{item.amount} XLM</span>
                        <span className="text-[10px] text-slate-500">{item.time}</span>
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                      >
                        {item.txHash.slice(0, 6)}...
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CLAIM SUCCESS NOTIFICATION */}
        {claimSuccess && (
          <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-4 animate-in fade-in slide-in-from-bottom duration-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-emerald-300">{t('landedInPocket')}</p>
                <p className="text-slate-300">{claimSuccess.message}</p>
                <a
                  href={claimSuccess.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-400 font-medium underline text-[11px] pt-1"
                >
                  {t('viewOnExplorer')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* CLAIM ERROR NOTIFICATION */}
        {claimError && (
          <div className="bg-rose-950/40 border border-rose-500/50 rounded-xl p-3 text-xs text-rose-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{claimError}</span>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="pt-2 border-t border-slate-800/80 text-center text-[9px] text-slate-500 space-y-1">
        <p>{t('footerNote1')}</p>
        <p>{t('footerNote2')}</p>
      </footer>

      {/* ========================================================= */}
      {/* 📥 RECEIVE MODAL */}
      {/* ========================================================= */}
      {showReceiveModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121627] border border-cyan-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <ArrowDownLeft className="w-4 h-4 text-cyan-400" />
                {t('modalReceiveTitle')}
              </h3>
              <button onClick={() => setShowReceiveModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl flex items-center justify-center mx-auto my-3 w-40 h-40">
              <QrCode className="w-32 h-32 text-slate-900" />
            </div>

            <p className="text-[11px] text-slate-400 text-center mb-2">
              {t('modalReceiveDesc')}
            </p>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 break-all font-mono text-[11px] text-slate-300 text-center mb-4">
              {activeAddress}
            </div>

            <button
              onClick={copyAddress}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? t('btnCopied') : t('btnCopy')}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 📤 SEND MODAL */}
      {/* ========================================================= */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121627] border border-amber-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
                {t('modalSendTitle')}
              </h3>
              <button onClick={() => setShowSendModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendXLM} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">{t('recipientLabel')}</label>
                <input
                  type="text"
                  placeholder="G..."
                  value={sendDest}
                  onChange={(e) => setSendDest(e.target.value.trim())}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>{t('amountLabel')}</span>
                  <span>{t('availableLabel')}: {balance} XLM</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="0.05"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:border-amber-400 outline-none pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setSendAmount(Math.max(0, parseFloat(balance) - 0.0001).toFixed(4))}
                    className="absolute right-2 top-2 text-[10px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded font-bold cursor-pointer"
                  >
                    {t('btnMax')}
                  </button>
                </div>
              </div>

              {sendMsg && (
                <div className="text-xs p-2 rounded bg-slate-900 border border-slate-800 text-center font-mono">
                  {sendMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-xl cta-button text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
              >
                {sending ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Send className="w-4 h-4 text-slate-950" />}
                {sending ? t('btnSigningSend') : t('btnConfirmSend')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 🏦 STAR VAULT DEPOSIT MODAL */}
      {/* ========================================================= */}
      {showVaultDepositModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121627] border border-cyan-400/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-cyan-400" />
                {t('modalDepositTitle')}
              </h3>
              <button onClick={() => setShowVaultDepositModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVaultDeposit} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">{t('assetToDeposit')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVaultActionAsset('XLM')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      vaultActionAsset === 'XLM' 
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    XLM → yXLM
                  </button>
                  <button
                    type="button"
                    onClick={() => setVaultActionAsset('USDC')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      vaultActionAsset === 'USDC' 
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    USDC → yUSDC
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>{t('depositAmount')}</span>
                  <span>{t('availableLabel')}: {vaultActionAsset === 'XLM' ? balance : '0.00'}</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.5"
                    value={vaultAmount}
                    onChange={(e) => setVaultAmount(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:border-cyan-400 outline-none pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setVaultAmount(vaultActionAsset === 'XLM' ? Math.max(0, parseFloat(balance) - 0.1).toFixed(2) : '1.0')}
                    className="absolute right-2 top-2 text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded font-bold cursor-pointer"
                  >
                    {t('btnMax')}
                  </button>
                </div>
              </div>

              <div className="bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-800/40 text-[11px] text-cyan-300 space-y-1">
                <div className="flex justify-between">
                  <span>{t('annualYieldLabel')}</span>
                  <span className="font-bold">5.0%</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('projectedDailyReturn')}</span>
                  <span className="font-mono font-bold">+{((parseFloat(vaultAmount) || 0) * 0.05 / 365).toFixed(5)} {vaultActionAsset}/d</span>
                </div>
              </div>

              {vaultMsg && (
                <div className="text-xs p-2 rounded bg-slate-900 border border-slate-800 text-center font-mono">
                  {vaultMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={vaultLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                {vaultLoading ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Lock className="w-4 h-4 text-slate-950" />}
                {vaultLoading ? t('btnDepositing') : t('btnConfirmDeposit')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 📤 STAR VAULT WITHDRAW MODAL */}
      {/* ========================================================= */}
      {showVaultWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121627] border border-amber-400/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Unlock className="w-4 h-4 text-amber-400" />
                {t('modalWithdrawTitle')}
              </h3>
              <button onClick={() => setShowVaultWithdrawModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVaultWithdraw} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">{t('assetToWithdraw')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVaultActionAsset('XLM')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      vaultActionAsset === 'XLM' 
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    yXLM → XLM
                  </button>
                  <button
                    type="button"
                    onClick={() => setVaultActionAsset('USDC')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      vaultActionAsset === 'USDC' 
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    yUSDC → USDC
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>{t('withdrawalAmount')}</span>
                  <span>{t('inVaultYxlm')}: {vaultActionAsset === 'XLM' ? vaultInfo.yXLM : vaultInfo.yUSDC}</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.5"
                    value={vaultAmount}
                    onChange={(e) => setVaultAmount(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:border-amber-400 outline-none pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setVaultAmount(vaultActionAsset === 'XLM' ? vaultInfo.yXLM : vaultInfo.yUSDC)}
                    className="absolute right-2 top-2 text-[10px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded font-bold cursor-pointer"
                  >
                    {t('btnMax')}
                  </button>
                </div>
              </div>

              {vaultMsg && (
                <div className="text-xs p-2 rounded bg-slate-900 border border-slate-800 text-center font-mono">
                  {vaultMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={vaultLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                {vaultLoading ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Unlock className="w-4 h-4 text-slate-950" />}
                {vaultLoading ? t('btnWithdrawing') : t('btnConfirmWithdrawal')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 🎥 REWARDED AD MODAL (AdsGram Simulator) */}
      {/* ========================================================= */}
      {showAdModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131728] border border-cyan-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {t('sponsoredByAdsgram')}
              </span>
              <div className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800">
                {adTimer > 0 ? `${adTimer}s` : 'OK'}
              </div>
            </div>

            <div className="relative aspect-video bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 rounded-xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mb-2 animate-pulse">
                <Layers className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="font-extrabold text-sm text-white">{t('sponsorHeadline')}</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                {t('sponsorSubtext')}
              </p>

              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - adTimer) / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                onClick={executeClaim}
                disabled={!adCompleted || claiming}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                  adCompleted
                    ? 'cta-button text-slate-950 cursor-pointer animate-bounce'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                {claiming ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Processing...</span>
                  </>
                ) : adCompleted ? (
                  <>
                    <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
                    <span>{t('btnClaimToPocket')}</span>
                  </>
                ) : (
                  <span>{t('playingVideo')} ({adTimer}s)...</span>
                )}
              </button>

              {!claiming && (
                <button
                  onClick={() => setShowAdModal(false)}
                  className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
                >
                  {t('btnClose')}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 🎨 THEME SKINS SELECTION MODAL */}
      {/* ========================================================= */}
      {showSkinModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-[#121626] border border-amber-500/30 rounded-t-3xl sm:rounded-2xl p-5 max-w-sm w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm text-white">
                  {lang === 'ja' ? 'ウォレット着せ替えテーマ' : 'Choose Wallet Theme'}
                </h3>
              </div>
              <button 
                onClick={() => setShowSkinModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mb-4">
              {lang === 'ja' 
                ? 'お好みの世界観に合わせてStarPocketを着せ替えることができます。' 
                : 'Personalize StarPocket with unique cosmic, cyber and retro themes.'}
            </p>

            <div className="space-y-2.5">
              {Object.values(SKINS).map((item) => {
                const isActive = currentSkin === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSkin(item.id)}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between transition cursor-pointer text-left border ${
                      isActive 
                        ? 'bg-slate-900 border-amber-400 shadow-md shadow-amber-500/20 ring-1 ring-amber-400' 
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.previewGradient} border ${item.previewBorder} flex items-center justify-center text-lg shadow-sm shrink-0`}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{lang === 'ja' ? item.name : item.nameEn}</span>
                          {isActive && (
                            <span className="text-[9px] font-bold text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded-full border border-amber-400/40">
                              {lang === 'ja' ? '適用中' : 'Active'}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {item.id === 'cosmos' && 'Default Navy & Gold'}
                          {item.id === 'cyber' && 'Neon Cyan & Hot Pink'}
                          {item.id === 'sakura' && 'Midnight Plum & Sakura Pink'}
                          {item.id === 'retro' && '8-Bit GameBoy Dot LCD'}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isActive ? (
                        <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>{lang === 'ja' ? '星ポイントやチケットで新スキン解放！' : 'Unlock exclusive skins via Star Points!'}</span>
              <button
                onClick={() => setShowSkinModal(false)}
                className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
              >
                {t('btnClose')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
