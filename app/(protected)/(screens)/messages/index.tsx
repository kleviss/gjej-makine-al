import { FlatList, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useAuth } from '@/context/auth';
import { useConversations } from '@/services/supabase.api';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
}));

const Row = styled.Pressable(({ theme }) => ({
  flexDirection: 'row',
  padding: 16,
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.textSecondary + '33',
  alignItems: 'center',
}));

const Info = styled.View({ flex: 1 });

const Name = styled.Text(({ theme }) => ({
  fontSize: 16,
  fontWeight: '600',
  color: theme.colors.text,
}));

const VehicleTitle = styled.Text(({ theme }) => ({
  fontSize: 13,
  color: theme.colors.primary,
  marginTop: 2,
}));

const Preview = styled.Text(({ theme }) => ({
  fontSize: 14,
  color: theme.colors.textSecondary,
  marginTop: 4,
}));

const Badge = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  borderRadius: 12,
  minWidth: 24,
  height: 24,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 8,
}));

const BadgeText = styled.Text(({ theme }) => ({
  color: theme.colors.textContrast,
  fontSize: 12,
  fontWeight: '700',
}));

const Empty = styled.Text(({ theme }) => ({
  textAlign: 'center',
  marginTop: 40,
  fontSize: 16,
  color: theme.colors.textSecondary,
}));

export default function MessagesScreen() {
  const theme = useTheme();
  const { session } = useAuth();
  const userId = session?.user?.id;
  const { data: conversations, isLoading } = useConversations(userId);

  if (isLoading) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Empty>No conversations yet</Empty>}
        renderItem={({ item }) => {
          const isBuyer = item.buyer_id === userId;
          const otherName = isBuyer
            ? (item.seller as any)?.display_name ?? 'Seller'
            : (item.buyer as any)?.display_name ?? 'Buyer';
          const lastMsg = item.messages?.[0];
          const unread = item.messages?.filter(
            (m: any) => !m.read && m.sender_id !== userId
          ).length ?? 0;

          return (
            <Row onPress={() => router.push(`/(protected)/(screens)/messages/${item.id}`)}>
              <Info>
                <Name>{otherName}</Name>
                <VehicleTitle>{(item.vehicles as any)?.title}</VehicleTitle>
                {lastMsg && (
                  <Preview numberOfLines={1}>{lastMsg.content}</Preview>
                )}
              </Info>
              {unread > 0 && (
                <Badge>
                  <BadgeText>{unread}</BadgeText>
                </Badge>
              )}
            </Row>
          );
        }}
      />
    </Container>
  );
}
