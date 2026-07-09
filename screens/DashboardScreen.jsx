import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getSummary } from '../api/misc';
import { getTransactions } from '../api/transactions';
import { Card } from '../components/Primitives';
import DonutChart from '../components/DonutChart';
import { colors, spacing, font, radius } from '../theme';

const currentMonth = () => new Date().toISOString().slice(0, 7);

const shiftMonth = (month, delta) => {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return d.toISOString().slice(0, 7);
};

const monthLabel = (month) => {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const money = (n) =>
  `$${Number(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [month, setMonth] = useState(currentMonth());
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    return Promise.all([getSummary(month), getTransactions({ limit: 5, sort: '-date' })])
      .then(([s, tx]) => {
        setSummary(s);
        setRecent(tx || []);
      })
      .catch(() => {
        setSummary(null);
        setRecent([]);
      });
  }, [month]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  // Bug fix: balance/income/spent used to only refetch on first mount
  // (or when `month` changed), so adding a transaction on another tab
  // and coming back here showed stale numbers until the whole app was
  // reloaded. Refetching on every focus keeps it current.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const breakdown = summary?.categoryBreakdown || [];

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <View style={styles.headerRow}>
        <View style={styles.flexShrink}>
          <Text style={styles.greeting}>
            {greeting()}, {user?.name?.split(' ')[0] || ''} 👋
          </Text>
          <Text style={styles.subtitle}>Overview for {monthLabel(month)}</Text>
        </View>
      </View>

      <View style={styles.monthPicker}>
        <Pressable style={styles.monthArrow} onPress={() => setMonth((m) => shiftMonth(m, -1))}>
          <Text style={styles.monthArrowText}>‹</Text>
        </Pressable>
        <Text style={styles.monthText}>{monthLabel(month)}</Text>
        <Pressable style={styles.monthArrow} onPress={() => setMonth((m) => shiftMonth(m, 1))}>
          <Text style={styles.monthArrowText}>›</Text>
        </Pressable>
      </View>

      {loading || !summary ? (
        <Text style={styles.loadingText}>Loading…</Text>
      ) : (
        <>
          <View style={styles.statRow}>
            <Card style={styles.statCard}>
              <Text style={styles.statLabel}>Balance</Text>
              <Text style={styles.statValue}>{money(summary.totalBalance)}</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statValue}>{money(summary.totalIncome)}</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statLabel}>Spent</Text>
              <Text style={styles.statValue}>{money(summary.totalSpent)}</Text>
            </Card>
          </View>

          <Pressable style={styles.addIncomeBtn} onPress={() => navigation.navigate('AddIncome')}>
            <Text style={styles.addIncomeBtnText}>+ Add income</Text>
          </Pressable>

          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Spending by category</Text>
            <View style={styles.donutWrap}>
              <DonutChart
                data={breakdown}
                centerLabel={money(summary.totalSpent)}
                centerSub="total spent"
              />
            </View>
            <View style={styles.legend}>
              {breakdown.map((c) => (
                <View key={c.name} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: c.color }]} />
                  <Text style={styles.legendText}>{c.name}</Text>
                </View>
              ))}
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Category breakdown</Text>
            {breakdown.map((c) => {
              const pct = c.limit ? Math.min(100, Math.round((c.spent / c.limit) * 100)) : 0;
              return (
                <View key={c.name} style={styles.categoryRow}>
                  <View style={styles.categoryTop}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: c.color }]} />
                      <Text style={styles.categoryName}>{c.name}</Text>
                    </View>
                    <View style={styles.categoryRight}>
                      <Text style={styles.categoryAmounts}>
                        ${c.spent} / ${c.limit}
                      </Text>
                      <View
                        style={[
                          styles.pctPill,
                          { backgroundColor: pct >= 90 ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)' },
                        ]}
                      >
                        <Text style={{ color: pct >= 90 ? colors.danger : colors.success, fontSize: font.sm, fontWeight: '700' }}>
                          {pct}%
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: c.color }]} />
                  </View>
                </View>
              );
            })}
          </Card>

          <Card style={styles.sectionCard}>
            <View style={styles.recentHeader}>
              <Text style={styles.sectionTitle}>Recent</Text>
              <Text style={styles.viewAll} onPress={() => navigation.navigate('Transactions')}>
                View all →
              </Text>
            </View>
            {recent.length === 0 && <Text style={styles.emptyText}>No transactions yet.</Text>}
            {recent.map((tx) => {
              const cat = breakdown.find((b) => b.name === tx.category);
              const isIncome = tx.type === 'income';
              return (
                <View key={tx.id} style={styles.recentRow}>
                  <View style={[styles.recentIcon, { backgroundColor: cat ? `${cat.color}33` : colors.surfaceAlt }]}>
                    <Text>{isIncome ? '💰' : '🧾'}</Text>
                  </View>
                  <View style={styles.recentBody}>
                    <Text style={styles.recentTitle}>{tx.merchant}</Text>
                    <View style={styles.recentMetaRow}>
                      <View style={[styles.tagPill, { backgroundColor: cat ? `${cat.color}33` : colors.surfaceAlt }]}>
                        <Text style={{ color: cat?.color || colors.textMuted, fontSize: font.sm, fontWeight: '600' }}>
                          {tx.category}
                        </Text>
                      </View>
                      <Text style={styles.recentDate}>
                        {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.recentAmount, { color: isIncome ? colors.success : colors.danger }]}>
                    {isIncome ? '+' : '-'}${tx.amount}
                  </Text>
                </View>
              );
            })}
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  headerRow: { marginBottom: spacing.md },
  flexShrink: { flexShrink: 1 },
  greeting: { color: colors.text, fontSize: font.xl, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: font.md, marginTop: 2 },

  monthPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthArrow: { paddingHorizontal: spacing.md },
  monthArrowText: { color: colors.primary, fontSize: font.lg, fontWeight: '700' },
  monthText: { color: colors.text, fontSize: font.md, fontWeight: '700', minWidth: 150, textAlign: 'center' },

  loadingText: { color: colors.textMuted, fontSize: font.md },

  statRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  addIncomeBtn: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  addIncomeBtnText: { color: colors.success, fontWeight: '700', fontSize: font.md },
  statCard: { flex: 1 },
  statLabel: { color: colors.textMuted, fontSize: font.sm, fontWeight: '600', marginBottom: spacing.xs },
  statValue: { color: colors.text, fontSize: font.lg, fontWeight: '800' },

  sectionCard: { marginBottom: spacing.lg },
  sectionTitle: { color: colors.text, fontSize: font.md, fontWeight: '700', marginBottom: spacing.md },
  donutWrap: { alignItems: 'center', marginBottom: spacing.md },

  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: colors.textMuted, fontSize: font.sm },

  categoryRow: { marginBottom: spacing.md },
  categoryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  categoryName: { color: colors.text, fontSize: font.md, fontWeight: '600' },
  categoryRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  categoryAmounts: { color: colors.textMuted, fontSize: font.sm },
  pctPill: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill },
  progressTrack: { height: 6, backgroundColor: colors.surfaceAlt, borderRadius: radius.pill, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: radius.pill },

  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { color: colors.primary, fontSize: font.sm, fontWeight: '600' },
  emptyText: { color: colors.textMuted, fontSize: font.sm },

  recentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.sm },
  recentIcon: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  recentBody: { flex: 1 },
  recentTitle: { color: colors.text, fontSize: font.md, fontWeight: '600' },
  recentMetaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 2 },
  tagPill: { paddingHorizontal: spacing.xs, paddingVertical: 1, borderRadius: radius.sm },
  recentDate: { color: colors.textMuted, fontSize: font.sm },
  recentAmount: { fontSize: font.md, fontWeight: '700' },
});