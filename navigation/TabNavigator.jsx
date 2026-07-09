import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CardsScreen from '../screens/CardsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

// Simple emoji icons for now — swap for an icon set (e.g. @expo/vector-icons)
// once the visual pass happens, same as the web sidebar icons.
const ICONS = {
  Dashboard: '\u2302',
  Transactions: '\u21C5',
  Categories: '\u25C9',
  Cards: '\u25A4',
  Profile: '\u25CF',
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>{ICONS[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Cards" component={CardsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
