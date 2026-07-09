import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button, Field } from '../components/Primitives';
import { colors, spacing, font } from '../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      // Navigation to the tabs happens automatically once `user` is set
      // (see RootNavigator), no explicit navigate() call needed here.
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to log in. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>BudgetFlow</Text>
        <Text style={styles.subtitle}>Log in to your account</Text>

        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <Button title="Log In" onPress={handleLogin} loading={loading} />

        <Text style={styles.link} onPress={() => navigation.navigate('ForgotPassword')}>
          Forgot password?
        </Text>
        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text style={styles.linkInline} onPress={() => navigation.navigate('Register')}>
            Register
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
  link: { color: colors.primary, textAlign: 'center', marginTop: spacing.lg, fontWeight: '600' },
  footerText: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.md },
  linkInline: { color: colors.primary, fontWeight: '600' },
});
