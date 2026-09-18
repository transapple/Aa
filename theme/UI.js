import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Pressable,
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients, radius, spacing, type, shadow, colorForName } from './theme';

/* ---------------------------------------------------------------------- */
/* Motion primitives                                                      */
/* ---------------------------------------------------------------------- */

// Wrap any pressable content in a gentle scale-down on press — makes every
// tap in the app feel alive instead of a flat color swap.
export function Tappable({ onPress, style, children, scaleTo = 0.96, disabled }) {
  const scale = useRef(new Animated.Value(1)).current;
  const animate = (to) =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 30, bounciness: 6 }).start();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => animate(scaleTo)}
      onPressOut={() => animate(1)}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

// Staggered fade + rise-in for list items / cards appearing on screen.
export function Reveal({ index = 0, delay = 0, children, style }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    const d = delay + Math.min(index, 10) * 45;
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 340, delay: d, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, delay: d, useNativeDriver: true, speed: 16, bounciness: 6 }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

/* ---------------------------------------------------------------------- */
/* Layout / header                                                        */
/* ---------------------------------------------------------------------- */

export function ScreenHeader({ eyebrow, title, subtitle, gradient = gradients.hero, right, children }) {
  return (
    <LinearGradient colors={['#0877EA', '#0B67D6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
      <View style={styles.headerTopRow}>
        <View style={styles.headerBrandMark}>
          <Ionicons name="school" size={23} color="#fff" />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          {eyebrow ? <Text style={styles.headerEyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
      {children}
    </LinearGradient>
  );
}

export function GlassPanel({ style, children }) {
  return <View style={[styles.glass, style]}>{children}</View>;
}

/* ---------------------------------------------------------------------- */
/* Buttons                                                                 */
/* ---------------------------------------------------------------------- */

export function GradientButton({ label, onPress, icon, gradient = gradients.primary, disabled, style }) {
  return (
    <Tappable onPress={disabled ? undefined : onPress} style={[{ borderRadius: radius.md }, style]} disabled={disabled}>
      <LinearGradient
        colors={disabled ? ['#C7CBDA', '#B4B9CC'] : gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBtn}
      >
        {icon ? <Ionicons name={icon} size={17} color="#fff" style={{ marginRight: 8 }} /> : null}
        <Text style={styles.gradientBtnText}>{label}</Text>
      </LinearGradient>
    </Tappable>
  );
}

export function GhostButton({ label, onPress, style, color = colors.inkSoft }) {
  return (
    <Tappable onPress={onPress} style={[styles.ghostBtn, style]}>
      <Text style={[styles.ghostBtnText, { color }]}>{label}</Text>
    </Tappable>
  );
}

export function FAB({ onPress, icon = 'add', gradient = gradients.primary }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Tappable onPress={onPress} scaleTo={0.9} style={styles.fabWrap}>
      <LinearGradient colors={gradient} style={styles.fab} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1 }}>
        <Ionicons name={icon} size={26} color="#fff" />
      </LinearGradient>
    </Tappable>
  );
}

/* ---------------------------------------------------------------------- */
/* Chips / filters                                                        */
/* ---------------------------------------------------------------------- */

export function Chip({ label, active, onPress, activeGradient = gradients.primary }) {
  if (active) {
    return (
      <Tappable onPress={onPress}>
        <LinearGradient colors={activeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.chipActive}>
          <Text style={styles.chipActiveText}>{label}</Text>
        </LinearGradient>
      </Tappable>
    );
  }
  return (
    <Tappable onPress={onPress} style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </Tappable>
  );
}

/* ---------------------------------------------------------------------- */
/* Cards / badges / avatars                                               */
/* ---------------------------------------------------------------------- */

export function Card({ style, children, onPress }) {
  const Wrapper = onPress ? Tappable : View;
  return (
    <Wrapper style={[styles.card, style]} onPress={onPress}>
      {children}
    </Wrapper>
  );
}

export function Avatar({ name = '', size = 46, uri, color }) {
  const bg = color || colorForName(name);
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: `${bg}22`,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: bg, fontWeight: '800', fontSize: size * 0.4 }}>{initial}</Text>
    </View>
  );
}

export function Badge({ label, tone = 'info', style }) {
  const tones = {
    success: { bg: colors.successBg, fg: '#0F7A50' },
    danger: { bg: colors.dangerBg, fg: '#B91C1C' },
    warning: { bg: colors.warningBg, fg: '#92400E' },
    info: { bg: colors.infoBg, fg: '#1D4ED8' },
    neutral: { bg: '#EEF0F7', fg: colors.inkSoft },
  };
  const t = tones[tone] || tones.info;
  return (
    <View style={[{ backgroundColor: t.bg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill }, style]}>
      <Text style={{ color: t.fg, fontSize: 11, fontWeight: '800', textTransform: 'capitalize' }}>{label}</Text>
    </View>
  );
}

export function StatCard({ label, value, icon, gradient = gradients.primary, index = 0 }) {
  return (
    <Reveal index={index} style={styles.statCardWrap}>
      <View style={[styles.statCard, shadow.card]}>
        <LinearGradient colors={gradient} style={styles.statIconWrap} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Ionicons name={icon} size={18} color="#fff" />
        </LinearGradient>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </Reveal>
  );
}

export function SectionTitle({ children, style }) {
  return <Text style={[styles.sectionTitle, style]}>{children}</Text>;
}

export function EmptyState({ icon = 'file-tray-outline', title, subtitle }) {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name={icon} size={30} color={colors.primaryLight} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

/* ---------------------------------------------------------------------- */

const styles = StyleSheet.create({
  header: {
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', minHeight: 62 },
  headerBrandMark: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerEyebrow: { color: 'rgba(255,255,255,0.72)', fontSize: 10.5, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 },
  headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3, color: '#fff' },
  headerSubtitle: { color: 'rgba(255,255,255,0.82)', fontSize: 12.5, marginTop: 3, fontWeight: '500' },
  glass: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },

  gradientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  gradientBtnText: { color: '#fff', fontWeight: '800', fontSize: 14.5 },
  ghostBtn: {
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  ghostBtnText: { fontWeight: '800', fontSize: 14.5 },

  fabWrap: { position: 'absolute', right: 20, bottom: 26 },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.floating,
  },

  chip: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: radius.pill,
    marginRight: 8,
  },
  chipText: { fontSize: 12.5, fontWeight: '700', color: colors.inkSoft },
  chipActiveText: { fontSize: 12.5, fontWeight: '700', color: '#fff' },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E4EDF5',
    ...shadow.soft,
  },

  statCardWrap: { width: '48%', marginBottom: 12 },
  statCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 15 },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: { fontSize: 19, fontWeight: '800', color: colors.ink },
  statLabel: { fontSize: 12, color: colors.inkFaint, marginTop: 3, fontWeight: '600' },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0C3977', marginBottom: 12 },

  emptyWrap: { alignItems: 'center', paddingVertical: 50, paddingHorizontal: 30 },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF0FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  emptySubtitle: { fontSize: 13, color: colors.inkFaint, textAlign: 'center', marginTop: 6, lineHeight: 18 },
});

export { colors, gradients, radius, spacing, type, shadow };
