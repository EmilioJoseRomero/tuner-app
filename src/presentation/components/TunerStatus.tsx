import React from 'react';
import { View, Text } from 'react-native';
import { tunerStyles, COLORS } from '@styles/tunerStyles';

interface TunerStatusProps {
  isInTune: boolean;
  label: string;
}

export function TunerStatus({ isInTune, label }: TunerStatusProps) {
  return (
    <View style={tunerStyles.statusSection}>
      <View
        style={[
          tunerStyles.statusCircle,
          isInTune && tunerStyles.statusCirclePerfect,
        ]}
      >
        <Text style={tunerStyles.statusIcon}>{isInTune ? '✓' : '~'}</Text>
      </View>
      <Text
        style={[
          tunerStyles.statusText,
          isInTune && tunerStyles.statusTextPerfect,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}
