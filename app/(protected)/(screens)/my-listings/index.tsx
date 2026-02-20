import { Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import styled from '@emotion/native';
import { FlashList } from '@shopify/flash-list';
import { useAuth } from '@/context/auth';
import { useUserVehicles, useDeleteVehicle, useUpdateVehicleStatus } from '@/services/supabase.api';
import type { Vehicle } from '@/types/vehicle';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
}));

const Empty = styled.Text(({ theme }) => ({
  textAlign: 'center',
  marginTop: 40,
  color: theme.colors.textSecondary,
  fontSize: 16,
}));

const Card = styled.Pressable(({ theme }) => ({
  flexDirection: 'row',
  padding: 12,
  marginHorizontal: 16,
  marginTop: 12,
  backgroundColor: theme.colors.surface,
  borderRadius: 12,
  ...theme.shadows.card,
}));

const Thumb = styled.Image({ width: 90, height: 70, borderRadius: 8 });

const Info = styled.View({ flex: 1, marginLeft: 12, justifyContent: 'space-between' });

const Title = styled.Text(({ theme }) => ({
  fontSize: 15,
  fontWeight: '600',
  color: theme.colors.text,
}));

const Price = styled.Text(({ theme }) => ({
  fontSize: 14,
  fontWeight: '600',
  color: theme.colors.primary,
}));

const STATUS_COLORS: Record<string, string> = {
  active: '#008000',
  pending: '#F5A623',
  sold: '#9BA1A6',
  rejected: '#FF0000',
};

const Badge = styled.Text<{ status: string }>(({ status }) => ({
  alignSelf: 'flex-start',
  fontSize: 11,
  fontWeight: '600',
  color: '#fff',
  backgroundColor: STATUS_COLORS[status] ?? '#9BA1A6',
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 10,
  overflow: 'hidden',
  textTransform: 'capitalize',
}));

const Actions = styled.View({ flexDirection: 'row', gap: 8, marginTop: 4 });

const ActionBtn = styled.Pressable<{ variant?: string }>(({ theme, variant }) => ({
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 6,
  backgroundColor: variant === 'danger' ? theme.colors.textError : theme.colors.primary,
}));

const ActionText = styled.Text({ color: '#fff', fontSize: 12, fontWeight: '600' });

export default function MyListingsScreen() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: vehicles, isLoading } = useUserVehicles(userId);
  const { mutate: remove } = useDeleteVehicle();
  const { mutate: updateStatus } = useUpdateVehicleStatus();

  const confirmDelete = (id: string) =>
    Alert.alert('Delete', 'Remove this listing?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(id) },
    ]);

  const markSold = (id: string) =>
    updateStatus({ id, status: 'sold' });

  const renderItem = ({ item }: { item: Vehicle }) => (
    <Card onPress={() => router.push(`/car/${item.id}`)}>
      <Thumb source={{ uri: item.images?.[0] }} />
      <Info>
        <Title numberOfLines={1}>{item.title}</Title>
        <Price>€{item.price.toLocaleString()}</Price>
        <Badge status={item.status}>{item.status}</Badge>
        {item.status === 'active' && (
          <Actions>
            <ActionBtn onPress={() => markSold(item.id)}><ActionText>Mark Sold</ActionText></ActionBtn>
            <ActionBtn variant="danger" onPress={() => confirmDelete(item.id)}><ActionText>Delete</ActionText></ActionBtn>
          </Actions>
        )}
      </Info>
    </Card>
  );

  if (isLoading) return <Container><ActivityIndicator style={{ marginTop: 40 }} /></Container>;

  return (
    <Container>
      <FlashList
        data={vehicles}
        renderItem={renderItem}
        estimatedItemSize={94}
        ListEmptyComponent={<Empty>No listings yet. Create your first one!</Empty>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </Container>
  );
}
