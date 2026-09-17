// ScreenContainer — layout konsisten untuk semua layar
import React from 'react';
import { StyleSheet, View, ScrollView, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../lib/theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
};

export function ScreenContainer({ children, scroll = true, style, contentContainerStyle }: Props) {
  const insets = useSafeAreaInsets();

  const baseStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: insets.top + spacing.sm,
    paddingBottom: insets.bottom + 80, // ruang untuk tab bar
  };

  if (scroll) {
    return (
      <ScrollView
        style={[baseStyle, style]}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }
  return <View style={[baseStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
});
