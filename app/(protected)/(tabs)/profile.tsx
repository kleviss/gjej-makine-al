import { View } from 'react-native';
import { Link } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import styled from '@emotion/native';
import { useAuth } from '@/context/auth';
import { supabase } from '@/config/supabase';

const Container = styled.ScrollView(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
}));

const AvatarSection = styled.View({
  alignItems: 'center',
  paddingTop: 32,
  paddingBottom: 24,
});

const Avatar = styled.View(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: theme.colors.surface,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 12,
}));

const Email = styled.Text(({ theme }) => ({
  fontSize: 14,
  color: theme.colors.textSecondary,
}));

const MenuSection = styled.View({
  paddingHorizontal: 16,
  gap: 2,
});

const MenuItem = styled(Link)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: theme.colors.surface,
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderRadius: 12,
  marginBottom: 8,
}));

const MenuText = styled.Text(({ theme }) => ({
  flex: 1,
  fontSize: 16,
  color: theme.colors.text,
  marginLeft: 14,
}));

const LogoutButton = styled.Pressable({
  alignItems: 'center',
  paddingVertical: 14,
  marginTop: 24,
  marginHorizontal: 16,
});

const LogoutText = styled.Text(({ theme }) => ({
  fontSize: 15,
  color: theme.colors.textError,
  fontWeight: '500',
}));

const menuItems = [
  { href: '/profile-settings' as const, icon: 'cog' as const, label: 'Profile Settings' },
  { href: '/my-listings' as const, icon: 'list' as const, label: 'My Listings' },
  { href: '/messages' as const, icon: 'envelope' as const, label: 'Messages' },
  { href: '/help' as const, icon: 'question-circle' as const, label: 'Help Center' },
];

export default function ProfileScreen() {
  const { session } = useAuth();
  const email = session?.user?.email ?? 'Guest';

  return (
    <Container contentContainerStyle={{ paddingBottom: 100 }}>
      <AvatarSection>
        <Avatar>
          <FontAwesome name="user" size={36} color="#9BA1A6" />
        </Avatar>
        <Email>{email}</Email>
      </AvatarSection>

      <MenuSection>
        {menuItems.map((item) => (
          <MenuItem key={item.href} href={item.href}>
            <FontAwesome name={item.icon} size={18} color="#9BA1A6" />
            <MenuText>{item.label}</MenuText>
            <FontAwesome name="chevron-right" size={14} color="#9BA1A6" />
          </MenuItem>
        ))}
      </MenuSection>

      <LogoutButton onPress={() => supabase.auth.signOut()}>
        <LogoutText>Log Out</LogoutText>
      </LogoutButton>
    </Container>
  );
}
