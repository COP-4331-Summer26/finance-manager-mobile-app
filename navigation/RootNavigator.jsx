import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { colors } from '../theme';

export default function RootNavigator() {
  const { user, bootstrapped } = useAuth();

  // Splash: while we check AsyncStorage for a stored session
  if (!bootstrapped) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <NavigationContainer>{user ? <MainStack /> : <AuthStack />}</NavigationContainer>;
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
});
