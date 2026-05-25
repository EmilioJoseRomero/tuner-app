import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { tunerStyles, COLORS } from '@styles/tunerStyles';

interface PermissionDeniedScreenProps {
  onRequestPermission: () => void;
}

export function PermissionDeniedScreen({
  onRequestPermission,
}: PermissionDeniedScreenProps) {
  return (
    <View style={tunerStyles.errorContainer}>
      <Text style={tunerStyles.errorText}>
        Microphone permission is required to use the tuner.
      </Text>
      <TouchableOpacity
        style={tunerStyles.permissionButton}
        onPress={onRequestPermission}
      >
        <Text style={tunerStyles.permissionButtonText}>
          Request Permission
        </Text>
      </TouchableOpacity>
    </View>
  );
}
