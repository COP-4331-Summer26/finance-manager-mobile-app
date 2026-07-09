import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { addIncome } from '../api/misc';
import { Button, Field } from '../components/Primitives';
import { colors, spacing, font } from '../theme';

export default function AddIncomeScreen({ navigation }) {
  const [form, setForm] = useState({
    merchant: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    category: 'Salary',
    cardLastFour: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setError('');
    // Bug fix: this used to save silently with no validation, so a
    // missing name/amount would either fail with no feedback or save
    // garbage. Now it checks first and shows exactly what's missing.
    if (!form.merchant.trim()) {
      setError('Enter a source (e.g. Paycheck).');
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Enter an amount greater than 0.');
      return;
    }
    if (!form.date) {
      setError('Date is required.');
      return;
    }
    setSaving(true);
    try {
      await addIncome({ ...form, amount: Number(form.amount) });
      navigation.goBack();
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to add income. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Add income</Text>

        <Field label="Source" placeholder="Paycheck" value={form.merchant} onChangeText={update('merchant')} />
        <Field label="Amount" keyboardType="decimal-pad" value={form.amount} onChangeText={update('amount')} />
        <Field label="Date (YYYY-MM-DD)" value={form.date} onChangeText={update('date')} />
        <Field label="Category" value={form.category} onChangeText={update('category')} />
        <Field label="Card last 4 (optional)" maxLength={4} value={form.cardLastFour} onChangeText={update('cardLastFour')} />
        <Field label="Notes (optional)" value={form.notes} onChangeText={update('notes')} />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <Button title={saving ? 'Saving…' : 'Add income'} loading={saving} onPress={handleSave} />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.lg },
  title: { color: colors.text, fontSize: font.xl, fontWeight: '800', marginBottom: spacing.md },
  error: { color: colors.danger, fontSize: font.sm, marginBottom: spacing.md },
});
