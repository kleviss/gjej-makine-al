import { ActivityIndicator, View } from 'react-native';
import { CarCard } from '@/components/CarCard';
import { FlashList } from '@shopify/flash-list';
import styled from '@emotion/native';
import { useAuth } from '@/context/auth';
import { useSavedCars } from '@/services/supabase.api';
import { useTheme } from '@emotion/react';

const StyledContainer = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
}));

const ScrollContent = styled.View({
  padding: 16,
  flexGrow: 1,
});

const PageTitle = styled.Text(({ theme }) => ({
  fontSize: 24,
  fontWeight: 'bold',
  color: theme.colors.text,
  marginBottom: 16,
}));

const EmptyText = styled.Text(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.textSecondary,
  marginTop: 20,
  fontSize: 16,
}));

export default function SavedScreen() {
  const theme = useTheme();
  const { session } = useAuth();
  const userId = session?.user?.id;
  const { data: savedCars, isLoading } = useSavedCars(userId);

  const cars = savedCars
    ?.filter((item) => item.vehicles)
    .map((item) => item.vehicles as any) ?? [];

  return (
    <StyledContainer>
      <ScrollContent>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlashList
            data={cars}
            renderItem={({ item }) => (
              <CarCard
                id={item.id}
                title={item.title}
                price={item.price}
                year={item.year}
                mileage={item.mileage}
                location={item.location}
                images={item.images}
              />
            )}
            estimatedItemSize={200}
            ListHeaderComponent={<PageTitle>Saved Cars</PageTitle>}
            ListEmptyComponent={<EmptyText>No saved cars yet</EmptyText>}
          />
        )}
      </ScrollContent>
    </StyledContainer>
  );
}
