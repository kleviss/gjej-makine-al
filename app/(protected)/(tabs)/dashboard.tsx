import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/auth';

export default function DashboardScreen() {
  const { signOut } = useAuth();

  return (
    <ThemedView style={styles.container}>

      <View style={styles.linksContainer}>
        <Link href="/profile" style={styles.link}>
          <ThemedText style={styles.linkText}>👤 Profile Settings</ThemedText>
        </Link>
        <Link href="/my-listings" style={styles.link}>
          <ThemedText style={styles.linkText}>📋 My Listings</ThemedText>
        </Link>

        <Link href="/messages" style={styles.link}>
          <ThemedText style={styles.linkText}>💬 Messages</ThemedText>
        </Link>

        <Link href="/help" style={styles.link}>
          <ThemedText style={styles.linkText}>❓ Help Center</ThemedText>
        </Link>yarn add @react-native-picker/picker@2.9.0

        {/* logout */}
        <TouchableOpacity onPress={signOut}>
          <ThemedText style={styles.linkText}>🚪 Logout</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  linksContainer: {
    width: '100%',
    gap: 15,
  },
  link: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#007AFF',
  },
  linkText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
}); 