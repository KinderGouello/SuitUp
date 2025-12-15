import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validateItemCategory,
  validateWarmthLevel,
  validateHexColor,
  combineValidations,
} from '../../../src/utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'first+last@domain.org',
        'email@subdomain.example.com',
      ];

      validEmails.forEach((email) => {
        const result = validateEmail(email);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject invalid email addresses', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email is required');
    });

    it('should reject whitespace-only email', () => {
      const result = validateEmail('   ');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email is required');
    });

    it('should reject email without @', () => {
      const result = validateEmail('invalidemail.com');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });

    it('should reject email without domain', () => {
      const result = validateEmail('user@');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });
  });

  describe('validateItemCategory', () => {
    it('should accept valid categories', () => {
      const validCategories = [
        'top',
        'bottom',
        'dress',
        'outerwear',
        'shoes',
        'accessory',
        'athleisure',
      ];

      validCategories.forEach((category) => {
        const result = validateItemCategory(category);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should accept categories case-insensitively', () => {
      const result = validateItemCategory('TOP');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid category', () => {
      const result = validateItemCategory('invalid');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Invalid category');
    });

    it('should reject empty category', () => {
      const result = validateItemCategory('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Category is required');
    });
  });

  describe('validateWarmthLevel', () => {
    it('should accept valid warmth levels (0-5)', () => {
      const validLevels = [0, 1, 2, 3, 4, 5];

      validLevels.forEach((level) => {
        const result = validateWarmthLevel(level);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject warmth level below 0', () => {
      const result = validateWarmthLevel(-1);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Warmth level must be between 0 and 5');
    });

    it('should reject warmth level above 5', () => {
      const result = validateWarmthLevel(6);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Warmth level must be between 0 and 5');
    });

    it('should reject non-integer warmth level', () => {
      const result = validateWarmthLevel(2.5);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Warmth level must be an integer');
    });

    it('should reject undefined warmth level', () => {
      const result = validateWarmthLevel(undefined as any);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Warmth level is required');
    });
  });

  describe('validateHexColor', () => {
    it('should accept valid 6-digit hex colors', () => {
      const validColors = ['#FFFFFF', '#000000', '#FF5733', '#1a2b3c'];

      validColors.forEach((color) => {
        const result = validateHexColor(color);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should accept valid 3-digit hex colors', () => {
      const validColors = ['#FFF', '#000', '#F57', '#abc'];

      validColors.forEach((color) => {
        const result = validateHexColor(color);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject hex color without #', () => {
      const result = validateHexColor('FFFFFF');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Invalid hex color format (use #RRGGBB or #RGB)'
      );
    });

    it('should reject invalid hex characters', () => {
      const result = validateHexColor('#GGGGGG');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Invalid hex color format (use #RRGGBB or #RGB)'
      );
    });

    it('should reject invalid hex length', () => {
      const result = validateHexColor('#FF');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Invalid hex color format (use #RRGGBB or #RGB)'
      );
    });

    it('should reject empty color', () => {
      const result = validateHexColor('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Color is required');
    });
  });

  describe('combineValidations', () => {
    it('should combine multiple valid validations', () => {
      const result = combineValidations(
        { isValid: true, errors: [] },
        { isValid: true, errors: [] },
        { isValid: true, errors: [] }
      );

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should combine multiple invalid validations', () => {
      const result = combineValidations(
        { isValid: false, errors: ['Error 1'] },
        { isValid: false, errors: ['Error 2'] },
        { isValid: true, errors: [] }
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toContain('Error 1');
      expect(result.errors).toContain('Error 2');
    });

    it('should return valid for empty validations', () => {
      const result = combineValidations();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
