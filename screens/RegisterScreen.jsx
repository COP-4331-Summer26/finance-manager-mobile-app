import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button, Field } from '../components/Primitives';
import { colors, spacing, font } from '../theme';

const RULES = [
  { key: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { key: 'lower', label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { key: 'number', label: 'One number', test: (p) => /[0-9]/.test(p) },
  { key: 'special', label: 'One special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const results = useMemo(() => RULES.map((r) => ({ ...r, pass: r.test(password) })), [password]);
  const allPass = results.every((r) => r.pass);

  const handleRegister = async () => {
    setError('');
    if (!name || !email || !password) {
      setError('Fill in all fields.');
      return;
    }
    if (!allPass) {
      setError('Password does not meet all requirements yet.');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>Create account</Text>
        <Text style={styles.subtitle}>Start tracking your finances</Text>

        <Field label="Name" value={name} onChangeText={setName} placeholder="Your name" />
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

        <View style={styles.checklist}>
          {results.map((r) => (
            <Text key={r.key} style={[styles.checkItem, r.pass && styles.checkItemPass]}>
              {r.pass ? '✓' : '○'}  {r.label}
            </Text>
          ))}
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <Button title="Create Account" onPress={handleRegister} loading={loading} />

        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text style={styles.linkInline} onPress={() => navigation.navigate('Login')}>
            Log in
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
  checklist: { marginBottom: spacing.md, gap: 4 },
  checkItem: { color: colors.textMuted, fontSize: font.sm },
  checkItemPass: { color: colors.success },
  error: { color: colors.danger, marginBottom: spacing.md },
  footerText: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.md },
  linkInline: { color: colors.primary, fontWeight: '600' },
});
