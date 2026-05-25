import React, { useEffect, useRef } from 'react';
import { View, Animated, Text } from 'react-native';
import Svg, { Path, G, Line, Text as SvgText } from 'react-native-svg';
import { tunerStyles, GAUGE_SIZE, COLORS } from '@styles/tunerStyles';

interface TunerGaugeProps {
  currentNote: string;
  frequency: number;
  offsetCents: number;
}

export function TunerGauge({
  currentNote,
  frequency,
  offsetCents,
}: TunerGaugeProps) {
  const needleAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const clampedOffset = Math.max(-50, Math.min(50, offsetCents));
    Animated.spring(needleAnimation, {
      toValue: clampedOffset,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [offsetCents, needleAnimation]);

  const needleRotation = needleAnimation.interpolate({
    inputRange: [-50, 0, 50],
    outputRange: ['-45deg', '0deg', '45deg'],
    extrapolate: 'clamp',
  });

  return (
    <View style={tunerStyles.gaugeContainer}>
      <Svg
        width={GAUGE_SIZE}
        height={GAUGE_SIZE / 2}
        viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE / 2}`}
        style={tunerStyles.gaugeSvg}
      >
        <Path
          d={`M ${GAUGE_SIZE * 0.1} ${GAUGE_SIZE / 2} A ${GAUGE_SIZE * 0.4} ${GAUGE_SIZE * 0.4} 0 0 1 ${GAUGE_SIZE * 0.9} ${GAUGE_SIZE / 2}`}
          stroke={COLORS.darkGray}
          strokeWidth="2"
          fill="none"
          strokeDasharray="3 6"
        />

        <G>
          <Line
            x1={GAUGE_SIZE * 0.15}
            y1={GAUGE_SIZE / 2}
            x2={GAUGE_SIZE * 0.15}
            y2={GAUGE_SIZE / 2 - 10}
            stroke={COLORS.gray}
            strokeWidth="1.5"
          />
          <Line
            x1={GAUGE_SIZE * 0.28}
            y1={GAUGE_SIZE / 2}
            x2={GAUGE_SIZE * 0.28}
            y2={GAUGE_SIZE / 2 - 6}
            stroke={COLORS.gray}
            strokeWidth="1"
          />
          <Line
            x1={GAUGE_SIZE / 2}
            y1={GAUGE_SIZE / 2 - 2}
            x2={GAUGE_SIZE / 2}
            y2={GAUGE_SIZE / 2 - 14}
            stroke={COLORS.accent}
            strokeWidth="2.5"
          />
          <Line
            x1={GAUGE_SIZE * 0.72}
            y1={GAUGE_SIZE / 2}
            x2={GAUGE_SIZE * 0.72}
            y2={GAUGE_SIZE / 2 - 6}
            stroke={COLORS.gray}
            strokeWidth="1"
          />
          <Line
            x1={GAUGE_SIZE * 0.85}
            y1={GAUGE_SIZE / 2}
            x2={GAUGE_SIZE * 0.85}
            y2={GAUGE_SIZE / 2 - 10}
            stroke={COLORS.gray}
            strokeWidth="1.5"
          />
        </G>

        <SvgText
          x={GAUGE_SIZE * 0.12}
          y={GAUGE_SIZE / 2 - 18}
          fill={COLORS.gray}
          fontSize="10"
          textAnchor="middle"
        >
          -50
        </SvgText>
        <SvgText
          x={GAUGE_SIZE / 2}
          y={GAUGE_SIZE / 2 - 22}
          fill={COLORS.accent}
          fontSize="11"
          fontWeight="bold"
          textAnchor="middle"
        >
          0
        </SvgText>
        <SvgText
          x={GAUGE_SIZE * 0.88}
          y={GAUGE_SIZE / 2 - 18}
          fill={COLORS.gray}
          fontSize="10"
          textAnchor="middle"
        >
          +50
        </SvgText>
      </Svg>

      <View style={tunerStyles.needleContainer}>
        <Animated.View
          style={[
            tunerStyles.needle,
            { transform: [{ rotate: needleRotation }] },
          ]}
        />
        <View style={tunerStyles.needlePivot} />
      </View>

      <View style={tunerStyles.pitchCard}>
        <Text style={tunerStyles.noteDisplay}>{currentNote}</Text>
        <View style={tunerStyles.pitchDetails}>
          <Text style={tunerStyles.frequencyText}>
            {frequency.toFixed(1)} Hz
          </Text>
          <Text style={tunerStyles.centsText}>
            {offsetCents >= 0 ? '+' : ''}{offsetCents.toFixed(1)} CENTS
          </Text>
        </View>
      </View>
    </View>
  );
}
