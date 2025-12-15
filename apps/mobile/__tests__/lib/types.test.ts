import { describe, it, expect } from 'vitest';
import type { Category, Warmth } from '@/lib/types';

describe('Types', () => {
  it('should validate Category type', () => {
    const validCategories: Category[] = [
      'top',
      'bottom',
      'dress',
      'outerwear',
      'shoes',
      'accessory',
      'athleisure',
    ];

    expect(validCategories).toHaveLength(7);
    expect(validCategories).toContain('top');
    expect(validCategories).toContain('bottom');
  });

  it('should validate Warmth type values', () => {
    const validWarmthLevels: Warmth[] = [0, 1, 2, 3, 4, 5];

    expect(validWarmthLevels).toHaveLength(6);
    expect(validWarmthLevels[0]).toBe(0);
    expect(validWarmthLevels[5]).toBe(5);
  });
});
