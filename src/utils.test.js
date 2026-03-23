import { describe, it, expect } from 'vitest';
import { calculateTotals, convertCurrency, validatePersonName, validateDish } from './utils';

describe('Utility Functions', () => {
  describe('calculateTotals', () => {
    it('calculates totals correctly for shared dishes', () => {
      const assignments = {
        'فهد': [1, 2],
        'علي': [1],
      };
      const dishes = [
        { id: 1, name: 'بيتزا', price: 50, quantity: 1 },
        { id: 2, name: 'عصير', price: 20, quantity: 2 },
      ];
      
      const totals = calculateTotals(assignments, dishes);
      
      // الطبق 1 مقسم على شخصين: 50 / 2 = 25 لكل شخص
      // الطبق 2 مقسم على شخص واحد: 20 * 2 = 40 لـ فهد فقط
      expect(totals['فهد']).toBeCloseTo(25 + 40); // 65
      expect(totals['علي']).toBeCloseTo(25); // 25
    });
    
    it('returns empty object when no assignments', () => {
      const totals = calculateTotals({}, []);
      expect(totals).toEqual({});
    });
    
    it('handles dish not found gracefully', () => {
      const assignments = { 'فهد': [999] };
      const dishes = [];
      const totals = calculateTotals(assignments, dishes);
      expect(totals['فهد']).toBe(0);
    });
  });
  
  describe('convertCurrency', () => {
    it('converts KWD to SAR correctly', () => {
      const result = convertCurrency(10, 'KWD', 'SAR');
      // 10 دينار * 12.2 = 122 ريال
      expect(result).toBeCloseTo(122);
    });
    
    it('returns same amount when same currency', () => {
      const result = convertCurrency(100, 'SAR', 'SAR');
      expect(result).toBe(100);
    });
    
    it('returns original amount for unknown currency', () => {
      const result = convertCurrency(50, 'USD', 'SAR');
      expect(result).toBe(50);
    });
  });
  
  describe('validatePersonName', () => {
    it('accepts valid name', () => {
      const result = validatePersonName('فهد', []);
      expect(result.valid).toBe(true);
    });
    
    it('rejects empty name', () => {
      const result = validatePersonName('   ', []);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('اسم');
    });
    
    it('rejects duplicate name', () => {
      const result = validatePersonName('فهد', ['فهد', 'علي']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('موجود');
    });
    
    it('rejects when max people reached', () => {
      const existing = Array(15).fill('شخص');
      const result = validatePersonName('جديد', existing);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('15');
    });
  });
  
  describe('validateDish', () => {
    it('accepts valid dish', () => {
      const dish = { name: 'بيتزا', price: '50', quantity: '2' };
      const result = validateDish(dish);
      expect(result.valid).toBe(true);
    });
    
    it('rejects empty name', () => {
      const dish = { name: '   ', price: '50', quantity: '1' };
      const result = validateDish(dish);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('اسم');
    });
    
    it('rejects invalid price', () => {
      const dish = { name: 'بيتزا', price: 'صفر', quantity: '1' };
      const result = validateDish(dish);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('سعر');
    });
    
    it('rejects zero price', () => {
      const dish = { name: 'بيتزا', price: '0', quantity: '1' };
      const result = validateDish(dish);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('سعر');
    });
    
    it('rejects invalid quantity', () => {
      const dish = { name: 'بيتزا', price: '50', quantity: '0' };
      const result = validateDish(dish);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('كمية');
    });
  });
});