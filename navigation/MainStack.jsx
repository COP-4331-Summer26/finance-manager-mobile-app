import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import AddIncomeScreen from '../screens/AddIncomeScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen
        name="AddIncome"
        component={AddIncomeScreen}
        options={{
          headerShown: true,
          title: 'Add income',
          presentation: 'modal',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />
    </Stack.Navigator>
  );
}
