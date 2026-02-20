import { Link } from 'expo-router';
import { Animated, FlatList, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useRef } from 'react';
import { CarCard } from '@/components/CarCard';
import { MOCK_VEHICLES } from '@/constants/mock-data';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
}));

const SectionTitle = styled.Text(({ theme }) => ({
  fontSize: 20,
  fontWeight: '700',
  color: theme.colors.text,
  marginHorizontal: 16,
  marginTop: 28,
  marginBottom: 12,
}));

const ActionsRow = styled.View({
  flexDirection: 'row',
  paddingHorizontal: 12,
  marginTop: 20,
  gap: 12,
});

const ActionCardInner = styled.Pressable(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.surface,
  borderRadius: 14,
  paddingVertical: 16,
  paddingHorizontal: 8,
  alignItems: 'center',
  justifyContent: 'center',
  ...theme.shadows.card,
}));

const ActionLabel = styled.Text(({ theme }) => ({
  fontSize: 12,
  fontWeight: '600',
  color: theme.colors.text,
  textAlign: 'center',
  marginTop: 8,
}));

const BrandChip = styled.Pressable(({ theme }) => ({
  backgroundColor: theme.colors.surface,
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 20,
  marginRight: 10,
  alignItems: 'center',
}));

const BrandText = styled.Text(({ theme }) => ({
  fontSize: 14,
  fontWeight: '600',
  color: theme.colors.text,
}));

const StatRow = styled.View(({ theme }) => ({
  flexDirection: 'row',
  marginHorizontal: 16,
  gap: 12,
}));

const StatCard = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.surface,
  borderRadius: 14,
  padding: 16,
  alignItems: 'center',
}));

const StatNumber = styled.Text(({ theme }) => ({
  fontSize: 24,
  fontWeight: 'bold',
  color: theme.colors.primary,
}));

const StatLabel = styled.Text(({ theme }) => ({
  fontSize: 12,
  color: theme.colors.textSecondary,
  marginTop: 4,
}));

const HEADER_MAX = 200;
const HEADER_MIN = 70;
const SCROLL_RANGE = HEADER_MAX - HEADER_MIN;

const BRANDS = ['Mercedes', 'BMW', 'Audi', 'VW', 'Toyota', 'Range Rover'];

export default function HomeScreen() {
  const theme = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_RANGE],
    outputRange: [HEADER_MAX, HEADER_MIN],
    extrapolate: 'clamp',
  });

  const subtitleOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_RANGE * 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const logoSize = scrollY.interpolate({
    inputRange: [0, SCROLL_RANGE],
    outputRange: [40, 28],
    extrapolate: 'clamp',
  });

  const titleSize = scrollY.interpolate({
    inputRange: [0, SCROLL_RANGE],
    outputRange: [32, 18],
    extrapolate: 'clamp',
  });

  const featured = MOCK_VEHICLES.slice(0, 3);
  const recent = MOCK_VEHICLES.slice(3, 6);

  return (
    <Container>
      <Animated.ScrollView
        contentContainerStyle={{ paddingTop: HEADER_MAX, paddingBottom: 100 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <ActionsRow>
          <Link href="/search" asChild>
            <ActionCardInner>
              <FontAwesome name="search" size={22} color={theme.colors.primary} />
              <ActionLabel>Find Cars</ActionLabel>
            </ActionCardInner>
          </Link>
          <Link href="/new-listing" asChild>
            <ActionCardInner>
              <FontAwesome name="plus-circle" size={22} color={theme.colors.primary} />
              <ActionLabel>New Listing</ActionLabel>
            </ActionCardInner>
          </Link>
          <Link href="/saved" asChild>
            <ActionCardInner>
              <FontAwesome name="heart" size={22} color={theme.colors.primary} />
              <ActionLabel>Saved</ActionLabel>
            </ActionCardInner>
          </Link>
          <Link href="/help" asChild>
            <ActionCardInner>
              <FontAwesome name="question-circle" size={22} color={theme.colors.primary} />
              <ActionLabel>Help</ActionLabel>
            </ActionCardInner>
          </Link>
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
              <CarCard id={item.id} title={item.title} price={item.price} year={item.year} mileage={item.mileage} location={item.location} images={item.images} />
            </View>
          )}
        />

        <SectionTitle>Popular Brands</SectionTitle>
        <FlatList
          data={BRANDS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Link href="/search" asChild>
              <BrandChip>
                <BrandText>{item}</BrandText>
              </BrandChip>
            </Link>
          )}
        />

        <SectionTitle>Recently Added</SectionTitle>
        <FlatList
          data={recent}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ width: 280 }}>
              <CarCard id={item.id} title={item.title} price={item.price} year={item.year} mileage={item.mileage} location={item.location} images={item.images} />
            </View>
          )}
        />

        <SectionTitle>At a Glance</SectionTitle>
        <StatRow>
          <StatCard>
            <StatNumber>6</StatNumber>
            <StatLabel>Listings</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>5</StatNumber>
            <StatLabel>Cities</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>€28k+</StatNumber>
            <StatLabel>Avg Price</StatLabel>
          </StatCard>
        </StatRow>

        <View style={{ height: 40 }} />
      </Animated.ScrollView>

      <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: headerHeight, zIndex: 10 }}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, paddingTop: 50, paddingHorizontal: 20, justifyContent: 'flex-end', paddingBottom: 12, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
        >
          <Animated.View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Animated.Image
              source={require('../../../assets/images/logo.png')}
              style={{ width: logoSize, height: logoSize, borderRadius: 10 }}
            />
            <Animated.Text style={{ fontSize: titleSize, fontWeight: 'bold', color: '#fff' }}>
              Gjej Makine
            </Animated.Text>
          </Animated.View>
          <Animated.Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', opacity: subtitleOpacity, marginTop: 4 }}>
            Find your perfect car in Albania
          </Animated.Text>
        </LinearGradient>
      </Animated.View>
    </Container>
  );
}
