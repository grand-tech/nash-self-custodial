import {AccountInformation} from '../features/onboarding/sagas/interfaces';

/**
 * Pin cache.
 * @typedef { object } AccountInformationCache.
 * @property { AccountInformation } account the account.
 * @property { number } cacheExpiryTime the expiry date/time of the cached value.
 */
interface AccountInformationCache {
  account: AccountInformation;
  cacheExpiryTime: number;
}

/**
 * Pin cache.
 * @typedef { object } PinCache.
 * @property { string } pin the cached pin number.
 * @property { number } cacheExpiryTime the expiry date/time of the cached value.
 */
interface PinCache {
  pin: string;
  cacheExpiryTime: number;
}

export class NashCache {
  /**
   * The amount of time a cached value is viable for use within the app.
   */
  private static CACHE_LIFESPAN: number;

  /**
   * The default amount of time a cached value is viable for use within the app.
   */
  private static DEFAULT_CACHE_LIFESPAN = 600000; // 10 minutes

  /**
   * Holds account information.
   */
  private static accountCache: AccountInformationCache;

  /**
   * Holds pin numbers.
   */
  private static pinCache: PinCache;

  /**
   * Constructor.
   * @param lifespan the amount of time a cached value is viable for use within the app.
   */
  constructor(lifespan: number) {
    if (lifespan < 100000) {
      NashCache.CACHE_LIFESPAN = NashCache.DEFAULT_CACHE_LIFESPAN;
    } else {
      NashCache.CACHE_LIFESPAN = lifespan;
    }
  }

  /**
   * Caches account information.
   * @param a the account information to be cached.
   */
  static setAccountInformationCache(a: AccountInformation) {
    NashCache.setDefaultLifeSpan();
    let expiryTime = NashCache.CACHE_LIFESPAN + Date.now();
    const cache: AccountInformationCache = {
      cacheExpiryTime: expiryTime,
      account: a,
    };
    NashCache.accountCache = cache;
  }

  /**
   * Gets the cached account value if its still viable for use.
   * @returns the cached account.
   */
  static getAccountInformationCache() {
    if (Date.now() < NashCache.accountCache.cacheExpiryTime) {
      return NashCache.accountCache.account;
    } else {
      return null;
    }
  }

  /**
   * Caches pin number.
   * @param pin the pin number to be cached.
   */
  static setPinCache(pin: string) {
    NashCache.setDefaultLifeSpan();
    let expiryTime = NashCache.CACHE_LIFESPAN + Date.now();
    this.pinCache = {
      cacheExpiryTime: expiryTime,
      pin: pin,
    };
  }

  /**
   * Gets the cached pin value if its still viable for use.
   * @returns the cached pin value.
   */
  static getPinCache() {
    if (NashCache.pinCache.cacheExpiryTime > Date.now()) {
      return this.pinCache.pin;
    } else {
      return null;
    }
  }

  /**
   * Sets the default lifespan of cached values if its not set.
   */
  private static setDefaultLifeSpan() {
    if (!NashCache.CACHE_LIFESPAN) {
      NashCache.CACHE_LIFESPAN = NashCache.DEFAULT_CACHE_LIFESPAN;
    }
  }
}
