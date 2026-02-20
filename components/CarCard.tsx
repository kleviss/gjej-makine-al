import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import styled from '@emotion/native';
import { useAuth } from '@/context/auth';
import { useSavedCars, useToggleSavedCar } from '@/services/supabase.api';

const Card = styled.Pressable(({ theme }) => ({
  backgroundColor: theme.colors.surface,
  borderRadius: 14,
  overflow: 'hidden',
  marginBottom: 16,
  ...theme.shadows.card,
}));

const ImageWrapper = styled.View({
  position: 'relative',
});

const CardImage = styled.Image({
  width: '100%',
  height: 200,
});

const HeartButton = styled.Pressable({
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: 'rgba(0,0,0,0.4)',
  borderRadius: 20,
  width: 36,
  height: 36,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
});

const PriceBadge = styled.View(({ theme }) => ({
  position: 'absolute',
  bottom: 10,
  left: 10,
  backgroundColor: theme.colors.primary,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8,
}));

const PriceText = styled.Text({
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
});

const Content = styled.View({
  padding: 12,
});

const Title = styled.Text(({ theme }) => ({
  fontSize: 16,
  fontWeight: '600',
  color: theme.colors.text,
  marginBottom: 8,
}));

const ChipsRow = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 6,
});

const Chip = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.background,
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
}));

const ChipText = styled.Text(({ theme }) => ({
  fontSize: 12,
  color: theme.colors.textSecondary,
}));

interface CarCardProps {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  location: string;
  imageUrl?: string;
  images?: string[];
}

export function CarCard({ id, title, price, year, mileage, location, imageUrl, images }: CarCardProps) {
  const imageSource = imageUrl || images?.[0];
  const { session } = useAuth();
  const userId = session?.user?.id;
  const { data: savedCars } = useSavedCars(userId);
  const { mutate: toggleSave } = useToggleSavedCar();
  const isSaved = savedCars?.some((item) => item.vehicle_id === id) ?? false;

  return (
    <Link href={`/car/${id}`} asChild>
      <Card>
        <ImageWrapper>
          <CardImage source={{ uri: imageSource }} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)']}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 }}
          />
          {userId && (
            <HeartButton
              onPress={(e) => {
                e.preventDefault();
                toggleSave({ userId, vehicleId: id });
              }}
            >
              <FontAwesome name={isSaved ? 'heart' : 'heart-o'} size={18} color={isSaved ? '#e74c3c' : 'white'} />
            </HeartButton>
          )}
          <PriceBadge>
            <PriceText>€{price.toLocaleString()}</PriceText>
          </PriceBadge>
        </ImageWrapper>
        <Content>
          <Title numberOfLines={1}>{title}</Title>
          <ChipsRow>
            <Chip><ChipText>{year}</ChipText></Chip>
            <Chip><ChipText>{mileage.toLocaleString()} km</ChipText></Chip>
            <Chip><ChipText>{location}</ChipText></Chip>
          </ChipsRow>
        </Content>
      </Card>
    </Link>
  );
}
