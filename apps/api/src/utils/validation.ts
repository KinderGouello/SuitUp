/**
 * Validation utilities for the SuitUp API
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates an email address format
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email || email.trim() === '') {
    errors.push('Email is required');
    return { isValid: false, errors };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a wardrobe item category
 */
export function validateItemCategory(category: string): ValidationResult {
  const validCategories = [
    'top',
    'bottom',
    'dress',
    'outerwear',
    'shoes',
    'accessory',
    'athleisure',
  ];

  const errors: string[] = [];

  if (!category || category.trim() === '') {
    errors.push('Category is required');
    return { isValid: false, errors };
  }

  if (!validCategories.includes(category.toLowerCase())) {
    errors.push(
      `Invalid category. Must be one of: ${validCategories.join(', ')}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a warmth level (0-5 scale)
 */
export function validateWarmthLevel(warmth: number): ValidationResult {
  const errors: string[] = [];

  if (warmth === undefined || warmth === null) {
    errors.push('Warmth level is required');
    return { isValid: false, errors };
  }

  if (!Number.isInteger(warmth)) {
    errors.push('Warmth level must be an integer');
  }

  if (warmth < 0 || warmth > 5) {
    errors.push('Warmth level must be between 0 and 5');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a hex color code
 */
export function validateHexColor(color: string): ValidationResult {
  const errors: string[] = [];

  if (!color || color.trim() === '') {
    errors.push('Color is required');
    return { isValid: false, errors };
  }

  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexRegex.test(color)) {
    errors.push('Invalid hex color format (use #RRGGBB or #RGB)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates multiple validations and combines results
 */
export function combineValidations(
  ...results: ValidationResult[]
): ValidationResult {
  const allErrors = results.flatMap((r) => r.errors);
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}
