/**
 * walletManager.js - Multi-Account Management for StarPocket
 * Manages multiple wallets ("お財布 1", "お財布 2", ...) without overwriting.
 */

export function getSavedWallets() {
  try {
    const raw = localStorage.getItem('starpocket_wallets');
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length > 0) return list;
    }
  } catch (e) {
    console.error('Failed to parse wallets from storage:', e);
  }

  // Legacy single-wallet migration
  const legacyPub = localStorage.getItem('starpocket_stellar_pub') || localStorage.getItem('lumendrop_stellar_pub');
  const legacySec = localStorage.getItem('starpocket_stellar_secret') || localStorage.getItem('lumendrop_stellar_secret');
  const legacyMnemonic = localStorage.getItem('starpocket_stellar_mnemonic') || '';

  if (legacyPub && legacySec) {
    const initialList = [{
      id: 'wallet_1',
      name: 'お財布 1',
      publicKey: legacyPub,
      secret: legacySec,
      mnemonic: legacyMnemonic || null,
      createdAt: Date.now()
    }];
    saveWallets(initialList);
    setActiveWalletId('wallet_1');
    return initialList;
  }

  return [];
}

export function saveWallets(wallets) {
  localStorage.setItem('starpocket_wallets', JSON.stringify(wallets));
}

export function getActiveWalletId(wallets) {
  const savedId = localStorage.getItem('starpocket_active_wallet_id');
  if (savedId && wallets.some(w => w.id === savedId)) {
    return savedId;
  }
  return wallets[0]?.id || null;
}

export function setActiveWalletId(id) {
  localStorage.setItem('starpocket_active_wallet_id', id);
}

export function addWallet(newWallet) {
  const current = getSavedWallets();
  const nextNumber = current.length + 1;
  const walletWithDefaults = {
    id: `wallet_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: newWallet.name || `お財布 ${nextNumber}`,
    publicKey: newWallet.publicKey,
    secret: newWallet.secret,
    mnemonic: newWallet.mnemonic || null,
    createdAt: Date.now()
  };
  const updated = [...current, walletWithDefaults];
  saveWallets(updated);
  setActiveWalletId(walletWithDefaults.id);

  // Sync active wallet to standard storage keys
  localStorage.setItem('starpocket_stellar_pub', walletWithDefaults.publicKey);
  localStorage.setItem('starpocket_stellar_secret', walletWithDefaults.secret);
  if (walletWithDefaults.mnemonic) {
    localStorage.setItem('starpocket_stellar_mnemonic', walletWithDefaults.mnemonic);
  } else {
    localStorage.removeItem('starpocket_stellar_mnemonic');
  }
  return { updatedWallets: updated, activeWallet: walletWithDefaults };
}

export function switchWallet(id) {
  const current = getSavedWallets();
  const target = current.find(w => w.id === id);
  if (!target) return null;
  setActiveWalletId(target.id);

  localStorage.setItem('starpocket_stellar_pub', target.publicKey);
  localStorage.setItem('starpocket_stellar_secret', target.secret);
  if (target.mnemonic) {
    localStorage.setItem('starpocket_stellar_mnemonic', target.mnemonic);
  } else {
    localStorage.removeItem('starpocket_stellar_mnemonic');
  }
  return target;
}

export function renameWallet(id, newName) {
  const current = getSavedWallets();
  const updated = current.map(w => w.id === id ? { ...w, name: newName.trim() || w.name } : w);
  saveWallets(updated);
  return updated;
}

export function removeWallet(id) {
  const current = getSavedWallets();
  if (current.length <= 1) return { error: '最後の1つのお財布は削除できません' };
  const updated = current.filter(w => w.id !== id);
  saveWallets(updated);
  const nextActive = updated[0];
  switchWallet(nextActive.id);
  return { updatedWallets: updated, activeWallet: nextActive };
}
