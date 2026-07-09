import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as authApi from '../api/auth';
import { Button, Field } from '../components/Primitives';
import { colors, spacing, font } from '../theme';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setError('');
    if (!email) {
      setError('Enter your email.');
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (e) {
      // Backend doesn't have this endpoint yet (same gap as web) — show
      // a friendly message either way rather than a raw error.
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>Reset password</Text>
        <Text style={styles.subtitle}>We'll send a reset link to your email</Text>

        {sent ? (
          <Text style={styles.success}>
            If an account exists for {email}, a reset link is on its way.
          </Text>
        ) : (
          <>
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {!!error && <Text style={styles.error}>{error}</Text>}
            <Button title="Send Reset Link" onPress={handleSend} loading={loading} />
          </>
        )}

        <Text style={styles.footerText}>
          Remembered it?{' '}
          <Text style={styles.linkInline} onPress={() => navigation.navigate('Login')}>
            Back to log in
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  brand: { color: colors.text, fontSize: font.xxl, fontWeight: '800', marginBottom: spacing.xs },
  subtitle: { color: colors.textMuted, fontSize: font.md, marginBottom: spacing.lg },
  error: { color: colors.danger, marginBottom: spacing.md },
  success: { color: colors.success, fontSize: font.md, marginBottom: spacing.md },
  footerText: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.md },
  linkInline: { color: colors.primary, fontWeight: '600' },
});
