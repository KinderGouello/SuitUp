import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { theme, colors, radii, spacing, elevation } from '@/lib/styles/tokens';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SelectModalProps<T = string> {
  /**
   * Controls modal visibility
   */
  visible: boolean;

  /**
   * Callback when modal should close
   */
  onClose: () => void;

  /**
   * Array of selectable options
   */
  options: SelectOption<T>[];

  /**
   * Currently selected value
   */
  selectedValue: T;

  /**
   * Callback when an option is selected
   * Modal automatically closes after selection
   */
  onSelect: (value: T) => void;

  /**
   * Custom modal card style
   */
  cardStyle?: StyleProp<ViewStyle>;

  /**
   * Custom option text style
   */
  optionTextStyle?: StyleProp<TextStyle>;

  /**
   * Custom active option text style
   */
  activeOptionTextStyle?: StyleProp<TextStyle>;

  /**
   * Animation type for modal presentation
   * @default 'fade'
   */
  animationType?: 'none' | 'slide' | 'fade';
}

/**
 * SelectModal - Reusable modal selector component
 *
 * A bottom-sheet style modal for selecting from a list of options.
 * Features an overlay backdrop, animated presentation, and accessibility support.
 *
 * @example
 * // Category filter
 * <SelectModal
 *   visible={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   options={categoryOptions}
 *   selectedValue={selectedCategory}
 *   onSelect={setSelectedCategory}
 * />
 *
 * @example
 * // With icons
 * <SelectModal
 *   visible={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   options={[
 *     { value: 'casual', label: 'Casual', icon: <ShirtIcon /> },
 *     { value: 'formal', label: 'Formal', icon: <TieIcon /> },
 *   ]}
 *   selectedValue={style}
 *   onSelect={setStyle}
 * />
 */
export function SelectModal<T = string>({
  visible,
  onClose,
  options,
  selectedValue,
  onSelect,
  cardStyle,
  optionTextStyle,
  activeOptionTextStyle,
  animationType = 'fade',
}: SelectModalProps<T>) {
  const handleSelect = (value: T) => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Backdrop - dismisses modal on press */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Dismiss modal"
          accessibilityRole="button"
        />

        {/* Modal Card */}
        <View style={[styles.card, cardStyle]}>
          {/* Options List */}
          <View style={styles.optionsList}>
            {options.map((option) => {
              const isActive = option.value === selectedValue;

              return (
                <Pressable
                  key={String(option.value)}
                  onPress={() => handleSelect(option.value)}
                  style={[styles.option, isActive && styles.optionActive]}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={option.label}
                >
                  {/* Option Icon (if provided) */}
                  {option.icon && (
                    <View style={styles.optionIcon}>{option.icon}</View>
                  )}

                  {/* Option Label */}
                  <Text
                    style={[
                      styles.optionText,
                      isActive && styles.optionTextActive,
                      optionTextStyle,
                      isActive && activeOptionTextStyle,
                    ]}
                  >
                    {option.label}
                  </Text>

                  {/* Checkmark for selected option */}
                  {isActive && (
                    <View style={styles.checkIcon}>
                      <Check
                        size={16}
                        color={colors.indigo600}
                        strokeWidth={2.5}
                        accessibilityLabel="Selected"
                      />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 11, 28, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: theme.surface,
    borderRadius: radii.xl,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.indigo100,
    ...elevation.lg,
  },
  optionsList: {},
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  optionLast: {
    marginBottom: 0,
  },
  optionActive: {
    backgroundColor: '#f0f4ff',
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  optionText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    color: theme.text_primary,
  },
  optionTextActive: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: theme.text_primary,
  },
  checkIcon: {
    marginLeft: spacing.sm,
  },
});
