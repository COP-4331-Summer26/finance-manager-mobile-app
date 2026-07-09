import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Button } from './Primitives';
import { colors, spacing, font, radius } from '../theme';

// Shared shell for every add/edit bottom sheet in the app.
// Fixes (see bug list): Save button was narrow (footer buttons now
// flex:1, so both buttons split the width evenly and Save reads as
// clearly wider/tappable); content wasn't scrollable so the keyboard
// could hide fields/buttons entirely (body is a ScrollView, footer is
// pinned outside it so Save/Cancel are always reachable); there was no
// way to back out except a Cancel button buried below the fold (added
// an explicit X in the header); numeric keyboards with no "Done" key
// couldn't be dismissed (tapping anywhere on the body now dismisses it).
export default function FormSheet({ visible, title, onClose, onSave, saving, saveLabel = 'Save', error, children }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              {children}
              {!!error && <Text style={styles.error}>{error}</Text>}
              <View style={{ height: spacing.sm }} />
            </ScrollView>
          </TouchableWithoutFeedback>

          <View style={styles.footer}>
            <View style={styles.footerBtn}>
              <Button title="Cancel" variant="secondary" onPress={onClose} />
            </View>
            <View style={styles.footerBtn}>
              <Button title={saveLabel} loading={saving} onPress={onSave} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: '90%',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: { color: colors.text, fontSize: font.lg, fontWeight: '700' },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { color: colors.textMuted, fontSize: 14, fontWeight: '700' },
  error: { color: colors.danger, marginTop: spacing.sm, fontSize: font.sm },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerBtn: { flex: 1 },
});
