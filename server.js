import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as StellarSdk from '@stellar/stellar-sdk';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

// Faucet Pool Keypair setup
let faucetKeypair = null;
const ENV_PATH = path.join(__dirname, '.env');

async function initFaucet() {
  let secret = process.env.FAUCET_SECRET_KEY;
  if (!secret) {
    console.log('Generating new Stellar Testnet Faucet Keypair...');
    faucetKeypair = StellarSdk.Keypair.random();
    secret = faucetKeypair.secret();
    try {
      fs.appendFileSync(ENV_PATH, `\nFAUCET_SECRET_KEY=${secret}\n`);
      console.log('Saved new faucet key to .env:', faucetKeypair.publicKey());
    } catch (e) {
      console.log('Ephemeral container environment, faucet key kept in memory:', faucetKeypair.publicKey());
    }
  } else {
    faucetKeypair = StellarSdk.Keypair.fromSecret(secret);
    console.log('Loaded faucet key from .env:', faucetKeypair.publicKey());
  }

  // Check balance & fund if needed
  try {
    const acc = await server.loadAccount(faucetKeypair.publicKey());
    const nativeBal = acc.balances.find(b => b.asset_type === 'native')?.balance;
    console.log(`Faucet Pool Balance: ${nativeBal} XLM`);
    if (parseFloat(nativeBal) < 10) {
      await fundViaFriendbot(faucetKeypair.publicKey());
    }
  } catch (err) {
    console.log('Faucet account not found on Testnet, requesting Friendbot funding...');
    await fundViaFriendbot(faucetKeypair.publicKey());
  }
}

async function fundViaFriendbot(pubKey) {
  try {
    const res = await fetch(`https://friendbot.stellar.org?addr=${pubKey}`);
    const data = await res.json();
    console.log('Friendbot funded successfully:', !!data.hash);
  } catch (e) {
    console.error('Friendbot funding failed:', e.message);
  }
}

// Daily limit & cooldown management
const MAX_DAILY_CLAIMS = 5;
const COOLDOWN_SECONDS = process.env.COOLDOWN_SECONDS ? parseInt(process.env.COOLDOWN_SECONDS) : 3 * 60; // 3 minutes default
const COOLDOWN_MS = COOLDOWN_SECONDS * 1000;

// Store user claim records in-memory & file storage: destination -> { dateStr, count, lastClaimTime }
const userClaimRecords = new Map();

function getTodayString(targetDate = new Date()) {
  const jstFormatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return jstFormatter.format(targetDate).replace(/\//g, '-');
}

function getUserClaimStatus(destination) {
  const today = getTodayString();
  const record = userClaimRecords.get(destination) || { dateStr: today, count: 0, lastClaimTime: 0 };
  
  // If date changed, reset count
  if (record.dateStr !== today) {
    record.dateStr = today;
    record.count = 0;
  }

  const now = Date.now();
  const elapsed = now - record.lastClaimTime;
  const cooldownRemainingSec = Math.max(0, Math.ceil((COOLDOWN_MS - elapsed) / 1000));
  const remainingToday = Math.max(0, MAX_DAILY_CLAIMS - record.count);
  const canClaim = remainingToday > 0 && cooldownRemainingSec === 0;

  const isFirstClaimToday = (record.count === 0);
  const nextRewardAmount = isFirstClaimToday ? '0.10' : '0.05';
  const nextEarnedSp = isFirstClaimToday ? 40 : 20;

  return {
    destination,
    maxDaily: MAX_DAILY_CLAIMS,
    claimsToday: record.count,
    remainingToday,
    cooldownRemainingSec,
    canClaim,
    isFirstClaimToday,
    nextRewardAmount,
    nextEarnedSp,
    nextAvailableAt: cooldownRemainingSec > 0 ? new Date(now + cooldownRemainingSec * 1000).toISOString() : null
  };
}

// On-chain fallback sync in case Render instance rebooted/spun down
async function syncClaimStatusFromChain(destination) {
  try {
    const payments = await server.payments().forAccount(destination).limit(25).order('desc').call();
    const today = getTodayString();
    let todayClaims = 0;
    let latestTime = 0;
    const faucetPub = faucetKeypair ? faucetKeypair.publicKey() : null;

    for (const p of payments.records) {
      const fromAddr = p.from || p.funder;
      if (fromAddr && faucetPub && fromAddr === faucetPub) {
        const txDate = new Date(p.created_at);
        const pDateStr = getTodayString(txDate);
        if (pDateStr === today) {
          todayClaims++;
          if (txDate.getTime() > latestTime) {
            latestTime = txDate.getTime();
          }
        }
      }
    }

    if (todayClaims > 0) {
      const existing = userClaimRecords.get(destination) || { dateStr: today, count: 0, lastClaimTime: 0 };
      if (todayClaims > (existing.count || 0) || existing.dateStr !== today) {
        userClaimRecords.set(destination, {
          dateStr: today,
          count: Math.min(MAX_DAILY_CLAIMS, Math.max(existing.count || 0, todayClaims)),
          lastClaimTime: Math.max(existing.lastClaimTime || 0, latestTime)
        });
        savePersistedData();
      }
    }
  } catch (e) {
    // Account might be newly created or not on chain yet; safely ignore
  }
}

// GET /api/user-status/:address - get user's daily quota and cooldown
app.get('/api/user-status/:address', async (req, res) => {
  const { address } = req.params;
  if (!address || !StellarSdk.StrKey.isValidEd25519PublicKey(address)) {
    return res.status(400).json({ error: 'Invalid Stellar Public Key' });
  }

  // If in-memory claim record is missing or 0 for today, attempt an on-chain fallback sync
  const today = getTodayString();
  const existing = userClaimRecords.get(address);
  if (!existing || existing.dateStr !== today || existing.count === 0) {
    await syncClaimStatusFromChain(address);
  }

  res.json(getUserClaimStatus(address));
});

// ============================================================================
// ⭐ STAR POINTS & 31-DAY LOGIN CALENDAR (GAMIFICATION ENGINE)
// ============================================================================
// destination -> { starPoints, streak, lastCheckinDate, checkinDays: number[], perks: string[], hasCompleted31: boolean }
const userGamificationData = new Map();

// In-Memory & Persistent USDC Balances per user (simulating Testnet USDC asset holders)
const userUsdcBalances = new Map();

// 星の金庫 (Star Vault) State & Endpoints
// Holds user deposits for yXLM (5.0% APY) & yUSDC (5.0% APY)
const starVaults = new Map();

// Local file persistence so balances & streaks survive restarts
const DATA_FILE = path.join(__dirname, 'starpocket_data.json');

function loadPersistedData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (data.usdc) {
        for (const [k, v] of Object.entries(data.usdc)) {
          userUsdcBalances.set(k, v);
        }
      }
      if (data.vaults) {
        for (const [k, v] of Object.entries(data.vaults)) {
          starVaults.set(k, v);
        }
      }
      if (data.gamification) {
        for (const [k, v] of Object.entries(data.gamification)) {
          userGamificationData.set(k, v);
        }
      }
      if (data.claims) {
        for (const [k, v] of Object.entries(data.claims)) {
          userClaimRecords.set(k, v);
        }
      }
      console.log(`[Storage] Loaded persistent state from ${DATA_FILE}`);
    }
  } catch (e) {
    console.warn('[Storage] Failed to load starpocket_data.json:', e.message);
  }
}

