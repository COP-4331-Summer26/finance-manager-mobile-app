import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { ConfirmProvider } from './context/ConfirmContext';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ConfirmProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </ConfirmProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}