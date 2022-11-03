export interface CurrencyLayerRates {
  KESBRL: number;
  KESEUR: number;
  KESUSD: number;
}
/**
 * Tag for logging and debugging purposes.
 */
const TAG = '[ Currency Layer API ] : ';

export async function getCurrencyRates() {
  const result = await fetch(
    'https://api.apilayer.com/currency_data/live?source=KES&currencies=EUR%2C%20USD%2C%20BRL',
    {
      headers: {
        apiKey: 'GpXJZO3e5pMj7rFXIdGJo80zWmfYh5Fo',
        method: 'GET',
      },
    },
  );

  const json = await result.json();

  if (json.success) {
    const results = json.quotes;
    const rst: CurrencyLayerRates = {
      KESBRL: results.KESBRL,
      KESEUR: results.KESEUR,
      KESUSD: results.KESUSD,
    };
    return rst;
  } else {
    console.error(TAG, json);
    const rst: CurrencyLayerRates = {
      KESBRL: 0,
      KESEUR: 0,
      KESUSD: 0,
    };
    return rst;
  }
}
