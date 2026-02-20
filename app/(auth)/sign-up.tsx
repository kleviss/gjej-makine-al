import { Link } from 'expo-router';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from '@emotion/native';
import { supabase } from '@/config/supabase';
import { useState } from 'react';
import { useTheme } from '@emotion/react';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
}));

const HeaderArea = styled.View({
  paddingTop: 80,
  paddingBottom: 40,
  alignItems: 'center',
});

const BrandText = styled.Text({
  fontSize: 28,
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 4,
});

const BrandSub = styled.Text({
  fontSize: 14,
  color: 'rgba(255,255,255,0.8)',
});

const FormArea = styled.View({
  flex: 1,
  paddingHorizontal: 24,
  paddingTop: 32,
});

const Heading = styled.Text(({ theme }) => ({
  fontSize: 22,
  fontWeight: '700',
  color: theme.colors.text,
  marginBottom: 24,
}));

const Input = styled.TextInput(({ theme }) => ({
  backgroundColor: theme.colors.surface,
  borderRadius: 12,
  padding: 16,
  marginBottom: 14,
  fontSize: 15,
  color: theme.colors.text,
}));

const PrimaryBtn = styled.TouchableOpacity<{ disabled?: boolean }>(({ theme, disabled }) => ({
  backgroundColor: disabled ? theme.colors.textSecondary : theme.colors.primary,
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 16,
  opacity: disabled ? 0.7 : 1,
}));

const BtnText = styled.Text({
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
});

const LinkText = styled.Text(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.primary,
  fontSize: 14,
  marginBottom: 8,
}));

const MsgText = styled.Text<{ variant?: 'error' | 'success' }>(({ theme, variant }) => ({
  color: variant === 'success' ? theme.colors.textSuccess : theme.colors.textError,
  textAlign: 'center',
  fontSize: 14,
  marginBottom: 14,
}));

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  async function signUp() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setError('Please check your email for verification link');
    setLoading(false);
  }

  return (
    <Container>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <HeaderArea>
          <BrandText>Gjej Makine</BrandText>
          <BrandSub>Find your perfect car in Albania</BrandSub>
        </HeaderArea>
      </LinearGradient>

      <FormArea>
        <Heading>Create Account</Heading>

        {error && (
          <MsgText variant={error.includes('verification') ? 'success' : 'error'}>
            {error}
          </MsgText>
        )}

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholderTextColor={theme.colors.textSecondary}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={theme.colors.textSecondary}
        />

        <PrimaryBtn onPress={signUp} disabled={loading}>
          <BtnText>{loading ? 'Creating account...' : 'Sign Up'}</BtnText>
        </PrimaryBtn>

        <Link href="/sign-in" asChild>
          <LinkText>Already have an account? Sign In</LinkText>
        </Link>
      </FormArea>
    </Container>
  );
}
