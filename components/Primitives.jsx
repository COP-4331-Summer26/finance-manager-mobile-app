import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, radius, spacing, font } from '../theme';

export function Button({ title, onPress, variant = 'primary', loading, disabled }) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        isPrimary ? styles.btnPrimary : styles.btnSecondary,
        (disabled || loading) && styles.btnDisabled,
        pressed && !disabled && styles.btnPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : colors.text} />
      ) : (
        <Text style={isPrimary ? styles.btnTextPrimary : styles.btnTextSecondary}>{title}</Text>
      )}
    </Pressable>
  );
}

export function Field({ label, error, ...inputProps }) {
  return (
    <View style={styles.fieldWrap}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholderTextColor={colors.textMuted}
        returnKeyType="done"
        style={[styles.input, error && styles.inputError]}
        {...inputProps}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnSecondary: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  btnDisabled: { opacity: 0.5 },
  btnPressed: { opacity: 0.85 },
  btnTextPrimary: { color: '#fff', fontWeight: '700', fontSize: font.md },
  btnTextSecondary: { color: colors.text, fontWeight: '600', fontSize: font.md },

  fieldWrap: { marginBottom: spacing.md },
  label: { color: colors.textMuted, fontSize: font.sm, marginBottom: spacing.xs, fontWeight: '600' },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: colors.text,
    fontSize: font.md,
  },
  inputError: { borderColor: colors.danger },
  errorText: { color: colors.danger, fontSize: font.sm, marginTop: spacing.xs },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
});
