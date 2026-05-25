import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { tunerStyles } from '@styles/tunerStyles';

export type NoteType = 'G' | 'C' | 'E' | 'A';

interface StringSelectorProps {
  selectedNote: NoteType | null;
  onNoteSelect: (note: NoteType) => void;
}

const NOTES: NoteType[] = ['G', 'C', 'E', 'A'];

export function StringSelector({ selectedNote, onNoteSelect }: StringSelectorProps) {
  return (
    <View style={tunerStyles.stringSelector}>
      {NOTES.map((note) => (
        <TouchableOpacity
          key={note}
          style={[
            tunerStyles.stringButton,
            selectedNote === note && tunerStyles.stringButtonActive,
          ]}
          onPress={() => onNoteSelect(note)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              tunerStyles.stringButtonText,
              selectedNote === note && tunerStyles.stringButtonTextActive,
            ]}
          >
            {note}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
