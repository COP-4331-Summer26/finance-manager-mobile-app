import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from '../theme';

// Bug fix: category color used to require typing a hex code by hand.
// This gives a fixed set of good-looking, distinct swatches instead —
// tap one, done.
export const CATEGORY_COLORS = [
  '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#A855F7',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
];

export default function ColorSwatchPicker({ label = 'Color', value, onChange }) {
  return (
    <View style={styles.wrap}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.row}>
        {CATEGORY_COLORS.map((c) => (
          <Pressable
            key={c}
            onPress={() => onChange(c)}
            style={[styles.swatch, { backgroundColor: c }, value === c && styles.swatchSelected]}
            hitSlop={4}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { color: colors.textMuted, fontSize: font.sm, fontWeight: '600', marginBottom: spacing.xs },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  swatchSelected: { borderColor: '#fff' },
});
