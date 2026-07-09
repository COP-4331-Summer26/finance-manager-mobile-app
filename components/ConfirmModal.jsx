import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing, font } from '../theme';

export default function ConfirmModal({ visible, title, message, onConfirm, onCancel }) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {!!message && <Text style={styles.message}>{message}</Text>}
          <View style={styles.row}>
            <Pressable style={[styles.btn, styles.cancelBtn]} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.confirmBtn]} onPress={onConfirm}>
              <Text style={styles.confirmText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { color: colors.text, fontSize: font.lg, fontWeight: '700', marginBottom: spacing.xs },
  message: { color: colors.textMuted, fontSize: font.md, marginBottom: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm },
  btn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.md },
  cancelBtn: { backgroundColor: colors.surfaceAlt },
  cancelText: { color: colors.text, fontWeight: '600' },
  confirmBtn: { backgroundColor: colors.danger },
  confirmText: { color: '#fff', fontWeight: '600' },
});
