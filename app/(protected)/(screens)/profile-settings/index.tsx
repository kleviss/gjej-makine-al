import { Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import styled from '@emotion/native';
import { useAuth } from '@/context/auth';
import { supabase } from '@/config/supabase';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
}));

const Form = styled.View({ padding: 16, gap: 16 });

const Label = styled.Text(({ theme }) => ({
  fontSize: 14,
  fontWeight: '600',
  color: theme.colors.text,
  marginBottom: 4,
}));

const Input = styled.TextInput(({ theme }) => ({
  borderWidth: 1,
  borderColor: theme.colors.border,
  borderRadius: 8,
  padding: 12,
  fontSize: 16,
  color: theme.colors.text,
  backgroundColor: theme.colors.surface,
}));

const SaveBtn = styled.Pressable(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  padding: 14,
  borderRadius: 8,
  alignItems: 'center',
}));

const SaveText = styled.Text(({ theme }) => ({
  color: theme.colors.textContrast,
  fontSize: 16,
  fontWeight: '600',
}));

const SignOutBtn = styled.Pressable(({ theme }) => ({
  padding: 14,
  borderRadius: 8,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: theme.colors.textError,
  marginBottom: 40,
}));

const SignOutText = styled.Text(({ theme }) => ({
  color: theme.colors.textError,
  fontSize: 16,
  fontWeight: '600',
}));

export default function ProfileSettingsScreen() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    supabase.from('user_profiles').select('display_name, phone').eq('id', userId).single()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name ?? '');
          setPhone(data.phone ?? '');
        }
        setLoading(false);
      });
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('user_profiles')
      .upsert({ id: userId, display_name: displayName, phone });
    setSaving(false);
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Saved', 'Profile updated.');
  };

  const handleSignOut = () =>
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => supabase.auth.signOut() },
    ]);

  if (loading) return <Container><ActivityIndicator style={{ marginTop: 40 }} /></Container>;

  return (
    <Container>
      <ScrollView>
        <Form>
          <Label>Email</Label>
          <Input value={session?.user.email ?? ''} editable={false} />

          <Label>Display Name</Label>
          <Input value={displayName} onChangeText={setDisplayName} placeholder="Your name" />

          <Label>Phone</Label>
          <Input value={phone} onChangeText={setPhone} placeholder="Phone number" keyboardType="phone-pad" />

          <SaveBtn onPress={handleSave} disabled={saving}>
            {saving ? <ActivityIndicator color="white" /> : <SaveText>Save Changes</SaveText>}
          </SaveBtn>

          <SignOutBtn onPress={handleSignOut}>
            <SignOutText>Sign Out</SignOutText>
          </SignOutBtn>
        </Form>
      </ScrollView>
    </Container>
  );
}
