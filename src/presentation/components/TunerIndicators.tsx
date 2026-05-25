import React from 'react';
import { View, Text } from 'react-native';
import { tunerStyles, COLORS } from '@styles/tunerStyles';
import { StabilityState } from '@domain/value-objects/DeviceStability';

interface TunerIndicatorsProps {
  stabilityState?: StabilityState;
  stabilityScore?: number;
  micError?: boolean;
}

export function TunerIndicators({
  stabilityState,
  stabilityScore = 0,
  micError,
}: TunerIndicatorsProps) {
  const getStabilityLabel = (): string => {
    if (micError) return 'ERROR';
    if (!stabilityState) return 'INIT...';
    if (stabilityState === StabilityState.UNSTABLE) return 'UNSTABLE';
    return 'STABLE';
  };

  const getStabilityColor = (): string => {
    if (micError) return COLORS.error;
    if (!stabilityState) return COLORS.gray;
    if (stabilityState === StabilityState.UNSTABLE) return COLORS.error;
    return COLORS.accent;
  };

  const getNoiseLevel = (): string => {
    if (micError) return '--';
    if (stabilityScore > 0.8) return 'LOW';
    if (stabilityScore > 0.4) return 'MED';
    return 'HIGH';
  };

  return (
    <View style={tunerStyles.indicatorsCard}>
      <View style={tunerStyles.indicatorItem}>
        <View style={tunerStyles.indicatorInfo}>
          <Text style={tunerStyles.indicatorLabel}>STABILITY</Text>
          <Text style={[tunerStyles.indicatorValue, { color: getStabilityColor() }]}>
            {getStabilityLabel()}
          </Text>
        </View>
      </View>
      <View style={tunerStyles.indicatorDivider} />
      <View style={tunerStyles.indicatorItem}>
        <View style={tunerStyles.indicatorInfo}>
          <Text style={tunerStyles.indicatorLabel}>NOISE</Text>
          <Text style={tunerStyles.indicatorValue}>{getNoiseLevel()}</Text>
        </View>
      </View>
    </View>
  );
}
