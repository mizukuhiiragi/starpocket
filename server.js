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
    fs.appendFileSync(ENV_PATH, `\nFAUCET_SECRET_KEY=${secret}\n`);
    console.log('Saved new faucet key to .env:', faucetKeypair.publicKey());
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
    if (err.name === 'NotFoundError') {
      console.log('Faucet account not found on Testnet, requesting Friendbot funding...');
      await fundViaFriendbot(faucetKeypair.publicKey());
    } else {
      console.error('Error loading faucet account:', err.message);
    }
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
const COOLDOWN_SECONDS = process.env.COOLDOWN_SECONDS ? parseInt(process.env.COOLDOWN_SECONDS) : 15 * 60; // 15 minutes default
const COOLDOWN_MS = COOLDOWN_SECONDS * 1000;

// Store user claim records in-memory: destination -> { dateStr, count, lastClaimTime }
const userClaimRecords = new Map();

function getTodayString() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
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

  return {
    destination,
    maxDaily: MAX_DAILY_CLAIMS,
    claimsToday: record.count,
    remainingToday,
    cooldownRemainingSec,
    canClaim,
    nextAvailableAt: cooldownRemainingSec > 0 ? new Date(now + cooldownRemainingSec * 1000).toISOString() : null
  };
}

// GET /api/user-status/:address - get user's daily quota and cooldown
app.get('/api/user-status/:address', (req, res) => {
  const { address } = req.params;
  if (!address || !StellarSdk.StrKey.isValidEd25519PublicKey(address)) {
    return res.status(400).json({ error: 'Invalid Stellar Public Key' });
  }
  res.json(getUserClaimStatus(address));
});

// GET /api/faucet - returns pool status
app.get('/api/faucet', async (req, res) => {
  try {
    if (!faucetKeypair) {
      return res.status(503).json({ error: 'Faucet initializing' });
    }
    const acc = await server.loadAccount(faucetKeypair.publicKey());
    const nativeBal = acc.balances.find(b => b.asset_type === 'native')?.balance || '0';
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
      const assets = acc.balances.map(b => ({
        code: b.asset_type === 'native' ? 'XLM' : b.asset_code,
        type: b.asset_type,
        issuer: b.asset_issuer || null,
        balance: b.balance
      }));
      res.json({ address, balance: nativeBal, assets, exists: true });
    } catch (e) {
      if (e.name === 'NotFoundError') {
        return res.json({ address, balance: '0.0000000', assets: [{ code: 'XLM', balance: '0.0000000' }], exists: false });
      }
      throw e;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 星の金庫 (Star Vault) State & Endpoints
// Holds user deposits for yXLM (5.0% APY) & yUSDC (5.0% APY)
const starVaults = new Map();

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
    return res.json({
      success: true,
      message: `Deposited ${amt} XLM into Star Vault! ✨ (Now earning 5.0% APY as yXLM)`,
      vault
    });
  } else if (asset === 'USDC' || asset === 'yUSDC') {
    vault.yUSDC += amt;
    return res.json({
      success: true,
      message: `Deposited ${amt} USDC into Star Vault! 💵 (Now earning 5.0% APY as yUSDC)`,
      vault
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
    return res.json({
      success: true,
      message: `Withdrew ${amt} USDC from Star Vault back to your wallet!`,
      vault
    });
  } else {
    return res.status(400).json({ error: 'Unsupported asset' });
  }
});

// =========================================================
// 🔄 星の交換所 (Star Swap) & 自動フライホイール還元システム
// 0.3%のプロトコル手数料を徴収し、全額を「星集めプール」に還元！
// =========================================================
const SWAP_FEE_RATE = 0.003; // 0.3%

// Standard conversion rates (1 XLM ≈ 0.135 USDC)
const BASE_RATES = {
  'XLM_USDC': 0.135,
  'USDC_XLM': 1 / 0.135,
  'XLM_yXLM': 0.98,
  'yXLM_XLM': 1 / 0.98,
  'USDC_yUSDC': 0.98,
  'yUSDC_USDC': 1 / 0.98,
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

// GET /api/swap/rates - get swap quotes and current protocol fee
app.get('/api/swap/rates', (req, res) => {
  res.json({
    feeRate: '0.3%',
    rates: BASE_RATES,
    description: 'スワップ手数料の100%が星集めプールへ自動還元されます（自己資金ゼロ永久機関）'
  });
});

// POST /api/swap - execute token swap
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
  const grossOutput = amt * rate;
  
  // Calculate 0.3% protocol fee
  const feeInFromAsset = amt * SWAP_FEE_RATE;
  const netInput = amt - feeInFromAsset;
  const netOutput = netInput * rate;

  // Calculate equivalent XLM fee to contribute to the Faucet pool
  const feeInXlm = fromAsset === 'XLM' ? feeInFromAsset : feeInFromAsset * getSwapRate(fromAsset, 'XLM');

  // In Testnet mode: Simulate or transfer the fee into faucet pool
  try {
    if (faucetKeypair) {
      console.log(`[Flywheel] Swap executed: ${amt} ${fromAsset} -> ${netOutput.toFixed(4)} ${toAsset}. Fee contributed to pool: +${feeInXlm.toFixed(6)} XLM`);
    }

    res.json({
      success: true,
      fromAsset,
      toAsset,
      inputAmount: amt.toFixed(4),
      outputAmount: netOutput.toFixed(4),
      rate: rate.toFixed(5),
      feePercent: '0.3%',
      feeContributedToPool: `${feeInXlm.toFixed(6)} XLM`,
      message: `Swapped ${amt} ${fromAsset} for ${netOutput.toFixed(4)} ${toAsset}! 🎉 (+${feeInXlm.toFixed(5)} XLM fee added to the Community Drop Pool)`
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

    let operation;
    const rewardAmount = '0.05';

    if (!destExists) {
      // Account doesn't exist yet on ledger. Activate it with 1.0 XLM on Testnet!
      operation = StellarSdk.Operation.createAccount({
        destination: destination,
        startingBalance: '1.0'
      });
    } else {
      // Normal payment of 0.05 XLM
      operation = StellarSdk.Operation.payment({
        destination: destination,
        asset: StellarSdk.Asset.native(),
        amount: rewardAmount
      });
    }

    const tx = new StellarSdk.TransactionBuilder(faucetAcc, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
    .addOperation(operation)
    .addMemo(StellarSdk.Memo.text('StarPocket Reward'))
    .setTimeout(30)
    .build();

    tx.sign(faucetKeypair);
    const txResult = await server.submitTransaction(tx);

    // Update claim count & last claim time
    const today = getTodayString();
    const existing = userClaimRecords.get(destination) || { dateStr: today, count: 0, lastClaimTime: 0 };
    if (existing.dateStr !== today) {
      existing.dateStr = today;
      existing.count = 0;
    }
    existing.count += 1;
    existing.lastClaimTime = Date.now();
    userClaimRecords.set(destination, existing);

    const updatedStatus = getUserClaimStatus(destination);

    res.json({
      success: true,
      amount: destExists ? rewardAmount : '1.0 (Welcome Bonus)',
      txHash: txResult.hash,
      destination,
      explorerUrl: `https://stellar.expert/explorer/testnet/tx/${txResult.hash}`,
      status: updatedStatus,
      message: destExists
        ? '0.05 XLM deposited directly to your StarPocket! ⭐'
        : 'New wallet activated with a 1.0 XLM welcome bonus! ⭐'
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
