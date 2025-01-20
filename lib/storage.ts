import * as SecureStore from 'expo-secure-store';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const isServer = typeof window === 'undefined';
const isWeb = Platform.OS === 'web' && !isServer;
const hasLocalStorage = isWeb && typeof localStorage !== 'undefined';

export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (isServer) {
        return null; // Return null during SSR
      }

      if (hasLocalStorage) {
        return localStorage.getItem(key);
      } else if (Platform.OS !== 'web') {
        return await SecureStore.getItemAsync(key);
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      console.log('Error reading from storage:', error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (isServer) return; // Do nothing during SSR

      if (hasLocalStorage) {
        localStorage.setItem(key, value);
      } else if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.log('Error saving to storage:', error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (isServer) return; // Do nothing during SSR

      if (hasLocalStorage) {
        localStorage.removeItem(key);
      } else if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.log('Error removing from storage:', error);
    }
  },
};
