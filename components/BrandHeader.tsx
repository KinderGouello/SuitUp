import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { Sparkles } from 'lucide-react-native';
import { spacing, typography, colors } from '@/lib/styles/tokens';

interface BrandHeaderProps {
  showTagline?: boolean;
}

export function BrandHeader({ showTagline = false }: BrandHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          {/* Sparkles icon with glow effect */}
          <View style={styles.iconContainer}>
            {/* <View style={styles.iconGlow}>
              <LinearGradient
                colors={[colors.indigo600, colors.sky500]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glowGradient}
              />
            </View> */}
            <Sparkles
              size={32}
              color={colors.indigo600}
              fill={colors.indigo600}
              style={styles.icon}
            />
          </View>

          {/* Gradient Text - "Suit Up!" */}
          <MaskedView
            maskElement={<Text style={styles.titleText}>Suit Up!</Text>}
          >
            <LinearGradient
              colors={[colors.indigo600, colors.sky500]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.titleText, styles.transparentText]}>
                Suit Up!
              </Text>
            </LinearGradient>
          </MaskedView>
        </View>

        {/* Tagline */}
        {showTagline && (
          <Text style={styles.tagline}>Your style, perfected daily ✨</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundGradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundGradient: {
    flex: 1,
    opacity: 0.1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  iconContainer: {
    position: 'relative',
    width: 32,
    height: 32,
  },
  iconGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    opacity: 0.5,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 20,
  },
  icon: {
    position: 'relative',
    zIndex: 1,
  },
  titleText: {
    ...typography.display,
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
  },
  transparentText: {
    opacity: 0,
  },
  tagline: {
    ...typography.bodySmall,
    color: colors.gray600,
    textAlign: 'center',
  },
});
