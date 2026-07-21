import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCards, addCard, deleteCard } from '../api/misc';
import { useConfirm } from '../context/ConfirmContext';
import { Field, Card } from '../components/Primitives';
import FormSheet from '../components/FormSheet';
import FAB from '../components/FAB';
import { colors, spacing, radius, font } from '../theme';

export default function CardsScreen() {
  const confirm = useConfirm();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', last4: '', limit: '', statementDate: '' });

  const load = useCallback(() => {
    setLoading(true);
    return getCards().then(setCards).finally(() => setLoading(false));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const startNew = () => {
    setError('');
    setForm({ name: '', last4: '', limit: '', statementDate: '' });
    setAdding(true);
  };

  const handleSave = async () => {
    setError('');
    if (!form.name.trim()) {
      setError('Card name is required.');
      return;
    }
    if (!/^\d{4}$/.test(form.last4)) {
      setError('Last 4 digits must be exactly 4 numbers.');
      return;
    }
    if (!form.limit || Number(form.limit) <= 0) {
      setError('Enter a limit greater than 0.');
      return;
    }
    const day = Number(form.statementDate);
    if (!day || day < 1 || day > 31) {
      setError('Statement date must be a day of the month (1–31).');
      return;
    }
    setSaving(true);
    try {
      await addCard({
        name: form.name.trim(),
        last4: form.last4,
        limit: Number(form.limit),
        statementDate: day,
      });
      setAdding(false);
      setForm({ name: '', last4: '', limit: '', statementDate: '' });
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to save card. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (card) => {
    const ok = await confirm({
      title: 'Delete card?',
      message: `Remove "${card.name}" ending in ${card.last4}?`,
    });
    if (!ok) return;
    await deleteCard(card.id);
    load();
  };

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Text style={styles.title}>Cards</Text>
      </View>

      <FlatList
        data={cards}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={!loading && (
          <Card><Text style={styles.empty}>No cards linked yet. Tap + to add one.</Text></Card>
        )}
        renderItem={({ item: c }) => (
          <Pressable onLongPress={() => handleDelete(c)}>
            <View style={styles.tile}>
              <View style={styles.tileRow}>
                <Text style={styles.tileName}>{c.name}</Text>
                <Text style={styles.tileMono}>•••• {c.last4}</Text>
              </View>
              <View style={styles.tileRow}>
                <Text style={styles.tileMono}>Limit ${c.limit}</Text>
                <Text style={styles.tileMono}>Statement day {c.statementDate}</Text>
              </View>
            </View>
          </Pressable>
        )}
      />

      <Text style={styles.hint}>Long-press a card to delete</Text>

      <FAB onPress={startNew} />

      <FormSheet
        visible={adding}
        title="Add card"
        onClose={() => setAdding(false)}
        onSave={handleSave}
        saving={saving}
        error={error}
      >
        <Field label="Name" value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} />
        <Field
          label="Last 4 digits"
          maxLength={4}
          keyboardType="number-pad"
          value={form.last4}
          onChangeText={(v) => setForm((f) => ({ ...f, last4: v }))}
        />
        <Field
          label="Limit"
          keyboardType="decimal-pad"
          value={form.limit}
          onChangeText={(v) => setForm((f) => ({ ...f, limit: v }))}
        />
        <Field
          label="Statement date (day of month)"
          keyboardType="number-pad"
          value={form.statementDate}
          onChangeText={(v) => setForm((f) => ({ ...f, statementDate: v }))}
        />
      </FormSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  header: { padding: spacing.lg, paddingBottom: spacing.sm },
  title: { color: colors.text, fontSize: font.xl, fontWeight: '800' },
  list: { padding: spacing.lg, paddingTop: spacing.xs, paddingBottom: spacing.xl + 56, gap: spacing.sm },
  empty: { color: colors.textMuted, textAlign: 'center' },
  tile: {
    backgroundColor: '#161B2C',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  tileRow: { flexDirection: 'row', justifyContent: 'space-between' },
  tileName: { color: '#fff', fontWeight: '700', fontSize: font.md },
  tileMono: { color: 'rgba(255,255,255,0.75)', fontSize: font.sm },
  hint: { color: colors.textMuted, fontSize: font.sm, textAlign: 'center', paddingBottom: spacing.sm },
});
