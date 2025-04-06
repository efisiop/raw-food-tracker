import { calculateBaseUnit, calculateQuantityInBaseUnit, calculateStandardizedPrice } from './calculations';

describe('Calculation Utilities', () => {
  describe('calculateBaseUnit', () => {
    test('should return kg for weight units', () => {
      expect(calculateBaseUnit('g')).toBe('kg');
      expect(calculateBaseUnit('kg')).toBe('kg');
    });

    test('should return L for volume units', () => {
      expect(calculateBaseUnit('ml')).toBe('L');
      expect(calculateBaseUnit('L')).toBe('L');
    });

    test('should return piece for count units', () => {
      expect(calculateBaseUnit('piece')).toBe('piece');
      expect(calculateBaseUnit('bunch')).toBe('piece');
    });

    test('should throw error for unsupported units', () => {
      expect(() => calculateBaseUnit('unsupported')).toThrow();
    });
  });

  describe('calculateQuantityInBaseUnit', () => {
    test('should convert grams to kilograms', () => {
      expect(calculateQuantityInBaseUnit(500, 'g')).toBe(0.5);
    });

    test('should keep kilograms as is', () => {
      expect(calculateQuantityInBaseUnit(2, 'kg')).toBe(2);
    });

    test('should convert milliliters to liters', () => {
      expect(calculateQuantityInBaseUnit(750, 'ml')).toBe(0.75);
    });

    test('should keep liters as is', () => {
      expect(calculateQuantityInBaseUnit(1.5, 'L')).toBe(1.5);
    });

    test('should keep piece counts as is', () => {
      expect(calculateQuantityInBaseUnit(3, 'piece')).toBe(3);
      expect(calculateQuantityInBaseUnit(2, 'bunch')).toBe(2);
    });
  });

  describe('calculateStandardizedPrice', () => {
    test('should calculate price per kg for weight items', () => {
      // 500g for 25 DKK = 50 DKK/kg
      expect(calculateStandardizedPrice(25, 500, 'g')).toBe(50);
      
      // 2kg for 40 DKK = 20 DKK/kg
      expect(calculateStandardizedPrice(40, 2, 'kg')).toBe(20);
    });

    test('should calculate price per L for volume items', () => {
      // 500ml for 15 DKK = 30 DKK/L
      expect(calculateStandardizedPrice(15, 500, 'ml')).toBe(30);
      
      // 1.5L for 30 DKK = 20 DKK/L
      expect(calculateStandardizedPrice(30, 1.5, 'L')).toBe(20);
    });

    test('should calculate price per piece for count items', () => {
      // 3 pieces for 30 DKK = 10 DKK/piece
      expect(calculateStandardizedPrice(30, 3, 'piece')).toBe(10);
      
      // 2 bunches for 40 DKK = 20 DKK/bunch
      expect(calculateStandardizedPrice(40, 2, 'bunch')).toBe(20);
    });

    test('should handle zero quantity gracefully', () => {
      expect(calculateStandardizedPrice(50, 0, 'kg')).toBe(0);
    });
  });
}); 