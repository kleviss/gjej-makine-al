import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '@/context/auth';
import { useVehicle, useSavedCars, useToggleSavedCar, getOrCreateConversation } from '@/services/supabase.api';
import { MOCK_VEHICLES } from '@/constants/mock-data';

const StyledContainer = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
}));

const BackButton = styled.Pressable({
  position: 'absolute',
  top: 66,
  left: 16,
  backgroundColor: 'black',
  padding: 10,
  borderRadius: 10,
  zIndex: 1000,
});

const ImageContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.background,
  borderRadius: 12,
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: theme.colors.textSecondary,
}));

const MainImage = styled.Image({
  width: '100%',
  height: 300,
});

const ThumbnailContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  padding: 8,
  gap: 8,
  borderRadius: 12,
  backgroundColor: theme.colors.background,
}));

const ThumbnailWrapper = styled.Pressable<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  borderRadius: 8,
  overflow: 'hidden',
  borderWidth: 4,
  borderColor: isSelected ? theme.colors.border : 'transparent',
  backgroundColor: theme.colors.background,
}));

const StyledThumbnail = styled.Image<{ isSelected?: boolean }>(({ isSelected }) => ({
  width: 60,
  height: 60,
  borderRadius: 6,
  opacity: isSelected ? 1 : 0.8,
}));

const Thumbnail = ({ uri, isSelected }: { uri: string; isSelected?: boolean }) => (
  <StyledThumbnail
    source={{ uri }}
    isSelected={isSelected}
    resizeMode="cover"
  />
);

const Content = styled.View({
  padding: 16,
});

const Title = styled.Text(({ theme }) => ({
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 8,
  color: theme.colors.text,
  lineHeight: 32,
  flex: 1,
}));

const TitleRow = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
});

const SaveButton = styled.Pressable({
  padding: 8,
});

const Price = styled.Text(({ theme }) => ({
  fontSize: 28,
  fontWeight: 'bold',
  color: theme.colors.primary,
  marginBottom: 16,
  lineHeight: 36,
}));

const SpecsContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 16,
  backgroundColor: theme.colors.background,
  padding: 16,
  borderRadius: 12,
  marginBottom: 24,
  borderWidth: 1,
  borderColor: theme.colors.textSecondary,
}));

const SpecItem = styled.View({
  flex: 1,
  minWidth: '45%',
});

const SpecLabel = styled.Text(({ theme }) => ({
  fontSize: 14,
  color: theme.colors.textSecondary,
  marginBottom: 4,
}));

const SpecValue = styled.Text(({ theme }) => ({
  fontSize: 16,
  fontWeight: '600',
  color: theme.colors.text,
}));

const Section = styled.View({
  marginBottom: 24,
});

const SectionTitle = styled.Text(({ theme }) => ({
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 12,
  color: theme.colors.text,
}));

const Description = styled.Text(({ theme }) => ({
  fontSize: 16,
  lineHeight: 24,
  color: theme.colors.text,
}));

const FeaturesList = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
});

const FeatureItem = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.background,
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: theme.colors.textSecondary,
}));

const FeatureText = styled.Text(({ theme }) => ({
  fontSize: 14,
  color: theme.colors.text,
}));

const SellerContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.background,
  padding: 16,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: theme.colors.textSecondary,
}));

const SellerName = styled.Text(({ theme }) => ({
  fontSize: 18,
  fontWeight: '600',
  marginBottom: 4,
  color: theme.colors.text,
}));

const SellerRating = styled.Text(({ theme }) => ({
  fontSize: 16,
  color: theme.colors.textSecondary,
  marginBottom: 16,
}));

const ContactButton = styled.Pressable(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  padding: 16,
  borderRadius: 8,
  alignItems: 'center',
}));

const ContactButtonText = styled.Text({
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
});

const trimTitle = (title: string) => {
  const [make, model] = title.split(' ').slice(0, 2);
  return `${make} ${model}`;
};

export default function CarDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { data: car, isLoading, error } = useVehicle(id as string);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const theme = useTheme();
  const { session } = useAuth();
  const userId = session?.user?.id;
  const { data: savedCars } = useSavedCars(userId);
  const { mutate: toggleSave } = useToggleSavedCar();
  const isSaved = savedCars?.some((item) => item.vehicle_id === (id as string)) ?? false;
  const displayCar = car ?? MOCK_VEHICLES.find(c => c.id === (id as string)) ?? null;
  const isMock = displayCar?.user_id === 'mock';

  const handleContact = async () => {
    if (!userId || !displayCar || isMock) return;
    if (userId === displayCar.user_id) {
      Alert.alert('', 'You cannot message yourself.');
      return;
    }
    try {
      const conversationId = await getOrCreateConversation(id as string, userId, displayCar.user_id);
      router.push(`/(protected)/(screens)/messages/${conversationId}`);
    } catch {
      Alert.alert('Error', 'Could not start conversation.');
    }
  };

  if (isLoading) {
    return (
      <StyledContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </StyledContainer>
    );
  }

  if (!isLoading && !displayCar) {
    return (
      <StyledContainer>
        <Title>Car not found</Title>
      </StyledContainer>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: trimTitle(displayCar.title),
          headerBackTitle: 'Search',
        }}
      />
      <StyledContainer>
        <BackButton onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={14} color="white" />
        </BackButton>
        <ScrollView>
          <ImageContainer>
            <MainImage
              source={{ uri: displayCar.images[selectedImageIndex] }}
              resizeMode="cover"
            />
            <ThumbnailContainer>
              {displayCar.images.map((image: string, index: number) => (
                <ThumbnailWrapper
                  key={index}
                  isSelected={selectedImageIndex === index}
                  onPress={() => setSelectedImageIndex(index)}
                >
                  <Thumbnail
                    uri={image}
                    isSelected={selectedImageIndex === index}
                  />
                </ThumbnailWrapper>
              ))}
            </ThumbnailContainer>
          </ImageContainer>

          <Content>
            <TitleRow>
              <Title>{displayCar.title}</Title>
              {userId && !isMock && (
                <SaveButton onPress={() => toggleSave({ userId, vehicleId: id as string })}>
                  <FontAwesome name={isSaved ? 'heart' : 'heart-o'} size={24} color={isSaved ? '#e74c3c' : theme.colors.textSecondary} />
                </SaveButton>
              )}
            </TitleRow>
            <Price>{displayCar.price.toLocaleString()}</Price>

            <SpecsContainer>
              <SpecItem>
                <SpecLabel>Year</SpecLabel>
                <SpecValue>{displayCar.year}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Mileage</SpecLabel>
                <SpecValue>{displayCar.mileage.toLocaleString()} km</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Transmission</SpecLabel>
                <SpecValue>{displayCar.transmission}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Fuel Type</SpecLabel>
                <SpecValue>{displayCar.fuel_type}</SpecValue>
              </SpecItem>
            </SpecsContainer>

            <Section>
              <SectionTitle>Description</SectionTitle>
              <Description>{displayCar.description}</Description>
            </Section>

            <Section>
              <SectionTitle>Features</SectionTitle>
              <FeaturesList>
                {displayCar.features.map((feature: string, index: number) => (
                  <FeatureItem key={index}>
                    <FeatureText>{feature}</FeatureText>
                  </FeatureItem>
                ))}
              </FeaturesList>
            </Section>

            {!isMock && (
              <ContactButton onPress={handleContact}>
                <ContactButtonText>Contact Seller</ContactButtonText>
              </ContactButton>
            )}
          </Content>
        </ScrollView>
      </StyledContainer>
    </>
  );
}
