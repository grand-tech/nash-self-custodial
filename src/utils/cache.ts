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

  public static DEFAULT_RAMP_PAGINATOR_VALUE = 10000;

  /**
   * Holds pin numbers.
   */
  private static pinCache: PinCache;

  /**
   * Keeps track of where to start on the next batch of transactions.
   */
  private static rampPendingTransactionsPaginator: number =
    NashCache.DEFAULT_RAMP_PAGINATOR_VALUE;

  /**
   * Keeps track of where to start on the next batch of transactions.
   */
  private static rampMyTransactionsPaginator: number =
    NashCache.DEFAULT_RAMP_PAGINATOR_VALUE;

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
   * Caches the pagination tracker.
   * @param paginator where to start in the next query.
   */
  static setRampPaginator(paginator: number) {
    this.rampPendingTransactionsPaginator = paginator;
  }

  /**
   * Caches the pagination tracker.
   */
  static getRampPaginator() {
    return this.rampPendingTransactionsPaginator;
  }

  /**
   * Caches the pagination tracker.
   * @param paginator where to start in the next query.
   */
  static setMyTransactionsRampPaginator(paginator: number) {
    this.rampMyTransactionsPaginator = paginator;
  }

  /**
   * Caches the pagination tracker.
   */
  static getMyTransactionsRampPaginator() {
    return this.rampMyTransactionsPaginator;
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
    if (!NashCache.pinCache) {
      return null;
    } else if (NashCache.pinCache.cacheExpiryTime > Date.now()) {
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
