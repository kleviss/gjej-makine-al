import { Link } from 'expo-router';
import { FlatList, ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { CarCard } from '@/components/CarCard';
import { MOCK_VEHICLES } from '@/constants/mock-data';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
}));

const HeroText = styled.Text({
  fontSize: 32,
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 4,
});

const HeroSub = styled.Text({
  fontSize: 16,
  color: 'rgba(255,255,255,0.85)',
});

const SectionTitle = styled.Text(({ theme }) => ({
  fontSize: 20,
  fontWeight: '700',
  color: theme.colors.text,
  marginHorizontal: 16,
  marginTop: 24,
  marginBottom: 12,
}));

const ActionsRow = styled.View({
  flexDirection: 'row',
  paddingHorizontal: 12,
  marginTop: 20,
  gap: 12,
});

const ActionCard = styled(Link)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.surface,
  borderRadius: 14,
  padding: 14,
  alignItems: 'center',
  gap: 12,
  ...theme.shadows.card,
}));

const ActionLabel = styled.Text(({ theme }) => ({
  fontSize: 13,
  fontWeight: '600',
  color: theme.colors.text,
  textAlign: 'center',
}));

export default function HomeScreen() {
  const theme = useTheme();
  const featured = MOCK_VEHICLES.slice(0, 3);

  return (
    <Container>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
        >
          <HeroText>Gjej Makine</HeroText>
          <HeroSub>Find your perfect car in Albania</HeroSub>
        </LinearGradient>

        <ActionsRow>
          <ActionCard href="/search">
            <FontAwesome name="search" size={22} color={theme.colors.primary} />
            <ActionLabel>Find Cars</ActionLabel>
          </ActionCard>
          <ActionCard href="/new-listing">
            <FontAwesome name="plus-circle" size={22} color={theme.colors.primary} />
            <ActionLabel>New Listing</ActionLabel>
          </ActionCard>
          <ActionCard href="/saved">
            <FontAwesome name="heart" size={22} color={theme.colors.primary} />
            <ActionLabel>Saved</ActionLabel>
          </ActionCard>
          <ActionCard href="/help">
            <FontAwesome name="question-circle" size={22} color={theme.colors.primary} />
            <ActionLabel>Help</ActionLabel>
          </ActionCard>
        </ActionsRow>

        <SectionTitle>Featured Cars</SectionTitle>
        <FlatList
          data={featured}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ width: 280 }}>
              <CarCard
                id={item.id}
                title={item.title}
                price={item.price}
                year={item.year}
                mileage={item.mileage}
                location={item.location}
                images={item.images}
              />
            </View>
          )}
        />
      </ScrollView>
    </Container>
  );
}
