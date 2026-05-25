import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const GAUGE_SIZE = Math.min(SCREEN_WIDTH - 64, 320);

export const COLORS = {
  background: '#050505',
  surface: '#0b0b0f',
  border: 'rgba(255, 255, 255, 0.08)',
  borderDark: 'rgba(61, 74, 61, 0.5)',
  text: '#e5e2e1',
  textMuted: 'rgba(229, 226, 225, 0.4)',
  accent: '#4ae176',
  accentLight: 'rgba(74, 225, 118, 0.2)',
  accentLighter: 'rgba(74, 225, 118, 0.15)',
  accentGlow: 'rgba(74, 225, 118, 0.3)',
  error: '#F44336',
  gray: '#666',
  darkGray: '#353534',
  stringBorder: '#3d4a3d',
};

export const tunerStyles = StyleSheet.create({
  // Container & Layout
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(5, 5, 5, 0.8)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: COLORS.accent,
    letterSpacing: -0.5,
  },
  mainContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },

  // Status Section
  statusSection: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  statusCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.accentGlow,
  },
  statusCirclePerfect: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  statusIcon: {
    fontSize: 32,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 32,
    fontWeight: '500',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  statusTextPerfect: {
    color: COLORS.accent,
    textShadowColor: 'rgba(74, 225, 118, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },

  // Gauge
  gaugeContainer: {
    width: GAUGE_SIZE,
    height: GAUGE_SIZE * 0.7,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    marginBottom: 32,
  },
  gaugeSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  needleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: GAUGE_SIZE * 0.25,
  },
  needle: {
    width: 3,
    height: GAUGE_SIZE * 0.35,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  needlePivot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
    marginTop: -6,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  pitchCard: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${COLORS.surface}e6`,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: GAUGE_SIZE * 0.3,
    width: GAUGE_SIZE * 0.55,
    height: GAUGE_SIZE * 0.55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  noteDisplay: {
    fontSize: 48,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: -2,
  },
  pitchDetails: {
    alignItems: 'center',
    opacity: 0.7,
    marginTop: 8,
  },
  frequencyText: {
    fontSize: 12,
    color: COLORS.text,
    letterSpacing: 1,
    fontWeight: '400',
  },
  centsText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accent,
    letterSpacing: 1,
    marginTop: 4,
  },

  // String Selector
  stringSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: GAUGE_SIZE,
    gap: 12,
    marginBottom: 32,
  },
  stringButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.stringBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  stringButtonActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentLighter,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
    transform: [{ scale: 1.1 }],
  },
  stringButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: -0.5,
  },
  stringButtonTextActive: {
    color: COLORS.accent,
    opacity: 1,
  },

  // Indicators
  indicatorsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(11, 11, 15, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: GAUGE_SIZE,
  },
  indicatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicatorInfo: {
    alignItems: 'center',
  },
  indicatorLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  indicatorValue: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
    letterSpacing: 1,
  },
  indicatorDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.borderDark,
  },

  // Error state
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.accent,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '600',
  },
});
