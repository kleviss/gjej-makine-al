import { Redirect } from 'expo-router';
import { Stack } from 'expo-router';
import { useAuth } from '../../context/auth';

export default function ProtectedLayout() {
  const { session, demoMode } = useAuth();

  // Redirect to sign in if not authenticated and not in demo mode
  if (!session && !demoMode) {
    return <Redirect href="/(public)" />;
  }


  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(screens)" options={{ headerShown: false }} />
    </Stack>
  );
}