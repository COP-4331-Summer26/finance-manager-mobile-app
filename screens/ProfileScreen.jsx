import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useConfirm } from '../context/ConfirmContext';
import * as authApi from '../api/auth';
import { Card, Button, Field } from '../components/Primitives';
import FormSheet from '../components/FormSheet';
import { colors, spacing, font } from '../theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const confirm = useConfirm();
  const [me, setMe] = useState(user);

  const [changingPw, setChangingPw] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    authApi.getMe().then(setMe).catch(() => {});
  }, []);

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Log out?',
      message: 'You\u2019ll need to log in again to access your account.',
    });
    if (ok) await logout();
  };

  const openChangePassword = () => {
    setPwForm({ current: '', next: '', confirm: '' });
    setPwError('');
    setPwSuccess(false);
    setChangingPw(true);
  };

  const handleChangePassword = async () => {
    setPwError('');
    if (!pwForm.current) {
      setPwError('Enter your current password.');
      return;
    }
    if (pwForm.next.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError('New password and confirmation don\u2019t match.');
      return;
    }
    setPwSaving(true);
    try {
      await authApi.changePassword(pwForm.current, pwForm.next);
      setPwSuccess(true);
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (e) {
      setPwError(e.response?.data?.message || 'Unable to change password. Check your current password and try again.');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <Card style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{me?.name ?? '—'}</Text>

        <Text style={[styles.label, styles.gapTop]}>Email</Text>
        <Text style={styles.value}>{me?.email ?? '—'}</Text>
      </Card>

      <View style={styles.gapTop}>
        <Button title="Change Password" variant="secondary" onPress={openChangePassword} />
      </View>

      <View style={styles.gapTop}>
        <Button title="Log Out" variant="secondary" onPress={handleLogout} />
      </View>

      <FormSheet
        visible={changingPw}
        title="Change password"
        onClose={() => setChangingPw(false)}
        onSave={handleChangePassword}
        saving={pwSaving}
        saveLabel="Update"
        error={pwError}
      >
        {pwSuccess ? (
          <Text style={styles.success}>Password updated successfully.</Text>
        ) : (
          <>
            <Field
              label="Current password"
              secureTextEntry
              value={pwForm.current}
              onChangeText={(v) => setPwForm((f) => ({ ...f, current: v }))}
            />
            <Field
              label="New password"
              secureTextEntry
              value={pwForm.next}
              onChangeText={(v) => setPwForm((f) => ({ ...f, next: v }))}
            />
            <Field
              label="Confirm new password"
              secureTextEntry
              value={pwForm.confirm}
              onChangeText={(v) => setPwForm((f) => ({ ...f, confirm: v }))}
            />
          </>
        )}
      </FormSheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.lg },
  title: { color: colors.text, fontSize: font.xl, fontWeight: '800', marginBottom: spacing.md },
  card: { marginBottom: spacing.md },
  label: { color: colors.textMuted, fontSize: font.sm, fontWeight: '600' },
  value: { color: colors.text, fontSize: font.md, marginTop: 2 },
  gapTop: { marginTop: spacing.md },
  success: { color: colors.success, fontSize: font.md, marginBottom: spacing.sm },
});
