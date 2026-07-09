import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Field } from './Primitives';
import FormSheet from './FormSheet';
import { colors, spacing, font, radius } from '../theme';

// Shared add/edit form for transactions. `initial` is null for "add",
// or a transaction object for "edit".
//
// Bug fixes here: categories are now shown as tappable chips instead of
// a native <Picker> (the Picker was rendering empty/blank on some
// devices when the categories array hadn't loaded yet by first paint);
// the whole form now lives inside FormSheet, so Save/Cancel/X are
// always reachable regardless of scroll position or keyboard state;
// and missing-field validation now shows an inline error instead of
// silently doing nothing when you tap Save.
export default function TransactionFormModal({ visible, initial, categories, onSave, onCancel }) {
  const [form, setForm] = useState(() => buildInitial(initial, categories));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [openKey, setOpenKey] = useState(initial?.id || 'new');

  // Reset the form whenever a different transaction (or a fresh "new") opens
  const key = initial?.id || 'new';
  if (visible && key !== openKey) {
    setOpenKey(key);
    setForm(buildInitial(initial, categories));
    setError('');
  }

  const update = (field) => (value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setError('');
    if (!form.merchant.trim()) {
      setError('Merchant is required.');
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Enter an amount greater than 0.');
      return;
    }
    if (!form.category) {
      setError('Choose a category.');
      return;
    }
    if (!form.date) {
      setError('Date is required.');
      return;
    }
    setSaving(true);
    try {
      await onSave({ ...form, amount: Number(form.amount) });
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to save transaction. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormSheet
      visible={visible}
      title={initial ? 'Edit transaction' : 'Add transaction'}
      onClose={onCancel}
      onSave={handleSubmit}
      saving={saving}
      error={error}
    >
      <Field label="Merchant" value={form.merchant} onChangeText={update('merchant')} placeholder="e.g. Whole Foods" />
      <Field
        label="Amount"
        keyboardType="decimal-pad"
        value={form.amount}
        onChangeText={update('amount')}
        placeholder="0.00"
      />

      <Text style={styles.label}>Type</Text>
      <View style={styles.pillRow}>
        {['expense', 'income'].map((t) => (
          <Pressable
            key={t}
            style={[styles.pill, form.type === t && styles.pillActive]}
            onPress={() => update('type')(t)}
          >
            <Text style={[styles.pillText, form.type === t && styles.pillTextActive]}>
              {t === 'expense' ? 'Expense' : 'Income'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Category</Text>
      {categories.length === 0 ? (
        <Text style={styles.hint}>No categories yet — add one on the Categories tab first.</Text>
      ) : (
        <View style={styles.pillRow}>
          {categories.map((c) => (
            <Pressable
              key={c.id || c.name}
              style={[styles.pill, form.category === c.name && styles.pillActive]}
              onPress={() => update('category')(c.name)}
            >
              <Text style={[styles.pillText, form.category === c.name && styles.pillTextActive]}>{c.name}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <Field label="Date (YYYY-MM-DD)" value={form.date} onChangeText={update('date')} />
      <Field
        label="Card last 4 (optional)"
        maxLength={4}
        keyboardType="number-pad"
        value={form.cardLastFour}
        onChangeText={update('cardLastFour')}
      />
      <Field label="Notes (optional)" value={form.notes} onChangeText={update('notes')} />
    </FormSheet>
  );
}

function buildInitial(initial, categories) {
  return {
    merchant: initial?.merchant || '',
    amount: initial?.amount != null ? String(initial.amount) : '',
    category: initial?.category || categories[0]?.name || '',
    type: initial?.type || 'expense',
    date: initial?.date ? String(initial.date).slice(0, 10) : new Date().toISOString().slice(0, 10),
    notes: initial?.notes || '',
    cardLastFour: initial?.cardLastFour || '',
  };
}

const styles = StyleSheet.create({
  label: { color: colors.textMuted, fontSize: font.sm, fontWeight: '600', marginBottom: spacing.xs },
  hint: { color: colors.textMuted, fontSize: font.sm, marginBottom: spacing.md },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { color: colors.textMuted, fontSize: font.sm, fontWeight: '600' },
  pillTextActive: { color: '#fff' },
});