function savePersistedData() {
  try {
    const data = {
      usdc: Object.fromEntries(userUsdcBalances),
      vaults: Object.fromEntries(starVaults),
      gamification: Object.fromEntries(userGamificationData),
      claims: Object.fromEntries(userClaimRecords)
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.warn('[Storage] Failed to save starpocket_data.json:', e.message);
  }
}

loadPersistedData();

function getJstDateInfo(targetDate = new Date()) {
  const formatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.format(targetDate).split('/');
  const dateStr = `${parts[0]}-${parts[1]}-${parts[2]}`;
  const monthKey = `${parts[0]}-${parts[1]}`;
  const day = parseInt(parts[2], 10);
  return { dateStr, monthKey, day };
}

function getUserGamification(destination, clientBackup = null) {
  const jst = getJstDateInfo();
  let data = userGamificationData.get(destination);

  // If server restarted / ephemeral memory lost, attempt recovery from client sync backup
  if (!data && clientBackup && (clientBackup.destination === destination || !clientBackup.destination)) {
    console.log(`[Gamification] Restoring state from client backup for ${destination.slice(0, 8)}...`);
    data = {
      destination,
      starPoints: typeof clientBackup.starPoints === 'number' ? clientBackup.starPoints : 50,
      streak: typeof clientBackup.streak === 'number' ? clientBackup.streak : 0,
      lastCheckinDate: clientBackup.lastCheckinDate || null,
      checkinDays: Array.isArray(clientBackup.checkinDays) ? clientBackup.checkinDays : [],
      currentMonth: clientBackup.currentMonth || jst.monthKey,
      perks: Array.isArray(clientBackup.perks) ? clientBackup.perks : [],
      hasCompleted31: !!clientBackup.hasCompleted31
    };
    userGamificationData.set(destination, data);
    savePersistedData();
  }

  if (!data) {
    data = {
      destination,
      starPoints: 50, // Welcome bonus 50 SP!
      streak: 0,
      lastCheckinDate: null,
      checkinDays: [],
      currentMonth: jst.monthKey,
      perks: [],
      hasCompleted31: false
    };
    userGamificationData.set(destination, data);
    savePersistedData();
  }

  // Monthly rollover for 31-day constellation calendar view
  if (data.currentMonth !== jst.monthKey) {
    data.currentMonth = jst.monthKey;
    data.checkinDays = [];
    userGamificationData.set(destination, data);
    savePersistedData();
  }

  const checkedInToday = data.lastCheckinDate === jst.dateStr;

  return {
    ...data,
    checkedInToday,
    currentDayOfMonth: jst.day
  };
}

function addStarPoints(destination, amount, reason = '') {
  const data = getUserGamification(destination);
  data.starPoints = Math.max(0, (data.starPoints || 0) + amount);
  userGamificationData.set(destination, data);
  savePersistedData();
  console.log(`[StarPoints] +${amount} SP to ${destination.slice(0, 8)}... (Total: ${data.starPoints} SP, Reason: ${reason})`);
  return data.starPoints;
}

// GET /api/gamification/:address - get user's streak and points
app.get('/api/gamification/:address', (req, res) => {
  const { address } = req.params;
  if (!address || !StellarSdk.StrKey.isValidEd25519PublicKey(address)) {
    return res.status(400).json({ error: 'Invalid Stellar Public Key' });
  }
  let clientBackup = null;
  if (req.query.sync) {
    try {
      clientBackup = JSON.parse(decodeURIComponent(req.query.sync));
    } catch (e) {}
  }
  res.json(getUserGamification(address, clientBackup));
});

// POST /api/gamification/checkin - daily checkin
app.post('/api/gamification/checkin', (req, res) => {
  const { address, clientBackup } = req.body;
  if (!address || !StellarSdk.StrKey.isValidEd25519PublicKey(address)) {
    return res.status(400).json({ error: 'Invalid Stellar Public Key' });
  }
  const jstToday = getJstDateInfo();
  const jstYesterday = getJstDateInfo(new Date(Date.now() - 86400000));
  const data = getUserGamification(address, clientBackup);

  if (data.lastCheckinDate === jstToday.dateStr) {
    return res.json({
      success: true,
      alreadyCheckedIn: true,
      message: '本日はすでにチェックイン済みです ⭐',
      ...getUserGamification(address)
    });
  }

  // Calculate streak: check if lastCheckinDate was yesterday
  let streakSavedByShield = false;
  if (data.lastCheckinDate === jstYesterday.dateStr) {
    data.streak = (data.streak || 0) + 1;
  } else if (Array.isArray(data.perks) && data.perks.includes('streak_shield') && (data.streak || 0) > 0) {
    // Shield protects streak from breaking!
    data.streak = (data.streak || 0) + 1;
    data.perks = data.perks.filter(p => p !== 'streak_shield');
    streakSavedByShield = true;
  } else {
    data.streak = 1;
  }

  data.lastCheckinDate = jstToday.dateStr;
  data.currentMonth = jstToday.monthKey;
  if (!Array.isArray(data.checkinDays)) {
    data.checkinDays = [];
  }
  if (!data.checkinDays.includes(jstToday.day)) {
    data.checkinDays.push(jstToday.day);
  }

  // Points rewards
  let earnedSp = 10;
  let bonusMsg = streakSavedByShield 
    ? '+10 SP! 🛡️ ストリーク保護シールドが発動し、連続日数が守られました！'
    : '+10 SP earned!';
  if (data.streak === 7) {
    earnedSp += 50;
    bonusMsg += ' 🎉 7-Day Streak Bonus: +50 SP!';
  } else if (data.streak === 14) {
    earnedSp += 80;
    bonusMsg += ' 🎉 14-Day Streak Bonus: +80 SP!';
  } else if (data.streak === 21) {
    earnedSp += 100;
    bonusMsg += ' 🎉 21-Day Streak Bonus: +100 SP!';
  } else if (data.streak >= 31) {
    earnedSp += 200;
    data.hasCompleted31 = true;
    bonusMsg += ' 🎫 31-Day Streak Completed: +200 SP & 31日完走セレクトチケット！';
  }

  data.starPoints = (data.starPoints || 0) + earnedSp;
  userGamificationData.set(address, data);
  savePersistedData();

  res.json({
    success: true,
    alreadyCheckedIn: false,
    earnedSp,
    message: bonusMsg,
    ...getUserGamification(address)
  });
});

// POST /api/gamification/redeem - redeem Star Points for perks
app.post('/api/gamification/redeem', (req, res) => {
  const { address, perkId } = req.body;
  if (!address || !StellarSdk.StrKey.isValidEd25519PublicKey(address)) {
    return res.status(400).json({ error: 'Invalid Stellar Public Key' });
  }

  const PERK_CATALOG = {
    streak_shield: { name: 'ログインストリーク保護シールド 🛡️', cost: 200 },
    chibi_skin: { name: '限定VIP【ちびステラ ＆ お星さま】🌟', cost: 300 },
    shooting_star_skin: { name: 'サイバー・シューティングスター 🌠', cost: 300 },
    lunar_moonlight_skin: { name: 'シルバー・ルナームーン 🌕', cost: 300, comingSoon: true },
    retro_pixel_skin: { name: 'レトロ8ビット・ドット星空 👾', cost: 300, comingSoon: true },
    aurora_nebula_skin: { name: '極光ネビュラ・オーロラ 🌌', cost: 500, comingSoon: true },
    eclipse_corona_skin: { name: '皆既日食コロナ 🌑', cost: 500, comingSoon: true },
    overtech_stella_skin: { name: 'ギーク・オーバーテック 🛠️', cost: 500, comingSoon: true },
    cyber_soroban_skin: { name: 'サイバーパンク・Soroban ⚡', cost: 500, comingSoon: true },
    apollo_blueprint_skin: { name: 'アポロ宇宙船・ブループリント 🚀', cost: 500, comingSoon: true },
    zodiac_core_skin: { name: '黄道十二星座・コア 👑', cost: 800, comingSoon: true }
  };

  const perk = PERK_CATALOG[perkId];
  if (!perk) {
    return res.status(400).json({ error: '無効なアイテムです' });
  }

  if (perk.comingSoon) {
    return res.status(400).json({ error: 'このアイテムはアップデート・コラボによる順次公開まで準備中です ✨' });
  }

  const data = getUserGamification(address);
  if (data.starPoints < perk.cost) {
    return res.status(400).json({ error: `星ポイントが不足しています (必要: ${perk.cost} SP, 現在: ${data.starPoints} SP)` });
  }

  data.starPoints -= perk.cost;
  if (!Array.isArray(data.perks)) {
    data.perks = [];
  }
  if (!data.perks.includes(perkId)) {
    data.perks.push(perkId);
  }
  userGamificationData.set(address, data);
  savePersistedData();

  res.json({
    success: true,
    perkId,
    perkName: perk.name,
    remainingSp: data.starPoints,
    message: `「${perk.name}」と交換しました！🎉`,
    ...getUserGamification(address)
  });
});

// GET /api/faucet - returns pool status
app.get('/api/faucet', async (req, res) => {
  try {
    if (!faucetKeypair) {
      return res.status(503).json({ error: 'Faucet initializing' });
    }
    let nativeBal = '0';
    try {
      const acc = await server.loadAccount(faucetKeypair.publicKey());
      nativeBal = acc.balances.find(b => b.asset_type === 'native')?.balance || '0';
    } catch (e) {
      await fundViaFriendbot(faucetKeypair.publicKey());
      try {
        const acc = await server.loadAccount(faucetKeypair.publicKey());
        nativeBal = acc.balances.find(b => b.asset_type === 'native')?.balance || '0';
      } catch (e2) {}
    }
    res.json({
      publicKey: faucetKeypair.publicKey(),
      balance: nativeBal,
      network: 'Testnet',
      rewardAmount: '0.05'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/fund-friendbot - Request 10,000 Testnet XLM directly from official Friendbot
app.post('/api/fund-friendbot', async (req, res) => {
  try {
    const { address } = req.body;
    if (!StellarSdk.StrKey.isValidEd25519PublicKey(address)) {
      return res.status(400).json({ error: 'Invalid Stellar Public Key' });
    }
    const resp = await fetch(`https://friendbot.stellar.org?addr=${address}`);
    const data = await resp.json();
    if (data.hash || resp.ok) {
      return res.json({ success: true, hash: data.hash || null, message: '10,000 XLM funded successfully!' });
    } else {
      return res.status(400).json({ error: data.detail || 'Friendbot request failed' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Friendbot network error: ' + err.message });
  }
});

function getUserUsdc(address) {
  return userUsdcBalances.get(address) || 0.0;
}

function setUserUsdc(address, amount) {
  userUsdcBalances.set(address, Math.max(0, amount));
  savePersistedData();
}

// GET /api/balance/:address - checks balance of an address (multi-asset)
app.get('/api/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    if (!StellarSdk.StrKey.isValidEd25519PublicKey(address)) {
      return res.status(400).json({ error: 'Invalid Stellar Public Key' });
    }
    try {
      const acc = await server.loadAccount(address);
      const nativeBal = acc.balances.find(b => b.asset_type === 'native')?.balance || '0';
      const onChainUsdc = acc.balances.find(b => b.asset_code === 'USDC')?.balance;
      const usdcBal = onChainUsdc ? parseFloat(onChainUsdc) : getUserUsdc(address);
      const assets = [
        { code: 'XLM', balance: nativeBal, type: 'native' },
        { code: 'USDC', balance: usdcBal.toFixed(4), type: 'credit_alphanum4' }
      ];
      res.json({ address, balance: nativeBal, usdcBalance: usdcBal.toFixed(4), assets, exists: true });
    } catch (e) {
      if (e.name === 'NotFoundError' || e.response?.status === 404 || e.status === 404) {
        const usdcBal = getUserUsdc(address);
        return res.json({ address, balance: '0.0000000', usdcBalance: usdcBal.toFixed(4), assets: [{ code: 'XLM', balance: '0.0000000' }, { code: 'USDC', balance: usdcBal.toFixed(4) }], exists: false });
      }
      throw e;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/activity/:address - Returns recent payment activity with Memos
app.get('/api/activity/:address', async (req, res) => {
  try {
    const { address } = req.params;
    if (!StellarSdk.StrKey.isValidEd25519PublicKey(address)) {
      return res.status(400).json({ error: 'Invalid Stellar Public Key' });
    }
    const payments = await server.payments().forAccount(address).order('desc').limit(30).call();
    const records = await Promise.all(
      payments.records.map(async (p) => {
        let memo = null;
        let memoType = 'none';
        let createdAt = p.created_at || null;
        try {
          const tx = await p.transaction();
          memo = tx.memo || null;
          memoType = tx.memo_type || 'none';
          createdAt = tx.created_at || createdAt;
        } catch (e) {}

        const isIncoming = p.to === address;
        let type = 'unknown';
        if (p.type === 'payment' || p.type === 'path_payment_strict_receive' || p.type === 'path_payment_strict_send') {
          type = isIncoming ? 'receive' : 'send';
        } else if (p.type === 'create_account') {
          type = p.account === address ? 'created' : 'funded';
        }

        return {
          id: p.id,
          type,
          isIncoming,
          amount: p.amount || p.starting_balance || '0.0000',
          asset: p.asset_type === 'native' ? 'XLM' : (p.asset_code || 'XLM'),
          counterparty: isIncoming ? (p.from || p.funder) : (p.to || p.account),
          memo,
          memoType,
          createdAt,
          txHash: p.transaction_hash,
          explorerUrl: `https://stellar.expert/explorer/testnet/tx/${p.transaction_hash}`
        };
      })
    );
    res.json({ address, activity: records });
  } catch (err) {
    if (err.name === 'NotFoundError' || err.response?.status === 404 || err.status === 404) {
      return res.json({ address, activity: [] });
    }
    res.status(500).json({ error: err.message });
  }
});

// 星の金庫 (Star Vault) State & Endpoints
// Holds user deposits for yXLM (5.0% APY) & yUSDC (5.0% APY)
function getOrCreateVault(address) {
  let v = starVaults.get(address);
  if (!v) {
    v = {
      address,
      yXLM: 0.0,
      yUSDC: 0.0,
      lastYieldCalculated: Date.now(),
      totalEarnedXLM: 0.0,
      totalEarnedUSDC: 0.0
    };
    starVaults.set(address, v);
  } else {
    // Compound yield since last check (5.0% APY compounded continuously)
    const now = Date.now();
    const elapsedYears = (now - v.lastYieldCalculated) / (1000 * 60 * 60 * 24 * 365);
    if (elapsedYears > 0 && (v.yXLM > 0 || v.yUSDC > 0)) {
      const yieldRate = 0.05; // 5% APY
      const xlmGain = v.yXLM * yieldRate * elapsedYears;
      const usdcGain = v.yUSDC * yieldRate * elapsedYears;
      v.yXLM += xlmGain;
      v.yUSDC += usdcGain;
      v.totalEarnedXLM += xlmGain;
      v.totalEarnedUSDC += usdcGain;
      v.lastYieldCalculated = now;
    }
  }
  return v;
}

// GET /api/vault/:address - get vault balances & yield stats
app.get('/api/vault/:address', (req, res) => {
  const { address } = req.params;
  if (!address || !StellarSdk.StrKey.isValidEd25519PublicKey(address)) {
    return res.status(400).json({ error: 'Invalid Stellar Public Key' });
  }
  const vault = getOrCreateVault(address);
  res.json({
    address,
    vaultName: '星の金庫 (Star Vault)',
    yXLM: vault.yXLM.toFixed(4),
    yUSDC: vault.yUSDC.toFixed(4),
    totalEarnedXLM: vault.totalEarnedXLM.toFixed(6),
    totalEarnedUSDC: vault.totalEarnedUSDC.toFixed(6),
    apyXLM: '5.0%',
    apyUSDC: '5.0%',
    dailyEstXLM: (vault.yXLM * 0.05 / 365).toFixed(5),
    dailyEstUSDC: (vault.yUSDC * 0.05 / 365).toFixed(5)
  });
});

// POST /api/vault/deposit - deposit XLM or USDC into 星の金庫 (Star Vault)
app.post('/api/vault/deposit', async (req, res) => {
  const { address, asset, amount } = req.body;
  if (!address || !StellarSdk.StrKey.isValidEd25519PublicKey(address)) {
    return res.status(400).json({ error: 'Valid Stellar address required' });
  }
  const amt = parseFloat(amount);
  if (isNaN(amt) || amt <= 0) {
    return res.status(400).json({ error: 'Please enter a valid deposit amount' });
  }

  const vault = getOrCreateVault(address);

  if (asset === 'XLM' || asset === 'yXLM') {
    vault.yXLM += amt;
    savePersistedData();
    return res.json({
      success: true,
      message: `Deposited ${amt} XLM into Star Vault! ✨ (Now earning 5.0% APY as yXLM)`,
      vault
    });
  } else if (asset === 'USDC' || asset === 'yUSDC') {
    const curUsdc = getUserUsdc(address);
    if (curUsdc < amt) {
      return res.status(400).json({ error: `保有USDCが不足しています (保有: ${curUsdc.toFixed(4)} USDC)` });
    }
    setUserUsdc(address, curUsdc - amt);
    vault.yUSDC += amt;
    savePersistedData();
    return res.json({
      success: true,
      message: `Deposited ${amt} USDC into Star Vault! 💵 (Now earning 5.0% APY as yUSDC)`,
      vault,
      usdcBalance: getUserUsdc(address).toFixed(4)
    });
  } else {
    return res.status(400).json({ error: 'Unsupported asset (please choose XLM or USDC)' });
  }
});

// POST /api/vault/withdraw - withdraw from 星の金庫 back to active wallet
app.post('/api/vault/withdraw', async (req, res) => {
  const { address, asset, amount } = req.body;
  if (!address || !StellarSdk.StrKey.isValidEd25519PublicKey(address)) {
    return res.status(400).json({ error: 'Valid Stellar address required' });
  }
  const amt = parseFloat(amount);
  if (isNaN(amt) || amt <= 0) {
    return res.status(400).json({ error: 'Please enter a valid withdrawal amount' });
  }

  const vault = getOrCreateVault(address);

  if (asset === 'yXLM' || asset === 'XLM') {
    if (vault.yXLM < amt) {
      return res.status(400).json({ error: 'Insufficient vault balance' });
    }
    vault.yXLM -= amt;
    savePersistedData();

    // Payout native XLM on-chain from faucet pool to user's wallet
    try {
      const faucetAcc = await server.loadAccount(faucetKeypair.publicKey());
      const tx = new StellarSdk.TransactionBuilder(faucetAcc, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET
      })
        .addOperation(StellarSdk.Operation.payment({
          destination: address,
          asset: StellarSdk.Asset.native(),
          amount: Math.min(100, amt).toFixed(7)
        }))
        .addMemo(StellarSdk.Memo.text('StarVault Return'))
        .setTimeout(30)
        .build();
      tx.sign(faucetKeypair);
      await server.submitTransaction(tx);
    } catch (e) {
      console.warn('Vault withdraw XLM payout failed:', e.message);
    }

    return res.json({
      success: true,
      message: `Withdrew ${amt} XLM from Star Vault back to your wallet!`,
      vault
    });
  } else if (asset === 'yUSDC' || asset === 'USDC') {
    if (vault.yUSDC < amt) {
      return res.status(400).json({ error: 'Insufficient vault balance' });
    }
    vault.yUSDC -= amt;
    const curUsdc = getUserUsdc(address);
    setUserUsdc(address, curUsdc + amt);
    savePersistedData();
    return res.json({
      success: true,
      message: `Withdrew ${amt} USDC from Star Vault back to your wallet!`,
      vault,
      usdcBalance: getUserUsdc(address).toFixed(4)
    });
  } else {
    return res.status(400).json({ error: 'Unsupported asset' });
  }
});

// =========================================================
// =========================================================
// 🔄 星の交換所 (Star Swap) & 三方よし (1:1:1) 手数料分配システム
// 0.30% のプロトコル手数料を 3 等分 (各 0.10%):
// - 0.10%: 運営利益 (Owner Profit) - 現代版両替商のお兄ちゃんの正当な事業収益
// - 0.10%: 月末山分けボーナスプール (Monthly Volume Share Pool)
// - 0.10%: 無料星ドロッププール還元 (Daily Drop Pool)
// =========================================================
const SWAP_FEE_TOTAL = 0.003; // 0.30%
const SWAP_FEE_OWNER = 0.001; // 0.10%
const SWAP_FEE_MONTHLY_BONUS = 0.001; // 0.10%
const SWAP_FEE_DROP_POOL = 0.001; // 0.10%

// Monthly Volume & Bonus Pool State
let monthlyBonusPoolXlm = 125.40; // Initial simulated seed pool
let totalMonthlyVolumeUsd = 12540.0; // Total volume in USD
const userMonthlyVolumes = new Map(); // address -> volume in USD
let ownerAccumulatedProfitXlm = 42.15; // Accumulated owner profit in XLM
let dropPoolAccumulatedRefillXlm = 42.15; // Accumulated drop pool refill in XLM

// Standard conversion rates (1 XLM ≈ 0.135 USDC)
const BASE_RATES = {
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

function getSwapRate(from, to) {
  if (from === to) return 1.0;
  const key = `${from}_${to}`;
  if (BASE_RATES[key]) return BASE_RATES[key];
  // Via XLM
  if (from !== 'XLM' && to !== 'XLM') {
    const toXlm = getSwapRate(from, 'XLM');
    const xlmToTarget = getSwapRate('XLM', to);
    return toXlm * xlmToTarget;
  }
  return 1.0;
}

// Helper: Calculate days remaining until end of current month
function getDaysRemainingInMonth() {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const diffMs = endOfMonth.getTime() - now.getTime();
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

// GET /api/swap/rates - get swap quotes and current protocol fee breakdown
app.get('/api/swap/rates', (req, res) => {
  res.json({
    feeRate: '0.30%',
    split: {
      ownerProfit: '0.10%',
      monthlyBonusPool: '0.10%',
      dropPoolRefill: '0.10%'
    },
    rates: BASE_RATES,
    description: 'スワップ手数料 0.30% (0.10% 月末山分けボーナス / 0.10% 星プール還元 / 0.10% プロトコル維持)'
  });
});

// Helper: Build swap bonus response
function getSwapBonusResponse(address) {
  const userVol = address ? (userMonthlyVolumes.get(address) || 0) : 0;
  const userShareRatio = totalMonthlyVolumeUsd > 0 ? (userVol / totalMonthlyVolumeUsd) : 0;
  const userEstBonusXlm = monthlyBonusPoolXlm * userShareRatio;

  return {
    monthlyPoolTotalXlm: monthlyBonusPoolXlm.toFixed(4),
    monthlyPoolTotalUsd: (monthlyBonusPoolXlm * BASE_RATES['XLM_USDC']).toFixed(2),
    totalMonthlyVolumeUsd: totalMonthlyVolumeUsd.toFixed(2),
    userVolumeUsd: userVol.toFixed(2),
    userSharePercent: (userShareRatio * 100).toFixed(2),
    userEstBonusXlm: userEstBonusXlm.toFixed(4),
    daysRemaining: getDaysRemainingInMonth(),
    splitRule: '0.10% Owner Profit | 0.10% Monthly Bonus Pool | 0.10% Free Drop Pool'
  };
}

// GET /api/swap/bonus and /api/swap/bonus/:address
app.get('/api/swap/bonus', (req, res) => {
  res.json(getSwapBonusResponse(null));
});

app.get('/api/swap/bonus/:address', (req, res) => {
  const { address } = req.params;
  res.json(getSwapBonusResponse(address));
});

// POST /api/swap - execute token swap with 1:1:1 fee split
app.post('/api/swap', async (req, res) => {
  const { address, fromAsset, toAsset, amount } = req.body;
  if (!address || !StellarSdk.StrKey.isValidEd25519PublicKey(address)) {
    return res.status(400).json({ error: '有効なアドレスが必要です' });
  }
  const amt = parseFloat(amount);
  if (isNaN(amt) || amt <= 0) {
    return res.status(400).json({ error: '有効な交換数量を入力してください' });
  }
  if (fromAsset === toAsset) {
    return res.status(400).json({ error: '同じアセット間では交換できません' });
  }

  const rate = getSwapRate(fromAsset, toAsset);
  
  // Total 0.30% fee
  const feeInFromAsset = amt * SWAP_FEE_TOTAL;
  const netInput = amt - feeInFromAsset;
  const netOutput = netInput * rate;

  // Equivalent fee in XLM
  const feeInXlm = fromAsset === 'XLM' ? feeInFromAsset : feeInFromAsset * getSwapRate(fromAsset, 'XLM');
  
  // Equivalent trade volume in USD
  const volumeUsd = fromAsset === 'USDC' || fromAsset === 'yUSDC' 
    ? amt 
    : amt * BASE_RATES['XLM_USDC'];

  // 三方よし 1:1:1 Split (each 1/3 of the 0.30% fee = 0.10%)
  const ownerShareXlm = feeInXlm / 3;
  const bonusShareXlm = feeInXlm / 3;
  const dropPoolShareXlm = feeInXlm / 3;

  // Update state
  ownerAccumulatedProfitXlm += ownerShareXlm;
  monthlyBonusPoolXlm += bonusShareXlm;
  dropPoolAccumulatedRefillXlm += dropPoolShareXlm;
  totalMonthlyVolumeUsd += volumeUsd;
  
  const currentAddressVol = userMonthlyVolumes.get(address) || 0;
  userMonthlyVolumes.set(address, currentAddressVol + volumeUsd);

  console.log(`[StarSwap 1:1:1] Trade: ${amt} ${fromAsset} -> ${netOutput.toFixed(4)} ${toAsset} ($${volumeUsd.toFixed(2)})`);
  console.log(`  ├─ 💰 Owner Profit: +${ownerShareXlm.toFixed(6)} XLM`);
  console.log(`  ├─ 🎁 Monthly Bonus Pool: +${bonusShareXlm.toFixed(6)} XLM (Total Pool: ${monthlyBonusPoolXlm.toFixed(4)} XLM)`);
  console.log(`  └─ 🌟 Drop Pool Refill: +${dropPoolShareXlm.toFixed(6)} XLM`);

  const swapEarnedSp = Math.max(1, Math.round(volumeUsd));
  const currentSp = addStarPoints(address, swapEarnedSp, `Swap volume $${volumeUsd.toFixed(2)}`);

  // Universal Balance Updates for all 12 asset pairs (XLM, USDC, yXLM, yUSDC)
  const curUsdc = getUserUsdc(address);
  const vault = getOrCreateVault(address);

  // 1. Verify and deduct source asset
  if (fromAsset === 'USDC') {
    if (curUsdc < amt) {
      return res.status(400).json({ error: `保有USDCが不足しています (保有: ${curUsdc.toFixed(4)} USDC)` });
    }
    setUserUsdc(address, curUsdc - amt);
  } else if (fromAsset === 'yUSDC') {
    if (vault.yUSDC < amt) {
      return res.status(400).json({ error: `金庫のyUSDCが不足しています (保有: ${vault.yUSDC.toFixed(4)} yUSDC)` });
    }
    vault.yUSDC -= amt;
  } else if (fromAsset === 'yXLM') {
    if (vault.yXLM < amt) {
      return res.status(400).json({ error: `金庫のyXLMが不足しています (保有: ${vault.yXLM.toFixed(4)} yXLM)` });
    }
    vault.yXLM -= amt;
  }

  // 2. Credit target asset
  if (toAsset === 'USDC') {
    setUserUsdc(address, getUserUsdc(address) + netOutput);
  } else if (toAsset === 'yUSDC') {
    vault.yUSDC += netOutput;
  } else if (toAsset === 'yXLM') {
    vault.yXLM += netOutput;
  } else if (toAsset === 'XLM') {
    // Attempt payout from Testnet distributor faucet
    try {
      const faucetAcc = await server.loadAccount(faucetKeypair.publicKey());
      const tx = new StellarSdk.TransactionBuilder(faucetAcc, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET
      })
        .addOperation(StellarSdk.Operation.payment({
          destination: address,
          asset: StellarSdk.Asset.native(),
          amount: Math.min(100, netOutput).toFixed(7)
        }))
        .setTimeout(30)
        .build();
      tx.sign(faucetKeypair);
      await server.submitTransaction(tx);
    } catch (e) {
      console.warn('Faucet payment for swap to XLM failed:', e.message);
    }
  }

  savePersistedData();

  try {
    const userTotalVol = userMonthlyVolumes.get(address);
    const userShareRatio = totalMonthlyVolumeUsd > 0 ? (userTotalVol / totalMonthlyVolumeUsd) : 0;
    const userEstBonusXlm = monthlyBonusPoolXlm * userShareRatio;

    res.json({
      success: true,
      fromAsset,
      toAsset,
      inputAmount: amt.toFixed(4),
      outputAmount: netOutput.toFixed(4),
      rate: rate.toFixed(5),
      feePercent: '0.30%',
      split: {
        ownerProfitXlm: ownerShareXlm.toFixed(6),
        monthlyBonusXlm: bonusShareXlm.toFixed(6),
        dropPoolRefillXlm: dropPoolShareXlm.toFixed(6)
      },
      userVolumeUsd: userTotalVol.toFixed(2),
      userEstBonusXlm: userEstBonusXlm.toFixed(4),
      monthlyPoolTotalXlm: monthlyBonusPoolXlm.toFixed(4),
      usdcBalance: getUserUsdc(address).toFixed(4),
      vault: {
        yXLM: vault.yXLM.toFixed(4),
        yUSDC: vault.yUSDC.toFixed(4),
        totalEarnedXLM: vault.totalEarnedXLM.toFixed(6),
        totalEarnedUSDC: vault.totalEarnedUSDC.toFixed(6)
      },
      starPoints: currentSp,
      earnedSp: swapEarnedSp,
      message: `Swapped ${amt} ${fromAsset} for ${netOutput.toFixed(4)} ${toAsset}! 🎉 (+${swapEarnedSp} SP earned!)`
    });
  } catch (err) {
    console.error('Swap error:', err);
    res.status(500).json({ error: 'スワップ処理に失敗しました: ' + err.message });
  }
});

// POST /api/claim - claims 0.05 XLM reward
app.post('/api/claim', async (req, res) => {
  const { destination, adWatched } = req.body;

  if (!destination || !StellarSdk.StrKey.isValidEd25519PublicKey(destination)) {
    return res.status(400).json({ error: '有効なStellar公開鍵を入力してください' });
  }

  if (!adWatched) {
    return res.status(400).json({ error: '広告視聴が完了していません' });
  }

  // Ensure on-chain fallback sync if container recently rebooted
  const today = getTodayString();
  const existingCheck = userClaimRecords.get(destination);
  if (!existingCheck || existingCheck.dateStr !== today || existingCheck.count === 0) {
    await syncClaimStatusFromChain(destination);
  }

  const status = getUserClaimStatus(destination);

  if (status.remainingToday <= 0) {
    return res.status(403).json({
      error: 'Daily claim limit reached (5/5). Come back tomorrow for more drops! ⭐',
      remainingToday: 0
    });
  }

  if (status.cooldownRemainingSec > 0) {
    const mins = Math.floor(status.cooldownRemainingSec / 60);
    const secs = status.cooldownRemainingSec % 60;
    const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    return res.status(429).json({
      error: `Cooldown active. Next star drop available in ${timeStr}.`,
      retryAfter: status.cooldownRemainingSec
    });
  }

  try {
    const faucetAcc = await server.loadAccount(faucetKeypair.publicKey());
    
    // Check if destination exists
    let destExists = false;
    try {
      await server.loadAccount(destination);
      destExists = true;
    } catch (e) {
      if (e.name === 'NotFoundError') {
        destExists = false;
      }
    }

    const gamificationData = getUserGamification(destination);
    const userPerks = Array.isArray(gamificationData.perks) ? gamificationData.perks : [];
    const isFirstClaimToday = (status.claimsToday === 0);
    const hasBoostTicket = userPerks.includes('boost_ticket');
    const isBoostActive = isFirstClaimToday || hasBoostTicket;
    const rewardAmount = isBoostActive ? '0.10' : '0.05';
    const earnedSp = isBoostActive ? 40 : 20;
    let ticketConsumed = false;

    if (!isFirstClaimToday && hasBoostTicket) {
      gamificationData.perks = userPerks.filter(p => p !== 'boost_ticket');
      userGamificationData.set(destination, gamificationData);
      ticketConsumed = true;
    }

    let operation;
    if (!destExists) {
      // Account doesn't exist yet on ledger. Activate it with 1.0 XLM on Testnet!
      operation = StellarSdk.Operation.createAccount({
        destination: destination,
        startingBalance: '1.0'
      });
    } else {
      // Payment of 0.10 XLM (if boost active) or 0.05 XLM
      operation = StellarSdk.Operation.payment({
        destination: destination,
        asset: StellarSdk.Asset.native(),
        amount: rewardAmount
      });
    }

    // Fetch live base fee from network (Stellar Raven / Protocol 28 Best Practice)
    let dynamicFee = StellarSdk.BASE_FEE;
    try {
      dynamicFee = await server.fetchBaseFee();
    } catch (e) {
      console.warn('Failed to fetch dynamic base fee, fallback to default BASE_FEE:', e.message);
    }

    const memoText = isFirstClaimToday ? 'StarPocket 2x Drop' : (ticketConsumed ? 'StarPocket 2x Boost' : 'StarPocket Reward');

    const tx = new StellarSdk.TransactionBuilder(faucetAcc, {
      fee: dynamicFee,
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
    .addOperation(operation)
    .addMemo(StellarSdk.Memo.text(memoText))
    .setTimeout(30)
    .build();

    tx.sign(faucetKeypair);
    const txResult = await server.submitTransaction(tx);

    // Update claim count & last claim time
    const existing = userClaimRecords.get(destination) || { dateStr: today, count: 0, lastClaimTime: 0 };
    if (existing.dateStr !== today) {
      existing.dateStr = today;
      existing.count = 0;
    }
    if (req.body.clientClaimCount && req.body.clientClaimCount > existing.count) {
      existing.count = req.body.clientClaimCount;
    }
    existing.count += 1;
    existing.lastClaimTime = Date.now();
    userClaimRecords.set(destination, existing);
    savePersistedData();

    const updatedStatus = getUserClaimStatus(destination);
    const updatedSp = addStarPoints(destination, earnedSp, isFirstClaimToday ? 'Daily First 2x Drop Claim' : (ticketConsumed ? 'Double Boost Ticket Drop' : 'Daily Drop Claim'));

    const isJa = req.body.lang === 'ja';
    const message = destExists
      ? (isFirstClaimToday
          ? (isJa
              ? '🔥 本日初回 2倍ブースト！ 0.10 XLM がポケットに着金しました！⭐ (+40 SP獲得！)'
              : '🔥 2x Daily First Boost! 0.10 XLM deposited directly to your StarPocket! ⭐ (+40 SP earned!)')
          : ticketConsumed
            ? (isJa
                ? '🚀 ダブルブーストチケット発動！ 0.10 XLM がポケットに着金しました！⭐ (+40 SP獲得！)'
                : '🚀 Double Boost Ticket Applied! 0.10 XLM deposited directly to your StarPocket! ⭐ (+40 SP earned!)')
            : (isJa
                ? '0.05 XLM がポケットに着金しました！⭐ (+20 SP獲得！)'
                : '0.05 XLM deposited directly to your StarPocket! ⭐ (+20 SP earned!)'))
      : (isJa
          ? '新しいウォレットが 1.0 XLM のウェルカムボーナスで開設されました！⭐ (+20 SP獲得！)'
          : 'New wallet activated with a 1.0 XLM welcome bonus! ⭐ (+20 SP earned!)');

    res.json({
      success: true,
      amount: destExists ? rewardAmount : '1.0 (Welcome Bonus)',
      txHash: txResult.hash,
      destination,
      explorerUrl: `https://stellar.expert/explorer/testnet/tx/${txResult.hash}`,
      status: updatedStatus,
      starPoints: updatedSp,
      earnedSp,
      isFirstClaimToday,
      message
    });
  } catch (err) {
    console.error('Claim error:', err);
    res.status(500).json({ error: '送金トランザクションの送信に失敗しました: ' + (err.message || 'Unknown error') });
  }
});

// Serve frontend dist if available
const DIST_PATH = path.join(__dirname, 'dist');
if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(DIST_PATH, 'index.html'));
  });
}

initFaucet().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 StarPocket Fullstack App running at http://localhost:${PORT}`);
  });
});
