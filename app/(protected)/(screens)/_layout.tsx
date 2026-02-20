import { Stack } from 'expo-router';
import { useTheme } from '@emotion/react';

export default function ScreensLayout() {
  const theme = useTheme();
  const headerStyle = { backgroundColor: theme.colors.background };
  const headerTintColor = theme.colors.text;

  return (
    <Stack screenOptions={{ headerStyle, headerTintColor, headerShadowVisible: false }}>
      <Stack.Screen name="car/[id]" options={{ headerTitle: 'Car Details' }} />
      <Stack.Screen name="new-listing/index" options={{ headerTitle: 'New Listing' }} />
      <Stack.Screen name="help/index" options={{ headerTitle: 'Help Center' }} />
      <Stack.Screen name="messages/index" options={{ headerTitle: 'Messages' }} />
      <Stack.Screen name="messages/[id]" options={{ headerTitle: 'Chat' }} />
      <Stack.Screen name="my-listings/index" options={{ headerTitle: 'My Listings' }} />
      <Stack.Screen name="profile-settings/index" options={{ headerTitle: 'Profile' }} />
    </Stack>
  );
}
