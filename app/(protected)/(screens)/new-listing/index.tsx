import { Alert, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import styled from '@emotion/native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/auth';
import { useCreateVehicle, uploadVehicleImage } from '@/services/supabase.api';
import { MAKES, TRANSMISSIONS } from '@/constants/filters';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
}));

const Form = styled.View({ padding: 16, gap: 16 });

const Label = styled.Text(({ theme }) => ({
  fontSize: 14,
  fontWeight: '600',
  color: theme.colors.text,
  marginBottom: 4,
}));

const Input = styled.TextInput(({ theme }) => ({
  borderWidth: 1,
  borderColor: theme.colors.textSecondary,
  borderRadius: 8,
  padding: 12,
  fontSize: 16,
  color: theme.colors.text,
  backgroundColor: theme.colors.background,
}));

const PickerRow = styled.ScrollView({ flexDirection: 'row' });

const Chip = styled.Pressable<{ selected?: boolean }>(({ theme, selected }) => ({
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: selected ? theme.colors.primary : theme.colors.textSecondary,
  backgroundColor: selected ? theme.colors.primary : 'transparent',
  marginRight: 8,
}));

const ChipText = styled.Text<{ selected?: boolean }>(({ theme, selected }) => ({
  color: selected ? theme.colors.textContrast : theme.colors.text,
  fontSize: 14,
}));

const ImageRow = styled.View({ flexDirection: 'row', flexWrap: 'wrap', gap: 8 });

const Thumb = styled.Image({ width: 80, height: 80, borderRadius: 8 });

const AddImageBtn = styled.Pressable(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: theme.colors.textSecondary,
  borderStyle: 'dashed',
  alignItems: 'center',
  justifyContent: 'center',
}));

const AddImageText = styled.Text(({ theme }) => ({
  fontSize: 24,
  color: theme.colors.textSecondary,
}));

const SubmitBtn = styled.Pressable(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  padding: 16,
  borderRadius: 8,
  alignItems: 'center',
  marginBottom: 40,
}));

const SubmitText = styled.Text(({ theme }) => ({
  color: theme.colors.textContrast,
  fontSize: 16,
  fontWeight: '600',
}));

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG'];
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

export default function NewListingScreen() {
  const { session } = useAuth();
  const { mutateAsync: create, isPending } = useCreateVehicle();
  const [title, setTitle] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | null>(null);
  const [price, setPrice] = useState('');
  const [mileage, setMileage] = useState('');
  const [transmission, setTransmission] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImages(prev => [...prev, ...result.assets.map(a => a.uri)]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !make || !model || !year || !price) {
      Alert.alert('Missing fields', 'Please fill in title, make, model, year, and price.');
      return;
    }
    try {
      const userId = session!.user.id;
      const uploadedUrls = await Promise.all(images.map(uri => uploadVehicleImage(userId, uri)));
      await create({
        user_id: userId,
        title, make, model, year,
        price: Number(price),
        mileage: Number(mileage) || 0,
        transmission: transmission.toLowerCase(),
        fuel_type: fuelType.toLowerCase(),
        description, location,
        features: [],
        images: uploadedUrls,
        status: 'pending',
      });
      Alert.alert('Success', 'Your listing has been submitted for review.');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <Container>
      <ScrollView>
        <Form>
          <Label>Title</Label>
          <Input value={title} onChangeText={setTitle} placeholder="e.g. 2020 BMW X5" />

          <Label>Make</Label>
          <PickerRow horizontal showsHorizontalScrollIndicator={false}>
            {MAKES.map(m => (
              <Chip key={m} selected={make === m} onPress={() => setMake(m)}>
                <ChipText selected={make === m}>{m}</ChipText>
              </Chip>
            ))}
          </PickerRow>

          <Label>Model</Label>
          <Input value={model} onChangeText={setModel} placeholder="e.g. X5" />

          <Label>Year</Label>
          <PickerRow horizontal showsHorizontalScrollIndicator={false}>
            {YEARS.slice(0, 15).map(y => (
              <Chip key={y} selected={year === y} onPress={() => setYear(y)}>
                <ChipText selected={year === y}>{y}</ChipText>
              </Chip>
            ))}
          </PickerRow>

          <Label>Price (EUR)</Label>
          <Input value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="15000" />

          <Label>Mileage (km)</Label>
          <Input value={mileage} onChangeText={setMileage} keyboardType="numeric" placeholder="50000" />

          <Label>Transmission</Label>
          <PickerRow horizontal>
            {TRANSMISSIONS.map(t => (
              <Chip key={t} selected={transmission === t} onPress={() => setTransmission(t)}>
                <ChipText selected={transmission === t}>{t}</ChipText>
              </Chip>
            ))}
          </PickerRow>

          <Label>Fuel Type</Label>
          <PickerRow horizontal>
            {FUEL_TYPES.map(f => (
              <Chip key={f} selected={fuelType === f} onPress={() => setFuelType(f)}>
                <ChipText selected={fuelType === f}>{f}</ChipText>
              </Chip>
            ))}
          </PickerRow>

          <Label>Description</Label>
          <Input value={description} onChangeText={setDescription} multiline numberOfLines={4} style={{ minHeight: 100, textAlignVertical: 'top' }} />

          <Label>Location</Label>
          <Input value={location} onChangeText={setLocation} placeholder="e.g. Tirana" />

          <Label>Photos</Label>
          <ImageRow>
            {images.map((uri, i) => <Thumb key={i} source={{ uri }} />)}
            <AddImageBtn onPress={pickImages}><AddImageText>+</AddImageText></AddImageBtn>
          </ImageRow>

          <SubmitBtn onPress={handleSubmit} disabled={isPending}>
            {isPending ? <ActivityIndicator color="white" /> : <SubmitText>Submit Listing</SubmitText>}
          </SubmitBtn>
        </Form>
      </ScrollView>
    </Container>
  );
}
