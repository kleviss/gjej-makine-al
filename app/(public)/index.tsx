import { View } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

const Container = styled.View({
  flex: 1,
});

const ContentArea = styled.View({
  flex: 1,
  justifyContent: 'flex-end',
  paddingHorizontal: 24,
  paddingBottom: 80,
});

const IconRow = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
  gap: 16,
  marginBottom: 32,
});

const IconCircle = styled.View(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: 'rgba(255,255,255,0.15)',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Title = styled.Text({
  fontSize: 36,
  fontWeight: 'bold',
  color: '#fff',
  textAlign: 'center',
  marginBottom: 8,
});

const Subtitle = styled.Text({
  fontSize: 16,
  color: 'rgba(255,255,255,0.8)',
  textAlign: 'center',
  marginBottom: 40,
});

const PrimaryButton = styled.Pressable({
  backgroundColor: '#fff',
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 12,
});

const PrimaryButtonText = styled.Text(({ theme }) => ({
  fontSize: 16,
  fontWeight: '700',
  color: theme.colors.primary,
}));

const SecondaryButton = styled.Pressable({
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
  borderWidth: 1.5,
  borderColor: 'rgba(255,255,255,0.4)',
});

const SecondaryButtonText = styled.Text({
  fontSize: 15,
  fontWeight: '600',
  color: '#fff',
});

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <Container>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <ContentArea>
          <IconRow>
            <IconCircle><FontAwesome name="car" size={20} color="#fff" /></IconCircle>
            <IconCircle><FontAwesome name="search" size={20} color="#fff" /></IconCircle>
            <IconCircle><FontAwesome name="heart" size={20} color="#fff" /></IconCircle>
          </IconRow>

          <Title>Gjej Makine</Title>
          <Subtitle>Find your perfect car in Albania</Subtitle>

          <Link href="/(auth)/sign-in" asChild>
            <PrimaryButton>
              <PrimaryButtonText>Get Started</PrimaryButtonText>
            </PrimaryButton>
          </Link>

          <Link href="/(auth)/sign-up" asChild>
            <SecondaryButton>
              <SecondaryButtonText>Create Account</SecondaryButtonText>
            </SecondaryButton>
          </Link>
        </ContentArea>
      </LinearGradient>
    </Container>
  );
}
