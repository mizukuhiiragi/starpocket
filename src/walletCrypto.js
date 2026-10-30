import * as bip39 from 'bip39';
import * as ed25519 from 'ed25519-hd-key';
import { Keypair, StrKey } from '@stellar/stellar-sdk';

export const STELLAR_DERIVATION_PATH = "m/44'/148'/0'";

/**
 * Generate 12-word BIP-39 mnemonic phrase
 */
export function generateNewMnemonic() {
  return bip39.generateMnemonic(128);
}

/**
 * Validate 12-word or 24-word mnemonic phrase
 */
export function validateMnemonic(mnemonic) {
  if (!mnemonic || typeof mnemonic !== 'string') return false;
  return bip39.validateMnemonic(mnemonic.trim().toLowerCase());
}

/**
 * Validate Stellar secret key (S... 56 chars)
 */
export function validateSecretKey(secret) {
  if (!secret || typeof secret !== 'string') return false;
  return StrKey.isValidEd25519SecretSeed(secret.trim());
}

/**
 * Derive Stellar Keypair from BIP-39 Mnemonic using SEP-0005 path m/44'/148'/0'
 */
export function deriveKeypairFromMnemonic(mnemonic) {
  const clean = mnemonic.trim().toLowerCase();
  if (!bip39.validateMnemonic(clean)) {
    throw new Error('Invalid mnemonic phrase');
  }
  const seed = bip39.mnemonicToSeedSync(clean);
  const derived = ed25519.derivePath(STELLAR_DERIVATION_PATH, seed.toString('hex'));
  const pair = Keypair.fromRawEd25519Seed(derived.key);
  return {
    publicKey: pair.publicKey(),
    secret: pair.secret(),
    mnemonic: clean,
    pair
  };
}

/**
 * Derive Stellar Keypair from raw secret key (S...)
 */
export function getKeypairFromSecret(secret) {
  const clean = secret.trim();
  if (!validateSecretKey(clean)) {
    throw new Error('Invalid Stellar secret key');
  }
  const pair = Keypair.fromSecret(clean);
  return {
    publicKey: pair.publicKey(),
    secret: pair.secret(),
    mnemonic: null,
    pair
  };
}
