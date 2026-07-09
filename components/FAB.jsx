import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, font } from '../theme';

// Bug fix: the old "+" add button was a small 34x34 square tucked into
// the top-right of the header, easy to miss. A floating action button
// pinned to the bottom-right is a much more standard, obvious place to
// look for "add new" on mobile.
export default function FAB({ onPress, label = '+' }) {
  return (
    <Pressable style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]} onPress={onPress}>
      <Text style={styles.fabText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabPressed: { opacity: 0.85 },
  fabText: { color: '#fff', fontSize: font.xxl ? 28 : 28, fontWeight: '700', lineHeight: 30 },
});
