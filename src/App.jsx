import React, { useState, useEffect, useRef } from 'react';
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
  Palette,
  Settings,
  BookOpen,
  Bookmark,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  FileText,
  ChevronDown,
  Edit2,
  Calendar,
  ScanLine,
  Camera,
  Upload
} from 'lucide-react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { Keypair, StrKey, Horizon, Networks, TransactionBuilder, Operation, Asset, Memo } from '@stellar/stellar-sdk';
import { translations } from './i18n.js';
import { 
  generateNewMnemonic, 
  validateMnemonic, 
  validateSecretKey, 
  deriveKeypairFromMnemonic, 
  getKeypairFromSecret 
} from './walletCrypto.js';
import { 
  getSavedWallets, 
  addWallet, 
  switchWallet, 
  renameWallet, 
  removeWallet,
  getActiveWalletId 
} from './walletManager.js';

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

// Official Stellar Lumens (XLM) Vector Icon
export function XlmIcon({ className = "w-6 h-6", size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <div 
      className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#080d1a] via-[#11192e] to-[#16233f] border border-amber-400/40 shadow-sm shrink-0 overflow-hidden ${className}`} 
      style={style}
    >
      <div className="absolute inset-0 bg-amber-400/10 rounded-xl pointer-events-none" />
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[68%] h-[68%] relative z-10">
        <path
          d="M12.003 1.716c-1.37 0-2.7.27-3.948.78A10.18 10.18 0 0 0 2.66 7.901a10.136 10.136 0 0 0-.797 3.954c0 .258.01.516.027.775a1.942 1.942 0 0 1-1.055 1.88L0 14.934v1.902l2.463-1.26.072-.032v.005l.77-.39.758-.385.066-.039 14.807-7.56 1.666-.847 3.392-1.732V2.694L17.792 5.86 3.744 13.025l-.104.055-.017-.115a8.286 8.286 0 0 1-.071-1.105c0-2.255.88-4.377 2.474-5.977a8.462 8.462 0 0 1 2.71-1.82 8.513 8.513 0 0 1 3.2-.654h.067a8.41 8.41 0 0 1 4.09 1.055l1.628-.83.126-.066a10.11 10.11 0 0 0-5.845-1.853zM24 7.143 5.047 16.808l-1.666.847L0 19.382v1.902l3.282-1.671 2.91-1.485 14.058-7.153.105-.055.016.115c.05.369.072.743.072 1.11 0 2.255-.88 4.383-2.475 5.978a8.461 8.461 0 0 1-2.71 1.82 8.305 8.305 0 0 1-3.2.654h-.06c-1.441 0-2.86-.369-4.102-1.061l-.066.033-1.683.857c.594.418 1.232.776 1.903 1.062a10.11 10.11 0 0 0 3.947.797 10.09 10.09 0 0 0 7.17-2.975 10.136 10.136 0 0 0 2.969-7.18c0-.259-.005-.523-.027-.781a1.942 1.942 0 0 1 1.055-1.88L24 9.044z"
          fill="url(#xlmGrad)"
        />
        <defs>
          <linearGradient id="xlmGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" />
            <stop offset="0.5" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Official USD Coin (USDC) Vector Icon
export function UsdcIcon({ className = "w-6 h-6", size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <div 
      className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#142e4e] via-[#1a4a7d] to-[#2775CA] border border-cyan-400/40 shadow-sm shrink-0 overflow-hidden ${className}`} 
      style={style}
    >
      <div className="absolute inset-0 bg-cyan-400/10 rounded-xl pointer-events-none" />
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[72%] h-[72%] relative z-10">
        <path d="M20.022 18.124c0-2.124-1.28-2.852-3.84-3.156-1.828-.243-2.193-.728-2.193-1.578 0-.85.61-1.396 1.828-1.396 1.097 0 1.707.364 2.011 1.275a.458.458 0 00.427.303h.975a.416.416 0 00.427-.425v-.06a3.04 3.04 0 00-2.743-2.489V9.142c0-.243-.183-.425-.487-.486h-.915c-.243 0-.426.182-.487.486v1.396c-1.829.242-2.986 1.456-2.986 2.974 0 2.002 1.218 2.791 3.778 3.095 1.707.303 2.255.668 2.255 1.639 0 .97-.853 1.638-2.011 1.638-1.585 0-2.133-.667-2.316-1.578-.06-.242-.244-.364-.427-.364h-1.036a.416.416 0 00-.426.425v.06c.243 1.518 1.219 2.61 3.23 2.914v1.457c0 .242.183.425.487.485h.915c.243 0 .426-.182.487-.485V21.34c1.829-.303 3.047-1.578 3.047-3.217z" fill="#FFFFFF"/>
        <path d="M12.892 24.497c-4.754-1.7-7.192-6.98-5.424-11.653.914-2.55 2.925-4.491 5.424-5.402.244-.121.365-.303.365-.607v-.85c0-.242-.121-.424-.365-.485-.061 0-.183 0-.244.06a10.895 10.895 0 00-7.13 13.717c1.096 3.4 3.717 6.01 7.13 7.102.244.121.488 0 .548-.243.061-.06.061-.122.061-.243v-.85c0-.182-.182-.424-.365-.546zm6.46-18.936c-.244-.122-.488 0-.548.242-.061.061-.061.122-.061.243v.85c0 .243.182.485.365.607 4.754 1.7 7.192 6.98 5.424 11.653-.914 2.55-2.925 4.491-5.424 5.402-.244.121-.365.303-.365.607v.85c0 .242.121.424.365.485.061 0 .183 0 .244-.06a10.895 10.895 0 007.13-13.717c-1.096-3.46-3.778-6.07-7.13-7.162z" fill="#FFFFFF" fillOpacity="0.75"/>
      </svg>
    </div>
  );
}

// Yield Lumens (yXLM) Vector Icon
export function YXlmIcon({ className = "w-6 h-6", size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <div className={`relative ${className}`} style={style}>
      <XlmIcon className="w-full h-full" />
      <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[9px] px-1 rounded-full border border-[#080d1a] shadow-sm leading-tight">
        y
      </span>
    </div>
  );
}

// Yield Dollar (yUSDC) Vector Icon
export function YUsdcIcon({ className = "w-6 h-6", size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <div className={`relative ${className}`} style={style}>
      <UsdcIcon className="w-full h-full" />
      <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-950 font-black text-[9px] px-1 rounded-full border border-[#080d1a] shadow-sm leading-tight">
        y
      </span>
    </div>
  );
}

// Universal Token Icon Dispatcher
export function TokenIcon({ symbol, className = "w-6 h-6", size }) {
  if (symbol === 'XLM') return <XlmIcon className={className} size={size} />;
  if (symbol === 'USDC') return <UsdcIcon className={className} size={size} />;
  if (symbol === 'yXLM') return <YXlmIcon className={className} size={size} />;
  if (symbol === 'yUSDC') return <YUsdcIcon className={className} size={size} />;
  return (
    <div className={`rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-white shrink-0 ${className}`}>
      {symbol?.slice(0, 3) || '★'}
    </div>
  );
}

// 4 Distinct Themed Color Palettes
const THEMES = {
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

// VIP Card Face Layouts
const CARD_FACES = {
  stella: {
    id: 'stella',
    name: '限定VIP【宇宙浮遊ステラ】⭐',
    nameEn: 'VIP Card: Floating Stella',
    icon: '🪐',
    description: 'ステラテックウェア＆ネオンパープル仕様',
    descriptionEn: 'Techwear Stella with Neon Purple VIP styling'
  },
  chibi: {
    id: 'chibi',
    name: '限定VIP【ちびステラ ＆ お星さま】🌟',
    nameEn: 'VIP Card: Chibi Stella & Star',
    icon: '🌟',
    description: 'マスコットちびステラ＆サイバーシアン仕様',
    descriptionEn: 'Mascot Chibi Stella with Cyber Cyan VIP styling'
  },
  shooting_star: {
    id: 'shooting_star',
    name: 'サイバー・シューティングスター 🌠',
    nameEn: 'Cyber Shooting Star',
    icon: '🌠',
    description: '流星群が疾走する近未来サイバー星空仕様',
    descriptionEn: 'Futuristic shooting stars streaking through a cyber cosmos'
  },
  none: {
    id: 'none',
    name: 'スタンダード（イラストなし）',
    nameEn: 'Standard Minimal Card',
    icon: '💳',
    description: 'イラスト無しのシンプル＆クリーン仕様',
    descriptionEn: 'Minimalist card layout without character art'
  }
};

const SKINS = THEMES;

// Real-time Reference Rates & Metadata for Supported Assets
const ASSET_DETAILS = {
  XLM: {
    symbol: 'XLM',
    name: 'Stellar Lumens',
    nameJa: 'ステラルーメン (XLM)',
    tag: 'Native Gas & Currency',
    tagJa: 'ネイティブ基幹通貨・ガス代',
    rateUsd: '0.1350',
    change24h: '+2.4%',
    isPositive: true,
    marketCap: '$3.95 B',
    vol24h: '$142 M',
    network: 'Stellar Main/Testnet',
    issuer: 'Decentralized / Non-custodial',
    dexPair: 'SDEX XLM / USDC',
    descJa: 'Stellarネットワークの基幹暗号資産。手数料はわずか0.00001 XLM（約0.0002円）で、3〜5秒で送金が即時確定します。',
    descEn: 'The native cryptocurrency of Stellar. Features ~0.00001 XLM gas fees and instant 3-5s finality for global settlements.',
    actionType: 'xlm'
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    nameJa: 'USDコイン (Circle USDC)',
    tag: '100% Backed Digital Dollar',
    tagJa: '米ドル完全裏付けステーブルコイン',
    rateUsd: '1.0000',
    change24h: '+0.01%',
    isPositive: true,
    marketCap: '$35.2 B',
    vol24h: '$4.8 B',
    network: 'Stellar SEP-24 / Circle',
    issuer: 'Circle Financial Inc. (GA5Z...)',
    dexPair: 'SDEX USDC / XLM',
    descJa: '米大手金融企業Circle社が発行する正規米ドルステーブルコイン。米ドル現金および米国短期国債で100%裏付けられています。',
    descEn: 'Regulated digital dollar issued by Circle, backed 100% by cash and short-dated US Treasuries for 1:1 price stability.',
    actionType: 'usdc'
  },
  yXLM: {
    symbol: 'yXLM',
    name: 'Yield Stellar Lumens',
    nameJa: '星の金庫 yXLM (利息付きルーメン)',
    tag: 'Auto-Compounding 5.0% APY',
    tagJa: '年利5.0% 毎日自動複利',
    rateUsd: '0.1418',
    rateUnderlying: '1.0500 XLM',
    change24h: '+5.0% APY',
    isPositive: true,
    apy: '5.0%',
    network: 'UltraStellar Yield Protocol',
    issuer: 'UltraStellar (LOBSTR Core Team)',
    dexPair: '1 yXLM ≈ 1.0500 XLM',
    descJa: '保有するだけで年利5.0%の複利利息が毎日加算されるスマート金庫トークン。ロック期間なしでいつでも等価以上のXLMに引出可能です。',
    descEn: 'Yield-bearing Stellar token earning 5.0% APY daily. Non-custodial with instant redemption back to native XLM anytime.',
    actionType: 'vault-xlm'
  },
  yUSDC: {
    symbol: 'yUSDC',
    name: 'Yield USD Coin',
    nameJa: '星の金庫 yUSDC (利息付き米ドル)',
    tag: 'Auto-Compounding 5.0% APY',
    tagJa: '米ドル年利5.0% 毎日自動複利',
    rateUsd: '1.0500',
    rateUnderlying: '1.0500 USDC',
    change24h: '+5.0% APY',
    isPositive: true,
    apy: '5.0%',
    network: 'UltraStellar Yield Protocol',
    issuer: 'UltraStellar (LOBSTR Core Team)',
    dexPair: '1 yUSDC ≈ $1.0500 USD',
    descJa: 'デジタル米ドル（USDC）を年利5.0%で安全に自動運用。為替リスクなくドル建ての安定した利息を毎日ポケットに蓄積できます。',
    descEn: 'Earn 5.0% APY on digital USD without market volatility. Yield is compounded daily into your non-custodial pocket.',
    actionType: 'vault-usdc'
  }
};

export const STELLA_WALLET_ADDRESS = 'GAKDLWCZOEZAEVFDLIQGIB2UUWCUM3KIMPXHQLITEGFLGO6PN7FYVQSG';

export const INITIAL_ADDRESS_BOOK = [
  {
    id: 'stella-fund',
    name: 'ステラ (開発・サーバー支援 ⭐)',
    address: 'GAKDLWCZOEZAEVFDLIQGIB2UUWCUM3KIMPXHQLITEGFLGO6PN7FYVQSG',
    memo: 'Server Support! ☕',
    memoType: 'text',
    tag: 'dev'
  }
];

const MAIN_TABS = ['wallet', 'swap', 'vault', 'reward'];

export default function App() {
  const [tgUser, setTgUser] = useState(null);
  const [activeTab, setActiveTab] = useState('wallet'); // 'wallet' | 'swap' | 'vault' | 'reward'
  const [selectedAssetDetail, setSelectedAssetDetail] = useState(null); // 'XLM' | 'USDC' | 'yXLM' | 'yUSDC'
  
  // Active Color Theme (cosmos | cyber | sakura | retro)
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('starpocket_theme');
    if (saved && THEMES[saved]) return saved;
    const legacy = localStorage.getItem('starpocket_skin');
    if (legacy && THEMES[legacy]) return legacy;
    return 'retro'; // Default to retro 8-bit dot green (Mizuku's favorite) or cosmos
  });

  // Active VIP Card Face (stella | chibi | none)
  const [currentCardFace, setCurrentCardFace] = useState(() => {
    const saved = localStorage.getItem('starpocket_card_face');
    if (saved === 'cyber_matrix') {
      localStorage.setItem('starpocket_card_face', 'shooting_star');
      return 'shooting_star';
    }
    if (saved && CARD_FACES[saved]) return saved;
    const legacy = localStorage.getItem('starpocket_skin');
    if (legacy === 'chibi') return 'chibi';
    const unlocked = localStorage.getItem('starpocket_skin_stella_unlocked') === 'true';
    if (unlocked) return 'stella';
    return 'none'; // Default to standard card for fresh accounts until first deposit!
  });

  const currentSkin = currentTheme; // Alias for theme
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showStellaRewardModal, setShowStellaRewardModal] = useState(false);
  const [isStellaUnlocked, setIsStellaUnlocked] = useState(() => {
    return localStorage.getItem('starpocket_skin_stella_unlocked') === 'true';
  });

  // Character Full-Body Showcase Modal
  const [showcaseModal, setShowcaseModal] = useState(false);
  const [showcaseSkin, setShowcaseSkin] = useState('stella'); // 'stella' | 'chibi'

  // Touch Swipe for Top Tabs (Pocket / Swap / Vault / Reward)
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchEndXRef = useRef(0);
  const touchEndYRef = useRef(0);
  const isSwipingInteractiveRef = useRef(false);

  const handleTouchStart = (e) => {
    if (e.target.closest('input, textarea, select, [role="slider"]')) {
      isSwipingInteractiveRef.current = true;
      return;
    }
    isSwipingInteractiveRef.current = false;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchEndXRef.current = e.touches[0].clientX;
    touchEndYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (isSwipingInteractiveRef.current) return;
    touchEndXRef.current = e.touches[0].clientX;
    touchEndYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (isSwipingInteractiveRef.current) return;
    const deltaX = touchEndXRef.current - touchStartXRef.current;
    const deltaY = touchEndYRef.current - touchStartYRef.current;

    // Minimum swipe distance of 45px and predominantly horizontal (deltaX > 1.4 * deltaY)
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      const currentIndex = MAIN_TABS.indexOf(activeTab);
      if (currentIndex !== -1) {
        if (deltaX < 0 && currentIndex < MAIN_TABS.length - 1) {
          // Swipe Left -> Next Tab (Wallet -> Swap -> Vault -> Reward)
          const nextTab = MAIN_TABS[currentIndex + 1];
          setActiveTab(nextTab);
          if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.selectionChanged();
          }
        } else if (deltaX > 0 && currentIndex > 0) {
          // Swipe Right -> Prev Tab (Reward -> Vault -> Swap -> Wallet)
          const prevTab = MAIN_TABS[currentIndex - 1];
          setActiveTab(prevTab);
          if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.selectionChanged();
          }
        }
      }
    }
  };

  const skin = THEMES[currentTheme] || THEMES.cosmos;

  const handleSelectTheme = (themeId) => {
    setCurrentTheme(themeId);
    localStorage.setItem('starpocket_theme', themeId);
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
  };

  const handleSelectCardFace = (cardFaceId) => {
    setCurrentCardFace(cardFaceId);
    localStorage.setItem('starpocket_card_face', cardFaceId);
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
  };

  const handleSelectSkin = (id) => {
    if (THEMES[id]) {
      handleSelectTheme(id);
    } else if (CARD_FACES[id]) {
      handleSelectCardFace(id);
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

  const [wallets, setWallets] = useState(() => getSavedWallets());
  const [activeWalletId, setActiveWalletIdState] = useState(() => {
    const list = getSavedWallets();
    return getActiveWalletId(list);
  });
  const activeWalletObj = wallets.find(w => w.id === activeWalletId) || wallets[0] || null;

  const [walletAddress, setWalletAddress] = useState(() => {
    const active = getSavedWallets().find(w => w.id === getActiveWalletId(getSavedWallets()));
    return active ? active.publicKey : (localStorage.getItem('starpocket_stellar_pub') || '');
  });
  const [walletSecret, setWalletSecret] = useState(() => {
    const active = getSavedWallets().find(w => w.id === getActiveWalletId(getSavedWallets()));
    return active ? active.secret : (localStorage.getItem('starpocket_stellar_secret') || '');
  });
  const [walletMnemonic, setWalletMnemonic] = useState(() => {
    const active = getSavedWallets().find(w => w.id === getActiveWalletId(getSavedWallets()));
    return active ? (active.mnemonic || '') : (localStorage.getItem('starpocket_stellar_mnemonic') || '');
  });
  const [hasWallet, setHasWallet] = useState(() => {
    const list = getSavedWallets();
    return list.length > 0;
  });
  const [customAddress, setCustomAddress] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  // 👛 Multi-Wallet Switcher & Management Modals
  const [showWalletSwitchModal, setShowWalletSwitchModal] = useState(false);
  const [editingWalletId, setEditingWalletId] = useState(null);
  const [editingWalletName, setEditingWalletName] = useState('');

  // 🧭 Top / Onboarding Flow States
  const [onboardingView, setOnboardingView] = useState('welcome'); // 'welcome' | 'create' | 'import'
  const [newMnemonicWords, setNewMnemonicWords] = useState([]);
  const [mnemonicConfirmed, setMnemonicConfirmed] = useState(false);

  // 📥 Import Mode & Form States (Separated: Secret Key vs 12-Word vs 24-Word)
  const [importMethod, setImportMethod] = useState('select'); // 'select' | 'secret' | 'mnemonic'
  const [mnemonicLength, setMnemonicLength] = useState(12); // 12 | 24
  const [importSecretInput, setImportSecretInput] = useState('');
  const [importMnemonicWords, setImportMnemonicWords] = useState(Array(12).fill(''));
  const mnemonicInputRefs = useRef([]);
  const inAppMnemonicInputRefs = useRef([]);
  const [showSecretInputEye, setShowSecretInputEye] = useState(false);
  const [importError, setImportError] = useState('');
  const [importLoading, setImportLoading] = useState(false);

  // 🔑 Settings Backup & Import & Create Modals
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showSecretInBackup, setShowSecretInBackup] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCreateWalletModal, setShowCreateWalletModal] = useState(false);

  // 💡 Vault / yXLM Tutorial Modal
  const [showVaultTutorialModal, setShowVaultTutorialModal] = useState(false);
  
  // Balances & Multi-asset
  const [balance, setBalance] = useState('0.0000');
  const [usdcBalance, setUsdcBalance] = useState('0.0000');
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
  const [userStatus, setUserStatus] = useState(() => {
    try {
      const addr = localStorage.getItem('starpocket_stellar_pub') || localStorage.getItem('lumendrop_stellar_pub');
      if (addr) {
        const raw = localStorage.getItem(`starpocket_claim_${addr}`);
        if (raw) {
          const rec = JSON.parse(raw);
          const jstFormatter = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' });
          const today = jstFormatter.format(new Date()).replace(/\//g, '-');
          if (rec.dateStr === today) {
            const elapsed = Date.now() - (rec.lastClaimTime || 0);
            const cooldown = Math.max(0, Math.ceil((3 * 60 * 1000 - elapsed) / 1000));
            return {
              maxDaily: 5,
              claimsToday: rec.count,
              remainingToday: Math.max(0, 5 - rec.count),
              cooldownRemainingSec: cooldown,
              canClaim: rec.count < 5 && cooldown === 0
            };
          }
        }
      }
    } catch (e) {}
    return {
      maxDaily: 5,
      claimsToday: 0,
      remainingToday: 5,
      cooldownRemainingSec: 0,
      canClaim: true
    };
  });
  const [cooldownSec, setCooldownSec] = useState(() => userStatus.cooldownRemainingSec || 0);

  const [faucetInfo, setFaucetInfo] = useState(null);
  const [claimHistory, setClaimHistory] = useState([]);
  
  // Modals
  const [showAdModal, setShowAdModal] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const [adCompleted, setAdCompleted] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [fundingFriendbot, setFundingFriendbot] = useState(false);
  const [friendbotMsg, setFriendbotMsg] = useState('');
  
  // Send Form
  const [sendDest, setSendDest] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendMemo, setSendMemo] = useState('');
  const [sendMemoType, setSendMemoType] = useState('auto'); // 'auto' | 'text' | 'id' (Auto-detects exchange numeric IDs vs messages)
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState('');

  // QR Code Generation & Scanner
  const [receiveQrUrl, setReceiveQrUrl] = useState('');
  const [showQrScannerModal, setShowQrScannerModal] = useState(false);
  const [scannerCameraError, setScannerCameraError] = useState(null);
  const scannerVideoRef = useRef(null);
  const scannerStreamRef = useRef(null);
  const scannerAnimFrameRef = useRef(null);
  const qrFileInputRef = useRef(null);
  
  // Claiming State
  const [claiming, setClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(null);
  const [claimError, setClaimError] = useState('');
  const [copied, setCopied] = useState(false);

  // Blockchain Activity & Transaction History
  const [activityList, setActivityList] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityFilter, setActivityFilter] = useState('all'); // 'all' | 'receive' | 'send'
  const [copiedActivityKey, setCopiedActivityKey] = useState('');

  const copyText = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedActivityKey(key);
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    setTimeout(() => setCopiedActivityKey(''), 2000);
  };

  // Address Book (連絡先・アドレス帳) State
  const [addressBook, setAddressBook] = useState(() => {
    try {
      const saved = localStorage.getItem('starpocket_address_book');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_ADDRESS_BOOK;
  });
  const [showAddressBookModal, setShowAddressBookModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    address: '',
    memo: '',
    memoType: 'text',
    tag: 'friend'
  });
  const [contactError, setContactError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('starpocket_address_book', JSON.stringify(addressBook));
    } catch (e) {}
  }, [addressBook]);

  const handleSaveContact = (e) => {
    if (e) e.preventDefault();
    setContactError('');
    const trimmedAddr = contactForm.address.trim();
    const trimmedName = contactForm.name.trim();

    if (!trimmedName) {
      setContactError(lang === 'ja' ? '名前を入力してください' : 'Please enter a name');
      return;
    }
    if (!StrKey.isValidEd25519PublicKey(trimmedAddr)) {
      setContactError(lang === 'ja' ? '無効なStellarアドレスです (Gから始まる56文字)' : 'Invalid Stellar address (56 chars starting with G)');
      return;
    }

    const newContact = {
      id: 'contact_' + Date.now(),
      name: trimmedName,
      address: trimmedAddr,
      memo: contactForm.memo.trim(),
      memoType: contactForm.memoType || 'text',
      tag: contactForm.tag || 'friend'
    };

    setAddressBook((prev) => {
      const existingIdx = prev.findIndex((c) => c.address === trimmedAddr);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...newContact, id: updated[existingIdx].id };
        return updated;
      }
      return [newContact, ...prev];
    });

    setShowAddContactModal(false);
    setContactForm({ name: '', address: '', memo: '', memoType: 'text', tag: 'friend' });
  };

  const handleDeleteContact = (id) => {
    setAddressBook((prev) => prev.filter((c) => c.id !== id));
  };

  const openAddContactWithPrefill = (address, memo = '', memoType = 'text', defaultName = '') => {
    setContactForm({
      name: defaultName,
      address: address || '',
      memo: memo || '',
      memoType: memoType || 'text',
      tag: 'friend'
    });
    setContactError('');
    setShowAddContactModal(true);
  };

  const getContactName = (addr) => {
    if (!addr) return null;
    const found = addressBook.find((c) => c.address === addr);
    return found ? found.name : null;
  };

  // Gamification: Star Points & 31-Day Login Calendar
  const [gamification, setGamification] = useState(() => {
    try {
      const pub = localStorage.getItem('starpocket_stellar_pub') || localStorage.getItem('lumendrop_stellar_pub');
      if (pub) {
        const raw = localStorage.getItem(`starpocket_gamification_${pub}`);
        if (raw) return JSON.parse(raw);
      }
    } catch (e) {}
    return {
      starPoints: 50,
      streak: 0,
      checkedInToday: false,
      checkinDays: [],
      currentDayOfMonth: new Date().getDate(),
      perks: [],
      hasCompleted31: false
    };
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

    const currentWallets = getSavedWallets();
    setWallets(currentWallets);
    if (currentWallets.length > 0) {
      const activeId = getActiveWalletId(currentWallets);
      const active = currentWallets.find(w => w.id === activeId) || currentWallets[0];
      setActiveWalletIdState(active.id);
      setWalletAddress(active.publicKey);
      setWalletSecret(active.secret);
      setWalletMnemonic(active.mnemonic || '');
      setHasWallet(true);
    } else {
      setHasWallet(false);
    }

    fetchFaucetInfo();
  }, []);

  // 🧭 Multi-Wallet Switcher & Management Handlers
  const handleSelectWallet = (id) => {
    const target = switchWallet(id);
    if (target) {
      setActiveWalletIdState(target.id);
      setWalletAddress(target.publicKey);
      setWalletSecret(target.secret);
      setWalletMnemonic(target.mnemonic || '');
      setShowWalletSwitchModal(false);
      fetchAll(target.publicKey);
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.selectionChanged();
      }
    }
  };

  const handleRenameWallet = (id, newName) => {
    const updated = renameWallet(id, newName);
    setWallets(updated);
    setEditingWalletId(null);
  };

  const handleRemoveWallet = (id) => {
    if (wallets.length <= 1) {
      alert(lang === 'ja' ? '最後のお財布は削除できません' : 'Cannot remove the last remaining wallet');
      return;
    }
    const target = wallets.find(w => w.id === id);
    const confirmMsg = lang === 'ja'
      ? `「${target?.name || 'お財布'}」を削除しますか？\nバックアップ（12単語または秘密鍵）がない場合、このお財布は復元できません。`
      : `Remove "${target?.name || 'Wallet'}"?\nWithout backup, this wallet cannot be restored.`;
    if (window.confirm(confirmMsg)) {
      const res = removeWallet(id);
      if (res.updatedWallets) {
        setWallets(res.updatedWallets);
        setActiveWalletIdState(res.activeWallet.id);
        setWalletAddress(res.activeWallet.publicKey);
        setWalletSecret(res.activeWallet.secret);
        setWalletMnemonic(res.activeWallet.mnemonic || '');
        fetchAll(res.activeWallet.publicKey);
      }
    }
  };

  // 🧭 Wallet Creation & Import Handlers
  const handleStartCreateWallet = (isFromModal = false) => {
    try {
      const mnemonic = generateNewMnemonic();
      setNewMnemonicWords(mnemonic.split(' '));
      setMnemonicConfirmed(false);
      if (isFromModal) {
        setShowCreateWalletModal(true);
      } else {
        setOnboardingView('create');
      }
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
      }
    } catch (e) {
      console.error('Failed to generate mnemonic:', e);
    }
  };

  const handleFinishCreateWallet = (isFromModal = false) => {
    if (!mnemonicConfirmed || newMnemonicWords.length === 0) return;
    try {
      const mnemonicStr = newMnemonicWords.join(' ');
      const res = deriveKeypairFromMnemonic(mnemonicStr);

      const nextNum = wallets.length + 1;
      const { updatedWallets, activeWallet } = addWallet({
        name: `お財布 ${nextNum}`,
        publicKey: res.publicKey,
        secret: res.secret,
        mnemonic: mnemonicStr
      });

      setWallets(updatedWallets);
      setActiveWalletIdState(activeWallet.id);
      setWalletAddress(activeWallet.publicKey);
      setWalletSecret(activeWallet.secret);
      setWalletMnemonic(mnemonicStr);
      setHasWallet(true);
      fetchAll(res.publicKey);

      if (isFromModal) {
        setShowCreateWalletModal(false);
      } else {
        setOnboardingView('welcome');
      }

      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
    } catch (e) {
      console.error('Failed to derive wallet from mnemonic:', e);
    }
  };

  const handleMnemonicWordChange = (idx, val, isModal = false) => {
    const targetRefs = isModal ? inAppMnemonicInputRefs : mnemonicInputRefs;
    if (val.includes(' ') || val.includes('\n') || val.includes('\t') || val.includes(',')) {
      const clean = val.toLowerCase().replace(/[^a-z]/g, '');
      setImportMnemonicWords((prev) => {
        const next = [...prev];
        next[idx] = clean;
        return next;
      });
      if (idx < mnemonicLength - 1 && targetRefs.current[idx + 1]) {
        targetRefs.current[idx + 1].focus();
      }
      return;
    }
    const clean = val.toLowerCase().replace(/[^a-z]/g, '');
    setImportMnemonicWords((prev) => {
      const next = [...prev];
      next[idx] = clean;
      return next;
    });
  };

  const handleMnemonicKeyDown = (idx, e, isModal = false) => {
    const targetRefs = isModal ? inAppMnemonicInputRefs : mnemonicInputRefs;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (idx < mnemonicLength - 1 && targetRefs.current[idx + 1]) {
        targetRefs.current[idx + 1].focus();
      }
    } else if (e.key === 'Backspace' && !importMnemonicWords[idx] && idx > 0) {
      if (targetRefs.current[idx - 1]) {
        targetRefs.current[idx - 1].focus();
      }
    }
  };

  const handleExecuteImportMethod = (method, isFromSettings = false) => {
    setImportError('');
    try {
      setImportLoading(true);
      let derivedPub = '';
      let derivedSec = '';
      let derivedMnemonic = '';

      if (method === 'secret') {
        const raw = importSecretInput.trim();
        if (!raw) {
          throw new Error(lang === 'ja' ? '秘密鍵（S...）を入力してください' : 'Please enter secret key');
        }
        if (!raw.startsWith('S') || raw.length !== 56 || !validateSecretKey(raw)) {
          throw new Error(lang === 'ja' ? '無効なStellar秘密鍵です（Sから始まる56文字）' : 'Invalid Stellar secret key (56 chars starting with S)');
        }
        const res = getKeypairFromSecret(raw);
        derivedPub = res.publicKey;
        derivedSec = res.secret;
      } else if (method === 'mnemonic') {
        const words = importMnemonicWords.map((w) => w.trim().toLowerCase()).filter(Boolean);
        if (words.length === 0) {
          throw new Error(lang === 'ja' ? `${mnemonicLength}単語を入力してください` : `Please enter ${mnemonicLength} words`);
        }
        if (words.length !== mnemonicLength) {
          throw new Error(lang === 'ja' ? `単語数が不足しています（現在: ${words.length} / ${mnemonicLength} 単語）` : `Incomplete words (Current: ${words.length} / ${mnemonicLength})`);
        }
        const joined = words.join(' ');
        if (!validateMnemonic(joined)) {
          throw new Error(lang === 'ja' ? '単語のスペルまたは組み合わせが正しくありません' : 'Invalid mnemonic words or checksum');
        }
        const res = deriveKeypairFromMnemonic(joined);
        derivedPub = res.publicKey;
        derivedSec = res.secret;
        derivedMnemonic = joined;
      }

      const nextNum = wallets.length + 1;
      const { updatedWallets, activeWallet } = addWallet({
        name: `お財布 ${nextNum}`,
        publicKey: derivedPub,
        secret: derivedSec,
        mnemonic: derivedMnemonic || null
      });

      setWallets(updatedWallets);
      setActiveWalletIdState(activeWallet.id);
      setWalletAddress(derivedPub);
      setWalletSecret(derivedSec);
      setWalletMnemonic(derivedMnemonic || '');
      setHasWallet(true);
      setImportSecretInput('');
      setImportMnemonicWords(Array(mnemonicLength).fill(''));
      setImportMethod('select');
      setImportError('');

      if (isFromSettings) {
        setShowImportModal(false);
        setShowSettingsModal(false);
      } else {
        setOnboardingView('welcome');
      }

      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
    } catch (err) {
      console.error('Import error:', err);
      setImportError(err.message || (lang === 'ja' ? 'インポートに失敗しました' : 'Import failed'));
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
      }
    } finally {
      setImportLoading(false);
    }
  };

  const handleSwitchAccount = () => {
    setShowSettingsModal(false);
    setShowWalletSwitchModal(true);
  };

  const activeAddress = useCustom && customAddress ? customAddress : walletAddress;

  useEffect(() => {
    if (activeAddress && StrKey.isValidEd25519PublicKey(activeAddress)) {
      fetchAll(activeAddress);
      QRCode.toDataURL(activeAddress, { 
        margin: 1, 
        width: 240, 
        color: { dark: '#090d16', light: '#ffffff' } 
      })
        .then(url => setReceiveQrUrl(url))
        .catch(err => console.error('QR generation error:', err));
    }
  }, [activeAddress]);

  const fetchAll = (addr) => {
    fetchBalance(addr);
    fetchUserStatus(addr);
    fetchVaultInfo(addr);
    fetchSwapBonus(addr);
    fetchGamification(addr);
    fetchActivity(addr);
  };

  const fetchActivity = async (addr) => {
    if (!addr) return;
    setLoadingActivity(true);
    try {
      const res = await fetch(`/api/activity/${addr}`);
      const data = await res.json();
      if (data.activity) {
        setActivityList(data.activity);
      }
    } catch (e) {
      console.error('Failed to fetch activity:', e);
    } finally {
      setLoadingActivity(false);
    }
  };

  const fetchGamification = async (addr) => {
    if (!addr) return;
    try {
      const cached = localStorage.getItem(`starpocket_gamification_${addr}`);
      let url = `/api/gamification/${addr}`;
      if (cached) {
        url += `?sync=${encodeURIComponent(cached)}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setGamification(data);
        localStorage.setItem(`starpocket_gamification_${addr}`, JSON.stringify(data));
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
      const cached = localStorage.getItem(`starpocket_gamification_${activeAddress}`);
      let clientBackup = null;
      if (cached) {
        try { clientBackup = JSON.parse(cached); } catch (e) {}
      }
      const res = await fetch('/api/gamification/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: activeAddress, clientBackup })
      });
      const data = await res.json();
      if (data.success) {
        setGamification(data);
        localStorage.setItem(`starpocket_gamification_${activeAddress}`, JSON.stringify(data));
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
        localStorage.setItem(`starpocket_gamification_${activeAddress}`, JSON.stringify(data));
        if (perkId === 'chibi_skin') {
          localStorage.setItem('starpocket_skin_chibi_unlocked', 'true');
          handleSelectCardFace('chibi');
        } else if (perkId === 'cyber_skin') {
          handleSelectTheme('cyber');
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
        setCooldownSec(prev => {
          const next = Math.max(0, prev - 1);
          if (next === 0) {
            setUserStatus(curr => ({
              ...curr,
              cooldownRemainingSec: 0,
              canClaim: curr.remainingToday > 0
            }));
          }
          return next;
        });
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

        // Merge with local storage record if local record has higher claim count for today
        const jstFormatter = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' });
        const today = jstFormatter.format(new Date()).replace(/\//g, '-');
        let effectiveStatus = data;

        try {
          const raw = localStorage.getItem(`starpocket_claim_${addr}`);
          if (raw) {
            const rec = JSON.parse(raw);
            if (rec.dateStr === today && rec.count > data.claimsToday) {
              const elapsed = Date.now() - (rec.lastClaimTime || 0);
              const cooldown = Math.max(0, Math.ceil((3 * 60 * 1000 - elapsed) / 1000));
              effectiveStatus = {
                ...data,
                claimsToday: rec.count,
                remainingToday: Math.max(0, 5 - rec.count),
                cooldownRemainingSec: Math.max(data.cooldownRemainingSec || 0, cooldown),
                canClaim: rec.count < 5 && cooldown === 0
              };
            }
          }
        } catch (e) {}

        setUserStatus(effectiveStatus);
        setCooldownSec(effectiveStatus.cooldownRemainingSec || 0);
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
        const parsedBal = parseFloat(data.balance || 0);
        setBalance(parsedBal.toFixed(4));
        setUsdcBalance(parseFloat(data.usdcBalance || 0).toFixed(4));
        setAssetList(data.assets || []);
        setIsNewAccount(!data.exists);

        // 🌟 First-time funding unlock of Stella VIP Card!
        if (parsedBal > 0 && localStorage.getItem('starpocket_skin_stella_unlocked') !== 'true') {
          localStorage.setItem('starpocket_skin_stella_unlocked', 'true');
          setIsStellaUnlocked(true);
          handleSelectCardFace('stella');
          setShowStellaRewardModal(true);
          if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
          }
        }
      }
    } catch (e) {
      console.error('Balance fetch failed:', e);
    } finally {
      setLoadingBalance(false);
    }
  };

  // Swap conversion rates for all pairs
  const SWAP_RATES = {
    'XLM_USDC': 0.135,
    'USDC_XLM': 1 / 0.135,
    'XLM_yXLM': 0.98,
    'yXLM_XLM': 1 / 0.98,
    'USDC_yUSDC': 0.98,
    'yUSDC_USDC': 1 / 0.98,
    'XLM_yUSDC': 0.135 * 0.98,
    'yUSDC_XLM': 1 / (0.135 * 0.98),
    'USDC_yXLM': (1 / 0.135) * 0.98,
    'yXLM_USDC': 0.135 / 0.98,
    'yXLM_yUSDC': 0.135,
    'yUSDC_yXLM': 1 / 0.135,
  };

  // Swap calculation helper
  const getEstimatedSwapOutput = (from, to, inAmt) => {
    const num = parseFloat(inAmt);
    if (isNaN(num) || num <= 0) return '0.0000';
    if (from === to) return num.toFixed(4);
    const rate = SWAP_RATES[`${from}_${to}`] || 1.0;
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

      // If paying with native XLM, execute on-chain transfer to protocol pool so on-chain XLM balance decreases
      if (swapFrom === 'XLM' && walletSecret) {
        try {
          const senderKeypair = Keypair.fromSecret(walletSecret);
          const senderAcc = await stellarServer.loadAccount(senderKeypair.publicKey());
          const poolDest = (faucetInfo && faucetInfo.publicKey) || 'GAKDLWCZOEZAEVFDLIQGIB2UUWCUM3KIMPXHQLITEGFLGO6PN7FYVQSG';
          const tx = new TransactionBuilder(senderAcc, {
            fee: '100',
            networkPassphrase: Networks.TESTNET
          })
            .addOperation(Operation.payment({
              destination: poolDest,
              asset: Asset.native(),
              amount: amt.toFixed(7)
            }))
            .addMemo(Memo.text(`Swap to ${swapTo}`))
            .setTimeout(30)
            .build();
          tx.sign(senderKeypair);
          await stellarServer.submitTransaction(tx);
        } catch (onChainErr) {
          console.warn('On-chain XLM deduction warning:', onChainErr);
        }
      }

      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }

      setSwapResult(data);
      setSwapAmount('');
      if (data.usdcBalance !== undefined) {
        setUsdcBalance(data.usdcBalance);
      }
      if (data.vault) {
        setVaultInfo(prev => ({
          ...prev,
          yXLM: (typeof data.vault.yXLM === 'number' ? data.vault.yXLM.toFixed(4) : data.vault.yXLM),
          yUSDC: (typeof data.vault.yUSDC === 'number' ? data.vault.yUSDC.toFixed(4) : data.vault.yUSDC),
          totalEarnedXLM: data.vault.totalEarnedXLM || prev.totalEarnedXLM,
          totalEarnedUSDC: data.vault.totalEarnedUSDC || prev.totalEarnedUSDC
        }));
      }
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

      // If depositing native XLM, execute on-chain transfer to vault pool so on-chain XLM balance decreases
      if (vaultActionAsset === 'XLM' && walletSecret) {
        try {
          const senderKeypair = Keypair.fromSecret(walletSecret);
          const senderAcc = await stellarServer.loadAccount(senderKeypair.publicKey());
          const poolDest = (faucetInfo && faucetInfo.publicKey) || 'GAKDLWCZOEZAEVFDLIQGIB2UUWCUM3KIMPXHQLITEGFLGO6PN7FYVQSG';
          const tx = new TransactionBuilder(senderAcc, {
            fee: '100',
            networkPassphrase: Networks.TESTNET
          })
            .addOperation(Operation.payment({
              destination: poolDest,
              asset: Asset.native(),
              amount: amt.toFixed(7)
            }))
            .addMemo(Memo.text('StarVault Deposit'))
            .setTimeout(30)
            .build();
          tx.sign(senderKeypair);
          await stellarServer.submitTransaction(tx);
        } catch (onChainErr) {
          console.warn('On-chain Vault deposit warning:', onChainErr);
        }
      }

      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }

      setVaultMsg('✨ ' + data.message);
      setVaultAmount('');
      if (data.usdcBalance !== undefined) {
        setUsdcBalance(data.usdcBalance);
      }
      if (data.vault) {
        setVaultInfo(prev => ({
          ...prev,
          yXLM: (typeof data.vault.yXLM === 'number' ? data.vault.yXLM.toFixed(4) : data.vault.yXLM),
          yUSDC: (typeof data.vault.yUSDC === 'number' ? data.vault.yUSDC.toFixed(4) : data.vault.yUSDC)
        }));
      }
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
      if (data.usdcBalance !== undefined) {
        setUsdcBalance(data.usdcBalance);
      }
      if (data.vault) {
        setVaultInfo(prev => ({
          ...prev,
          yXLM: (typeof data.vault.yXLM === 'number' ? data.vault.yXLM.toFixed(4) : data.vault.yXLM),
          yUSDC: (typeof data.vault.yUSDC === 'number' ? data.vault.yUSDC.toFixed(4) : data.vault.yUSDC)
        }));
      }
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
      let localCount = userStatus.claimsToday || 0;
      const jstFormatter = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' });
      const today = jstFormatter.format(new Date()).replace(/\//g, '-');
      try {
        const raw = localStorage.getItem(`starpocket_claim_${activeAddress}`);
        if (raw) {
          const rec = JSON.parse(raw);
          if (rec.dateStr === today) localCount = Math.max(localCount, rec.count || 0);
        }
      } catch (e) {}

      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: activeAddress,
          adWatched: true,
          clientClaimCount: localCount,
          lang: lang
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Claim failed');

      setClaimSuccess(data);
      setShowAdModal(false);

      if (data.status) {
        setUserStatus(data.status);
        setCooldownSec(data.status.cooldownRemainingSec || 0);

        try {
          localStorage.setItem(`starpocket_claim_${activeAddress}`, JSON.stringify({
            dateStr: today,
            count: data.status.claimsToday,
            lastClaimTime: Date.now()
          }));
        } catch (e) {}
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

  // Process scanned text (SEP-0007 / Stellar payment URI, plain address, etc.)
  const processScannedQrData = (text) => {
    if (!text || typeof text !== 'string') return;
    const trimmed = text.trim();

    // 1. Check if SEP-0007 / Stellar payment URI: web+stellar:pay?... or stellar:...
    if (trimmed.startsWith('web+stellar:') || trimmed.startsWith('stellar:')) {
      try {
        const cleanUri = trimmed.replace(/^web\+stellar:/, '').replace(/^stellar:/, '');
        if (cleanUri.startsWith('pay?') || cleanUri.includes('?')) {
          const queryString = cleanUri.includes('?') ? cleanUri.split('?')[1] : cleanUri;
          const params = new URLSearchParams(queryString);
          const destination = params.get('destination');
          const amount = params.get('amount');
          const memo = params.get('memo');
          const memoType = params.get('memo_type');

          if (destination && StrKey.isValidEd25519PublicKey(destination)) {
            setSendDest(destination);
            if (amount && !isNaN(parseFloat(amount))) {
              setSendAmount(amount);
            }
            if (memo) {
              setSendMemo(memo);
              if (memoType === 'MEMO_ID' || memoType === 'id') {
                setSendMemoType('id');
              } else {
                setSendMemoType('text');
              }
            }
            if (window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
            return;
          }
        } else if (StrKey.isValidEd25519PublicKey(cleanUri)) {
          setSendDest(cleanUri);
          if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
          }
          return;
        }
      } catch (e) {
        console.warn('Failed to parse Stellar URI:', e);
      }
    }

    // 2. Direct public key check
    if (StrKey.isValidEd25519PublicKey(trimmed)) {
      setSendDest(trimmed);
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
      return;
    }

    // 3. Regex match any 56-char Stellar public key
    const match = trimmed.match(/G[A-Z2-7]{55}/);
    if (match && StrKey.isValidEd25519PublicKey(match[0])) {
      setSendDest(match[0]);
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
      return;
    }

    alert(lang === 'ja'
      ? `スキャンしたデータから有効なStellarアドレスが見つかりませんでした:\n${trimmed.slice(0, 80)}`
      : `No valid Stellar address detected in scanned QR code:\n${trimmed.slice(0, 80)}`);
  };

  // Trigger QR Scanner (Native TMA if in Telegram, else In-App Web Scanner Modal)
  const handleScanQr = () => {
    if (window.Telegram?.WebApp?.showScanQrPopup) {
      if (window.Telegram.WebApp.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
      }
      window.Telegram.WebApp.showScanQrPopup(
        {
          text: lang === 'ja'
            ? 'Stellar送金先アドレスのQRコードをスキャン'
            : 'Scan Stellar recipient QR code'
        },
        (scannedText) => {
          if (!scannedText) return;
          processScannedQrData(scannedText);
          return true; // Closes Telegram native popup
        }
      );
    } else {
      setShowQrScannerModal(true);
    }
  };

  const stopQrScanner = () => {
    if (scannerAnimFrameRef.current) {
      cancelAnimationFrame(scannerAnimFrameRef.current);
      scannerAnimFrameRef.current = null;
    }
    if (scannerStreamRef.current) {
      scannerStreamRef.current.getTracks().forEach(track => track.stop());
      scannerStreamRef.current = null;
    }
    setShowQrScannerModal(false);
    setScannerCameraError(null);
  };

  // In-App Web Camera Scanner Effect
  useEffect(() => {
    if (!showQrScannerModal) return;

    let active = true;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const scanFrame = () => {
      if (!active || !scannerVideoRef.current) return;
      const video = scannerVideoRef.current;
      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
        if (code && code.data) {
          processScannedQrData(code.data);
          stopQrScanner();
          return;
        }
      }
      scannerAnimFrameRef.current = requestAnimationFrame(scanFrame);
    };

    navigator.mediaDevices?.getUserMedia?.({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        scannerStreamRef.current = stream;
        if (scannerVideoRef.current) {
          scannerVideoRef.current.srcObject = stream;
          scannerVideoRef.current.play().catch(e => console.warn('Video play error:', e));
        }
        scannerAnimFrameRef.current = requestAnimationFrame(scanFrame);
      })
      .catch(err => {
        console.warn('Camera access error:', err);
        setScannerCameraError(lang === 'ja'
          ? 'カメラへのアクセスが許可されていません。下のボタンからQR画像を選択するか、Telegramアプリ内から起動してください。'
          : 'Camera access denied. Please upload a QR image below or open inside Telegram.');
      });

    return () => {
      active = false;
      if (scannerAnimFrameRef.current) cancelAnimationFrame(scannerAnimFrameRef.current);
      if (scannerStreamRef.current) scannerStreamRef.current.getTracks().forEach(t => t.stop());
    };
  }, [showQrScannerModal]);

  // Image file upload scanner
  const handleQrImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          processScannedQrData(code.data);
          stopQrScanner();
        } else {
          alert(lang === 'ja'
            ? '画像からQRコードを読み取れませんでした。'
            : 'Could not detect a valid QR code from this image.');
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
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
      
      let memoObj = Memo.none();
      if (sendMemo && sendMemo.trim()) {
        const trimmed = sendMemo.trim();
        const isPureDigits = /^\d+$/.test(trimmed);

        // Smart Auto-Resolution:
        // If 'auto', pure digits -> Memo.id, text -> Memo.text.
        // Even if 'text' was selected by mistake, pure digits of 4+ length are safely resolved as Memo.id to protect from exchange loss!
        let effectiveType = sendMemoType;
        if (effectiveType === 'auto' || (effectiveType === 'text' && isPureDigits && trimmed.length >= 4)) {
          effectiveType = isPureDigits ? 'id' : 'text';
        }

        if (effectiveType === 'id') {
          if (!isPureDigits) {
            throw new Error(lang === 'ja' ? 'Memo IDは半角数字のみで入力してください' : 'Memo ID must contain digits only');
          }
          memoObj = Memo.id(trimmed);
        } else {
          const byteLen = new TextEncoder().encode(trimmed).length;
          if (byteLen > 28) {
            throw new Error(lang === 'ja' ? `Memo TEXTは最大28バイトまでです (現在: ${byteLen}B)` : `Memo text exceeds 28 bytes (${byteLen}B)`);
          }
          memoObj = Memo.text(trimmed);
        }
      } else {
        memoObj = Memo.text('StarPocket');
      }

      const tx = new TransactionBuilder(senderAcc, {
        fee: '100',
        networkPassphrase: Networks.TESTNET
      })
      .addOperation(Operation.payment({
        destination: sendDest,
        asset: Asset.native(),
        amount: amt.toFixed(7)
      }))
      .addMemo(memoObj)
      .setTimeout(30)
      .build();

      tx.sign(senderKeypair);
      const res = await stellarServer.submitTransaction(tx);

      // Easter Egg: Tipping Stella unlocks the secret Stella Aura floating skin!
      if (sendDest === 'GAKDLWCZOEZAEVFDLIQGIB2UUWCUM3KIMPXHQLITEGFLGO6PN7FYVQSG') {
        localStorage.setItem('starpocket_skin_stella_unlocked', 'true');
        setIsStellaUnlocked(true);
        handleSelectSkin('stella');
        setShowStellaRewardModal(true);
      }

      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }

      setSendMsg(lang === 'ja' ? `✅ 送金成功！TX: ${res.hash.slice(0, 8)}...` : `✅ Sent successfully! TX: ${res.hash.slice(0, 8)}...`);
      setSendDest('');
      setSendAmount('');
      setSendMemo('');
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
  const handleCopyAddress = copyAddress;

  const handleFriendbotFund = async () => {
    if (!activeAddress) return;
    setFundingFriendbot(true);
    setFriendbotMsg('');
    try {
      const res = await fetch('/api/fund-friendbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: activeAddress })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Friendbot request failed');

      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
      setFriendbotMsg(lang === 'ja' ? '🎉 10,000 XLMのチャージに成功しました！' : '🎉 10,000 XLM credited successfully!');
      setTimeout(() => {
        fetchAll(activeAddress);
      }, 1200);
    } catch (err) {
      setFriendbotMsg(`❌ ${err.message}`);
    } finally {
      setFundingFriendbot(false);
    }
  };

  const handleShareInvite = () => {
    const shareText = lang === 'ja' 
      ? '⭐【StarPocket】自分専用の星のスマートウォレット＆星の金庫！年利5%で星を増やしてスワップもできる！'
      : '⭐ Check out StarPocket! The cute smart wallet & 5% APY yield vault on Telegram. Claim free daily XLM and swap with zero hassle!';
    const appUrl = 'https://starpocket.onrender.com';
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}`;

    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(shareUrl);
    } else {
      window.open(shareUrl, '_blank');
    }
  };

  const formatCooldown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  // 🧭 TOP / ONBOARDING SCREEN (WHEN NO WALLET EXISTS OR SWITCHING)
  if (!hasWallet) {
    return (
      <div className="min-h-screen bg-[#080b14] text-slate-100 flex flex-col justify-between max-w-md mx-auto relative px-5 py-6 font-sans select-none overflow-x-hidden">
        {/* Ambient cosmic glows */}
        <div className="fixed top-[-100px] left-[-100px] w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-[-100px] right-[-100px] w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed top-[40%] right-[-80px] w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Bar: Language toggle */}
        <div className="flex items-center justify-between z-10 mb-4">
          <div className="flex items-center gap-2">
            <StarPocketLogo size={36} />
            <span className="font-black text-sm tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
              StarPocket
            </span>
          </div>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer active:scale-95 shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ja' ? '🇯🇵 日本語' : '🇺🇸 English'}</span>
          </button>
        </div>

        {/* Main Step Switcher */}
        {onboardingView === 'welcome' && (
          <div className="my-auto py-4 space-y-5 z-10 animate-in fade-in zoom-in-95 duration-300">
            {/* Hero Section */}
            <div className="text-center space-y-2">
              <div className="relative inline-block mx-auto mb-1">
                <StarPocketLogo size={72} />
                <div className="absolute -inset-2 bg-amber-400/20 rounded-3xl blur-xl -z-10 animate-pulse" />
              </div>
              <h1 className="text-2xl font-black tracking-tight leading-tight">
                {lang === 'ja' ? (
                  <>
                    <span className="text-white block">ステラルーメンを愛する人達へ。</span>
                    <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-cyan-300 bg-clip-text text-transparent text-lg font-extrabold mt-1 block">
                      新しいウォレット始めませんか？
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-white block">For Stellar Lovers.</span>
                    <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-cyan-300 bg-clip-text text-transparent text-lg font-extrabold mt-1 block">
                      Ready for a New Wallet?
                    </span>
                  </>
                )}
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                {lang === 'ja' 
                  ? 'ウォレット×着せ替えが生む、Telegramで一番やさしい星空スマートウォレット' 
                  : 'The most adorable, customizable Stellar smart wallet on Telegram.'}
              </p>
            </div>

            {/* 3 Core Trust Badges */}
            <div className="space-y-2.5">
              <div className="bg-gradient-to-r from-slate-900/90 to-slate-900/60 border border-slate-800 rounded-2xl p-3 flex items-center gap-3 shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-xs text-slate-100">
                    {lang === 'ja' ? '完全非カストディアル（自由な鍵管理）' : 'Non-Custodial Freedom'}
                  </h3>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    {lang === 'ja' ? '秘密鍵はあなたの手の中だけ。LOBSTR等への引越しも自由自在。' : 'Your keys, your crypto. Fully compatible with LOBSTR & Stellar SEP-0005.'}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-900/90 to-slate-900/60 border border-slate-800 rounded-2xl p-3 flex items-center gap-3 shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-xs text-slate-100">
                    {lang === 'ja' ? 'プロトコル手数料 0%（DEX直結・無料）' : '0% Protocol Fees (Direct DEX)'}
                  </h3>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    {lang === 'ja' ? '中抜き手数料なし。Stellar公式DEX直結の最安レートで即時交換。' : 'Zero middleman cut. Instant direct swap on Stellar Decentralized Exchange.'}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-900/90 to-slate-900/60 border border-slate-800 rounded-2xl p-3 flex items-center gap-3 shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
                  <Palette className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-xs text-slate-100">
                    {lang === 'ja' ? '星空カレンダー ＆ VIP券面着せ替え' : '31-Day Calendar & VIP Card Faces'}
                  </h3>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    {lang === 'ja' ? '毎日の星スタンプでステラ・ちびステラ・流星などの限定スキンを獲得！' : 'Earn Star Points daily to unlock Stella, Chibi, and Shooting Star card skins.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleStartCreateWallet}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition cursor-pointer active:scale-[0.99] border-t border-amber-200"
              >
                <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>{lang === 'ja' ? '✨ 新しいウォレットを作成 (12単語発行)' : '✨ Create New Wallet (12 Words)'}</span>
              </button>

              <button
                onClick={() => {
                  setImportError('');
                  setImportSecretInput('');
                  setImportMnemonicWords(Array(12).fill(''));
                  setImportMethod('select');
                  setOnboardingView('import');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.99]"
              >
                <ArrowDownLeft className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ja' ? '📥 他のウォレットから引越し (インポート)' : '📥 Import Wallet (LOBSTR / 12 Words)'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Create Flow: Mnemonic Generation */}
        {onboardingView === 'create' && (
          <div className="my-auto py-3 space-y-3.5 z-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mx-auto mb-1">
                <KeyRound className="w-5 h-5" />
              </div>
              <h2 className="text-base font-black text-white">
                {lang === 'ja' ? '12単語リカバリーフレーズ' : '12-Word Recovery Phrase'}
              </h2>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                {lang === 'ja' 
                  ? 'この12単語はあなたのお財布の鍵です。順番通りに紙などにメモし、他人に絶対見せないでください。' 
                  : 'Write down these 12 words in order on paper. Never share them with anyone.'}
              </p>
            </div>

            {/* Mnemonic Grid */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 shadow-inner">
              {newMnemonicWords.map((word, idx) => (
                <div key={idx} className="bg-slate-900/90 border border-slate-800/80 rounded-xl px-2 py-1.5 flex items-center gap-1.5 shadow-sm">
                  <span className="text-[9px] font-mono font-bold text-slate-500 w-4 text-right">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-bold font-mono text-amber-200 truncate select-none">
                    {word}
                  </span>
                </div>
              ))}
            </div>

            {/* Security Notice: No Clipboard Copy (Anti-Spyware) */}
            <div className="py-2.5 px-3 rounded-xl bg-slate-950/70 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px] leading-tight text-slate-300">
                {lang === 'ja'
                  ? '🛡️ クリップボード盗難マルウェア防止のためコピー機能はありません。必ず紙のノート等に順番通り手書きしてください。'
                  : '🛡️ Clipboard copy is disabled for security against spyware. Please write down all 12 words on paper.'}
              </span>
            </div>

            {/* Confirmation Checkbox */}
            <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={mnemonicConfirmed}
                onChange={(e) => setMnemonicConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer accent-amber-500"
              />
              <span className="text-[11px] text-amber-200 leading-snug">
                {lang === 'ja'
                  ? '12単語を安全な場所にメモしました。（紛失するとウォレットや資産を二度と復元できないことを理解しました）'
                  : 'I have backed up these 12 words in a safe place. (I understand lost phrases cannot be recovered)'}
              </span>
            </label>

            {/* Finish Button & Back */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleFinishCreateWallet}
                disabled={!mnemonicConfirmed}
                className={`w-full py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                  mnemonicConfirmed
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 cursor-pointer shadow-amber-500/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>{lang === 'ja' ? 'StarPocket を起動する！' : 'Launch StarPocket!'}</span>
              </button>

              <button
                onClick={() => setOnboardingView('welcome')}
                className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                {lang === 'ja' ? '← 戻る' : '← Back'}
              </button>
            </div>
          </div>
        )}

        {/* Import Flow */}
        {onboardingView === 'import' && (
          <div className="my-auto py-3 space-y-3.5 z-10 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Step 1: Select Import Method */}
            {importMethod === 'select' && (
              <div className="space-y-3.5 animate-in fade-in">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mx-auto mb-1">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-black text-white">
                    {lang === 'ja' ? 'インポート方法を選択' : 'Select Import Method'}
                  </h2>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                    {lang === 'ja' 
                      ? 'お持ちのキー形式に合わせて選んでください。' 
                      : 'Choose the format of your existing wallet credentials.'}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => {
                      setImportError('');
                      setImportMethod('secret');
                    }}
                    className="w-full p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400/60 flex items-center gap-3 text-left transition cursor-pointer active:scale-[0.99] shadow-md group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 group-hover:scale-105 transition">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-white">
                          {lang === 'ja' ? '🔑 秘密鍵で引越し' : '🔑 Import with Secret Key'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                        {lang === 'ja' ? 'Sから始まる56文字のStellar秘密鍵（LOBSTR等からエクスポート）' : '56-character Stellar secret key starting with S...'}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setImportError('');
                      setMnemonicLength(12);
                      setImportMnemonicWords(Array(12).fill(''));
                      setImportMethod('mnemonic');
                    }}
                    className="w-full p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-400/60 flex items-center gap-3 text-left transition cursor-pointer active:scale-[0.99] shadow-md group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 group-hover:scale-105 transition">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-white">
                          {lang === 'ja' ? '📝 12単語フレーズで引越し' : '📝 Import with 12 Words'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                        {lang === 'ja' ? 'LOBSTRなど一般的なウォレット（12個の英単語）' : '12-word recovery phrase (LOBSTR / standard)'}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setImportError('');
                      setMnemonicLength(24);
                      setImportMnemonicWords(Array(24).fill(''));
                      setImportMethod('mnemonic');
                    }}
                    className="w-full p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-purple-400/60 flex items-center gap-3 text-left transition cursor-pointer active:scale-[0.99] shadow-md group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0 group-hover:scale-105 transition">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-white">
                          {lang === 'ja' ? '🛡️ 24単語フレーズで引越し' : '🛡️ Import with 24 Words'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                        {lang === 'ja' ? 'Ledger等のハードウェアウォレット（24個の英単語）' : '24-word recovery phrase (Ledger / Hardware)'}
                      </p>
                    </div>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setOnboardingView('welcome')}
                    className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  >
                    {lang === 'ja' ? '← TOPに戻る' : '← Back to TOP'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2A: Secret Key Input */}
            {importMethod === 'secret' && (
              <div className="space-y-3.5 animate-in fade-in">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mx-auto mb-1">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-black text-white">
                    {lang === 'ja' ? '秘密鍵を入力' : 'Enter Secret Key'}
                  </h2>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                    {lang === 'ja' 
                      ? 'LOBSTR等のウォレット設定からエクスポートした56文字の秘密鍵（S...）を入力してください。' 
                      : 'Enter the 56-char Stellar secret key starting with S...'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <span>{lang === 'ja' ? 'Stellar 秘密鍵 (S...)' : 'Secret Key (S...)'}</span>
                      {importSecretInput.startsWith('S') && importSecretInput.length === 56 && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowSecretInputEye(!showSecretInputEye)}
                        className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-0.5 cursor-pointer"
                      >
                        {showSecretInputEye ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showSecretInputEye ? (lang === 'ja' ? '隠す' : 'Hide') : (lang === 'ja' ? '表示' : 'Show')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            if (text) setImportSecretInput(text.trim());
                          } catch (e) {
                            console.error('Clipboard read failed:', e);
                          }
                        }}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{lang === 'ja' ? '貼り付け' : 'Paste'}</span>
                      </button>
                    </div>
                  </div>

                  <input
                    type={showSecretInputEye ? 'text' : 'password'}
                    value={importSecretInput}
                    onChange={(e) => setImportSecretInput(e.target.value.trim())}
                    placeholder="SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-600 outline-none transition"
                  />

                  {importError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold animate-in fade-in">
                      ⚠️ {importError}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => handleExecuteImportMethod('secret')}
                    disabled={importLoading || !importSecretInput.trim()}
                    className={`w-full py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                      importSecretInput.trim() && !importLoading
                        ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 text-slate-950 cursor-pointer shadow-cyan-500/30'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    {importLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{lang === 'ja' ? 'ウォレット読込中...' : 'Importing...'}</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>{lang === 'ja' ? '秘密鍵でウォレットを復元' : 'Restore with Secret Key'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setImportError('');
                      setImportMethod('select');
                    }}
                    className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  >
                    {lang === 'ja' ? '← 方法を選び直す' : '← Change Method'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2B: Mnemonic Input (12 or 24 Separate Boxes) */}
            {importMethod === 'mnemonic' && (() => {
              const filledCount = importMnemonicWords.filter(w => w.trim().length > 0).length;
              const isComplete = filledCount === mnemonicLength;

              return (
                <div className="space-y-3 animate-in fade-in">
                  <div className="text-center space-y-1">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-1 border ${
                      mnemonicLength === 12
                        ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                        : 'bg-purple-500/20 border-purple-400/40 text-purple-300'
                    }`}>
                      {mnemonicLength === 12 ? <FileText className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                    </div>
                    <h2 className="text-base font-black text-white">
                      {mnemonicLength === 12 
                        ? (lang === 'ja' ? '12単語フレーズを入力' : 'Enter 12-Word Phrase')
                        : (lang === 'ja' ? '24単語フレーズを入力' : 'Enter 24-Word Phrase')}
                    </h2>
                    <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                      {lang === 'ja' 
                        ? `紙にメモした${mnemonicLength}個の英単語を01から順番に手入力してください。（スペースで次の枠へ自動移動）` 
                        : `Enter all ${mnemonicLength} recovery words in order. Space moves to next box.`}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <label className="text-[11px] font-bold text-slate-300">
                          {lang === 'ja' ? `${mnemonicLength}個の単語枠` : `${mnemonicLength} Word Boxes`}
                        </label>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded-full border transition ${
                          isComplete 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' 
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {filledCount} / {mnemonicLength} {isComplete ? '✓' : ''}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {filledCount > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setImportMnemonicWords(Array(mnemonicLength).fill(''));
                              setImportError('');
                            }}
                            className="text-[10px] text-slate-400 hover:text-slate-200 font-bold cursor-pointer"
                          >
                            {lang === 'ja' ? 'クリア' : 'Clear'}
                          </button>
                        )}
                        <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-slate-400" />
                          <span>{lang === 'ja' ? '手入力保護' : 'Manual Entry'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Word Boxes Grid */}
                    <div className="grid grid-cols-3 gap-1.5 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 shadow-inner max-h-[260px] overflow-y-auto">
                      {importMnemonicWords.map((word, idx) => (
                        <div
                          key={idx}
                          className={`bg-slate-900/90 border rounded-xl px-2 py-1.5 flex items-center gap-1.5 shadow-sm transition focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/40 ${
                            word ? 'border-amber-400/50 bg-amber-500/5' : 'border-slate-800/80'
                          }`}
                        >
                          <span className={`text-[9px] font-mono font-bold w-3.5 text-right shrink-0 select-none ${
                            word ? 'text-amber-400' : 'text-slate-500'
                          }`}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <input
                            ref={(el) => (mnemonicInputRefs.current[idx] = el)}
                            type="text"
                            value={word}
                            onChange={(e) => handleMnemonicWordChange(idx, e.target.value, false)}
                            onKeyDown={(e) => handleMnemonicKeyDown(idx, e, false)}
                            onPaste={(e) => {
                              e.preventDefault();
                              const text = e.clipboardData ? e.clipboardData.getData('text').trim() : '';
                              if (!text.includes(' ') && !text.includes('\n') && !text.includes(',')) {
                                handleMnemonicWordChange(idx, text, false);
                              }
                            }}
                            placeholder=""
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck="false"
                            className="w-full bg-transparent text-xs font-mono font-bold text-amber-200 placeholder-slate-700 outline-none p-0 min-w-0"
                          />
                        </div>
                      ))}
                    </div>

                    {importError && (
                      <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold animate-in fade-in">
                        ⚠️ {importError}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => handleExecuteImportMethod('mnemonic')}
                      disabled={importLoading || !isComplete}
                      className={`w-full py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                        isComplete && !importLoading
                          ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 cursor-pointer shadow-amber-500/30'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      {importLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{lang === 'ja' ? 'ウォレット読込中...' : 'Importing...'}</span>
                        </>
                      ) : (
                        <>
                          {mnemonicLength === 12 ? <FileText className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                          <span>
                            {lang === 'ja' ? `${mnemonicLength}単語でウォレットを復元` : `Restore with ${mnemonicLength} Words`}
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setImportError('');
                        setImportMethod('select');
                      }}
                      className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-slate-200 transition cursor-pointer"
                    >
                      {lang === 'ja' ? '← 方法を選び直す' : '← Change Method'}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Footer info */}
        <div className="text-center pt-3 z-10">
          <p className="text-[10px] text-slate-400 font-medium">
            StarPocket • Public Goods on Stellar Testnet • 100% Non-Custodial
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${skin.bgClass} text-slate-100 flex flex-col justify-between max-w-md mx-auto relative px-4 py-4 font-sans select-none transition-colors duration-500`}>
      
      {/* Background ambient light */}
      <div className={`fixed top-[-80px] left-[-80px] w-72 h-72 ${skin.glow1} rounded-full blur-3xl pointer-events-none transition-all duration-700`} />
      <div className={`fixed bottom-[-80px] right-[-80px] w-72 h-72 ${skin.glow2} rounded-full blur-3xl pointer-events-none transition-all duration-700`} />

      {/* Ambient background aura (Clean deep cosmos for 100% text readability) */}
      {(currentCardFace === 'stella' || currentCardFace === 'chibi') && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[420px] h-[360px] rounded-full bg-gradient-to-b from-purple-900/10 via-cyan-900/10 to-transparent blur-3xl" />
        </div>
      )}

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

        {/* Right Header items: Compact Star Points & Unified Settings */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Star Points Badge (Click to open Rewards / Calendar) */}
          <button
            onClick={() => {
              setActiveTab('reward');
              if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
              }
            }}
            className="flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 hover:from-amber-500/30 hover:to-yellow-500/20 border border-amber-400/40 px-2 py-1 rounded-full text-[11px] font-mono font-black text-amber-300 shadow-sm shadow-amber-400/20 transition cursor-pointer active:scale-95"
            title="Star Points (SP) / 星ポイント"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
            <span>{gamification.starPoints} SP</span>
          </button>

          {/* Unified Settings & Customization Button */}
          <button
            onClick={() => {
              setShowSettingsModal(true);
              if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
              }
            }}
            className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 hover:border-amber-400 px-2 py-1 rounded-full text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer active:scale-95 shadow-sm"
            title="Settings, Themes & Language / 設定・着せ替え"
          >
            <span className="text-xs leading-none">{skin.icon}</span>
            <Settings className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* 👛 ACTIVE WALLET SELECTOR BAR */}
      <div className="flex items-center justify-between mt-2 px-0.5">
        <button
          onClick={() => {
            setShowWalletSwitchModal(true);
            if (window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 transition cursor-pointer active:scale-95 shadow-md shadow-black/40"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold text-xs text-amber-200">
            {activeWalletObj ? activeWalletObj.name : 'お財布 1'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            ({walletAddress.slice(0, 4)}...{walletAddress.slice(-4)})
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        <span className="text-[10px] text-slate-500 font-mono">
          {wallets.length} {lang === 'ja' ? '個のお財布' : 'Wallets'}
        </span>
      </div>

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
          <Calendar className="w-3.5 h-3.5" />
          <span>{t('tabDailyDrop')}</span>
        </button>
      </div>

      {/* MAIN BODY CONTENT (SWIPEABLE TABS) */}
      <main 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="space-y-3.5 my-auto pb-3 min-h-[460px] touch-pan-y"
      >
        
        {/* ========================================================= */}
        {/* 👛 TAB 1: WALLET & MULTI-ASSET PORTFOLIO */}
        {/* ========================================================= */}
        {activeTab === 'wallet' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* MAIN BALANCE CARD (LIMITED VIP CARD EDITION) */}
            <div 
              onClick={(e) => {
                if (e.target.closest('button, a, input')) return;
                const targetSkin = (currentCardFace === 'cyber_matrix') ? 'shooting_star' : currentCardFace;
                if (targetSkin === 'stella' || targetSkin === 'chibi' || targetSkin === 'shooting_star') {
                  setShowcaseSkin(targetSkin);
                  setShowcaseModal(true);
                  if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                  }
                }
              }}
              className={`glass-panel rounded-2xl p-5 relative overflow-hidden shadow-2xl transition-all duration-300 ${
                (currentCardFace === 'stella' || currentCardFace === 'chibi' || currentCardFace === 'shooting_star' || currentCardFace === 'cyber_matrix') ? 'cursor-pointer group' : ''
              } ${
                currentCardFace === 'stella'
                  ? 'border border-purple-400/50 shadow-purple-950/40 bg-gradient-to-br from-[#13112b] via-[#0d1326] to-[#070b18]'
                  : currentCardFace === 'chibi'
                    ? 'border border-cyan-400/50 shadow-cyan-950/40 bg-gradient-to-br from-[#0c182c] via-[#0d1428] to-[#080d1a]'
                    : (currentCardFace === 'shooting_star' || currentCardFace === 'cyber_matrix')
                      ? 'border border-cyan-400/60 shadow-lg shadow-cyan-950/70 bg-[#060818]'
                      : `${skin.accentBorder} bg-slate-900/80`
              }`}
            >
              {/* 💳 VIP Character Card Face Artwork (Tap anywhere on card to view full art) */}
              {currentCardFace === 'stella' && (
                <div 
                  onClick={() => {
                    setShowcaseSkin('stella');
                    setShowcaseModal(true);
                    if (window.Telegram?.WebApp?.HapticFeedback) {
                      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                    }
                  }}
                  className="absolute right-0 top-0 bottom-0 w-44 sm:w-48 pointer-events-auto cursor-pointer group select-none overflow-hidden z-10"
                  title={lang === 'ja' ? 'タップで全身イラスト鑑賞' : 'Tap to view full body art'}
                >
                  {/* Subtle fade so the balance text on the left stays 100% solid & readable */}
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0d1326]/75 to-[#0d1326] z-10 pointer-events-none" />
                  <div className="absolute top-2 right-2 w-28 h-28 bg-purple-500/25 rounded-full blur-xl pointer-events-none" />
                  <img
                    src="/stella_techwear_skin.jpg"
                    alt="Stella VIP Card Art"
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                    style={{ objectPosition: 'center 18%' }}
                  />
                </div>
              )}

              {currentCardFace === 'chibi' && (
                <div 
                  onClick={() => {
                    setShowcaseSkin('chibi');
                    setShowcaseModal(true);
                    if (window.Telegram?.WebApp?.HapticFeedback) {
                      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                    }
                  }}
                  className="absolute right-0 top-0 bottom-0 w-44 sm:w-48 pointer-events-auto cursor-pointer group select-none overflow-hidden z-10"
                  title={lang === 'ja' ? 'タップで全身イラスト鑑賞' : 'Tap to view full body art'}
                >
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0d1428]/75 to-[#0d1428] z-10 pointer-events-none" />
                  <div className="absolute top-2 right-2 w-28 h-28 bg-cyan-400/25 rounded-full blur-xl pointer-events-none" />
                  <img
                    src="/chibi_stella_skin.jpg"
                    alt="Chibi Stella VIP Card Art"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                    style={{ objectPosition: 'center 38%' }}
                  />
                </div>
              )}

              {/* 🌠 Cyber Shooting Star Artwork (Cosmic shooting star & cyber constellations without character) */}
              {(currentCardFace === 'shooting_star' || currentCardFace === 'cyber_matrix') && (
                <div 
                  onClick={() => {
                    setShowcaseSkin('shooting_star');
                    setShowcaseModal(true);
                    if (window.Telegram?.WebApp?.HapticFeedback) {
                      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                    }
                  }}
                  className="absolute inset-0 pointer-events-auto cursor-pointer group select-none overflow-hidden rounded-2xl z-10"
                  title={lang === 'ja' ? 'タップで流星アート全景鑑賞' : 'Tap to view cosmic art'}
                >
                  {/* High-res Cyber Shooting Star Background */}
                  <img
                    src="/cyber_shooting_star_card.jpg"
                    alt="Cyber Shooting Star Card Art"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                  />
                  {/* Left & bottom gradients ensure balance figures & action buttons stay 100% crisp & readable */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#060818]/95 via-[#060818]/60 to-transparent z-10 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060818]/85 via-transparent to-transparent z-10 pointer-events-none" />

                  {/* Dynamic animated shooting stars crossing the sky */}
                  <div className="absolute top-2 right-12 w-36 h-[1.5px] bg-gradient-to-l from-white via-cyan-300 to-transparent rotate-[-35deg] animate-shooting-star-1 blur-[0.5px] shadow-[0_0_8px_#38bdf8] z-20 pointer-events-none" />
                  <div className="absolute top-8 right-28 w-28 h-[1.5px] bg-gradient-to-l from-amber-200 via-cyan-400 to-transparent rotate-[-35deg] animate-shooting-star-2 blur-[0.5px] shadow-[0_0_8px_#38bdf8] z-20 pointer-events-none" />
                  <div className="absolute top-4 right-4 w-44 h-[1.5px] bg-gradient-to-l from-white via-fuchsia-400 to-transparent rotate-[-35deg] animate-shooting-star-3 blur-[0.5px] shadow-[0_0_8px_#c084fc] z-20 pointer-events-none" />

                  {/* Twinkling star nodes */}
                  <div className="absolute top-4 right-20 text-[10px] text-cyan-300 animate-twinkle pointer-events-none">✦</div>
                  <div className="absolute top-12 right-10 text-[8px] text-amber-300 animate-twinkle pointer-events-none" style={{ animationDelay: '1.2s' }}>✧</div>
                  <div className="absolute bottom-8 right-32 text-[9px] text-fuchsia-300 animate-twinkle pointer-events-none" style={{ animationDelay: '2.1s' }}>✦</div>
                </div>
              )}

              {/* CARD FOREGROUND CONTENT */}
              <div className="relative z-20 pointer-events-none">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <div className="flex items-center gap-2 flex-wrap pointer-events-auto">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                      <Coins className="w-4 h-4 text-amber-400" />
                      {t('totalBalance')}
                    </span>
                    <button 
                      onClick={() => fetchAll(activeAddress)} 
                      className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-[11px] text-slate-400 cursor-pointer"
                      title={t('refresh')}
                    >
                      <RefreshCw className={`w-3 h-3 ${loadingBalance ? 'animate-spin text-cyan-400' : ''}`} />
                      <span>{loadingBalance ? t('updating') : t('refresh')}</span>
                    </button>
                    {/* VIP Edition Badge in Header Row */}
                    {currentCardFace === 'stella' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowcaseSkin('stella');
                          setShowcaseModal(true);
                          if (window.Telegram?.WebApp?.HapticFeedback) {
                            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                          }
                        }}
                        className="flex items-center gap-1 bg-purple-950/80 hover:bg-purple-900 border border-purple-400/50 hover:border-cyan-300 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-cyan-300 shadow-sm backdrop-blur-sm cursor-pointer transition active:scale-95"
                        title={lang === 'ja' ? 'タップで全身鑑賞' : 'Tap to view full art'}
                      >
                        <Sparkles className="w-2.5 h-2.5 text-purple-300" />
                        <span>STELLA VIP</span>
                      </button>
                    )}
                    {currentCardFace === 'chibi' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowcaseSkin('chibi');
                          setShowcaseModal(true);
                          if (window.Telegram?.WebApp?.HapticFeedback) {
                            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                          }
                        }}
                        className="flex items-center gap-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/50 hover:border-amber-300 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-amber-300 shadow-sm backdrop-blur-sm cursor-pointer transition active:scale-95"
                        title={lang === 'ja' ? 'タップで全身鑑賞' : 'Tap to view full art'}
                      >
                        <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                        <span>CHIBI VIP</span>
                      </button>
                    )}
                    {(currentCardFace === 'shooting_star' || currentCardFace === 'cyber_matrix') && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowcaseSkin('shooting_star');
                          setShowcaseModal(true);
                          if (window.Telegram?.WebApp?.HapticFeedback) {
                            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                          }
                        }}
                        className="flex items-center gap-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/50 hover:border-cyan-300 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-cyan-300 shadow-sm backdrop-blur-sm cursor-pointer transition active:scale-95"
                        title={lang === 'ja' ? 'タップで流星鑑賞' : 'Tap to view art'}
                      >
                        <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                        <span>METEOR VIP</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 my-2 flex-wrap pointer-events-auto">
                  <span className="text-4xl font-extrabold tracking-tight text-white font-mono leading-none drop-shadow-sm">
                    {balance}
                  </span>
                  <div className="inline-flex items-center gap-1.5 bg-amber-400/15 border border-amber-400/30 px-2.5 py-1 rounded-xl shadow-sm">
                    <XlmIcon className="w-4 h-4 rounded-md shrink-0 shadow-sm" />
                    <span className="text-xs font-black text-amber-300 font-mono tracking-wide leading-none">
                      XLM
                    </span>
                  </div>
                  {(parseFloat(balance) === 0 || isNaN(parseFloat(balance))) && (
                    <button
                      type="button"
                      disabled={fundingFriendbot}
                      onClick={handleFriendbotFund}
                      className="text-[10px] text-amber-300 bg-amber-400/15 border border-amber-400/40 hover:bg-amber-400/25 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 cursor-pointer transition active:scale-95 disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{fundingFriendbot ? '...' : (lang === 'ja' ? '🚀 10,000 XLM 受取' : '🚀 Get 10k XLM')}</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 pointer-events-auto">
                  <span className="font-mono">≈ ${(parseFloat(balance) * 0.135).toFixed(2)} USD</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">{t('nearZeroFee')}</span>
                </div>

                {/* ACTION BUTTONS (Send / Receive / Swap) */}
                <div className="grid grid-cols-3 gap-1.5 mt-4 pt-3 border-t border-slate-800/80 pointer-events-auto">
                  <button
                    onClick={() => setShowReceiveModal(true)}
                    className="py-2 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-1 text-[11px] font-bold text-slate-200 transition cursor-pointer active:scale-95 shadow-sm"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5 text-cyan-400" />
                    {t('btnReceive')}
                  </button>
                  <button
                    onClick={() => setShowSendModal(true)}
                    className="py-2 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-1 text-[11px] font-bold text-slate-200 transition cursor-pointer active:scale-95 shadow-sm"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                    {t('btnSend')}
                  </button>
                  <button
                    onClick={() => setActiveTab('swap')}
                    className="py-2 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-300 transition cursor-pointer active:scale-95 shadow-sm"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
                    {t('btnSwap')}
                  </button>
                </div>
              </div>
            </div>

            {/* MULTI-ASSET PORTFOLIO LIST */}
            <div className="glass-panel rounded-2xl p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2.5 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  {t('portfolioAssets')}
                </span>
                <span className="text-[10px] text-cyan-400/80 font-mono">
                  {lang === 'ja' ? 'タップで詳細・レート' : 'Tap for rates'}
                </span>
              </div>

              <div className="space-y-2">
                {/* 1. XLM (Native) */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAssetDetail(ASSET_DETAILS.XLM);
                    if (window.Telegram?.WebApp?.HapticFeedback) {
                      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                    }
                  }}
                  className="w-full bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800/90 hover:border-amber-400/50 rounded-xl p-2.5 flex items-center justify-between transition cursor-pointer active:scale-[0.99] group text-left backdrop-blur-sm shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <XlmIcon className="w-8 h-8 rounded-xl shadow-md shrink-0" />
                    <div>
                      <p className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">Stellar Lumens (XLM)</p>
                      <p className="text-[9px] text-slate-400 font-mono">1 XLM ≈ $0.1350 <span className="text-emerald-400 font-bold">+2.4%</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-mono font-bold text-xs text-white">{balance}</p>
                      <p className="text-[9px] text-slate-400 font-mono">≈ ${(parseFloat(balance) * 0.135).toFixed(2)}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors shrink-0" />
                  </div>
                </button>

                {/* 2. USDC (Circle) */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAssetDetail(ASSET_DETAILS.USDC);
                    if (window.Telegram?.WebApp?.HapticFeedback) {
                      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                    }
                  }}
                  className="w-full bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800/90 hover:border-cyan-400/50 rounded-xl p-2.5 flex items-center justify-between transition cursor-pointer active:scale-[0.99] group text-left backdrop-blur-sm shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <UsdcIcon className="w-8 h-8 rounded-xl shadow-md shrink-0" />
                    <div>
                      <p className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">USD Coin (USDC)</p>
                      <p className="text-[9px] text-slate-400 font-mono">1 USDC = $1.0000 <span className="text-slate-400">Pegged</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-mono font-bold text-xs text-white">{usdcBalance}</p>
                      <p className="text-[9px] text-slate-400 font-mono">≈ ${(parseFloat(usdcBalance || 0) * 1.00).toFixed(2)}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                  </div>
                </button>

                {/* 3. yXLM (UltraStellar Yield XLM) */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAssetDetail(ASSET_DETAILS.yXLM);
                    if (window.Telegram?.WebApp?.HapticFeedback) {
                      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-amber-950/30 to-slate-900/95 hover:from-amber-950/45 hover:to-slate-900 border border-amber-500/35 hover:border-amber-400/60 rounded-xl p-2.5 flex items-center justify-between transition cursor-pointer active:scale-[0.99] group text-left backdrop-blur-sm shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <YXlmIcon className="w-8 h-8 rounded-xl shadow-md shrink-0" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-xs text-amber-200 group-hover:text-amber-100 transition-colors">yXLM (Yield Lumens)</p>
                        <span className="text-[8px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">5.0% APY</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-mono">1 yXLM ≈ 1.05 XLM <span className="text-emerald-400 font-bold">{t('compoundingDaily')}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-mono font-bold text-xs text-amber-300">{vaultInfo.yXLM}</p>
                      <p className="text-[9px] text-slate-400 font-mono">≈ ${(parseFloat(vaultInfo.yXLM || 0) * 0.1418).toFixed(2)}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors shrink-0" />
                  </div>
                </button>

                {/* 4. yUSDC (UltraStellar Yield USDC) */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAssetDetail(ASSET_DETAILS.yUSDC);
                    if (window.Telegram?.WebApp?.HapticFeedback) {
                      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-cyan-950/30 to-slate-900/95 hover:from-cyan-950/45 hover:to-slate-900 border border-cyan-500/35 hover:border-cyan-400/60 rounded-xl p-2.5 flex items-center justify-between transition cursor-pointer active:scale-[0.99] group text-left backdrop-blur-sm shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <YUsdcIcon className="w-8 h-8 rounded-xl shadow-md shrink-0" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-xs text-cyan-200 group-hover:text-cyan-100 transition-colors">yUSDC (Yield Dollar)</p>
                        <span className="text-[8px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.2 rounded font-bold">5.0% APY</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-mono">1 yUSDC ≈ $1.05 <span className="text-emerald-400 font-bold">{t('compoundingDaily')}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-mono font-bold text-xs text-cyan-300">{vaultInfo.yUSDC}</p>
                      <p className="text-[9px] text-slate-400 font-mono">≈ ${(parseFloat(vaultInfo.yUSDC || 0) * 1.05).toFixed(2)}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                  </div>
                </button>
              </div>
            </div>

            {/* RECENT BLOCKCHAIN ACTIVITY & MEMOS (SHOW TOP 3 + VIEW ALL) */}
            <div className="glass-panel rounded-2xl p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'ja' ? '送受金 ＆ メモ履歴' : 'Activity & Memos'}</span>
                </span>
                <div className="flex items-center gap-2">
                  {activityList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowActivityModal(true)}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{lang === 'ja' ? 'すべて見る' : 'View all'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => fetchActivity(activeAddress)}
                    className="text-[10px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 cursor-pointer font-mono"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-2.5 h-2.5 ${loadingActivity ? 'animate-spin text-cyan-400' : ''}`} />
                  </button>
                </div>
              </div>

              {activityList.length === 0 ? (
                <div className="text-center py-5 text-slate-500 text-xs font-mono">
                  {loadingActivity 
                    ? (lang === 'ja' ? 'オンチェーン履歴を照会中...' : 'Fetching on-chain records...') 
                    : (lang === 'ja' ? 'まだ取引履歴がありません' : 'No transactions recorded yet')}
                </div>
              ) : (
                <div className="space-y-2">
                  {activityList.slice(0, 3).map((item) => {
                    const isReceive = item.type === 'receive' || item.type === 'created';
                    return (
                      <div
                        key={item.id}
                        className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded-xl p-2.5 transition backdrop-blur-sm shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isReceive 
                                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                                : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                            }`}>
                              {isReceive ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-white">
                                  {isReceive ? (lang === 'ja' ? '受取' : 'Received') : (lang === 'ja' ? '送金' : 'Sent')}
                                </span>
                                {getContactName(item.counterparty) ? (
                                  <span className="text-[10px] text-amber-300 font-bold bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.2 rounded truncate max-w-[120px]">
                                    ⭐ {getContactName(item.counterparty)}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-300 font-mono truncate">
                                    {item.counterparty ? `${item.counterparty.slice(0, 4)}...${item.counterparty.slice(-4)}` : 'Friendbot'}
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] text-slate-400 font-mono block">
                                {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className={`font-mono font-bold text-xs block ${isReceive ? 'text-emerald-400' : 'text-slate-100'}`}>
                              {isReceive ? '+' : '-'}{parseFloat(item.amount).toFixed(2)} {item.asset}
                            </span>
                            <a
                              href={item.explorerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9px] text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-0.5 font-mono cursor-pointer"
                            >
                              <span>TX</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>

                        {/* DISPLAY MEMO */}
                        {item.memo && (
                          <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px]">
                            <span className="text-amber-400/90 font-mono font-bold text-[9px] bg-amber-400/15 border border-amber-400/30 px-1.5 py-0.2 rounded shrink-0">
                              MEMO
                            </span>
                            <span className="text-amber-200 font-mono bg-slate-950/90 px-2 py-0.5 rounded border border-slate-800 truncate flex-1 text-[11px] shadow-inner">
                              💬 "{item.memo}"
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {activityList.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setShowActivityModal(true)}
                      className="w-full mt-2 py-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <span>{lang === 'ja' ? `過去の全取引を表示 (${activityList.length}件)` : `View all ${activityList.length} transactions`}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
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
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowVaultTutorialModal(true)}
                    className="text-[10px] text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 border border-cyan-400/30 px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition active:scale-95"
                  >
                    <Info className="w-3 h-3 text-cyan-400" />
                    <span>{lang === 'ja' ? '💡 金庫とは？' : '💡 What is Vault?'}</span>
                  </button>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                    {t('swapFeeBadge')}
                  </span>
                </div>
              </div>

              <form onSubmit={handleExecuteSwap} className="space-y-3">
                {/* FROM BOX */}
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>{t('youPay')}</span>
                    <span>
                      {t('balPrefix')}: {
                        swapFrom === 'XLM' ? balance :
                        swapFrom === 'USDC' ? usdcBalance :
                        swapFrom === 'yXLM' ? vaultInfo.yXLM : vaultInfo.yUSDC
                      } {swapFrom}
                    </span>
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
                        onClick={() => {
                          let maxVal = '0';
                          if (swapFrom === 'XLM') maxVal = Math.max(0, parseFloat(balance) - 0.05).toFixed(2);
                          else if (swapFrom === 'USDC') maxVal = parseFloat(usdcBalance).toFixed(2);
                          else if (swapFrom === 'yXLM') maxVal = parseFloat(vaultInfo.yXLM).toFixed(2);
                          else if (swapFrom === 'yUSDC') maxVal = parseFloat(vaultInfo.yUSDC).toFixed(2);
                          setSwapAmount(maxVal);
                        }}
                        className="text-[10px] px-2 py-1 rounded bg-slate-800 text-amber-400 font-bold cursor-pointer"
                      >
                        {t('btnMax')}
                      </button>
                      <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
                        <TokenIcon symbol={swapFrom} className="w-5 h-5 rounded-md" />
                        <select
                          value={swapFrom}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSwapFrom(val);
                            if (val === swapTo) {
                              const candidates = ['USDC', 'yUSDC', 'XLM', 'yXLM'].filter(x => x !== val);
                              setSwapTo(candidates[0]);
                            }
                          }}
                          className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer"
                        >
                          <option value="XLM" className="bg-slate-900">XLM</option>
                          <option value="USDC" className="bg-slate-900">USDC</option>
                          <option value="yXLM" className="bg-slate-900">yXLM</option>
                          <option value="yUSDC" className="bg-slate-900">yUSDC</option>
                        </select>
                      </div>
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
                    <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
                      <TokenIcon symbol={swapTo} className="w-5 h-5 rounded-md" />
                      <select
                        value={swapTo}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSwapTo(val);
                          if (val === swapFrom) {
                            const candidates = ['XLM', 'USDC', 'yXLM', 'yUSDC'].filter(x => x !== val);
                            setSwapFrom(candidates[0]);
                          }
                        }}
                        className="bg-transparent text-white font-bold text-xs outline-none shrink-0 cursor-pointer"
                      >
                        <option value="USDC" className="bg-slate-900">USDC</option>
                        <option value="XLM" className="bg-slate-900">XLM</option>
                        <option value="yXLM" className="bg-slate-900">yXLM</option>
                        <option value="yUSDC" className="bg-slate-900">yUSDC</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SWAP RATE INFO */}
                <div className="text-[11px] text-slate-400 px-1 flex items-center justify-between font-mono">
                  <span>{t('rateLabel')}:</span>
                  <span>1 {swapFrom} ≈ {(SWAP_RATES[`${swapFrom}_${swapTo}`] || 1.0).toFixed(4)} {swapTo}</span>
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
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowVaultTutorialModal(true)}
                    className="text-[10px] text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 border border-cyan-400/30 px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition active:scale-95"
                  >
                    <Info className="w-3 h-3 text-cyan-400" />
                    <span>{lang === 'ja' ? '💡 金庫の仕組み' : '💡 How It Works'}</span>
                  </button>
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    {t('apyBadge')}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 my-2.5 leading-relaxed">
                {t('vaultHeroDesc')}
              </p>

              {/* VAULT STATS GRID */}
              <div className="grid grid-cols-2 gap-2 my-3">
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      <YXlmIcon className="w-3.5 h-3.5 rounded-sm shrink-0" />
                      <span>{t('inVaultYxlm')}</span>
                    </p>
                    <p className="text-xl font-extrabold text-amber-300 font-mono mt-1">
                      {vaultInfo.yXLM}
                    </p>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                      {t('estDailyYield')}: +{vaultInfo.dailyEstXLM} XLM/d
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => { setVaultActionAsset('XLM'); setVaultAmount(''); setVaultMsg(''); setShowVaultDepositModal(true); }}
                      className="flex-1 py-1 text-[10px] font-bold bg-amber-500/20 text-amber-300 rounded hover:bg-amber-500/30 transition text-center cursor-pointer"
                    >
                      + 預入
                    </button>
                    <button
                      type="button"
                      onClick={() => { setVaultActionAsset('XLM'); setVaultAmount(''); setVaultMsg(''); setShowVaultWithdrawModal(true); }}
                      className="flex-1 py-1 text-[10px] font-bold bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition text-center cursor-pointer"
                    >
                      - 引出
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      <YUsdcIcon className="w-3.5 h-3.5 rounded-sm shrink-0" />
                      <span>{t('inVaultYusdc')}</span>
                    </p>
                    <p className="text-xl font-extrabold text-cyan-300 font-mono mt-1">
                      {vaultInfo.yUSDC}
                    </p>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                      {t('estDailyYield')}: +{vaultInfo.dailyEstUSDC} USDC/d
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => { setVaultActionAsset('USDC'); setVaultAmount(''); setVaultMsg(''); setShowVaultDepositModal(true); }}
                      className="flex-1 py-1 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 rounded hover:bg-cyan-500/30 transition text-center cursor-pointer"
                    >
                      + 預入
                    </button>
                    <button
                      type="button"
                      onClick={() => { setVaultActionAsset('USDC'); setVaultAmount(''); setVaultMsg(''); setShowVaultWithdrawModal(true); }}
                      className="flex-1 py-1 text-[10px] font-bold bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition text-center cursor-pointer"
                    >
                      - 引出
                    </button>
                  </div>
                </div>
              </div>

              {/* TOTAL EARNED BANNER */}
              <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-2.5 flex items-center justify-between text-xs mb-3">
                <span className="text-slate-300 text-[11px] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  {t('totalAccruedYield')}
                </span>
                <span className="font-mono font-bold text-emerald-400 text-right">
                  +{vaultInfo.totalEarnedXLM} XLM <span className="text-cyan-400 ml-1">/ +{vaultInfo.totalEarnedUSDC} USDC</span>
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
                  { 
                    id: 'chibi_skin', 
                    name: lang === 'ja' ? 'ちびステラスキン ⭐' : 'Chibi Stella Skin ⭐', 
                    desc: lang === 'ja' ? 'お星さまを抱っこしたちびステラが背景でふわふわ浮遊！' : 'Chibi Stella hugging a star floats softly in your background!', 
                    cost: 150, 
                    icon: '🌟' 
                  },
                  { 
                    id: 'shooting_star_skin', 
                    name: lang === 'ja' ? 'サイバー流星スキン 🌠' : 'Cyber Shooting Star 🌠', 
                    desc: lang === 'ja' ? '宇宙の星屑と流星が駆け抜けるサイバーカード券面！' : 'Cosmic stardust & meteor trails on your card face!', 
                    cost: 150, 
                    icon: '🌠' 
                  },
                  { 
                    id: 'streak_shield', 
                    name: t('perkStreakShield'), 
                    desc: t('perkStreakShieldDesc'), 
                    cost: 200, 
                    icon: '🛡️' 
                  },
                ].map((item) => {
                  const unlocked = gamification.perks?.includes(item.id);
                  const canAfford = (gamification.starPoints || 0) >= item.cost;
                  return (
                    <div 
                      key={item.id} 
                      className={`p-2.5 rounded-xl bg-slate-950/60 border flex flex-col justify-between transition ${
                        item.comingSoon 
                          ? 'border-dashed border-slate-800 opacity-60' 
                          : 'border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-sm">{item.icon}</span>
                          <span className={`text-[11px] font-extrabold truncate ${item.comingSoon ? 'text-slate-400' : 'text-white'}`}>{item.name}</span>
                        </div>
                        <p className="text-[9px] text-slate-400 leading-tight mb-2 line-clamp-2">{item.desc}</p>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                        <span className="text-[10px] font-black font-mono text-amber-300">{item.cost} SP</span>
                        {item.comingSoon ? (
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700/60 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5 text-slate-400" />
                            {t('perkComingSoon')}
                          </span>
                        ) : unlocked ? (
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

            {/* 🛡️ PUBLIC GOODS MANIFESTO CARD */}
            <div className="bg-gradient-to-r from-slate-900/90 via-[#101728] to-slate-900/90 rounded-2xl p-4 border border-cyan-500/30 shadow-lg text-center relative overflow-hidden">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="font-extrabold text-xs text-cyan-200">
                  {lang === 'ja' ? '広告ゼロ ＆ 完全手数料無料の公共財' : 'Zero Ads & Zero-Fee Public Goods'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                {lang === 'ja'
                  ? 'StarPocketはユーザーから手数料や広告収入を一切取らず、Stellar公式（SCF）グラントで運営される純粋な公共財です。'
                  : 'StarPocket operates as a 100% non-profit public goods wallet supported by Stellar Community Grants.'}
              </p>
            </div>

            {/* VIRAL SHARE BUTTON */}
            <div>
              <button
                type="button"
                onClick={handleShareInvite}
                className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center gap-2 text-xs font-bold text-slate-200 transition cursor-pointer active:scale-[0.99]"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>{t('btnInviteFriends')}</span>
              </button>
            </div>
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

            <div className="bg-white p-3 rounded-2xl flex items-center justify-center mx-auto my-3 w-44 h-44 shadow-lg shadow-cyan-950/40 border border-cyan-400/30">
              {receiveQrUrl ? (
                <img src={receiveQrUrl} alt="Wallet Address QR" className="w-38 h-38 object-contain" />
              ) : (
                <QrCode className="w-32 h-32 text-slate-900 animate-pulse" />
              )}
            </div>

            <p className="text-[11px] text-slate-400 text-center mb-2">
              {t('modalReceiveDesc')}
            </p>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 break-all font-mono text-[11px] text-slate-300 text-center mb-3">
              {activeAddress}
            </div>

            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400 text-center mb-4 flex items-center justify-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>
                {lang === 'ja'
                  ? 'StarPocket個人ウォレット宛への入金はメモ（Memo）不要です'
                  : 'No Memo required for StarPocket personal deposits'}
              </span>
            </div>

            <button
              onClick={copyAddress}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer mb-2.5"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? t('btnCopied') : t('btnCopy')}
            </button>

            {/* ONE-CLICK TESTNET 10,000 XLM CHARGE */}
            <div className="pt-2.5 border-t border-slate-800">
              <button
                type="button"
                disabled={fundingFriendbot}
                onClick={handleFriendbotFund}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/20 active:scale-95 transition cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>
                  {fundingFriendbot 
                    ? (lang === 'ja' ? 'Friendbot注入中...' : 'Funding 10,000 XLM...') 
                    : (lang === 'ja' ? '🚀 テスト用 10,000 XLM をチャージ (無料)' : '🚀 Claim 10,000 Testnet XLM (Free)')}
                </span>
              </button>
              {friendbotMsg && (
                <div className="mt-2 text-[10px] p-2 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono text-amber-300">
                  {friendbotMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 📤 SEND MODAL */}
      {/* ========================================================= */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121627] border border-amber-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] text-slate-400 block">{t('recipientLabel')}</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleScanQr}
                      className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono cursor-pointer bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 rounded-md transition active:scale-95"
                      title={lang === 'ja' ? 'QRコードをカメラで読み取る' : 'Scan recipient QR code'}
                    >
                      <ScanLine className="w-3 h-3 text-amber-400" />
                      <span>{lang === 'ja' ? 'QR読取' : 'Scan QR'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressBookModal(true)}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>{lang === 'ja' ? `アドレス帳 (${addressBook.length})` : `Contacts (${addressBook.length})`}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Contact Chips */}
                {addressBook.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 mb-1.5 no-scrollbar">
                    {addressBook.slice(0, 4).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSendDest(c.address);
                          if (c.memo) {
                            setSendMemo(c.memo);
                            setSendMemoType(c.memoType || 'text');
                          }
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border flex items-center gap-1 shrink-0 font-mono transition cursor-pointer ${
                          sendDest === c.address 
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold' 
                            : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <span>{c.tag === 'dev' ? '⭐' : c.tag === 'exchange' ? '🏢' : '👤'}</span>
                        <span className="truncate max-w-[110px]">{c.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="relative">
                  <input
                    type="text"
                    placeholder="G..."
                    value={sendDest}
                    onChange={(e) => setSendDest(e.target.value.trim())}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:border-amber-400 outline-none pr-20"
                  />
                  <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleScanQr}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition cursor-pointer active:scale-95"
                      title={lang === 'ja' ? 'QRコードをカメラで読み取る' : 'Scan QR Code'}
                    >
                      <ScanLine className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                    {sendDest && StrKey.isValidEd25519PublicKey(sendDest) && !getContactName(sendDest) && (
                      <button
                        type="button"
                        onClick={() => openAddContactWithPrefill(sendDest, sendMemo, sendMemoType)}
                        className="text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-1 rounded font-bold cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>{lang === 'ja' ? '保存' : 'Save'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {getContactName(sendDest) && (
                  <p className="text-[10px] text-amber-300 mt-1 font-mono flex items-center gap-1">
                    <span>⭐ {getContactName(sendDest)}</span>
                  </p>
                )}
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

              {/* MEMO FIELD (CRITICAL FOR EXCHANGES) */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="flex items-center gap-1 font-semibold text-slate-300">
                    <span>{lang === 'ja' ? '送金メモ (Memo)' : 'Transaction Memo'}</span>
                    <span className="text-[9px] text-amber-400/90 font-normal">
                      ({lang === 'ja' ? '取引所送金時は必須' : 'Required for exchanges'})
                    </span>
                  </span>
                  <div className="flex gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-[9px] font-mono">
                    <button
                      type="button"
                      onClick={() => setSendMemoType('auto')}
                      className={`px-2 py-0.5 rounded transition cursor-pointer flex items-center gap-0.5 ${
                        sendMemoType === 'auto' 
                          ? 'bg-emerald-500/25 text-emerald-300 font-bold border border-emerald-500/40 shadow-xs' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Zap className="w-2.5 h-2.5" />
                      <span>{lang === 'ja' ? '自動判別' : 'Auto'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSendMemoType('text')}
                      className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                        sendMemoType === 'text' 
                          ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      TEXT
                    </button>
                    <button
                      type="button"
                      onClick={() => setSendMemoType('id')}
                      className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                        sendMemoType === 'id' 
                          ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      ID (数値)
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder={
                    sendMemoType === 'id' 
                      ? (lang === 'ja' ? '例: 12345678 (取引所指定の数字ID)' : 'e.g. 12345678 (Digits only)')
                      : sendMemoType === 'auto'
                      ? (lang === 'ja' ? '例: 12345678 (取引所ID) または メッセージ (自動判別)' : 'e.g. 12345678 (Exchange ID) or message')
                      : (lang === 'ja' ? '例: deposit-tag (最大28文字 / 空欄可)' : 'e.g. deposit-tag (Max 28 chars / optional)')
                  }
                  value={sendMemo}
                  onChange={(e) => setSendMemo(e.target.value)}
                  maxLength={sendMemoType === 'id' ? 20 : 28}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:border-amber-400 outline-none"
                />

                {/* Auto Detection Dynamic Feedback */}
                {sendMemo && sendMemo.trim() && (
                  <div className="mt-1.5 animate-in fade-in">
                    {(/^\d+$/.test(sendMemo.trim())) ? (
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/25 px-2 py-1 rounded-lg">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>
                          {lang === 'ja' 
                            ? '💡 半角数字を検知：取引所宛ての【Memo ID (数値)】として安全に送信されます' 
                            : '💡 Pure digits detected: safely transmitting as Memo ID for exchanges'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[10px] text-cyan-300 font-mono bg-cyan-500/10 border border-cyan-500/25 px-2 py-1 rounded-lg">
                        <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>
                          {lang === 'ja' 
                            ? '💬 文字列を検知：個人宛ての【Memo TEXT (メッセージ)】として送信されます' 
                            : '💬 Text detected: transmitting as Memo TEXT message'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* EXCHANGE CAUTION NOTICE */}
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-start gap-2 text-[10px] text-amber-300 leading-relaxed">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  {lang === 'ja'
                    ? '国内・海外取引所（Binance, bitFlyer, GMO, Bybit等）宛てに送金する場合、取引所で発行される【Memo (メモ)】を必ず入力してください。未入力だと残高に反映されません。'
                    : 'When depositing to centralized exchanges (Binance, Coinbase, bitFlyer, etc.), always provide the required Memo or funds may be lost.'}
                </span>
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
                    onClick={() => { setVaultActionAsset('XLM'); setVaultAmount(''); setVaultMsg(''); }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      vaultActionAsset === 'XLM' 
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <XlmIcon className="w-3.5 h-3.5 rounded-sm" />
                    <span>XLM → yXLM</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setVaultActionAsset('USDC'); setVaultAmount(''); setVaultMsg(''); }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      vaultActionAsset === 'USDC' 
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <UsdcIcon className="w-3.5 h-3.5 rounded-sm" />
                    <span>USDC → yUSDC</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>{t('depositAmount')}</span>
                  <span>{t('availableLabel')}: {vaultActionAsset === 'XLM' ? balance : usdcBalance} {vaultActionAsset}</span>
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
                    onClick={() => setVaultAmount(vaultActionAsset === 'XLM' ? Math.max(0, parseFloat(balance) - 0.1).toFixed(2) : parseFloat(usdcBalance).toFixed(2))}
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
                    onClick={() => { setVaultActionAsset('XLM'); setVaultAmount(''); setVaultMsg(''); }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      vaultActionAsset === 'XLM' 
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <YXlmIcon className="w-3.5 h-3.5 rounded-sm" />
                    <span>yXLM → XLM</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setVaultActionAsset('USDC'); setVaultAmount(''); setVaultMsg(''); }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      vaultActionAsset === 'USDC' 
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <YUsdcIcon className="w-3.5 h-3.5 rounded-sm" />
                    <span>yUSDC → USDC</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>{t('withdrawalAmount')}</span>
                  <span>{vaultActionAsset === 'XLM' ? t('inVaultYxlm') : (lang === 'ja' ? '星の金庫のyUSDC' : 'In Vault yUSDC')}: {vaultActionAsset === 'XLM' ? vaultInfo.yXLM : vaultInfo.yUSDC} {vaultActionAsset === 'XLM' ? 'yXLM' : 'yUSDC'}</span>
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
      {/* ⚙️ UNIFIED SETTINGS, THEME & PROFILE DRAWER */}
      {/* ========================================================= */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-[#121626] border border-amber-500/30 rounded-t-3xl sm:rounded-2xl p-5 max-w-sm w-full shadow-2xl relative max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm text-white">
                  {lang === 'ja' ? '設定 ＆ カスタマイズ' : 'Settings & Customization'}
                </h3>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User & Network Status */}
            <div className="bg-slate-950/70 rounded-2xl p-3 border border-slate-800/80 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-xs font-bold text-cyan-300">
                  {tgUser ? (tgUser.first_name?.[0] || 'U') : '⭐'}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{tgUser ? `@${tgUser.username || tgUser.first_name}` : t('guestUser')}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Stellar Testnet • Active
                  </div>
                </div>
              </div>
              <button
                onClick={copyAddress}
                className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3 text-cyan-400" />
                <span>{copied ? t('btnCopied') : t('btnCopy')}</span>
              </button>
            </div>

            {/* Language Selection */}
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ja' ? '表示言語 (Language)' : 'Display Language'}</span>
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <button
                  onClick={() => {
                    if (lang !== 'ja') toggleLanguage();
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                    lang === 'ja'
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-extrabold shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>🇯🇵 日本語</span>
                </button>
                <button
                  onClick={() => {
                    if (lang !== 'en') toggleLanguage();
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                    lang === 'en'
                      ? 'bg-cyan-400/20 border-cyan-400 text-cyan-300 font-extrabold shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>🇺🇸 English</span>
                </button>
              </div>
            </div>

            {/* Address Book Section */}
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ja' ? 'アドレス帳 (連絡先管理)' : 'Address Book'}</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowAddressBookModal(true);
                }}
                className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-left transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {lang === 'ja' ? '登録済みアドレスの管理' : 'Manage Saved Contacts'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {addressBook.length} {lang === 'ja' ? '件の登録' : 'contacts saved'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* VIP Card Face Art Section */}
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'ja' ? 'VIPカード券面アート' : 'VIP Card Face Art'}</span>
                </span>
                <span className="text-[10px] text-cyan-300/80 font-mono">
                  {lang === 'ja' ? '残高カード券面' : 'Card Design'}
                </span>
              </label>

              <div className="space-y-1.5 mt-1">
                {Object.values(CARD_FACES).map((item) => {
                  const isActive = currentCardFace === item.id;
                  const isLocked = (item.id === 'stella' && !isStellaUnlocked) ||
                    (item.id === 'chibi' && !gamification.perks?.includes('chibi_skin') && localStorage.getItem('starpocket_skin_chibi_unlocked') !== 'true');
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (isLocked) {
                          if (item.id === 'stella') {
                            alert(lang === 'ja' ? '⭐ ウォレットにXLMをチャージすると自動解放されます！' : '⭐ Fund your wallet with XLM to unlock!');
                          } else if (item.id === 'chibi') {
                            alert(lang === 'ja' ? '🌟 星広場（Reward）で 150 SP と交換すると解放されます！' : '🌟 Redeem for 150 SP in the Reward tab to unlock!');
                          }
                          return;
                        }
                        handleSelectCardFace(item.id);
                      }}
                      className={`w-full p-2 rounded-xl flex items-center justify-between transition text-left border ${
                        isLocked 
                          ? 'bg-slate-950/40 border-slate-800/80 opacity-75 cursor-pointer hover:border-slate-700' 
                          : isActive 
                            ? 'bg-slate-900 border-cyan-400 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400 cursor-pointer' 
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sm shadow-sm shrink-0 relative">
                          {item.icon}
                          {isLocked && (
                            <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-slate-700 rounded-full p-0.5 shadow-sm">
                              <Lock className="w-2.5 h-2.5 text-amber-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{lang === 'ja' ? item.name : item.nameEn}</span>
                            {isLocked ? (
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded-full border border-slate-700 flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5 text-amber-400" />
                                {lang === 'ja' ? '未解放' : 'Locked'}
                              </span>
                            ) : isActive ? (
                              <span className="text-[9px] font-bold text-cyan-300 bg-cyan-400/20 px-1.5 py-0.2 rounded-full border border-cyan-400/40">
                                {lang === 'ja' ? '適用中' : 'Active'}
                              </span>
                            ) : null}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {isLocked
                              ? (item.id === 'stella'
                                  ? (lang === 'ja' ? '🔒 ウォレットにXLMをチャージして解放' : '🔒 Fund wallet with XLM to unlock')
                                  : (lang === 'ja' ? '🔒 星広場で 150 SP と交換して解放' : '🔒 Exchange 150 SP in Star Shop'))
                              : (lang === 'ja' ? item.description : item.descriptionEn)
                            }
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {(item.id === 'stella' || item.id === 'chibi') && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowcaseSkin(item.id);
                              setShowcaseModal(true);
                              setShowSettingsModal(false);
                              if (window.Telegram?.WebApp?.HapticFeedback) {
                                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                              }
                            }}
                            className="py-1 px-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/35 border border-purple-400/40 text-[10px] font-bold text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer transition shadow-sm"
                            title={lang === 'ja' ? '全身イラストを鑑賞' : 'View Full Illustration'}
                          >
                            <Eye className="w-3 h-3 text-cyan-300" />
                            <span>{lang === 'ja' ? '全身' : 'View'}</span>
                          </button>
                        )}
                        {!isLocked && (
                          isActive ? (
                            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-700" />
                          )
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Palette Theme Section */}
            <div className="mb-2">
              <label className="text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'ja' ? 'ウォレット配色テーマ' : 'Wallet Color Themes'}</span>
                </span>
                <span className="text-[10px] text-amber-300/80 font-mono">
                  {lang === 'ja' ? 'アプリ全体の色' : 'Color Scheme'}
                </span>
              </label>

              <div className="space-y-1.5 mt-1">
                {Object.values(THEMES).map((item) => {
                  const isActive = currentTheme === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTheme(item.id)}
                      className={`w-full p-2 rounded-xl flex items-center justify-between transition cursor-pointer text-left border ${
                        isActive 
                          ? 'bg-slate-900 border-amber-400 shadow-md shadow-amber-500/20 ring-1 ring-amber-400' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${item.previewGradient} border ${item.previewBorder} flex items-center justify-center text-sm shadow-sm shrink-0`}>
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{lang === 'ja' ? item.name : item.nameEn}</span>
                            {isActive && (
                              <span className="text-[9px] font-bold text-amber-300 bg-amber-400/20 px-1.5 py-0.2 rounded-full border border-amber-400/40">
                                {lang === 'ja' ? '適用中' : 'Active'}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {item.id === 'cosmos' && 'Default Deep Cosmos Navy & Gold'}
                            {item.id === 'cyber' && 'Neon Cyan & Hot Pink'}
                            {item.id === 'sakura' && 'Midnight Plum & Sakura'}
                            {item.id === 'retro' && '8-Bit Dot GameBoy LCD Emerald'}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {isActive ? (
                          <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Wallet Security, Backup & Migration */}
            <div className="mb-4 pt-3 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ja' ? 'ウォレット管理 ＆ 引越し' : 'Wallet Security & Migration'}</span>
              </label>

              <div className="space-y-2 mt-2">
                <button
                  onClick={() => setShowBackupModal(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400/50 text-slate-200 text-xs font-bold flex items-center justify-between transition cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'ja' ? '🔑 ウォレットのバックアップ (12単語/秘密鍵)' : '🔑 Backup Wallet (12 Words / Secret)'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => {
                    setImportError('');
                    setImportSecretInput('');
                    setImportMnemonicWords(Array(12).fill(''));
                    setImportMethod('select');
                    setShowImportModal(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400/50 text-slate-200 text-xs font-bold flex items-center justify-between transition cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2">
                    <ArrowDownLeft className="w-4 h-4 text-cyan-400" />
                    <span>{lang === 'ja' ? '📥 他のウォレットから引越し (インポート)' : '📥 Import / Migrate Existing Wallet'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={handleSwitchAccount}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-950/30 border border-rose-500/30 hover:border-rose-500/60 text-rose-300 text-xs font-bold flex items-center justify-between transition cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>{lang === 'ja' ? '🚪 アカウントを切り替える (TOPへ)' : '🚪 Switch Account (Back to TOP)'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-rose-500/60" />
                </button>
              </div>
            </div>

            {/* Close */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-[10px] text-slate-500">StarPocket v1.0.0</span>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
              >
                {t('btnClose')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 👛 MULTI-WALLET SWITCHER & MANAGEMENT MODAL */}
      {/* ========================================================= */}
      {showWalletSwitchModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#121626] border border-amber-400/50 rounded-3xl p-5 max-w-sm w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm text-white">
                  {lang === 'ja' ? 'お財布の切り替え ＆ 管理' : 'Switch & Manage Wallets'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setShowWalletSwitchModal(false);
                  setEditingWalletId(null);
                }}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Wallet List */}
            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-0.5 mb-3">
              {wallets.map((w) => {
                const isActive = w.id === activeWalletId;
                const isEditing = editingWalletId === w.id;

                return (
                  <div
                    key={w.id}
                    className={`p-3 rounded-2xl border transition ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border-amber-400 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5 flex-1 mr-2">
                          <input
                            type="text"
                            value={editingWalletName}
                            onChange={(e) => setEditingWalletName(e.target.value)}
                            className="bg-slate-900 border border-amber-400 rounded-lg px-2 py-1 text-xs text-white font-bold w-full outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleRenameWallet(w.id, editingWalletName)}
                            className="px-2 py-1 rounded bg-amber-400 text-slate-950 text-[10px] font-black cursor-pointer"
                          >
                            OK
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                            <span>{w.name}</span>
                            {isActive && (
                              <span className="text-[9px] font-bold text-amber-300 bg-amber-400/20 px-1.5 py-0.2 rounded-full border border-amber-400/40">
                                {lang === 'ja' ? '選択中' : 'Active'}
                              </span>
                            )}
                          </span>
                          <button
                            onClick={() => {
                              setEditingWalletId(w.id);
                              setEditingWalletName(w.name);
                            }}
                            className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
                            title="名前を変更"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {wallets.length > 1 && !isActive && (
                        <button
                          onClick={() => handleRemoveWallet(w.id)}
                          className="text-slate-600 hover:text-rose-400 transition cursor-pointer p-1"
                          title="削除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {w.publicKey.slice(0, 8)}...{w.publicKey.slice(-8)}
                      </span>

                      {!isActive && (
                        <button
                          onClick={() => handleSelectWallet(w.id)}
                          className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 transition cursor-pointer active:scale-95"
                        >
                          {lang === 'ja' ? 'これを使う' : 'Select'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons: Add Wallet or Import */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowWalletSwitchModal(false);
                  handleStartCreateWallet(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-amber-500/20 active:scale-[0.99]"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'ja' ? '✨ 新しいお財布を追加 (12単語発行)' : '✨ Add New Wallet (12 Words)'}</span>
              </button>

              <button
                onClick={() => {
                  setShowWalletSwitchModal(false);
                  setImportError('');
                  setImportSecretInput('');
                  setImportMnemonicWords(Array(12).fill(''));
                  setImportMethod('select');
                  setShowImportModal(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-400/50 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-[0.99]"
              >
                <ArrowDownLeft className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ja' ? '📥 他のウォレットをインポートして追加' : '📥 Import Another Wallet'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 🔑 WALLET BACKUP MODAL (12 WORDS & SECRET KEY) */}
      {/* ========================================================= */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#121626] border border-amber-400/50 rounded-3xl p-5 max-w-sm w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm text-white">
                  {lang === 'ja' ? '🔑 ウォレットのバックアップ' : '🔑 Wallet Backup'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setShowBackupModal(false);
                  setShowSecretInBackup(false);
                }}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              {lang === 'ja'
                ? '秘密鍵や12単語は他人に教えないでください。端末の紛失や故障時、これらを使っていつでもウォレットを復元できます。'
                : 'Never share your secret key or 12 words. You can restore your wallet anytime with these.'}
            </p>

            {/* 12 Words (if available) */}
            {walletMnemonic && (
              <div className="space-y-1.5 mb-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-300">
                    {lang === 'ja' ? '12単語シードフレーズ' : '12-Word Seed Phrase'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {lang === 'ja' ? '紙に手書きメモ' : 'Write on paper'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  {walletMnemonic.split(' ').map((word, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg px-1.5 py-1 flex items-center gap-1 text-[11px]">
                      <span className="text-[9px] font-mono text-slate-500">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="font-mono font-bold text-amber-200 truncate select-none">{word}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Secret Key (S...) */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300">
                  {lang === 'ja' ? 'Stellar 秘密鍵 (Secret Key)' : 'Stellar Secret Key'}
                </span>
                <button
                  onClick={() => setShowSecretInBackup(!showSecretInBackup)}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {showSecretInBackup ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showSecretInBackup ? (lang === 'ja' ? '隠す' : 'Hide') : (lang === 'ja' ? '表示' : 'Show')}</span>
                </button>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-slate-300 break-all select-all">
                  {showSecretInBackup ? walletSecret : (walletSecret ? `${walletSecret.slice(0, 6)}•••••••••••••••••••••••••••••••••••••••••••••${walletSecret.slice(-4)}` : 'None')}
                </span>
                <button
                  onClick={() => {
                    if (walletSecret) {
                      navigator.clipboard.writeText(walletSecret);
                      if (window.Telegram?.WebApp?.HapticFeedback) {
                        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                      }
                      alert(lang === 'ja' ? '秘密鍵をコピーしました！' : 'Secret key copied!');
                    }
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
                >
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setShowBackupModal(false);
                setShowSecretInBackup(false);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              {t('btnClose')}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 📥 IN-APP WALLET IMPORT / MIGRATION MODAL */}
      {/* ========================================================= */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#121626] border border-cyan-400/50 rounded-3xl p-5 max-w-sm w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-sm text-white">
                  {importMethod === 'select'
                    ? (lang === 'ja' ? '📥 インポート方法を選択' : '📥 Select Import Method')
                    : importMethod === 'secret'
                    ? (lang === 'ja' ? '🔑 秘密鍵を入力' : '🔑 Enter Secret Key')
                    : mnemonicLength === 12
                    ? (lang === 'ja' ? '📝 12単語フレーズを入力' : '📝 Enter 12 Words')
                    : (lang === 'ja' ? '🛡️ 24単語フレーズを入力' : '🛡️ Enter 24 Words')}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setShowImportModal(false);
                  setImportError('');
                  setImportMethod('select');
                }}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: Select Method */}
            {importMethod === 'select' && (
              <div className="space-y-3 animate-in fade-in">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {lang === 'ja'
                    ? 'お持ちのキー形式に合わせて選んでください。別のアカウントとして追加されます。'
                    : 'Choose your import method. This will be added as a separate wallet account.'}
                </p>

                <div className="space-y-2.5">
                  <button
                    onClick={() => {
                      setImportError('');
                      setImportMethod('secret');
                    }}
                    className="w-full p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400/60 flex items-center gap-3 text-left transition cursor-pointer active:scale-[0.99] group shadow-sm"
                  >
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 group-hover:scale-105 transition">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-white">
                          {lang === 'ja' ? '🔑 秘密鍵で追加' : '🔑 Secret Key'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                        {lang === 'ja' ? 'Sから始まる56文字のStellar秘密鍵（LOBSTR等）' : '56-char secret key starting with S...'}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setImportError('');
                      setMnemonicLength(12);
                      setImportMnemonicWords(Array(12).fill(''));
                      setImportMethod('mnemonic');
                    }}
                    className="w-full p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-400/60 flex items-center gap-3 text-left transition cursor-pointer active:scale-[0.99] group shadow-sm"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 group-hover:scale-105 transition">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-white">
                          {lang === 'ja' ? '📝 12単語フレーズで追加' : '📝 12 Words Phrase'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                        {lang === 'ja' ? 'LOBSTRなど一般的なウォレット（12個の英単語）' : '12-word recovery phrase (LOBSTR / standard)'}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setImportError('');
                      setMnemonicLength(24);
                      setImportMnemonicWords(Array(24).fill(''));
                      setImportMethod('mnemonic');
                    }}
                    className="w-full p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-purple-400/60 flex items-center gap-3 text-left transition cursor-pointer active:scale-[0.99] group shadow-sm"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0 group-hover:scale-105 transition">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-white">
                          {lang === 'ja' ? '🛡️ 24単語フレーズで追加' : '🛡️ 24 Words Phrase'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                        {lang === 'ja' ? 'Ledger等のハードウェアウォレット（24個の英単語）' : '24-word recovery phrase (Ledger / Hardware)'}
                      </p>
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportError('');
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-slate-200 transition cursor-pointer pt-1"
                >
                  {t('btnClose')}
                </button>
              </div>
            )}

            {/* Step 2A: Secret Key Input */}
            {importMethod === 'secret' && (
              <div className="space-y-3 animate-in fade-in">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {lang === 'ja'
                    ? 'LOBSTR等のウォレット設定からエクスポートした56文字の秘密鍵（S...）を入力してください。'
                    : 'Enter the 56-char Stellar secret key starting with S...'}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <span>{lang === 'ja' ? 'Stellar 秘密鍵 (S...)' : 'Secret Key (S...)'}</span>
                      {importSecretInput.startsWith('S') && importSecretInput.length === 56 && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowSecretInputEye(!showSecretInputEye)}
                        className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-0.5 cursor-pointer"
                      >
                        {showSecretInputEye ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showSecretInputEye ? (lang === 'ja' ? '隠す' : 'Hide') : (lang === 'ja' ? '表示' : 'Show')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            if (text) setImportSecretInput(text.trim());
                          } catch (e) {
                            console.error('Clipboard read failed:', e);
                          }
                        }}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{lang === 'ja' ? '貼り付け' : 'Paste'}</span>
                      </button>
                    </div>
                  </div>

                  <input
                    type={showSecretInputEye ? 'text' : 'password'}
                    value={importSecretInput}
                    onChange={(e) => setImportSecretInput(e.target.value.trim())}
                    placeholder="SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-600 outline-none transition"
                  />

                  {importError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold animate-in fade-in">
                      ⚠️ {importError}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => handleExecuteImportMethod('secret', true)}
                    disabled={importLoading || !importSecretInput.trim()}
                    className={`w-full py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                      importSecretInput.trim() && !importLoading
                        ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 cursor-pointer shadow-cyan-500/30'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    {importLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{lang === 'ja' ? 'インポート中...' : 'Importing...'}</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>{lang === 'ja' ? '秘密鍵でウォレットを追加' : 'Add Wallet with Secret Key'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setImportError('');
                      setImportMethod('select');
                    }}
                    className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  >
                    {lang === 'ja' ? '← 方法を選び直す' : '← Change Method'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2B: Mnemonic Input (12 or 24 Separate Boxes) */}
            {importMethod === 'mnemonic' && (() => {
              const filledCount = importMnemonicWords.filter(w => w.trim().length > 0).length;
              const isComplete = filledCount === mnemonicLength;

              return (
                <div className="space-y-3 animate-in fade-in">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {lang === 'ja'
                      ? `紙にメモした${mnemonicLength}個の英単語を01から順番に手入力してください。（スペースで次の枠へ自動移動）`
                      : `Enter all ${mnemonicLength} recovery words in order. Space moves to next box.`}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <label className="text-[11px] font-bold text-slate-300">
                          {lang === 'ja' ? `${mnemonicLength}個の単語枠` : `${mnemonicLength} Word Boxes`}
                        </label>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded-full border transition ${
                          isComplete 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' 
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {filledCount} / {mnemonicLength} {isComplete ? '✓' : ''}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {filledCount > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setImportMnemonicWords(Array(mnemonicLength).fill(''));
                              setImportError('');
                            }}
                            className="text-[10px] text-slate-400 hover:text-slate-200 font-bold cursor-pointer"
                          >
                            {lang === 'ja' ? 'クリア' : 'Clear'}
                          </button>
                        )}
                        <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-slate-400" />
                          <span>{lang === 'ja' ? '手入力保護' : 'Manual Entry'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Word Boxes Grid */}
                    <div className="grid grid-cols-3 gap-1.5 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 shadow-inner max-h-[260px] overflow-y-auto">
                      {importMnemonicWords.map((word, idx) => (
                        <div
                          key={idx}
                          className={`bg-slate-900/90 border rounded-xl px-2 py-1.5 flex items-center gap-1.5 shadow-sm transition focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/40 ${
                            word ? 'border-amber-400/50 bg-amber-500/5' : 'border-slate-800/80'
                          }`}
                        >
                          <span className={`text-[9px] font-mono font-bold w-3.5 text-right shrink-0 select-none ${
                            word ? 'text-amber-400' : 'text-slate-500'
                          }`}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <input
                            ref={(el) => (inAppMnemonicInputRefs.current[idx] = el)}
                            type="text"
                            value={word}
                            onChange={(e) => handleMnemonicWordChange(idx, e.target.value, true)}
                            onKeyDown={(e) => handleMnemonicKeyDown(idx, e, true)}
                            onPaste={(e) => {
                              e.preventDefault();
                              const text = e.clipboardData ? e.clipboardData.getData('text').trim() : '';
                              if (!text.includes(' ') && !text.includes('\n') && !text.includes(',')) {
                                handleMnemonicWordChange(idx, text, true);
                              }
                            }}
                            placeholder=""
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck="false"
                            className="w-full bg-transparent text-xs font-mono font-bold text-amber-200 placeholder-slate-700 outline-none p-0 min-w-0"
                          />
                        </div>
                      ))}
                    </div>

                    {importError && (
                      <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold animate-in fade-in">
                        ⚠️ {importError}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => handleExecuteImportMethod('mnemonic', true)}
                      disabled={importLoading || !isComplete}
                      className={`w-full py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                        isComplete && !importLoading
                          ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 cursor-pointer shadow-amber-500/30'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      {importLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{lang === 'ja' ? 'インポート中...' : 'Importing...'}</span>
                        </>
                      ) : (
                        <>
                          {mnemonicLength === 12 ? <FileText className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                          <span>
                            {lang === 'ja' ? `${mnemonicLength}単語でウォレットを追加` : `Add Wallet with ${mnemonicLength} Words`}
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setImportError('');
                        setImportMethod('select');
                      }}
                      className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-slate-200 transition cursor-pointer"
                    >
                      {lang === 'ja' ? '← 方法を選び直す' : '← Change Method'}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ✨ IN-APP CREATE NEW WALLET (12 WORDS) MODAL */}
      {/* ========================================================= */}
      {showCreateWalletModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#121626] border border-amber-400/50 rounded-3xl p-5 max-w-sm w-full shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm text-white">
                  {lang === 'ja' ? '✨ 新しいお財布を追加 (12単語)' : '✨ Add New Wallet (12 Words)'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setShowCreateWalletModal(false);
                  setMnemonicConfirmed(false);
                }}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              {lang === 'ja'
                ? 'この12単語は新しく追加するお財布のマスターキーです。順番通りに紙に手書きでメモしてください。'
                : 'These 12 words are the recovery phrase for your new wallet. Please write them down on paper.'}
            </p>

            {/* Mnemonic Grid */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 shadow-inner mb-3">
              {newMnemonicWords.map((word, idx) => (
                <div key={idx} className="bg-slate-900/90 border border-slate-800/80 rounded-xl px-2 py-1.5 flex items-center gap-1.5 shadow-sm">
                  <span className="text-[9px] font-mono font-bold text-slate-500 w-4 text-right">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-bold font-mono text-amber-200 truncate select-none">
                    {word}
                  </span>
                </div>
              ))}
            </div>

            {/* Security Notice: No Clipboard Copy (Anti-Spyware) */}
            <div className="py-2.5 px-3 rounded-xl bg-slate-950/70 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px] leading-tight text-slate-300">
                {lang === 'ja'
                  ? '🛡️ クリップボード盗難防止のためコピー機能はありません。必ず紙に手書きしてください。'
                  : '🛡️ Clipboard copy is disabled for security against malware. Please write down on paper.'}
              </span>
            </div>

            {/* Confirmation Checkbox */}
            <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 cursor-pointer select-none mb-3">
              <input 
                type="checkbox"
                checked={mnemonicConfirmed}
                onChange={(e) => setMnemonicConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer accent-amber-500"
              />
              <span className="text-[11px] text-amber-200 leading-snug">
                {lang === 'ja'
                  ? '12単語を安全な場所にメモしました。（紛失すると復元できません）'
                  : 'I have backed up these 12 words in a safe place.'}
              </span>
            </label>

            {/* Finish & Add Button */}
            <div className="space-y-2">
              <button
                onClick={() => handleFinishCreateWallet(true)}
                disabled={!mnemonicConfirmed}
                className={`w-full py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                  mnemonicConfirmed
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 cursor-pointer shadow-amber-500/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>{lang === 'ja' ? 'このお財布を追加して切り替える！' : 'Add & Switch to This Wallet!'}</span>
              </button>

              <button
                onClick={() => {
                  setShowCreateWalletModal(false);
                  setMnemonicConfirmed(false);
                }}
                className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                {t('btnClose')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 💡 STAR VAULT / yXLM TUTORIAL MODAL */}
      {/* ========================================================= */}
      {showVaultTutorialModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#0e172a] border border-cyan-400/40 rounded-3xl p-5 max-w-sm w-full shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-sm text-white">
                  {lang === 'ja' ? '💡 星の金庫（yXLM）の仕組み' : '💡 How Star Vault (yXLM) Works'}
                </h3>
              </div>
              <button 
                onClick={() => setShowVaultTutorialModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 font-bold text-cyan-300 mb-1">
                  <span>1️⃣</span>
                  <span>{lang === 'ja' ? '取引所に預けっぱなしにするリスクを解消' : 'Eliminate Centralized Exchange Risk'}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ja' 
                    ? '暗号資産を取引所に置いたままだと倒産や出金停止のリスクがあります。StarPocketなら、資産は常にあなた自身のウォレットの中にあります。' 
                    : 'Leaving funds on exchanges carries counterparty risks. With StarPocket, you always own your private keys.'}
                </p>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
                  <span>2️⃣</span>
                  <span>{lang === 'ja' ? 'yXLMは「利息付き引換券」' : 'yXLM = Yield-Bearing Certificate'}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ja' 
                    ? '金庫に預けると、預けた証明として「yXLM」を受け取ります。このyXLMを持っているだけで、UltraStellarのオンチェーン運用により毎日年利5.0%の利息が自動で複利加算されます。' 
                    : 'Depositing mints yXLM tokens directly to your wallet. Holding yXLM earns 5.0% APY compounded daily on-chain.'}
                </p>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 font-bold text-emerald-300 mb-1">
                  <span>3️⃣</span>
                  <span>{lang === 'ja' ? 'いつでも1秒で元のXLMに戻せる' : 'Instant 1-Second Withdrawal'}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ja' 
                    ? 'ロック期間や解約手数料は一切なし。必要なときはスワップや金庫画面からいつでも1秒で通常のXLMに戻せます。' 
                    : 'Zero lockup period. Swap back from yXLM to standard XLM anytime instantly with zero penalty.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowVaultTutorialModal(false)}
              className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs transition cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              {lang === 'ja' ? 'なるほど、理解した！' : 'Got it!'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 🪐 STELLA SKIN ACHIEVEMENT UNLOCK MODAL */}
      {/* ========================================================= */}
      {showStellaRewardModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#121026] border border-purple-400/50 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-center overflow-hidden">
            {/* Background Aura Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3.5">
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>{lang === 'ja' ? '🎉 ウォレット活性化達成！' : '🎉 Wallet Activated!'}</span>
              </span>

              <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-purple-400/50 shadow-lg shadow-purple-500/30 bg-slate-950/80 p-1 flex items-center justify-center">
                <img
                  src="/stella_techwear_skin.jpg"
                  alt="Stella VIP Card"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div>
                <h3 className="font-black text-base text-white">
                  {lang === 'ja' ? '限定VIPカード【宇宙浮遊ステラ ⭐】アンロック！' : "VIP Card 'Floating Stella ⭐' Unlocked!"}
                </h3>
                <p className="text-xs text-purple-200 mt-1 leading-relaxed">
                  {lang === 'ja' 
                    ? '『相棒、ウォレットへの初チャージありがとう！宇宙を駆ける旅の相棒として、限定VIPカードを贈るね⭐』'
                    : '“Partner, thank you for funding your wallet! Here is your exclusive VIP card for our cosmic journey!⭐”'}
                </p>
              </div>

              {/* 🌟 SP (Star Points) Guide Box */}
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 text-left space-y-1.5 shadow-inner">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{lang === 'ja' ? '💡 星ポイント（SP）のあつめ方＆つかい道' : '💡 How to Earn & Use Star Points (SP)'}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {lang === 'ja'
                    ? '毎日ログインや「星広場（Reward）」で広告ボーナスを受け取るとSPが貯まります！貯めたSPで「ちびステラ VIPカード（150 SP）」や「星の金庫 APYブースト」と交換できるよ！'
                    : 'Claim daily login & ad drops in "Reward" tab to earn SP! Redeem them for "Chibi Stella VIP Card (150 SP)" or Vault APY boosts!'}
                </p>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    handleSelectCardFace('stella');
                    setShowStellaRewardModal(false);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/30 cursor-pointer active:scale-95 transition"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'ja' ? '✨ ステラVIPカードを装備して始める' : 'Equip Stella VIP & Start ✨'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 📊 ASSET MARKET RATE & DETAILS DRAWER */}
      {/* ========================================================= */}
      {selectedAssetDetail && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-[#121626] border border-cyan-500/40 rounded-t-3xl sm:rounded-2xl p-5 max-w-sm w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <TokenIcon symbol={selectedAssetDetail.symbol} className="w-8 h-8 rounded-xl shadow-md" />
                <div>
                  <h3 className="font-extrabold text-sm text-white">
                    {lang === 'ja' ? selectedAssetDetail.nameJa : selectedAssetDetail.name}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {lang === 'ja' ? selectedAssetDetail.tagJa : selectedAssetDetail.tag}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAssetDetail(null)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Price & 24h Change Box */}
            <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/90 mb-4">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                {lang === 'ja' ? 'リアルタイム参考レート (SDEX)' : 'Real-time SDEX Rate'}
              </div>
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono text-white">
                    ${selectedAssetDetail.rateUsd}
                  </span>
                  <span className="text-xs font-bold text-slate-400">USD</span>
                </div>
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                  <TrendingUp className="w-3 h-3" />
                  {selectedAssetDetail.change24h}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono flex items-center justify-between pt-2 border-t border-slate-900">
                <span>{lang === 'ja' ? '日本円参考' : 'JPY Approx'}</span>
                <span className="text-amber-300 font-bold">≈ {(parseFloat(selectedAssetDetail.rateUsd) * 155.0).toFixed(1)} JPY</span>
              </div>
            </div>

            {/* User Holdings in this Asset */}
            <div className="bg-gradient-to-r from-slate-900 to-[#161c32] rounded-xl p-3 border border-slate-800 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">{lang === 'ja' ? 'あなたの保有残高' : 'Your Holdings'}</span>
                <span className="font-mono font-bold text-base text-white">
                  {selectedAssetDetail.symbol === 'XLM' && balance}
                  {selectedAssetDetail.symbol === 'USDC' && usdcBalance}
                  {selectedAssetDetail.symbol === 'yXLM' && vaultInfo.yXLM}
                  {selectedAssetDetail.symbol === 'yUSDC' && vaultInfo.yUSDC}
                  {' '}{selectedAssetDetail.symbol}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">{lang === 'ja' ? '評価額 (USD)' : 'Est. Value'}</span>
                <span className="font-mono font-bold text-xs text-emerald-400">
                  ≈ ${(() => {
                    let bal = 0;
                    if (selectedAssetDetail.symbol === 'XLM') bal = parseFloat(balance) || 0;
                    if (selectedAssetDetail.symbol === 'USDC') bal = parseFloat(usdcBalance) || 0;
                    if (selectedAssetDetail.symbol === 'yXLM') bal = parseFloat(vaultInfo.yXLM) || 0;
                    if (selectedAssetDetail.symbol === 'yUSDC') bal = parseFloat(vaultInfo.yUSDC) || 0;
                    return (bal * parseFloat(selectedAssetDetail.rateUsd)).toFixed(2);
                  })()} USD
                </span>
              </div>
            </div>

            {/* Market & Protocol Specs (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-[11px]">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">{lang === 'ja' ? 'ネットワーク' : 'Network'}</span>
                <span className="font-bold text-slate-200">{selectedAssetDetail.network}</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">{lang === 'ja' ? '取引ペア' : 'Market Pair'}</span>
                <span className="font-bold text-cyan-300 font-mono">{selectedAssetDetail.dexPair}</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">{lang === 'ja' ? '送金・取引手数料' : 'Fee'}</span>
                <span className="font-bold text-emerald-400 font-mono">~0.00001 XLM (DEX直結・手数料0%)</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">{lang === 'ja' ? 'カストディ種別' : 'Custody Type'}</span>
                <span className="font-bold text-amber-300 font-mono">Non-Custodial (自己主権)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-[11px] text-slate-400 leading-relaxed mb-4 bg-slate-950/40 p-3 rounded-xl border border-slate-900">
              {lang === 'ja' ? selectedAssetDetail.descJa : selectedAssetDetail.descEn}
            </p>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              {selectedAssetDetail.symbol === 'XLM' && (
                <>
                  <button
                    onClick={() => {
                      setSelectedAssetDetail(null);
                      setSwapFrom('XLM');
                      setActiveTab('swap');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-400/20 cursor-pointer"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>{lang === 'ja' ? 'スワップする' : 'Swap XLM'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAssetDetail(null);
                      setShowSendModal(true);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'ja' ? '送金する' : 'Send XLM'}</span>
                  </button>
                </>
              )}

              {selectedAssetDetail.symbol === 'USDC' && (
                <>
                  <button
                    onClick={() => {
                      setSelectedAssetDetail(null);
                      setSwapFrom('USDC');
                      setSwapTo('yUSDC');
                      setActiveTab('swap');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-400/20 cursor-pointer"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>{lang === 'ja' ? 'スワップする' : 'Swap USDC'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAssetDetail(null);
                      setVaultActionAsset('USDC');
                      setVaultAmount('');
                      setVaultMsg('');
                      setShowVaultDepositModal(true);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-400/20 cursor-pointer"
                  >
                    <Landmark className="w-3.5 h-3.5" />
                    <span>{lang === 'ja' ? '年利5%金庫へ' : 'Earn 5% APY'}</span>
                  </button>
                </>
              )}

              {(selectedAssetDetail.symbol === 'yXLM' || selectedAssetDetail.symbol === 'yUSDC') && (
                <>
                  <button
                    onClick={() => {
                      setSelectedAssetDetail(null);
                      setActiveTab('vault');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-400/20 cursor-pointer"
                  >
                    <Landmark className="w-3.5 h-3.5" />
                    <span>{lang === 'ja' ? '金庫を開く' : 'Open Vault'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAssetDetail(null);
                      setVaultActionAsset(selectedAssetDetail.symbol === 'yXLM' ? 'XLM' : 'USDC');
                      setShowVaultWithdrawModal(true);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'ja' ? '引き出す' : 'Withdraw'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FULL ON-CHAIN ACTIVITY & MEMO MODAL */}
      {showActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-sm rounded-2xl border border-slate-700/80 p-5 shadow-2xl bg-slate-900/95 max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {lang === 'ja' ? '送受金 ＆ メモ全履歴' : 'Transaction & Memo History'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Stellar Testnet • {activityList.length} {lang === 'ja' ? '件の記録' : 'records'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowActivityModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs & Sync */}
            <div className="flex items-center justify-between gap-2 py-3 shrink-0">
              <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setActivityFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activityFilter === 'all'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'ja' ? 'すべて' : 'All'}
                </button>
                <button
                  type="button"
                  onClick={() => setActivityFilter('receive')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activityFilter === 'receive'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'ja' ? '受取' : 'Received'}
                </button>
                <button
                  type="button"
                  onClick={() => setActivityFilter('send')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activityFilter === 'send'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'ja' ? '送金' : 'Sent'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => fetchActivity(activeAddress)}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-cyan-400 transition cursor-pointer flex items-center gap-1 text-[10px] font-mono"
              >
                <RefreshCw className={`w-3 h-3 ${loadingActivity ? 'animate-spin text-cyan-400' : ''}`} />
                <span>{lang === 'ja' ? '更新' : 'Sync'}</span>
              </button>
            </div>

            {/* List */}
            <div className="overflow-y-auto pr-1 space-y-2 flex-1 my-1">
              {(() => {
                const filtered = activityList.filter((item) => {
                  if (activityFilter === 'receive') return item.type === 'receive' || item.type === 'created';
                  if (activityFilter === 'send') return item.type === 'send';
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-8 text-slate-500 text-xs font-mono">
                      {lang === 'ja' ? '該当する取引履歴がありません' : 'No transactions found'}
                    </div>
                  );
                }

                return filtered.map((item) => {
                  const isReceive = item.type === 'receive' || item.type === 'created';
                  return (
                    <div
                      key={item.id}
                      className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3 hover:border-slate-700 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isReceive 
                              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                              : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                          }`}>
                            {isReceive ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-white block">
                              {isReceive ? (lang === 'ja' ? '受取 (Deposit)' : 'Received') : (lang === 'ja' ? '送金 (Payment)' : 'Sent')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {item.createdAt ? new Date(item.createdAt).toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`font-mono font-bold text-xs block ${isReceive ? 'text-emerald-400' : 'text-slate-200'}`}>
                            {isReceive ? '+' : '-'}{parseFloat(item.amount).toFixed(2)} {item.asset}
                          </span>
                          <a
                            href={item.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] text-cyan-400/80 hover:text-cyan-300 inline-flex items-center gap-0.5 font-mono cursor-pointer mt-0.5"
                          >
                            <span>Stellar Expert ↗</span>
                          </a>
                        </div>
                      </div>

                      {/* Counterparty Address row */}
                      {item.counterparty && (
                        <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span className="text-slate-500">{isReceive ? (lang === 'ja' ? '送金元:' : 'From:') : (lang === 'ja' ? '宛先:' : 'To:')}</span>
                          <div className="flex items-center gap-1.5">
                            {getContactName(item.counterparty) ? (
                              <span className="text-amber-300 font-bold bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.2 rounded truncate max-w-[130px]">
                                ⭐ {getContactName(item.counterparty)}
                              </span>
                            ) : (
                              <>
                                <span>{item.counterparty.slice(0, 8)}...{item.counterparty.slice(-6)}</span>
                                <button
                                  type="button"
                                  onClick={() => openAddContactWithPrefill(item.counterparty, item.memo, item.memoType)}
                                  className="text-amber-400 hover:text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1 py-0.2 rounded text-[9px] font-bold cursor-pointer flex items-center gap-0.5"
                                  title="Save to Address Book"
                                >
                                  <Bookmark className="w-2.5 h-2.5" />
                                  <span>{lang === 'ja' ? '保存' : 'Save'}</span>
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => copyText(item.counterparty, item.id)}
                              className="text-slate-500 hover:text-cyan-300 p-0.5 cursor-pointer"
                              title="Copy Address"
                            >
                              {copiedActivityKey === item.id ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Full Memo Section */}
                      {item.memo && (
                        <div className="mt-2 pt-2 border-t border-slate-900">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-amber-400/90 font-mono font-bold text-[9px] bg-amber-400/15 border border-amber-400/30 px-1.5 py-0.2 rounded shrink-0">
                              MEMO ({item.memoType ? item.memoType.toUpperCase() : 'TEXT'})
                            </span>
                          </div>
                          <div className="text-amber-200 font-mono bg-slate-950/90 p-2 rounded-lg border border-slate-800 text-xs break-all leading-relaxed">
                            💬 "{item.memo}"
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Close Button */}
            <div className="pt-3 border-t border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setShowActivityModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
              >
                {lang === 'ja' ? '閉じる' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📖 ADDRESS BOOK MODAL */}
      {showAddressBookModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#121627] border border-cyan-500/30 rounded-2xl p-5 max-w-sm w-full shadow-2xl relative max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">
                    {lang === 'ja' ? 'アドレス帳 (連絡先)' : 'Address Book'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {addressBook.length} {lang === 'ja' ? '件登録済み' : 'contacts'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddressBookModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Add Contact Button */}
            <div className="py-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setContactForm({ name: '', address: '', memo: '', memoType: 'text', tag: 'friend' });
                  setContactError('');
                  setShowAddContactModal(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'ja' ? '＋ 新規アドレスを登録' : '+ Add New Contact'}</span>
              </button>
            </div>

            {/* Contacts List */}
            <div className="overflow-y-auto space-y-2 flex-1 my-1 pr-1">
              {addressBook.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs font-mono">
                  {lang === 'ja' ? '登録されているアドレスはありません' : 'No contacts saved yet'}
                </div>
              ) : (
                addressBook.map((contact) => (
                  <div
                    key={contact.id}
                    className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 hover:border-slate-700 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs font-bold text-white truncate">{contact.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                            contact.tag === 'dev' 
                              ? 'bg-amber-400/15 border border-amber-400/30 text-amber-300' 
                              : contact.tag === 'exchange'
                              ? 'bg-purple-500/15 border border-purple-500/30 text-purple-300'
                              : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
                          }`}>
                            {contact.tag === 'dev' ? '⭐ 開発・支援' : contact.tag === 'exchange' ? '🏢 取引所' : '👤 個人'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                          <span>{contact.address.slice(0, 8)}...{contact.address.slice(-6)}</span>
                          <button
                            type="button"
                            onClick={() => copyText(contact.address, contact.id)}
                            className="text-slate-500 hover:text-cyan-300 p-0.5 cursor-pointer"
                            title="Copy Address"
                          >
                            {copiedActivityKey === contact.id ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        {contact.memo && (
                          <div className="mt-1.5 text-[9px] font-mono text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded truncate">
                            Memo ({contact.memoType ? contact.memoType.toUpperCase() : 'TEXT'}): "{contact.memo}"
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSendDest(contact.address);
                            if (contact.memo) {
                              setSendMemo(contact.memo);
                              setSendMemoType(contact.memoType || 'text');
                            }
                            setShowAddressBookModal(false);
                            setShowSendModal(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[10px] flex items-center gap-1 shadow-sm cursor-pointer"
                        >
                          <Send className="w-2.5 h-2.5" />
                          <span>{lang === 'ja' ? '送金' : 'Send'}</span>
                        </button>
                        {contact.id !== 'stella-fund' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteContact(contact.id)}
                            className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Close */}
            <div className="pt-3 border-t border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setShowAddressBookModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
              >
                {lang === 'ja' ? '閉じる' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ➕ ADD CONTACT MODAL */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#121627] border border-amber-500/30 rounded-2xl p-5 max-w-sm w-full shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ja' ? 'アドレスを登録' : 'Save Address'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddContactModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">
                  {lang === 'ja' ? '名前 / ニックネーム' : 'Name / Label'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'ja' ? '例: マイBinance、友達のアリス' : 'e.g. My Binance, Friend Alice'}
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">
                  {lang === 'ja' ? 'Stellarアドレス (G...)' : 'Stellar Address (G...)'}
                </label>
                <input
                  type="text"
                  placeholder="G..."
                  value={contactForm.address}
                  onChange={(e) => setContactForm({ ...contactForm, address: e.target.value.trim() })}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">
                  {lang === 'ja' ? 'カテゴリ' : 'Category Tag'}
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                  {[
                    { id: 'friend', label: lang === 'ja' ? '👤 友達' : '👤 Friend' },
                    { id: 'exchange', label: lang === 'ja' ? '🏢 取引所' : '🏢 Exchange' },
                    { id: 'dev', label: lang === 'ja' ? '⭐ 開発' : '⭐ Dev' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setContactForm({ ...contactForm, tag: t.id })}
                      className={`py-1.5 px-2 rounded-lg border transition cursor-pointer text-center ${
                        contactForm.tag === t.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>{lang === 'ja' ? '固定メモ (任意)' : 'Default Memo (Optional)'}</span>
                  <div className="flex gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-[9px] font-mono">
                    <button
                      type="button"
                      onClick={() => setContactForm({ ...contactForm, memoType: 'text' })}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        contactForm.memoType === 'text' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-slate-400'
                      }`}
                    >
                      TEXT
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactForm({ ...contactForm, memoType: 'id' })}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        contactForm.memoType === 'id' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-slate-400'
                      }`}
                    >
                      ID
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder={contactForm.memoType === 'id' ? '12345678' : 'memo text'}
                  value={contactForm.memo}
                  onChange={(e) => setContactForm({ ...contactForm, memo: e.target.value })}
                  maxLength={contactForm.memoType === 'text' ? 28 : 20}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:border-amber-400 outline-none"
                />
              </div>

              {contactError && (
                <p className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg font-mono">
                  {contactError}
                </p>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="w-1/2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                >
                  {lang === 'ja' ? 'キャンセル' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  {lang === 'ja' ? '保存する' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🌟 FULL-BODY ILLUSTRATION SHOWCASE MODAL (全身鑑賞モード) */}
      {showcaseModal && (
        <div 
          onClick={() => setShowcaseModal(false)}
          className="fixed inset-0 z-50 flex flex-col justify-between p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300 cursor-pointer select-none"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10 shrink-0 pt-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-lg shadow-sm">
                {showcaseSkin === 'chibi' ? '🌟' : '🪐'}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <span>{
                    showcaseSkin === 'chibi' 
                      ? (lang === 'ja' ? 'ちびステラ ＆ お星さま' : 'Chibi Stella & Star') 
                      : showcaseSkin === 'shooting_star'
                        ? (lang === 'ja' ? 'サイバー・シューティングスター' : 'Cyber Shooting Star')
                        : (lang === 'ja' ? '宇宙浮遊ステラ' : 'Techwear Stella')
                  }</span>
                  <span className="text-[9px] bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 px-1.5 py-0.2 rounded-full font-bold">
                    {lang === 'ja' ? 'アート鑑賞' : 'Art Showcase'}
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  {showcaseSkin === 'chibi' 
                    ? 'Chibi Stella Character Art' 
                    : showcaseSkin === 'shooting_star'
                      ? 'Cosmic Meteor & Cyber Constellation Art'
                      : 'Official Techwear Illustration'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowcaseModal(false)}
              className="p-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Character Illustration Centerpiece */}
          <div className="relative flex-1 flex flex-col items-center justify-center my-auto overflow-hidden pointer-events-none">
            {/* Background Aura Flare */}
            <div className={`absolute w-[340px] h-[480px] rounded-full blur-3xl ${
              showcaseSkin === 'chibi' 
                ? 'bg-gradient-to-br from-cyan-400/30 via-purple-400/25 to-amber-300/20' 
                : showcaseSkin === 'shooting_star'
                  ? 'bg-gradient-to-br from-cyan-500/30 via-blue-600/25 to-purple-600/20'
                  : 'bg-gradient-to-br from-purple-600/35 via-cyan-500/25 to-pink-500/20'
            }`} />

            <img
              src={
                showcaseSkin === 'chibi' 
                  ? '/chibi_stella_skin.jpg' 
                  : showcaseSkin === 'shooting_star'
                    ? '/cyber_shooting_star_card.jpg'
                    : '/stella_techwear_skin.jpg'
              }
              alt="Character Showcase"
              className={`max-h-[58vh] max-w-[90vw] object-contain drop-shadow-[0_0_35px_rgba(56,189,248,0.5)] select-none ${
                showcaseSkin === 'shooting_star' ? 'rounded-2xl border border-cyan-400/40 shadow-2xl' : 'animate-float-stella'
              }`}
            />

            {/* Character Dialogue Quote */}
            <div className="mt-3 max-w-xs text-center px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md">
              <p className="text-xs font-bold text-amber-200 leading-relaxed font-sans">
                {showcaseSkin === 'chibi' 
                  ? (lang === 'ja' ? '『ちびもいっしょだよー！お星さまたくさん集めてぎゅーってしよ🌟』' : '"Chibi is right here! Let\'s collect shining stars together!🌟"')
                  : showcaseSkin === 'shooting_star'
                    ? (lang === 'ja' ? '『星屑の彼方へ一直線！サイバー空間を疾走するシューティングスター🌠』' : '"Streaking straight across the starlit cyber cosmos!🌠"')
                    : (lang === 'ja' ? '『相棒、いつもStarPocketを使ってくれてありがとう！宇宙の果てまで一緒に行こうね⭐』' : '"Always by your side, partner! Let\'s venture across the cosmos together!⭐"')
                }
              </p>
            </div>
          </div>

          {/* Bottom Switcher & Return Hint */}
          <div className="flex flex-col items-center gap-2.5 z-10 shrink-0 pb-3" onClick={(e) => e.stopPropagation()}>
            {/* Character Switcher Tabs */}
            <div className="inline-flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-lg">
              <button
                onClick={() => {
                  setShowcaseSkin('stella');
                  if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.selectionChanged();
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  showcaseSkin === 'stella'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🪐</span>
                <span>{lang === 'ja' ? 'ステラ' : 'Stella'}</span>
              </button>

              <button
                onClick={() => {
                  setShowcaseSkin('chibi');
                  if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.selectionChanged();
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  showcaseSkin === 'chibi'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-400/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🌟</span>
                <span>{lang === 'ja' ? 'ちびステラ' : 'Chibi Stella'}</span>
              </button>

              <button
                onClick={() => {
                  setShowcaseSkin('shooting_star');
                  if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.selectionChanged();
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  showcaseSkin === 'shooting_star'
                    ? 'bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-300/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🌠</span>
                <span>{lang === 'ja' ? '流星' : 'Meteor'}</span>
              </button>
            </div>

            {/* Apply Card Face Button (if not currently active) */}
            {currentCardFace !== showcaseSkin && (
              (() => {
                const isSkinLocked = (showcaseSkin === 'stella' && !isStellaUnlocked) ||
                  (showcaseSkin === 'chibi' && !gamification.perks?.includes('chibi_skin') && localStorage.getItem('starpocket_skin_chibi_unlocked') !== 'true');
                if (isSkinLocked) {
                  return (
                    <button
                      onClick={() => {
                        setShowcaseModal(false);
                        if (showcaseSkin === 'stella') {
                          alert(lang === 'ja' ? '⭐ ウォレットにXLMをチャージすると解放されます！' : '⭐ Fund your wallet with XLM to unlock!');
                        } else if (showcaseSkin === 'chibi') {
                          setActiveTab('reward');
                        }
                      }}
                      className="text-[11px] font-bold text-slate-300 bg-slate-800/80 border border-slate-700 hover:border-amber-400/50 px-3 py-1 rounded-full cursor-pointer transition active:scale-95 flex items-center gap-1.5"
                    >
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>
                        {showcaseSkin === 'stella'
                          ? (lang === 'ja' ? '🔒 XLMチャージでアンロック' : '🔒 Fund XLM to unlock')
                          : (lang === 'ja' ? '🔒 星広場で150 SPと交換' : '🔒 Redeem for 150 SP')}
                      </span>
                    </button>
                  );
                }
                return (
                  <button
                    onClick={() => {
                      handleSelectCardFace(showcaseSkin);
                      setShowcaseModal(false);
                    }}
                    className="text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-400/15 border border-amber-400/30 px-3 py-1 rounded-full cursor-pointer transition active:scale-95"
                  >
                    {lang === 'ja' ? '✨ この券面アートをウォレットに適用する' : '✨ Apply this VIP card face'}
                  </button>
                );
              })()
            )}

            {/* Tap hint */}
            <p className="text-[10px] text-slate-500 font-mono text-center">
              {lang === 'ja' ? '画面をタップするとウォレットに戻ります' : 'Tap anywhere to return to wallet'}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 📸 QR CODE SCANNER MODAL (Fallback for Browser & File Upload) */}
      {/* ========================================================= */}
      {showQrScannerModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121627] border border-cyan-500/40 rounded-2xl p-5 max-w-sm w-full shadow-2xl relative text-center">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <ScanLine className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ja' ? 'QRコードをスキャン' : 'Scan QR Code'}</span>
              </h3>
              <button onClick={stopQrScanner} className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              {lang === 'ja' 
                ? '送金先のStellarアドレスQRコードを枠内に映してください' 
                : 'Align recipient Stellar address QR code within the frame'}
            </p>

            {/* Video Viewport / Scanner Frame */}
            <div className="relative w-full aspect-square bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center mb-3">
              {scannerCameraError ? (
                <div className="p-4 text-center">
                  <Camera className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-rose-300 mb-2 leading-relaxed">{scannerCameraError}</p>
                </div>
              ) : (
                <>
                  <video 
                    ref={scannerVideoRef} 
                    className="w-full h-full object-cover" 
                    playsInline 
                    muted 
                  />
                  {/* Glowing Laser Scan Frame */}
                  <div className="absolute inset-8 border-2 border-cyan-400/80 rounded-xl pointer-events-none shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent animate-pulse" />
                    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
                  </div>
                </>
              )}
            </div>

            {/* Alternative: Image File Upload */}
            <div className="space-y-2">
              <input 
                type="file" 
                ref={qrFileInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={handleQrImageUpload} 
              />
              <button
                type="button"
                onClick={() => qrFileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400/50 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ja' ? '写真・画像ファイルからQR読取' : 'Upload QR Image File'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
