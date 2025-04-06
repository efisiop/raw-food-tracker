/**
 * Calculate the base unit for a given unit of measurement
 * @param {string} unitOfMeasurement - The unit of measurement (g, kg, ml, L, piece, bunch)
 * @returns {string} The base unit (kg, L, piece)
 */
export function calculateBaseUnit(unitOfMeasurement) {
  switch (unitOfMeasurement) {
    case 'g':
    case 'kg':
      return 'kg';
    case 'ml':
    case 'L':
      return 'L';
    case 'piece':
    case 'bunch':
      return 'piece';
    default:
      throw new Error(`Unsupported unit of measurement: ${unitOfMeasurement}`);
  }
}

/**
 * Convert quantity to base unit
 * @param {number} quantity - The quantity in original unit
 * @param {string} unitOfMeasurement - The unit of measurement (g, kg, ml, L, piece, bunch)
 * @returns {number} The quantity in base unit
 */
export function calculateQuantityInBaseUnit(quantity, unitOfMeasurement) {
  switch (unitOfMeasurement) {
    case 'g':
      return quantity / 1000; // Convert to kg
    case 'kg':
      return quantity; // Already in base unit
    case 'ml':
      return quantity / 1000; // Convert to L
    case 'L':
      return quantity; // Already in base unit
    case 'piece':
    case 'bunch':
      return quantity; // Already in base unit
    default:
      throw new Error(`Unsupported unit of measurement: ${unitOfMeasurement}`);
  }
}

/**
 * Calculate standardized price (price per base unit)
 * @param {number} purchasePrice - The total purchase price
 * @param {number} quantity - The quantity in original unit
 * @param {string} unitOfMeasurement - The unit of measurement (g, kg, ml, L, piece, bunch)
 * @returns {number} The standardized price (price per base unit)
 */
export function calculateStandardizedPrice(purchasePrice, quantity, unitOfMeasurement) {
  const quantityInBaseUnit = calculateQuantityInBaseUnit(quantity, unitOfMeasurement);
  
  // Handle division by zero
  if (quantityInBaseUnit === 0) {
    return 0; // Or throw an error depending on requirements
  }
  
  return purchasePrice / quantityInBaseUnit;
} 