/**
 * Exchange rates relative to DKK
 * These rates could be updated from an API in a production environment
 */
const exchangeRates = {
  'DKK': 1.0,      // Danish Krone (base currency)
  'EUR': 7.44,     // Euro to DKK
  'USD': 6.84      // US Dollar to DKK
};

/**
 * Convert amount from one currency to another
 * @param {number} amount - The amount to convert
 * @param {string} fromCurrency - The source currency code
 * @param {string} toCurrency - The target currency code
 * @returns {number} The converted amount
 */
export function convertCurrency(amount, fromCurrency, toCurrency) {
  // If same currency, no conversion needed
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  // Check if currencies are supported
  if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
    throw new Error(`Unsupported currency: ${!exchangeRates[fromCurrency] ? fromCurrency : toCurrency}`);
  }
  
  // Convert to DKK first (our base currency)
  const amountInDKK = amount * exchangeRates[fromCurrency];
  
  // Convert from DKK to target currency
  const convertedAmount = amountInDKK / exchangeRates[toCurrency];
  
  return convertedAmount;
}

/**
 * Format amount with currency symbol
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code
 * @returns {string} Formatted amount with currency symbol
 */
export function formatCurrency(amount, currency) {
  const options = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };
  
  // Use browser's Intl API for formatting
  try {
    return new Intl.NumberFormat('en-US', options).format(amount);
  } catch (error) {
    // Fallback if Intl API is not supported
    return `${amount.toFixed(2)} ${currency}`;
  }
} 