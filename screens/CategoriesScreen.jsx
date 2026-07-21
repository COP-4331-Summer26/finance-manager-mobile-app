import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCategories, addCategory, editCategory, deleteCategory } from '../api/misc';
import { useConfirm } from '../context/ConfirmContext';
import { Field, Card } from '../components/Primitives';
import FormSheet from '../components/FormSheet';
import ColorSwatchPicker, { CATEGORY_COLORS } from '../components/ColorSwatchPicker';
import FAB from '../components/FAB';
import { colors, spacing, font } from '../theme';

export default function CategoriesScreen() {
  const confirm = useConfirm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // 'new' | category | null
  const [form, setForm] = useState({ name: '', limit: '', color: CATEGORY_COLORS[0] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    return getCategories().then(setCategories).finally(() => setLoading(false));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const startNew = () => {
    setError('');
    setForm({ name: '', limit: '', color: CATEGORY_COLORS[0] });
    setEditing('new');
  };

  const startEdit = (cat) => {
    setError('');
    setForm({ name: cat.name, limit: String(cat.limit ?? ''), color: cat.color || CATEGORY_COLORS[0] });
    setEditing(cat);
  };

  const handleSave = async () => {
    setError('');
    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!form.limit || Number(form.limit) <= 0) {
      setError('Enter a monthly limit greater than 0.');
      return;
    }
    setSaving(true);
    try {
      const payload = { name: form.name.trim(), limit: Number(form.limit), color: form.color };
      if (editing === 'new') await addCategory(payload);
      else await editCategory(editing.id, payload);
      setEditing(null);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to save category. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editing || editing === 'new') return;
    const target = editing;
    setEditing(null); // close the edit sheet first — RN can't show a second Modal on top of an open one
    await new Promise((r) => setTimeout(r, 300)); // let the sheet finish its close animation
    const ok = await confirm({
      title: 'Delete category?',
      message: `Delete "${target.name}"? Transactions using it will keep the old category name.`,
    });
    if (!ok) return;
    try {
      await deleteCategory(target.id);
      await load();
    } catch (e) {
      console.error('deleteCategory error:', e);
    }
  };

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={!loading && (
          <Card><Text style={styles.empty}>No categories yet. Tap + to add one.</Text></Card>
        )}
        renderItem={({ item: c }) => (
          <Pressable onPress={() => startEdit(c)}>
            <Card style={styles.row}>
              <View style={[styles.dot, { backgroundColor: c.color }]} />
              <Text style={styles.name}>{c.name}</Text>
              <Text style={styles.limit}>${c.limit}/mo</Text>
            </Card>
          </Pressable>
        )}
      />

      <FAB onPress={startNew} />

      <FormSheet
        visible={!!editing}
        title={editing === 'new' ? 'Add category' : 'Edit category'}
        onClose={() => setEditing(null)}
        onSave={handleSave}
        saving={saving}
        error={error}
      >
        <Field label="Name" value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} />
        <Field
          label="Monthly limit"
          keyboardType="decimal-pad"
          value={form.limit}
          onChangeText={(v) => setForm((f) => ({ ...f, limit: v }))}
        />
        <ColorSwatchPicker value={form.color} onChange={(c) => setForm((f) => ({ ...f, color: c }))} />

        {editing !== 'new' && (
          <Pressable onPress={handleDelete} style={styles.deleteBtn} disabled={saving}>
            <Text style={styles.deleteBtnText}>Delete category</Text>
          </Pressable>
        )}
      </FormSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  header: { padding: spacing.lg, paddingBottom: spacing.sm },
  title: { color: colors.text, fontSize: font.xl, fontWeight: '800' },
  list: { padding: spacing.lg, paddingTop: spacing.xs, paddingBottom: spacing.xl + 56, gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 12, height: 12, borderRadius: 6 },
  name: { color: colors.text, fontSize: font.md, fontWeight: '600', flex: 1 },
  limit: { color: colors.textMuted, fontSize: font.sm },
  empty: { color: colors.textMuted, textAlign: 'center' },
  deleteBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 10,
  },
  deleteBtnText: { color: colors.danger, fontSize: font.sm, fontWeight: '700' },
});